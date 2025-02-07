import {addFooterTranslations, Footer,} from "@codegouvfr/react-dsfr/Footer";
import {CallOut} from "@codegouvfr/react-dsfr/CallOut";
import {Highlight} from "@codegouvfr/react-dsfr/Highlight";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
// import { Box, Typography, Link } from "@mui/material";

const footer = () => {

    // const callout = <Alert 
    //     severity="warning"
    //     description="
    //         Ce leaderboard compare les modèles de language adaptés à la langue française, sur des jeux de données en français, adaptés aux spécificités culturelles de la francophonie. C'est d'abord un projet de recherche collaboratif, et nous espérons recevoir de nombreuses contributions pour l'améliorer au fil du temps!
    //         Le leaderboard n'est que dans sa toute première version, et sera amené à évoluer régulièrement, avec de nouveaux jeux de données, de nouvelles métriques, et, on l'espère, beaucoup de nouveaux modèles ouverts soumis par la communauté! Dans sa version initiale, nous avons couvert un panel de modèles ouverts, entrainés sur du français, de différentes tailles et origines.
    //         Note: Les données d'évaluation ont été pour l'instant gardées confidentielles, pour préserver l'intégrité et la validité des résultats, et éviter les manipulations du classement.
    //     "
    //     small
    // />
    const callout = <Highlight 
                    size="sm"
                    classes={{
                        root: 'fr-highlight--orange-terre-battue'
                    }}>
                        Ce leaderboard compare les modèles de language adaptés à la langue française, sur des jeux de données en français, adaptés aux spécificités culturelles de la francophonie. C'est d'abord un projet de recherche collaboratif, et nous espérons recevoir de nombreuses contributions pour l'améliorer au fil du temps!
                        Le leaderboard n'est que dans sa toute première version, et sera amené à évoluer régulièrement, avec de nouveaux jeux de données, de nouvelles métriques, et, on l'espère, beaucoup de nouveaux modèles ouverts soumis par la communauté! Dans sa version initiale, nous avons couvert un panel de modèles ouverts, entrainés sur du français, de différentes tailles et origines.
                        Note: Les données d'évaluation ont été pour l'instant gardées confidentielles, pour préserver l'intégrité et la validité des résultats, et éviter les manipulations du classement.
                    </Highlight>

    return <Footer
        style={{"boxShadow": "none"}}
        accessibility="fully compliant"
        contentDescription={callout}
        classes={{
            logo: "logo_footer",
            contentLink: "content_link",
            content: "foot_content"
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
