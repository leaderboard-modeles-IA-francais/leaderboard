"""
ASGI entry point for the Open LLM Leaderboard API.
"""
import os
import uvicorn
import logging
import logging.config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import sys
import sentry_sdk

from app.api.router import router
from app.core.fastapi_cache import setup_cache
from app.core.formatting import LogFormatter
from app.config import hf_config

# Configure logging before anything else
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": True,
    "formatters": {
        "default": {
            "format": "%(name)s - %(levelname)s - %(message)s",
        }
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
        }
    },
    "loggers": {
        "uvicorn": {
            "handlers": ["default"],
            "level": "WARNING",
            "propagate": False,
        },
        "uvicorn.error": {
            "level": "WARNING",
            "handlers": ["default"],
            "propagate": False,
        },
        "uvicorn.access": {
            "handlers": ["default"],
            "level": "WARNING",
            "propagate": False,
        },
        "app": {
            "handlers": ["default"],
            "level": "WARNING",
            "propagate": False,
        }
    },
    "root": {
        "handlers": ["default"],
        "level": "WARNING",
    }
}

# Apply logging configuration
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("app")

sentry_sdk.init(
    dsn="https://aeadf8ea37d94843a226d8616f173b30@o4508776892268544.ingest.de.sentry.io/4508776897314896",
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    send_default_pii=False,
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for tracing.
    traces_sample_rate=1.0,
    _experiments={
        # Set continuous_profiling_auto_start to True
        # to automatically start the profiler on when
        # possible.
        "continuous_profiling_auto_start": True,
    },
)

# Create FastAPI application
app = FastAPI(
    title="Open LLM Leaderboard",
    version="1.0.0",
    docs_url="/docs",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add GZIP compression
app.add_middleware(GZipMiddleware, minimum_size=500)

# Include API router
app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("\n")
    logger.info(LogFormatter.section("APPLICATION STARTUP"))
    
    # Log HF configuration
    logger.info(LogFormatter.section("HUGGING FACE CONFIGURATION"))
    logger.info(LogFormatter.info(f"Organization: {hf_config.HF_ORGANIZATION}"))
    logger.info(LogFormatter.info(f"Token Status: {'Present' if hf_config.HF_TOKEN else 'Missing'}"))
    logger.info(LogFormatter.info(f"Using repositories:"))
    logger.info(LogFormatter.info(f"  - Queue: {hf_config.QUEUE_REPO}"))
    logger.info(LogFormatter.info(f"  - Aggregated: {hf_config.AGGREGATED_REPO}"))
    logger.info(LogFormatter.info(f"  - Votes: {hf_config.VOTES_REPO}"))
    logger.info(LogFormatter.info(f"  - Official Providers: {hf_config.OFFICIAL_PROVIDERS_REPO}"))
    
    # Setup cache
    setup_cache()
    logger.info(LogFormatter.success("FastAPI Cache initialized with in-memory backend")) 