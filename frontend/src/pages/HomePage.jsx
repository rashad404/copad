import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import GuestChat from "../components/GuestChat";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        {/* Hero Content */}
        <div className="relative px-4 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                {t("home.hero.title")}
              </h1>
              <p className="mt-3 text-sm text-gray-600 sm:text-base md:text-lg">
                {t("home.hero.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container - Positioned for better mobile view */}
        <div className="relative mx-auto mt-4 max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="h-[calc(100vh-280px)] sm:h-[500px] flex flex-col">
              <GuestChat 
                containerClassName="flex flex-col h-full"
                messagesClassName="flex-1 overflow-y-auto px-3 py-3 space-y-3 sm:px-4 sm:py-4 sm:space-y-4"
                inputClassName="sticky bottom-0 bg-white/80 backdrop-blur-sm px-3 py-2 border-t border-gray-100 sm:px-4 sm:py-3"
              />
            </div>
          </div>
        </div>

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
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-white px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              {t("home.hero.login")}
            </Link>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4">
            <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-100">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800">{t("home.hero.trustBar.usersHelped")}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-100">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm6 0c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800">{t("home.hero.trustBar.privateSecure")}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-100">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1v-4h-1" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800">{t("home.hero.trustBar.poweredBy")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t("home.howItWorks.title")}</h2>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-8 text-lg font-semibold text-gray-900">{t("home.howItWorks.step1.title")}</h3>
              <p className="mt-4 text-base text-gray-600">{t("home.howItWorks.step1.description")}</p>
            </div>
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-8 text-lg font-semibold text-gray-900">{t("home.howItWorks.step2.title")}</h3>
              <p className="mt-4 text-base text-gray-600">{t("home.howItWorks.step2.description")}</p>
            </div>
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-8 text-lg font-semibold text-gray-900">{t("home.howItWorks.step3.title")}</h3>
              <p className="mt-4 text-base text-gray-600">{t("home.howItWorks.step3.description")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t("home.features.title")}</h2>
            <p className="mt-4 text-lg text-gray-600">{t("home.features.description")}</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Feature 
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              }
              title={t("home.features.chat.title")}
              description={t("home.features.chat.description")}
            />
            <Feature 
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title={t("home.features.upload.title")}
              description={t("home.features.upload.description")}
            />
            <Feature 
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title={t("home.features.track.title")}
              description={t("home.features.track.description")}
            />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-indigo-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white text-center">{t("home.testimonials.title")}</h2>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Testimonial 
              quote={t("home.testimonials.testimonial1.quote")}
              author={t("home.testimonials.testimonial1.author")}
              role={t("home.testimonials.testimonial1.role")}
            />
            <Testimonial 
              quote={t("home.testimonials.testimonial2.quote")}
              author={t("home.testimonials.testimonial2.author")}
              role={t("home.testimonials.testimonial2.role")}
            />
            <Testimonial 
              quote={t("home.testimonials.testimonial3.quote")}
              author={t("home.testimonials.testimonial3.author")}
              role={t("home.testimonials.testimonial3.role")}
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-16 sm:px-12 sm:py-20 lg:px-16">
            <div className="relative">
              <div className="sm:text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  <span className="block">{t("home.cta.title")}</span>
                  <span className="block text-indigo-200">{t("home.cta.subtitle")}</span>
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100">
                  {t("home.cta.description")}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-all duration-200"
                  >
                    {t("home.cta.getStarted")}
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 text-base font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-all duration-200"
                  >
                    {t("home.cta.login")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Privacy</span>
                <span className="text-sm font-medium text-gray-600 hover:text-gray-900">{t("home.footer.privacy")}</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Terms</span>
                <span className="text-sm font-medium text-gray-600 hover:text-gray-900">{t("home.footer.terms")}</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Contact</span>
                <span className="text-sm font-medium text-gray-600 hover:text-gray-900">{t("home.footer.contact")}</span>
              </a>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-sm text-gray-400 md:text-right">
                <span className="inline-flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {t("home.footer.security")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Component
function Feature({ icon, title, description }) {
  return (
    <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        {icon}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-4 text-base text-gray-600">{description}</p>
    </div>
  );
}

// Testimonial Component
function Testimonial({ quote, author, role }) {
  return (
    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <p className="text-lg text-white">{quote}</p>
      <div className="mt-6">
        <p className="text-base font-medium text-white">{author}</p>
        <p className="text-sm text-indigo-200">{role}</p>
      </div>
    </div>
  );
}