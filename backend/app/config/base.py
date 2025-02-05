import os
from pathlib import Path

# Server configuration
HOST = "0.0.0.0"
PORT = 7860
WORKERS = 4
RELOAD = True if os.environ.get("ENVIRONMENT") == "development" else False

# CORS configuration
ORIGINS = ["http://localhost:3000"] if os.getenv("ENVIRONMENT") == "development" else ["*"]

# Cache configuration
CACHE_TTL = int(os.environ.get("CACHE_TTL", 300))  # 5 minutes default

# Rate limiting
RATE_LIMIT_PERIOD = 7  # days
RATE_LIMIT_QUOTA = 5
HAS_HIGHER_RATE_LIMIT = []

# HuggingFace configuration
HF_TOKEN = os.environ.get("HF_TOKEN")
# HF_ORGANIZATION = "fr-gouv-coordination-ia"
HF_ORGANIZATION = "rtetley"
API = {
    "INFERENCE": "https://api-inference.huggingface.co/models",
    "HUB": "https://huggingface.co"
}

# Cache paths
CACHE_ROOT = Path(os.environ.get("HF_HOME", ".cache"))
DATASETS_CACHE = CACHE_ROOT / "datasets"
MODELS_CACHE = CACHE_ROOT / "models"
VOTES_CACHE = CACHE_ROOT / "votes"
EVAL_CACHE = CACHE_ROOT / "eval-queue"
RESULTS_CACHE = CACHE_ROOT / "results"