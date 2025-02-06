import { Header } from "@codegouvfr/react-dsfr/Header";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { LanguageSelect } from "../LanguageSelect/LanguageSelect";
import Navigation from "../Navigation/Navigation";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { useTranslation, declareComponentKeys } from "i18n";

const header = () => {
    const {t} = useTranslation({header});
    return <Header
    brandTop={<>République <br/> française</>}
    homeLinkProps={{
      href: '/',
      title: 'Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)'
    }}
    quickAccessItems={[
      // other quick access items...
      headerFooterDisplayItem,
      <LanguageSelect />
    ]}
    id="fr-header-simple-header-with-service-title-and-tagline"
    serviceTagline={t("tagline")}
    serviceTitle={<>{t("service")}{' '}<Badge as="span" noIcon severity="success">Beta</Badge></>}
    navigation={<Navigation />}
  />
}

const { i18n } = declareComponentKeys<
| "tagline"
| "service"
>()({ header });
export type I18n = typeof i18n;

export default header;