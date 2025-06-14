'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-700 dark:to-violet-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="md:grid md:grid-cols-5">
            <div className="p-8 md:p-12 md:col-span-3 text-white">
              <h2 className="text-3xl font-bold mb-6">
                {t('home.cta.title')}
                <span className="block mt-1">{t('home.cta.subtitle')}</span>
              </h2>
              <p className="text-indigo-100 dark:text-indigo-200 mb-8 text-lg">
                {t('home.cta.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="bg-white text-indigo-600 dark:bg-gray-100 dark:text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors shadow-sm">
                  {t('home.cta.getStarted')}
                </Link>
                <Link href="/login" className="bg-indigo-700 text-white border border-indigo-500 px-6 py-3 rounded-lg font-medium hover:bg-indigo-800 transition-colors">
                  {t('home.cta.login')}
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-indigo-300 dark:text-indigo-400 mr-2" />
                  <span className="text-sm">{t('home.cta.benefit1')}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-indigo-300 dark:text-indigo-400 mr-2" />
                  <span className="text-sm">{t('home.cta.benefit2')}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block md:col-span-2 bg-indigo-800 dark:bg-indigo-900 p-8">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-indigo-500 dark:bg-indigo-700 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheckIcon className="h-12 w-12 text-white" />
                  </div>
                  <div className="text-white font-bold text-xl mb-2">
                    {t('home.cta.security.title')}
                  </div>
                  <p className="text-indigo-200 dark:text-indigo-300 text-sm">
                    {t('home.cta.security.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 