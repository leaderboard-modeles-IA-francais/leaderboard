import { createI18nApi, declareComponentKeys } from "i18nifty";
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
    | import ("pages/LeaderboardPage/LeaderboardPage").I18n
    | import ("components/Header/Header").I18n
    | import ("components/Navigation/Navigation").I18n
>()(
    { 
      languages, 
      fallbackLanguage
    },
    {
        "en": {
            "LeaderboardPage": {
                "greating": ({ who })=> `Hello ${who}`,
                "how are you": "How are you feeling today?",
                "learn more": ({ href }) => (
                    <>
                        Learn more about 
                        <a href={href}>this website</a>.
                    </>
                )
            },
            "header": {
                "tagline": "Benchmark for large language models in French",
                "service": "LLM leaderboard for the French language"
            },
            "Navigation": {
                "submit": "Submit",
                "about": "About"
            }
        },
	/* spell-checker: disable */
	"fr": {
            "LeaderboardPage": {
                "greating": ({ who })=> `Bonjour ${who}`,
                "how are you": "Comment vous sentez vous au jour d'hui?",
                "learn more": ({ href }) => (
                    <>
                        En savoir plus à propos de  
                        <a href={href}>ce site web</a>.
                    </>
                )
            },
            "header": {
                "tagline": "Tableau de référence pour les grands modèles de langages pour la langue française",
                "service": "Leaderboard des modèles de langage pour le français"
            },
            "Navigation": {
                "submit": "Soumettre",
                "about": "A propos"
            }
        }
	/* spell-checker: enable */
    }
);