import React from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";
import HFLogo from "../Logo/HFLogo";
import { useAuth } from "../../hooks/useAuth";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useTranslation, declareComponentKeys } from "i18n";

function AuthContainer({ actionText = "DO_ACTION" }) {
  const { isAuthenticated, user, login, logout, loading } = useAuth();
  const navigate = useNavigate();
  const {t} = useTranslation({AuthContainer});

  const handleLogout = () => {
    if (isAuthenticated && logout) {
      logout();
      navigate("/", { replace: true });
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          border: "1px solid",
          borderColor: "grey.300",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={24} />
      </Paper>
    );
  }

  if (!isAuthenticated) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          border: "1px solid",
          borderColor: "grey.300",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h6" align="center">
          {t("login")}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {t("need")}
        </Typography>
        <Button
          variant="contained"
          onClick={login}
          startIcon={
            <Box
              sx={{
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
              }}
            >
              <HFLogo />
            </Box>
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            py: 1,
            px: 2,
          }}
        >
          {t("button")}
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, border: "1px solid", borderColor: "grey.300", mb: 4 }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body1">
            {t("loggedin", {user: (user !== null ? user!['username'] : "inconnu")})}
            Connected as <strong>{user!['username']}</strong>
          </Typography>
          <Chip
            label={`Ready to ${actionText}`}
            color="success"
            size="small"
            variant="outlined"
          />
        </Stack>
        <Button
          variant="contained"
          onClick={handleLogout}
          endIcon={<LogoutIcon />}
          color="primary"
          sx={{
            minWidth: 120,
            height: 36,
            textTransform: "none",
            fontSize: "0.9375rem",
          }}
        >
          {t("logout")}
        </Button>
      </Stack>
    </Paper>
  );
}

const { i18n } = declareComponentKeys<
| "login"
| "need"
| "logout"
| "button"
| { K: "loggedin"; P: { user: string; }; R: JSX.Element }
>()({ AuthContainer });
export type I18n = typeof i18n;

export default AuthContainer;
