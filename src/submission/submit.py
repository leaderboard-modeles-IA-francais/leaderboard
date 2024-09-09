import json
import os
import gradio as gr
from datetime import datetime, timezone

from dataclasses import dataclass
from transformers import AutoConfig

from src.display.formatting import styled_error, styled_message, styled_warning
from src.envs import (
    API,
    EVAL_REQUESTS_PATH,
    HF_TOKEN,
    QUEUE_REPO,
    RATE_LIMIT_PERIOD,
    RATE_LIMIT_QUOTA,
    VOTES_REPO,
    VOTES_PATH,
)
from src.leaderboard.filter_models import DO_NOT_SUBMIT_MODELS
from src.submission.check_validity import (
    already_submitted_models,
    check_model_card,
    get_model_size,
    is_model_on_hub,
    user_submission_permission,
)

from src.voting.vote_system import VoteManager

REQUESTED_MODELS = None
USERS_TO_SUBMISSION_DATES = None

vote_manager = VoteManager(VOTES_PATH, EVAL_REQUESTS_PATH, VOTES_REPO)

@dataclass
class ModelSizeChecker:
    model: str
    precision: str
    model_size_in_b: float

    def get_precision_factor(self):
        if self.precision in ["float16", "bfloat16"]:
            return 1
        elif self.precision == "8bit":
            return 2
        elif self.precision == "4bit":
            return 4
        elif self.precision == "GPTQ":
            config = AutoConfig.from_pretrained(self.model)
            num_bits = int(config.quantization_config["bits"])
            bits_to_precision_factor = {2: 8, 3: 6, 4: 4, 8: 2}
            return bits_to_precision_factor.get(num_bits, 1)
        else:
            raise Exception(f"Unknown precision {self.precision}.")

    def can_evaluate(self):
        precision_factor = self.get_precision_factor()
        return self.model_size_in_b <= 140 * precision_factor

def add_new_eval(
    model: str,
    base_model: str,
    revision: str,
    precision: str,
    weight_type: str,
    model_type: str,
    use_chat_template: bool,
    profile: gr.OAuthProfile | None,
    requested_models: set[str] = None,
    users_to_submission_dates: dict[str, list[str]] = None,
):
    # Login required
    if profile is None:
        return styled_error("Hub Login Required")

    # Name of the actual user who sent the request
    username = profile.username

    # Initialize the requested_models and users_to_submission_dates variables
    # If the caller did not provide these values, fetch them from the EVAL_REQUESTS_PATH
    if requested_models is None or users_to_submission_dates is None:
        requested_models, users_to_submission_dates = already_submitted_models(EVAL_REQUESTS_PATH)

    org_or_user = ""
    model_path = model
    if "/" in model:
        org_or_user = model.split("/")[0]
        model_path = model.split("/")[1]

    precision = precision.split(" ")[0]
    current_time = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    if model_type is None or model_type == "":
        return styled_error("Please select a model type.")

    # Is the user rate limited?
    if org_or_user != "":
        user_can_submit, error_msg = user_submission_permission(
            org_or_user, users_to_submission_dates, RATE_LIMIT_PERIOD, RATE_LIMIT_QUOTA
        )
        if not user_can_submit:
            return styled_error(error_msg)

    # Did the model authors forbid its submission to the leaderboard?
    if model in DO_NOT_SUBMIT_MODELS or base_model in DO_NOT_SUBMIT_MODELS:
        return styled_warning("Model authors have requested that their model be not submitted on the leaderboard.")

    # Does the model actually exist?
    if revision == "":
        revision = "main"
    try:
        model_info = API.model_info(repo_id=model, revision=revision)
    except Exception as e:
        return styled_error("Could not get your model information. Please fill it up properly.")
    
    model_key = f"{model}_{model_info.sha}_{precision}"
    if model_key in requested_models:
        return styled_error(f"The model '{model}' with revision '{model_info.sha}' and precision '{precision}' has already been submitted.")

    # Check model size early
    model_size = get_model_size(model_info=model_info, precision=precision)
    # First check: Absolute size limit for float16 and bfloat16
    if precision in ["float16", "bfloat16"] and model_size > 100:
        return styled_error(f"Sadly, models larger than 100B parameters cannot be submitted in {precision} precision at this time. "
                            f"Your model size: {model_size:.2f}B parameters.")
    
    # Second check: Precision-adjusted size limit for 8bit, 4bit, and GPTQ
    if precision in ["8bit", "4bit", "GPTQ"]:
        size_checker = ModelSizeChecker(model=model, precision=precision, model_size_in_b=model_size)
        
        if not size_checker.can_evaluate():
            precision_factor = size_checker.get_precision_factor()
            max_size = 140 * precision_factor
            return styled_error(f"Sadly, models this big ({model_size:.2f}B parameters) cannot be evaluated automatically "
                                f"at the moment on our cluster. The maximum size for {precision} precision is {max_size:.2f}B parameters.")

    architecture = "?"
    # Is the model on the hub?
    if weight_type in ["Delta", "Adapter"]:
        base_model_on_hub, error, _ = is_model_on_hub(
            model_name=base_model, revision="main", token=HF_TOKEN, test_tokenizer=True
        )
        if not base_model_on_hub:
            return styled_error(f'Base model "{base_model}" {error}')
    if not weight_type == "Adapter":
        model_on_hub, error, model_config = is_model_on_hub(model_name=model, revision=model_info.sha, test_tokenizer=True)
        if not model_on_hub or model_config is None:
            return styled_error(f'Model "{model}" {error}')
        if model_config is not None:
            architectures = getattr(model_config, "architectures", None)
            if architectures:
                architecture = ";".join(architectures)
    # Were the model card and license filled?
    try:
        model_info.cardData["license"]
    except Exception:
        return styled_error("Please select a license for your model")

    modelcard_OK, error_msg, model_card = check_model_card(model)
    if not modelcard_OK:
        return styled_error(error_msg)

    # Seems good, creating the eval
    print("Adding new eval")
    eval_entry = {
        "model": model,
        "base_model": base_model,
        "revision": model_info.sha, # force to use the exact model commit 
        "precision": precision,
        "params": model_size,
        "architectures": architecture,
        "weight_type": weight_type,
        "status": "PENDING",
        "submitted_time": current_time,
        "model_type": model_type,
        "job_id": -1,
        "job_start_time": None,
        "use_chat_template": use_chat_template,
        "sender": username
    }

    print("Creating eval file")
    OUT_DIR = f"{EVAL_REQUESTS_PATH}/{org_or_user}"
    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = f"{OUT_DIR}/{model_path}_eval_request_False_{precision}_{weight_type}.json"

    with open(out_path, "w") as f:
        f.write(json.dumps(eval_entry))

    print("Uploading eval file")
    print(eval_entry)
    API.upload_file(
        path_or_fileobj=out_path,
        path_in_repo=out_path.split("eval-queue/")[1],
        repo_id=QUEUE_REPO,
        repo_type="dataset",
        commit_message=f"Add {model} to eval queue",
    )

    # Remove the local file
    os.remove(out_path)

    # Always add a vote for the submitted model
    vote_manager.add_vote(
        selected_model=model,
        pending_models_df=None,
        profile=profile
    )
    print(f"Automatically added a vote for {model} submitted by {username}")

    # Upload votes to the repository
    vote_manager.upload_votes()

    return styled_message(
        "Your request and vote has been submitted to the evaluation queue!\nPlease wait for up to an hour for the model to show in the PENDING list."
    )