'use client';

import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import GuestChat from '@/components/GuestChat';
import MobileUnifiedHeader from '@/components/MobileUnifiedHeader';
import PublicRoute from '@/components/PublicRoute';
import { siteConfig } from '@/context/siteConfig';

// Get site info for proper branding
const siteInfo = siteConfig.getDefaultSiteInfo();
const AGENT_NAME = siteInfo.AGENT_NAME;

export default function Home() {
  const [chatTitle, setChatTitle] = useState('');
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);

  const handleTitleChange = (title: string) => {
    setChatTitle(title);
  };

  const handleChatMenuClick = () => {
    setIsChatSidebarOpen(true);
  };
  
  const handleSidebarClose = () => {
    setIsChatSidebarOpen(false);
  };
  
  const handleMainMenuClick = () => {
    setIsMainSidebarOpen(true);
  };
  
  const handleMainSidebarClose = () => {
    setIsMainSidebarOpen(false);
  };

  return (
    <PublicRoute>
      <MainLayout 
        hideHeaderOnMobile={true}
        externalSidebarOpen={isMainSidebarOpen}
        onSidebarClose={handleMainSidebarClose}
      >
        {/* Mobile Unified Header */}
        <MobileUnifiedHeader
          chatTitle={chatTitle}
          onChatMenuClick={handleChatMenuClick}
          onMainMenuClick={handleMainMenuClick}
          isChatSidebarOpen={isChatSidebarOpen}
        />
        
        <div className="flex-1 relative overflow-hidden">
          <div className='fixed inset-0 top-11 md:top-[64px] md:static mx-auto md:my-4 lg:px-0 w-full md:h-[calc(100vh-180px)]'>
            <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm  h-full flex flex-col">
              <GuestChat 
                containerClassName="flex flex-col h-full"
                messagesClassName="flex-1 overflow-y-auto px-3 py-3 space-y-3 sm:px-4 sm:py-4 sm:space-y-4"
                inputClassName="px-3 py-2 border-t border-gray-100 dark:border-gray-700 sm:px-4 sm:py-3"
                hideHeaderOnMobile={true}
                onTitleChange={handleTitleChange}
                externalSidebarOpen={isChatSidebarOpen}
                onSidebarClose={handleSidebarClose}
              />
            </div>
          </div>
        </div>
        {/* Hide the following sections on mobile, show on md+ */}
        <div className="hidden md:block">
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <CTASection />
        </div>
      </MainLayout>
    </PublicRoute>
  );
}
