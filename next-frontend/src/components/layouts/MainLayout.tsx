import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import Header from './Header';
import Footer from './Footer';

const inter = Inter({ subsets: ['latin'] });

interface MainLayoutProps {
  children: ReactNode;
  hideHeaderOnMobile?: boolean;
  externalSidebarOpen?: boolean;
  onSidebarClose?: () => void;
}

export default function MainLayout({ 
  children, 
  hideHeaderOnMobile = false,
  externalSidebarOpen,
  onSidebarClose 
}: MainLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 ${inter.className}`}>
      {/* Always render Header but hide visually on mobile when needed */}
      <Header 
        externalSidebarOpen={externalSidebarOpen}
        onSidebarClose={onSidebarClose}
        className={hideHeaderOnMobile ? 'hidden md:block' : ''}
      />
      <main className={`flex-grow ${hideHeaderOnMobile ? 'pt-0 md:pt-16' : 'pt-16'}`}>
        {children}
      </main>
      <footer className="hidden md:block">
        <Footer />
      </footer>
    </div>
  );
} 