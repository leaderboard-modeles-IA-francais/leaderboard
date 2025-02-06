import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useLang } from "i18n";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";

startReactDsfr({ 
  defaultColorScheme: "system",
  useLang: function useLangDsfr() {
        const { lang } = useLang();
        return lang;
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
