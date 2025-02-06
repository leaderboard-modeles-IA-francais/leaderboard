import React from 'react';import { 
    LanguageSelect as LanguageSelect_base, 
    addLanguageSelectTranslations 
} from "@codegouvfr/react-dsfr/LanguageSelect";

import { useLang, languages} from "i18n";

// NOTE: This component can be used inside or outside of the Header component.
export function LanguageSelect(props) {

    const { id } = props;

    const { lang, setLang } = useLang();

    return (
        <LanguageSelect_base
            id={id}
            supportedLangs={languages}
            lang={lang} // "en" or "fr"
            setLang={setLang}
            fullNameByLang={{
                en: "English",
                fr: "Français"
            }}
        />
    );

}

languages.forEach(lang =>
    addLanguageSelectTranslations({
        lang: lang,
        messages: {
            "select language": (() => {
                switch (lang) {
                    case "en": return "Select language";
                    /* spell-checker: disable */
                    case "fr": return "Choisir la langue";
                    /* spell-checker: enable */
                }
            })()
        }
    })
);