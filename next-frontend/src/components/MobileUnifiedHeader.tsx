'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bars3Icon, ListBulletIcon } from '@heroicons/react/24/outline';

interface MobileUnifiedHeaderProps {
  chatTitle: string;
  onChatMenuClick: () => void;
  onMainMenuClick: () => void;
  isChatSidebarOpen: boolean;
}

const MobileUnifiedHeader: React.FC<MobileUnifiedHeaderProps> = ({ 
  chatTitle, 
  onChatMenuClick,
  onMainMenuClick,
  isChatSidebarOpen 
}) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only show unified header on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-11">
      <div className="flex items-center justify-between px-4 py-2 h-full">
        {/* Chat sidebar button - now on the left */}
        <button
          onClick={onChatMenuClick}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title={t('chat.openSidebar')}
        >
          <ListBulletIcon className="w-6 h-6" />
        </button>

        {/* Chat title */}
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate flex-1 mx-2 text-center flex items-center justify-center">
          {chatTitle}
        </h1>

        {/* Main menu button - now on the right */}
        <button
          onClick={onMainMenuClick}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title={t('header.menu')}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MobileUnifiedHeader;