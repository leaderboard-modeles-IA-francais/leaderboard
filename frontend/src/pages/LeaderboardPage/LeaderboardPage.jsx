import { useEffect } from "react";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import { Box } from "@mui/material";
import PageHeader from "../../components/shared/PageHeader";
import Logo from "../../components/Logo/Logo";
import { useLeaderboardData } from "./components/Leaderboard/hooks/useLeaderboardData";
import { useLeaderboard } from "./components/Leaderboard/context/LeaderboardContext";

function LeaderboardPage() {
  const { data, isLoading, error } = useLeaderboardData();
  const { actions } = useLeaderboard();

  useEffect(() => {
    if (data) {
      actions.setModels(data);
    }
    actions.setLoading(isLoading);
    actions.setError(error);
  }, [data, isLoading, error, actions]);

  return (
    <Box
      sx={{
        width: "100%",
        ph: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "center", pt: 6, mb: -4, pb: 0 }}
      >
        <Logo height="80px" />
      </Box>
      <PageHeader
        title="Open LLM Leaderboard"
        subtitle={
          <>
            Comparing Large Language Models in an{" "}
            <span style={{ fontWeight: 600 }}>open</span> and{" "}
            <span style={{ fontWeight: 600 }}>reproducible</span> way
          </>
        }
      />
      <Leaderboard />
    </Box>
  );
}

export default LeaderboardPage;
