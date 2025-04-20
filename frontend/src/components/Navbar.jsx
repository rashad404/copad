import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Bars3Icon, XMarkIcon, HomeIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher";
import DarkModeToggle from "./DarkModeToggle";
import { useTranslation } from "react-i18next";
import { WEBSITE_NAME } from "../config/constants";
import Logo from "./Logo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
            <Link 
              to="/" 
              className="relative flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="absolute -inset-3 bg-indigo-100 dark:bg-indigo-900 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <Logo className="w-10 h-10 relative transition-transform duration-300 group-hover:scale-105" />
              </div>
              <span className="font-bold text-xl">
                <span className="text-gray-800 dark:text-gray-200">VirtualHekim</span>
                <span className="text-indigo-600 dark:text-indigo-400">.az</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full p-1 shadow-sm">
                    <NavLink to="/" label={t("navbar.dashboard")} icon={<HomeIcon className="w-4 h-4" />} active={location.pathname === '/'} />
                    <NavLink to="/appointments" label={t("navbar.appointments")} icon={<CalendarIcon className="w-4 h-4" />} active={location.pathname === '/appointments'} />
                    <NavLink to="/profile" label={t("navbar.profile")} icon={<UserIcon className="w-4 h-4" />} active={location.pathname === '/profile'} />
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                    <LanguageSwitcher />
                    <DarkModeToggle />
                    <button 
                      onClick={handleLogout}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {t("navbar.logout")}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-6">
                  <LanguageSwitcher />
                  <DarkModeToggle />
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
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden relative p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open menu</span>
              {menuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden fixed top-[72px] left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
            menuOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <nav className="px-4 pt-2 pb-4 space-y-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg">
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/" label={t("navbar.dashboard")} icon={<HomeIcon className="w-5 h-5" />} onClick={toggleMenu} active={location.pathname === '/'} />
                <MobileNavLink to="/appointments" label={t("navbar.appointments")} icon={<CalendarIcon className="w-5 h-5" />} onClick={toggleMenu} active={location.pathname === '/appointments'} />
                <MobileNavLink to="/profile" label={t("navbar.profile")} icon={<UserIcon className="w-5 h-5" />} onClick={toggleMenu} active={location.pathname === '/profile'} />
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                  <LanguageSwitcher />
                  <div className="flex items-center space-x-4">
                    <DarkModeToggle />
                    <button 
                      onClick={() => { handleLogout(); toggleMenu(); }}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {t("navbar.logout")}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {t("navbar.login")}
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMenu}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors text-center"
                  >
                    {t("navbar.register")}
                  </Link>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <LanguageSwitcher />
                  <DarkModeToggle />
                </div>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

// Desktop Nav Link Component
function NavLink({ to, label, icon, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
        active 
          ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 shadow-sm' 
          : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-gray-800/80'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Link>
  );
}

// Mobile Nav Link Component
function MobileNavLink({ to, label, icon, onClick, active }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
        active 
          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50' 
          : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Link>
  );
}
