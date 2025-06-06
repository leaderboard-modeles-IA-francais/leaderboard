import { MODEL_TYPE_ORDER } from "./modelTypes";
import { LocalizedString, resolveLocalizedString } from "i18n";

// Time constants (in milliseconds)
const TIME = {
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  DEBOUNCE: {
    URL_PARAMS: 100,
    SEARCH: 150,
    RANGE_PICKER: 350,
  },
};

// Display constants
const DISPLAY = {
  ROW_SIZES: {
    normal: 45,
    large: 60,
  },
  SCORE_DISPLAY_OPTIONS: [
    { value: "normalized", label: {"en": "Normalized", "fr": "Normalisé"} },
    { value: "raw", label: {"en": "Raw", "fr": "Bruts"} },
  ],
  RANKING_MODE_OPTIONS: [
    { value: "static", label: {"en": "Static", "fr": "Statique"} },
    { value: "dynamic", label: {"en": "Dynamic", "fr": "Dynamique"} },
  ],
};

// Filter constants
const FILTERS = {
  PRECISIONS: ["bfloat16", "float16", "4bit"],
  SUBMISSION_PRECISIONS: [
    { value: "float16", label: "float16" },
    { value: "bfloat16", label: "bfloat16" },
    { value: "8bit", label: "8-bit" },
    { value: "4bit", label: "4-bit" },
    { value: "gptq", label: "GPTQ" },
  ],
  PARAMS_RANGE: [-1, 140],
  BOOLEAN_OPTIONS: [
    {
      value: "is_moe",
      label: "Mixture of Experts",
      hide: true,
    },
    {
      value: "is_merged",
      label: "Merged model",
      hide: true,
    },
    {
      value: "is_flagged",
      label: "Potentially contaminated model",
      hide: true,
    },
    {
      value: "is_not_available_on_hub",
      label: "Unavailable model",
      hide: true,
    },
    {
      value: "is_official_provider",
      label: "Only Official Providers",
      hide: false,
    },
  ],
  HIGHLIGHT_OPTIONS: [
    {
      value: "is_official_provider",
      label: "Only Official Providers",
    },
  ],
};

// Column size constants
const COLUMN_SIZES = {
  RANK: 100,
  TYPE_ICON: 100,
  MODEL: 400,
  AVERAGE_SCORE: 150,
  BENCHMARK: 110,
  CO2_COST: 140,
  HUB_HEARTS: 140,
  ARCHITECTURE: 210,
  PRECISION: 140,
  PARAMS: 160,
  LICENSE: 160,
  UPLOAD_DATE: 160,
  SUBMISSION_DATE: 200,
  GENERATION: 160,
  BASE_MODEL: 390,
  HUB_AVAILABILITY: 180,
  OFFICIAL_PROVIDER: 240,
  MOE: 200,
  FLAG_STATUS: 160,
  CHAT_TEMPLATE: 140,
};

const RANK : LocalizedString = {
    "en": "Rank",
    "fr": "Rang"
}

const MODEL : LocalizedString = {
    "en": "Model",
    "fr": "Modèle"
}

const SCORE : LocalizedString = {
    "en": "Average Score",
    "fr": "Score moyen"
}

// Column definitions with organized structure
const COLUMNS = {
  FIXED: {
    rank: {
      group: "fixed",
      size: COLUMN_SIZES.RANK,
      defaultVisible: true,
      label: RANK,
    },
    "model.type_icon": {
      group: "fixed",
      size: COLUMN_SIZES.TYPE_ICON,
      defaultVisible: true,
      label: "Type",
    },
    id: {
      group: "fixed",
      size: COLUMN_SIZES.MODEL,
      defaultVisible: true,
      label: MODEL,
    },
    "model.average_score": {
      group: "fixed",
      size: COLUMN_SIZES.AVERAGE_SCORE,
      defaultVisible: true,
      label: SCORE,
    },
  },
  EVALUATION: {
    "evaluations.ifeval_fr.normalized_score": {
      group: "evaluation",
      size: COLUMN_SIZES.BENCHMARK,
      defaultVisible: true,
      label: "IFEval FR",
    },
    "evaluations.gpqa_fr.normalized_score": {
      group: "evaluation",
      size: COLUMN_SIZES.BENCHMARK,
      defaultVisible: true,
      label: "GPQA FR",
    },
    "evaluations.bac_fr.normalized_score": {
      group: "evaluation",
      size: COLUMN_SIZES.BENCHMARK,
      defaultVisible: true,
      label: "BAC FR",
    },
  },
//   MODEL_INFO: {
//     "metadata.co2_cost": {
//       group: "model_info",
//       size: COLUMN_SIZES.CO2_COST,
//       defaultVisible: true,
//       label: "CO₂ Cost (kg)",
//     },
//     "metadata.hub_hearts": {
//       group: "model_info",
//       size: COLUMN_SIZES.HUB_HEARTS,
//       defaultVisible: false,
//       label: "Hub ❤️",
//     },
//     "model.architecture": {
//       group: "model_info",
//       size: COLUMN_SIZES.ARCHITECTURE,
//       defaultVisible: false,
//       label: "Architecture",
//     },
//     "model.precision": {
//       group: "model_info",
//       size: COLUMN_SIZES.PRECISION,
//       defaultVisible: false,
//       label: "Precision",
//     },
//     "metadata.params_billions": {
//       group: "model_info",
//       size: COLUMN_SIZES.PARAMS,
//       defaultVisible: false,
//       label: "Parameters (B)",
//     },
//     "metadata.hub_license": {
//       group: "model_info",
//       size: COLUMN_SIZES.LICENSE,
//       defaultVisible: false,
//       label: "License",
//     },
//     "model.has_chat_template": {
//       group: "model_info",
//       size: COLUMN_SIZES.CHAT_TEMPLATE,
//       defaultVisible: false,
//       label: "Chat Template",
//     },
//   },
//   ADDITIONAL_INFO: {
//     "metadata.upload_date": {
//       group: "additional_info",
//       size: COLUMN_SIZES.UPLOAD_DATE,
//       defaultVisible: false,
//       label: "Upload Date",
//     },
//     "metadata.submission_date": {
//       group: "additional_info",
//       size: COLUMN_SIZES.SUBMISSION_DATE,
//       defaultVisible: false,
//       label: "Submission Date",
//     },
//     "metadata.generation": {
//       group: "additional_info",
//       size: COLUMN_SIZES.GENERATION,
//       defaultVisible: false,
//       label: "Generation",
//     },
//     "metadata.base_model": {
//       group: "additional_info",
//       size: COLUMN_SIZES.BASE_MODEL,
//       defaultVisible: false,
//       label: "Base Model",
//     },
//     "features.is_not_available_on_hub": {
//       group: "additional_info",
//       size: COLUMN_SIZES.HUB_AVAILABILITY,
//       defaultVisible: false,
//       label: "Hub Availability",
//     },
//     "features.is_official_provider": {
//       group: "additional_info",
//       size: COLUMN_SIZES.OFFICIAL_PROVIDER,
//       defaultVisible: false,
//       label: "Only Official Providers",
//     },
//     "features.is_moe": {
//       group: "additional_info",
//       size: COLUMN_SIZES.MOE,
//       defaultVisible: false,
//       label: "Mixture of Experts",
//     },
//     "features.is_flagged": {
//       group: "additional_info",
//       size: COLUMN_SIZES.FLAG_STATUS,
//       defaultVisible: false,
//       label: "Flag Status",
//     },
//   },
};

// Combine all columns for backward compatibility
const ALL_COLUMNS = {
  ...COLUMNS.FIXED,
  ...COLUMNS.EVALUATION,
//   ...COLUMNS.MODEL_INFO,
//   ...COLUMNS.ADDITIONAL_INFO,
};

// Column definitions for external use (maintaining the same interface)
const COLUMN_DEFINITIONS = {
  ALL_COLUMNS,
  COLUMN_GROUPS: {
    "eval_scores": {displayName: {"en": "Evaluation Scores", "fr": "Scores d'évaluation"}, items: Object.keys(COLUMNS.EVALUATION)},
    // "Model Information": Object.keys(COLUMNS.MODEL_INFO),
    // "Additional Information": Object.keys(COLUMNS.ADDITIONAL_INFO),
  },
  COLUMN_LABELS: Object.entries(ALL_COLUMNS).reduce((acc, [key, value]) => {
    acc[key] = value.label;
    return acc;
  }, {}),
  DEFAULT_VISIBLE: Object.entries(ALL_COLUMNS)
    .filter(([_, value]) => value.defaultVisible)
    .map(([key]) => key),

  // Remettre les getters nécessaires
  get FIXED() {
    return Object.entries(ALL_COLUMNS)
      .filter(([_, def]) => def.group === "fixed")
      .map(([key]) => key);
  },

  get EVALUATION() {
    return Object.entries(ALL_COLUMNS)
      .filter(([_, def]) => def.group === "evaluation")
      .map(([key]) => key);
  },

  get OPTIONAL() {
    return Object.entries(ALL_COLUMNS)
      .filter(([_, def]) => def.group !== "fixed" && def.group !== "evaluation")
      .map(([key]) => key);
  },

  get COLUMN_SIZES() {
    return Object.entries(ALL_COLUMNS).reduce(
      (acc, [key, def]) => ({
        ...acc,
        [key]: def.size,
      }),
      {}
    );
  },
};

// Export constants maintaining the same interface
export const FILTER_PRECISIONS = FILTERS.PRECISIONS;
export const SUBMISSION_PRECISIONS = FILTERS.SUBMISSION_PRECISIONS;
export const PARAMS_RANGE = FILTERS.PARAMS_RANGE;
export const CACHE_SETTINGS = { DURATION: TIME.CACHE_DURATION };
export const PINNED_MODELS = [];
export const DEBOUNCE_TIMINGS = TIME.DEBOUNCE;
export const ROW_SIZES = DISPLAY.ROW_SIZES;
export const SCORE_DISPLAY_OPTIONS = DISPLAY.SCORE_DISPLAY_OPTIONS;
export const RANKING_MODE_OPTIONS = DISPLAY.RANKING_MODE_OPTIONS;
export const BOOLEAN_FILTER_OPTIONS = FILTERS.BOOLEAN_OPTIONS;
export const HIGHLIGHT_FILTER_OPTIONS = FILTERS.HIGHLIGHT_OPTIONS;
export { COLUMN_DEFINITIONS };

// Export defaults for backward compatibility
export const TABLE_DEFAULTS = {
  ROW_SIZE: "normal",
  SCORE_DISPLAY: "normalized",
  AVERAGE_MODE: "all",
  RANKING_MODE: "static",
  SEARCH: {
    PRECISIONS: FILTERS.PRECISIONS,
    TYPES: MODEL_TYPE_ORDER,
    PARAMS_RANGE: FILTERS.PARAMS_RANGE,
  },
  DEFAULT_SELECTED: {
    searchValue: "",
    selectedPrecisions: FILTERS.PRECISIONS,
    selectedTypes: MODEL_TYPE_ORDER,
    paramsRange: FILTERS.PARAMS_RANGE,
    selectedBooleanFilters: [],
  },
  DEBOUNCE: TIME.DEBOUNCE,
  COLUMNS: COLUMN_DEFINITIONS,
  PINNED_MODELS: [],
  CACHE_DURATION: TIME.CACHE_DURATION,
};

// Highlight colors for search and table
export const HIGHLIGHT_COLORS = [
  "#1f77b4", // bleu
  "#ff7f0e", // orange
  "#2ca02c", // vert
  "#d62728", // rouge
  "#9467bd", // violet
  "#8c564b", // marron
  "#e377c2", // rose
  "#7f7f7f", // gris
  "#bcbd22", // olive
  "#17becf", // cyan
];

// Skeleton columns widths (in pixels)
export const SKELETON_COLUMNS = [
  40, // Checkbox
  COLUMN_SIZES.RANK, // Rank
  COLUMN_SIZES.TYPE_ICON, // Type icon
  COLUMN_SIZES.MODEL, // Model name
  COLUMN_SIZES.AVERAGE_SCORE, // Average score
  COLUMN_SIZES.BENCHMARK, // Benchmark 1
  COLUMN_SIZES.BENCHMARK, // Benchmark 2
  COLUMN_SIZES.BENCHMARK, // Benchmark 3
  COLUMN_SIZES.BENCHMARK, // Benchmark 4
  COLUMN_SIZES.BENCHMARK, // Benchmark 5
  COLUMN_SIZES.BENCHMARK, // Benchmark 6
];
