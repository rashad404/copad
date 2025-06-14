'use client';

import { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  name: string;
  flag: string;
  shortName: string;
}

const languages: Language[] = [
  {
    code: 'az',
    name: 'AZ',
    flag: '🇦🇿',
    shortName: 'AZ'
  },
  {
    code: 'en',
    name: 'EN',
    flag: '🇬🇧',
    shortName: 'EN'
  },
  {
    code: 'ru',
    name: 'RU',
    flag: '🇷🇺',
    shortName: 'RU'
  },
  {
    code: 'tr',
    name: 'TR',
    flag: '🇹🇷',
    shortName: 'TR'
  },
  {
    code: 'es',
    name: 'ES',
    flag: '🇪🇸',
    shortName: 'ES'
  },
  {
    code: 'pt',
    name: 'PT',
    flag: '🇵🇹',
    shortName: 'PT'
  },
  {
    code: 'ar',
    name: 'العربية',
    flag: '🇸🇦',
    shortName: 'العربية'
  },
  {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳',
    shortName: '中文'
  },
  {
    code: 'hi',
    name: 'हिंदी',
    flag: '🇮🇳',
    shortName: 'हिंदी'
  }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState<Language>(
    languages.find(lang => lang.code === i18n.language) || languages[0]
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const currentLang = languages.find(lang => lang.code === i18n.language);
    if (currentLang) {
      setSelected(currentLang);
    }
  }, [i18n.language]);

  if (!mounted) return null;

  const handleLanguageChange = (language: Language) => {
    setSelected(language);
    // Save language preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', language.code);
    }
    i18n.changeLanguage(language.code);
    
    // Reload the page to force server-side rendering with the new language
    // This ensures blog posts are fetched with the correct language
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="relative w-26">
      <Listbox value={selected} onChange={handleLanguageChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white/50 dark:bg-gray-800/50 py-2 pl-3 pr-10 text-left shadow-sm hover:bg-white/80 dark:hover:bg-gray-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-800 transition-all duration-200">
            <span className="flex items-center space-x-2">
              <span className="text-lg">{selected.flag}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selected.shortName}</span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {languages.map((language) => (
                <Listbox.Option
                  key={language.code}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-100'
                    }`
                  }
                  value={language}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{language.flag}</span>
                        <span className={`text-sm truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {language.name}
                        </span>
                      </div>

                      {selected && (
                        <span
                          className={`absolute inset-y-0 right-3 flex items-center ${
                            active ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-500 dark:text-indigo-500'
                          }`}
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
} 