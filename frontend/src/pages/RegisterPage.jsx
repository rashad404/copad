import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    age: "", 
    gender: "" 
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear error when user types
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(form);
      localStorage.setItem("token", res.data);
      setIsAuthenticated(true); // 👈 sets auth state
      navigate("/"); // 👈 goes to dashboard (or homepage based on auth)
    } catch (err) {
      setError(err?.response?.data?.message || t("register.error.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left side - Illustration (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 items-center justify-center">
          <div className="max-w-md text-center text-white p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">{t("register.illustration.title")}</h2>
            <p className="text-indigo-200">
              {t("register.illustration.description")}
            </p>
            <div className="mt-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-500/30 rounded-lg p-4 text-left">
                  <div className="text-xl font-bold mb-1">{t("register.illustration.features.private.title")}</div>
                  <div className="text-xs text-indigo-200">{t("register.illustration.features.private.description")}</div>
                </div>
                <div className="bg-indigo-500/30 rounded-lg p-4 text-left">
                  <div className="text-xl font-bold mb-1">{t("register.illustration.features.access.title")}</div>
                  <div className="text-xs text-indigo-200">{t("register.illustration.features.access.description")}</div>
                </div>
                <div className="bg-indigo-500/30 rounded-lg p-4 text-left">
                  <div className="text-xl font-bold mb-1">{t("register.illustration.features.dashboard.title")}</div>
                  <div className="text-xs text-indigo-200">{t("register.illustration.features.dashboard.description")}</div>
                </div>
                <div className="bg-indigo-500/30 rounded-lg p-4 text-left">
                  <div className="text-xl font-bold mb-1">{t("register.illustration.features.ai.title")}</div>
                  <div className="text-xs text-indigo-200">{t("register.illustration.features.ai.description")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{t("register.title")}</h1>
              <p className="mt-2 text-gray-600">{t("register.subtitle")}</p>
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("register.form.fullName")}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder={t("register.form.fullNamePlaceholder")}
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("register.form.email")}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder={t("register.form.emailPlaceholder")}
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("register.form.password")}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder={t("register.form.passwordPlaceholder")}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    transition-colors"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("register.form.passwordHint")}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      {t("register.form.age")}
                    </label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      required
                      min="1"
                      max="120"
                      placeholder={t("register.form.agePlaceholder")}
                      value={form.age}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      {t("register.form.gender")}
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      transition-colors appearance-none bg-white"
                      style={{ 
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1em'
                      }}
                    >
                      <option value="">{t("register.form.genderPlaceholder")}</option>
                      <option value="Male">{t("register.form.genderOptions.male")}</option>
                      <option value="Female">{t("register.form.genderOptions.female")}</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-start mt-6">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                    {t("register.form.terms")}{" "}
                    <Link to="/terms" className="text-indigo-600 hover:text-indigo-800">
                      {t("register.form.termsLink")}
                    </Link>{" "}
                    {t("register.form.and")}{" "}
                    <Link to="/privacy" className="text-indigo-600 hover:text-indigo-800">
                      {t("register.form.privacyLink")}
                    </Link>
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
                      {t("register.form.submitting")}
                    </>
                  ) : t("register.form.submit")}
                </button>
              </form>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t("auth.login.no_account")}{" "}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
                  {t("auth.login.create_account")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}