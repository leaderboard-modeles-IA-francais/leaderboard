from huggingface_hub import ModelFilter, snapshot_download
from huggingface_hub import ModelCard

import json
import time
from src.submission.check_validity import is_model_on_hub, check_model_card
from src.envs import DYNAMIC_INFO_REPO, DYNAMIC_INFO_PATH, DYNAMIC_INFO_FILE_PATH, API, H4_TOKEN

def update_models(file_path, models):
    """
    Search through all JSON files in the specified root folder and its subfolders,
    and update the likes key in JSON dict from value of input dict
    """
    with open(file_path, "r") as f:
        model_infos = json.load(f)
        for model_id, data in model_infos.items():
            if model_id not in models:
                data['still_on_hub'] = False
                data['likes'] = 0
                data['downloads'] = 0
                data['created_at'] = None
                continue

            model_cfg = models[model_id]
            data['likes'] = model_cfg.likes
            data['downloads'] = model_cfg.downloads
            data['created_at'] = model_cfg.created_at
            #data['params'] = get_model_size(model_cfg, data['precision'])
            data['license'] = model_cfg.card_data.license if model_cfg.card_data is not None else ""

            # Is the model still on the hub
            still_on_hub, error, model_config = is_model_on_hub(
                model_name=model_id, revision=data.get("revision"), trust_remote_code=True, test_tokenizer=False, token=H4_TOKEN
            )
            # If the model doesn't have a model card or a license, we consider it's deleted
            if still_on_hub:
                try:
                    if check_model_card(model_id)[0] is False:
                        still_on_hub = False
                except Exception:
                    still_on_hub = False
            data['still_on_hub'] = still_on_hub

            #  Check if the model is a merge
            is_merge_from_metadata = False
            if still_on_hub:
                model_card = ModelCard.load(model_id)

                # Storing the model metadata
                tags = []
                if model_card.data.tags:
                    is_merge_from_metadata = "merge" in model_card.data.tags
                    is_moe_from_metadata = "moe" in model_card.data.tags
                merge_keywords = ["mergekit", "merged model", "merge model", "merging"]
                # If the model is a merge but not saying it in the metadata, we flag it
                is_merge_from_model_card = any(keyword in model_card.text.lower() for keyword in merge_keywords)
                if is_merge_from_model_card or is_merge_from_metadata:
                    tags.append("merge")
                    if not is_merge_from_metadata:
                        tags.append("flagged:undisclosed_merge")
                moe_keywords = ["moe", "mixture of experts"]
                is_moe_from_model_card = any(keyword in model_card.text.lower() for keyword in moe_keywords)
                is_moe_from_name = "moe" in model_id.lower().replace("/", "-").replace("_", "-").split("-")
                if is_moe_from_model_card or is_moe_from_name or is_moe_from_metadata:
                    tags.append("moe")
                    if not is_moe_from_metadata:
                        tags.append("flagged:undisclosed_moe")

            data["tags"] = tags

    with open(file_path, 'w') as f:
        json.dump(model_infos, f, indent=2)

def update_dynamic_files():
    """ This will only update metadata for models already linked in the repo, not add missing ones.
    """
    snapshot_download(
        repo_id=DYNAMIC_INFO_REPO, local_dir=DYNAMIC_INFO_PATH, repo_type="dataset", tqdm_class=None, etag_timeout=30
    )

    print("UPDATE_DYNAMIC: Loaded snapshot")
    # Get models
    start = time.time()

    models = list(API.list_models(
        filter=ModelFilter(task="text-generation"),
        full=False,
        cardData=True,
        fetch_config=True,
    ))
    id_to_model = {model.id : model for model in models}

    print(f"UPDATE_DYNAMIC: Downloaded list of models in {time.time() - start:.2f} seconds")

    start = time.time()

    update_models(DYNAMIC_INFO_FILE_PATH, id_to_model)

    print(f"UPDATE_DYNAMIC: updated in {time.time() - start:.2f} seconds")

    API.upload_file(
        path_or_fileobj=DYNAMIC_INFO_FILE_PATH,
        path_in_repo=DYNAMIC_INFO_FILE_PATH.split("/")[-1],
        repo_id=DYNAMIC_INFO_REPO,
        repo_type="dataset",
        commit_message=f"Daily request file update.",
    )
    print(f"UPDATE_DYNAMIC: pushed to hub")
