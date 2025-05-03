import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import Header from './Header';
import Footer from './Footer';

const inter = Inter({ subsets: ['latin'] });

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${inter.className}`}>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="hidden md:block">
        <Footer />
      </footer>
    </div>
  );
} 