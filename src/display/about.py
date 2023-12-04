from src.display.utils import ModelType

TITLE = """<h1 align="center" id="space-title">🤗 Open LLM Leaderboard</h1>"""

INTRODUCTION_TEXT = """
📐 The 🤗 Open LLM Leaderboard aims to track, rank and evaluate open LLMs and chatbots.

🤗 Submit a model for automated evaluation on the 🤗 GPU cluster on the "Submit" page!
The leaderboard's backend runs the great [Eleuther AI Language Model Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness) - read more details in the "About" page!
"""

LLM_BENCHMARKS_TEXT = f"""
# Context
With the plethora of large language models (LLMs) and chatbots being released week upon week, often with grandiose claims of their performance, it can be hard to filter out the genuine progress that is being made by the open-source community and which model is the current state of the art.

## How it works

📈 We evaluate models on 7 key benchmarks using the <a href="https://github.com/EleutherAI/lm-evaluation-harness" target="_blank">  Eleuther AI Language Model Evaluation Harness </a>, a unified framework to test generative language models on a large number of different evaluation tasks.

- <a href="https://arxiv.org/abs/1803.05457" target="_blank">  AI2 Reasoning Challenge </a> (25-shot) - a set of grade-school science questions.
- <a href="https://arxiv.org/abs/1905.07830" target="_blank">  HellaSwag </a> (10-shot) - a test of commonsense inference, which is easy for humans (~95%) but challenging for SOTA models.
- <a href="https://arxiv.org/abs/2009.03300" target="_blank">  MMLU </a>  (5-shot) - a test to measure a text model's multitask accuracy. The test covers 57 tasks including elementary mathematics, US history, computer science, law, and more.
- <a href="https://arxiv.org/abs/2109.07958" target="_blank">  TruthfulQA </a> (0-shot) - a test to measure a model's propensity to reproduce falsehoods commonly found online. Note: TruthfulQA in the Harness is actually a minima a 6-shots task, as it is prepended by 6 examples systematically, even when launched using 0 for the number of few-shot examples.
- <a href="https://arxiv.org/abs/1907.10641" target="_blank">  Winogrande </a> (5-shot) - an adversarial and difficult Winograd benchmark at scale, for commonsense reasoning.
- <a href="https://arxiv.org/abs/2110.14168" target="_blank">  GSM8k </a> (5-shot) - diverse grade school math word problems to measure a model's ability to solve multi-step mathematical reasoning problems.

For all these evaluations, a higher score is a better score.
We chose these benchmarks as they test a variety of reasoning and general knowledge across a wide variety of fields in 0-shot and few-shot settings.

## Details and logs
You can find:
- detailed numerical results in the `results` Hugging Face dataset: https://huggingface.co/datasets/open-llm-leaderboard/results
- details on the input/outputs for the models in the `details` of each model, that you can access by clicking the 📄 emoji after the model name
- community queries and running status in the `requests` Hugging Face dataset: https://huggingface.co/datasets/open-llm-leaderboard/requests

## Reproducibility
To reproduce our results, here is the commands you can run, using [this version](https://github.com/EleutherAI/lm-evaluation-harness/tree/b281b0921b636bc36ad05c0b0b0763bd6dd43463) of the Eleuther AI Harness:
`python main.py --model=hf-causal-experimental --model_args="pretrained=<your_model>,use_accelerate=True,revision=<your_model_revision>"`
` --tasks=<task_list> --num_fewshot=<n_few_shot> --batch_size=1 --output_path=<output_path>`

The total batch size we get for models which fit on one A100 node is 8 (8 GPUs * 1). If you don't use parallelism, adapt your batch size to fit.
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

## Icons
- {ModelType.PT.to_str(" : ")} model: new, base models, trained on a given corpora
- {ModelType.FT.to_str(" : ")} model: pretrained models finetuned on more data
Specific fine-tune subcategories (more adapted to chat):
- {ModelType.IFT.to_str(" : ")} model: instruction fine-tunes, which are model fine-tuned specifically on datasets of task instruction 
- {ModelType.RL.to_str(" : ")} model: reinforcement fine-tunes, which usually change the model loss a bit with an added policy. 
If there is no icon, we have not uploaded the information on the model yet, feel free to open an issue with the model information!

"Flagged" indicates that this model has been flagged by the community, and should probably be ignored! Clicking the link will redirect you to the discussion about the model.

## Quantization
To get more information about quantization, see:
- 8 bits: [blog post](https://huggingface.co/blog/hf-bitsandbytes-integration), [paper](https://arxiv.org/abs/2208.07339)
- 4 bits: [blog post](https://huggingface.co/blog/4bit-transformers-bitsandbytes), [paper](https://arxiv.org/abs/2305.14314)

## Useful links
- [Community resources](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard/discussions/174)
- [Collection of best models](https://huggingface.co/collections/open-llm-leaderboard/llm-leaderboard-best-models-652d6c7965a4619fb5c27a03)
"""

FAQ_TEXT = """
---------------------------
# FAQ
Below are some common questions - if this FAQ does not answer you, feel free to create a new issue, and we'll take care of it as soon as we can! 

## 1) Submitting a model
My model requires `trust_remote_code=True`, can I submit it?
- *We only support models that have been integrated in a stable version of the `transformers` library for automatic submission, as we don't want to run possibly unsage code on our cluster.*

What about models of type X? 
- *We only support models that have been integrated in a stable version of the `transformers` library for automatic submission.*

How can I follow when my model is launched?
- *You can look for its request file [here](https://huggingface.co/datasets/open-llm-leaderboard/requests) and follow the status evolution, or directly in the queues above the submit form.*

My model disappeared from all the queues, what happened?
- *A model disappearing from all the queues usually means that there has been a failure. You can check if that is the case by looking for your model [here](https://huggingface.co/datasets/open-llm-leaderboard/requests).*

What causes an evaluation failure?
- *Most of the failures we get come from problems in the submissions (corrupted files, config problems, wrong parameters selected for eval ...), so we'll be grateful if you first make sure you have followed the steps in `About`. However, from time to time, we have failures on our side (hardware/node failures, problem with an update of our backend, connectivity problem ending up in the results not being saved, ...).*

How can I report an evaluation failure?
- *As we store the logs for all models, feel free to create an issue, **where you link to the requests file of your model** (look for it [here](https://huggingface.co/datasets/open-llm-leaderboard/requests/tree/main)), so we can investigate! If the model failed due to a problem on our side, we'll relaunch it right away!* 
*Note: Please do not re-upload your model under a different name, it will not help*

## 2) Model results
What kind of information can I find?
- *Let's imagine you are interested in the Yi-34B results. You have access to 3 different information categories:*
      - *The [request file](https://huggingface.co/datasets/open-llm-leaderboard/requests/blob/main/01-ai/Yi-34B_eval_request_False_bfloat16_Original.json): it gives you information about the status of the evaluation*
      - *The [aggregated results folder](https://huggingface.co/datasets/open-llm-leaderboard/results/tree/main/01-ai/Yi-34B): it gives you aggregated scores, per experimental run*
      - *The [details dataset](https://huggingface.co/datasets/open-llm-leaderboard/details_01-ai__Yi-34B/tree/main): it gives you the full details (scores and examples for each task and a given model)*


Why do models appear several times in the leaderboard? 
- *We run evaluations with user selected precision and model commit. Sometimes, users submit specific models at different commits and at different precisions (for example, in float16 and 4bit to see how quantization affects performance). You should be able to verify this by displaying the `precision` and `model sha` columns in the display. If, however, you see models appearing several time with the same precision and hash commit, this is not normal.*

What is this concept of "flagging"?
- *This mechanism allows user to report models that have unfair performance on the leaderboard. This contains several categories: exceedingly good results on the leaderboard because the model was (maybe accidentally) trained on the evaluation data, models that are copy of other models not atrributed properly, etc.*

My model has been flagged improperly, what can I do?
- *Every flagged model has a discussion associated with it - feel free to plead your case there, and we'll see what to do together with the community.*

## 3) Editing a submission
I upgraded my model and want to re-submit, how can I do that?
- *Please open an issue with the precise name of your model, and we'll remove your model from the leaderboard so you can resubmit. You can also resubmit directly with the new commit hash!* 

I need to rename my model, how can I do that?
- *You can use @Weyaxi 's [super cool tool](https://huggingface.co/spaces/Weyaxi/open-llm-leaderboard-renamer) to request model name changes, then open a discussion where you link to the created pull request, and we'll check them and merge them as needed.*

## 4) Other
Why don't you display closed source model scores? 
- *This is a leaderboard for Open models, both for philosophical reasons (openness is cool) and for practical reasons: we want to ensure that the results we display are accurate and reproducible, but 1) commercial closed models can change their API thus rendering any scoring at a given time incorrect 2) we re-run everything on our cluster to ensure all models are run on the same setup and you can't do that for these models.*

I have an issue about accessing the leaderboard through the Gradio API
- *Since this is not the recommended way to access the leaderboard, we won't provide support for this, but you can look at tools provided by the community for inspiration!*
"""


EVALUATION_QUEUE_TEXT = """
# Evaluation Queue for the 🤗 Open LLM Leaderboard

Models added here will be automatically evaluated on the 🤗 cluster.

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

## In case of model failure
If your model is displayed in the `FAILED` category, its execution stopped.
Make sure you have followed the above steps first.
If everything is done, check you can launch the EleutherAIHarness on your model locally, using the above command without modifications (you can add `--limit` to limit the number of examples per task).
"""

CITATION_BUTTON_LABEL = "Copy the following snippet to cite these results"
CITATION_BUTTON_TEXT = r"""
@misc{open-llm-leaderboard,
  author = {Edward Beeching and Clémentine Fourrier and Nathan Habib and Sheon Han and Nathan Lambert and Nazneen Rajani and Omar Sanseviero and Lewis Tunstall and Thomas Wolf},
  title = {Open LLM Leaderboard},
  year = {2023},
  publisher = {Hugging Face},
  howpublished = "\url{https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard}"
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
  url          = {https://doi.org/10.5281/zenodo.5371628}
}
@misc{clark2018think,
      title={Think you have Solved Question Answering? Try ARC, the AI2 Reasoning Challenge},
      author={Peter Clark and Isaac Cowhey and Oren Etzioni and Tushar Khot and Ashish Sabharwal and Carissa Schoenick and Oyvind Tafjord},
      year={2018},
      eprint={1803.05457},
      archivePrefix={arXiv},
      primaryClass={cs.AI}
}
@misc{zellers2019hellaswag,
      title={HellaSwag: Can a Machine Really Finish Your Sentence?},
      author={Rowan Zellers and Ari Holtzman and Yonatan Bisk and Ali Farhadi and Yejin Choi},
      year={2019},
      eprint={1905.07830},
      archivePrefix={arXiv},
      primaryClass={cs.CL}
}
@misc{hendrycks2021measuring,
      title={Measuring Massive Multitask Language Understanding},
      author={Dan Hendrycks and Collin Burns and Steven Basart and Andy Zou and Mantas Mazeika and Dawn Song and Jacob Steinhardt},
      year={2021},
      eprint={2009.03300},
      archivePrefix={arXiv},
      primaryClass={cs.CY}
}
@misc{lin2022truthfulqa,
      title={TruthfulQA: Measuring How Models Mimic Human Falsehoods},
      author={Stephanie Lin and Jacob Hilton and Owain Evans},
      year={2022},
      eprint={2109.07958},
      archivePrefix={arXiv},
      primaryClass={cs.CL}
}
@misc{DBLP:journals/corr/abs-1907-10641,
      title={{WINOGRANDE:} An Adversarial Winograd Schema Challenge at Scale},
      author={Keisuke Sakaguchi and Ronan Le Bras and Chandra Bhagavatula and Yejin Choi},
      year={2019},
      eprint={1907.10641},
      archivePrefix={arXiv},
      primaryClass={cs.CL}
}
@misc{DBLP:journals/corr/abs-2110-14168,
      title={Training Verifiers to Solve Math Word Problems},
      author={Karl Cobbe and
                  Vineet Kosaraju and
                  Mohammad Bavarian and
                  Mark Chen and
                  Heewoo Jun and
                  Lukasz Kaiser and
                  Matthias Plappert and
                  Jerry Tworek and
                  Jacob Hilton and
                  Reiichiro Nakano and
                  Christopher Hesse and
                  John Schulman},
      year={2021},
      eprint={2110.14168},
      archivePrefix={arXiv},
      primaryClass={cs.CL}
}
"""
