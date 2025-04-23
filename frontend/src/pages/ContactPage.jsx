import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('contact.subtitle')}
            </p>
          </div>

          {/* Medical Note Box */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('contact.medicalNote.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('contact.medicalNote.description')}
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                  Go to Homepage →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              {t('contact.introduction')}
            </p>

            <div className="space-y-8">
              {/* Email Section */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('contact.email.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {t('contact.email.description')}
                  </p>
                  <a
                    href="mailto:info@azdoc.ai"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                  >
                    {t('contact.email.address')}
                  </a>
                </div>
              </div>

              {/* Support Hours Section */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('contact.support.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('contact.support.description')}
                  </p>
                </div>
              </div>

              {/* Emergency Note */}
              <div className="flex items-start space-x-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-red-600 dark:text-red-400">
                  {t('contact.note')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage; 