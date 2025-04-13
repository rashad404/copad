import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Bars3Icon, XMarkIcon, HomeIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext.jsx"; // 👈 import context
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext); // 👈 use context
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    setIsAuthenticated(false); // 👈 update global auth state
    navigate("/login");
  };

  return (
    <header className={`bg-white sticky top-0 z-50 transition-all duration-200 ${
      scrolled ? 'shadow-md' : 'border-b border-gray-100'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-bold text-xl transition-colors hover:text-indigo-700">
            <img src="/logo.png" alt="Copad AI" className="w-8 h-8 rounded-full object-cover border border-indigo-100" />
            <span>Copad AI</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/" label={t("navbar.dashboard")} icon={<HomeIcon className="w-4 h-4" />} />
                <NavLink to="/appointments" label={t("navbar.appointments")} icon={<CalendarIcon className="w-4 h-4" />} />
                <NavLink to="/profile" label={t("navbar.profile")} icon={<UserIcon className="w-4 h-4" />} />
                <div className="ml-4">
                  <LanguageSwitcher />
                </div>
                <button 
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <>
                <div className="mr-4">
                  <LanguageSwitcher />
                </div>
                <Link to="/login" className="ml-4 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors">
                  {t("navbar.login")}
                </Link>
                <Link to="/register" className="ml-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
                  {t("navbar.register")}
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden rounded-md p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none"
            onClick={toggleMenu}
          >
            {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/" label={t("navbar.dashboard")} icon={<HomeIcon className="w-5 h-5" />} onClick={toggleMenu} />
                <MobileNavLink to="/appointments" label={t("navbar.appointments")} icon={<CalendarIcon className="w-5 h-5" />} onClick={toggleMenu} />
                <MobileNavLink to="/profile" label={t("navbar.profile")} icon={<UserIcon className="w-5 h-5" />} onClick={toggleMenu} />
                <div className="px-3 py-2">
                  <LanguageSwitcher />
                </div>
                <button 
                  onClick={() => { handleLogout(); toggleMenu(); }} 
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <>
                <div className="px-3 py-2">
                  <LanguageSwitcher />
                </div>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-md" onClick={toggleMenu}>
                  {t("navbar.login")}
                </Link>
                <Link to="/register" className="block px-3 py-2 mt-1 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md" onClick={toggleMenu}>
                  {t("navbar.register")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// Desktop Nav Link Component
function NavLink({ to, label, icon }) {
  return (
    <Link to={to} className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 flex items-center transition-colors">
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </Link>
  );
}

// Mobile Nav Link Component
function MobileNavLink({ to, label, icon, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Link>
  );
}
