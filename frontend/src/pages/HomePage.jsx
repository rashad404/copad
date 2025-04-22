import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import GuestChat from '../components/GuestChat.jsx';
import { motion } from "framer-motion";
import { CheckCircle, Shield } from "lucide-react";
import Logo from "../components/Logo";
import { useSiteInfo } from '../context/SiteContext.jsx';

import {
  step1,
  step2,
  step3
} from "../assets/illustrations";

export default function HomePage() {
  const { t } = useTranslation();
  const { WEBSITE_NAME, WEBSITE_TLD } = useSiteInfo();


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Navbar />
      
      <div className="flex-1 relative overflow-hidden">
        {/* Chat Container */}
        <div className='fixed inset-0 top-[64px] md:static mx-auto md:my-4 lg:px-0 w-full md:h-[calc(100vh-180px)]'>
          <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm  h-full flex flex-col">
            <GuestChat 
              containerClassName="flex flex-col h-full"
              messagesClassName="flex-1 overflow-y-auto px-3 py-3 space-y-3 sm:px-4 sm:py-4 sm:space-y-4"
              inputClassName="px-3 py-2 border-t border-gray-100 dark:border-gray-700 sm:px-4 sm:py-3"
            />
          </div>
        </div>
      </div>

      {/*Rest of the page*/}
      <div className='md:block hidden'>

        {/* CTA Buttons - Moved below chat for better mobile UX */}
        <div className="mt-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              {t("home.hero.createAccount")}
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              {t("home.hero.login")}
            </Link>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-y border-gray-100 dark:border-gray-700">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4">
            <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">{t("home.hero.trustBar.usersHelped")}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">{t("home.hero.trustBar.privateSecure")}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1v-4h-1" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">{t("home.hero.trustBar.poweredBy")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section - NEW FROM PASTE-2 */}
        <section className="py-16 px-4 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t("home.howItWorks.title")}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t("home.howItWorks.subtitle")}
              </p>
            </motion.div>
            
            <div className="relative">
              {/* Timeline connector */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-indigo-200 dark:bg-indigo-800 transform -translate-x-1/2" />
              
              <div className="space-y-12 md:space-y-0 relative">
                {/* Step 1 */}
                <motion.div 
                  className="md:grid md:grid-cols-2 md:gap-8 md:items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="md:text-right md:pr-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4 md:ml-auto">1</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {t("home.howItWorks.step1.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t("home.howItWorks.step1.description")}
                    </p>
                  </div>
                  <div className="mt-6 md:mt-0 md:pl-12">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                      <img src={step1} alt="Step 1" className="w-full h-48 object-contain" />
                    </div>
                  </div>
                </motion.div>
                
                {/* Step 2 */}
                <motion.div 
                  className="md:grid md:grid-cols-2 md:gap-8 md:items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="md:order-2 md:text-left md:pl-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4">2</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {t("home.howItWorks.step2.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t("home.howItWorks.step2.description")}
                    </p>
                  </div>
                  <div className="mt-6 md:mt-0 md:order-1 md:pr-12">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                      <img src={step2} alt="Step 2" className="w-full h-48 object-contain" />
                    </div>
                  </div>
                </motion.div>
                
                {/* Step 3 */}
                <motion.div 
                  className="md:grid md:grid-cols-2 md:gap-8 md:items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="md:text-right md:pr-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4 md:ml-auto">3</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {t("home.howItWorks.step3.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t("home.howItWorks.step3.description")}
                    </p>
                  </div>
                  <div className="mt-6 md:mt-0 md:pl-12">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                      <img src={step3} alt="Step 3" className="w-full h-48 object-contain" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials - NEW FROM PASTE-2 */}
        <section className="py-16 px-4 bg-indigo-700 dark:bg-indigo-900 text-white">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">
                {t("home.testimonials.title")}
              </h2>
              <p className="text-indigo-200 dark:text-indigo-300 max-w-2xl mx-auto">
                {t("home.testimonials.subtitle")}
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <motion.div 
                className="bg-white/10 dark:bg-white/5 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="text-yellow-300 mr-1">★</span>
                  ))}
                </div>
                <p className="text-lg mb-6">
                  {t("home.testimonials.testimonial1.quote")}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 dark:bg-indigo-800 mr-4"></div>
                  <div>
                    <p className="font-medium">
                      {t("home.testimonials.testimonial1.author")}
                    </p>
                    <p className="text-indigo-300 dark:text-indigo-400 text-sm">
                      {t("home.testimonials.testimonial1.role")}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Testimonial 2 */}
              <motion.div 
                className="bg-white/10 dark:bg-white/5 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="text-yellow-300 mr-1">★</span>
                  ))}
                </div>
                <p className="text-lg mb-6">
                  {t("home.testimonials.testimonial2.quote")}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 dark:bg-indigo-800 mr-4"></div>
                  <div>
                    <p className="font-medium">
                      {t("home.testimonials.testimonial2.author")}
                    </p>
                    <p className="text-indigo-300 dark:text-indigo-400 text-sm">
                      {t("home.testimonials.testimonial2.role")}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Testimonial 3 */}
              <motion.div 
                className="bg-white/10 dark:bg-white/5 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="text-yellow-300 mr-1">★</span>
                  ))}
                </div>
                <p className="text-lg mb-6">
                  {t("home.testimonials.testimonial3.quote")}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 dark:bg-indigo-800 mr-4"></div>
                  <div>
                    <p className="font-medium">
                      {t("home.testimonials.testimonial3.author")}
                    </p>
                    <p className="text-indigo-300 dark:text-indigo-400 text-sm">
                      {t("home.testimonials.testimonial3.role")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section - NEW FROM PASTE-2 */}
        <section className="py-16 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-700 dark:to-violet-700 rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="md:grid md:grid-cols-5">
                <div className="p-8 md:p-12 md:col-span-3 text-white">
                  <h2 className="text-3xl font-bold mb-6">
                    {t("home.cta.title")}
                    <span className="block mt-1">{t("home.cta.subtitle")}</span>
                  </h2>
                  <p className="text-indigo-100 dark:text-indigo-200 mb-8 text-lg">
                    {t("home.cta.description")}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/register" className="bg-white text-indigo-600 dark:bg-gray-100 dark:text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors shadow-sm">
                      {t("home.cta.getStarted")}
                    </Link>
                    <Link to="/login" className="bg-indigo-700 text-white border border-indigo-500 px-6 py-3 rounded-lg font-medium hover:bg-indigo-800 transition-colors">
                      {t("home.cta.login")}
                    </Link>
                  </div>
                  
                  <div className="mt-8 flex items-center space-x-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-indigo-300 dark:text-indigo-400 mr-2" />
                      <span className="text-sm">{t("home.cta.benefit1")}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-indigo-300 dark:text-indigo-400 mr-2" />
                      <span className="text-sm">{t("home.cta.benefit2")}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block md:col-span-2 bg-indigo-800 dark:bg-indigo-900 p-8">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto bg-indigo-500 dark:bg-indigo-700 rounded-full flex items-center justify-center mb-4">
                        <Shield className="h-12 w-12 text-white" />
                      </div>
                      <div className="text-white font-bold text-xl mb-2">
                        {t("home.cta.security.title")}
                      </div>
                      <p className="text-indigo-200 dark:text-indigo-300 text-sm">
                        {t("home.cta.security.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                {t("home.trust.title")}
              </h3>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Replace these with actual partner/certification logos */}
              <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>

            </motion.div>
          </div>
        </section>

        {/* Footer - NEW FROM PASTE-2 */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-4">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-indigo-100 dark:bg-indigo-900 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <Logo className="w-8 h-8 relative transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <span>
                    <span className="text-gray-800 dark:text-gray-200">{WEBSITE_NAME}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{WEBSITE_TLD}</span>
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  {t("home.footer.description")}
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t("home.footer.product")}</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">{t("home.footer.links.pricing")}</a></li>
                  <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">{t("home.footer.links.faq")}</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t("home.footer.company")}</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">{t("home.footer.links.about")}</a></li>
                  <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">{t("home.footer.links.blog")}</a></li>
                  <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">{t("home.footer.links.contact")}</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t("home.footer.legal")}</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">{t("home.footer.links.privacy")}</a></li>
                  <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">{t("home.footer.links.terms")}</a></li>
                  <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">{t("home.footer.links.security")}</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-gray-400 dark:text-gray-500 text-sm">
                {t("home.footer.copyright", { year: new Date().getFullYear() })}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}