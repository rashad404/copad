import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  TagIcon,
  PlusCircleIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, setIsAuthenticated } = useAuth();
  
  // Check if user is admin
  const isAdmin = isAuthenticated && user?.roles?.includes('ADMIN');
  
  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const menuItems = [
    {
      name: t('admin.dashboard'),
      href: '/admin',
      icon: HomeIcon,
    },
    {
      name: t('admin.posts.title'),
      href: '/admin/posts',
      icon: DocumentTextIcon,
    },
    {
      name: t('admin.posts.create'),
      href: '/admin/posts/create',
      icon: PlusCircleIcon,
    },
    {
      name: t('admin.tags'),
      href: '/admin/tags',
      icon: TagIcon,
    },
    {
      name: t('admin.users'),
      href: '/admin/users',
      icon: UsersIcon,
    },
    {
      name: t('admin.settings'),
      href: '/admin/settings',
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden ${
          sidebarOpen ? 'visible' : 'invisible'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
            sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200'
          }`}
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transition transform ${
            sidebarOpen
              ? 'translate-x-0 ease-out duration-300'
              : '-translate-x-full ease-in duration-200'
          }`}
        >
          {/* Close button */}
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center px-4 py-5 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('admin.title')}</h1>
          </div>

          {/* Menu */}
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon
                    className="mr-4 h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeftOnRectangleIcon
                  className="mr-4 h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                />
                {t('admin.logout')}
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-5 border-b border-gray-200 dark:border-gray-700 pb-5">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('admin.title')}</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                  }}
                >
                  <item.icon
                    className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeftOnRectangleIcon
                  className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                />
                {t('admin.logout')}
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;