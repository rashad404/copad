import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslations from './translations/en.json';
import azTranslations from './translations/az.json';

// Initialize i18n without LanguageDetector (server-safe)
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: enTranslations,
      },
      az: {
        translation: azTranslations,
      },
    },
    fallbackLng: 'en',
    lng: 'en', // Default language
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
