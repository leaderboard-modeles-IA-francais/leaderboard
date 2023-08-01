from dataclasses import dataclass
from enum import Enum
from typing import Dict, List

from ..utils_display import AutoEvalColumn

@dataclass
class ModelInfo:
    name: str
    symbol: str # emoji


class ModelType(Enum):
    PT = ModelInfo(name="pretrained", symbol="🟢")
    SFT = ModelInfo(name="finetuned", symbol="🔶")
    RL = ModelInfo(name="with RL", symbol="🟦")


TYPE_METADATA: Dict[str, ModelType] = {
    "notstoic/PygmalionCoT-7b": ModelType.SFT,
    "aisquared/dlite-v1-355m": ModelType.SFT,
    "aisquared/dlite-v1-1_5b": ModelType.SFT,
    "aisquared/dlite-v1-774m": ModelType.SFT,
    "aisquared/dlite-v1-124m": ModelType.SFT,
    "aisquared/chopt-2_7b": ModelType.SFT,
    "aisquared/dlite-v2-124m": ModelType.SFT,
    "aisquared/dlite-v2-774m": ModelType.SFT,
    "aisquared/dlite-v2-1_5b": ModelType.SFT,
    "aisquared/chopt-1_3b": ModelType.SFT,
    "aisquared/dlite-v2-355m": ModelType.SFT,
    "augtoma/qCammel-13": ModelType.SFT,
    "Aspik101/Llama-2-7b-hf-instruct-pl-lora_unload": ModelType.SFT,
    "Aspik101/vicuna-7b-v1.3-instruct-pl-lora_unload": ModelType.SFT,
    "TheBloke/alpaca-lora-65B-HF": ModelType.SFT,
    "TheBloke/tulu-7B-fp16": ModelType.SFT,
    "TheBloke/guanaco-7B-HF": ModelType.SFT,
    "TheBloke/koala-7B-HF": ModelType.SFT,
    "TheBloke/wizardLM-7B-HF": ModelType.SFT,
    "TheBloke/airoboros-13B-HF": ModelType.SFT,
    "TheBloke/koala-13B-HF": ModelType.SFT,
    "TheBloke/Wizard-Vicuna-7B-Uncensored-HF": ModelType.SFT,
    "TheBloke/dromedary-65b-lora-HF": ModelType.SFT,
    "TheBloke/wizardLM-13B-1.0-fp16": ModelType.SFT,
    "TheBloke/WizardLM-13B-V1-1-SuperHOT-8K-fp16": ModelType.SFT,
    "TheBloke/Wizard-Vicuna-30B-Uncensored-fp16": ModelType.SFT,
    "TheBloke/wizard-vicuna-13B-HF": ModelType.SFT,
    "TheBloke/UltraLM-13B-fp16": ModelType.SFT,
    "TheBloke/OpenAssistant-SFT-7-Llama-30B-HF": ModelType.SFT,
    "TheBloke/vicuna-13B-1.1-HF": ModelType.SFT,
    "TheBloke/guanaco-13B-HF": ModelType.SFT,
    "TheBloke/guanaco-65B-HF": ModelType.SFT,
    "TheBloke/airoboros-7b-gpt4-fp16": ModelType.SFT,
    "TheBloke/llama-30b-supercot-SuperHOT-8K-fp16": ModelType.SFT,
    "TheBloke/Llama-2-13B-fp16": ModelType.PT,
    "TheBloke/llama-2-70b-Guanaco-QLoRA-fp16": ModelType.SFT,
    "TheBloke/landmark-attention-llama7b-fp16": ModelType.SFT,
    "TheBloke/Planner-7B-fp16": ModelType.SFT,
    "TheBloke/Wizard-Vicuna-13B-Uncensored-HF": ModelType.SFT,
    "TheBloke/gpt4-alpaca-lora-13B-HF": ModelType.SFT,
    "TheBloke/gpt4-x-vicuna-13B-HF": ModelType.SFT,
    "TheBloke/gpt4-alpaca-lora_mlp-65B-HF": ModelType.SFT,
    "TheBloke/tulu-13B-fp16": ModelType.SFT,
    "TheBloke/VicUnlocked-alpaca-65B-QLoRA-fp16": ModelType.SFT,
    "TheBloke/Llama-2-70B-fp16": ModelType.SFT,
    "TheBloke/WizardLM-30B-fp16": ModelType.SFT,
    "TheBloke/robin-13B-v2-fp16": ModelType.SFT,
    "TheBloke/robin-33B-v2-fp16": ModelType.SFT,
    "TheBloke/Vicuna-13B-CoT-fp16": ModelType.SFT,
    "TheBloke/Vicuna-33B-1-3-SuperHOT-8K-fp16": ModelType.SFT,
    "TheBloke/Wizard-Vicuna-30B-Superhot-8K-fp16": ModelType.SFT,
    "TheBloke/Nous-Hermes-13B-SuperHOT-8K-fp16": ModelType.SFT,
    "TheBloke/GPlatty-30B-SuperHOT-8K-fp16": ModelType.SFT,
    "TheBloke/CAMEL-33B-Combined-Data-SuperHOT-8K-fp16": ModelType.SFT,
    "TheBloke/Chinese-Alpaca-33B-SuperHOT-8K-fp16": ModelType.SFT,
    "jphme/orca_mini_v2_ger_7b": ModelType.SFT,
    "Ejafa/vicuna_7B_vanilla_1.1": ModelType.SFT,
    "kevinpro/Vicuna-13B-CoT": ModelType.SFT,
    "AlekseyKorshuk/pygmalion-6b-vicuna-chatml": ModelType.SFT,
    "AlekseyKorshuk/chatml-pyg-v1": ModelType.SFT,
    "concedo/Vicuzard-30B-Uncensored": ModelType.SFT,
    "concedo/OPT-19M-ChatSalad": ModelType.SFT,
    "concedo/Pythia-70M-ChatSalad": ModelType.SFT,
    "digitous/13B-HyperMantis": ModelType.SFT,
    "digitous/Adventien-GPTJ": ModelType.SFT,
    "digitous/Alpacino13b": ModelType.SFT,
    "digitous/GPT-R": ModelType.SFT,
    "digitous/Javelin-R": ModelType.SFT,
    "digitous/Javalion-GPTJ": ModelType.SFT,
    "digitous/Javalion-R": ModelType.SFT,
    "digitous/Skegma-GPTJ": ModelType.SFT,
    "digitous/Alpacino30b": ModelType.SFT,
    "digitous/Janin-GPTJ": ModelType.SFT,
    "digitous/Janin-R": ModelType.SFT,
    "digitous/Javelin-GPTJ": ModelType.SFT,
    "SaylorTwift/gpt2_test": ModelType.PT,
    "anton-l/gpt-j-tiny-random": ModelType.SFT,
    "Andron00e/YetAnother_Open-Llama-3B-LoRA-OpenOrca": ModelType.SFT,
    "Lazycuber/pyg-instruct-wizardlm": ModelType.SFT,
    "Lazycuber/Janemalion-6B": ModelType.SFT,
    "IDEA-CCNL/Ziya-LLaMA-13B-Pretrain-v1": ModelType.SFT,
    "IDEA-CCNL/Ziya-LLaMA-13B-v1": ModelType.SFT,
    "dsvv-cair/alpaca-cleaned-llama-30b-bf16": ModelType.SFT,
    "gpt2-medium": ModelType.PT,
    "camel-ai/CAMEL-13B-Combined-Data": ModelType.SFT,
    "camel-ai/CAMEL-13B-Role-Playing-Data": ModelType.SFT,
    "camel-ai/CAMEL-33B-Combined-Data": ModelType.SFT,
    "PygmalionAI/pygmalion-6b": ModelType.SFT,
    "PygmalionAI/metharme-1.3b": ModelType.SFT,
    "PygmalionAI/pygmalion-1.3b": ModelType.SFT,
    "PygmalionAI/pygmalion-350m": ModelType.SFT,
    "PygmalionAI/pygmalion-2.7b": ModelType.SFT,
    "medalpaca/medalpaca-7b": ModelType.SFT,
    "lilloukas/Platypus-30B": ModelType.SFT,
    "lilloukas/GPlatty-30B": ModelType.SFT,
    "mncai/chatdoctor": ModelType.SFT,
    "chaoyi-wu/MedLLaMA_13B": ModelType.SFT,
    "LoupGarou/WizardCoder-Guanaco-15B-V1.0": ModelType.SFT,
    "LoupGarou/WizardCoder-Guanaco-15B-V1.1": ModelType.SFT,
    "hakurei/instruct-12b": ModelType.SFT,
    "hakurei/lotus-12B": ModelType.SFT,
    "shibing624/chinese-llama-plus-13b-hf": ModelType.SFT,
    "shibing624/chinese-alpaca-plus-7b-hf": ModelType.SFT,
    "shibing624/chinese-alpaca-plus-13b-hf": ModelType.SFT,
    "mosaicml/mpt-7b-instruct": ModelType.SFT,
    "mosaicml/mpt-30b-chat": ModelType.SFT,
    "mosaicml/mpt-7b-storywriter": ModelType.SFT,
    "mosaicml/mpt-30b-instruct": ModelType.SFT,
    "mosaicml/mpt-7b-chat": ModelType.SFT,
    "mosaicml/mpt-30b": ModelType.PT,
    "Corianas/111m": ModelType.SFT,
    "Corianas/Quokka_1.3b": ModelType.SFT,
    "Corianas/256_5epoch": ModelType.SFT,
    "Corianas/Quokka_256m": ModelType.SFT,
    "Corianas/Quokka_590m": ModelType.SFT,
    "Corianas/gpt-j-6B-Dolly": ModelType.SFT,
    "Corianas/Quokka_2.7b": ModelType.SFT,
    "cyberagent/open-calm-7b": ModelType.SFT,
    "Aspik101/Nous-Hermes-13b-pl-lora_unload": ModelType.SFT,
    "THUDM/chatglm2-6b": ModelType.SFT,
    "MetaIX/GPT4-X-Alpasta-30b": ModelType.SFT,
    "NYTK/PULI-GPTrio": ModelType.PT,
    "EleutherAI/pythia-1.3b": ModelType.PT,
    "EleutherAI/pythia-2.8b-deduped": ModelType.PT,
    "EleutherAI/gpt-neo-125m": ModelType.PT,
    "EleutherAI/pythia-160m": ModelType.PT,
    "EleutherAI/gpt-neo-2.7B": ModelType.PT,
    "EleutherAI/pythia-1b-deduped": ModelType.PT,
    "EleutherAI/pythia-6.7b": ModelType.PT,
    "EleutherAI/pythia-70m-deduped": ModelType.PT,
    "EleutherAI/gpt-neox-20b": ModelType.PT,
    "EleutherAI/pythia-1.4b-deduped": ModelType.PT,
    "EleutherAI/pythia-2.7b": ModelType.PT,
    "EleutherAI/pythia-6.9b-deduped": ModelType.PT,
    "EleutherAI/pythia-70m": ModelType.PT,
    "EleutherAI/gpt-j-6b": ModelType.PT,
    "EleutherAI/pythia-12b-deduped": ModelType.PT,
    "EleutherAI/gpt-neo-1.3B": ModelType.PT,
    "EleutherAI/pythia-410m-deduped": ModelType.PT,
    "EleutherAI/pythia-160m-deduped": ModelType.PT,
    "EleutherAI/polyglot-ko-12.8b": ModelType.PT,
    "EleutherAI/pythia-12b": ModelType.PT,
    "roneneldan/TinyStories-33M": ModelType.PT,
    "roneneldan/TinyStories-28M": ModelType.PT,
    "roneneldan/TinyStories-1M": ModelType.PT,
    "roneneldan/TinyStories-8M": ModelType.PT,
    "roneneldan/TinyStories-3M": ModelType.PT,
    "jerryjalapeno/nart-100k-7b": ModelType.SFT,
    "lmsys/vicuna-13b-v1.3": ModelType.SFT,
    "lmsys/vicuna-7b-v1.3": ModelType.SFT,
    "lmsys/vicuna-13b-v1.1": ModelType.SFT,
    "lmsys/vicuna-13b-delta-v1.1": ModelType.SFT,
    "lmsys/vicuna-7b-delta-v1.1": ModelType.SFT,
    "abhiramtirumala/DialoGPT-sarcastic-medium": ModelType.SFT,
    "haonan-li/bactrian-x-llama-13b-merged": ModelType.SFT,
    "Gryphe/MythoLogic-13b": ModelType.SFT,
    "Gryphe/MythoBoros-13b": ModelType.SFT,
    "pillowtalks-ai/delta13b": ModelType.SFT,
    "wannaphong/openthaigpt-0.1.0-beta-full-model_for_open_llm_leaderboard": ModelType.SFT,
    "bigscience/bloom-7b1": ModelType.PT,
    "bigcode/tiny_starcoder_py": ModelType.PT,
    "bigcode/starcoderplus": ModelType.SFT,
    "bigcode/gpt_bigcode-santacoder": ModelType.PT,
    "bigcode/starcoder": ModelType.PT,
    "Open-Orca/OpenOrca-Preview1-13B": ModelType.SFT,
    "microsoft/DialoGPT-large": ModelType.SFT,
    "microsoft/DialoGPT-small": ModelType.SFT,
    "microsoft/DialoGPT-medium": ModelType.SFT,
    "microsoft/CodeGPT-small-py": ModelType.SFT,
    "Tincando/fiction_story_generator": ModelType.SFT,
    "Pirr/pythia-13b-deduped-green_devil": ModelType.SFT,
    "Aeala/GPT4-x-AlpacaDente2-30b": ModelType.SFT,
    "Aeala/GPT4-x-AlpacaDente-30b": ModelType.SFT,
    "Aeala/GPT4-x-Alpasta-13b": ModelType.SFT,
    "Aeala/VicUnlocked-alpaca-30b": ModelType.SFT,
    "Tap-M/Luna-AI-Llama2-Uncensored": ModelType.SFT,
    "illuin/test-custom-llama": ModelType.SFT,
    "dvruette/oasst-llama-13b-2-epochs": ModelType.SFT,
    "dvruette/oasst-gpt-neox-20b-1000-steps": ModelType.SFT,
    "dvruette/llama-13b-pretrained-dropout": ModelType.PT,
    "dvruette/llama-13b-pretrained": ModelType.PT,
    "dvruette/llama-13b-pretrained-sft-epoch-1": ModelType.PT,
    "dvruette/llama-13b-pretrained-sft-do2": ModelType.PT,
    "dvruette/oasst-gpt-neox-20b-3000-steps": ModelType.SFT,
    "dvruette/oasst-pythia-12b-pretrained-sft": ModelType.PT,
    "dvruette/oasst-pythia-6.9b-4000-steps": ModelType.SFT,
    "dvruette/gpt-neox-20b-full-precision": ModelType.SFT,
    "dvruette/oasst-llama-13b-1000-steps": ModelType.SFT,
    "openlm-research/open_llama_7b_700bt_preview": ModelType.PT,
    "openlm-research/open_llama_7b": ModelType.PT,
    "openlm-research/open_llama_7b_v2": ModelType.PT,
    "openlm-research/open_llama_3b": ModelType.PT,
    "openlm-research/open_llama_13b": ModelType.PT,
    "openlm-research/open_llama_3b_v2": ModelType.PT,
    "PocketDoc/Dans-PileOfSets-Mk1-llama-13b-merged": ModelType.SFT,
    "GeorgiaTechResearchInstitute/galpaca-30b": ModelType.SFT,
    "GeorgiaTechResearchInstitute/starcoder-gpteacher-code-instruct": ModelType.SFT,
    "databricks/dolly-v2-7b": ModelType.SFT,
    "databricks/dolly-v2-3b": ModelType.SFT,
    "databricks/dolly-v2-12b": ModelType.SFT,
    "Rachneet/gpt2-xl-alpaca": ModelType.SFT,
    "Locutusque/gpt2-conversational-or-qa": ModelType.SFT,
    "psyche/kogpt": ModelType.SFT,
    "NbAiLab/nb-gpt-j-6B-alpaca": ModelType.SFT,
    "Mikael110/llama-2-7b-guanaco-fp16": ModelType.SFT,
    "Mikael110/llama-2-13b-guanaco-fp16": ModelType.SFT,
    "Fredithefish/CrimsonPajama": ModelType.SFT,
    "Fredithefish/RedPajama-INCITE-Chat-3B-ShareGPT-11K": ModelType.SFT,
    "Fredithefish/ScarletPajama-3B-HF": ModelType.SFT,
    "Fredithefish/RedPajama-INCITE-Chat-3B-Instruction-Tuning-with-GPT-4": ModelType.SFT,
    "acrastt/RedPajama-INCITE-Chat-Instruct-3B-V1": ModelType.SFT,
    "eachadea/vicuna-13b-1.1": ModelType.SFT,
    "eachadea/vicuna-7b-1.1": ModelType.SFT,
    "eachadea/vicuna-13b": ModelType.SFT,
    "openaccess-ai-collective/wizard-mega-13b": ModelType.SFT,
    "openaccess-ai-collective/manticore-13b": ModelType.SFT,
    "openaccess-ai-collective/manticore-30b-chat-pyg-alpha": ModelType.SFT,
    "openaccess-ai-collective/minotaur-13b": ModelType.SFT,
    "openaccess-ai-collective/minotaur-13b-fixed": ModelType.SFT,
    "openaccess-ai-collective/hippogriff-30b-chat": ModelType.SFT,
    "openaccess-ai-collective/manticore-13b-chat-pyg": ModelType.SFT,
    "pythainlp/wangchanglm-7.5B-sft-enth": ModelType.SFT,
    "pythainlp/wangchanglm-7.5B-sft-en-sharded": ModelType.SFT,
    "euclaise/gpt-neox-122m-minipile-digits": ModelType.SFT,
    "stabilityai/StableBeluga1-Delta": ModelType.SFT,
    "stabilityai/stablelm-tuned-alpha-7b": ModelType.SFT,
    "stabilityai/StableBeluga2": ModelType.SFT,
    "stabilityai/StableBeluga-13B": ModelType.SFT,
    "stabilityai/StableBeluga-7B": ModelType.SFT,
    "stabilityai/stablelm-base-alpha-7b": ModelType.PT,
    "stabilityai/stablelm-base-alpha-3b": ModelType.PT,
    "stabilityai/stablelm-tuned-alpha-3b": ModelType.SFT,
    "alibidaran/medical_transcription_generator": ModelType.SFT,
    "CalderaAI/30B-Lazarus": ModelType.SFT,
    "CalderaAI/13B-BlueMethod": ModelType.SFT,
    "CalderaAI/13B-Ouroboros": ModelType.SFT,
    "KoboldAI/OPT-13B-Erebus": ModelType.SFT,
    "KoboldAI/GPT-J-6B-Janeway": ModelType.SFT,
    "KoboldAI/GPT-J-6B-Shinen": ModelType.SFT,
    "KoboldAI/fairseq-dense-2.7B": ModelType.PT,
    "KoboldAI/OPT-6B-nerys-v2": ModelType.SFT,
    "KoboldAI/GPT-NeoX-20B-Skein": ModelType.SFT,
    "KoboldAI/PPO_Pygway-6b-Mix": ModelType.SFT,
    "KoboldAI/fairseq-dense-6.7B": ModelType.PT,
    "KoboldAI/fairseq-dense-125M": ModelType.PT,
    "KoboldAI/OPT-13B-Nerybus-Mix": ModelType.SFT,
    "KoboldAI/OPT-2.7B-Erebus": ModelType.SFT,
    "KoboldAI/OPT-350M-Nerys-v2": ModelType.SFT,
    "KoboldAI/OPT-2.7B-Nerys-v2": ModelType.SFT,
    "KoboldAI/OPT-2.7B-Nerybus-Mix": ModelType.SFT,
    "KoboldAI/OPT-13B-Nerys-v2": ModelType.SFT,
    "KoboldAI/GPT-NeoX-20B-Erebus": ModelType.SFT,
    "KoboldAI/OPT-6.7B-Erebus": ModelType.SFT,
    "KoboldAI/fairseq-dense-355M": ModelType.PT,
    "KoboldAI/OPT-6.7B-Nerybus-Mix": ModelType.SFT,
    "KoboldAI/GPT-J-6B-Adventure": ModelType.SFT,
    "KoboldAI/OPT-350M-Erebus": ModelType.SFT,
    "KoboldAI/GPT-J-6B-Skein": ModelType.SFT,
    "KoboldAI/OPT-30B-Erebus": ModelType.SFT,
    "klosax/pythia-160m-deduped-step92k-193bt": ModelType.PT,
    "klosax/open_llama_3b_350bt_preview": ModelType.PT,
    "klosax/openllama-3b-350bt": ModelType.PT,
    "klosax/pythia-70m-deduped-step44k-92bt": ModelType.PT,
    "klosax/open_llama_13b_600bt_preview": ModelType.PT,
    "klosax/open_llama_7b_400bt_preview": ModelType.PT,
    "kfkas/Llama-2-ko-7b-Chat": ModelType.SFT,
    "WeOpenML/Alpaca-7B-v1": ModelType.SFT,
    "WeOpenML/PandaLM-Alpaca-7B-v1": ModelType.SFT,
    "TFLai/gpt2-turkish-uncased": ModelType.SFT,
    "ehartford/WizardLM-13B-Uncensored": ModelType.SFT,
    "ehartford/dolphin-llama-13b": ModelType.SFT,
    "ehartford/Wizard-Vicuna-30B-Uncensored": ModelType.SFT,
    "ehartford/WizardLM-30B-Uncensored": ModelType.SFT,
    "ehartford/Wizard-Vicuna-13B-Uncensored": ModelType.SFT,
    "ehartford/WizardLM-7B-Uncensored": ModelType.SFT,
    "ehartford/based-30b": ModelType.SFT,
    "ehartford/Wizard-Vicuna-7B-Uncensored": ModelType.SFT,
    "wahaha1987/llama_7b_sharegpt94k_fastchat": ModelType.SFT,
    "wahaha1987/llama_13b_sharegpt94k_fastchat": ModelType.SFT,
    "OpenAssistant/oasst-sft-1-pythia-12b": ModelType.SFT,
    "OpenAssistant/stablelm-7b-sft-v7-epoch-3": ModelType.SFT,
    "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5": ModelType.SFT,
    "OpenAssistant/pythia-12b-sft-v8-2.5k-steps": ModelType.SFT,
    "OpenAssistant/pythia-12b-sft-v8-7k-steps": ModelType.SFT,
    "OpenAssistant/pythia-12b-pre-v8-12.5k-steps": ModelType.SFT,
    "OpenAssistant/llama2-13b-orca-8k-3319": ModelType.SFT,
    "junelee/wizard-vicuna-13b": ModelType.SFT,
    "BreadAi/gpt-YA-1-1_160M": ModelType.PT,
    "BreadAi/MuseCan": ModelType.PT,
    "BreadAi/MusePy-1-2": ModelType.PT,
    "BreadAi/DiscordPy": ModelType.PT,
    "BreadAi/PM_modelV2": ModelType.PT,
    "BreadAi/gpt-Youtube": ModelType.PT,
    "BreadAi/StoryPy": ModelType.SFT,
    "julianweng/Llama-2-7b-chat-orcah": ModelType.SFT,
    "AGI-inc/lora_moe_7b_baseline": ModelType.SFT,
    "AGI-inc/lora_moe_7b": ModelType.SFT,
    "togethercomputer/GPT-NeoXT-Chat-Base-20B": ModelType.SFT,
    "togethercomputer/RedPajama-INCITE-Chat-7B-v0.1": ModelType.SFT,
    "togethercomputer/RedPajama-INCITE-Instruct-7B-v0.1": ModelType.SFT,
    "togethercomputer/RedPajama-INCITE-7B-Base": ModelType.PT,
    "togethercomputer/RedPajama-INCITE-7B-Instruct": ModelType.SFT,
    "togethercomputer/RedPajama-INCITE-Base-3B-v1": ModelType.PT,
    "togethercomputer/Pythia-Chat-Base-7B": ModelType.SFT,
    "togethercomputer/RedPajama-INCITE-Base-7B-v0.1": ModelType.PT,
    "togethercomputer/GPT-JT-6B-v1": ModelType.SFT,
    "togethercomputer/GPT-JT-6B-v0": ModelType.SFT,
    "togethercomputer/RedPajama-INCITE-Chat-3B-v1": ModelType.SFT,
    "togethercomputer/RedPajama-INCITE-7B-Chat": ModelType.SFT,
    "togethercomputer/RedPajama-INCITE-Instruct-3B-v1": ModelType.SFT,
    "Writer/camel-5b-hf": ModelType.SFT,
    "Writer/palmyra-base": ModelType.PT,
    "MBZUAI/LaMini-GPT-1.5B": ModelType.SFT,
    "MBZUAI/lamini-cerebras-111m": ModelType.SFT,
    "MBZUAI/lamini-neo-1.3b": ModelType.SFT,
    "MBZUAI/lamini-cerebras-1.3b": ModelType.SFT,
    "MBZUAI/lamini-cerebras-256m": ModelType.SFT,
    "MBZUAI/LaMini-GPT-124M": ModelType.SFT,
    "MBZUAI/lamini-neo-125m": ModelType.SFT,
    "TehVenom/DiffMerge-DollyGPT-Pygmalion": ModelType.SFT,
    "TehVenom/PPO_Shygmalion-6b": ModelType.SFT,
    "TehVenom/Dolly_Shygmalion-6b-Dev_V8P2": ModelType.SFT,
    "TehVenom/Pygmalion_AlpacaLora-7b": ModelType.SFT,
    "TehVenom/PPO_Pygway-V8p4_Dev-6b": ModelType.SFT,
    "TehVenom/Dolly_Malion-6b": ModelType.SFT,
    "TehVenom/PPO_Shygmalion-V8p4_Dev-6b": ModelType.SFT,
    "TehVenom/ChanMalion": ModelType.SFT,
    "TehVenom/GPT-J-Pyg_PPO-6B": ModelType.SFT,
    "TehVenom/Pygmalion-13b-Merged": ModelType.SFT,
    "TehVenom/Metharme-13b-Merged": ModelType.SFT,
    "TehVenom/Dolly_Shygmalion-6b": ModelType.SFT,
    "TehVenom/GPT-J-Pyg_PPO-6B-Dev-V8p4": ModelType.SFT,
    "georgesung/llama2_7b_chat_uncensored": ModelType.SFT,
    "vicgalle/gpt2-alpaca": ModelType.SFT,
    "vicgalle/alpaca-7b": ModelType.SFT,
    "vicgalle/gpt2-alpaca-gpt4": ModelType.SFT,
    "facebook/opt-350m": ModelType.PT,
    "facebook/opt-125m": ModelType.PT,
    "facebook/xglm-4.5B": ModelType.PT,
    "facebook/opt-2.7b": ModelType.PT,
    "facebook/opt-6.7b": ModelType.PT,
    "facebook/galactica-30b": ModelType.PT,
    "facebook/opt-13b": ModelType.PT,
    "facebook/opt-66b": ModelType.PT,
    "facebook/xglm-7.5B": ModelType.PT,
    "facebook/xglm-564M": ModelType.PT,
    "facebook/opt-30b": ModelType.PT,
    "golaxy/gogpt-7b": ModelType.SFT,
    "golaxy/gogpt2-7b": ModelType.SFT,
    "golaxy/gogpt-7b-bloom": ModelType.SFT,
    "golaxy/gogpt-3b-bloom": ModelType.SFT,
    "psmathur/orca_mini_v2_7b": ModelType.SFT,
    "psmathur/orca_mini_7b": ModelType.SFT,
    "psmathur/orca_mini_3b": ModelType.SFT,
    "psmathur/orca_mini_v2_13b": ModelType.SFT,
    "gpt2-xl": ModelType.PT,
    "lxe/Cerebras-GPT-2.7B-Alpaca-SP": ModelType.SFT,
    "Monero/Manticore-13b-Chat-Pyg-Guanaco": ModelType.SFT,
    "Monero/WizardLM-Uncensored-SuperCOT-StoryTelling-30b": ModelType.SFT,
    "Monero/WizardLM-13b-OpenAssistant-Uncensored": ModelType.SFT,
    "Monero/WizardLM-30B-Uncensored-Guanaco-SuperCOT-30b": ModelType.SFT,
    "jzjiao/opt-1.3b-rlhf": ModelType.SFT,
    "HuggingFaceH4/starchat-beta": ModelType.SFT,
    "KnutJaegersberg/gpt-2-xl-EvolInstruct": ModelType.SFT,
    "KnutJaegersberg/megatron-GPT-2-345m-EvolInstruct": ModelType.SFT,
    "KnutJaegersberg/galactica-orca-wizardlm-1.3b": ModelType.SFT,
    "openchat/openchat_8192": ModelType.SFT,
    "openchat/openchat_v2": ModelType.SFT,
    "openchat/openchat_v2_w": ModelType.SFT,
    "ausboss/llama-13b-supercot": ModelType.SFT,
    "ausboss/llama-30b-supercot": ModelType.SFT,
    "Neko-Institute-of-Science/metharme-7b": ModelType.SFT,
    "Neko-Institute-of-Science/pygmalion-7b": ModelType.SFT,
    "SebastianSchramm/Cerebras-GPT-111M-instruction": ModelType.SFT,
    "victor123/WizardLM-13B-1.0": ModelType.SFT,
    "OpenBuddy/openbuddy-openllama-13b-v7-fp16": ModelType.SFT,
    "OpenBuddy/openbuddy-llama2-13b-v8.1-fp16": ModelType.SFT,
    "OpenBuddyEA/openbuddy-llama-30b-v7.1-bf16": ModelType.SFT,
    "baichuan-inc/Baichuan-7B": ModelType.PT,
    "tiiuae/falcon-40b-instruct": ModelType.SFT,
    "tiiuae/falcon-40b": ModelType.PT,
    "tiiuae/falcon-7b": ModelType.PT,
    "YeungNLP/firefly-llama-13b": ModelType.SFT,
    "YeungNLP/firefly-llama-13b-v1.2": ModelType.SFT,
    "YeungNLP/firefly-llama2-13b": ModelType.SFT,
    "YeungNLP/firefly-ziya-13b": ModelType.SFT,
    "shaohang/Sparse0.5_OPT-1.3": ModelType.SFT,
    "xzuyn/Alpacino-SuperCOT-13B": ModelType.SFT,
    "xzuyn/MedicWizard-7B": ModelType.SFT,
    "xDAN-AI/xDAN_13b_l2_lora": ModelType.SFT,
    "beomi/KoAlpaca-Polyglot-5.8B": ModelType.SFT,
    "beomi/llama-2-ko-7b": ModelType.SFT,
    "Salesforce/codegen-6B-multi": ModelType.PT,
    "Salesforce/codegen-16B-nl": ModelType.PT,
    "Salesforce/codegen-6B-nl": ModelType.PT,
    "ai-forever/rugpt3large_based_on_gpt2": ModelType.SFT,
    "gpt2-large": ModelType.PT,
    "frank098/orca_mini_3b_juniper": ModelType.SFT,
    "frank098/WizardLM_13B_juniper": ModelType.SFT,
    "FPHam/Free_Sydney_13b_HF": ModelType.SFT,
    "huggingface/llama-13b": ModelType.PT,
    "huggingface/llama-7b": ModelType.PT,
    "huggingface/llama-65b": ModelType.PT,
    "huggingface/llama-65b": ModelType.PT,
    "huggingface/llama-30b": ModelType.PT,
    "Henk717/chronoboros-33B":  ModelType.SFT,
    "jondurbin/airoboros-13b-gpt4-1.4": ModelType.SFT,
    "jondurbin/airoboros-7b": ModelType.SFT,
    "jondurbin/airoboros-7b-gpt4": ModelType.SFT,
    "jondurbin/airoboros-7b-gpt4-1.1": ModelType.SFT,
    "jondurbin/airoboros-7b-gpt4-1.2": ModelType.SFT,
    "jondurbin/airoboros-7b-gpt4-1.3": ModelType.SFT,
    "jondurbin/airoboros-7b-gpt4-1.4": ModelType.SFT,
    "jondurbin/airoboros-l2-7b-gpt4-1.4.1": ModelType.SFT,
    "jondurbin/airoboros-l2-13b-gpt4-1.4.1": ModelType.SFT,
    "jondurbin/airoboros-l2-70b-gpt4-1.4.1": ModelType.SFT,
    "jondurbin/airoboros-13b": ModelType.SFT,
    "jondurbin/airoboros-33b-gpt4-1.4": ModelType.SFT,
    "jondurbin/airoboros-33b-gpt4-1.2": ModelType.SFT,
    "jondurbin/airoboros-65b-gpt4-1.2": ModelType.SFT,
    "ariellee/SuperPlatty-30B": ModelType.SFT,
    "danielhanchen/open_llama_3b_600bt_preview": ModelType.SFT,
    "cerebras/Cerebras-GPT-256M": ModelType.PT,
    "cerebras/Cerebras-GPT-1.3B": ModelType.PT,
    "cerebras/Cerebras-GPT-13B": ModelType.PT,
    "cerebras/Cerebras-GPT-2.7B": ModelType.PT,
    "cerebras/Cerebras-GPT-111M": ModelType.PT,
    "cerebras/Cerebras-GPT-6.7B": ModelType.PT,
    "Yhyu13/oasst-rlhf-2-llama-30b-7k-steps-hf": ModelType.RL,
    "Yhyu13/llama-30B-hf-openassitant": ModelType.SFT,
    "NousResearch/Nous-Hermes-Llama2-13b": ModelType.SFT,
    "NousResearch/Nous-Hermes-llama-2-7b": ModelType.SFT,
    "NousResearch/Redmond-Puffin-13B": ModelType.SFT,
    "NousResearch/Nous-Hermes-13b": ModelType.SFT,
    "project-baize/baize-v2-7b": ModelType.SFT,
    "project-baize/baize-v2-13b": ModelType.SFT,
    "LLMs/WizardLM-13B-V1.0": ModelType.SFT,
    "LLMs/AlpacaGPT4-7B-elina": ModelType.SFT,
    "wenge-research/yayi-7b": ModelType.SFT,
    "wenge-research/yayi-7b-llama2": ModelType.SFT,
    "wenge-research/yayi-13b-llama2": ModelType.SFT,
    "yhyhy3/open_llama_7b_v2_med_instruct": ModelType.SFT,
    "llama-anon/instruct-13b": ModelType.SFT,
    "huggingtweets/jerma985": ModelType.SFT,
    "huggingtweets/gladosystem": ModelType.SFT,
    "huggingtweets/bladeecity-jerma985": ModelType.SFT,
    "huggyllama/llama-13b": ModelType.PT,
    "huggyllama/llama-65b": ModelType.PT,
    "FabbriSimo01/Facebook_opt_1.3b_Quantized": ModelType.PT,
    "upstage/Llama-2-70b-instruct": ModelType.SFT,
    "upstage/Llama-2-70b-instruct-1024": ModelType.SFT,
    "upstage/llama-65b-instruct": ModelType.SFT,
    "upstage/llama-30b-instruct-2048": ModelType.SFT,
    "upstage/llama-30b-instruct": ModelType.SFT,
    "WizardLM/WizardLM-13B-1.0": ModelType.SFT,
    "WizardLM/WizardLM-13B-V1.1": ModelType.SFT,
    "WizardLM/WizardLM-13B-V1.2": ModelType.SFT,
    "WizardLM/WizardLM-30B-V1.0": ModelType.SFT,
    "WizardLM/WizardCoder-15B-V1.0": ModelType.SFT,
    "gpt2": ModelType.PT,
    "keyfan/vicuna-chinese-replication-v1.1": ModelType.SFT,
    "nthngdy/pythia-owt2-70m-100k": ModelType.SFT,
    "nthngdy/pythia-owt2-70m-50k": ModelType.SFT,
    "quantumaikr/KoreanLM-hf": ModelType.SFT,
    "quantumaikr/open_llama_7b_hf": ModelType.SFT,
    "quantumaikr/QuantumLM-70B-hf": ModelType.SFT,
    "MayaPH/FinOPT-Lincoln": ModelType.SFT,
    "MayaPH/FinOPT-Franklin": ModelType.SFT,
    "MayaPH/GodziLLa-30B": ModelType.SFT,
    "MayaPH/GodziLLa-30B-plus": ModelType.SFT,
    "MayaPH/FinOPT-Washington": ModelType.SFT,
    "ogimgio/gpt-neo-125m-neurallinguisticpioneers": ModelType.SFT,
    "layoric/llama-2-13b-code-alpaca": ModelType.SFT,
    "CobraMamba/mamba-gpt-3b": ModelType.SFT,
    "CobraMamba/mamba-gpt-3b-v2": ModelType.SFT,
    "CobraMamba/mamba-gpt-3b-v3": ModelType.SFT,
    "timdettmers/guanaco-33b-merged": ModelType.SFT,
    "elinas/chronos-33b": ModelType.SFT,
    "heegyu/RedTulu-Uncensored-3B-0719": ModelType.SFT,
    "heegyu/WizardVicuna-Uncensored-3B-0719": ModelType.SFT,
    "heegyu/WizardVicuna-3B-0719": ModelType.SFT,
    "meta-llama/Llama-2-7b-chat-hf": ModelType.RL,
    "meta-llama/Llama-2-7b-hf": ModelType.PT,
    "meta-llama/Llama-2-13b-chat-hf": ModelType.RL,
    "meta-llama/Llama-2-13b-hf": ModelType.PT,
    "meta-llama/Llama-2-70b-chat-hf": ModelType.RL,
    "meta-llama/Llama-2-70b-hf": ModelType.PT,
    "xhyi/PT_GPTNEO350_ATG": ModelType.SFT,
    "h2oai/h2ogpt-gm-oasst1-en-1024-20b": ModelType.SFT,
    "h2oai/h2ogpt-gm-oasst1-en-1024-open-llama-7b-preview-400bt": ModelType.SFT,
    "h2oai/h2ogpt-oig-oasst1-512-6_9b": ModelType.SFT,
    "h2oai/h2ogpt-oasst1-512-12b": ModelType.SFT,
    "h2oai/h2ogpt-oig-oasst1-256-6_9b": ModelType.SFT,
    "h2oai/h2ogpt-gm-oasst1-en-2048-open-llama-7b-preview-300bt": ModelType.SFT,
    "h2oai/h2ogpt-oasst1-512-20b": ModelType.SFT,
    "h2oai/h2ogpt-gm-oasst1-en-2048-open-llama-7b-preview-300bt-v2": ModelType.SFT,
    "h2oai/h2ogpt-gm-oasst1-en-1024-12b": ModelType.SFT,
    "h2oai/h2ogpt-gm-oasst1-multilang-1024-20b": ModelType.SFT,
    "bofenghuang/vigogne-13b-instruct": ModelType.SFT,
    "bofenghuang/vigogne-13b-chat": ModelType.SFT,
    "bofenghuang/vigogne-2-7b-instruct": ModelType.SFT,
    "bofenghuang/vigogne-7b-instruct": ModelType.SFT,
    "bofenghuang/vigogne-7b-chat": ModelType.SFT,
    "Vmware/open-llama-7b-v2-open-instruct": ModelType.SFT,
    "VMware/open-llama-0.7T-7B-open-instruct-v1.1": ModelType.SFT,
    "ewof/koishi-instruct-3b": ModelType.SFT,
    "gywy/llama2-13b-chinese-v1": ModelType.SFT,
    "GOAT-AI/GOAT-7B-Community": ModelType.SFT,
    "psyche/kollama2-7b": ModelType.SFT,
    "TheTravellingEngineer/llama2-7b-hf-guanaco": ModelType.SFT,
    "beaugogh/pythia-1.4b-deduped-sharegpt": ModelType.SFT,
    "augtoma/qCammel-70-x": ModelType.SFT,
    "Lajonbot/Llama-2-7b-chat-hf-instruct-pl-lora_unload": ModelType.SFT,
    "anhnv125/pygmalion-6b-roleplay": ModelType.SFT,
    "64bits/LexPodLM-13B": ModelType.SFT
}


def get_model_type(leaderboard_data: List[dict]):
    for model_data in leaderboard_data:
        # Todo @clefourrier once requests are connected with results 
        is_delta = False # (model_data["weight_type"] != "Original")
        # Stored information
        if model_data["model_name_for_query"] in TYPE_METADATA:
            model_data[AutoEvalColumn.model_type.name] = TYPE_METADATA[model_data["model_name_for_query"]].value.name
            model_data[AutoEvalColumn.model_type_symbol.name] = TYPE_METADATA[model_data["model_name_for_query"]].value.symbol + ("🔺" if is_delta else "")
        # Inferred from the name or the selected type 
        elif model_data[AutoEvalColumn.model_type.name] == "pretrained" or  any([i in model_data["model_name_for_query"] for i in ["pretrained"]]):
            model_data[AutoEvalColumn.model_type.name] = ModelType.PT.value.name
            model_data[AutoEvalColumn.model_type_symbol.name] = ModelType.PT.value.symbol + ("🔺" if is_delta else "")
        elif model_data[AutoEvalColumn.model_type.name] == "finetuned" or any([i in model_data["model_name_for_query"] for i in ["finetuned", "-ft-"]]):
            model_data[AutoEvalColumn.model_type.name] = ModelType.SFT.value.name
            model_data[AutoEvalColumn.model_type_symbol.name] = ModelType.SFT.value.symbol + ("🔺" if is_delta else "")
        elif model_data[AutoEvalColumn.model_type.name] == "with RL" or any([i in model_data["model_name_for_query"] for i in ["-rl-", "-rlhf-"]]):
            model_data[AutoEvalColumn.model_type.name] = ModelType.RL.value.name
            model_data[AutoEvalColumn.model_type_symbol.name] = ModelType.RL.value.symbol + ("🔺" if is_delta else "")
        else:
            model_data[AutoEvalColumn.model_type.name] = "N/A"
            model_data[AutoEvalColumn.model_type_symbol.name] = ("🔺" if is_delta else "")
 
 