import { useEffect } from "react";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import { Box } from "@mui/material";
import PageHeader from "../../components/shared/PageHeader";
import { useLeaderboardData } from "./components/Leaderboard/hooks/useLeaderboardData";
import { useLeaderboard } from "./components/Leaderboard/context/LeaderboardContext";
import { declareComponentKeys } from "i18nifty";

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
      {/* <Box
        sx={{ display: "flex", justifyContent: "center", pt: 6, mb: -4, pb: 0 }}
      >
        <Logo height="80px" />
      </Box> */}
      <PageHeader
        title="Leaderboard"
        subtitle={""}
        // subtitle={
        //   <>
        //     Comparer les grands modèles de langages {" "}
        //     <span style={{ fontWeight: 600 }}>ouverts</span> sur des problèmes{" "}
        //     <span style={{ fontWeight: 600 }}>francophones</span>
        //   </>
        // }
      />
      <Leaderboard />
    </Box>
  );
}

const { i18n } = declareComponentKeys<
| { K: "greating"; P: { who: string; } }
| "how are you"
| { K: "learn more"; P: { href: string; }; R: JSX.Element }
>()({ LeaderboardPage });
export type I18n = typeof i18n;

export default LeaderboardPage;
