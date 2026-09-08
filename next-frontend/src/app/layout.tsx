import { DEFAULT_BRAND_TITLE } from "@/components/brand/slogan";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Analytics from "@/components/Analytics";
import { siteConfig } from "@/context/siteConfig";

const inter = Inter({ subsets: ["latin"] });

// Get the site info for metadata
const siteInfo = siteConfig.getDefaultSiteInfo();
const AGENT_NAME = siteInfo.AGENT_NAME;

// azdoc.ai is the primary domain. virtualhekim.az serves the same application
// and keeps working; this is only what we call ourselves to the outside world.
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://azdoc.ai";

export const metadata: Metadata = {
  // Without this, Next resolves image paths against localhost, so every shared
  // link carried an og:image of http://localhost:3002/images/og-image.jpg.
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${AGENT_NAME}`,
    default: DEFAULT_BRAND_TITLE
  },
  description: "Analizlər, dərmanlar və sağlamlığınız haqqında suallarınıza Azərbaycan dilində cavab alın. Ailənizin sağlamlıq qeydlərini saxlayın.",
  keywords: ['healthcare', 'medical', 'doctor', 'telemedicine', 'AI', 'health assistant'],
  authors: [{ name: `${AGENT_NAME} Team` }],
  creator: AGENT_NAME,
  publisher: AGENT_NAME,
  openGraph: {
    type: 'website',
    locale: 'az_AZ',
    url: SITE_URL,
    siteName: AGENT_NAME,
    title: DEFAULT_BRAND_TITLE,
    description: "Analizlər, dərmanlar və sağlamlığınız haqqında suallarınıza Azərbaycan dilində cavab alın. Ailənizin sağlamlıq qeydlərini saxlayın.",
    // No image until there is one to point at: /images/og-image.jpg has never
    // existed and returned 404, so every shared link advertised a preview that
    // could not load. A real 1200x630 image belongs here.
    images: []
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_BRAND_TITLE,
    description: "Analizlər, dərmanlar və sağlamlığınız haqqında suallarınıza Azərbaycan dilində cavab alın. Ailənizin sağlamlıq qeydlərini saxlayın.",
    images: []
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL
  },
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png', sizes: '1024x1024' },
    ],
    shortcut: '/logo.svg',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // Search-engine verification codes go here once they are issued.
    // Placeholders were removed: emitting fake verification meta tags is
    // worse than emitting none.
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
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
