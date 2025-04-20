import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { AGENT_NAME } from './config/constants';

import enTranslations from './translations/en.json';
import azTranslations from './translations/az.json';
import esTranslations from './translations/es.json';
import ruTranslations from './translations/ru.json';
import trTranslations from './translations/tr.json';
import zhTranslations from './translations/zh.json';
import hiTranslations from './translations/hi.json';
import arTranslations from './translations/ar.json';
import ptTranslations from './translations/pt.json';

if (!localStorage.getItem('i18nextLng')) {
  localStorage.setItem('i18nextLng', 'az');
}
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
      },
      es: {
        translation: esTranslations
      },
      ru: {
        translation: ruTranslations
      },
      tr: {
        translation: trTranslations
      },
      zh: {
        translation: zhTranslations
      },
      hi: {
        translation: hiTranslations
      },
      ar: {
        translation: arTranslations
      },
      pt: {
        translation: ptTranslations
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