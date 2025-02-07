import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Stack, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useResolveLocalizedString } from "i18n";

const DocLink = ({ href, children }) => (
  <Button
    variant="text"
    size="small"
    href={href}
    target="_blank"
    sx={{
      fontFamily: "monospace",
      textTransform: "none",
      color: "primary.main",
      fontSize: "0.875rem",
      p: 0,
      width: "fit-content",
      minWidth: "auto",
      justifyContent: "flex-start",
      "&:hover": {
        color: "primary.dark",
        backgroundColor: "transparent",
        textDecoration: "underline",
      },
    }}
  >
    {children} →
  </Button>
);

const StepNumber = ({ number }) => (
  <Box
    sx={{
      width: 32,
      height: 32,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid",
      borderColor: "primary.main",
      color: "primary.main",
      fontSize: "0.875rem",
      fontWeight: 600,
      flexShrink: 0,
      bgcolor: "transparent",
    }}
  >
    {number}
  </Box>
);

const TITLE = {
    "en": "Submission guide",
    "fr": "Guide de soumission"
}
const LOCALIZED_STEPS = {
    STEP1: {
        TITLE: {
            "en": "Model Information",
            "fr": "Informations sur le modèle"
        },
        T1: {
            "en": "Your model should be",
            "fr": "Votre modèle doit être"
        },
        T2: {
            "en": "on the Hub and follow the",
            "fr": "sur le Hub et suivre le format"
        },
        T3: {
            "en": "format (e.g. mistralai/Mistral-7B-v0.1). Specify the",
            "fr": "(e.g. mistralai/Mistral-7B-v0.1). Spécifiez la"
        },
        STRONG1: {
            "en": "revision",
            "fr": "révision"
        },
        T4: {
            "en": "(commit hash or branch) and",
            "fr": "(hash de commit ou branche) et le"
        },
        STRONG2: {
            "en": "model type",
            "fr": "type de modèle"
        },
        DOCLINK: {
            "en": "Model uploading guide",
            "fr": "Guide pour le téléversement du modèle"
        }
    },
    STEP2: {
        TITLE: {
            "en": "Technical Details",
            "fr": "Details Techniques"
        },
        T1: {
            "en": "Make sure tour model can be",
            "fr": "Assurez-vous que votre modèle puisse être"
        },
        STRONG1: {
            "en": "loaded locally",
            "fr": "chargé localement"
        },
        T2: {
            "en": "before submitting:",
            "fr": "avant de soumettre"
        },
        DOCLINK: {
            "en": "Transformers documentation",
            "fr": "Documentation Transformers"
        }
    },
    STEP3: {
        TITLE: {
            "en": "License Requirements",
            "fr": "Critères de Licence"
        },
        T1: {
            "en": "A ",
            "fr": "Une "
        },
        STRONG1: {
            "en": "license tag",
            "fr": "balise de licence"
        },
        T2: {
            "en": "is required.",
            "fr": "est requise."
        },
        STRONG2: {
            "en": "Open licenses",
            "fr": "Les licences ouvertes"
        },
        T3: {
            "en": "(Apache, MIT, etc) are strongly recommended.",
            "fr": "(Apache, MIT, etc) sont fortement recommandées."
        },
        DOCLINK: {
            "en": "About model licenses",
            "fr": "A propos des licences de modèles"
        }
    },
    STEP4: {
        TITLE: {
            "en": "Model Card Requirements",
            "fr": "Critères sur la carte du modèle"
        },
        T1: {
            "en": "Your model card must include: ",
            "fr": "La carte de votre modèle doit inclure: "
        },
        STRONG1: {
            "en": "training details",
            "fr": "détails d'entrainement"
        },
        STRONG2: {
            "en": "dataset information",
            "fr": "information sur le jeux de donnees"
        },
        T2: {
            "en": "intended use, limitations, and",
            "fr": "usage prévu, limites, et"
        },
        STRONG3: {
            "en": "performance metrics",
            "fr": "métriques de performance"
        },
        DOCLINK: {
            "en": "Model cards guide",
            "fr": "Guide sur les cartes de modèles"
        }
    },
    STEP5: {
        TITLE: {
            "en": "Final Checklist",
            "fr": "Checklist finale"
        },
        T1: {
            "en": "Ensure your model is ",
            "fr": "Vérifiez que votre modèle est "
        },
        T2: {
            "en": "uses ",
            "fr": "utilise le format "
        },
        T3: {
            "en": "format, has a ",
            "fr": "a une"
        },
        STRONG1: {
            "en": "license tag",
            "fr": "balise de licence"
        },
        T4: {
            "en": "and ",
            "fr": "et "
        },
        STRONG2: {
            "en": "loads correctly",
            "fr": "chargé correctement"
        },
        T5: {
            "en": "with the provided code",
            "fr": "avec le code fourni"
        },
        DOCLINK: {
            "en": "Sharing best practices",
            "fr": "Bonnes pratiques de partage"
        }
    }
}

function SubmissionGuide() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize state directly with URL value
  const initialExpanded = !new URLSearchParams(location.search).get("guide");
  const [expanded, setExpanded] = useState(initialExpanded);
  const {resolveLocalizedString} = useResolveLocalizedString();

  // Sync expanded state with URL changes after initial render
  useEffect(() => {
    const guideOpen = !new URLSearchParams(location.search).get("guide");
    if (guideOpen !== expanded) {
      setExpanded(guideOpen);
    }
  }, [location.search, expanded]);

  const handleAccordionChange = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    const params = new URLSearchParams(location.search);
    if (newExpanded) {
      params.delete("guide");
    } else {
      params.set("guide", "closed");
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const TUTORIAL_STEPS = [
    {
      title: resolveLocalizedString(LOCALIZED_STEPS.STEP1.TITLE),
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {resolveLocalizedString(LOCALIZED_STEPS.STEP1.T1)} <strong>public</strong> {resolveLocalizedString(LOCALIZED_STEPS.STEP1.T2)} {" "}
            <strong>username/model-id</strong> {resolveLocalizedString(LOCALIZED_STEPS.STEP1.T3)} <strong>{resolveLocalizedString(LOCALIZED_STEPS.STEP1.STRONG1)}</strong>{" "}
            {resolveLocalizedString(LOCALIZED_STEPS.STEP1.T4)} <strong>{resolveLocalizedString(LOCALIZED_STEPS.STEP1.STRONG2)}</strong>.
          </Typography>
          <DocLink href="https://huggingface.co/docs/hub/models-uploading">
            {resolveLocalizedString(LOCALIZED_STEPS.STEP1.DOCLINK)}
          </DocLink>
        </Stack>
      ),
    },
    {
      title: "Technical Details",
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {resolveLocalizedString(LOCALIZED_STEPS.STEP2.T1)} <strong>{resolveLocalizedString(LOCALIZED_STEPS.STEP2.STRONG1)}</strong> {resolveLocalizedString(LOCALIZED_STEPS.STEP2.T2)}
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "grey.50" : "grey.900",
              borderRadius: 1,
              "& pre": {
                m: 0,
                p: 0,
                fontFamily: "monospace",
                fontSize: "0.875rem",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
              },
            }}
          >
            <pre>
              {`from transformers import AutoConfig, AutoModel, AutoTokenizer
  
  config = AutoConfig.from_pretrained("your-username/your-model", revision="main")
  model = AutoModel.from_pretrained("your-username/your-model", revision="main")
  tokenizer = AutoTokenizer.from_pretrained("your-username/your-model", revision="main")`}
            </pre>
          </Box>
          <DocLink href="https://huggingface.co/docs/transformers/installation">
            {resolveLocalizedString(LOCALIZED_STEPS.STEP2.DOCLINK)}
          </DocLink>
        </Stack>
      ),
    },
    {
      title: resolveLocalizedString(LOCALIZED_STEPS.STEP3.TITLE),
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {resolveLocalizedString(LOCALIZED_STEPS.STEP3.T1)}<strong>{resolveLocalizedString(LOCALIZED_STEPS.STEP3.STRONG1)}</strong> {resolveLocalizedString(LOCALIZED_STEPS.STEP3.T2)}{" "}
            <strong>{resolveLocalizedString(LOCALIZED_STEPS.STEP3.STRONG2)}</strong> {resolveLocalizedString(LOCALIZED_STEPS.STEP3.T3)}
          </Typography>
          <DocLink href="https://huggingface.co/docs/hub/repositories-licenses">
            {resolveLocalizedString(LOCALIZED_STEPS.STEP3.DOCLINK)}
          </DocLink>
        </Stack>
      ),
    },
    {
      title: resolveLocalizedString(LOCALIZED_STEPS.STEP4.TITLE),
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {resolveLocalizedString(LOCALIZED_STEPS.STEP4.T1)}<strong>architecture</strong>,{" "}
            <strong>{resolveLocalizedString(LOCALIZED_STEPS.STEP4.STRONG1)}</strong>,{" "}
            <strong>{resolveLocalizedString(LOCALIZED_STEPS.STEP4.STRONG2)}</strong>, {resolveLocalizedString(LOCALIZED_STEPS.STEP4.T2)}{" "}
            <strong>{resolveLocalizedString(LOCALIZED_STEPS.STEP4.STRONG3)}</strong>.
          </Typography>
          <DocLink href="https://huggingface.co/docs/hub/model-cards">
            {resolveLocalizedString(LOCALIZED_STEPS.STEP4.DOCLINK)}
          </DocLink>
        </Stack>
      ),
    },
    {
      title: resolveLocalizedString(LOCALIZED_STEPS.STEP5.TITLE),
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {resolveLocalizedString(LOCALIZED_STEPS.STEP5.T1)}<strong>public</strong>, {resolveLocalizedString(LOCALIZED_STEPS.STEP5.T2)}{" "}
            <strong>safetensors</strong> {resolveLocalizedString(LOCALIZED_STEPS.STEP5.T3)}{" "}
            <strong>{resolveLocalizedString(LOCALIZED_STEPS.STEP5.STRONG1)}</strong>, {resolveLocalizedString(LOCALIZED_STEPS.STEP5.T4)} <strong>{resolveLocalizedString(LOCALIZED_STEPS.STEP5.STRONG2)}</strong>{" "}
            {resolveLocalizedString(LOCALIZED_STEPS.STEP5.T5)}.
          </Typography>
          <DocLink href="https://huggingface.co/docs/hub/repositories-getting-started">
            {resolveLocalizedString(LOCALIZED_STEPS.STEP5.DOCLINK)}
          </DocLink>
        </Stack>
      ),
    },
  ];


  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        borderRadius: "8px !important",
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "grey.800" : "grey.200",
        overflow: "hidden",
      }}
    >
      <Box
        onClick={handleAccordionChange}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.900" : "grey.50",
          borderBottom: "1px solid",
          borderColor: (theme) =>
            expanded
              ? theme.palette.mode === "dark"
                ? "grey.800"
                : "grey.200"
              : "transparent",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          {resolveLocalizedString(TITLE)}
        </Typography>
        <ExpandMoreIcon
          sx={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }}
        />
      </Box>
      <Collapse in={expanded} appear={false}>
        <Box sx={{ py: 4 }}>
          <Stack spacing={4}>
            {TUTORIAL_STEPS.map((step, index) => (
              <Box key={step.title}>
                <Stack spacing={3}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ px: 4 }}
                  >
                    <StepNumber number={index + 1} />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {step.title}
                    </Typography>
                  </Stack>
                  <Box sx={{ px: 4, pl: 7 }}>{step.content}</Box>
                </Stack>
                {index < TUTORIAL_STEPS.length - 1 && (
                  <Box
                    sx={{
                      mt: 4,
                      borderTop: "1px solid",
                      borderColor: (theme) =>
                        theme.palette.mode === "dark" ? "grey.800" : "grey.100",
                    }}
                  />
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
}

export default SubmissionGuide;
