import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from "../context/AuthContext.jsx";
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import LanguageSwitcher from "../components/LanguageSwitcher";
import DarkModeToggle from "../components/DarkModeToggle";
import Logo from '../components/Logo';
import { getSiteInfo } from '../context/SiteContext';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { WEBSITE_NAME, WEBSITE_TLD } = getSiteInfo();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = isAuthenticated
    ? [
        { path: '/dashboard', icon: HomeIcon, label: t('navbar.dashboard') },
        { path: '/appointments', icon: CalendarIcon, label: t('navbar.appointments') },
        { path: '/profile', icon: UserIcon, label: t('navbar.profile') },
      ]
    : [
        { path: '/', icon: HomeIcon, label: t('navbar.home') },
        { path: '/about', icon: InformationCircleIcon, label: t('navbar.about') },
        { path: '/blog', icon: DocumentTextIcon, label: t('navbar.blog') },
        { path: '/faq', icon: QuestionMarkCircleIcon, label: t('navbar.faq') },
        { path: '/contact', icon: EnvelopeIcon, label: t('navbar.contact') },
      ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          {/* Left: Menu + Logo */}
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="focus:outline-none">
              {isSidebarOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-200" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-200" />
              )}
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold">
                {WEBSITE_NAME}<span className="text-indigo-400">{WEBSITE_TLD}</span>
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <DarkModeToggle />
            
            {!isAuthenticated && !isMobile && (
              <>
                <Link to="/login" className="text-sm hover:text-indigo-400">
                  {t('navbar.login')}
                </Link>
                <Link to="/register" className="px-3 py-1 bg-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
                  {t('navbar.register')}
                </Link>
              </>
            )}

          </div>

        </div>
      </header>

      {/* Sidebar and Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 z-40 w-64 bg-gray-800 h-[calc(100vh-64px)] transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >

          <nav className="flex flex-col space-y-2 p-4">
            {menuItems.map(({ path, icon: Icon, label }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                  className={`flex items-center p-2 rounded-lg transition ${
                    active
                      ? 'bg-indigo-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </Link>
              );
            })}
            
            {/* Add login and register buttons to mobile sidebar when not authenticated */}
            {!isAuthenticated && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <Link
                  to="/login"
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                  className="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-700 transition"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                  {t('navbar.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                  className="flex items-center p-2 mt-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  <UserPlusIcon className="w-5 h-5 mr-3" />
                  {t('navbar.register')}
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={() => {
                    handleLogout();
                    isMobile && setIsSidebarOpen(false);
                  }}
                  className="flex w-full items-center p-2 rounded-lg text-gray-300 hover:bg-gray-700 transition"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                  {t('navbar.logout')}
                </button>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            !isMobile ? (isSidebarOpen ? 'ml-64' : 'ml-0') : ''
          }`}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay on Mobile when Sidebar is open */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default MainLayout;