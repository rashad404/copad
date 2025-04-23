import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ShieldCheck, Lock, Key, FileCheck, Activity, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SecurityPage = () => {
  const { t } = useTranslation();
  const lastUpdated = format(new Date(), 'MMMM d, yyyy');

  const securitySections = [
    { icon: ShieldCheck, key: 'dataProtection' },
    { icon: Lock, key: 'encryption' },
    { icon: Key, key: 'access' },
    { icon: FileCheck, key: 'compliance' },
    { icon: Activity, key: 'monitoring' },
    { icon: Mail, key: 'contact' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('security.title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            {t('security.lastUpdated', { date: lastUpdated })}
          </p>

          <div className="prose dark:prose-invert max-w-none mb-12">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {t('security.introduction')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {securitySections.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t(`security.${key}.title`)}
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {t(`security.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SecurityPage; 