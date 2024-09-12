import json
import os
import re
import logging
from collections import defaultdict
from datetime import datetime, timedelta, timezone

import huggingface_hub
from huggingface_hub import ModelCard
from huggingface_hub.hf_api import ModelInfo, get_safetensors_metadata, parse_safetensors_file_metadata
from transformers import AutoConfig, AutoTokenizer

from src.display.utils import parse_iso8601_datetime, curated_authors
from src.envs import HAS_HIGHER_RATE_LIMIT


# ht to @Wauplin, thank you for the snippet!
# See https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard/discussions/317
def check_model_card(repo_id: str) -> tuple[bool, str]:
    # Returns operation status, and error message
    try:
        card = ModelCard.load(repo_id)
    except huggingface_hub.utils.EntryNotFoundError:
        return False, "Please add a model card to your model to explain how you trained/fine-tuned it.", None

    # Enforce license metadata
    if card.data.license is None and not ("license_name" in card.data and "license_link" in card.data):
        return (
            False,
            (
                "License not found. Please add a license to your model card using the `license` metadata or a"
                " `license_name`/`license_link` pair."
            ),
            None,
        )

    # Enforce card content
    if len(card.text) < 200:
        return False, "Please add a description to your model card, it is too short.", None

    return True, "", card


def is_model_on_hub(
    model_name: str, revision: str, token: str | None = None, trust_remote_code: bool = False, test_tokenizer: bool = False,
) -> tuple[bool, str, AutoConfig]:
    try:
        config = AutoConfig.from_pretrained(
            model_name, revision=revision, trust_remote_code=trust_remote_code, token=token, force_download=True)
        if test_tokenizer:
            try:
                AutoTokenizer.from_pretrained(
                    model_name, revision=revision, trust_remote_code=trust_remote_code, token=token,
                )
            except ValueError as e:
                return (False, f"uses a tokenizer which is not in a transformers release: {e}", None)
            except Exception:
                return (
                    False,
                    "'s tokenizer cannot be loaded. Is your tokenizer class in a stable transformers release, and correctly configured?",
                    None,
                )
            except Exception:
                return (
                    False,
                    "'s tokenizer cannot be loaded. Is your tokenizer class in a stable transformers release, and correctly configured?",
                    None,
                )
        return True, None, config

    except ValueError:
        return (
            False,
            "needs to be launched with `trust_remote_code=True`. For safety reason, we do not allow these models to be automatically submitted to the leaderboard.",
            None,
        )

    except Exception as e:
        if "You are trying to access a gated repo." in str(e):
            return True, "uses a gated model.", None
        return False, f"was not found or misconfigured on the hub! Error raised was {e.args[0]}", None


def get_model_size(model_info: ModelInfo, precision: str, base_model: str| None) -> tuple[float | None, str]:
    size_pattern = re.compile(r"(\d+\.)?\d+(b|m)")
    safetensors = None
    adapter_safetensors = None
    # hack way to check that model is adapter
    is_adapter = "adapter_config.json" in (s.rfilename for s in model_info.siblings)

    try:
        if is_adapter:
            if not base_model:
                return None, "Adapter model submission detected. Please ensure the base model information is provided."

            adapter_safetensors = parse_safetensors_file_metadata(model_info.id, "adapter_model.safetensors")
            safetensors = get_safetensors_metadata(base_model)
        else:
            safetensors = get_safetensors_metadata(model_info.id)
    except Exception as e:
        logging.warning(f"Failed to get safetensors metadata for model {model_info.id}: {e!s}")

    if safetensors is not None:
        model_size = sum(safetensors.parameter_count.values())
        if adapter_safetensors is not None:
            model_size += sum(safetensors.parameter_count.values())
        model_size = round(model_size / 1e9, 3)
    else:
        try:
            size_match = re.search(size_pattern, model_info.id.lower())
            if size_match:
                model_size = size_match.group(0)
                model_size = round(float(model_size[:-1]) if model_size[-1] == "b" else float(model_size[:-1]) / 1e3, 3)
            else:
                return None, "Unknown model size"
        except AttributeError:
            logging.warning(f"Unable to parse model size from ID: {model_info.id}")
            return None, "Unknown model size"

    size_factor = 8 if (precision == "GPTQ" or "gptq" in model_info.id.lower()) else 1
    model_size = size_factor * model_size

    return model_size, ""

def get_model_arch(model_info: ModelInfo):
    return model_info.config.get("architectures", "Unknown")


def user_submission_permission(org_or_user, users_to_submission_dates, rate_limit_period, rate_limit_quota):
    # No limit for curated authors
    if org_or_user in curated_authors:
        return True, ""
    # Increase quota first if user has higher limits
    if org_or_user in HAS_HIGHER_RATE_LIMIT:
        rate_limit_quota *= 2

    if org_or_user not in users_to_submission_dates:
        return True, ""

    submission_dates = sorted(users_to_submission_dates[org_or_user])
    time_limit = datetime.now(timezone.utc) - timedelta(days=rate_limit_period)

    submissions_after_timelimit = [
        parse_iso8601_datetime(d) for d in submission_dates
        if parse_iso8601_datetime(d) > time_limit
    ]

    num_models_submitted_in_period = len(submissions_after_timelimit)

    # Use >= to correctly enforce the rate limit
    if num_models_submitted_in_period >= rate_limit_quota:
        error_msg = f"Organisation or user `{org_or_user}` already has {num_models_submitted_in_period} model requests submitted in the last {rate_limit_period} days.\n"
        error_msg += "Please wait a couple of days before resubmitting, so that everybody can enjoy using the leaderboard 🤗"
        return False, error_msg

    return True, ""


def already_submitted_models(requested_models_dir: str) -> set[str]:
    depth = 1
    file_names = []
    users_to_submission_dates = defaultdict(list)

    for root, _, files in os.walk(requested_models_dir):
        current_depth = root.count(os.sep) - requested_models_dir.count(os.sep)
        if current_depth == depth:
            for file in files:
                if not file.endswith(".json"):
                    continue
                with open(os.path.join(root, file), "r") as f:
                    info = json.load(f)
                    file_names.append(f"{info['model']}_{info['revision']}_{info['precision']}")

                    # Select organisation
                    if info["model"].count("/") == 0 or "submitted_time" not in info:
                        continue
                    organisation, _ = info["model"].split("/")
                    users_to_submission_dates[organisation].append(info["submitted_time"])

    return set(file_names), users_to_submission_dates


def get_model_tags(model_card, model: str):
    is_merge_from_metadata = False
    is_moe_from_metadata = False

    tags = []
    if model_card is None:
        return tags
    if model_card.data.tags:
        is_merge_from_metadata = any(
            [tag in model_card.data.tags for tag in ["merge", "moerge", "mergekit", "lazymergekit"]]
        )
        is_moe_from_metadata = any([tag in model_card.data.tags for tag in ["moe", "moerge"]])

    is_merge_from_model_card = any(
        keyword in model_card.text.lower() for keyword in ["merged model", "merge model", "moerge"]
    )
    if is_merge_from_model_card or is_merge_from_metadata:
        tags.append("merge")
    is_moe_from_model_card = any(keyword in model_card.text.lower() for keyword in ["moe", "mixtral"])
    # Hardcoding because of gating problem
    if "Qwen/Qwen1.5-32B" in model:
        is_moe_from_model_card = False
    is_moe_from_name = "moe" in model.lower().replace("/", "-").replace("_", "-").split("-")
    if is_moe_from_model_card or is_moe_from_name or is_moe_from_metadata:
        tags.append("moe")

    return tags
