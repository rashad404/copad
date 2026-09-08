"use client";

import { useHydrated } from "@/utils/useHydrated";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";
import { usePathname } from "next/navigation";
import { Manrope } from "next/font/google";
import { Menu, X, ArrowUpRight, ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useDoctorListing } from "@/components/booking/useDoctorListing";
import translations from "./translations.json";
import styles from "./SiteHeader.module.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});
const dictionary: Record<string, Record<string, string>> = translations;

/** The same site navigation on the homepage, public pages, and account screens. */
export default function SiteHeader() {
  const { i18n } = useTranslation();
  const hydrated = useHydrated();
  const language = (
    hydrated ? i18n.resolvedLanguage || i18n.language || "en" : "en"
  ).split("-")[0];
  const copy = (key: string) =>
    dictionary[language]?.[key] ?? dictionary.en?.[key] ?? key;
  const { isAuthenticated, logout, user } = useAuth();
  const hasDoctorListing = useDoctorListing(user?.id);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const accountRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    setOpen(false);
    if (accountRef.current) accountRef.current.open = false;
  }, [pathname]);
  // The account menu is a details element, which stays open until something
  // closes it. The mobile menu and the language picker both close on an outside
  // click; this one did not, and was left hanging over the page.
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const account = accountRef.current;
      if (!account?.open) return;
      if (event.target instanceof Node && account.contains(event.target)) return;
      account.open = false;
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const header = headerRef.current;
    if (!header) return;
    const desktop = window.matchMedia("(min-width: 1001px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onResize);
    onResize();

    // Keep the page still and unavailable to keyboard/screen-reader navigation.
    // Walk the wrappers so this also works on the homepage and auth layouts.
    const backgrounds: { element: HTMLElement; inert: boolean }[] = [];
    let current: HTMLElement = header;
    while (current.parentElement) {
      for (const sibling of Array.from(current.parentElement.children)) {
        if (
          sibling !== current &&
          sibling instanceof HTMLElement &&
          !["SCRIPT", "STYLE", "LINK"].includes(sibling.tagName)
        ) {
          backgrounds.push({ element: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
      if (current.parentElement === document.body) break;
      current = current.parentElement;
    }
    const htmlOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      desktop.removeEventListener("change", onResize);
      document.documentElement.style.overflow = htmlOverflow;
      backgrounds.forEach(({ element, inert }) => {
        element.inert = inert;
      });
    };
  }, [open]);
  const signedIn = hydrated && isAuthenticated;
  const mobileLinks = [
    ["/chat", "Söhbət"],
    ...(signedIn
      ? [
          ["/health-record", "Sağlamlıq qeydləri"],
          ["/randevularim", "Randevularım"],
          ["/analizlerim", "Analiz sifarişlərim"],
        ]
      : []),
    ["/hekimler", "Həkimlər"],
    ["/laboratoriyalar", "Laboratoriyalar"],
    ["/dermanlar", "Dərmanlar"],
  ];
  const mobileAccountLinks = signedIn
    ? [
        ["/dashboard", "Hesabım"],
        ["/profile", "Profilim"],
        ["/profile/privacy", "Məxfilik və razılıqlar"],
        ...(hasDoctorListing ? [["/hekim-panel", "Həkim paneli"]] : []),
      ]
    : [
        ["/login", "Daxil ol"],
        ["/register", "Qeydiyyat"],
      ];
  const active = (href: string) =>
    pathname === href ||
    (href !== "/profile" && pathname.startsWith(`${href}/`));
  const links = [
    ["/dermanlar", "Dərmanlar"],
    ["/hekimler", "Həkimlər"],
    // The third public directory, beside the doctors and the medicines. It was
    // reachable only from the account menu, which is the wrong place for
    // something anybody can browse without signing in.
    ["/laboratoriyalar", "Laboratoriyalar"],
    ["/#how", "Necə işləyir"],
    ["/#family", "Ailəniz üçün"],
    ["/#questions", "Suallar"],
  ];
  const accountLinks = [
    ["/health-record", "Sağlamlıq qeydləri"],
    ["/randevularim", "Randevularım"],
    ["/analizlerim", "Analiz sifarişlərim"],
    // Only for accounts that have a listing. Almost nobody is a doctor, and a
    // "Doctor panel" link with nothing behind it just makes a patient wonder
    // what they are.
    ...(hasDoctorListing ? [["/hekim-panel", "Həkim paneli"]] : []),
    ["/dashboard", "Hesabım"],
    ["/profile", "Profilim"],
    ["/profile/privacy", "Məxfilik və razılıqlar"],
  ];
  function close() {
    setOpen(false);
    if (accountRef.current) accountRef.current.open = false;
  }
  return (
    <header
      ref={headerRef}
      role={open ? "dialog" : undefined}
      aria-modal={open || undefined}
      aria-label={open ? copy("Menyu") : undefined}
      className={`${styles.header} ${manrope.className}`}
      onKeyDown={(event) => {
        if (open && event.key === "Tab" && !event.defaultPrevented) {
          const items = Array.from(
            headerRef.current?.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]):not([tabindex="-1"]), input, select, [tabindex]:not([tabindex="-1"])',
            ) || [],
          ).filter((element) => element.getClientRects().length > 0);
          const first = items[0];
          const last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            const panel = document.getElementById("site-mobile-navigation");
            if (panel) panel.scrollTop = panel.scrollHeight;
            last?.focus({ preventScroll: true });
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus({ preventScroll: true });
          }
        }
        if (event.key !== "Escape" || event.defaultPrevented) return;
        if (open) {
          setOpen(false);
          toggleRef.current?.focus({ preventScroll: true });
        }
        if (accountRef.current?.open) {
          accountRef.current.open = false;
          accountRef.current.querySelector("summary")?.focus();
        }
      }}
    >
      <div className={styles.inner}>
        <BrandLogo onClick={close} priority />
        <nav className={styles.desktopNav} aria-label={copy("Əsas naviqasiya")}>
          {links.map(([href, label]) => (
            <Link href={href} key={href}>
              {copy(label)}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <span className={styles.desktopLanguage}>
            <LanguageSwitcher />
          </span>
          {hydrated && isAuthenticated ? (
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
            aria-label={copy(open ? "Menyunu bağla" : "Menyu")}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {open && (
        <>
          <button
            type="button"
            className={styles.backdrop}
            tabIndex={-1}
            aria-label={copy("Menyunu bağla")}
            onClick={() => {
              close();
              toggleRef.current?.focus({ preventScroll: true });
            }}
          />
          <nav
            id="site-mobile-navigation"
            className={styles.mobileNav}
            aria-label={copy("Əsas naviqasiya")}
          >
            <div className={styles.mobileGroup}>
              {mobileLinks.map(([href, label]) => (
                <Link
                  href={href}
                  key={href}
                  onClick={close}
                  aria-current={active(href) ? "page" : undefined}
                >
                  {copy(label)}
                  <ChevronRight size={18} aria-hidden="true" />
                </Link>
              ))}
            </div>
            <div className={styles.mobileGroup}>
              {mobileAccountLinks.map(([href, label]) => (
                <Link
                  href={href}
                  key={href}
                  onClick={close}
                  aria-current={active(href) ? "page" : undefined}
                >
                  {copy(label)}
                  <ChevronRight size={18} aria-hidden="true" />
                </Link>
              ))}
            </div>
            <div className={styles.mobileLanguage}>
              <span>{copy("Dil")}</span>
              <LanguageSwitcher />
            </div>
            {signedIn && (
              <div className={styles.mobileGroup}>
                <button
                  onClick={() => {
                    close();
                    void logout();
                  }}
                >
                  {copy("Çıxış")}
                </button>
              </div>
            )}
          </nav>
        </>
      )}
    </header>
  );
}
