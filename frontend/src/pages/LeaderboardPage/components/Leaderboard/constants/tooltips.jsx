import { Box, Typography } from "@mui/material";
import { resolveLocalizedString } from "i18n";

const createTooltipContent = (title, items) => (

  <Box sx={{ maxWidth: 400 }}>
    <Typography variant="body2" paragraph sx={{ mb: 1, color: "inherit" }}>
      {resolveLocalizedString(title)}
    </Typography>
    <Box component="ul" sx={{ m: 0, pl: 2 }}>
      {items.map(({ label, description, subItems }, index) => (
        <li key={index}>
          <Typography variant="body2" sx={{ mb: 0.5, color: "inherit" }}>
            <b>{resolveLocalizedString(label)}</b>: {resolveLocalizedString(description)}
            {subItems && (
              <Box component="ul" sx={{ mt: 0.5, mb: 1 }}>
                {subItems.map((item, subIndex) => (
                  <li key={subIndex}>
                    <Typography variant="body2" sx={{ color: "inherit" }}>
                      {resolveLocalizedString(item)}
                    </Typography>
                  </li>
                ))}
              </Box>
            )}
          </Typography>
        </li>
      ))}
    </Box>
  </Box>
);

export const COLUMN_TOOLTIPS = {
  AVERAGE: () => createTooltipContent({
    "en": "Average score across all benchmarks:",
    "fr": "Score moyen à travers tous les benchmarks"
  }, [
    {
      label: {
        "en": "Calculation",
        "fr": "Calcul"
      },
      description: {
        "en": "Weighted average of normalized scores from all benchmarks",
        "fr": "Moyenne pondérée des scores normalisés pour tous les benchmarks"
      },
      subItems: [
        {
          "en": "Each benchmark is normalized to a 0-100 scale",
          "fr": "Chage benchmark est normalisé sur une échelle de 0-100"
        },
        {
          "en": "All normalised benchmarks are then averaged together",
          "fr": "Tous les benchmarks normalisés sont ensuite moyennés"
        }
      ],
    },
  ]),

  IFEVALFR: () => createTooltipContent({
    "en": "Instruction-Following Evaluation (IFEval):",
    "fr": "Instruction-Following Evaluation (IFEval):"
    }, [
    {
      label: {"en": "Purpose", "fr": "Objectif"},
      description:
        {
          "en": "Tests model's ability to follow explicit formatting instructions",
          "fr": "Teste la capacité du modèle à suivre des intructions de formatage explicites"
        },
      subItems: [
        {"en": "Instruction following", "fr": "Suit les instructions"}, 
        {"en": "Formatting", "fr": "Formatage"},
        {"en": "Generation", "fr": "Génération"}
      ],
    },
    {
      label: {"en": "Scoring: Accuracy", "fr": "Notation: Précision"},
      description: {"en": "Was the format asked for strictly respected.", "fr": "Est-ce que le format demandé a été respecté strictement"},
    },
  ]),

  GPQAFR: () => createTooltipContent({"en": "Graduate-Level Google-Proof Q&A (GPQA):", "fr": "Graduate-Level Google-Proof Q&A (GPQA):"}, [
    {
      label: {"en": "Focus", "fr": "Accent"},
      description: {"en": "PhD-level knowledge multiple choice questions in science", "fr": "Questions à choix multiples de niveau doctorat en science"},
      subItems: [
        {"en": "Chemistry", "fr": "Chimie"},
        {"en": "Biology", "fr": "Biologie"},
        {"en": "Physics", "fr": "Physique"},
      ],
    },
    {
      label: {"en": "Scoring: Accuracy", "fr": "Notation: Précision"},
      description:
        {"en": "Was the correct choice selected among the options.", "fr": "Est-ce que le bon choix a été sélectionné parmi les options"},
    },
  ]),

  BACFR: () => createTooltipContent({"en": "French Baccalauréat (BAC FR):", "fr": "Baccalauréat Français (BAC FR)"}, [
    {
      label: {"en": "Scope", "fr": "Cadre"},
      description: {
        "en": "More than 700 question from the baccalauréat exam (end of high school national French exam), including the followong subjects : maths, computer science and physics-chemestry. The extracted questions are multiple choice, code completation or exact solution answer (with a tolerence degree).",
        "fr": "Plus de 700 questions du baccalauréat, comprenant les matières suivantes : mathématiques, numérique et sciende de l’informatique et physique-chimie. Les questions extraites sont des questions du type à choix multiple, de la completion du code ou des solutions exactes (avec un degré de tolérance)."
      },
    },
    {
      label: {"en": "Scoring: Accuracy", "fr": "Notation: Précision"
      },
      description:
        {
          "en": "(Prefix quasi-exact match) Was the solution generated correct and in the expected format.",
          "fr": "(Prefix quasi-exact match) La solution générée était-elle correcte et dans le format attendu."
        },
    },
  ]),

//   ARCHITECTURE: createTooltipContent("Model Architecture Information:", [
//     {
//       label: "Definition",
//       description: "The fundamental structure and design of the model",
//       subItems: [
//         "Pretrained: Foundational models, initially trained on large datasets without task-specific tuning, serving as a versatile base for further development.",
//         "Continuously Pretrained: Base models trained with a data mix evolving as the model is trained, with the addition of specialized data during the last training steps.",
//         "Fine-tuned: Base models, fine-tuned on specialised domain data (legal, medical, ...), and optimized for particular tasks.",
//         "Chat: Models fine-tuned with IFT, RLHF, DPO, and other techniques, to handle conversational contexts effectively.",
//         "Merged: Combining multiple models through weights averaging or similar methods.",
//         "Multimodal: Models which can handle several modalities (text & image/audio/video/...). We only evaluate the text capabilities.",
//       ],
//     },
//     {
//       label: "Impact",
//       description: "How architecture affects model capabilities",
//       subItems: [
//         "Base models are expected to perform less well on instruction following evaluations, like IFEval.",
//         "Fine-tuned and chat models can be more verbose and more chatty than base models.",
//         "Merged models tend to exhibit good performance on benchmarks, which do not translate to real-world situations.",
//       ],
//     },
//   ]),

//   PRECISION: createTooltipContent("Numerical Precision Format:", [
//     {
//       label: "Overview",
//       description:
//         "Data format used to store model weights and perform computations",
//       subItems: [
//         "bfloat16: Half precision (Brain Float format), good for stability",
//         "float16: Half precision",
//         "8bit/4bit: Quantized formats, for efficiency",
//         "GPTQ/AWQ: Quantized methods",
//       ],
//     },
//     {
//       label: "Impact",
//       description: "How precision affects model deployment",
//       subItems: [
//         "Higher precision = better accuracy but more memory usage",
//         "Lower precision = faster inference and smaller size",
//         "Trade-off between model quality and resource usage",
//       ],
//     },
//   ]),

//   FLAGS: createTooltipContent("Model Flags and Special Features:", [
//     {
//       label: "Filters",
//       subItems: [
//         "Mixture of Expert: Uses a MoE architecture",
//         "Merged models: Created by averaging other models",
//         "Contaminated: Flagged by users from the community for (possibly accidental) cheating",
//         "Unavailable: No longer on the hub (private, deleted) or missing a license tag",
//       ],
//     },
//     {
//       label: "Purpose",
//       description: "Why do people want to hide these models?",
//       subItems: [
//         "Mixture of Experts: These models can be too parameter heavy",
//         "Merged models: Performance on benchmarks tend to be inflated compared to real life usage",
//         "Contaminated: Performance on benchmarks is inflated and not reflecting real life usage",
//       ],
//     },
//   ]),

//   PARAMETERS: createTooltipContent("Model Parameters:", [
//     {
//       label: "Measurement",
//       description: "Total number of trainable parameters in billions",
//       subItems: [
//         "Indicates model capacity and complexity",
//         "Correlates with computational requirements",
//         "Influences memory usage and inference speed",
//       ],
//     },
//   ]),

//   LICENSE: createTooltipContent("Model License Information:", [
//     {
//       label: "Importance",
//       description: "Legal terms governing model usage and distribution",
//       subItems: [
//         "Commercial vs non-commercial use",
//         "Attribution requirements",
//         "Modification and redistribution rights",
//         "Liability and warranty terms",
//       ],
//     },
//   ]),

//   CO2_COST: createTooltipContent("Carbon Dioxide Emissions:", [
//     {
//       label: "What is it?",
//       description: "CO₂ emissions of the model evaluation ",
//       subItems: [
//         "Only focuses on model inference for our specific setup",
//         "Considers data center location and energy mix",
//         "Allows equivalent comparision of models on our use case",
//       ],
//     },
//     {
//       label: "Why it matters",
//       description: "Environmental impact of AI model training",
//       subItems: [
//         "Large models can have significant carbon footprints",
//         "Helps make informed choices about model selection",
//       ],
//     },
//     {
//       label: "Learn more",
//       description:
//         "For detailed information about our CO₂ calculation methodology, visit:",
//       subItems: [
//         <a
//           href="https://huggingface.co/docs/leaderboards/open_llm_leaderboard/emissions"
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ color: "#90caf9" }}
//         >
//           Carbon Emissions Documentation ↗
//         </a>,
//       ],
//     },
//   ]),
};

export const UI_TOOLTIPS = {
  COLUMN_SELECTOR: {"en": "Choose which columns to display in the table", "fr": "Choix des colonnes à afficher dans le tableau"},
  DISPLAY_OPTIONS: () => createTooltipContent({"en": "Table Display Options", "fr": "Options d'affichage du tableau" }, [
    {
      label: {"en": "Overview", "fr": "Aperçu"},
      description: {"en": "Configure how the table displays data and information", "fr": "Configure la manière dont le tableau affiche les données et l'information"},
      subItems: [
        {"en": "Row size and layout", "fr": "Disposition et taille des lignes"},
        {"en": "Score display format", "fr": "Format d'affichage des scores"},
        {"en": "Ranking calculation", "fr": "Calcul du rang"},
        {"en": "Average score computation", "fr": "Calcul du score moyen"},
      ],
    },
  ]),
  SEARCH_BAR: () => createTooltipContent({
    "en": "Advanced Model Search",
    "fr": "Recherche avancée de modèles"
  }, [
    {
      label: {
        "en": "Name Search",
        "fr": "Recherche par nom"
      },
      description: {
        "en": "Search directly by model name",
        "fr": "Rechercher un modèle par son nom"
      },
      subItems: [
        {
            "en": "Supports regular expressions (e.g., ^mistral.*7b)",
            "fr": "Supporte les expressions régulières (par ex. ^mistral.*7b)"
        },
        {
            "en": "Case sensitive",
            "fr": "Sensible à la casse"
        }
      ],
    },
    {
      label: {"en": "Field Search"},
      description: {"en": "Use @field:value syntax for precise filtering"},
      subItems: [
        {"en": "@architecture:llama - Filter by architecture",},
        {"en": "@license:mit - Filter by license",},
        {"en": "@precision:float16 - Filter by precision"},
        {"en": "@type:chat - Filter by model type"},
      ],
    },
    {
      label: {"en": "Multiple Searches"},
      description: {"en": "Combine multiple criteria using semicolons"},
      subItems: [
        {"en": "meta @license:mit; @architecture:llama"},
        {"en": "^mistral.*7b; @precision:float16"},
      ],
    },
  ]),
//   QUICK_FILTERS: createTooltipContent(
//     "Filter models based on their size and applicable hardware:",
//     [
//       {
//         label: "Edge devices (Up to 3BB)",
//         description:
//           "Efficient models for edge devices, optimized for blazing fast inference.",
//       },
//       {
//         label: "Smol Models (3B-7B)",
//         description:
//           "Efficient models for consumer hardware, optimized for fast inference.",
//       },
//       {
//         label: "Mid-range models (7B-65B)",
//         description:
//           "A bit of everything here, with overall balanced performance and resource usage around 30B.",
//       },
//       {
//         label: "GPU-rich models (65B+)",
//         description:
//           "State-of-the-art performance for complex tasks, requires significant computing power.",
//       },
//       {
//         label: "Official Providers",
//         description:
//           "Models directly maintained by their original creators, ensuring reliability and up-to-date performance.",
//       },
//     ]
//   ),
  ROW_SIZE: {
    title: {"en": "Row Size", "fr": "Taille des lignes"},
    description:
      {"en": "Adjust the height of table rows. Compact is ideal for viewing more data at once, while Large provides better readability and touch targets.",
        "fr": "Ajustez la taille des lignes du tableau."
      },
  },
  SCORE_DISPLAY: {
    title: {"en": "Score Display", "fr": "Affichage du score"},
    description:
      {"en": "Choose between normalized scores (0-100% scale for easy comparison) or raw scores (actual benchmark results). Normalized scores help compare performance across different benchmarks, while raw scores show actual benchmark outputs.",
       "fr": "Afficher les scores normalisées (échelle 0-100% pour une comparaison facile) ou les scores bruts (les résultats du benchmark tels quels). Les scores normalisées aident à comparer la performance à travers les différents benchmarks alors que les scores bruts montrent les résultats bruts de chaque benchmark."
      },
  },
  RANKING_MODE: {
    title: {"en": "Ranking Mode", "fr": "Type de classement"},
    description:
      {"en": "Choose between static ranking (original position in the full leaderboard) or dynamic ranking (position based on current filters and sorting).",
       "fr": "Choisir entre un classement statique (position originale dans le leaderboard complet) ou bien un classement dynamique (basé sur les filtres actuels)."
      },
  },
  AVERAGE_SCORE: {
    title: {"en": "Average Score Calculation", "fr": "Calcul du score moyen"},
    description:
      {"en": "Define how the average score is calculated. 'All Scores' uses all benchmarks, while 'Visible Only' calculates the average using only the visible benchmark columns.",
       "fr": "Definir comment le score moyen est calculé. 'Tous' utilise tous les benchmarks, alors que 'Visibles' calcule le score moyen en utilisant uniquement les colonnes de benchmarks visibles."
      },
  },
};

export const getTooltipStyle = {};

export const TABLE_TOOLTIPS = {
  HUB_LINK: (modelName) => `View ${modelName} on Hugging Face Hub`,
  EVAL_RESULTS: (modelName) =>
    `View detailed evaluation results for ${modelName}`,
  POSITION_CHANGE: (change) =>
    `${Math.abs(change)} position${Math.abs(change) > 1 ? "s" : ""} ${
      change > 0 ? "up" : "down"
    }`,
  METADATA: {
    TYPE: (type) => type || "-",
    ARCHITECTURE: (arch) => arch || "-",
    PRECISION: (precision) => precision || "-",
    LICENSE: (license) => license || "-",
    UPLOAD_DATE: (date) => date || "-",
    SUBMISSION_DATE: (date) => date || "-",
    BASE_MODEL: (model) => model || "-",
  },
};
