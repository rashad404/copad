'use client';

import { useTranslation } from 'react-i18next';
import { ChatBubbleLeftRightIcon, DocumentArrowUpIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('home.features.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('home.features.subtitle')}
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mt-2">
            {t('home.features.description')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 flex flex-col items-center">
            <ChatBubbleLeftRightIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('home.features.chat.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {t('home.features.chat.description')}
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 flex flex-col items-center">
            <DocumentArrowUpIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('home.features.upload.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {t('home.features.upload.description')}
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 flex flex-col items-center">
            <ClockIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('home.features.track.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {t('home.features.track.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 