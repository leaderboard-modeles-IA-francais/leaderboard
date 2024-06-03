import pathlib
import pandas as pd
from datasets import Dataset
from src.display.formatting import has_no_nan_values, make_clickable_model
from src.display.utils import AutoEvalColumn, EvalQueueColumn, baseline_row
from src.leaderboard.filter_models import filter_models_flags
from src.display.utils import load_json_data


def _process_model_data(entry, model_name_key="model", revision_key="revision"):
    """Enrich model data with clickable links and revisions."""
    entry[EvalQueueColumn.model.name] = make_clickable_model(entry.get(model_name_key, ""))
    entry[EvalQueueColumn.revision.name] = entry.get(revision_key, "main")
    return entry


def get_evaluation_queue_df(save_path, cols):
    """Generate dataframes for pending, running, and finished evaluation entries."""
    save_path = pathlib.Path(save_path)
    all_evals = []

    for path in save_path.rglob("*.json"):
        data = load_json_data(path)
        if data:
            all_evals.append(_process_model_data(data))

    # Organizing data by status
    status_map = {
        "PENDING": ["PENDING", "RERUN"],
        "RUNNING": ["RUNNING"],
        "FINISHED": ["FINISHED", "PENDING_NEW_EVAL"],
    }
    status_dfs = {status: [] for status in status_map}
    for eval_data in all_evals:
        for status, extra_statuses in status_map.items():
            if eval_data["status"] in extra_statuses:
                status_dfs[status].append(eval_data)

    return tuple(pd.DataFrame(status_dfs[status], columns=cols) for status in ["FINISHED", "RUNNING", "PENDING"])


def get_leaderboard_df(leaderboard_dataset: Dataset, cols: list, benchmark_cols: list):
    """Retrieve and process leaderboard data."""
    all_data_json = leaderboard_dataset.to_dict()
    num_items = leaderboard_dataset.num_rows
    all_data_json_list = [{k: all_data_json[k][ix] for k in all_data_json.keys()} for ix in range(num_items)]
    filter_models_flags(all_data_json_list)

    df = pd.DataFrame.from_records(all_data_json_list)
    df = df.sort_values(by=[AutoEvalColumn.average.name], ascending=False)
    df = df[cols].round(decimals=2)
    df = df[has_no_nan_values(df, benchmark_cols)]
    return df
