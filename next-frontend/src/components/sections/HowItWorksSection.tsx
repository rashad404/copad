'use client';

import { useTranslation } from 'react-i18next';

export default function HowItWorksSection() {
  const { t } = useTranslation();

  // Placeholder images for steps (replace with real images if available)
  const stepImages = [
    '/images/step1.svg',
    '/images/step2.svg',
    '/images/step3.svg',
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('home.howItWorks.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('home.howItWorks.subtitle')}
          </p>
        </div>
        <div className="relative">
          {/* Timeline connector */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-indigo-200 dark:bg-indigo-800 transform -translate-x-1/2" />
          <div className="space-y-12 md:space-y-0 relative">
            {/* Step 1 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
              <div className="md:text-right md:pr-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4 md:ml-auto">1</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('home.howItWorks.step1.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('home.howItWorks.step1.description')}
                </p>
              </div>
              <div className="mt-6 md:mt-0 md:pl-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                  <img src={stepImages[0]} alt="Step 1" className="w-full h-48 object-contain" />
                </div>
              </div>
            </div>
            {/* Step 2 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
              <div className="md:order-2 md:text-left md:pl-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4">2</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('home.howItWorks.step2.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('home.howItWorks.step2.description')}
                </p>
              </div>
              <div className="mt-6 md:mt-0 md:order-1 md:pr-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                  <img src={stepImages[1]} alt="Step 2" className="w-full h-48 object-contain" />
                </div>
              </div>
            </div>
            {/* Step 3 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
              <div className="md:text-right md:pr-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4 md:ml-auto">3</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('home.howItWorks.step3.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('home.howItWorks.step3.description')}
                </p>
              </div>
              <div className="mt-6 md:mt-0 md:pl-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                  <img src={stepImages[2]} alt="Step 3" className="w-full h-48 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 