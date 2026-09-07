"use client";

import Link from "next/link";
import { Manrope } from "next/font/google";
import { useTranslation } from "react-i18next";
import SiteHeader from "@/components/navigation/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "@/components/brand/BrandLogo";
import "./public.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--public-font" });
export function usePublicCopy() {
  const { i18n } = useTranslation();
  const az = (i18n.resolvedLanguage || i18n.language || "en").startsWith("az");
  return (en: string, azerbaijani: string) => (az ? azerbaijani : en);
}

export default function ProductLayout({
  children,
  viewport = false,
}: {
  children: React.ReactNode;
  viewport?: boolean;
}) {
  const c = usePublicCopy();
  const { isAuthenticated, logout } = useAuth();
  return (
    <div
      className={`public-app ${manrope.variable} ${viewport ? "public-viewport" : ""}`}
    >
      <a className="public-skip" href="#page-content">
        {c("Skip to content", "Məzmuna keç")}
      </a>
      <SiteHeader />
      <main id="page-content" className="public-main">
        {children}
      </main>
      {!viewport && (
        <footer className="public-footer">
          <div>
            <BrandLogo />
            <p>
              {c(
                "A little clarity. A better next step.",
                "Sağlamlıq sualları və ailə qeydləri.",
              )}
            </p>
          </div>
          <nav aria-label={c("Footer", "Alt naviqasiya")}>
            {[
              ["/contact", c("Contact", "Əlaqə")],
              ["/security", c("Security", "Təhlükəsizlik")],
              ["/privacy-policy", c("Privacy", "Məxfilik")],
              ["/terms-of-service", c("Terms", "Şərtlər")],
            ].map(([href, label]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
            {isAuthenticated && (
              <button onClick={() => void logout()}>
                {c("Sign out", "Çıxış")}
              </button>
            )}
          </nav>
        </footer>
      )}
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="public-intro">
      {eyebrow && <p className="public-eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {description && <p className="public-lead">{description}</p>}
    </header>
  );
}
