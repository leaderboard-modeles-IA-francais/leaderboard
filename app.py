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

demo = gr.Blocks(css=custom_css)
with demo:
    gr.HTML(TITLE)
    gr.Markdown(INTRODUCTION_TEXT, elem_classes="markdown-text")

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

demo.queue(default_concurrency_limit=40).launch()
