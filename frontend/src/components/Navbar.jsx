import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher";
import DarkModeToggle from "./DarkModeToggle";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import { getSiteInfo } from "../context/SiteContext";

export default function Navbar({ isSidebarOpen, toggleSidebar, isMobile }) {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WEBSITE_NAME, WEBSITE_TLD } = getSiteInfo();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <>
      {/* Spacer div to prevent content overlap */}
      <div className="h-20"></div>
      
      <header 
        className={`fixed w-full top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'py-2 bg-white dark:bg-gray-900 shadow-lg' 
            : 'py-3 bg-gradient-to-r from-white via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center">
              {/* Mobile menu toggle */}
              {isAuthenticated && isMobile && (
                <button 
                  onClick={toggleSidebar}
                  className="mr-3 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span className="sr-only">
                    {isSidebarOpen ? 'Close menu' : 'Open menu'}
                  </span>
                  {isSidebarOpen ? (
                    <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              )}
              
              {/* Logo */}
              <Link 
                to="/" 
                className="relative flex items-center space-x-3 group"
              >
                <div className="relative">
                  <div className="absolute -inset-3 bg-indigo-100 dark:bg-indigo-900 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <Logo className="w-10 h-10 relative transition-transform duration-300 group-hover:scale-105" />
                </div>
                <span className="font-bold text-xl">
                  <span className="text-gray-800 dark:text-gray-200">{WEBSITE_NAME}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{WEBSITE_TLD}</span>
                </span>
              </Link>
            </div>

            {/* Right section: Utilities */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <DarkModeToggle />
              
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t("navbar.logout")}
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {t("navbar.login")}
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/50 transform hover:-translate-y-0.5"
                  >
                    {t("navbar.register")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}