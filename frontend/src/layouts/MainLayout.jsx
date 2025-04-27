// Modified MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const menuItems = [
    {
      path: '/dashboard',
      icon: HomeIcon,
      label: t('navbar.dashboard')
    },
    {
      path: '/appointments',
      icon: CalendarIcon,
      label: t('navbar.appointments')
    },
    {
      path: '/chat',
      icon: ChatBubbleLeftRightIcon,
      label: t('navbar.chat')
    },
    {
      path: '/blog',
      icon: DocumentTextIcon,
      label: t('navbar.blog')
    },
    {
      path: '/profile',
      icon: UserIcon,
      label: t('navbar.profile')
    }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Pass the sidebar state and toggle function to Navbar */}
      <Navbar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        isMobile={isMobile}
      />
      
      <div className="flex">
        {/* Sidebar - fixed on desktop, overlay on mobile */}
        <div 
          className={`fixed left-0 top-[72px] h-[calc(100vh-72px)] bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
          } z-30`}
        >
          <div className="flex flex-col h-full">
            {/* Close button - only visible on mobile */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => isMobile && toggleSidebar()}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div 
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen && !isMobile ? 'md:ml-64' : ''
          }`}
        >
          {/* Sidebar toggle button for desktop (when sidebar is closed) */}
          {!isSidebarOpen && !isMobile && (
            <button
              onClick={toggleSidebar}
              className="fixed bottom-6 right-6 z-30 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
              aria-label={t('navbar.openSidebar') || 'Open sidebar'}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          )}

          {/* Page Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </div>

        {/* Mobile overlay */}
        {isSidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  );
};

export default MainLayout;