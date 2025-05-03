'use client';

import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';

export default function TermsOfServicePage() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <main className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {t("terms.title")}
            </h1>
            
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-gray-600 dark:text-gray-300">
                {t("terms.introduction")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("terms.acceptance.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("terms.acceptance.description")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("terms.services.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("terms.services.description")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("terms.userResponsibilities.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("terms.userResponsibilities.description")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("terms.limitations.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("terms.limitations.description")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("terms.intellectualProperty.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("terms.intellectualProperty.description")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("terms.liability.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("terms.liability.description")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("terms.changes.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("terms.changes.description")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("terms.contact.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("terms.contact.description")}
              </p>
            </section>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}