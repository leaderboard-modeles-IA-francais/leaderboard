import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Link,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Tooltip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useVirtualizer } from "@tanstack/react-virtual";
import { resolveLocalizedString, useResolveLocalizedString } from "i18n";

// Function to format wait time
const formatWaitTime = (waitTimeStr) => {
  const seconds = parseFloat(waitTimeStr.replace("s", ""));

  if (seconds < 60) {
    return {
        "en": "just now",
        "fr": "a l'instant"
    };
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return {
        "en": `${minutes}m ago`,
        "fr": `il y a ${minutes}m`
    };
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return {
        "en": `${hours}h ago`,
        "fr": `il y a ${hours}h`
    };
  }

  const days = Math.floor(hours / 24);
  return {
    "en": `${days}d ago`,
    "fr": `il y a${days}j`
  };
};

// Column definitions with their properties
const columns = [
  {
    id: "model",
    label: {
        "en": "Model",
        "fr": "Modèle"
    },
    width: "35%",
    align: "left",
  },
  {
    id: "submitter",
    label: {
        "en": "Submitted by",
        "fr": "Soumis par",
    },
    width: "15%",
    align: "left",
  },
  {
    id: "wait_time",
    label: {
        "en": "Submitted",
        "fr": "Soumis"
    },
    width: "12%",
    align: "center",
  },
  {
    id: "precision",
    label: {
        "en": "Precision",
        "fr": "Precision"
    },
    width: "13%",
    align: "center",
  },
  {
    id: "revision",
    label: {
        "en":"Revision",
        "fr": "Revision"
    },
    width: "12%",
    align: "center",
  },
  {
    id: "status",
    label: {
        "en": "Status",
        "fr": "Statut"
    },
    width: "13%",
    align: "center",
  },
];

const COMPLETED = {
    STATUS: {
        "en": "Evaluated",
        "fr": "Termine"
    },
    CHIP: {
        "en": "Completed",
        "fr": "Terminé"
    },
    EMPTY_MESSAGE: {
        "en": "No models evaluated",
        "fr": "Aucun modèle n'a ete evalue"
    },
    TITLE: {
        "en": "Recently evaluated models",
        "fr": "Modèles évalues récemment"
    }
}

const EVALUATING = {
    STATUS: {
        "en": "Evaluating",
        "fr": "En cours d'évaluation"
    },
    CHIP: {
        "en": "Evaluating",
        "fr": "En cours d'évaluation"
    },
    EMPTY_MESSAGE: {
        "en": "No models being evaluated",
        "fr": "Aucun modèle en cours d'évaluation"
    },
    TITLE: {
        "en": "Models being evaluated",
        "fr": "Modèles en cours d'évaluation"
    }
}

const PENDING = {
    STATUS: {
        "en": "In Queue",
        "fr": "En attente"
    },
    CHIP: {
        "en": "Pending",
        "fr": "En attente"
    },
    EMPTY_MESSAGE: {
        "en": "No models in queue",
        "fr": "Aucun modèle en attente"
    },
    TITLE: {
        "en": "Models in queue",
        "fr": "Modèles en attente"
    }

}

const StatusChip = ({ status }) => {
    const {resolveLocalizedString} = useResolveLocalizedString();
    const statusConfig = {
        finished: {
            icon: <CheckCircleIcon />,
            label: resolveLocalizedString(COMPLETED.CHIP),
            color: "success",
        },
        evaluating: {
            icon: <AutorenewIcon />,
            label: resolveLocalizedString(EVALUATING.CHIP),
            color: "warning",
        },
        pending: { 
            icon: <PendingIcon />, 
            label: resolveLocalizedString(PENDING.CHIP),
            color: "info" 
        },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
    />
  );
};

const ModelTable = ({ models, emptyMessage, status }) => {
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: models.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 53,
    overscan: 5,
  });

  if (models.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <TableContainer
      ref={parentRef}
      sx={{
        maxHeight: 400,
        "&::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "action.hover",
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "action.selected",
          borderRadius: 4,
          "&:hover": {
            backgroundColor: "action.focus",
          },
        },
      }}
    >
      <Table size="small" stickyHeader sx={{ tableLayout: "fixed" }}>
        <colgroup>
          {columns.map((column) => (
            <col key={column.id} style={{ width: column.width }} />
          ))}
        </colgroup>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={column.id}
                align={column.align}
                sx={{
                  backgroundColor: "background.paper",
                  fontWeight: 600,
                  borderBottom: "2px solid",
                  borderColor: "divider",
                  borderRight:
                    index < columns.length - 1 ? "1px solid" : "none",
                  borderRightColor: "divider",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  padding: "12px 16px",
                }}
              >
                {resolveLocalizedString(column.label)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                padding: 0,
              }}
              colSpan={columns.length}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: `${rowVirtualizer.getTotalSize()}px`,
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const model = models[virtualRow.index];
                  const waitTime = formatWaitTime(model.wait_time);

                  return (
                    <TableRow
                      key={virtualRow.index}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                        backgroundColor: "background.paper",
                        display: "flex",
                      }}
                      hover
                    >
                      <TableCell
                        component="div"
                        sx={{
                          flex: `0 0 ${columns[0].width}`,
                          padding: "12px 16px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          borderRight: "1px solid",
                          borderRightColor: "divider",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                          {model.name}
                      </TableCell>
                      <TableCell
                        component="div"
                        sx={{
                          flex: `0 0 ${columns[1].width}`,
                          padding: "12px 16px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          borderRight: "1px solid",
                          borderRightColor: "divider",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {model.submitter}
                      </TableCell>
                      <TableCell
                        component="div"
                        align={columns[2].align}
                        sx={{
                          flex: `0 0 ${columns[2].width}`,
                          padding: "12px 16px",
                          borderRight: "1px solid",
                          borderRightColor: "divider",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Tooltip title={model.wait_time} arrow placement="top">
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.5,
                            }}
                          >
                            <AccessTimeIcon sx={{ fontSize: "0.9rem" }} />
                            {resolveLocalizedString(waitTime)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        component="div"
                        align={columns[3].align}
                        sx={{
                          flex: `0 0 ${columns[3].width}`,
                          padding: "12px 16px",
                          borderRight: "1px solid",
                          borderRightColor: "divider",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {model.precision}
                        </Typography>
                      </TableCell>
                      <TableCell
                        component="div"
                        align={columns[4].align}
                        sx={{
                          flex: `0 0 ${columns[4].width}`,
                          padding: "12px 16px",
                          fontFamily: "monospace",
                          borderRight: "1px solid",
                          borderRightColor: "divider",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {model.revision.substring(0, 7)}
                      </TableCell>
                      <TableCell
                        component="div"
                        align={columns[5].align}
                        sx={{
                          flex: `0 0 ${columns[5].width}`,
                          padding: "12px 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <StatusChip status={status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const QUEUE_STATUS = {
    EVALUATED: {
        "en": "Evaluated",
        "fr": "Evalues"
    },
    EVALUATING: {
        "en": "Evaluating",
        "fr": "En cours d'evaluation"
    },
    PENDING: {
        "en": "In Queue",
        "fr": "En Attente"
    },
}

const QueueAccordion = ({
  title,
  models,
  status,
  emptyMessage,
  expanded,
  onChange,
  loading,
}) => (
  <Accordion
    expanded={expanded}
    onChange={onChange}
    disabled={loading}
    sx={{
      "&:before": { display: "none" },
      boxShadow: "none",
      border: "none",
    }}
  >
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>{title}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={models.length}
            size="small"
            color={
              status === "finished"
                ? "success"
                : status === "evaluating"
                ? "warning"
                : "info"
            }
            variant="outlined"
            sx={(theme) => ({
              borderWidth: 2,
              fontWeight: 600,
              bgcolor:
                status === "finished"
                  ? theme.palette.success[100]
                  : status === "evaluating"
                  ? theme.palette.warning[100]
                  : theme.palette.info[100],
              borderColor:
                status === "finished"
                  ? theme.palette.success[400]
                  : status === "evaluating"
                  ? theme.palette.warning[400]
                  : theme.palette.info[400],
              color:
                status === "finished"
                  ? theme.palette.success[700]
                  : status === "evaluating"
                  ? theme.palette.warning[700]
                  : theme.palette.info[700],
              "& .MuiChip-label": {
                px: 1.2,
              },
              "&:hover": {
                bgcolor:
                  status === "finished"
                    ? theme.palette.success[200]
                    : status === "evaluating"
                    ? theme.palette.warning[200]
                    : theme.palette.info[200],
              },
            })}
          />
          {loading && (
            <CircularProgress size={16} color="inherit" sx={{ opacity: 0.5 }} />
          )}
        </Stack>
      </Stack>
    </AccordionSummary>
    <AccordionDetails sx={{ p: 2 }}>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "grey.200",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <ModelTable
          models={models}
          emptyMessage={emptyMessage}
          status={status}
        />
      </Box>
    </AccordionDetails>
  </Accordion>
);

const EvaluationQueues = ({ defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [expandedQueues, setExpandedQueues] = useState(new Set());
  const [models, setModels] = useState({
    pending: [],
    evaluating: [],
    finished: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {resolveLocalizedString} = useResolveLocalizedString();

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/models/status");
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        const data = await response.json();

        // Sort models by submission date (most recent first)
        const sortByDate = (models) => {
          return [...models].sort((a, b) => {
            const dateA = new Date(a.submission_time);
            const dateB = new Date(b.submission_time);
            return dateB - dateA;
          });
        };

        setModels({
          finished: sortByDate(data.finished),
          evaluating: sortByDate(data.evaluating),
          pending: sortByDate(data.pending),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
    const interval = setInterval(fetchModels, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMainAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleQueueAccordionChange = (queueName) => (event, isExpanded) => {
    setExpandedQueues((prev) => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(queueName);
      } else {
        newSet.delete(queueName);
      }
      return newSet;
    });
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Accordion
      expanded={expanded === "main"}
      onChange={handleMainAccordionChange("main")}
      disabled={loading}
      elevation={0}
      sx={{
        mb: 3,
        boxShadow: "none",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px !important",
        "&:before": {
          display: "none",
        },
        "&.Mui-disabled": {
          backgroundColor: "rgba(0, 0, 0, 0.03)",
          opacity: 0.9,
        },
        "& .MuiAccordionSummary-root": {
          minHeight: 64,
          bgcolor: "background.paper",
          borderRadius: "8px",
          "&.Mui-expanded": {
            minHeight: 64,
            borderRadius: "8px 8px 0 0",
          },
        },
        "& .MuiAccordionSummary-content": {
          m: 0,
          "&.Mui-expanded": {
            m: 0,
          },
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          px: 3,
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: "text.secondary",
            transform: "rotate(0deg)",
            transition: "transform 150ms",
            "&.Mui-expanded": {
              transform: "rotate(180deg)",
            },
          },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            Evaluation Status
          </Typography>
          {!loading && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                transition: "opacity 0.2s",
                ".Mui-expanded &": {
                  opacity: 0,
                },
              }}
            >
              <Chip
                label={`${models.pending.length} ${resolveLocalizedString(PENDING.STATUS)}`}
                size="small"
                color="info"
                variant="outlined"
                sx={{
                  borderWidth: 2,
                  fontWeight: 600,
                  bgcolor: "info.100",
                  borderColor: "info.400",
                  color: "info.700",
                  "& .MuiChip-label": {
                    px: 1.2,
                  },
                  "&:hover": {
                    bgcolor: "info.200",
                  },
                }}
              />
              <Chip
                label={`${models.evaluating.length} ${resolveLocalizedString(EVALUATING.STATUS)}`}
                size="small"
                color="warning"
                variant="outlined"
                sx={{
                  borderWidth: 2,
                  fontWeight: 600,
                  bgcolor: "warning.100",
                  borderColor: "warning.400",
                  color: "warning.700",
                  "& .MuiChip-label": {
                    px: 1.2,
                  },
                  "&:hover": {
                    bgcolor: "warning.200",
                  },
                }}
              />
              <Chip
                label={`${models.finished.length} ${resolveLocalizedString(COMPLETED.STATUS)}`}
                size="small"
                color="success"
                variant="outlined"
                sx={{
                  borderWidth: 2,
                  fontWeight: 600,
                  bgcolor: "success.100",
                  borderColor: "success.400",
                  color: "success.700",
                  "& .MuiChip-label": {
                    px: 1.2,
                  },
                  "&:hover": {
                    bgcolor: "success.200",
                  },
                }}
              />
            </Stack>
          )}
          {loading && (
            <CircularProgress
              size={20}
              sx={{
                color: "primary.main",
              }}
            />
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
              width: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <QueueAccordion
              title={resolveLocalizedString(PENDING.TITLE)}
              models={models.pending}
              status="pending"
              emptyMessage={resolveLocalizedString(PENDING.EMPTY_MESSAGE)}
              expanded={expandedQueues.has("pending")}
              onChange={handleQueueAccordionChange("pending")}
              loading={loading}
            />

            <QueueAccordion
              title={resolveLocalizedString(EVALUATING.TITLE)}
              models={models.evaluating}
              status="evaluating"
              emptyMessage={resolveLocalizedString(EVALUATING.EMPTY_MESSAGE)}
              expanded={expandedQueues.has("evaluating")}
              onChange={handleQueueAccordionChange("evaluating")}
              loading={loading}
            />

            <QueueAccordion
              title={resolveLocalizedString(COMPLETED.TITLE)}
              models={models.finished}
              status="finished"
              emptyMessage={resolveLocalizedString(COMPLETED.EMPTY_MESSAGE)}
              expanded={expandedQueues.has("finished")}
              onChange={handleQueueAccordionChange("finished")}
              loading={loading}
            />
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default EvaluationQueues;
