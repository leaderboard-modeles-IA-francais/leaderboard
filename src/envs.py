import os
import logging

from huggingface_hub import HfApi

# clone / pull the lmeh eval data
H4_TOKEN = os.environ.get("H4_TOKEN", None)

REPO_ID = "HuggingFaceH4/open_llm_leaderboard"
QUEUE_REPO = "open-llm-leaderboard/requests"
DYNAMIC_INFO_REPO = "open-llm-leaderboard/dynamic_model_information"
RESULTS_REPO = "open-llm-leaderboard/results"

PRIVATE_QUEUE_REPO = "open-llm-leaderboard/private-requests"
PRIVATE_RESULTS_REPO = "open-llm-leaderboard/private-results"

IS_PUBLIC = bool(os.environ.get("IS_PUBLIC", True))

HF_HOME = os.getenv("HF_HOME", ".")

# Check HF_HOME write access
print(f"Initial HF_HOME set to: {HF_HOME}")

if not os.access(HF_HOME, os.W_OK):
    print(f"No write access to HF_HOME: {HF_HOME}. Resetting to current directory.")
    HF_HOME = "."
    os.environ["HF_HOME"] = HF_HOME
else:
    print("Write access confirmed for HF_HOME")

EVAL_REQUESTS_PATH = os.path.join(HF_HOME, "eval-queue")
EVAL_RESULTS_PATH = os.path.join(HF_HOME, "eval-results")
DYNAMIC_INFO_PATH = os.path.join(HF_HOME, "dynamic-info")
DYNAMIC_INFO_FILE_PATH = os.path.join(DYNAMIC_INFO_PATH, "model_infos.json")

EVAL_REQUESTS_PATH_PRIVATE = "eval-queue-private"
EVAL_RESULTS_PATH_PRIVATE = "eval-results-private"

PATH_TO_COLLECTION = "open-llm-leaderboard/llm-leaderboard-best-models-652d6c7965a4619fb5c27a03"

# Rate limit variables
RATE_LIMIT_PERIOD = 7
RATE_LIMIT_QUOTA = 5
HAS_HIGHER_RATE_LIMIT = ["TheBloke"]

API = HfApi(token=H4_TOKEN)
