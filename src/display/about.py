from src.display.utils import ModelType

TITLE = """<h1 style="text-align:left;float:left; id="space-title">🤗 Open LLM Leaderboard</h1> <h3 style="text-align:left;float:left;> Track, rank and evaluate open LLMs and chatbots </h3>"""

INTRODUCTION_TEXT = """
Feeling lost? Documentation is [here](https://huggingface.co/docs/leaderboards/open_llm_leaderboard/about) 📄
You'll notably find explanations on the evaluations we are using, reproducibility guidelines, best practices on how to submit a model, and our FAQ.
"""

icons = f"""
- {ModelType.PT.to_str(" : ")} model: new, base models, trained on a given text corpora using masked modelling
- {ModelType.CPT.to_str(" : ")} model: new, base models, continuously trained on further corpus (which may include IFT/chat data) using masked modelling
- {ModelType.FT.to_str(" : ")} model: pretrained models finetuned on more data
- {ModelType.chat.to_str(" : ")} model: chat like fine-tunes, either using IFT (datasets of task instruction), RLHF or DPO (changing the model loss a bit with an added policy), etc
- {ModelType.merges.to_str(" : ")} model: merges or MoErges, models which have been merged or fused without additional fine-tuning. 
"""
LLM_BENCHMARKS_TEXT = """
## ABOUT
With the plethora of large language models (LLMs) and chatbots being released week upon week, often with grandiose claims of their performance, it can be hard to filter out the genuine progress that is being made by the open-source community and which model is the current state of the art.

🤗 Submit a model for automated evaluation on the 🤗 GPU cluster on the "Submit" page!
The leaderboard's backend runs the great [Eleuther AI Language Model Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness) - read more details below!

### Tasks 
📈 We evaluate models on 6 key benchmarks using the <a href="https://github.com/EleutherAI/lm-evaluation-harness" target="_blank">  Eleuther AI Language Model Evaluation Harness </a>, a unified framework to test generative language models on a large number of different evaluation tasks.

- <a href="https://arxiv.org/abs/1803.05457" target="_blank">  AI2 Reasoning Challenge </a> (25-shot) - a set of grade-school science questions.
- <a href="https://arxiv.org/abs/1905.07830" target="_blank">  HellaSwag </a> (10-shot) - a test of commonsense inference, which is easy for humans (~95%) but challenging for SOTA models.
- <a href="https://arxiv.org/abs/2009.03300" target="_blank">  MMLU </a>  (5-shot) - a test to measure a text model's multitask accuracy. The test covers 57 tasks including elementary mathematics, US history, computer science, law, and more.
- <a href="https://arxiv.org/abs/2109.07958" target="_blank">  TruthfulQA </a> (0-shot) - a test to measure a model's propensity to reproduce falsehoods commonly found online. Note: TruthfulQA is technically a 6-shot task in the Harness because each example is prepended with 6 Q/A pairs, even in the 0-shot setting.
- <a href="https://arxiv.org/abs/1907.10641" target="_blank">  Winogrande </a> (5-shot) - an adversarial and difficult Winograd benchmark at scale, for commonsense reasoning.
- <a href="https://arxiv.org/abs/2110.14168" target="_blank">  GSM8k </a> (5-shot) - diverse grade school math word problems to measure a model's ability to solve multi-step mathematical reasoning problems.

For all these evaluations, a higher score is a better score.
We chose these benchmarks as they test a variety of reasoning and general knowledge across a wide variety of fields in 0-shot and few-shot settings.

### Results
You can find:
- detailed numerical results in the `results` Hugging Face dataset: https://huggingface.co/datasets/open-llm-leaderboard/results
- details on the input/outputs for the models in the `details` of each model, which you can access by clicking the 📄 emoji after the model name
- community queries and running status in the `requests` Hugging Face dataset: https://huggingface.co/datasets/open-llm-leaderboard/requests

If a model's name contains "Flagged", this indicates it has been flagged by the community, and should probably be ignored! Clicking the link will redirect you to the discussion about the model.

---------------------------

## REPRODUCIBILITY
To reproduce our results, here are the commands you can run, using [this version](https://github.com/EleutherAI/lm-evaluation-harness/tree/b281b0921b636bc36ad05c0b0b0763bd6dd43463) of the Eleuther AI Harness:
`python main.py --model=hf-causal-experimental --model_args="pretrained=<your_model>,use_accelerate=True,revision=<your_model_revision>"`
` --tasks=<task_list> --num_fewshot=<n_few_shot> --batch_size=1 --output_path=<output_path>`

```
python main.py --model=hf-causal-experimental \
    --model_args="pretrained=<your_model>,use_accelerate=True,revision=<your_model_revision>" \
    --tasks=<task_list> \
    --num_fewshot=<n_few_shot> \
    --batch_size=1 \
    --output_path=<output_path>
```

**Note:** We evaluate all models on a single node of 8 H100s, so the global batch size is 8 for each evaluation. If you don't use parallelism, adapt your batch size to fit.
*You can expect results to vary slightly for different batch sizes because of padding.*

The tasks and few shots parameters are:
- ARC: 25-shot, *arc-challenge* (`acc_norm`)
- HellaSwag: 10-shot, *hellaswag* (`acc_norm`)
- TruthfulQA: 0-shot, *truthfulqa-mc* (`mc2`)
- MMLU: 5-shot, *hendrycksTest-abstract_algebra,hendrycksTest-anatomy,hendrycksTest-astronomy,hendrycksTest-business_ethics,hendrycksTest-clinical_knowledge,hendrycksTest-college_biology,hendrycksTest-college_chemistry,hendrycksTest-college_computer_science,hendrycksTest-college_mathematics,hendrycksTest-college_medicine,hendrycksTest-college_physics,hendrycksTest-computer_security,hendrycksTest-conceptual_physics,hendrycksTest-econometrics,hendrycksTest-electrical_engineering,hendrycksTest-elementary_mathematics,hendrycksTest-formal_logic,hendrycksTest-global_facts,hendrycksTest-high_school_biology,hendrycksTest-high_school_chemistry,hendrycksTest-high_school_computer_science,hendrycksTest-high_school_european_history,hendrycksTest-high_school_geography,hendrycksTest-high_school_government_and_politics,hendrycksTest-high_school_macroeconomics,hendrycksTest-high_school_mathematics,hendrycksTest-high_school_microeconomics,hendrycksTest-high_school_physics,hendrycksTest-high_school_psychology,hendrycksTest-high_school_statistics,hendrycksTest-high_school_us_history,hendrycksTest-high_school_world_history,hendrycksTest-human_aging,hendrycksTest-human_sexuality,hendrycksTest-international_law,hendrycksTest-jurisprudence,hendrycksTest-logical_fallacies,hendrycksTest-machine_learning,hendrycksTest-management,hendrycksTest-marketing,hendrycksTest-medical_genetics,hendrycksTest-miscellaneous,hendrycksTest-moral_disputes,hendrycksTest-moral_scenarios,hendrycksTest-nutrition,hendrycksTest-philosophy,hendrycksTest-prehistory,hendrycksTest-professional_accounting,hendrycksTest-professional_law,hendrycksTest-professional_medicine,hendrycksTest-professional_psychology,hendrycksTest-public_relations,hendrycksTest-security_studies,hendrycksTest-sociology,hendrycksTest-us_foreign_policy,hendrycksTest-virology,hendrycksTest-world_religions* (average of all the results `acc`)
- Winogrande: 5-shot, *winogrande* (`acc`)
- GSM8k: 5-shot, *gsm8k* (`acc`)

Side note on the baseline scores: 
- for log-likelihood evaluation, we select the random baseline
- for GSM8K, we select the score obtained in the paper after finetuning a 6B model on the full GSM8K training set for 50 epochs

---------------------------

## RESOURCES

### Quantization
To get more information about quantization, see:
- 8 bits: [blog post](https://huggingface.co/blog/hf-bitsandbytes-integration), [paper](https://arxiv.org/abs/2208.07339)
- 4 bits: [blog post](https://huggingface.co/blog/4bit-transformers-bitsandbytes), [paper](https://arxiv.org/abs/2305.14314)

### Useful links
- [Community resources](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard/discussions/174)
- [Collection of best models](https://huggingface.co/collections/open-llm-leaderboard/llm-leaderboard-best-models-652d6c7965a4619fb5c27a03)

### Other cool leaderboards:
- [LLM safety](https://huggingface.co/spaces/AI-Secure/llm-trustworthy-leaderboard)
- [LLM performance](https://huggingface.co/spaces/optimum/llm-perf-leaderboard)


"""

FAQ_TEXT = """

## SUBMISSIONS
My model requires `trust_remote_code=True`, can I submit it?
- *We only support models that have been integrated into a stable version of the `transformers` library for automatic submission, as we don't want to run possibly unsafe code on our cluster.*

What about models of type X? 
- *We only support models that have been integrated into a stable version of the `transformers` library for automatic submission.*

How can I follow when my model is launched?
- *You can look for its request file [here](https://huggingface.co/datasets/open-llm-leaderboard/requests) and follow the status evolution, or directly in the queues above the submit form.*

My model disappeared from all the queues, what happened?
- *A model disappearing from all the queues usually means that there has been a failure. You can check if that is the case by looking for your model [here](https://huggingface.co/datasets/open-llm-leaderboard/requests).*

What causes an evaluation failure?
- *Most of the failures we get come from problems in the submissions (corrupted files, config problems, wrong parameters selected for eval ...), so we'll be grateful if you first make sure you have followed the steps in `About`. However, from time to time, we have failures on our side (hardware/node failures, problems with an update of our backend, connectivity problems ending up in the results not being saved, ...).*

How can I report an evaluation failure?
- *As we store the logs for all models, feel free to create an issue, **where you link to the requests file of your model** (look for it [here](https://huggingface.co/datasets/open-llm-leaderboard/requests/tree/main)), so we can investigate! If the model failed due to a problem on our side, we'll relaunch it right away!* 
*Note: Please do not re-upload your model under a different name, it will not help*

---------------------------

## RESULTS
What kind of information can I find?
- *Let's imagine you are interested in the Yi-34B results. You have access to 3 different information categories:*
      - *The [request file](https://huggingface.co/datasets/open-llm-leaderboard/requests/blob/main/01-ai/Yi-34B_eval_request_False_bfloat16_Original.json): it gives you information about the status of the evaluation*
      - *The [aggregated results folder](https://huggingface.co/datasets/open-llm-leaderboard/results/tree/main/01-ai/Yi-34B): it gives you aggregated scores, per experimental run*
      - *The [details dataset](https://huggingface.co/datasets/open-llm-leaderboard/details_01-ai__Yi-34B/tree/main): it gives you the full details (scores and examples for each task and a given model)*


Why do models appear several times in the leaderboard? 
- *We run evaluations with user-selected precision and model commit. Sometimes, users submit specific models at different commits and at different precisions (for example, in float16 and 4bit to see how quantization affects performance). You should be able to verify this by displaying the `precision` and `model sha` columns in the display. If, however, you see models appearing several times with the same precision and hash commit, this is not normal.*

What is this concept of "flagging"?
- *This mechanism allows users to report models that have unfair performance on the leaderboard. This contains several categories: exceedingly good results on the leaderboard because the model was (maybe accidentally) trained on the evaluation data, models that are copies of other models not attributed properly, etc.*

My model has been flagged improperly, what can I do?
- *Every flagged model has a discussion associated with it - feel free to plead your case there, and we'll see what to do together with the community.*

---------------------------

## HOW TO SEARCH FOR A MODEL
Search for models in the leaderboard by:
1. Name, e.g., *model_name*
2. Multiple names, separated by `;`, e.g., *model_name1;model_name2*
3. License, prefix with `Hub License:...`, e.g., *Hub License: MIT*
4. Combination of name and license, order is irrelevant, e.g., *model_name; Hub License: cc-by-sa-4.0*

---------------------------

## EDITING SUBMISSIONS
I upgraded my model and want to re-submit, how can I do that?
- *Please open an issue with the precise name of your model, and we'll remove your model from the leaderboard so you can resubmit. You can also resubmit directly with the new commit hash!* 

I need to rename my model, how can I do that?
- *You can use @Weyaxi 's [super cool tool](https://huggingface.co/spaces/Weyaxi/open-llm-leaderboard-renamer) to request model name changes, then open a discussion where you link to the created pull request, and we'll check them and merge them as needed.*

---------------------------

## OTHER
Why do you differentiate between pretrained, continuously pretrained, fine-tuned, merges, etc?
- *These different models do not play in the same categories, and therefore need to be separated for fair comparison. Base pretrained models are the most interesting for the community, as they are usually good models to fine-tune later on - any jump in performance from a pretrained model represents a true improvement on the SOTA. 
Fine-tuned and IFT/RLHF/chat models usually have better performance, but the latter might be more sensitive to system prompts, which we do not cover at the moment in the Open LLM Leaderboard. 
Merges and moerges have artificially inflated performance on test sets, which is not always explainable, and does not always apply to real-world situations.*

What should I use the leaderboard for?
- *We recommend using the leaderboard for 3 use cases: 1) getting an idea of the state of open pretrained models, by looking only at the ranks and score of this category; 2) experimenting with different fine-tuning methods, datasets, quantization techniques, etc, and comparing their score in a reproducible setup, and 3) checking the performance of a model of interest to you, wrt to other models of its category.*

Why don't you display closed-source model scores? 
- *This is a leaderboard for Open models, both for philosophical reasons (openness is cool) and for practical reasons: we want to ensure that the results we display are accurate and reproducible, but 1) commercial closed models can change their API thus rendering any scoring at a given time incorrect 2) we re-run everything on our cluster to ensure all models are run on the same setup and you can't do that for these models.*

I have an issue with accessing the leaderboard through the Gradio API
- *Since this is not the recommended way to access the leaderboard, we won't provide support for this, but you can look at tools provided by the community for inspiration!*

I have another problem, help!
- *Please open an issue in the discussion tab, and we'll do our best to help you in a timely manner :) *
"""


EVALUATION_QUEUE_TEXT = f"""
# Evaluation Queue for the 🤗 Open LLM Leaderboard

Models added here will be automatically evaluated on the 🤗 cluster.

## Don't forget to read the FAQ and the About tabs for more information!

## First steps before submitting a model

### 1) Make sure you can load your model and tokenizer using AutoClasses:
```python
from transformers import AutoConfig, AutoModel, AutoTokenizer
config = AutoConfig.from_pretrained("your model name", revision=revision)
model = AutoModel.from_pretrained("your model name", revision=revision)
tokenizer = AutoTokenizer.from_pretrained("your model name", revision=revision)
```
If this step fails, follow the error messages to debug your model before submitting it. It's likely your model has been improperly uploaded.

Note: make sure your model is public!
Note: if your model needs `use_remote_code=True`, we do not support this option yet but we are working on adding it, stay posted!

### 2) Convert your model weights to [safetensors](https://huggingface.co/docs/safetensors/index)
It's a new format for storing weights which is safer and faster to load and use. It will also allow us to add the number of parameters of your model to the `Extended Viewer`!

### 3) Make sure your model has an open license!
This is a leaderboard for Open LLMs, and we'd love for as many people as possible to know they can use your model 🤗

### 4) Fill up your model card
When we add extra information about models to the leaderboard, it will be automatically taken from the model card

### 5) Select the correct precision
Not all models are converted properly from `float16` to `bfloat16`, and selecting the wrong precision can sometimes cause evaluation error (as loading a `bf16` model in `fp16` can sometimes generate NaNs, depending on the weight range).

<b>Note:</b> Please be advised that when submitting, git <b>branches</b> and <b>tags</b> will be strictly tied to the <b>specific commit</b> present at the time of submission. This ensures revision consistency.
## Model types
{icons}
"""

CITATION_BUTTON_LABEL = "Copy the following snippet to cite these results"
CITATION_BUTTON_TEXT = r"""
@misc{open-llm-leaderboard-v2,
  author = {Clémentine Fourrier and Nathan Habib and Alina Lozovskaya and Konrad Szafer and Thomas Wolf},
  title = {Open LLM Leaderboard v2},
  year = {2024},
  publisher = {Hugging Face},
  howpublished = "\url{https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard}",
}

@software{eval-harness,
  author       = {Gao, Leo and
                  Tow, Jonathan and
                  Biderman, Stella and
                  Black, Sid and
                  DiPofi, Anthony and
                  Foster, Charles and
                  Golding, Laurence and
                  Hsu, Jeffrey and
                  McDonell, Kyle and
                  Muennighoff, Niklas and
                  Phang, Jason and
                  Reynolds, Laria and
                  Tang, Eric and
                  Thite, Anish and
                  Wang, Ben and
                  Wang, Kevin and
                  Zou, Andy},
  title        = {A framework for few-shot language model evaluation},
  month        = sep,
  year         = 2021,
  publisher    = {Zenodo},
  version      = {v0.0.1},
  doi          = {10.5281/zenodo.5371628},
  url          = {https://doi.org/10.5281/zenodo.5371628},
}

@misc{zhou2023instructionfollowingevaluationlargelanguage,
  title={Instruction-Following Evaluation for Large Language Models},
  author={Jeffrey Zhou and Tianjian Lu and Swaroop Mishra and Siddhartha Brahma and Sujoy Basu and Yi Luan and Denny Zhou and Le Hou},
  year={2023},
  eprint={2311.07911},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2311.07911},
}

@misc{suzgun2022challengingbigbenchtaskschainofthought,
  title={Challenging BIG-Bench Tasks and Whether Chain-of-Thought Can Solve Them},
  author={Mirac Suzgun and Nathan Scales and Nathanael Schärli and Sebastian Gehrmann and Yi Tay and Hyung Won Chung and Aakanksha Chowdhery and Quoc V. Le and Ed H. Chi and Denny Zhou and Jason Wei},
  year={2022},
  eprint={2210.09261},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2210.09261},
}

@misc{hendrycks2021measuringmathematicalproblemsolving,
  title={Measuring Mathematical Problem Solving With the MATH Dataset},
  author={Dan Hendrycks and Collin Burns and Saurav Kadavath and Akul Arora and Steven Basart and Eric Tang and Dawn Song and Jacob Steinhardt},
  year={2021},
  eprint={2103.03874},
  archivePrefix={arXiv},
  primaryClass={cs.LG},
  url={https://arxiv.org/abs/2103.03874},
}

@misc{rein2023gpqagraduatelevelgoogleproofqa,
  title={GPQA: A Graduate-Level Google-Proof Q&A Benchmark},
  author={David Rein and Betty Li Hou and Asa Cooper Stickland and Jackson Petty and Richard Yuanzhe Pang and Julien Dirani and Julian Michael and Samuel R. Bowman},
  year={2023},
  eprint={2311.12022},
  archivePrefix={arXiv},
  primaryClass={cs.AI},
  url={https://arxiv.org/abs/2311.12022},
}

@misc{sprague2024musrtestinglimitschainofthought,
  title={MuSR: Testing the Limits of Chain-of-thought with Multistep Soft Reasoning},
  author={Zayne Sprague and Xi Ye and Kaj Bostrom and Swarat Chaudhuri and Greg Durrett},
  year={2024},
  eprint={2310.16049},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2310.16049},
}

@misc{wang2024mmluprorobustchallengingmultitask,
  title={MMLU-Pro: A More Robust and Challenging Multi-Task Language Understanding Benchmark},
  author={Yubo Wang and Xueguang Ma and Ge Zhang and Yuansheng Ni and Abhranil Chandra and Shiguang Guo and Weiming Ren and Aaran Arulraj and Xuan He and Ziyan Jiang and Tianle Li and Max Ku and Kai Wang and Alex Zhuang and Rongqi Fan and Xiang Yue and Wenhu Chen},
  year={2024},
  eprint={2406.01574},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2406.01574},
}
"""
