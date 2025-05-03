'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          {t('home.hero.title')}
        </h1>
        <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          {t('home.hero.subtitle')}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3 mb-8">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
          >
            {t('home.hero.createAccount')}
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
          >
            {t('home.hero.login')}
          </Link>
        </div>
        {/* Trust Bar */}
        <div className="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-y border-gray-100 dark:border-gray-700">
          <div className="mx-auto max-w-4xl px-4 py-3 sm:py-4">
            <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">{t('home.hero.trustBar.usersHelped')}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">{t('home.hero.trustBar.privateSecure')}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1v-4h-1" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">{t('home.hero.trustBar.poweredBy')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 