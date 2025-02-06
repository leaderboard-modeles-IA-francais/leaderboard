import {addFooterTranslations, Footer} from "@codegouvfr/react-dsfr/Footer";

// import { Box, Typography, Link } from "@mui/material";

const footer = () => {
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
}

addFooterTranslations({
    lang: "en",
    messages: {
        accessibility: "Accessibility",
        "fully compliant": "Partially compliant",

    }
});


addFooterTranslations({
    lang: "fr",
    messages: {
        accessibility: "Accesibilité",
        "fully compliant": "Partielle",
        
    }
});

// const Footer = () => {
//   return (
//     <Box
//       component="footer"
//       sx={{
//         width: "100%",
//         py: 4,
//         textAlign: "center",
//       }}
//     >
//       <Typography variant="body2" color="text.secondary" sx={{ mx: 4 }}>
//         © 2024 Hugging Face - Open LLM Leaderboard - Made with 🤗 by the HF team
//         -{" "}
//         <Link
//           href="https://huggingface.co"
//           target="_blank"
//           rel="noopener noreferrer"
//           color="inherit"
//         >
//           huggingface.co
//         </Link>
//       </Typography>
//     </Box>
//   );
// };


export default footer;
