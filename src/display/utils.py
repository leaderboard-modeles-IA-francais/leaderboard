from dataclasses import dataclass, make_dataclass
from datasets import load_dataset
from enum import Enum
import json
import logging
from datetime import datetime
import pandas as pd

from src.envs import OFFICIAL_PROVIDERS_REPO

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

dataset = load_dataset(OFFICIAL_PROVIDERS_REPO)
official_providers = dataset["train"][0]["CURATED_SET"]

# Convert ISO 8601 dates to datetime objects for comparison
def parse_iso8601_datetime(date_str):
    if date_str.endswith('Z'):
        date_str = date_str[:-1] + '+00:00'
    return datetime.fromisoformat(date_str)

def parse_datetime(datetime_str):
    formats = [
        "%Y-%m-%dT%H-%M-%S.%f",  # Format with dashes
        "%Y-%m-%dT%H:%M:%S.%f",  # Standard format with colons
        "%Y-%m-%dT%H %M %S.%f",  # Spaces as separator
    ]

    for fmt in formats:
        try:
            return datetime.strptime(datetime_str, fmt)
        except ValueError:
            continue
    # in rare cases set unix start time for files with incorrect time (legacy files)
    logging.error(f"No valid date format found for: {datetime_str}")
    return datetime(1970, 1, 1)


def load_json_data(file_path):
    """Safely load JSON data from a file."""
    try:
        with open(file_path, "r") as file:
            return json.load(file)
    except json.JSONDecodeError:
        print(f"Error reading JSON from {file_path}")
        return None  # Or raise an exception


def fields(raw_class):
    return [v for k, v in raw_class.__dict__.items() if k[:2] != "__" and k[-2:] != "__"]


@dataclass
class Task:
    benchmark: str
    metric: str
    col_name: str


class Tasks(Enum):
    ifeval = Task("leaderboard_ifeval", "strict_acc,none", "IFEval")
    ifeval_raw = Task("leaderboard_ifeval", "strict_acc,none", "IFEval Raw")

    bbh = Task("leaderboard_bbh", "acc_norm,none", "BBH")
    bbh_raw = Task("leaderboard_bbh", "acc_norm,none", "BBH Raw")

    math = Task("leaderboard_math_hard", "exact_match,none", "MATH Lvl 5")
    math_raw = Task("leaderboard_math_hard", "exact_match,none", "MATH Lvl 5 Raw")

    gpqa = Task("leaderboard_gpqa", "acc_norm,none", "GPQA")
    gpqa_raw = Task("leaderboard_gpqa", "acc_norm,none", "GPQA Raw")

    musr = Task("leaderboard_musr", "acc_norm,none", "MUSR")
    musr_raw = Task("leaderboard_musr", "acc_norm,none", "MUSR Raw")

    mmlu_pro = Task("leaderboard_mmlu_pro", "acc,none", "MMLU-PRO")
    mmlu_pro_raw = Task("leaderboard_mmlu_pro", "acc,none", "MMLU-PRO Raw")


# These classes are for user facing column names,
# to avoid having to change them all around the code
# when a modif is needed
@dataclass(frozen=True)
class ColumnContent:
    name: str
    type: str
    displayed_by_default: bool
    hidden: bool = False
    never_hidden: bool = False
    dummy: bool = False


auto_eval_column_dict = []
# Init
auto_eval_column_dict.append(["model_type_symbol", ColumnContent, ColumnContent("T", "str", True, never_hidden=True)])
auto_eval_column_dict.append(["model", ColumnContent, ColumnContent("Model", "markdown", True, never_hidden=True)])
# Scores
auto_eval_column_dict.append(["average", ColumnContent, ColumnContent("Average ⬆️", "number", True)])
for task in Tasks:
    displayed_by_default = not task.name.endswith("_raw")
    auto_eval_column_dict.append([task.name, ColumnContent, ColumnContent(task.value.col_name, "number", displayed_by_default=displayed_by_default)])
# Model information
auto_eval_column_dict.append(["model_type", ColumnContent, ColumnContent("Type", "str", False)])
auto_eval_column_dict.append(["architecture", ColumnContent, ColumnContent("Architecture", "str", False)])
auto_eval_column_dict.append(["weight_type", ColumnContent, ColumnContent("Weight type", "str", False, True)])
auto_eval_column_dict.append(["precision", ColumnContent, ColumnContent("Precision", "str", False)])
auto_eval_column_dict.append(["merged", ColumnContent, ColumnContent("Merged", "bool", False)])
auto_eval_column_dict.append(["license", ColumnContent, ColumnContent("Hub License", "str", False)])
auto_eval_column_dict.append(["params", ColumnContent, ColumnContent("#Params (B)", "number", False)])
auto_eval_column_dict.append(["likes", ColumnContent, ColumnContent("Hub ❤️", "number", False)])
auto_eval_column_dict.append(
    ["still_on_hub", ColumnContent, ColumnContent("Available on the hub", "bool", False, hidden=True)]
)
auto_eval_column_dict.append(["revision", ColumnContent, ColumnContent("Model sha", "str", False, False)])
auto_eval_column_dict.append(["not_flagged", ColumnContent, ColumnContent("Flagged", "bool", False, hidden=True)])
auto_eval_column_dict.append(["moe", ColumnContent, ColumnContent("MoE", "bool", False, hidden=True)])

auto_eval_column_dict.append(["submission_date", ColumnContent, ColumnContent("Submission Date", "bool", False, hidden=False)])
auto_eval_column_dict.append(["upload_to_hub", ColumnContent, ColumnContent("Upload To Hub Date", "bool", False, hidden=False)])

auto_eval_column_dict.append(["use_chat_template", ColumnContent, ColumnContent("Chat Template", "bool", False)])
auto_eval_column_dict.append(["official_providers", ColumnContent, ColumnContent("Official Providers", "bool", False, hidden=True)])

# fullname structure: <user>/<model_name>
auto_eval_column_dict.append(["fullname", ColumnContent, ColumnContent("fullname", "str", False, dummy=True)])

auto_eval_column_dict.append(["generation", ColumnContent, ColumnContent("Generation", "number", False)])
auto_eval_column_dict.append(["base_model", ColumnContent, ColumnContent("Base Model", "str", False)])

auto_eval_column_dict.append(["co2_emissions_kg", ColumnContent, ColumnContent("CO₂ cost (kg)", "number", True)])

# We use make dataclass to dynamically fill the scores from Tasks
AutoEvalColumn = make_dataclass("AutoEvalColumn", auto_eval_column_dict, frozen=True)


@dataclass(frozen=True)
class EvalQueueColumn:  # Queue column
    model_link = ColumnContent("model_link", "markdown", True)
    model_name = ColumnContent("model_name", "str", True)
    revision = ColumnContent("revision", "str", True)
    #private = ColumnContent("private", "bool", True)  # Should not be displayed
    precision = ColumnContent("precision", "str", True)
    #weight_type = ColumnContent("weight_type", "str", "Original") # Might be confusing, to think about
    status = ColumnContent("status", "str", True)


# baseline_row = {
#     AutoEvalColumn.model.name: "<p>Baseline</p>",
#     AutoEvalColumn.revision.name: "N/A",
#     AutoEvalColumn.precision.name: None,
#     AutoEvalColumn.merged.name: False,
#     AutoEvalColumn.average.name: 31.0,
#     AutoEvalColumn.arc.name: 25.0,
#     AutoEvalColumn.hellaswag.name: 25.0,
#     AutoEvalColumn.mmlu.name: 25.0,
#     AutoEvalColumn.truthfulqa.name: 25.0,
#     AutoEvalColumn.winogrande.name: 50.0,
#     AutoEvalColumn.gsm8k.name: 0.21,
#     AutoEvalColumn.fullname.name: "baseline",
#     AutoEvalColumn.model_type.name: "",
#     AutoEvalColumn.not_flagged.name: False,
# }

# Average ⬆️ human baseline is 0.897 (source: averaging human baselines below)
# ARC human baseline is 0.80 (source: https://lab42.global/arc/)
# HellaSwag human baseline is 0.95 (source: https://deepgram.com/learn/hellaswag-llm-benchmark-guide)
# MMLU human baseline is 0.898 (source: https://openreview.net/forum?id=d7KBjmI3GmQ)
# TruthfulQA human baseline is 0.94(source: https://arxiv.org/pdf/2109.07958.pdf)
# Winogrande: https://leaderboard.allenai.org/winogrande/submissions/public
# GSM8K: paper
# Define the human baselines
# human_baseline_row = {
#     AutoEvalColumn.model.name: "<p>Human performance</p>",
#     AutoEvalColumn.revision.name: "N/A",
#     AutoEvalColumn.precision.name: None,
#     AutoEvalColumn.average.name: 92.75,
#     AutoEvalColumn.merged.name: False,
#     AutoEvalColumn.arc.name: 80.0,
#     AutoEvalColumn.hellaswag.name: 95.0,
#     AutoEvalColumn.mmlu.name: 89.8,
#     AutoEvalColumn.truthfulqa.name: 94.0,
#     AutoEvalColumn.winogrande.name: 94.0,
#     AutoEvalColumn.gsm8k.name: 100,
#     AutoEvalColumn.fullname.name: "human_baseline",
#     AutoEvalColumn.model_type.name: "",
#     AutoEvalColumn.not_flagged.name: False,
# }


@dataclass
class ModelDetails:
    name: str
    symbol: str = ""  # emoji, only for the model type


class ModelType(Enum):
    PT = ModelDetails(name="🟢 pretrained", symbol="🟢")
    CPT = ModelDetails(name="🟩 continuously pretrained", symbol="🟩")
    FT = ModelDetails(name="🔶 fine-tuned on domain-specific datasets", symbol="🔶")
    MM = ModelDetails(name="🌸 multimodal", symbol="🌸")
    chat = ModelDetails(name="💬 chat models (RLHF, DPO, IFT, ...)", symbol="💬")
    merges = ModelDetails(name="🤝 base merges and moerges", symbol="🤝")
    Unknown = ModelDetails(name="❓ other", symbol="❓")

    def to_str(self, separator=" "):
        return f"{self.value.symbol}{separator}{self.value.name}"

    @staticmethod
    def from_str(m_type):
        if any([k for k in m_type if k in ["fine-tuned","🔶", "finetuned"]]):
            return ModelType.FT
        if "continuously pretrained" in m_type or "🟩" in m_type:
            return ModelType.CPT
        if "pretrained" in m_type or "🟢" in m_type:
            return ModelType.PT
        if any([k in m_type for k in ["instruction-tuned", "RL-tuned", "chat", "🟦", "⭕", "💬"]]):
            return ModelType.chat
        if "merge" in m_type or "🤝" in m_type:
            return ModelType.merges
        if "multimodal" in m_type or "🌸" in m_type:
            return ModelType.MM
        return ModelType.Unknown

class WeightType(Enum):
    Adapter = ModelDetails("Adapter")
    Original = ModelDetails("Original")
    Delta = ModelDetails("Delta")


class Precision(Enum):
    float16 = ModelDetails("float16")
    bfloat16 = ModelDetails("bfloat16")
    qt_8bit = ModelDetails("8bit")
    qt_4bit = ModelDetails("4bit")
    qt_GPTQ = ModelDetails("GPTQ")
    Unknown = ModelDetails("?")

    @staticmethod
    def from_str(precision):
        if precision in ["torch.float16", "float16"]:
            return Precision.float16
        if precision in ["torch.bfloat16", "bfloat16"]:
            return Precision.bfloat16
        if precision in ["8bit"]:
            return Precision.qt_8bit
        if precision in ["4bit"]:
            return Precision.qt_4bit
        if precision in ["GPTQ", "None"]:
            return Precision.qt_GPTQ
        return Precision.Unknown


# Column selection
COLS = [c.name for c in fields(AutoEvalColumn)]
TYPES = [c.type for c in fields(AutoEvalColumn)]

EVAL_COLS = [c.name for c in fields(EvalQueueColumn)]
EVAL_TYPES = [c.type for c in fields(EvalQueueColumn)]

BENCHMARK_COLS = [t.value.col_name for t in Tasks]

NUMERIC_INTERVALS = {
    "?": pd.Interval(-1, 0, closed="right"),
    "~1.5": pd.Interval(0, 2, closed="right"),
    "~3": pd.Interval(2, 4, closed="right"),
    "~7": pd.Interval(4, 9, closed="right"),
    "~13": pd.Interval(9, 20, closed="right"),
    "~35": pd.Interval(20, 45, closed="right"),
    "~60": pd.Interval(45, 70, closed="right"),
    "70+": pd.Interval(70, 10000, closed="right"),
}
