from app.core.cache import cache_config
from datetime import datetime
from typing import List, Dict, Any
import datasets
import requests
from fastapi import HTTPException
import logging
from app.config.base import HF_ORGANIZATION
from app.core.formatting import LogFormatter
from dataclasses import dataclass
from enum import Enum
import json
import os
import glob
from transformers import AutoConfig
from transformers.models.auto.tokenization_auto import AutoTokenizer
import dateutil
import numpy as np
from huggingface_hub import snapshot_download
from app.services.models import ModelService
import time

from app.config import (
    RESULTS_CACHE,
    EVAL_CACHE,
    HF_TOKEN,
)

from app.config.hf_config import (
    RESULTS_REPO,
)

logger = logging.getLogger(__name__)

## All the model information that we might need
## TODO move all these classes to proper place
@dataclass
class ModelDetails:
    name: str
    display_name: str = ""
    symbol: str = ""  # emoji

class ModelType(Enum):
    PT = ModelDetails(name="pretrained", symbol="🟢")
    FT = ModelDetails(name="fine-tunedondomain-specificdatasets", symbol="🔶")
    IFT = ModelDetails(name="instruction-tuned", symbol="⭕")
    RL = ModelDetails(name="RL-tuned", symbol="🟦")
    CHAT = ModelDetails(name="chatmodels")
    M = ModelDetails(name="merged", symbol="<>")
    Unknown = ModelDetails(name="unknown", symbol="?")

    def to_str(self):
        return f"{self.value.name}"

    @staticmethod
    def from_str(type):
        if "fine-tuned" in type or "🔶" in type:
            return ModelType.FT
        if "pretrained" in type or "🟢" in type:
            return ModelType.PT
        if "RL-tuned" in type or "🟦" in type:
            return ModelType.RL
        if "instruction-tuned" in type or "⭕" in type or "chatmodels" in type or "chat" in type: 
            return ModelType.CHAT
        if "merge" in type:
            return ModelType.M
        return ModelType.Unknown


class WeightType(Enum):
    Adapter = ModelDetails("Adapter")
    Original = ModelDetails("Original")
    Delta = ModelDetails("Delta")


class Precision(Enum):
    float16 = ModelDetails("float16")
    bfloat16 = ModelDetails("bfloat16")
    Unknown = ModelDetails("?")

    def from_str(precision):
        if precision in ["torch.float16", "float16"]:
            return Precision.float16
        if precision in ["torch.bfloat16", "bfloat16"]:
            return Precision.bfloat16
        return Precision.Unknown

@dataclass
class Task:
    benchmark: str
    metric: str
    col_name: str

class Tasks(Enum):
    task0 = Task("community|gpqa-fr|0", "new_acc", "GPQA-fr")  # On pourrait vouloir mettre "Connaissances"
    task1 = Task("community|ifeval-fr|0", "prompt_level_strict_acc", "IFEval-fr") # FIXME norm_acc should be acc # et "Suivi d'instructions"
    task2 = Task("community|bac-fr|0", "bac-fr-qem", "bac-fr") # et "Suivi d'instructions"

def is_model_on_hub(model_name: str, revision: str, token: str = None, trust_remote_code=False, test_tokenizer=False) -> tuple[bool, str]:
    """Checks if the model model_name is on the hub, and whether it (and its tokenizer) can be loaded with AutoClasses."""
    try:
        config = AutoConfig.from_pretrained(model_name, revision=revision, trust_remote_code=trust_remote_code, token=token)
        if test_tokenizer:
            try:
                tk = AutoTokenizer.from_pretrained(model_name, revision=revision, trust_remote_code=trust_remote_code, token=token)
            except ValueError as e:
                return (
                    False,
                    f"uses a tokenizer which is not in a transformers release: {e}",
                    None
                )
            except Exception as e:
                return (False, "'s tokenizer cannot be loaded. Is your tokenizer class in a stable transformers release, and correctly configured?", None)
        return True, None, config

    except ValueError:
        return (
            False,
            "needs to be launched with `trust_remote_code=True`. For safety reason, we do not allow these models to be automatically submitted to the leaderboard.",
            None
        )

    except Exception as e:
        return False, "was not found on hub!", None

@dataclass
class EvalResult:
    """Represents one full evaluation. Built from a combination of the result and request file for a given run."""

    eval_name: str  # org_model_precision (uid)
    full_model: str  # org/model (path on hub)
    org: str
    model: str
    revision: str  # commit hash, "" if main
    results: dict
    normalized_results: dict
    precision: Precision = Precision.Unknown
    model_type: ModelType = ModelType.Unknown  # Pretrained, fine tuned, ...
    weight_type: WeightType = WeightType.Original  # Original or Adapter
    architecture: str = "Unknown"
    license: str = "?"
    likes: int = 0
    num_params: int = 0
    date: str = ""  # submission date of request file
    still_on_hub: bool = False
    display: bool = True

    @classmethod
    def init_from_json_file(self, json_filepath):
        """Inits the result from the specific model result file"""
        with open(json_filepath) as fp:
            data = json.load(fp)

        config = data.get("config_general")

        # Precision
        precision = Precision.from_str(config.get("model_dtype"))

        # Get model and org
        org_and_model = config.get("model_name", config.get("model_args", None))
        org_and_model = org_and_model.split("/", 1)

        if len(org_and_model) == 1:
            org = None
            model = org_and_model[0]
            result_key = f"{model}_{precision.value.name}"
        else:
            org = org_and_model[0]
            model = org_and_model[1]
            result_key = f"{org}_{model}_{precision.value.name}"
        full_model = "/".join(org_and_model)

        still_on_hub, _, model_config = is_model_on_hub(
            full_model, config.get("model_sha", "main"), trust_remote_code=True, test_tokenizer=False
        )
        architecture = "?"
        if model_config is not None:
            architectures = getattr(model_config, "architectures", None)
            if architectures:
                architecture = ";".join(architectures)

        # Extract results available in this file (some results are split in several files)
        results = {}
        normalized_results = {}
        for task in Tasks:
            task = task.value

            #FIXME postprocessing of metrics is done here ftm
            display = True # Do not display models evaluation if something went wrong (missing task, 0 score, ...)
            if(task.col_name == "GPQA-fr"):
                accs = np.array([v.get("new_acc", None) for k, v in data["results"].items() if task.benchmark == k])
                if accs.size == 0 or any([acc is None for acc in accs]):
                    display = False
                    continue
                r = np.mean(accs)
                results[task.benchmark] = r * 100.0
                normalized_results[task.benchmark] = max(0., (r-0.25)/0.75)*100.0

            if(task.col_name == "IFEval-fr"):
                accs = np.array([v.get("prompt_level_strict_acc", None) for k, v in data["results"].items() if task.benchmark == k])
                if accs.size == 0 or any([acc is None for acc in accs]):
                    display = False
                    continue
                r1 = np.mean(accs)
                accs = np.array([v.get("inst_level_strict_acc", None) for k, v in data["results"].items() if task.benchmark == k])
                if accs.size == 0 or any([acc is None for acc in accs]):
                    display = False
                    continue
                r2 = np.mean(accs)
                results[task.benchmark] = (r1+r2)/2.0*100.0
                normalized_results[task.benchmark] = results[task.benchmark]

            if(task.col_name == "bac-fr"):
                accs = np.array([v.get("bac-fr-qem", None) for k, v in data["results"].items() if task.benchmark == k])
                if accs.size == 0 or any([acc is None for acc in accs]):
                    #FIXME old metric name from Idris...
                    accs = np.array([v.get("qem", None) for k, v in data["results"].items() if task.benchmark == k])
                    if accs.size == 0 or any([acc is None for acc in accs]):
                        display = False
                        continue
                r = np.mean(accs)
                results[task.benchmark] = r*100.0
                normalized_results[task.benchmark] = results[task.benchmark]

        return self(
            eval_name=result_key,
            full_model=full_model,
            org=org,
            model=model,
            results=results,
            normalized_results=normalized_results,
            precision=precision,
            revision=config.get("model_sha", ""),
            still_on_hub=still_on_hub,
            architecture=architecture,
            display=display
        )

    def update_with_request_file(self, existing_models):
        """Finds the relevant request file for the current model and updates info with it"""
        for status, models in existing_models.items():
            #FIXME: for the moment we are just processing all the files in results
            #if status == "finished":
                for model in models:
                    if model["name"] == self.full_model and model["precision"] == self.precision.value.name: # FIXME and model["revision"] == model_data["revision"]:
                        self.model_type = ModelType.from_str(model["model_type"])
                        self.weight_type = WeightType[model["weight_type"]]
                        #self.license = request.get("license", "?")
                        #self.likes = request.get("likes", 0)
                        response = requests.get(
                            "https://huggingface.co/api/models/%s" % model["name"],
                            params={},
                            headers={"Authorization":"Bearer %s" % HF_TOKEN}
                        )
                        data = response.json()
                        self.num_params = data["safetensors"]["total"]
                        #self.date = request.get("submitted_time", "")
                        return
        print(
            f"Could not find request file for {self.org}/{self.model} with precision {self.precision.value.name}"
        )

class LeaderboardService:

    def __init__(self):
        self.model_service = ModelService()
        self.cached_raw_data = None
        self.last_cache_update = 0
        self.cache_ttl = cache_config.cache_ttl.total_seconds()
        pass

    async def get_raw_eval_results(self, results_path: str, requests_path: str) -> list[EvalResult]:
        """From the path of the results folder root, extract all needed info for results"""
        model_result_filepaths = []

        for root, _, files in os.walk(results_path):
            #FIXME We will remove this check when results we be homogeneous
            folderName = "clearML-sprint1.5"

            normalized_root = os.path.normpath(root)
            path_components = normalized_root.split(os.sep)
            if folderName in path_components:
                # We should only have json files in model results
                if len(files) == 0 or any([not f.endswith(".json") for f in files]):
                    continue
     
                # Sort the files by date
                try:
                    files.sort(key=lambda x: x.removesuffix(".json").removeprefix("results_")[:-7])
                except dateutil.parser._parser.ParserError:
                    files = [files[-1]]
     
                for file in files:
                    model_result_filepaths.append(os.path.join(root, file))

        eval_results = {}
        await self.model_service.initialize()
        for model_result_filepath in model_result_filepaths:
            # Creation of result
            eval_result = EvalResult.init_from_json_file(model_result_filepath)
            existing_models = await self.model_service.get_models()
            eval_result.update_with_request_file(existing_models)

            # Store results of same eval together
            if(eval_result.display):
                eval_name = eval_result.eval_name
                if eval_name in eval_results.keys():
                    eval_results[eval_name].results.update({k: v for k, v in eval_result.results.items() if v is not None})
                else:
                    eval_results[eval_name] = eval_result

        return eval_results.values()

        
    async def fetch_raw_data(self) -> List[EvalResult]:

        # Check if cache needs refresh
        current_time = time.time()
        cache_age = current_time - self.last_cache_update
        if not self.cached_raw_data:
            return await self._refresh_raw_data()
        elif cache_age > self.cache_ttl:
            return await self._refresh_raw_data()
        else:
            return self.cached_raw_data

    async def _refresh_raw_data(self) -> List[EvalResult]:
        """Fetch raw leaderboard data from HuggingFace dataset"""
        try:
            logger.info(LogFormatter.section("FETCHING LEADERBOARD DATA"))
            logger.info(LogFormatter.info(f"Loading dataset from {HF_ORGANIZATION}/contents"))
            print("GETTING FROM %s" % HF_ORGANIZATION)

            snapshot_download(
                repo_id=RESULTS_REPO,
                local_dir=RESULTS_CACHE,
                repo_type="dataset",
                tqdm_class=None,
                etag_timeout=30,
                token=HF_TOKEN,
            )

            data = await self.get_raw_eval_results(RESULTS_CACHE, EVAL_CACHE)
            return data
            
        except Exception as e:
            logger.error(LogFormatter.error("Failed to fetch leaderboard data", e))
            raise HTTPException(status_code=500, detail=str(e))

    async def get_formatted_data(self) -> List[Dict[str, Any]]:
        """Get formatted leaderboard data"""
        try:
            logger.info(LogFormatter.section("FORMATTING LEADERBOARD DATA"))
            
            raw_data = await self.fetch_raw_data()
            formatted_data = []
            type_counts = {}
            error_count = 0
            
            # Initialize progress tracking
            total_items = len(raw_data)
            logger.info(LogFormatter.info(f"Processing {total_items:,} entries..."))
            
            for i, item in enumerate(raw_data, 1):
                try:
                    formatted_item = await self.transform_data(item)
                    formatted_data.append(formatted_item)
                    
                    # Count model types
                    model_type = formatted_item["model"]["type"]
                    type_counts[model_type] = type_counts.get(model_type, 0) + 1
                    
                except Exception as e:
                    error_count += 1
                    logger.error(LogFormatter.error(f"Failed to format entry {i}/{total_items}", e))
                    continue
                
                # Log progress every 10%
                if i % max(1, total_items // 10) == 0:
                    progress = (i / total_items) * 100
                    logger.info(LogFormatter.info(f"Progress: {LogFormatter.progress_bar(i, total_items)}"))
            
            # Log final statistics
            stats = {
                "Total_Processed": total_items,
                "Successful": len(formatted_data),
                "Failed": error_count
            }
            logger.info(LogFormatter.section("PROCESSING SUMMARY"))
            for line in LogFormatter.stats(stats, "Processing Statistics"):
                logger.info(line)
            
            # Log model type distribution
            type_stats = {f"Type_{k}": v for k, v in type_counts.items()}
            logger.info(LogFormatter.subsection("MODEL TYPE DISTRIBUTION"))
            for line in LogFormatter.stats(type_stats):
                logger.info(line)
                
            return formatted_data
            
        except Exception as e:
            logger.error(LogFormatter.error("Failed to format leaderboard data", e))
            raise HTTPException(status_code=500, detail=str(e))

    async def transform_data(self, data: EvalResult) -> Dict[str, Any]:
        """Transform raw data into the format expected by the frontend"""
        try:
            # Extract model name for logging
            model_name = data.full_model
            logger.debug(LogFormatter.info(f"Transforming data for model: {model_name}"))
            
            # Create unique ID combining model name, precision, sha and chat template status
            unique_id = f"{data.full_model}_{data.precision}" # FIXME missing _{data.get('Model sha', 'Unknown')}_{str(data.get('Chat Template', False))}"

            evaluations = {
                "ifeval_fr": {
                    "name": "IFEval FR",
                    "value": data.results.get("community|ifeval-fr|0", 0),
                    "normalized_score": data.normalized_results.get("community|ifeval-fr|0", 0),
                },
                "gpqa_fr": {
                    "name": "GPQA FR",
                    "value": data.results.get("community|gpqa-fr|0", 0),
                    "normalized_score": data.normalized_results.get("community|gpqa-fr|0", 0), 
                },
                "bac_fr": {
                    "name": "BAC FR",
                    "value": data.results.get("community|bac-fr|0", 0),
                    "normalized_score": data.normalized_results.get("community|bac-fr|0", 0)
                }
            }

            features = { }

            # FIXME
            #    "is_not_available_on_hub": data.get("Available on the hub", False),
            #    "is_merged": data.get("Merged", False),
            #    "is_moe": data.get("MoE", False),
            #    "is_flagged": data.get("Flagged", False),
            #    "is_official_provider": data.get("Official Providers", False)
            #}

            metadata = { 
                "params_billions": round(data.num_params / pow(10,9), 2),
            }

            # FIXME
            #    "upload_date": data.get("Upload To Hub Date"),
            #    "submission_date": data.get("Submission Date"),
            #    "generation": data.get("Generation"),
            #    "base_model": data.get("Base Model"),
            #    "hub_license": data.get("Hub License"),
            #    "hub_hearts": data.get("Hub ❤️"),
            #    "params_billions": data.get("#Params (B)"),
            #    "co2_cost": data.get("CO₂ cost (kg)", 0)
            #}

            # Clean model type by removing emojis if present
            model_type = data.model_type

            # FIXME
            # Map old model types to new ones
            #model_type_mapping = {
            #    "fine-tuned": "fined-tuned-on-domain-specific-dataset",
            #    "fine tuned": "fined-tuned-on-domain-specific-dataset",
            #    "finetuned": "fined-tuned-on-domain-specific-dataset",
            #    "fine_tuned": "fined-tuned-on-domain-specific-dataset",
            #    "ft": "fined-tuned-on-domain-specific-dataset",
            #    "finetuning": "fined-tuned-on-domain-specific-dataset",
            #    "fine tuning": "fined-tuned-on-domain-specific-dataset",
            #    "fine-tuning": "fined-tuned-on-domain-specific-dataset"
            #}

            #mapped_type = model_type_mapping.get(model_type.lower().strip(), model_type)

            #if mapped_type != model_type:
            #    logger.debug(LogFormatter.info(f"Model type mapped: {model_type} -> {mapped_type}"))
            
            transformed_data = {
                "id": unique_id,
                "model": {
                    "name": data.full_model,
                    "sha": "", # FIXME data.get("Model sha"),
                    "precision": data.precision.name,
                    "type": model_type.to_str(),
                    "weight_type": data.weight_type.name,
                    "architecture": data.architecture,
                    "average_score": sum([v for v in data.results.values() if v is not None]) / len(Tasks),
                    "has_chat_template": False, # FIXME data.get("Chat Template", False),
                },
                "evaluations": evaluations,
                "features": features,
                "metadata": metadata
            }

            logger.debug(LogFormatter.success(f"Successfully transformed data for {model_name}"))
            return transformed_data
            
        except Exception as e:
            logger.error(LogFormatter.error(f"Failed to transform data for {data.full_model}", e))
            raise
