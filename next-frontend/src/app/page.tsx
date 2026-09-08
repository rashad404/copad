import { DEFAULT_BRAND_TITLE, SLOGANS } from "@/components/brand/slogan";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import HomePage from "@/components/home/HomePage";

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-home",
});

export const metadata: Metadata = {
  title: { absolute: DEFAULT_BRAND_TITLE },
  description:
    "Analizlər, dərmanlar və sağlamlığınız haqqında suallarınıza Azərbaycan dilində cavab alın. Ailənizin sağlamlıq qeydlərini saxlayın.",
  openGraph: {
    title: DEFAULT_BRAND_TITLE,
    description: SLOGANS.az,
    locale: "az_AZ",
    images: [],
  },
  twitter: {
    card: "summary",
    title: DEFAULT_BRAND_TITLE,
    images: [],
  },
};

export default function IndexPage() {
  return (
    <div className={manrope.variable}>
      <HomePage />
    </div>
  );
}
