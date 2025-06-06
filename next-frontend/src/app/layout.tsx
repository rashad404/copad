// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { siteConfig } from "@/context/siteConfig";
import { headers } from 'next/headers'; // Import headers

const inter = Inter({ subsets: ["latin"] });

const siteInfo = siteConfig.getDefaultSiteInfo();
const AGENT_NAME = siteInfo.AGENT_NAME;

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://yourlivedomain.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: `%s | ${AGENT_NAME}`,
    default: `${AGENT_NAME} - AI-Powered Healthcare Assistant`
  },
  description: `${AGENT_NAME} is your AI-powered healthcare assistant, providing medical consultations, appointment scheduling, and health information.`,
  keywords: ['healthcare', 'medical', 'doctor', 'telemedicine', 'AI', 'health assistant'],
  authors: [{ name: `${AGENT_NAME} Team` }],
  creator: AGENT_NAME,
  publisher: AGENT_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: AGENT_NAME,
    title: `${AGENT_NAME} - AI-Powered Healthcare Assistant`,
    description: `${AGENT_NAME} is your AI-powered healthcare assistant, providing medical consultations, appointment scheduling, and health information.`,
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: AGENT_NAME
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${AGENT_NAME} - AI-Powered Healthcare Assistant`,
    description: `${AGENT_NAME} is your AI-powered healthcare assistant, providing medical consultations, appointment scheduling, and health information.`,
    images: ['/images/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: BASE_URL
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    bing: 'bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Log request info from layout as well
  const headerList = headers();
  const path = headerList.get('x-invoke-path') || 'N/A';
  const host = headerList.get('host') || 'N/A';
  console.log(`[Next.js Layout Debug] Host: ${host}, Path: ${path}`);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}