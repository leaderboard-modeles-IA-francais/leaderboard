import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { resolveLocalizedString, useResolveLocalizedString } from "i18n";
import { Box, CssBaseline } from "@mui/material";
import Navigation from "./components/Navigation/Navigation";
import LeaderboardPage from "./pages/LeaderboardPage/LeaderboardPage";
import AddModelPage from "./pages/AddModelPage/AddModelPage";
import QuotePage from "./pages/QuotePage/QuotePage";
import VoteModelPage from "./pages/VoteModelPage/VoteModelPage";
import Header from "./components/Header/Header";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import Footer from "./components/Footer/Footer";
import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageSelect } from "./components/LanguageSelect/LanguageSelect";
import LeaderboardProvider from "./pages/LeaderboardPage/components/Leaderboard/context/LeaderboardContext";
import AboutPage from "pages/AboutPage/AboutPage";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function UrlHandler() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Synchroniser l'URL avec la page parente HF
  useEffect(() => {
    // Vérifier si nous sommes dans un iframe HF Space
    const isHFSpace = window.location !== window.parent.location;
    if (!isHFSpace) return;

    // Sync query and hash from this embedded app to the parent page URL
    const queryString = window.location.search;
    const hash = window.location.hash;

    // HF Spaces' special message type to update the query string and the hash in the parent page URL
    window.parent.postMessage(
      {
        queryString,
        hash,
      },
      "https://huggingface.co"
    );
  }, [location, searchParams]);

  // Read the updated hash reactively
  useEffect(() => {
    const handleHashChange = (event) => {
      console.log("hash change event", event);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return null;
}

function App() {

  const disclaimer = {
    "fr": "Ce leaderboard compare les modèles de langage adaptés à la langue française, sur des jeux de données en français, adaptés aux spécificités culturelles de la francophonie. C'est d'abord un projet de recherche collaboratif, et nous espérons recevoir de nombreuses contributions pour l'améliorer au fil du temps ! Le leaderboard n'est que dans sa toute première version, et sera amené à évoluer régulièrement, avec de nouveaux jeux de données, de nouvelles métriques, et, nous l'espérons, beaucoup de nouveaux modèles ouverts soumis par la communauté ! Dans sa version initiale, nous avons couvert un panel de modèles ouverts, entraînés sur du français, de différentes tailles et origines. Note : les données d'évaluation ont été pour l'instant gardées confidentielles, pour préserver l'intégrité et la validité des résultats, et éviter les manipulations du classement.",
    "en": "This leaderboard compares language models adapted to the French language, on French datasets, adapted to the cultural specificities of the French-speaking world. It is primarily a collaborative research project, and we hope to receive many contributions to improve it over time! The leaderboard is only in its very first version, and will evolve regularly, with new datasets, new metrics, and, we hope, many new open models submitted by the community! In its initial version, we covered a panel of open models, trained on French, of various sizes and origins. Note: The evaluation data has been kept confidential for the time being, to preserve the integrity and validity of the results, and avoid manipulation of the ranking."
  }

  return (
    <div
      className="App"
      style={{
        height: "100%",
        width: "100%",
        WebkitOverflowScrolling: "touch",
        overflow: "auto",
      }}
    >
      <QueryClientProvider client={queryClient}>
        <MuiDsfrThemeProvider>
          <CssBaseline />
          <Router>
            <LeaderboardProvider>
              <UrlHandler />
              <Box
                sx={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "background.default",
                  color: "text.primary",
                }}
              >
                <Header />
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    px: 4,
                    pb: 4,
                  }}
                >
                  <Routes>
                    <Route path="/" element={<LeaderboardPage />} />
                    <Route path="/add" element={<AddModelPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    {/* <Route path="/quote" element={<QuotePage />} />
                    <Route path="/vote" element={<VoteModelPage />} /> */}
                  </Routes>
                </Box>
                <Footer disclaimer={disclaimer}/>
              </Box>
            </LeaderboardProvider>
          </Router>
        </MuiDsfrThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
