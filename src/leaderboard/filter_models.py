from src.display.formatting import model_hyperlink
from src.display.utils import AutoEvalColumn


# Models which have been flagged by users as being problematic for a reason or another
# (Model name to forum discussion link)
# None for the v2 so far!
FLAGGED_MODELS = {}

# Models which have been requested by orgs to not be submitted on the leaderboard
DO_NOT_SUBMIT_MODELS = [
    "Voicelab/trurl-2-13b",  # trained on MMLU
    "TigerResearch/tigerbot-70b-chat",  # per authors request
    "TigerResearch/tigerbot-70b-chat-v2",  # per authors request
    "TigerResearch/tigerbot-70b-chat-v4-4k",  # per authors request
]


def flag_models(leaderboard_data: list[dict]):
    """Flags models based on external criteria or flagged status."""
    for model_data in leaderboard_data:
        # Skip flagging if official providers is True
        if model_data.get(AutoEvalColumn.official_providers.name, False):
            model_data[AutoEvalColumn.not_flagged.name] = True
            continue

        # If a model is not flagged, use its "fullname" as a key
        if model_data[AutoEvalColumn.not_flagged.name]:
            flag_key = model_data[AutoEvalColumn.fullname.name]
        else:
            flag_key = None

        # Reverse the logic: Check for non-flagged models instead
        if flag_key in FLAGGED_MODELS:
            issue_num = FLAGGED_MODELS[flag_key].split("/")[-1]
            issue_link = model_hyperlink(
                FLAGGED_MODELS[flag_key],
                f"See discussion #{issue_num}",
            )
            model_data[AutoEvalColumn.model.name] = (
                f"{model_data[AutoEvalColumn.model.name]} has been flagged! {issue_link}"
            )
            model_data[AutoEvalColumn.not_flagged.name] = False
        else:
            model_data[AutoEvalColumn.not_flagged.name] = True


def remove_forbidden_models(leaderboard_data: list[dict]):
    """Removes models from the leaderboard based on the DO_NOT_SUBMIT list."""
    indices_to_remove = []
    for ix, model in enumerate(leaderboard_data):
        if model[AutoEvalColumn.fullname.name] in DO_NOT_SUBMIT_MODELS:
            indices_to_remove.append(ix)

    # Remove the models from the list
    for ix in reversed(indices_to_remove):
        leaderboard_data.pop(ix)
    return leaderboard_data

"""
def remove_forbidden_models(leaderboard_data):
    #Removes models from the leaderboard based on the DO_NOT_SUBMIT list.
    indices_to_remove = []
    for ix, row in leaderboard_data.iterrows():
        if row[AutoEvalColumn.fullname.name] in DO_NOT_SUBMIT_MODELS:
            indices_to_remove.append(ix)

    # Remove the models from the list
    return leaderboard_data.drop(indices_to_remove)
"""


def filter_models_flags(leaderboard_data: list[dict]):
    leaderboard_data = remove_forbidden_models(leaderboard_data)
    flag_models(leaderboard_data)
