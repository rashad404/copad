import { getHomeCopy } from "@/components/home/copy";
import { supportedLanguage } from "@/utils/languages";
import { brandTitle, brandSlogan } from "@/components/brand/slogan";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import HomePage from "@/components/home/HomePage";

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-home",
});

export async function generateMetadata(): Promise<Metadata> {
  const language =
    supportedLanguage((await cookies()).get("i18nextLng")?.value) || "az";
  const TITLE = brandTitle(language);
  return {
    title: { absolute: TITLE },
    description: getHomeCopy(language).metadata,
    openGraph: {
      title: TITLE,
      description: brandSlogan(language),
      locale: { az: "az_AZ", en: "en_US", ru: "ru_RU" }[language],
      // Stated rather than inherited: a page that sets openGraph replaces the
      // parent's outright, so the front page was left with no canonical address.
      url: process.env.NEXT_PUBLIC_APP_URL || "https://azdoc.ai",
      images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      images: ["/images/og-image.jpg"],
    },
  };
}

export default async function IndexPage() {
  const language =
    supportedLanguage((await cookies()).get("i18nextLng")?.value) || "az";
  return (
    <div className={manrope.variable}>
      <HomePage initialLanguage={language} />
    </div>
  );
}
