import { Metadata } from 'next';
import MainLayout from '@/components/layouts/MainLayout';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'Dr. Copad - Your AI Healthcare Assistant',
  description: 'Get instant medical advice and support from our AI-powered healthcare assistant.',
};

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </MainLayout>
  );
}
