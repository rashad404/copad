'use client';

import { useTranslation } from 'react-i18next';
import { HeartIcon, ShieldCheckIcon, LightBulbIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import MainLayout from '@/components/layouts/MainLayout';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            {t('about.title')}
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {t('about.introduction')}
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              {t('about.mission.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('about.mission.description')}
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              {t('about.vision.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('about.vision.description')}
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              {t('about.values.title')}
            </h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>{t('about.values.items.innovation')}</li>
              <li>{t('about.values.items.quality')}</li>
              <li>{t('about.values.items.accessibility')}</li>
              <li>{t('about.values.items.privacy')}</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 