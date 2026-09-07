import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import HomePage from "@/components/home/HomePage";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-home",
});

export const metadata: Metadata = {
  title: "azdoc - Sağlamlıq sualları və ailə qeydləri",
  description:
    "Analizlər, dərmanlar və sağlamlığınız haqqında suallarınıza Azərbaycan dilində cavab alın. Ailənizin sağlamlıq qeydlərini saxlayın.",
  openGraph: {
    title: "azdoc - Sağlamlıq sualları və ailə qeydləri",
    description: "Sağlamlıq sualları və ailə qeydləri.",
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
