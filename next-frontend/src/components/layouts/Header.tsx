'use client';

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
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
import LanguageSwitcher from '../LanguageSwitcher';
import DarkModeToggle from '../DarkModeToggle';
import Logo from '../Logo';
// TODO: Replace with your Next.js AuthContext or next-auth
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/api';
import { useSiteContext } from '@/context/SiteContext';

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

interface HeaderProps {
  initialSidebarOpen?: boolean;
  externalSidebarOpen?: boolean;
  onSidebarClose?: () => void;
  className?: string;
}

export default function Header({ 
  initialSidebarOpen = false,
  externalSidebarOpen,
  onSidebarClose,
  className = ''
}: HeaderProps = {}) {
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, logout: contextLogout } = useAuth();
  const [hasToken, setHasToken] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialSidebarOpen);
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { WEBSITE_NAME, WEBSITE_TLD } = useSiteContext();
  const isClient = useIsClient();
  
  // Check for token in localStorage to determine auth state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initial check
      const token = localStorage.getItem('token');
      setHasToken(!!token);
      
      // Listen for storage events (when token is added or removed)
      const handleStorageChange = () => {
        const currentToken = localStorage.getItem('token');
        setHasToken(!!currentToken);
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);
  
  // Update when auth state changes or route changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setHasToken(!!token);
    }
  }, [pathname, isAuthenticated]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle external sidebar control - only on mobile
  useEffect(() => {
    if (isMobile && externalSidebarOpen !== undefined && externalSidebarOpen !== isSidebarOpen) {
      setIsSidebarOpen(externalSidebarOpen);
    }
  }, [externalSidebarOpen, isSidebarOpen, isMobile]);

  const handleLogout = () => {
    // Use direct DOM manipulation and location change to prevent React from re-rendering
    
    // Create and append an invisible overlay to prevent clicks during navigation
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'transparent';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);
    
    // Clear tokens now - before the navigation happens
    localStorage.removeItem('token');
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
    
    // Navigate directly to login page - this won't give React a chance to re-render
    window.location.replace('/login');
    
    // Try to call the API in the background
    contextLogout().catch(() => {});
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    // Only notify parent on mobile
    if (isMobile && onSidebarClose) {
      onSidebarClose();
    }
  };

  const isUserAuthenticated = isAuthenticated || hasToken;

  const menuItems = isUserAuthenticated
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
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg ${className}`}>
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
          <Link href="/" className="hidden md:flex items-center space-x-2">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-bold">
              {isClient ? WEBSITE_NAME : ''}<span className="text-indigo-400">{isClient ? WEBSITE_TLD : ''}</span>
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>
          {!isUserAuthenticated && !isMobile && (
            <>
              <Link href="/login" className="text-sm hover:text-indigo-400">
                {t('navbar.login')}
              </Link>
              <Link href="/register" className="px-3 py-1 bg-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
                {t('navbar.register')}
              </Link>
            </>
          )}
        </div>
      </div>
      </header>

      {/* Backdrop overlay - always render regardless of header visibility */}
      {isSidebarOpen && (
        <div
          className={`fixed inset-0 bg-gray-600/10 dark:bg-gray-900/10 backdrop-blur-sm z-[60] transition-opacity ${!className.includes('hidden') ? 'top-16' : 'top-11'}`}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar - always render regardless of header visibility */}
      <aside
        className={`fixed left-0 z-[70] w-64 bg-gray-800 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${!className.includes('hidden') ? 'top-16 h-[calc(100vh-64px)]' : 'top-11 h-[calc(100vh-44px)]'}`}
      >
        <nav className="flex flex-col space-y-2 p-4">
          {/* Logo, Language Switcher, and Dark Mode - Mobile Only */}
          {isMobile && (
            <div className="mb-6 pb-6 border-b border-gray-700">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 mb-4" onClick={closeSidebar}>
                <Logo className="w-8 h-8" />
                <span className="text-xl font-bold text-white">
                  {isClient ? WEBSITE_NAME : ''}<span className="text-indigo-400">{isClient ? WEBSITE_TLD : ''}</span>
                </span>
              </Link>
              
              {/* Language Switcher and Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="scale-90 origin-left">
                  <LanguageSwitcher />
                </div>
                <DarkModeToggle />
              </div>
            </div>
          )}
          
          {menuItems.map(({ path, icon: Icon, label }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                onClick={() => isMobile && closeSidebar()}
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
          {!isUserAuthenticated && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <Link
                href="/login"
                onClick={() => isMobile && closeSidebar()}
                className="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-700 transition"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                {t('navbar.login')}
              </Link>
              <Link
                href="/register"
                onClick={() => isMobile && closeSidebar()}
                className="flex items-center p-2 mt-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <UserPlusIcon className="w-5 h-5 mr-3" />
                {t('navbar.register')}
              </Link>
            </div>
          )}
          {isUserAuthenticated && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => {
                  // Navigate to the logout page instead of handling logout here
                  // This prevents any state changes in the current page
                  window.location.href = '/logout';
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
    </>
  );
} 