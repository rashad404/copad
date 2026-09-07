import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import HomePage from "@/components/home/HomePage";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-home",
});

export const metadata: Metadata = {
  title: "azdoc - Sağlamlığınızın bütöv hekayəsi",
  description:
    "Sağlamlıq haqqında suallar verin, söhbətə sənədlər əlavə edin və məlumatlarınızı daha yaxşı anlayın.",
  openGraph: {
    title: "azdoc - Sağlamlığınızın bütöv hekayəsi",
    description: "Sağlamlıq haqqında daha aydın söhbət.",
    locale: "az_AZ",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "azdoc - Sağlamlığınızın bütöv hekayəsi",
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
