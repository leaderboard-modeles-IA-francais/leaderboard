import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
// import Navigation from "./components/Navigation/Navigation";
import Navigation from "./components/Navigation/Navigation";
import LeaderboardPage from "./pages/LeaderboardPage/LeaderboardPage";
import AddModelPage from "./pages/AddModelPage/AddModelPage";
import QuotePage from "./pages/QuotePage/QuotePage";
import VoteModelPage from "./pages/VoteModelPage/VoteModelPage";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LeaderboardProvider from "./pages/LeaderboardPage/components/Leaderboard/context/LeaderboardContext";
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
                <Header
                  brandTop={<>République <br/> française</>}
                  homeLinkProps={{
                    href: '/',
                    title: 'Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)'
                  }}
                  quickAccessItems={[
                    // other quick access items...
                    headerFooterDisplayItem
                  ]}
                  id="fr-header-simple-header-with-service-title-and-tagline"
                  serviceTagline="Pour une classification des grands modèles de langages sur des problèmes francophones"
                  serviceTitle="classeur:IA"
                  navigation={<Navigation />}
                />
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
                    <Route path="/quote" element={<QuotePage />} />
                    <Route path="/vote" element={<VoteModelPage />} />
                  </Routes>
                </Box>
                <Footer
                  accessibility="fully compliant"
                  contentDescription="
                    L'évaluation des systèmes d'IA est un enjeu stratégique sur lequel la France s'est historiquement démarquée.

                    Ce classement, ou leaderboard, s'inspire directement de l'Open LLM Leaderboard et permet de comparer différents modèles d'IA génératifs à l'aide de jeux de données spécifiquement adaptés aux environnements et à la culture francophones.
                    "
                  partnersLogos={{
                    sub: [
                      {
                        alt: 'Logo Inria',
                        href: '#',
                        imgUrl: '/inr_logo_rouge.png'
                      },
                      {
                        alt: 'Logo CNRS',
                        href: '#',
                        imgUrl: '/LOGO_CNRS_BLEU.png'
                      },
                      {
                        alt: 'Logo LNE',
                        href: '#',
                        imgUrl: '/logo-lne.svgz'
                      },
                      {
                        alt: 'Logo DGE',
                        href: '#',
                        imgUrl: '/logo_DGE.png'
                      },
                      {
                        alt: 'Logo huggingface',
                        href: '#',
                        imgUrl: '/hf-logo-with-title.svg'
                      }
                    ]
                  }}
                />
              </Box>
            </LeaderboardProvider>
          </Router>
        </MuiDsfrThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
