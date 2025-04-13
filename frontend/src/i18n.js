import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { AGENT_NAME } from './config/constants';

import enTranslations from './translations/en.json';
import azTranslations from './translations/az.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      az: {
        translation: azTranslations
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
      defaultVariables: {
        agentName: AGENT_NAME
      }
    }
  });

export default i18n; 