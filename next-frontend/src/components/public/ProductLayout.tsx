"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Manrope } from "next/font/google";
import { Menu, X, ArrowUpRight, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
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
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const links = isAuthenticated
    ? [
        ["/dashboard", c("Overview", "İcmal")],
        ["/chat", c("Conversations", "Söhbətlər")],
        ["/profile", c("My profile", "Profilim")],
        ["/blog", c("Journal", "Bloq")],
      ]
    : [
        ["/chat", c("Ask AzDoc", "AzDoc-dan soruş")],
        ["/blog", c("Journal", "Bloq")],
        ["/about", c("About us", "Haqqımızda")],
        ["/faq", c("Questions", "Suallar")],
      ];
  return (
    <div
      className={`public-app ${manrope.variable} ${viewport ? "public-viewport" : ""}`}
    >
      <a className="public-skip" href="#page-content">
        {c("Skip to content", "Məzmuna keç")}
      </a>
      <header className="public-header">
        <Link href="/" className="public-brand" aria-label="AzDoc">
          <span>
            <Plus size={23} strokeWidth={3} />
          </span>
          azdoc<span className="public-brand-dot">.</span>
        </Link>
        <nav
          className="public-desktop-nav"
          aria-label={c("Main navigation", "Əsas naviqasiya")}
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                pathname === href || pathname.startsWith(href + "/")
                  ? "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="public-header-actions">
          <LanguageSwitcher />
          {!isAuthenticated && (
            <Link className="public-signin" href="/login">
              {c("Sign in", "Daxil ol")} <ArrowUpRight size={16} />
            </Link>
          )}
          <button
            className="public-menu-button"
            aria-expanded={menu}
            aria-controls="public-menu"
            aria-label={c("Navigation menu", "Naviqasiya menyusu")}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {menu && (
        <nav
          id="public-menu"
          className="public-mobile-nav"
          aria-label={c("Mobile navigation", "Mobil naviqasiya")}
        >
          {links.map(([href, label]) => (
            <Link href={href} key={href} onClick={() => setMenu(false)}>
              {label}
              <ArrowUpRight size={18} />
            </Link>
          ))}
          {isAuthenticated ? (
            <button onClick={() => void logout()}>
              {c("Sign out", "Çıxış")}
            </button>
          ) : (
            <Link href="/login">{c("Sign in", "Daxil ol")}</Link>
          )}
        </nav>
      )}
      <main id="page-content" className="public-main">
        {children}
      </main>
      {!viewport && (
        <footer className="public-footer">
          <div>
            <Link href="/" className="public-footer-brand">
              azdoc.
            </Link>
            <p>
              {c(
                "A little clarity. A better next step.",
                "Daha aydın məlumat. Daha düzgün növbəti addım.",
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
