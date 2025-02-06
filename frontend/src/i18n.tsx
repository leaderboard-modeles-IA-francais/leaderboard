import { createI18nApi, declareComponentKeys } from "i18nifty";
import { Typography } from "@mui/material";
export {declareComponentKeys};

//List the languages you with to support
export const languages = ["en", "fr"] as const;

//If the user's browser language doesn't match any 
//of the languages above specify the language to fallback to:  
export const fallbackLanguage = "en";

export type Language = typeof languages[number];

export type LocalizedString = Parameters<typeof resolveLocalizedString>[0];

export const {
	useTranslation,
	resolveLocalizedString, 
	useLang, 
	$lang,
	useResolveLocalizedString,
	/** For use outside of React */
	getTranslation,
} = createI18nApi<
    | import ("pages/AddModelPage/AddModelPage").I18n
    | import ("components/Header/Header").I18n
    | import ("components/Navigation/Navigation").I18n
    | import ("components/shared/AuthContainer").I18n
>()(
    { 
      languages, 
      fallbackLanguage
    },
    {
        "en": {
            "header": {
                "tagline": "Benchmark for large language models in French",
                "service": "LLM leaderboard for the French language"
            },
            "Navigation": {
                "submit": "Submit",
                "about": "About"
            },
            "AddModelPage": {
                "title": "Submit a model for evaluation",
                "subtitle": "Add your model to the LLM leaderboard for the French language."
            },
            "AuthContainer": {
                "login": "Login to submit a model",
                "need": "You need to be logged in with your Hugging Face account to submit a model",
                "logout": "Logout",
                "button": "Sign in with Hugging Face",
                "loggedin": ({user}) => (
                    <Typography variant="body1">
                        Connected as <strong>{user}</strong>
                    </Typography>
                )
            }
        },
	/* spell-checker: disable */
	"fr": {
            "header": {
                "tagline": "Comparaison de modèles d'IA génératifs sur des jeux de données adaptés à la langue française",
                "service": "Leaderboard des modèles de langage pour le français"
            },
            "Navigation": {
                "submit": "Soumettre",
                "about": "A propos"
            },
            "AddModelPage": {
                "title": "Soumettre un modele a l'evaluation",
                "subtitle": "Ajoutez votre modele au leaderboard des modeles de langage pour le francais"
            },
            "AuthContainer": {
                "login": "Se connecter pour soumettre un modele",
                "need": "Il vous faut vous connecter avec votre compte Hugging Face pour soumettre un modele",
                "logout": "Se deconnecter",
                "button": "Se connecter avec Hugging Face",
                "loggedin": ({user}) => (
                    <Typography variant="body1">
                        Connecte en tant que <strong>{user}</strong>
                    </Typography>
                )
            }
        }
	/* spell-checker: enable */
    }
);