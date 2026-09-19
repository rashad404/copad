"use client";

import { ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { supportedLanguage, DEFAULT_SITE_LANGUAGE } from "@/utils/languages";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";
import { SiteContextProvider } from "@/context/SiteContext";
import {
  InitialLanguageProvider,
  useInitialLanguage,
} from "@/context/InitialLanguage";
import { useTranslation } from "react-i18next";

function LanguageSyncProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const initialLanguage = useInitialLanguage();
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  // Keep the homepage and public catalogues in initial HTML for indexing.
  const doctorDirectory =
    pathname === "/hekimler" || pathname.startsWith("/hekimler/");
  const laboratoryDirectory =
    pathname === "/laboratoriyalar" || pathname.startsWith("/laboratoriyalar/");
  const catalogue =
    pathname === "/" ||
    pathname === "/dermanlar" ||
    pathname.startsWith("/dermanlar/") ||
    doctorDirectory ||
    laboratoryDirectory;

  useEffect(() => {
    // Detect language from localStorage, cookie, or browser
    const storedLang =
      typeof window !== "undefined" ? localStorage.getItem("i18nextLng") : null;
    const cookieLang =
      typeof document !== "undefined"
        ? document.cookie.match(/(?:^|;\s*)i18nextLng=([^;]+)/)?.[1]
        : null;
    // Only these two count as the visitor actually picking a language.
    const chosenLang =
      supportedLanguage(storedLang) || supportedLanguage(cookieLang);
    // Not the phone's language: somebody in Baku with an English phone still
    // expects Azerbaijani. The server has already decided from where the
    // visitor is, and the page was rendered in that; agreeing with it is what
    // keeps the first HTML and the live page the same.
    const lang = chosenLang || initialLanguage;
    // Retired choices must not keep driving a different server-side locale.
    if (
      (storedLang && !supportedLanguage(storedLang)) ||
      (cookieLang && !supportedLanguage(cookieLang))
    ) {
      localStorage.setItem("i18nextLng", lang);
      document.cookie = `i18nextLng=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
    // Back-fill the cookie for visitors who chose a language before the switcher
    // started writing one, otherwise the server keeps rendering the default.
    // Only a real choice is persisted: writing a browser-derived guess here
    // would look like an explicit choice to the server and filter the blog down
    // to a language that has no posts.
    if (
      typeof document !== "undefined" &&
      supportedLanguage(storedLang) &&
      cookieLang !== supportedLanguage(storedLang)
    ) {
      document.cookie = `i18nextLng=${supportedLanguage(storedLang)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang).then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [i18n, initialLanguage]);

  useEffect(() => {
    document.documentElement.lang =
      supportedLanguage(i18n.resolvedLanguage || i18n.language) ||
      DEFAULT_SITE_LANGUAGE;
  }, [i18n, i18n.language, ready]);

  if (!ready && !catalogue) return null;
  return <>{children}</>;
}

export function Providers({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: string;
}) {
  // One instance per render tree, already in the server's language. The shared
  // module instance starts in Azerbaijani, and on the server it is shared by
  // every request at once, so switching it per visitor would race; a clone
  // shares the loaded translations and keeps its own language.
  const [instance] = useState(() =>
    i18n.cloneInstance({
      lng: supportedLanguage(initialLanguage) || DEFAULT_SITE_LANGUAGE,
    }),
  );
  return (
    <InitialLanguageProvider value={initialLanguage}>
    <I18nextProvider i18n={instance}>
      <LanguageSyncProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteContextProvider>
            <AuthProvider>{children}</AuthProvider>
          </SiteContextProvider>
        </ThemeProvider>
      </LanguageSyncProvider>
    </I18nextProvider>
    </InitialLanguageProvider>
  );
}
