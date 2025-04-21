import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
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
      path: '/profile',
      icon: UserIcon,
      label: t('navbar.profile')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <div 
          className={`fixed left-0 top-[72px] h-[calc(100vh-72px)] bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
          } md:translate-x-0 z-30`}
        >
          <div className="flex flex-col h-full">
            {/* Close button - mobile only */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
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
            isSidebarOpen ? 'md:ml-64' : ''
          }`}
        >
          {/* Mobile toggle button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`md:hidden fixed bottom-6 right-6 z-30 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors ${
              isSidebarOpen ? 'hidden' : 'block'
            }`}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* Page Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </div>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MainLayout; 