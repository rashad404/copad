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
  const language = (await cookies()).get("i18nextLng")?.value;
  const TITLE = brandTitle(language);
  return {
    title: { absolute: TITLE },
    description:
      "Analizlər, dərmanlar və sağlamlığınız haqqında suallarınıza Azərbaycan dilində cavab alın. Ailənizin sağlamlıq qeydlərini saxlayın.",
    openGraph: {
      title: TITLE,
      description: brandSlogan(language),
      locale: "az_AZ",
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

export default function IndexPage() {
  return (
    <div className={manrope.variable}>
      <HomePage />
    </div>
  );
}
