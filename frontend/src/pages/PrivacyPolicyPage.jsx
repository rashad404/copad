import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <>
      <main className="bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {t("privacy.title")}
            </h1>
            
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-gray-600 dark:text-gray-300">
                {t("privacy.introduction")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("privacy.information.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("privacy.information.description")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("privacy.usage.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("privacy.usage.description")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("privacy.security.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("privacy.security.description")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("privacy.rights.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("privacy.rights.description")}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("privacy.contact.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("privacy.contact.description")}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}