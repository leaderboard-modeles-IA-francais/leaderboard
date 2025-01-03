import { Box, Typography } from "@mui/material";

const createTooltipContent = (title, items) => (
  <Box sx={{ maxWidth: 400 }}>
    <Typography variant="body2" paragraph sx={{ mb: 1, color: "inherit" }}>
      {title}
    </Typography>
    <Box component="ul" sx={{ m: 0, pl: 2 }}>
      {items.map(({ label, description, subItems }, index) => (
        <li key={index}>
          <Typography variant="body2" sx={{ mb: 0.5, color: "inherit" }}>
            <b>{label}</b>: {description}
            {subItems && (
              <Box component="ul" sx={{ mt: 0.5, mb: 1 }}>
                {subItems.map((item, subIndex) => (
                  <li key={subIndex}>
                    <Typography variant="body2" sx={{ color: "inherit" }}>
                      {item}
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
  AVERAGE: createTooltipContent("Average score across all benchmarks:", [
    {
      label: "Calculation",
      description: "Weighted average of normalized scores from all benchmarks",
      subItems: [
        "Each benchmark is normalized to a 0-100 scale",
        "All normalised benchmarks are then averaged together",
      ],
    },
  ]),

  IFEVAL: createTooltipContent("Instruction-Following Evaluation (IFEval):", [
    {
      label: "Purpose",
      description:
        "Tests model's ability to follow explicit formatting instructions",
      subItems: ["Instruction following", "Formatting", "Generation"],
    },
    {
      label: "Scoring: Accuracy",
      description: "Was the format asked for strictly respected.",
    },
  ]),

  BBH: createTooltipContent("Big Bench Hard (BBH):", [
    {
      label: "Overview",
      description: "Collection of challenging for LLM tasks across domains, for example",
      subItems: [
        "Language understanding",
        "Mathematical reasoning",
        "Common sense and world knowledge",
      ],
    },
    {
      label: "Scoring: Accuracy",
      description:
        "Was the correct choice selected among the options.",
    },
  ]),

  MATH: createTooltipContent(
    "Mathematics Aptitude Test of Heuristics (MATH), level 5:",
    [
      {
        label: "Content",
        description: "High school level competitions mathematical problems",
        subItems: ["Complex algebra", "Geometry problems", "Advanced calculus"],
      },
      {
        label: "Scoring: Exact match",
        description:
          "Was the solution generated correct and in the expected format",
      },
    ]
  ),

  GPQA: createTooltipContent("Graduate-Level Google-Proof Q&A (GPQA):", [
    {
      label: "Focus",
      description: "PhD-level knowledge multiple choice questions in science",
      subItems: [
        "Chemistry",
        "Biology",
        "Physics",
      ],
    },
    {
      label: "Scoring: Accuracy",
      description:
        "Was the correct choice selected among the options.",
    },
  ]),

  MUSR: createTooltipContent("Multistep Soft Reasoning (MuSR):", [
    {
      label: "Scope",
      description: "Reasoning and understanding on/of long texts",
      subItems: [
        "Language understanding",
        "Reasoning capabilities",
        "Long context reasoning",
      ],
    },
    {
      label: "Scoring: Accuracy",
      description:
        "Was the correct choice selected among the options.",
    },
  ]),

  MMLU_PRO: createTooltipContent(
    "Massive Multitask Language Understanding - Professional (MMLU-Pro):",
    [
      {
        label: "Coverage",
        description: "Expertly reviewed multichoice questions across domains, for example:",
        subItems: [
          "Medicine and healthcare",
          "Law and ethics",
          "Engineering",
          "Mathematics",
        ],
      },
      {
        label: "Scoring: Accuracy",
        description:
          "Was the correct choice selected among the options.",
      },
    ]
  ),

  ARCHITECTURE: createTooltipContent("Model Architecture Information:", [
    {
      label: "Definition",
      description: "The fundamental structure and design of the model",
      subItems: [
        "Pretrained: Foundational models, initially trained on large datasets without task-specific tuning, serving as a versatile base for further development.",
        "Continuously Pretrained: Base models trained with a data mix evolving as the model is trained, with the addition of specialized data during the last training steps.",
        "Fine-tuned: Base models, fine-tuned on specialised domain data (legal, medical, ...), and optimized for particular tasks.",
        "Chat: Models fine-tuned with IFT, RLHF, DPO, and other techniques, to handle conversational contexts effectively.",
        "Merged: Combining multiple models through weights averaging or similar methods.",
        "Multimodal: Models which can handle several modalities (text & image/audio/video/...). We only evaluate the text capabilities.",
      ],
    },
    {
      label: "Impact",
      description: "How architecture affects model capabilities",
      subItems: [
        "Base models are expected to perform less well on instruction following evaluations, like IFEval.",
        "Fine-tuned and chat models can be more verbose and more chatty than base models.",
        "Merged models tend to exhibit good performance on benchmarks, which do not translate to real-world situations.",
      ],
    },
  ]),

  PRECISION: createTooltipContent("Numerical Precision Format:", [
    {
      label: "Overview",
      description:
        "Data format used to store model weights and perform computations",
      subItems: [
        "bfloat16: Half precision (Brain Float format), good for stability",
        "float16: Half precision",
        "8bit/4bit: Quantized formats, for efficiency",
        "GPTQ/AWQ: Quantized methods",
      ],
    },
    {
      label: "Impact",
      description: "How precision affects model deployment",
      subItems: [
        "Higher precision = better accuracy but more memory usage",
        "Lower precision = faster inference and smaller size",
        "Trade-off between model quality and resource usage",
      ],
    },
  ]),

  FLAGS: createTooltipContent("Model Flags and Special Features:", [
    {
      label: "Filters",
      subItems: [
        "Mixture of Expert: Uses a MoE architecture",
        "Merged models: Created by averaging other models",
        "Contaminated: Flagged by users from the community for (possibly accidental) cheating",
        "Unavailable: No longer on the hub (private, deleted) or missing a license tag",
      ],
    },
    {
      label: "Purpose",
      description: "Why do people want to hide these models?",
      subItems: [
        "Mixture of Experts: These models can be too parameter heavy",
        "Merged models: Performance on benchmarks tend to be inflated compared to real life usage",
        "Contaminated: Performance on benchmarks is inflated and not reflecting real life usage",
      ],
    },
  ]),

  PARAMETERS: createTooltipContent("Model Parameters:", [
    {
      label: "Measurement",
      description: "Total number of trainable parameters in billions",
      subItems: [
        "Indicates model capacity and complexity",
        "Correlates with computational requirements",
        "Influences memory usage and inference speed",
      ],
    },
  ]),

  LICENSE: createTooltipContent("Model License Information:", [
    {
      label: "Importance",
      description: "Legal terms governing model usage and distribution",
      subItems: [
        "Commercial vs non-commercial use",
        "Attribution requirements",
        "Modification and redistribution rights",
        "Liability and warranty terms",
      ],
    },
  ]),

  CO2_COST: createTooltipContent("Carbon Dioxide Emissions:", [
    {
      label: "What is it?",
      description: "CO₂ emissions of the model evaluation ",
      subItems: [
        "Only focuses on model inference for our specific setup",
        "Considers data center location and energy mix",
        "Allows equivalent comparision of models on our use case",
      ],
    },
    {
      label: "Why it matters",
      description: "Environmental impact of AI model training",
      subItems: [
        "Large models can have significant carbon footprints",
        "Helps make informed choices about model selection",
      ],
    },
    {
      label: "Learn more",
      description:
        "For detailed information about our CO₂ calculation methodology, visit:",
      subItems: [
        <a
          href="https://huggingface.co/docs/leaderboards/open_llm_leaderboard/emissions"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#90caf9" }}
        >
          Carbon Emissions Documentation ↗
        </a>,
      ],
    },
  ]),
};

export const UI_TOOLTIPS = {
  COLUMN_SELECTOR: "Choose which columns to display in the table",
  DISPLAY_OPTIONS: createTooltipContent("Table Display Options", [
    {
      label: "Overview",
      description: "Configure how the table displays data and information",
      subItems: [
        "Row size and layout",
        "Score display format",
        "Ranking calculation",
        "Average score computation",
      ],
    },
  ]),
  SEARCH_BAR: createTooltipContent("Advanced Model Search", [
    {
      label: "Name Search",
      description: "Search directly by model name",
      subItems: [
        "Supports regular expressions (e.g., ^mistral.*7b)",
        "Case sensitive",
      ],
    },
    {
      label: "Field Search",
      description: "Use @field:value syntax for precise filtering",
      subItems: [
        "@architecture:llama - Filter by architecture",
        "@license:mit - Filter by license",
        "@precision:float16 - Filter by precision",
        "@type:chat - Filter by model type",
      ],
    },
    {
      label: "Multiple Searches",
      description: "Combine multiple criteria using semicolons",
      subItems: [
        "meta @license:mit; @architecture:llama",
        "^mistral.*7b; @precision:float16",
      ],
    },
  ]),
  QUICK_FILTERS: createTooltipContent(
    "Filter models based on their size and applicable hardware:",
    [
      {
        label: "Edge devices (Up to 3BB)",
        description:
          "Efficient models for edge devices, optimized for blazing fast inference.",
      },
      {
        label: "Smol Models (3B-7B)",
        description:
          "Efficient models for consumer hardware, optimized for fast inference.",
      },
      {
        label: "Mid-range models (7B-65B)",
        description:
          "A bit of everything here, with overall balanced performance and resource usage around 30B.",
      },
      {
        label: "GPU-rich models (65B+)",
        description:
          "State-of-the-art performance for complex tasks, requires significant computing power.",
      },
      {
        label: "Official Providers",
        description:
          "Models directly maintained by their original creators, ensuring reliability and up-to-date performance.",
      },
    ]
  ),
  ROW_SIZE: {
    title: "Row Size",
    description:
      "Adjust the height of table rows. Compact is ideal for viewing more data at once, while Large provides better readability and touch targets.",
  },
  SCORE_DISPLAY: {
    title: "Score Display",
    description:
      "Choose between normalized scores (0-100% scale for easy comparison) or raw scores (actual benchmark results). Normalized scores help compare performance across different benchmarks, while raw scores show actual benchmark outputs.",
  },
  RANKING_MODE: {
    title: "Ranking Mode",
    description:
      "Choose between static ranking (original position in the full leaderboard) or dynamic ranking (position based on current filters and sorting).",
  },
  AVERAGE_SCORE: {
    title: "Average Score Calculation",
    description:
      "Define how the average score is calculated. 'All Scores' uses all benchmarks, while 'Visible Only' calculates the average using only the visible benchmark columns.",
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
