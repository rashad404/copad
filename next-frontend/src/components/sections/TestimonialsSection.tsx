'use client';

import { useTranslation } from 'react-i18next';

export default function TestimonialsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 bg-indigo-700 dark:bg-indigo-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {t('home.testimonials.title')}
          </h2>
          <p className="text-indigo-200 dark:text-indigo-300 max-w-2xl mx-auto">
            {t('home.testimonials.subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white/10 dark:bg-white/5 rounded-xl p-6">
            <div className="mb-4">
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className="text-yellow-300 mr-1">★</span>
              ))}
            </div>
            <p className="text-lg mb-6">
              {t('home.testimonials.testimonial1.quote')}
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 dark:bg-indigo-800 mr-4"></div>
              <div>
                <p className="font-medium">
                  {t('home.testimonials.testimonial1.author')}
                </p>
                <p className="text-indigo-300 dark:text-indigo-400 text-sm">
                  {t('home.testimonials.testimonial1.role')}
                </p>
              </div>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-white/10 dark:bg-white/5 rounded-xl p-6">
            <div className="mb-4">
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className="text-yellow-300 mr-1">★</span>
              ))}
            </div>
            <p className="text-lg mb-6">
              {t('home.testimonials.testimonial2.quote')}
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 dark:bg-indigo-800 mr-4"></div>
              <div>
                <p className="font-medium">
                  {t('home.testimonials.testimonial2.author')}
                </p>
                <p className="text-indigo-300 dark:text-indigo-400 text-sm">
                  {t('home.testimonials.testimonial2.role')}
                </p>
              </div>
            </div>
          </div>
          {/* Testimonial 3 */}
          <div className="bg-white/10 dark:bg-white/5 rounded-xl p-6">
            <div className="mb-4">
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className="text-yellow-300 mr-1">★</span>
              ))}
            </div>
            <p className="text-lg mb-6">
              {t('home.testimonials.testimonial3.quote')}
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 dark:bg-indigo-800 mr-4"></div>
              <div>
                <p className="font-medium">
                  {t('home.testimonials.testimonial3.author')}
                </p>
                <p className="text-indigo-300 dark:text-indigo-400 text-sm">
                  {t('home.testimonials.testimonial3.role')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 