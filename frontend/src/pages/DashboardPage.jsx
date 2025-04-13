import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <Breadcrumb items={[{ label: t("dashboard.title") }]} />
            
            <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-2">{t("dashboard.title")}</h1>
            <p className="text-indigo-100 text-lg max-w-2xl">
              {t("dashboard.subtitle")}
            </p>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Appointments Card */}
            <FeatureCard 
              to="/appointments"
              icon={
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              }
              title={t("dashboard.appointments.title")}
              description={t("dashboard.appointments.description")}
              actionText={t("dashboard.appointments.action")}
            />
            
            {/* Profile Card */}
            <FeatureCard 
              to="/profile"
              icon={
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              }
              title={t("dashboard.profile.title")}
              description={t("dashboard.profile.description")}
              actionText={t("dashboard.profile.action")}
            />
            
            {/* New Appointment Card */}
            <FeatureCard 
              to="/appointments/new"
              highlighted={true}
              icon={
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              }
              title={t("dashboard.newAppointment.title")}
              description={t("dashboard.newAppointment.description")}
              actionText={t("dashboard.newAppointment.action")}
            />
          </div>
          
          {/* Stats/Quick Info Section */}
          <div className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">{t("dashboard.healthSummary.title")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">{t("dashboard.healthSummary.recentConsultations")}</div>
                    <div className="mt-1 text-xl font-semibold text-indigo-600">3</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">{t("dashboard.healthSummary.profileCompletion")}</div>
                    <div className="mt-1 text-xl font-semibold text-green-600">85%</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">{t("dashboard.healthSummary.nextAppointment")}</div>
                    <div className="mt-1 text-lg font-semibold text-purple-600">In 2 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Info Banner */}
        <div className="bg-indigo-50 border-t border-indigo-100 mt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-indigo-900">{t("dashboard.security.title")}</h3>
                  <p className="text-sm text-indigo-700">{t("dashboard.security.description")}</p>
                </div>
              </div>
              <Link to="/privacy" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                {t("dashboard.security.learnMore")}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-xs text-gray-500">
              {t("dashboard.footer")}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ to, icon, title, description, actionText, highlighted = false }) {
  const { t } = useTranslation();

  return (
    <Link
      to={to}
      className={`group relative bg-white rounded-xl overflow-hidden transition-all hover:shadow-lg flex flex-col ${
        highlighted ? 'ring-2 ring-green-500 shadow-md' : 'border border-gray-200'
      }`}
    >
      {highlighted && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          {t("dashboard.newAppointment.recommended")}
        </div>
      )}
      <div className="p-6 flex-grow">
        {icon}
        <h3 className={`text-lg font-semibold mt-4 mb-2 ${
          highlighted ? 'text-green-700' : 'text-indigo-700'
        }`}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      </div>
      <div className={`px-6 py-4 border-t border-gray-100 ${
        highlighted ? 'bg-green-50' : 'bg-gray-50'
      }`}>
        <span className={`text-sm font-medium group-hover:underline ${
          highlighted ? 'text-green-600' : 'text-indigo-600'
        }`}>
          {actionText} →
        </span>
      </div>
    </Link>
  );
}