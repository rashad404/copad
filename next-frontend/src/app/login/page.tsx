'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/context/AuthContext";
import PublicRoute from "@/components/PublicRoute";
import MainLayout from "@/components/layouts/MainLayout";
import { handleLogin } from "@/utils/auth";

export default function LoginPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Clear any existing auth state and session storage flags
      localStorage.removeItem("token");
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
      
      // Clear any redirect flags from session storage
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('redirect_')) {
          sessionStorage.removeItem(key);
        }
      });
      
      console.log('LoginPage: Attempting login with', form.email);
      
      try {
        // Make a direct API call instead of using the context method
        // This can help debug any issues with the login flow
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://100.89.150.50:8002/api';
        
        // If we're in production (not localhost), use relative path
        if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
          apiUrl = '/api';
        }
        
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`Login failed with status: ${response.status}`);
        }
        
        // The backend returns the token directly as a string
        const token = await response.text();
        console.log('LoginPage: Got token from API:', token ? 'token received' : 'no token');
        
        if (token) {
          // Manually store token
          localStorage.setItem('token', token);
          
          // Set the auth cookie
          document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
          
          console.log('LoginPage: Login successful, token stored in localStorage and cookie');
          
          // Get the redirect URL from query parameters if it exists
          const searchParams = new URLSearchParams(window.location.search);
          const redirectTo = searchParams.get('redirect') || '/dashboard';
          
          console.log('LoginPage: Redirecting to', redirectTo);
          
          // Wait a moment to let cookies propagate
          setTimeout(() => {
            // Use window.location.href for a full page reload with skip_redirect param
            window.location.href = `${redirectTo}?skip_redirect=true`;
          }, 500);
          
          return;
        } else {
          throw new Error('Login succeeded but no token was returned');
        }
      } catch (apiError) {
        console.error('Direct API call failed:', apiError);
        throw apiError;
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(t("auth.errors.login_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Use relative path for API calls in production
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://100.89.150.50:8002/api';
    
    // If we're in production (not localhost), use relative path
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
      apiUrl = '/api';
    }
    
    window.location.href = `${apiUrl}/oauth2/authorization/${provider}`;
  };

  // Debug function to check and display auth state
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const cookieToken = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
    
    console.log('Login Page Auth Debug:', {
      hasLocalStorageToken: !!token,
      hasCookieToken: !!cookieToken,
      isAuthenticatedContext: isAuthenticated,
      isLoadingAuth: isLoading
    });
  };

  // Call on component mount
  useEffect(() => {
    console.log('LoginPage: Component mounted, checking auth state', { isAuthenticated, isLoading });
    checkAuth();
    
    // Force clear any existing auth
    localStorage.removeItem('token');
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
  }, [isAuthenticated, isLoading]);
  
  return (
    <PublicRoute>
      <MainLayout>
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Left side - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('auth.login.welcome')}</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{t('auth.login.subtitle')}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                {error && (
                  <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                
                <div className="space-y-4 mb-6">
                  <button
                    onClick={() => handleSocialLogin('google')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
                    {t('auth.login_with_google')}
                  </button>
                  {/* <button
                    onClick={() => handleSocialLogin('facebook')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <Image src="/facebook-icon.svg" alt="Facebook" width={20} height={20} />
                    {t('auth.login_with_facebook')}
                  </button> */}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t('auth.or')}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 mt-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.email')}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder={t('auth.email_placeholder')}
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 
                        text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition-colors dark:bg-gray-700"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('auth.password')}
                      </label>
                      <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                        {t('auth.forgot_password')}
                      </Link>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder={t('auth.password_placeholder')}
                      value={form.password}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 
                        text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition-colors dark:bg-gray-700"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      {t('auth.remember_me')}
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg
                      shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                      transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('auth.login.signing_in')}
                      </>
                    ) : t('auth.login.sign_in')}
                  </button>
                </form>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('auth.login.no_account')}{" "}
                  <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                    {t('auth.login.create_account')}
                  </Link>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                  <Link href="/" className="hover:underline flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t('common.back_to_home')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Illustration (hidden on mobile) */}
          <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 items-center justify-center">
            <div className="max-w-md text-center text-white p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-2xl font-bold mb-2">{t('auth.login.secure_title')}</h2>
              <p className="text-indigo-200">
                {t('auth.login.secure_description')}
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <div className="bg-indigo-500/30 rounded-lg p-4">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm text-indigo-200">{t('auth.login.access')}</div>
                </div>
                <div className="bg-indigo-500/30 rounded-lg p-4">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm text-indigo-200">{t('auth.login.secure')}</div>
                </div>
                <div className="bg-indigo-500/30 rounded-lg p-4">
                  <div className="text-3xl font-bold">AI</div>
                  <div className="text-sm text-indigo-200">{t('auth.login.powered')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </PublicRoute>
  );
}