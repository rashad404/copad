import { brandTitle } from "@/components/brand/slogan";
import { cookies } from "next/headers";
import { supportedLanguage } from "@/utils/languages";
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

export async function generateMetadata(): Promise<Metadata> {
  // The language is only knowable per request, so the title is built here
  // rather than held as a constant.
  const language = (await cookies()).get("i18nextLng")?.value;
  const TITLE = brandTitle(language);
  return {
    // Without this, Next resolves image paths against localhost, so every shared
    // link carried an og:image of http://localhost:3002/images/og-image.jpg.
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s | ${AGENT_NAME}`,
      default: TITLE,
    },
    description:
      "Analizlər, dərmanlar və sağlamlığınız haqqında suallarınıza Azərbaycan dilində cavab alın. Ailənizin sağlamlıq qeydlərini saxlayın.",
    keywords: [
      "healthcare",
      "medical",
      "doctor",
      "telemedicine",
      "AI",
      "health assistant",
    ],
    authors: [{ name: `${AGENT_NAME} Team` }],
    creator: AGENT_NAME,
    publisher: AGENT_NAME,
    openGraph: {
      type: "website",
      locale: "az_AZ",
      url: SITE_URL,
      siteName: AGENT_NAME,
      title: TITLE,
      description:
        "Analizlər, dərmanlar və sağlamlığınız haqqında suallarınıza Azərbaycan dilində cavab alın. Ailənizin sağlamlıq qeydlərini saxlayın.",
      images: [
        {
          url: "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: TITLE,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description:
        "Analizlər, dərmanlar və sağlamlığınız haqqında suallarınıza Azərbaycan dilində cavab alın. Ailənizin sağlamlıq qeydlərini saxlayın.",
      images: ["/images/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_APP_URL,
    },
    icons: {
      icon: [
        { url: "/logo.svg", type: "image/svg+xml" },
        { url: "/logo.png", type: "image/png", sizes: "1024x1024" },
      ],
      shortcut: "/logo.svg",
      apple: "/apple-touch-icon.png",
    },
    verification: {
      // Search-engine verification codes go here once they are issued.
      // Placeholders were removed: emitting fake verification meta tags is
      // worse than emitting none.
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Declared honestly: the document said lang="en" whatever it actually held,
  // which misleads screen readers and translation tools alike.
  const language =
    supportedLanguage((await cookies()).get("i18nextLng")?.value) || "az";
  return (
    <html lang={language} suppressHydrationWarning>
      <body className={inter.className}>
        <Analytics />
        <Providers initialLanguage={language}>{children}</Providers>
      </body>
    </html>
  );
}
