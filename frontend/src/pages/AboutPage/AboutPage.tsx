import PageHeader from "components/shared/PageHeader";
import { Box, Typography, Paper, List, ListItem, ListItemIcon } from "@mui/material";
import { LocalizedString, useResolveLocalizedString } from "i18n";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const TEXT = {
    TITLE: {
        "en": "About",
        "fr": "A propos"
    },
    PARAGRAPH1: {
        "en": "As LLMs capabilities improve, so do the social and economic stakes around this technology. Governments and institutions now have a vested interest in understanding AI technologies to assess whether and how they can benefit their economies, industries, and society as a whole.",
        "fr": "À mesure que les modèles de langage progressent, leurs enjeux économiques et sociétaux prennent de plus en plus d’ampleur. Les gouvernements et institutions doivent désormais s’approprier ces technologies pour en comprendre les implications et évaluer comment elles peuvent contribuer à leurs économies, leurs industries et à la société dans son ensemble."
    },
    PARAGRAPH2: {
        "en": "In this light, the French Coordination Nationale de l'IA, Ministère de l'Éducation nationale, Inria, LNE, and GENCI collaborated with Hugging Face to build a new LLM reference leaderboard for models in the French language, providing a comprehensive and transparent assessment of their performance, capabilities, and limitations.",
        "fr": "C’est dans cette dynamique que la Coordination Nationale pour l’IA, le Ministère de l’Éducation nationale, Inria, le LNE et GENCI ont collaboré avec Hugging Face pour créer un leaderboard de référence dédié aux modèles de langage en français. Cet outil offre une évaluation de leurs performances, de leurs capacités et aussi de leurs limites."
    },
    PARAGRAPH3: {
        "en": "The collaboration focused on a range of tasks and evaluation metrics, either entirely new or culturally adapted to be specific to the French language and cultural context.",
        "fr": "La collaboration s’est concentrée sur un ensemble de tâches et d’indicateurs d’évaluation (benchmarks), soit entièrement nouveaux, soit adaptés pour prendre en compte les spécificités linguistiques et culturelles du français."
    },
    BUTS: {
        TITRE: {
            "en": "Goals",
            "fr": "Objectifs"
        },
        BUT1: {
            "en": "Improve LLM evaluation and comparison by providing a standardized leaderboard, allowing researchers, developers, and industry stakeholders to benchmark different models on a level playing field, enabling informed decision-making and fostering innovation.",
            "fr": "Améliorer l’évaluation et la comparaison des modèles de langage, en mettant à disposition un leaderboard standardisé, permettant aux chercheurs, développeurs et industriels de comparer leurs performances sur une base équitable, favorisant ainsi une prise de décision éclairée et stimulant l’innovation."
        },
        BUT2: {
            "en": "Promote the French language and culture by encouraging better integration of French into all AI models. By structuring evaluation around French-language tasks, we hope to incentivize model developers, including international ones, to incorporate more French-language data into their training datasets. In doing so, we also aim to enhance the overall capabilities of these models, improving their performance not just in French, but in multilingual tasks more broadly.",
            "fr": "Promouvoir la langue et la culture françaises, en encourageant une meilleure intégration du français dans tous les modèles d’IA. En structurant l’évaluation autour de tâches spécifiques en français, nous espérons inciter les développeurs, y compris internationaux, à intégrer davantage de corpus francophones dans leurs données d’entraînement. En retour, cela permettra d’améliorer leurs performances, non seulement en français, mais aussi dans les tâches multilingues de manière plus large."
        },
        BUT3: {
            "en": "Support AI research and development in France and French-speaking countries, encouraging researchers and developers to contribute to the advancement of more accurate, efficient, and effective LLMs.",
            "fr": "Soutenir la recherche et le développement en IA en France et dans les pays francophones, en encourageant les chercheurs et développeurs à contribuer à l’amélioration des modèles de langage, en les rendant plus précis, efficaces et performants."
        }
    },
    DATASETS: {
        TITRE: {
            "en": "The datasets considered include",
            "fr": "Jeux de données utilisés"
        },
        DATASET1: {
            "en": "GPQA (PhD-level knowledge assessment, professionally translated by Inria),",
            "fr": "GPQA : évaluation des connaissances au niveau doctorat, traduit par Inria."
        },
        DATASET2: {
            "en": "IFEval (LLMs’ ability to follow instructions, professionally culturally adapted by Inria),",
            "fr": "IFEval : capacité des modèles à suivre des instructions, traduit et adapté culturellement par Inria."
        },
        DATASET3: {
            "en": "A new dataset built from Baccalauréat (end of French high school exam) data, provided by the Ministère de l'Éducation nationale, extracted and curated by LNE and Inria.",
            "fr": "Un jeu de données inédit construit à partir des sujets du Baccalauréat (examen de fin d’études secondaires en France), fourni par le Ministère de l’Éducation nationale et extrait par LNE et Inria."
        },
        FOOTER: {
            "en": "GENCI engineers have already conducted evaluations on the French National Jean Zay supercluster, to ensure the robustness of the leaderboard, with researchers providing technical expertise at every step.",
            "fr": "Les ingénieurs de GENCI ont déjà réalisé des évaluations sur le supercalculateur national Jean Zay, afin d’assurer la robustesse du leaderboard, avec le soutien technique de chercheurs d’Hugging Face à chaque étape du processus."
        }
    },
    APPROCHE: {
        TITRE: {
            "en": "The Leaderboard Approach",
            "fr": "Approche du Leaderboard"
        },
        P1: {
            "en": "This is just the first iteration of the leaderboard, and new versions will follow as we enrich it with additional benchmarks and evaluation methods.",
            "fr": "Cette première version du leaderboard marque le début d’un projet évolutif : de nouvelles versions verront le jour, enrichies avec de nouveaux benchmarks et méthodes d’évaluation."
        },
        P2: {
            "en": "To ensure the robustness of the leaderboard, we first conducted internal evaluations on a selection of models. However, we want to maintain the spirit of the leaderboard: developers (you!) should submit your own models.",
            "fr": "Pour garantir la solidité et la fiabilité de l’outil, nous avons dans un premier temps réalisé des évaluations internes sur une sélection de modèles. Toutefois, nous souhaitons rester fidèles à l’esprit du leaderboard et encourager les développeurs (vous !) à soumettre leurs propres modèles."
        },
        P3: {
            "en": "Once we reach a sufficient number of submissions, we will add the results to the official ranking. Please bear with us—since evaluations are conducted using public computing resources (thanks to the incredible work of GENCI on the Jean Zay supercomputer), model evaluations might take some time.",
            "fr": "Une fois qu’un nombre suffisant de modèles aura été soumis, nous ajouterons les résultats au classement officiel. Merci pour votre patience : les évaluations sont réalisées sur des ressources de calcul publiques (grâce au travail remarquable du GENCI sur le supercalculateur Jean Zay), ce qui peut nécessiter un certain délai pour traiter les soumissions."
        },
        P4: {
            "en": "Finally, it is important to note that this is an OpenLLM leaderboard —we will only evaluate open-source models.",
            "fr": "Enfin, il est important de préciser que ce leaderboard est un OpenLLM leaderboard : seuls les modèles open source seront évalués."
        },
    },
    ACTEURS: {
        TITRE: {
            "en": "Stakeholders and contribution",
            "fr": "Les acteurs du projet"
        },
        P1: {
            "en": "This leaderboard is the result of a collaborative effort between several key organizations, each playing a crucial role in its development and execution:",
            "fr": "Ce leaderboard est le fruit d’une mobilisation collective impliquant plusieurs partenaires clés :"
        },
        I1: {
            "en": "Coordination Nationale pour l’IA (CNIA): As the entity leading France’s national AI strategy, the national coordination for AI structured the leaderboard project, establishing it as a key deliverable within the Trustworthy AI pillar of the national strategy. It coordinated the various partners and contributed to the selection of strategic benchmarks, including the integration of Baccalauréat exam data, creating a unique benchmark for French-language AI models.",
            "fr": "Coordination Nationale pour l’IA (CNIA) : au pilotage de la stratégie nationale pour l’IA, la CNIA a structuré le projet du leaderboard, en l’inscrivant comme un livrable clé de l’axe IA de confiance de la stratégie française. Elle a coordonné les partenaires et contribué à l’identification des benchmarks stratégiques, dont l’intégration des données du Baccalauréat pour un benchmark inédit en français."
        },
        I2: {
            "en": "Inria: Led the operational management of the project, including mobilizing a specialized translation provider to ensure high-quality linguistic adaptation. INRIA engineers also worked on data extraction from Baccalauréat exams and contributed to the backend/frontend development of the leaderboard.",
            "fr": "Inria : pilotage opérationnel du projet, avec le recours à un prestataire de traduction spécialisé pour garantir une adaptation linguistique optimale. Des ingénieurs ont également été mobilisés pour l’extraction des données du Baccalauréat, ainsi que pour le développement et la consolidation du back-end/front-end de la plateforme."
        },
        I3: {
            "en": "GENCI: Conducted test evaluations on the French National Jean Zay supercomputer, ensuring the robustness of the results. So far, evaluations have been performed on a dozen models of various sizes, a crucial element for ensuring the leaderboard's reliability. This includes models such as Mistral Large, Llama 70B, as well as smaller models, including trending models like Qwen.",
            "fr": "GENCI : réalisation des évaluations tests sur le supercalculateur national Jean Zay, garantissant la robustesse des résultats. Nous avons d’ores et déjà évalué une dizaine de modèles de tailles variées, un élément clé pour assurer la fiabilité du leaderboard. Cela inclut des modèles comme Mistral Large, Llama 70B, ainsi que des modèles plus légers, notamment des modèles en forte croissance comme Qwen."
        },
        I4: {
            "en": "LNE (Laboratoire National de Métrologie et d’Essais): Conducted data verification and extraction, essential for building the final benchmarks.",
            "fr": "LNE (Laboratoire National de Métrologie et d’Essais) : travail de vérification et d’extraction des données pertinentes, essentiel pour la création des benchmarks finaux."
        },
        I5: {
            "en": "Ministère de l’Éducation nationale: Provided access to Baccalauréat data, enabling the creation of an unprecedented dataset that serves as a valuable benchmark",
            "fr": "Ministère de l’Éducation nationale : mise à disposition des données du Baccalauréat, ayant permis de construire un jeu de données inédit, qui constitue un benchmark de référence."
        },
        I6: {
            "en": "And of course Hugging Face: Hosting the evaluation platform and provided technical expertise all along the way.",
            "fr": "Et bien sûr Hugging Face : hébergement de la plateforme d’évaluation et expertise technique tout au long du projet."
        },
    },
}

const AboutPage = () => {

    const {resolveLocalizedString} = useResolveLocalizedString();

    return (
        <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: 4 }}>
            <Box
            sx={{
                width: "100%",
                ph: 2,
                display: "flex",
                flexDirection: "column",
            }}
            >

                <PageHeader 
                    title={resolveLocalizedString(TEXT.TITLE)}
                    subtitle=""
                />

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: "1px solid",
                        borderColor: "grey.200",
                        backgroundColor: "transparent",
                        borderRadius: 2,
                        mb: 6
                    }}
                >
                    <Box sx={{mb: 2}}>
                        <Typography variant="body1">
                            {resolveLocalizedString(TEXT.PARAGRAPH1)}
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                            {resolveLocalizedString(TEXT.PARAGRAPH2)}
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                            {resolveLocalizedString(TEXT.PARAGRAPH3)}
                        </Typography>
                    </Box>

                </Paper>
                
                <Paper
                    elevation={1}
                    sx={{
                        p: 3,
                        border: "1px solid",
                        borderColor: "grey.200",
                        backgroundColor: "transparent",
                        borderRadius: 2,
                        mb: 6
                    }}
                >
                    <Box sx={{mb: 2}}>
                        <Typography variant="h6">
                        {resolveLocalizedString(TEXT.BUTS.TITRE)}
                        </Typography>
                        <Typography variant="body1">
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <NavigateNextIcon/>
                                    </ListItemIcon>
                                    {resolveLocalizedString(TEXT.BUTS.BUT1)}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <NavigateNextIcon/>
                                    </ListItemIcon>
                                    {resolveLocalizedString(TEXT.BUTS.BUT2)}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <NavigateNextIcon/>
                                    </ListItemIcon>
                                    {resolveLocalizedString(TEXT.BUTS.BUT3)}
                                </ListItem>
                            </List>
                        
                        </Typography>
                    </Box>

                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: "1px solid",
                        borderColor: "grey.200",
                        backgroundColor: "transparent",
                        borderRadius: 2,
                        mb: 6
                    }}
                >
                    <Box sx={{mb: 2}}>
                        <Typography variant="h6">
                        {resolveLocalizedString(TEXT.DATASETS.TITRE)}
                        </Typography>
                        <Typography variant="body1">
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <NavigateNextIcon/>
                                    </ListItemIcon>
                                    {resolveLocalizedString(TEXT.DATASETS.DATASET1)}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <NavigateNextIcon/>
                                    </ListItemIcon>
                                    {resolveLocalizedString(TEXT.DATASETS.DATASET2)}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <NavigateNextIcon/>
                                    </ListItemIcon>
                                    {resolveLocalizedString(TEXT.DATASETS.DATASET3)}
                                </ListItem>
                            </List>
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                            {resolveLocalizedString(TEXT.DATASETS.FOOTER)}
                        </Typography>
                    </Box>

                </Paper>

                <Paper
                    elevation={1}
                    sx={{
                        p: 3,
                        border: "1px solid",
                        borderColor: "grey.200",
                        backgroundColor: "transparent",
                        borderRadius: 2,
                        mb: 6
                    }}
                >
                    <Box sx={{mb: 2}}>
                        <Typography variant="h6">
                        {resolveLocalizedString(TEXT.APPROCHE.TITRE)}
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                            {resolveLocalizedString(TEXT.APPROCHE.P1)}
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                            {resolveLocalizedString(TEXT.APPROCHE.P2)}
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                            {resolveLocalizedString(TEXT.APPROCHE.P3)}
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                            {resolveLocalizedString(TEXT.APPROCHE.P4)}
                        </Typography>
                    </Box>

                </Paper>
                
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: "1px solid",
                        borderColor: "grey.200",
                        backgroundColor: "transparent",
                        borderRadius: 2,
                        mb: 6
                    }}
                >
                    <Box sx={{mb: 2}}>
                        <Typography variant="h6">
                        {resolveLocalizedString(TEXT.ACTEURS.TITRE)}
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                            {resolveLocalizedString(TEXT.ACTEURS.P1)}
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <NavigateNextIcon/>
                                    </ListItemIcon>
                                    {resolveLocalizedString(TEXT.ACTEURS.I1)}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <NavigateNextIcon/>
                                    </ListItemIcon>
                                    {resolveLocalizedString(TEXT.ACTEURS.I2)}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <NavigateNextIcon/>
                                    </ListItemIcon>
                                    {resolveLocalizedString(TEXT.ACTEURS.I3)}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <NavigateNextIcon/>
                                    </ListItemIcon>
                                    {resolveLocalizedString(TEXT.ACTEURS.I4)}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <NavigateNextIcon/>
                                    </ListItemIcon>
                                    {resolveLocalizedString(TEXT.ACTEURS.I5)}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <NavigateNextIcon/>
                                    </ListItemIcon>
                                    {resolveLocalizedString(TEXT.ACTEURS.I6)}
                                </ListItem>
                            </List>
                        
                        </Typography>
                    </Box>

                </Paper>


            </Box>
        </Box>
        
    );
};

export default AboutPage;