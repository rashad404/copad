import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Bars3Icon, XMarkIcon, HomeIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext.jsx"; // 👈 import context
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { WEBSITE_NAME } from "../config/constants";

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
            <img src="/logo.png" alt={WEBSITE_NAME} className="w-8 h-8 rounded-full object-cover border border-indigo-100" />
            <span>{WEBSITE_NAME}</span>
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
                  className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {t("navbar.login")}
                </Link>
                <Link
                  to="/register"
                  className="ml-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  {t("navbar.register")}
                </Link>
                <div className="ml-4">
                  <LanguageSwitcher />
                </div>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
            onClick={toggleMenu}
          >
            {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden py-4 border-t border-gray-100">
          <nav className="flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/" label={t("navbar.dashboard")} icon={<HomeIcon className="w-5 h-5" />} onClick={toggleMenu} />
                <MobileNavLink to="/appointments" label={t("navbar.appointments")} icon={<CalendarIcon className="w-5 h-5" />} onClick={toggleMenu} />
                <MobileNavLink to="/profile" label={t("navbar.profile")} icon={<UserIcon className="w-5 h-5" />} onClick={toggleMenu} />
                <div className="px-4 py-2">
                  <LanguageSwitcher />
                </div>
                <button 
                  onClick={() => { handleLogout(); toggleMenu(); }} 
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" label={t("navbar.login")} onClick={toggleMenu} />
                <MobileNavLink to="/register" label={t("navbar.register")} onClick={toggleMenu} />
                <div className="px-4 py-2">
                  <LanguageSwitcher />
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

// Desktop Nav Link Component
function NavLink({ to, label, icon }) {
  return (
    <Link
      to={to}
      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Link>
  );
}

// Mobile Nav Link Component
function MobileNavLink({ to, label, icon, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Link>
  );
}
