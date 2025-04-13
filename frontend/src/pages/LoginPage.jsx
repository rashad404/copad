import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext.jsx";
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data);
      setIsAuthenticated(true);
      navigate("/");
    } catch {
      setError(t('auth.errors.invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{t('auth.login.welcome')}</h1>
              <p className="mt-2 text-gray-600">{t('auth.login.subtitle')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              {error && (
                <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    transition-colors"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      {t('auth.password')}
                    </label>
                    <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    transition-colors"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    {t('auth.remember_me')}
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg
                  shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
              <p className="text-sm text-gray-600">
                {t('auth.login.no_account')}{" "}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-800">
                  {t('auth.login.create_account')}
                </Link>
              </p>
              <p className="text-xs text-gray-500 mt-4">
                <Link to="/" className="hover:underline flex items-center justify-center">
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
    </div>
  );
}