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
      label: "Scoring",
      description: "Accuracy: was the format asked for strictly respected.",
    },
  ]),

  BBH: createTooltipContent("Big Bench Hard (BBH):", [
    {
      label: "Overview",
      description: "Collection of challenging for LLM tasks across domains",
      subItems: [
        "Language understanding",
        "Mathematical reasoning",
        "Common sense and world knowledge",
      ],
    },
    {
      label: "Scoring",
      description:
        "Accuracy: was the correct choice selected among the options.",
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
        label: "Evaluation",
        description:
          "Accuracy: is the solution generated correct and in the expected format",
      },
    ]
  ),

  GPQA: createTooltipContent("Graduate-Level Google-Proof Q&A (GPQA):", [
    {
      label: "Focus",
      description: "PhD-level knowledge multiple choice questions in science",
      subItems: [
        "PhD-level chemistry",
        "PhD-level biology",
        "PhD-level physics",
      ],
    },
    {
      label: "Methodology",
      description:
        "Accuracy: was the correct choice selected among the options.",
    },
  ]),

  MUSR: createTooltipContent("Multistep Soft Reasoning (MUSR):", [
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
      label: "Scoring",
      description:
        "Accuracy: was the correct choice selected among the options.",
    },
  ]),

  MMLU_PRO: createTooltipContent(
    "Massive Multitask Language Understanding - Professional (MMLU-Pro):",
    [
      {
        label: "Coverage",
        description: "Expertly reviewed multichoice questions across domains",
        subItems: [
          "Medicine and healthcare",
          "Law and ethics",
          "Engineering",
          "Mathematics",
        ],
      },
      {
        label: "Evaluation",
        description:
          "Accuracy: was the correct choice selected among the options.",
      },
    ]
  ),

  ARCHITECTURE: createTooltipContent("Model Architecture Information:", [
    {
      label: "Definition",
      description: "The fundamental structure and design of the model",
      subItems: [
        "Base architecture type (e.g., Llama, Mistral, GPT-J)",
        "Specific architectural innovations and improvements",
        "Model family and version information",
        "Core design principles and techniques used",
      ],
    },
    {
      label: "Impact",
      description: "How architecture affects model capabilities",
      subItems: [
        "Influences model's learning capacity and efficiency",
        "Determines hardware compatibility and requirements",
        "Affects inference speed and memory usage",
      ],
    },
  ]),

  PRECISION: createTooltipContent("Numerical Precision Format:", [
    {
      label: "Overview",
      description:
        "Data format used to store model weights and perform computations",
      subItems: [
        "BFloat16: Brain Float format, good for training stability",
        "Float16: Half precision, balances accuracy and speed",
        "Int8/Int4: Quantized formats for efficiency",
        "GPTQ/AWQ: Advanced quantization techniques",
      ],
    },
    {
      label: "Impact",
      description: "How precision affects model deployment",
      subItems: [
        "Higher precision = better accuracy but more memory usage",
        "Lower precision = faster inference and smaller size",
        "Different hardware compatibility requirements",
        "Trade-off between model quality and resource usage",
      ],
    },
    {
      label: "Use Cases",
      description: "Choosing the right precision format",
      subItems: [
        "Production deployment optimization",
        "Resource-constrained environments",
        "High-performance computing scenarios",
      ],
    },
  ]),

  FLAGS: createTooltipContent("Model Flags and Special Features:", [
    {
      label: "Purpose",
      description: "Special indicators and capabilities of the model",
      subItems: [
        "Safeguards and content filtering features",
        "Specialized training techniques used",
        "Hardware optimization flags",
        "Deployment-specific configurations",
      ],
    },
    {
      label: "Common Flags",
      description: "Frequently used model indicators",
      subItems: [
        "RLHF: Reinforcement Learning from Human Feedback",
        "DPO: Direct Preference Optimization",
        "MoE: Mixture of Experts architecture",
        "Flash Attention: Optimized attention implementation",
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
        "Promotes awareness of AI's environmental impact",
      ],
    },
    {
      label: "Learn more",
      description:
        "For detailed information about our CO₂ calculation methodology, visit:",
      subItems: [
        <a
          href="https://huggingface.co/docs/hub/carbon-emissions"
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
    "Filter models based on their size and capabilities:",
    [
      {
        label: "Small Models (1.7B-7B)",
        description:
          "Efficient models for consumer hardware and edge devices, optimized for fast inference.",
      },
      {
        label: "Medium Models (7B-70B)",
        description:
          "Balanced performance and resource usage, ideal for most production use cases.",
      },
      {
        label: "Large Models (70B+)",
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
