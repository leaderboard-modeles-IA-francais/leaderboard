import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Stack,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { alpha } from "@mui/material/styles";
import InfoIconWithTooltip from "../../../../components/shared/InfoIconWithTooltip";
import { MODEL_TYPES } from "../../../LeaderboardPage/components/Leaderboard/constants/modelTypes";
import { SUBMISSION_PRECISIONS } from "../../../LeaderboardPage/components/Leaderboard/constants/defaults";
import AuthContainer from "../../../../components/shared/AuthContainer";
import { resolveLocalizedString, useResolveLocalizedString } from "i18n";

const WEIGHT_TYPES = [
  { value: "Original", label: "Original" },
  { value: "Delta", label: "Delta" },
  { value: "Adapter", label: "Adapter" },
];

const HELP_TEXTS = {
  modelName: () => (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {resolveLocalizedString({"en": "Model Name on Hugging Face Hub", "fr": "Nom du modèle sur le Hub Hugging Face"})}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
        {
            resolveLocalizedString({
                "en": "Your model must be public and loadable with AutoClasses without trust_remote_code. The model should be in Safetensors format for better safety and loading performance. Example: mistralai/Mistral-7B-v0.1",
                "fr": "Votre modèle doit être public et chargeable avec AutoClasses sans trust_remote_dode. Le modèle doit être dans le format Safetensors pour une meilleure sécurité et une meilleure performace de chargement. Exemple: mistralai/Mistral-7B-v0.1"
            })
        }
      </Typography>
    </Box>
  ),
  revision: () => (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {resolveLocalizedString({"en": "Model Revision", "fr": "Révision du modèle"})}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
        {
            resolveLocalizedString({
                "en": "Git branch, tag or commit hash. The evaluation will be strictly tied to this specific commit to ensure consistency. Make sure this version is stable and contains all necessary files.",
                "fr": "Branche, tag ou hash de commit git. L'évaluation sera strictement liée à ce commit spécifique pour assurer une consistence. Assurez vous que cette version est stable et contient tous les fichiers nécessaires. "
            })
        }
      </Typography>
    </Box>
  ),
  modelType: () => (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {resolveLocalizedString({"en": "Model Category", "fr": "Catégorie de modèle"})}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
        {
          resolveLocalizedString({
            "en": "🟢 Pretrained: Base models trained on text using masked modeling 🟩 Continuously Pretrained: Extended training on additional corpus 🔶 Fine-tuned: Domain-specific optimization 💬 Chat: Models using RLHF, DPO, or IFT for conversation 🤝 Merge: Combined weights without additional training 🌸 Multimodal: Handles multiple input types",
            "fr": "🟢 Pretrained: Modèles de base entrainés sur du texte en utilisant du modeling masqué 🟩 Continuously Pretrained: Entrainement étendu sur un corpus additionel 🔶 Fine-tuned: Optimisation spéficique à un domaine  💬 Chat: Modèles utilisant RLHF, DPO, ou IFT pour de la conversation 🤝 Merge: Pondérations combinés sans entrainement additionel 🌸 Multimodal: Gère plusieurs types d'entrée"
          })
        }
      </Typography>
    </Box>
  ),
  baseModel: () => (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {resolveLocalizedString({"en": "Base Model Reference", "fr": "Référence du modèle de base"})}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
        {
          resolveLocalizedString({
            "en": "Required for delta weights or adapters. This information is used to identify the original model and calculate the total parameter count by combining base model and adapter/delta parameters.",
            "fr": "Nécessaire pour les delta weights ou les adapteurs. Cette information est utilisée pour identifier le modèle original est calculer le nombre total de paramètres en combinant les paramètres du modèles de base et les paramètres adatpeur/delta."
          })
        }
      </Typography>
    </Box>
  ),
  precision:  () => (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {resolveLocalizedString({
            "en": "Model Precision", "fr": "Précision du modèle"
        })}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
        {
            resolveLocalizedString({
                "en": "Size limits vary by precision: • FP16/BF16: up to 100B parameters • 8-bit: up to 280B parameters (2x) • 4-bit: up to 560B parameters (4x) Choose carefully as incorrect precision can cause evaluation errors.",
                "fr": "Les limites de taille varient en fonction de la précision: • FP16/BF16: jusqu'à 100B paramètres • 8-bit: jusqu'à 280B paramètres (2x) • 4-bit: jusqu'à 560B paramètres (4x) Choisissez avec attention: une précision incorrecte peut provoquer des erreurs d'évaluation."
            })
        }
      </Typography>
    </Box>
  ),
  weightsType: () => (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {resolveLocalizedString({
            "en": "Weights Format",
            "fr": "Format de pondération"
        })}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
        {
            resolveLocalizedString({
                "en": "Original: Complete model weights in safetensors format Delta: Weight differences from base model (requires base model for size calculation) Adapter: Lightweight fine-tuning layers (requires base model for size calculation)",
                "fr": "Original: modèle de pondération complet en format safetensors, Delta: Différences de poids du modèle de base (nécessite un modèle de base pour calcul de la taille), Adapteur: Couches d'affinage légères (requeirt un modèle de base pour le calcul de la taille)"
            })
        }
      </Typography>
    </Box>
  ),
  chatTemplate: () => (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {resolveLocalizedString(
            {
                "en": "Chat Template Support",
                "fr": "Support de template de chat"
            }
        )}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
        {
            resolveLocalizedString({
                "en": "Activates automatically for chat models. It uses the standardized Hugging Face chat template for consistent prompt formatting during evaluation. Required for models using RLHF, DPO, or instruction fine-tuning.",
                "fr": "S'active automatiquement pour les modèles de chat. Utilise le template Hugging Face standardisé pour un formattage de prompt consistant durant l'évaluation. Nécessaire pour les modèles utilisant RLHF, DPO, ou un affinage d'instruction."
            })
        }
      </Typography>
    </Box>
  ),
};

const INTERNATIONALISATION = {
    SUBMITTED: {
        "en": "Model submitted successfully !",
        "fr": "Modèle soumis avec succes !"
    },
    SUBMITTED_MESSAGE: {
        T1: {
            "en": "Your model",
            "fr": "Votre modèle"
        },
        T2: {
            "en": "has been added to the evaluation queue with the following parameters: ",
            "fr": "a été ajoute à la queue d'évaluation avec les paramètres suivants: "
        }
    },
    PARAMETERS: {
        MODEL: {
            "en": "Model:",
            "fr": "Modèle:"
        },
        REVISION: {
            "en": "Revision:",
            "fr": "Révision:"
        },
        PRECISION: {
            "en": "Precision:",
            "fr": "Précision:"
        },
        WEIGHTS: {
            "en": "Weight type:",
            "fr": "Pondération:"
        },
        BASE: {
            "en": "Base model:",
            "fr": "Modèle de base:"
        },
        TEMPLATE: {
            "en": "Chat template:",
            "fr": "Template de chat:"
        },
        UPVOTE: {
            "en": "An automatic upvote has been added to your model to help with prioritization.",
            "fr": "Un upvote automatique a ete rajoute a votre modèle pour aider a la priorization."
        },
        OTHER: {
            "en": "Submit another model",
            "fr": "Soumettre un autre modèle"
        }
    },
    FORM: {
        TITLE: {
            "en": "Model Submission Form",
            "fr": "Formulaire pour soumettre un modèle"
        },
        MODEL_INFO: {
            TITLE: {
                "en": "Model Information",
                "fr": "Informations sur le modèle"
            },
            NAME: {
                LABEL: {
                    "en": "Model Name",
                    "fr": "Nom du modèle"
                },
                PLACEHOLDER: {
                    "en": "organization/model-name",
                    "fr": "organisation/nom-de-modele"
                }
            },
            REVISION: {
                LABEL: {
                    "en": "Revision commit",
                    "fr": "Commit de la révision"
                },
                HELPER_TEXT: {
                    "en": "Default: main",
                    "fr": "Defaut: main"
                }
            }
        },
        MODEL_CONFIG: {
            TITLE: {
                "en": "Model Configuration",
                "fr": "Configuration du modèle"
            },
            TYPE: {
                LABEL: {
                    "en": "Model Type",
                    "fr": "Type de modèle"
                },
            },
            TEMPLATE: {
                LABEL: {
                    "en": "Use chat template",
                    "fr": "Utiliser un template de chat"
                }
            },
            PRECISION: {
                LABEL: {
                    "en": "Precision",
                    "fr": "Précision"
                }
            },
            WEIGHTS: {
                LABEL: {
                    "en": "Weights Type",
                    "fr": "Pondération"
                } 
            }
        },
        REQUIRED: {
            "en": "All fields marked with * are required",
            "fr": "Tous les champs marques par une * sont requis"
        },
        BUTTON: {
            "en": "Submit",
            "fr": "Soumettre"
        }
    }
}

// Convert MODEL_TYPES to format expected by Select component
const modelTypeOptions = Object.entries(MODEL_TYPES).map(
  ([value, { icon, label }]) => ({
    value,
    label: `${icon} ${label}`,
  })
);

function ModelSubmissionForm({ user, isAuthenticated }) {
  const [formData, setFormData] = useState({
    modelName: "",
    revision: "main",
    modelType: "fine-tuned",
    isChatModel: false,
    useChatTemplate: false,
    precision: "",
    weightsType: "",
    baseModel: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: event.target.type === "checkbox" ? checked : value,
    }));
  };

  const {resolveLocalizedString} = useResolveLocalizedString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/models/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_id: formData.modelName,
          revision: formData.revision,
          model_type: formData.modelType,
          precision: formData.precision,
          weight_type: formData.weightsType,
          base_model: formData.baseModel,
          use_chat_template: formData.useChatTemplate,
          user_id: user.username,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to submit model");
      }

      setSubmittedData(formData);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success && submittedData) {
    return (
      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: 6,
          mb: 3,
          bgcolor: alpha(theme.palette.success.main, 0.05),
          borderColor: alpha(theme.palette.success.main, 0.2),
        })}
      >
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "success.800" }}
            >
              {resolveLocalizedString(INTERNATIONALISATION.SUBMITTED)}
            </Typography>
          </Stack>

          <Typography variant="body1">
            {resolveLocalizedString(INTERNATIONALISATION.SUBMITTED_MESSAGE.T1)} <strong>{submittedData.modelName}</strong> {resolveLocalizedString(INTERNATIONALISATION.SUBMITTED_MESSAGE.T2)}
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderColor: "divider",
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={2}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 120 }}
                >
                  {resolveLocalizedString(INTERNATIONALISATION.PARAMETERS.MODEL)}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {submittedData.modelName}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 120 }}
                >
                  Type:
                </Typography>
                <Typography variant="body2">
                  {submittedData.modelType}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 120 }}
                >
                  {resolveLocalizedString(INTERNATIONALISATION.PARAMETERS.REVISION)}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {submittedData.revision}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 120 }}
                >
                  {resolveLocalizedString(INTERNATIONALISATION.PARAMETERS.PRECISION)}
                </Typography>
                <Typography variant="body2">
                  {submittedData.precision}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 120 }}
                >
                  {resolveLocalizedString(INTERNATIONALISATION.PARAMETERS.WEIGHTS)}
                </Typography>
                <Typography variant="body2">
                  {submittedData.weightsType}
                </Typography>
              </Stack>
              {submittedData.baseModel && (
                <Stack direction="row" spacing={2}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ width: 120 }}
                  >
                    {resolveLocalizedString(INTERNATIONALISATION.PARAMETERS.BASE)}
                  </Typography>
                  <Typography variant="body2">
                    {submittedData.baseModel}
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" spacing={2}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 120 }}
                >
                  {resolveLocalizedString(INTERNATIONALISATION.PARAMETERS.TEMPLATE)}
                </Typography>
                <Typography variant="body2">
                  {submittedData.useChatTemplate ? "Yes" : "No"}
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* TODO: UNCOMMENT WHEN VOTES ARE BACK
          <Typography variant="body2" color="text.secondary">
            {resolveLocalizeString(INTERNATIONALISATION.PARAMETERS.UPVOTE)}
          </Typography> */}

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                setSuccess(false);
                setSubmittedData(null);
                setFormData({
                  modelName: "",
                  revision: "main",
                  modelType: "fine-tuned",
                  isChatModel: false,
                  useChatTemplate: false,
                  precision: "float16",
                  weightsType: "Original",
                  baseModel: "",
                });
              }}
            >
              {resolveLocalizedString(INTERNATIONALISATION.PARAMETERS.OTHER)}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <AuthContainer actionText="submit a model" />
      {isAuthenticated && (
        <Paper
          elevation={0}
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 0,
            border: "1px solid",
            borderColor: "grey.300",
            mb: 3,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.divider, 0.1)
                  : "grey.200",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.5)
                  : "grey.50",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {resolveLocalizedString(INTERNATIONALISATION.FORM.TITLE)}
            </Typography>
          </Box>

          {/* Form Content */}
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Model Information */}
              <Grid item xs={12}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">{resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_INFO.TITLE)}</Typography>
                  <InfoIconWithTooltip tooltip={HELP_TEXTS.modelName()} />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  fullWidth
                  name="modelName"
                  label={resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_INFO.NAME.LABEL)}
                  placeholder={resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_INFO.NAME.PLACEHOLDER)}
                  value={formData.modelName}
                  onChange={handleChange}
                  helperText="Example: meta-llama/Llama-3.2-1B"
                  InputProps={{
                    endAdornment: (
                      <InfoIconWithTooltip tooltip={HELP_TEXTS.modelName()} />
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="revision"
                  label={resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_INFO.REVISION.LABEL)}
                  value={formData.revision}
                  onChange={handleChange}
                  helperText={resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_INFO.REVISION.HELPER_TEXT)}
                  InputProps={{
                    endAdornment: (
                      <InfoIconWithTooltip tooltip={HELP_TEXTS.revision()} />
                    ),
                  }}
                />
              </Grid>

              {/* Model Configuration */}
              <Grid item xs={12}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">{resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_CONFIG.TITLE)}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_CONFIG.TYPE.LABEL)}</InputLabel>
                  <Select
                    name="modelType"
                    value={formData.modelType}
                    onChange={handleChange}
                    label={resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_CONFIG.TYPE.LABEL)}
                    endAdornment={
                      <InfoIconWithTooltip
                        tooltip={HELP_TEXTS.modelType()}
                        sx={{ mr: 2 }}
                      />
                    }
                  >
                    {modelTypeOptions.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ height: "100%" }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        name="useChatTemplate"
                        checked={formData.useChatTemplate}
                        onChange={handleChange}
                      />
                    }
                    label={resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_CONFIG.TEMPLATE.LABEL)}
                  />
                  <InfoIconWithTooltip tooltip={HELP_TEXTS.chatTemplate()} />
                </Stack>
              </Grid> */}

              {/* <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_CONFIG.PRECISION.LABEL)}</InputLabel>
                  <Select
                    name="precision"
                    value={formData.precision}
                    onChange={handleChange}
                    label={resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_CONFIG.PRECISION.LABEL)}
                    endAdornment={
                      <InfoIconWithTooltip
                        tooltip={HELP_TEXTS.precision()}
                        sx={{ mr: 2 }}
                      />
                    }
                  >
                    {SUBMISSION_PRECISIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}

              {/* <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_CONFIG.WEIGHTS.LABEL)}</InputLabel>
                  <Select
                    name="weightsType"
                    value={formData.weightsType}
                    onChange={handleChange}
                    label={resolveLocalizedString(INTERNATIONALISATION.FORM.MODEL_CONFIG.WEIGHTS.LABEL)}
                    endAdornment={
                      <InfoIconWithTooltip
                        tooltip={HELP_TEXTS.weightsType()}
                        sx={{ mr: 2 }}
                      />
                    }
                  >
                    {WEIGHT_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {formData.weightsType !== "Original" && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required={
                      formData.weightsType === "Delta" ||
                      formData.weightsType === "Adapter"
                    }
                    name="baseModel"
                    label="Base Model"
                    value={formData.baseModel}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InfoIconWithTooltip tooltip={HELP_TEXTS.baseModel()} />
                      ),
                    }}
                  />
                </Grid>
              )} */}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {resolveLocalizedString(INTERNATIONALISATION.FORM.REQUIRED)}
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    endIcon={submitting ? null : <RocketLaunchIcon />}
                    sx={{
                      minWidth: 120,
                      position: "relative",
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      resolveLocalizedString(INTERNATIONALISATION.FORM.BUTTON)
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
    </>
  );
}

export default ModelSubmissionForm;
