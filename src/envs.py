import os
from huggingface_hub import HfApi

# clone / pull the lmeh eval data
HF_TOKEN = os.environ.get("HF_TOKEN", None)

REPO_ID = "open-llm-leaderboard/open_llm_leaderboard_v2"
QUEUE_REPO = "open-llm-leaderboard/requests"
AGGREGATED_REPO = "open-llm-leaderboard/contents"
VOTES_REPO = "open-llm-leaderboard/votes"

HF_HOME = os.getenv("HF_HOME", ".")

# Check HF_HOME write access
print(f"Initial HF_HOME set to: {HF_HOME}")

if not os.access(HF_HOME, os.W_OK):
    print(f"No write access to HF_HOME: {HF_HOME}. Resetting to current directory.")
    HF_HOME = "."
    os.environ["HF_HOME"] = HF_HOME
else:
    print("Write access confirmed for HF_HOME")

VOTES_PATH = os.path.join(HF_HOME, "model-votes")
EVAL_REQUESTS_PATH = os.path.join(HF_HOME, "eval-queue")

# Rate limit variables
RATE_LIMIT_PERIOD = 7
RATE_LIMIT_QUOTA = 5
HAS_HIGHER_RATE_LIMIT = []

API = HfApi(token=HF_TOKEN)
