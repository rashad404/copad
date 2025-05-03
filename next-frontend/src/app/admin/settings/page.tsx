'use client';

import { useTranslation } from 'react-i18next';
import { Settings, InfoIcon } from 'lucide-react';

export default function AdminSettings() {
  const { t } = useTranslation();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('admin.settings.title')}
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-center p-12 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center max-w-md">
              <Settings className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                {t('admin.settings.comingSoon')}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('admin.settings.comingSoonDescription', 'This feature is currently under development. Check back soon for updates!')}
              </p>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <InfoIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {t('admin.settings.configureMessage', 'Future settings will include site configuration, theme options, and notification preferences.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}