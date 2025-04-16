import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import GuestChat from "../components/GuestChat";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Central AI Chat (Fixed Height, Mobile Friendly) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 pb-8">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute right-0 top-0 h-full w-48 translate-x-1/2 transform text-white" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
        </div>
        <div className="relative pt-8 pb-4 sm:pt-12 sm:pb-8 lg:pt-20 lg:pb-12">
          <div className="mx-auto  text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              Chat with Dr. Copad AI Doctor
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              Instant, private medical advice. Try it now—no sign up needed.
            </p>
            <div className="mx-auto w-full max-w-2xl">
              {/* Fixed Height, Scrollable Chat Container */}
              <div
                className="rounded-2xl shadow-xl bg-white flex flex-col overflow-hidden"
                style={{ height: '400px', maxHeight: '80vw', minHeight: '320px' }}
              >
                <GuestChat containerClassName="flex flex-col flex-1 min-h-0 h-full" messagesClassName="flex-1 overflow-y-auto px-4 py-2" inputClassName="sticky bottom-0 bg-white px-4 py-2 border-t border-gray-100" />
              </div>
            </div>
            <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/register"
                className="flex items-center justify-center rounded-md bg-indigo-600 px-7 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center rounded-md border border-indigo-600 bg-white px-7 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
        {/* Trust Bar */}
        <div className="bg-white py-3 border-y border-indigo-100 mt-4">
          <div className="mx-auto max-w-5xl flex flex-wrap justify-center gap-4 items-center text-sm">
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="font-semibold text-gray-800">10,000+ users helped</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm6 0c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3z" /></svg>
              <span className="font-semibold text-gray-800">Private & Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1v-4h-1" /></svg>
              <span className="font-semibold text-gray-800">Powered by OpenAI GPT-4</span>
            </div>
          </div>
        </div>
      </div>


      {/* How It Works Section */}
      <div className="py-16 bg-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">How It Works</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 rounded-full p-4 mb-4"><svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg></div>
              <h3 className="text-lg font-semibold">1. Ask Dr. Copad</h3>
              <p className="mt-2 text-gray-600">Type your health question or symptoms and chat instantly with our AI doctor.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 rounded-full p-4 mb-4"><svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4" /></svg></div>
              <h3 className="text-lg font-semibold">2. Get Personalized Advice</h3>
              <p className="mt-2 text-gray-600">Receive instant, confidential guidance tailored to you.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 rounded-full p-4 mb-4"><svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /></svg></div>
              <h3 className="text-lg font-semibold">3. Book & Track</h3>
              <p className="mt-2 text-gray-600">Register to manage appointments and keep your health profile updated.</p>
            </div>
          </div>
        </div>
      </div>

      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">{t("home.features.title")}</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t("home.features.subtitle")}
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              {t("home.features.description")}
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Feature 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                }
                title={t("home.features.chat.title")}
                description={t("home.features.chat.description")}
              />
              <Feature 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                title={t("home.features.upload.title")}
                description={t("home.features.upload.description")}
              />
              <Feature 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                title={t("home.features.track.title")}
                description={t("home.features.track.description")}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white text-center">
            {t("home.testimonials.title")}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
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
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-50 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  <span className="block">{t("home.cta.title")}</span>
                  <span className="block text-indigo-600">{t("home.cta.subtitle")}</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-gray-600">
                  {t("home.cta.description")}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link to="/register" className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10">
                    {t("home.cta.getStarted")}
                  </Link>
                  <Link to="/login" className="flex items-center justify-center rounded-md border border-indigo-600 bg-white px-8 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50 md:py-4 md:px-10">
                    {t("home.cta.login")}
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative -mt-6 md:mt-0 h-full min-h-64">
              <div className="absolute inset-0 flex items-center justify-center bg-indigo-700 lg:relative h-full">
                <svg className="h-full w-full text-indigo-800 opacity-25" fill="currentColor" viewBox="0 0 600 600" aria-hidden="true">
                  <path d="M600 300c0 165.69-134.31 300-300 300S0 465.69 0 300 134.31 0 300 0s300 134.31 300 300zM300 50c-138.07 0-250 111.93-250 250s111.93 250 250 250 250-111.93 250-250S438.07 50 300 50zm0 50c110.46 0 200 89.54 200 200s-89.54 200-200 200-200-89.54-200-200S189.54 100 300 100z" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-48 w-48 rounded-full bg-indigo-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
    <div className="relative">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
        {icon}
      </div>
      <div className="mt-5">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-base text-gray-500">{description}</p>
      </div>
    </div>
  );
}

// Testimonial Component
function Testimonial({ quote, author, role }) {
  return (
    <div className="bg-white/10 rounded-lg p-6">
      <p className="text-lg text-white">{quote}</p>
      <div className="mt-6">
        <p className="text-base font-medium text-white">{author}</p>
        <p className="text-sm text-indigo-200">{role}</p>
      </div>
    </div>
  );
}