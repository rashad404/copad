'use client';

import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [debugVisible, setDebugVisible] = useState(false);

  useEffect(() => {
    console.log('Dashboard: Component mounted, auth state:', { 
      isAuthenticated, 
      isLoading, 
      hasUser: !!user,
      token: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
      hasCookie: typeof document !== 'undefined' ? document.cookie.includes('auth_token=') : false
    });
  }, [isAuthenticated, isLoading, user]);

  const toggleDebug = () => {
    setDebugVisible(!debugVisible);
  };

  // Helper function to check localStorage and cookies
  const getDebugInfo = () => {
    if (typeof window === 'undefined') return {};
    
    const token = localStorage.getItem('token');
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
    
    return {
      hasLocalStorageToken: !!token, 
      tokenFirstChars: token ? token.substring(0, 10) + '...' : 'none',
      hasCookie: !!cookie,
      cookieValue: cookie ? 'exists' : 'none'
    };
  };

  return (
    <ProtectedRoute
      fallback={
        <MainLayout>
          <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="animate-spin mb-4 h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
              <h2 className="text-xl font-semibold mb-2">Loading dashboard...</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Please wait while we retrieve your information</p>
              
            </div>
          </div>
        </MainLayout>
      }
    >
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl overflow-hidden">
            <div className="px-6 py-8">
              <Breadcrumb items={[{ label: t("dashboard.title") }]} />
              
              <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-2">{t("dashboard.title")}</h1>
              <p className="text-indigo-100 text-lg max-w-2xl">
                {t("dashboard.subtitle")}
              </p>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Appointments Card */}
              <FeatureCard 
                href="/appointments"
                icon={
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
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
                href="/profile"
                icon={
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                }
                title={t("dashboard.profile.title")}
                description={t("dashboard.profile.description")}
                actionText={t("dashboard.profile.action")}
              />
              
              {/* Chat Card */}
              <FeatureCard 
                href="/chat"
                icon={
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                }
                title={t("dashboard.chat.title")}
                description={t("dashboard.chat.description")}
                actionText={t("dashboard.chat.action")}
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t("dashboard.healthSummary.title")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("dashboard.healthSummary.recentConsultations")}</div>
                    <div className="mt-1 text-xl font-semibold text-indigo-600 dark:text-indigo-400">3</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("dashboard.healthSummary.profileCompletion")}</div>
                    <div className="mt-1 text-xl font-semibold text-green-600 dark:text-green-400">85%</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("dashboard.healthSummary.nextAppointment")}</div>
                    <div className="mt-1 text-lg font-semibold text-purple-600 dark:text-purple-400">In 2 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="flex-shrink-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-indigo-900 dark:text-indigo-200">{t("dashboard.security.title")}</h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">{t("dashboard.security.description")}</p>
                  </div>
                </div>
                <Link href="/privacy" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  {t("dashboard.security.learnMore")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}

// Feature Card Component
interface FeatureCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
}

const FeatureCard = ({ href, icon, title, description, actionText }: FeatureCardProps) => (
  <Link 
    href={href}
    className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700"
  >
    <div className="p-6">
      {icon}
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
    </div>
    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
        {actionText} →
      </span>
    </div>
  </Link>
);