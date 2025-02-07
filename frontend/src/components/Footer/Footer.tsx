import {addFooterTranslations, Footer} from "@codegouvfr/react-dsfr/Footer";
// import { Box, Typography, Link } from "@mui/material";

const footer = () => {
    return <Footer
        style={{"boxShadow": "none"}}
        accessibility="fully compliant"
        contentDescription="
          L'évaluation des systèmes d'IA est un enjeu stratégique sur lequel la France s'est historiquement démarquée.

          Ce classement, ou leaderboard, s'inspire directement de l'Open LLM Leaderboard et permet de comparer différents modèles d'IA génératifs à l'aide de jeux de données spécifiquement adaptés aux environnements et à la culture francophones.
          "
        classes={{
            logo: "logo_footer",
            contentLink: "content_link"
        }}
        license={""}
        linkList={undefined}
        partnersLogos={{
          sub: [
            {
              alt: 'Logo Inria',
              imgUrl: '/inr_logo_rouge.png',
              linkProps: {
                href: "https://inria.fr/fr",
                title: "Lien vers le site Inria"
              }
            },
            {
              alt: 'Logo CNRS',
              imgUrl: '/LOGO_CNRS_BLEU.png',
              linkProps: {
                href: "https://www.cnrs.fr/fr",
                title: "Lien vers le site CNRS"
              }
            },
            {
              alt: 'Logo LNE',
              imgUrl: '/logo-lne.svgz',
              linkProps: {
                href: "https://www.lne.fr/fr",
                title: "Lien vers le site LNE"
              }
            },
            {
              alt: 'Logo DGE',
              imgUrl: '/logo_DGE.png',
              linkProps: {
                href: "https://www.entreprises.gouv.fr/",
                title: "Lien vers le site DGE"
              }
            },
            {
              alt: 'Logo huggingface',
              imgUrl: '/hf-logo-with-title.svg',
              linkProps: {
                href: "https://huggingface.co/",
                title: "Lien vers le site huggingface"
              }
            }
          ]
        }}
        websiteMapLinkProps={undefined}
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
