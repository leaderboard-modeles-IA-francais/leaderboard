import os
import time
import logging
import gradio as gr
import pandas as pd
from apscheduler.schedulers.background import BackgroundScheduler
from huggingface_hub import snapshot_download
from gradio_space_ci import enable_space_ci

from src.display.about import (
    CITATION_BUTTON_LABEL,
    CITATION_BUTTON_TEXT,
    EVALUATION_QUEUE_TEXT,
    FAQ_TEXT,
    INTRODUCTION_TEXT,
    LLM_BENCHMARKS_TEXT,
    TITLE,
)
from src.display.css_html_js import custom_css
from src.display.utils import (
    BENCHMARK_COLS,
    COLS,
    EVAL_COLS,
    EVAL_TYPES,
    NUMERIC_INTERVALS,
    TYPES,
    AutoEvalColumn,
    ModelType,
    Precision,
    WeightType,
    fields,
)
from src.envs import (
    API,
    DYNAMIC_INFO_FILE_PATH,
    DYNAMIC_INFO_PATH,
    DYNAMIC_INFO_REPO,
    EVAL_REQUESTS_PATH,
    EVAL_RESULTS_PATH,
    H4_TOKEN,
    IS_PUBLIC,
    QUEUE_REPO,
    REPO_ID,
    RESULTS_REPO,
)
from src.populate import get_evaluation_queue_df, get_leaderboard_df
from src.scripts.update_all_request_files import update_dynamic_files
from src.submission.submit import add_new_eval
from src.tools.collections import update_collections
from src.tools.plots import create_metric_plot_obj, create_plot_df, create_scores_df


# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Start ephemeral Spaces on PRs (see config in README.md)
enable_space_ci()


def restart_space():
    API.restart_space(repo_id=REPO_ID, token=H4_TOKEN)


def time_diff_wrapper(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        diff = end_time - start_time
        logging.info(f"Time taken for {func.__name__}: {diff} seconds")
        return result
    return wrapper


@time_diff_wrapper
def download_dataset(repo_id, local_dir, repo_type="dataset", max_attempts=3, backoff_factor=1.5):
    """Download dataset with exponential backoff retries."""
    attempt = 0
    while attempt < max_attempts:
        try:
            logging.info(f"Downloading {repo_id} to {local_dir}")
            snapshot_download(
                repo_id=repo_id,
                local_dir=local_dir,
                repo_type=repo_type,
                tqdm_class=None,
                etag_timeout=30,
                max_workers=8,
            )
            logging.info("Download successful")
            return
        except Exception as e:
            wait_time = backoff_factor ** attempt
            logging.error(f"Error downloading {repo_id}: {e}, retrying in {wait_time}s")
            time.sleep(wait_time)
            attempt += 1
    raise Exception(f"Failed to download {repo_id} after {max_attempts} attempts")

def init_space(full_init: bool = True):
    """Initializes the application space, loading only necessary data."""
    if full_init:
        # These downloads only occur on full initialization
        try:
            download_dataset(QUEUE_REPO, EVAL_REQUESTS_PATH)
            download_dataset(DYNAMIC_INFO_REPO, DYNAMIC_INFO_PATH)
            download_dataset(RESULTS_REPO, EVAL_RESULTS_PATH)
        except Exception:
            restart_space()

    # Always retrieve the leaderboard DataFrame
    raw_data, original_df = get_leaderboard_df(
        results_path=EVAL_RESULTS_PATH,
        requests_path=EVAL_REQUESTS_PATH,
        dynamic_path=DYNAMIC_INFO_FILE_PATH,
        cols=COLS,
        benchmark_cols=BENCHMARK_COLS,
    )

    if full_init:
        # Collection update only happens on full initialization
        update_collections(original_df)

    leaderboard_df = original_df.copy()
    
    # Evaluation queue DataFrame retrieval is independent of initialization detail level
    eval_queue_dfs = get_evaluation_queue_df(EVAL_REQUESTS_PATH, EVAL_COLS)

    return leaderboard_df, raw_data, original_df, eval_queue_dfs

# Convert the environment variable "LEADERBOARD_FULL_INIT" to a boolean value, defaulting to True if the variable is not set.
# This controls whether a full initialization should be performed.
do_full_init = os.getenv("LEADERBOARD_FULL_INIT", "True") == "True"

# Calls the init_space function with the `full_init` parameter determined by the `do_full_init` variable.
# This initializes various DataFrames used throughout the application, with the level of initialization detail controlled by the `do_full_init` flag.
leaderboard_df, raw_data, original_df, eval_queue_dfs = init_space(full_init=do_full_init)
finished_eval_queue_df, running_eval_queue_df, pending_eval_queue_df = eval_queue_dfs


# Data processing for plots now only on demand in the respective Gradio tab
def load_and_create_plots():
    plot_df = create_plot_df(create_scores_df(raw_data))
    return plot_df


# Searching and filtering
def update_table(
    hidden_df: pd.DataFrame,
    columns: list,
    type_query: list,
    precision_query: str,
    size_query: list,
    hide_models: list,
    query: str,
):
    filtered_df = filter_models(
        df=hidden_df,
        type_query=type_query,
        size_query=size_query,
        precision_query=precision_query,
        hide_models=hide_models,
    )
    filtered_df = filter_queries(query, filtered_df)
    df = select_columns(filtered_df, columns)
    return df


def load_query(request: gr.Request):  # triggered only once at startup => read query parameter if it exists
    query = request.query_params.get("query") or ""
    return (
        query,
        query,
    )  # return one for the "search_bar", one for a hidden component that triggers a reload only if value has changed


def search_model(df: pd.DataFrame, query: str) -> pd.DataFrame:
    return df[(df[AutoEvalColumn.fullname.name].str.contains(query, case=False, na=False))]

def search_license(df: pd.DataFrame, query: str) -> pd.DataFrame:
    return df[df[AutoEvalColumn.license.name].str.contains(query, case=False, na=False)]

def select_columns(df: pd.DataFrame, columns: list) -> pd.DataFrame:
    always_here_cols = [c.name for c in fields(AutoEvalColumn) if c.never_hidden]
    dummy_col = [AutoEvalColumn.fullname.name]
    filtered_df = df[always_here_cols + [c for c in COLS if c in df.columns and c in columns] + dummy_col]
    return filtered_df

def filter_queries(query: str, df: pd.DataFrame):
    tmp_result_df = []

    # Empty query return the same df
    if query == "":
        return df

    # all_queries = [q.strip() for q in query.split(";")]
    # license_queries = []
    all_queries = [q.strip() for q in query.split(";") if q.strip() != ""]
    model_queries = [q for q in all_queries if not q.startswith("licence")]
    license_queries_raw = [q for q in all_queries if q.startswith("license")]
    license_queries = [
        q.replace("license:", "").strip() for q in license_queries_raw if q.replace("license:", "").strip() != ""
    ]

    # Handling model name search
    for query in model_queries:
        tmp_df = search_model(df, query)
        if len(tmp_df) > 0:
            tmp_result_df.append(tmp_df)

    if not tmp_result_df and not license_queries:
        # Nothing is found, no license_queries -> return empty df
        return pd.DataFrame(columns=df.columns)

    if tmp_result_df:
        df = pd.concat(tmp_result_df)
        df = df.drop_duplicates(
            subset=[AutoEvalColumn.model.name, AutoEvalColumn.precision.name, AutoEvalColumn.revision.name]
        )

    if not license_queries:
        return df

    # Handling license search
    tmp_result_df = []
    for query in license_queries:
        tmp_df = search_license(df, query)
        if len(tmp_df) > 0:
            tmp_result_df.append(tmp_df)

    if not tmp_result_df:
        # Nothing is found, return empty df
        return pd.DataFrame(columns=df.columns)

    df = pd.concat(tmp_result_df)
    df = df.drop_duplicates(
        subset=[AutoEvalColumn.model.name, AutoEvalColumn.precision.name, AutoEvalColumn.revision.name]
    )

    return df


def filter_models(
    df: pd.DataFrame, type_query: list, size_query: list, precision_query: list, hide_models: list
) -> pd.DataFrame:
    # Show all models
    if "Private or deleted" in hide_models:
        filtered_df = df[df[AutoEvalColumn.still_on_hub.name] == True]
    else:
        filtered_df = df

    if "Contains a merge/moerge" in hide_models:
        filtered_df = filtered_df[filtered_df[AutoEvalColumn.merged.name] == False]

    if "MoE" in hide_models:
        filtered_df = filtered_df[filtered_df[AutoEvalColumn.moe.name] == False]

    if "Flagged" in hide_models:
        filtered_df = filtered_df[filtered_df[AutoEvalColumn.flagged.name] == False]

    type_emoji = [t[0] for t in type_query]
    filtered_df = filtered_df.loc[df[AutoEvalColumn.model_type_symbol.name].isin(type_emoji)]
    filtered_df = filtered_df.loc[df[AutoEvalColumn.precision.name].isin(precision_query + ["None"])]

    numeric_interval = pd.IntervalIndex(sorted([NUMERIC_INTERVALS[s] for s in size_query]))
    params_column = pd.to_numeric(df[AutoEvalColumn.params.name], errors="coerce")
    mask = params_column.apply(lambda x: any(numeric_interval.contains(x)))
    filtered_df = filtered_df.loc[mask]

    return filtered_df


leaderboard_df = filter_models(
    df=leaderboard_df,
    type_query=[t.to_str(" : ") for t in ModelType],
    size_query=list(NUMERIC_INTERVALS.keys()),
    precision_query=[i.value.name for i in Precision],
    hide_models=["Private or deleted", "Contains a merge/moerge", "Flagged"],  # Deleted, merges, flagged, MoEs
)

demo = gr.Blocks(css=custom_css)
with demo:
    gr.HTML(TITLE)
    gr.Markdown(INTRODUCTION_TEXT, elem_classes="markdown-text")

    with gr.Tabs(elem_classes="tab-buttons") as tabs:
        with gr.TabItem("🏅 LLM Benchmark", elem_id="llm-benchmark-tab-table", id=0):
            with gr.Row():
                with gr.Column():
                    with gr.Row():
                        search_bar = gr.Textbox(
                            placeholder="🔍 Search models or licenses (e.g., 'model_name; license: MIT') and press ENTER...",
                            show_label=False,
                            elem_id="search-bar",
                        )
                    with gr.Row():
                        shown_columns = gr.CheckboxGroup(
                            choices=[
                                c.name
                                for c in fields(AutoEvalColumn)
                                if not c.hidden and not c.never_hidden and not c.dummy
                            ],
                            value=[
                                c.name
                                for c in fields(AutoEvalColumn)
                                if c.displayed_by_default and not c.hidden and not c.never_hidden
                            ],
                            label="Select columns to show",
                            elem_id="column-select",
                            interactive=True,
                        )
                    with gr.Row():
                        hide_models = gr.CheckboxGroup(
                            label="Hide models",
                            choices=["Private or deleted", "Contains a merge/moerge", "Flagged", "MoE"],
                            value=["Private or deleted", "Contains a merge/moerge", "Flagged"],
                            interactive=True,
                        )
                with gr.Column(min_width=320):
                    # with gr.Box(elem_id="box-filter"):
                    filter_columns_type = gr.CheckboxGroup(
                        label="Model types",
                        choices=[t.to_str() for t in ModelType],
                        value=[t.to_str() for t in ModelType],
                        interactive=True,
                        elem_id="filter-columns-type",
                    )
                    filter_columns_precision = gr.CheckboxGroup(
                        label="Precision",
                        choices=[i.value.name for i in Precision],
                        value=[i.value.name for i in Precision],
                        interactive=True,
                        elem_id="filter-columns-precision",
                    )
                    filter_columns_size = gr.CheckboxGroup(
                        label="Model sizes (in billions of parameters)",
                        choices=list(NUMERIC_INTERVALS.keys()),
                        value=list(NUMERIC_INTERVALS.keys()),
                        interactive=True,
                        elem_id="filter-columns-size",
                    )

            leaderboard_table = gr.components.Dataframe(
                value=leaderboard_df[
                    [c.name for c in fields(AutoEvalColumn) if c.never_hidden]
                    + shown_columns.value
                    + [AutoEvalColumn.fullname.name]
                ],
                headers=[c.name for c in fields(AutoEvalColumn) if c.never_hidden] + shown_columns.value,
                datatype=TYPES,
                elem_id="leaderboard-table",
                interactive=False,
                visible=True,
            )

            # Dummy leaderboard for handling the case when the user uses backspace key
            hidden_leaderboard_table_for_search = gr.components.Dataframe(
                value=original_df[COLS],
                headers=COLS,
                datatype=TYPES,
                visible=False,
            )
            search_bar.submit(
                update_table,
                [
                    hidden_leaderboard_table_for_search,
                    shown_columns,
                    filter_columns_type,
                    filter_columns_precision,
                    filter_columns_size,
                    hide_models,
                    search_bar,
                ],
                leaderboard_table,
            )

            # Define a hidden component that will trigger a reload only if a query parameter has been set
            hidden_search_bar = gr.Textbox(value="", visible=False)
            hidden_search_bar.change(
                update_table,
                [
                    hidden_leaderboard_table_for_search,
                    shown_columns,
                    filter_columns_type,
                    filter_columns_precision,
                    filter_columns_size,
                    hide_models,
                    search_bar,
                ],
                leaderboard_table,
            )
            # Check query parameter once at startup and update search bar + hidden component
            demo.load(load_query, inputs=[], outputs=[search_bar, hidden_search_bar])

            for selector in [
                shown_columns,
                filter_columns_type,
                filter_columns_precision,
                filter_columns_size,
                hide_models,
            ]:
                selector.change(
                    update_table,
                    [
                        hidden_leaderboard_table_for_search,
                        shown_columns,
                        filter_columns_type,
                        filter_columns_precision,
                        filter_columns_size,
                        hide_models,
                        search_bar,
                    ],
                    leaderboard_table,
                    queue=True,
                )

        with gr.TabItem("📈 Metrics through time", elem_id="llm-benchmark-tab-table", id=2):
            with gr.Row():
                with gr.Column():
                    plot_df = load_and_create_plots()
                    chart = create_metric_plot_obj(
                        plot_df,
                        [AutoEvalColumn.average.name],
                        title="Average of Top Scores and Human Baseline Over Time (from last update)",
                    )
                    gr.Plot(value=chart, min_width=500)
                with gr.Column():
                    plot_df = load_and_create_plots()
                    chart = create_metric_plot_obj(
                        plot_df,
                        BENCHMARK_COLS,
                        title="Top Scores and Human Baseline Over Time (from last update)",
                    )
                    gr.Plot(value=chart, min_width=500)

        with gr.TabItem("📝 About", elem_id="llm-benchmark-tab-table", id=3):
            gr.Markdown(LLM_BENCHMARKS_TEXT, elem_classes="markdown-text")

        with gr.TabItem("❗FAQ", elem_id="llm-benchmark-tab-table", id=4):
            gr.Markdown(FAQ_TEXT, elem_classes="markdown-text")

        with gr.TabItem("🚀 Submit ", elem_id="llm-benchmark-tab-table", id=5):
            with gr.Column():
                with gr.Row():
                    gr.Markdown(EVALUATION_QUEUE_TEXT, elem_classes="markdown-text")

            with gr.Row():
                gr.Markdown("# ✉️✨ Submit your model here!", elem_classes="markdown-text")

            with gr.Row():
                with gr.Column():
                    model_name_textbox = gr.Textbox(label="Model name")
                    revision_name_textbox = gr.Textbox(label="Revision commit", placeholder="main")
                    private = gr.Checkbox(False, label="Private", visible=not IS_PUBLIC)
                    model_type = gr.Dropdown(
                        choices=[t.to_str(" : ") for t in ModelType if t != ModelType.Unknown],
                        label="Model type",
                        multiselect=False,
                        value=ModelType.FT.to_str(" : "),
                        interactive=True,
                    )

                with gr.Column():
                    precision = gr.Dropdown(
                        choices=[i.value.name for i in Precision if i != Precision.Unknown],
                        label="Precision",
                        multiselect=False,
                        value="float16",
                        interactive=True,
                    )
                    weight_type = gr.Dropdown(
                        choices=[i.value.name for i in WeightType],
                        label="Weights type",
                        multiselect=False,
                        value="Original",
                        interactive=True,
                    )
                    base_model_name_textbox = gr.Textbox(label="Base model (for delta or adapter weights)")

            with gr.Column():
                with gr.Accordion(
                    f"✅ Finished Evaluations ({len(finished_eval_queue_df)})",
                    open=False,
                ):
                    with gr.Row():
                        finished_eval_table = gr.components.Dataframe(
                            value=finished_eval_queue_df,
                            headers=EVAL_COLS,
                            datatype=EVAL_TYPES,
                            row_count=5,
                        )
                with gr.Accordion(
                    f"🔄 Running Evaluation Queue ({len(running_eval_queue_df)})",
                    open=False,
                ):
                    with gr.Row():
                        running_eval_table = gr.components.Dataframe(
                            value=running_eval_queue_df,
                            headers=EVAL_COLS,
                            datatype=EVAL_TYPES,
                            row_count=5,
                        )

                with gr.Accordion(
                    f"⏳ Pending Evaluation Queue ({len(pending_eval_queue_df)})",
                    open=False,
                ):
                    with gr.Row():
                        pending_eval_table = gr.components.Dataframe(
                            value=pending_eval_queue_df,
                            headers=EVAL_COLS,
                            datatype=EVAL_TYPES,
                            row_count=5,
                        )

            submit_button = gr.Button("Submit Eval")
            submission_result = gr.Markdown()
            submit_button.click(
                add_new_eval,
                [
                    model_name_textbox,
                    base_model_name_textbox,
                    revision_name_textbox,
                    precision,
                    private,
                    weight_type,
                    model_type,
                ],
                submission_result,
            )

    with gr.Row():
        with gr.Accordion("📙 Citation", open=False):
            citation_button = gr.Textbox(
                value=CITATION_BUTTON_TEXT,
                label=CITATION_BUTTON_LABEL,
                lines=20,
                elem_id="citation-button",
                show_copy_button=True,
            )

scheduler = BackgroundScheduler()
scheduler.add_job(restart_space, "interval", hours=3)  # restarted every 3h
scheduler.add_job(update_dynamic_files, "interval", hours=2)  # launched every 2 hour
scheduler.start()

demo.queue(default_concurrency_limit=40).launch()
