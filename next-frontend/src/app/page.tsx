// src/app/page.tsx
import { Metadata } from 'next';
import MainLayout from '@/components/layouts/MainLayout';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import GuestChat from '@/components/GuestChat';
import PublicRoute from '@/components/PublicRoute';
import { siteConfig } from '@/context/siteConfig';
import { headers } from 'next/headers'; // Import headers

// Get site info for proper branding
const siteInfo = siteConfig.getDefaultSiteInfo();
const AGENT_NAME = siteInfo.AGENT_NAME;

export const metadata: Metadata = {
  title: `${AGENT_NAME} - Your AI Healthcare Assistant`,
  description: 'Get instant medical advice and support from our AI-powered healthcare assistant.',
};

export default function Home() {
  // Access headers to log the incoming path
  const headerList = headers();
  const path = headerList.get('x-invoke-path') || 'N/A'; // Get the path Next.js sees
  const host = headerList.get('host') || 'N/A';
  const referer = headerList.get('referer') || 'N/A'; // Useful to see where the request came from

  console.log(`[Next.js Request Debug] Host: ${host}, Path: ${path}, Referer: ${referer}`);

  return (
    <PublicRoute>
      <MainLayout>
        <div className="flex-1 relative overflow-hidden">
          <div className='fixed inset-0 top-[64px] md:static mx-auto md:my-4 lg:px-0 w-full md:h-[calc(100vh-180px)]'>
            <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm  h-full flex flex-col">
              <GuestChat
                containerClassName="flex flex-col h-full"
                messagesClassName="flex-1 overflow-y-auto px-3 py-3 space-y-3 sm:px-4 sm:py-4 sm:space-y-4"
                inputClassName="px-3 py-2 border-t border-gray-100 dark:border-gray-700 sm:px-4 sm:py-3"
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