import os
import logging
import time
import datetime
import gradio as gr
import datasets
from huggingface_hub import snapshot_download, WebhooksServer, WebhookPayload, RepoCard
from gradio_leaderboard import Leaderboard, ColumnFilter, SelectColumns

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
    AutoEvalColumn,
    ModelType,
    Precision,
    WeightType,
    fields,
)
from src.envs import (
    API,
    EVAL_REQUESTS_PATH,
    AGGREGATED_REPO,
    HF_TOKEN,
    QUEUE_REPO,
    REPO_ID,
    HF_HOME,
)
from src.populate import get_evaluation_queue_df, get_leaderboard_df
from src.submission.submit import add_new_eval
from src.tools.plots import create_metric_plot_obj, create_plot_df, create_scores_df

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


# Convert the environment variable "LEADERBOARD_FULL_INIT" to a boolean value, defaulting to True if the variable is not set.
# This controls whether a full initialization should be performed.
DO_FULL_INIT = os.getenv("LEADERBOARD_FULL_INIT", "True") == "True"
LAST_UPDATE_LEADERBOARD = datetime.datetime.now()

def restart_space():
    API.restart_space(repo_id=REPO_ID, token=HF_TOKEN)


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
            wait_time = backoff_factor**attempt
            logging.error(f"Error downloading {repo_id}: {e}, retrying in {wait_time}s")
            time.sleep(wait_time)
            attempt += 1
    raise Exception(f"Failed to download {repo_id} after {max_attempts} attempts")

def get_latest_data_leaderboard(leaderboard_initial_df = None):
    current_time = datetime.datetime.now()
    global LAST_UPDATE_LEADERBOARD
    if current_time - LAST_UPDATE_LEADERBOARD < datetime.timedelta(minutes=10) and leaderboard_initial_df is not None:
        return leaderboard_initial_df
    LAST_UPDATE_LEADERBOARD = current_time
    leaderboard_dataset = datasets.load_dataset(
        AGGREGATED_REPO, 
        "default", 
        split="train", 
        cache_dir=HF_HOME, 
        download_mode=datasets.DownloadMode.REUSE_DATASET_IF_EXISTS, # Uses the cached dataset 
        verification_mode="no_checks"
    )

    leaderboard_df = get_leaderboard_df(
        leaderboard_dataset=leaderboard_dataset, 
        cols=COLS,
        benchmark_cols=BENCHMARK_COLS,
    )

    return leaderboard_df

def get_latest_data_queue():
    eval_queue_dfs = get_evaluation_queue_df(EVAL_REQUESTS_PATH, EVAL_COLS)
    return eval_queue_dfs

def init_space():
    """Initializes the application space, loading only necessary data."""
    if DO_FULL_INIT:
        # These downloads only occur on full initialization
        try:
            download_dataset(QUEUE_REPO, EVAL_REQUESTS_PATH)
        except Exception:
            restart_space()

    # Always redownload the leaderboard DataFrame
    leaderboard_df = get_latest_data_leaderboard()

    # Evaluation queue DataFrame retrieval is independent of initialization detail level
    eval_queue_dfs = get_latest_data_queue()

    return leaderboard_df, eval_queue_dfs


# Calls the init_space function with the `full_init` parameter determined by the `do_full_init` variable.
# This initializes various DataFrames used throughout the application, with the level of initialization detail controlled by the `do_full_init` flag.
leaderboard_df, eval_queue_dfs = init_space()
finished_eval_queue_df, running_eval_queue_df, pending_eval_queue_df = eval_queue_dfs


# Data processing for plots now only on demand in the respective Gradio tab
def load_and_create_plots():
    plot_df = create_plot_df(create_scores_df(leaderboard_df))
    return plot_df

def init_leaderboard(dataframe):
    return Leaderboard(
        value = dataframe,
        datatype=[c.type for c in fields(AutoEvalColumn)],
        select_columns=SelectColumns(
            default_selection=[c.name for c in fields(AutoEvalColumn) if c.displayed_by_default],
            cant_deselect=[c.name for c in fields(AutoEvalColumn) if c.never_hidden or c.dummy],
            label="Select Columns to Display:",
        ),
        search_columns=[AutoEvalColumn.model.name, AutoEvalColumn.fullname.name, AutoEvalColumn.license.name],
        hide_columns=[c.name for c in fields(AutoEvalColumn) if c.hidden],
        filter_columns=[
            ColumnFilter(AutoEvalColumn.model_type.name, type="checkboxgroup", label="Model types"),
            ColumnFilter(AutoEvalColumn.precision.name, type="checkboxgroup", label="Precision"),
            ColumnFilter(
                AutoEvalColumn.params.name,
                type="slider",
                min=0.01,
                max=150,
                label="Select the number of parameters (B)",
            ),
            ColumnFilter(
                AutoEvalColumn.still_on_hub.name, type="boolean", label="Private or deleted", default=True
            ),
            ColumnFilter(
                AutoEvalColumn.merged.name, type="boolean", label="Contains a merge/moerge", default=True
            ),
            ColumnFilter(AutoEvalColumn.moe.name, type="boolean", label="MoE", default=False),
            ColumnFilter(AutoEvalColumn.not_flagged.name, type="boolean", label="Flagged", default=True),
        ],
        bool_checkboxgroup_label="Hide models",
    )

demo = gr.Blocks(css=custom_css)
with demo:
    gr.HTML(TITLE)
    gr.Markdown(INTRODUCTION_TEXT, elem_classes="markdown-text")

    with gr.Tabs(elem_classes="tab-buttons") as tabs:
        with gr.TabItem("🏅 LLM Benchmark", elem_id="llm-benchmark-tab-table", id=0):
            leaderboard = init_leaderboard(leaderboard_df)

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

        with gr.TabItem("🚀 Submit? ", elem_id="llm-benchmark-tab-table", id=5):
            countdown = gr.HTML(
                """<div align="center">
                <div position: relative>
                <img 
                    src="https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard/resolve/main/gif.gif" 
                    allowtransparency="true" 
                    style="display:block;width:100%;height:auto;" 
                />
                <iframe 
                    src="https://logwork.com/widget/countdown/?text=Surprise%20loading...&amp;timezone=Europe%2FParis&amp;width=&amp;style=circles&amp;uid=815898&amp;loc=https://logwork.com/countdown-fxmc&amp;language=en&amp;textcolor=&amp;background=%23ffd21e&amp;date=2024-06-26%2015%3A00%3A00&amp;digitscolor=%23ff9d00&amp;unitscolor=&amp" 
                    style="position: absolute; top:0; left: 0; border: medium; width:100%; height:100%; margin: 0px; visibility: visible;" 
                    scrolling="no" 
                    allowtransparency="true" 
                    frameborder="0"
                    allowfullscreen
                />
                </div>
                </div>"""
            )
            #gif = gr.Image(value="./gif.gif", interactive=False)
            gr.Markdown("*Countdown by Logwork.com, gif art by Chun Te Lee*")

    with gr.Row():
        with gr.Accordion("📙 Citation", open=False):
            citation_button = gr.Textbox(
                value=CITATION_BUTTON_TEXT,
                label=CITATION_BUTTON_LABEL,
                lines=20,
                elem_id="citation-button",
                show_copy_button=True,
            )

    demo.load(fn=get_latest_data_leaderboard, inputs=[leaderboard], outputs=[leaderboard])
    

demo.queue(default_concurrency_limit=40)

# Start ephemeral Spaces on PRs (see config in README.md)
from gradio_space_ci.webhook import IS_EPHEMERAL_SPACE, SPACE_ID, configure_space_ci

def enable_space_ci_and_return_server(ui: gr.Blocks) -> WebhooksServer:
    # Taken from https://huggingface.co/spaces/Wauplin/gradio-space-ci/blob/075119aee75ab5e7150bf0814eec91c83482e790/src/gradio_space_ci/webhook.py#L61
    # Compared to original, this one do not monkeypatch Gradio which allows us to define more webhooks.
    # ht to Lucain!
    if SPACE_ID is None:
        print("Not in a Space: Space CI disabled.")
        return WebhooksServer(ui=demo)

    if IS_EPHEMERAL_SPACE:
        print("In an ephemeral Space: Space CI disabled.")
        return WebhooksServer(ui=demo)

    card = RepoCard.load(repo_id_or_path=SPACE_ID, repo_type="space")
    config = card.data.get("space_ci", {})
    print(f"Enabling Space CI with config from README: {config}")

    return configure_space_ci(
        blocks=ui,
        trusted_authors=config.get("trusted_authors"),
        private=config.get("private", "auto"),
        variables=config.get("variables", "auto"),
        secrets=config.get("secrets"),
        hardware=config.get("hardware"),
        storage=config.get("storage"),
    )

# Create webhooks server (with CI url if in Space and not ephemeral)
webhooks_server = enable_space_ci_and_return_server(ui=demo)

# Add webhooks
@webhooks_server.add_webhook
def update_leaderboard(payload: WebhookPayload) -> None:
    """Redownloads the leaderboard dataset each time it updates"""
    if payload.repo.type == "dataset" and payload.event.action == "update":
        datasets.load_dataset(
            AGGREGATED_REPO, 
            "default", 
            split="train", 
            cache_dir=HF_HOME, 
            download_mode=datasets.DownloadMode.FORCE_REDOWNLOAD, 
            verification_mode="no_checks"
        )

# The below code is not used at the moment, as we can manage the queue file locally
LAST_UPDATE_QUEUE = datetime.datetime.now()
@webhooks_server.add_webhook    
def update_queue(payload: WebhookPayload) -> None:
    """Redownloads the queue dataset each time it updates"""
    if payload.repo.type == "dataset" and payload.event.action == "update":
        current_time = datetime.datetime.now()
        global LAST_UPDATE_QUEUE
        if current_time - LAST_UPDATE_QUEUE > datetime.timedelta(minutes=10):
            print("Would have updated the queue")
            # We only redownload is last update was more than 10 minutes ago, as the queue is 
            # updated regularly and heavy to download
            #download_dataset(QUEUE_REPO, EVAL_REQUESTS_PATH)
            LAST_UPDATE_QUEUE = datetime.datetime.now()

webhooks_server.launch()
