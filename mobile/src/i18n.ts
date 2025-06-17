import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

// Import translations
import enTranslations from './translations/en.json';
import azTranslations from './translations/az.json';
import ruTranslations from './translations/ru.json';
import trTranslations from './translations/tr.json';
import esTranslations from './translations/es.json';
import ptTranslations from './translations/pt.json';
import arTranslations from './translations/ar.json';
import zhTranslations from './translations/zh.json';
import hiTranslations from './translations/hi.json';

const LANGUAGE_STORAGE_KEY = 'i18nextLng';

// Language detector for React Native
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // First try to get saved language from AsyncStorage
      const savedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLang) {
        callback(savedLang);
        return;
      }

      // If no saved language, detect from device
      const deviceLang = Localization.getLocales()[0].languageCode;
      const supportedLangs = ['en', 'az']; // Only include languages we have translations for
      const lang = supportedLangs.includes(deviceLang) ? deviceLang : 'en';
      callback(lang);
    } catch (error) {
      console.error('Error detecting language:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    } catch (error) {
      console.error('Error caching language:', error);
    }
  },
};

i18n
  .use(initReactI18next)
  .init({
    lng: 'en', // Set default language
    resources: {
      en: {
        translation: enTranslations,
      },
      az: {
        translation: azTranslations,
      },
      ru: {
        translation: ruTranslations,
      },
      tr: {
        translation: trTranslations,
      },
      es: {
        translation: esTranslations,
      },
      pt: {
        translation: ptTranslations,
      },
      ar: {
        translation: arTranslations,
      },
      zh: {
        translation: zhTranslations,
      },
      hi: {
        translation: hiTranslations,
      },
    },
    fallbackLng: 'en',
    debug: false, // Turn off debug for cleaner logs
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3', // For React Native
    react: {
      useSuspense: false, // Disable suspense for React Native
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    },
  });

// Add language change listener for debugging
i18n.on('languageChanged', (lng) => {
  console.log('=== Language Changed Event ===');
  console.log('New language:', lng);
  console.log('Current language:', i18n.language);
  console.log('Resolved language:', i18n.resolvedLanguage);
  console.log('Has translations for', lng, ':', i18n.hasResourceBundle(lng, 'translation'));
  console.log('==============================');
});

export default i18n;