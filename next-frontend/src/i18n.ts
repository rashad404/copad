import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslations from './translations/en.json';
import azTranslations from './translations/az.json';

const isServer = typeof window === 'undefined';

// Initialize i18n without LanguageDetector on server
const initI18n = async () => {
  if (!isServer) {
    // Only import and use LanguageDetector on client side
    const LanguageDetector = (await import('i18next-browser-languagedetector')).default;
    i18n.use(LanguageDetector);
  }

  await i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: enTranslations,
      },
      az: {
        translation: azTranslations,
      },
    },
    fallbackLng: 'en',
    lng: isServer ? 'en' : undefined, // Set default on server, let detector handle client
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: isServer
      ? undefined
      : {
          order: ['querystring', 'cookie', 'localStorage', 'navigator'],
          lookupQuerystring: 'lang',
          lookupCookie: 'i18nextLng',
          lookupLocalStorage: 'i18nextLng',
          caches: ['localStorage', 'cookie'],
          cookieExpirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
        },
  });
};

initI18n();

export default i18n; 