import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import PageHeader from "../../components/shared/PageHeader";
import EvaluationQueues from "./components/EvaluationQueues/EvaluationQueues";
import ModelSubmissionForm from "./components/ModelSubmissionForm/ModelSubmissionForm";
import SubmissionGuide from "./components/SubmissionGuide/SubmissionGuide";
import { useTranslation, declareComponentKeys } from "i18n";

function AddModelPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const {t} = useTranslation({AddModelPage});

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: 4 }}>
      <PageHeader
        title={t("title")}
        subtitle={
          <>
            {t("subtitle")}
          </>
        }
      />

      <SubmissionGuide />

      <ModelSubmissionForm user={user} isAuthenticated={isAuthenticated} />

      <EvaluationQueues defaultExpanded={false} />
    </Box>
  );
}

const { i18n } = declareComponentKeys<
| "title"
| "subtitle"
>()({ AddModelPage });
export type I18n = typeof i18n;

export default AddModelPage;
