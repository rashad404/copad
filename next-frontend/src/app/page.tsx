import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import HomePage from "@/components/home/HomePage";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-home",
});

export const metadata: Metadata = {
  title: { absolute: "azdoc - Sağlamlıq sualları və ailə qeydləri" },
  description:
    "Analiz cavabları və sağlamlığınızla bağlı suallar verin. Ailənizin sağlamlıq qeydlərini saxlayın, dərman qiymətlərini müqayisə edin.",
  openGraph: {
    title: "azdoc - Sağlamlıq sualları və ailə qeydləri",
    description:
      "Sağlamlıqla bağlı suallarınıza Azərbaycan dilində cavab alın.",
    locale: "az_AZ",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "azdoc - Sağlamlıq sualları və ailə qeydləri",
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
