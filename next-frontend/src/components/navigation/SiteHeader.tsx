"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Manrope } from "next/font/google";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useSiteContext } from "@/context/SiteContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import translations from "./translations.json";
import styles from "./SiteHeader.module.css";

const manrope = Manrope({ subsets: ["latin", "latin-ext"], display: "swap" });
const dictionary: Record<string, Record<string, string>> = translations;

/** The same site navigation on the homepage, public pages, and account screens. */
export default function SiteHeader() {
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || "en").split(
    "-",
  )[0];
  const copy = (key: string) =>
    dictionary[language]?.[key] ?? dictionary.en?.[key] ?? key;
  const { WEBSITE_NAME } = useSiteContext();
  const brand =
    WEBSITE_NAME === "Localhost" ? "azdoc" : WEBSITE_NAME.toLowerCase();
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const accountRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    setOpen(false);
    if (accountRef.current) accountRef.current.open = false;
  }, [pathname]);
  const links = [
    ["/#how", "Necə işləyir"],
    ["/#family", "Ailəniz üçün"],
    ["/#questions", "Suallar"],
  ];
  const accountLinks = [
    ["/dashboard", "Hesabım"],
    ["/profile", "Profilim"],
  ];
  function close() {
    setOpen(false);
    if (accountRef.current) accountRef.current.open = false;
  }
  return (
    <header
      className={`${styles.header} ${manrope.className}`}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        if (open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
        if (accountRef.current?.open) {
          accountRef.current.open = false;
          accountRef.current.querySelector("summary")?.focus();
        }
      }}
    >
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.brand}
          aria-label={brand}
          onClick={close}
        >
          <Image src="/logo.svg" alt="" width={36} height={36} className={styles.brandMark} priority />
          {brand}
        </Link>
        <nav className={styles.desktopNav} aria-label={copy("Əsas naviqasiya")}>
          {links.map(([href, label]) => (
            <Link href={href} key={href}>
              {copy(label)}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <LanguageSwitcher />
          {isAuthenticated ? (
            <details ref={accountRef} className={styles.account}>
              <summary>
                {copy("Hesabım")}
                <ChevronDown size={14} />
              </summary>
              <nav aria-label={copy("Hesabım")}>
                {accountLinks.map(([href, label]) => (
                  <Link key={href} href={href} onClick={close}>
                    {copy(label)}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    close();
                    void logout();
                  }}
                >
                  {copy("Çıxış")}
                </button>
              </nav>
            </details>
          ) : (
            <Link href="/login" className={styles.login}>
              {copy("Daxil ol")}
            </Link>
          )}
          <Link href="/chat" className={styles.cta} onClick={close}>
            {copy("Sual ver")}
            <ArrowUpRight size={16} />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="site-mobile-navigation"
            aria-label={copy("Menyu")}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="site-mobile-navigation"
          className={styles.mobileNav}
          aria-label={copy("Əsas naviqasiya")}
        >
          {links.map(([href, label]) => (
            <Link href={href} key={href} onClick={close}>
              {copy(label)}
              <ArrowUpRight size={16} />
            </Link>
          ))}
          <div className={styles.mobileAccount}>
            {isAuthenticated ? (
              <>
                {accountLinks.map(([href, label]) => (
                  <Link key={href} href={href} onClick={close}>
                    {copy(label)}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    close();
                    void logout();
                  }}
                >
                  {copy("Çıxış")}
                </button>
              </>
            ) : (
              <Link href="/login" onClick={close}>
                {copy("Daxil ol")}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
