import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import enTranslations from "./translations/en.json";
import azTranslations from "./translations/az.json";
import ruTranslations from "./translations/ru.json";
import { SUPPORTED_LANGUAGES } from "./utils/languages";

// Initialize i18n without LanguageDetector (server-safe)
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    supportedLngs: [...SUPPORTED_LANGUAGES],
    load: "languageOnly",
    resources: {
      ru: { translation: ruTranslations },
      en: {
        translation: enTranslations,
      },
      az: {
        translation: azTranslations,
      },
    },
    // English as the last resort for a missing key, Azerbaijani as the
    // language a visitor lands in. Different questions: a missing Azerbaijani
    // string should show English rather than a raw key, while a visitor with no
    // stated preference should see the language this service is written in.
    fallbackLng: "en",
    lng: "az",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
