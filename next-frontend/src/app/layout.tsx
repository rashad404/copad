import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Dr. CoPad',
    default: 'Dr. CoPad - AI-Powered Healthcare Assistant'
  },
  description: "Dr. CoPad is your AI-powered healthcare assistant, providing medical consultations, appointment scheduling, and health information.",
  keywords: ['healthcare', 'medical', 'doctor', 'telemedicine', 'AI', 'health assistant'],
  authors: [{ name: 'Dr. CoPad Team' }],
  creator: 'Dr. CoPad',
  publisher: 'Dr. CoPad',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://drcopad.com',
    siteName: 'Dr. CoPad',
    title: 'Dr. CoPad - AI-Powered Healthcare Assistant',
    description: 'Dr. CoPad is your AI-powered healthcare assistant, providing medical consultations, appointment scheduling, and health information.',
    images: [
      {
        url: '/images/og-image.jpg',  // Replace with your actual OpenGraph image
        width: 1200,
        height: 630,
        alt: 'Dr. CoPad'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. CoPad - AI-Powered Healthcare Assistant',
    description: 'Dr. CoPad is your AI-powered healthcare assistant, providing medical consultations, appointment scheduling, and health information.',
    images: ['/images/og-image.jpg']  // Replace with your actual Twitter card image
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // Add verification strings for search engines if you have them
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    bing: 'bing-verification-code',
    // Remove or replace with actual codes when you have them
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
