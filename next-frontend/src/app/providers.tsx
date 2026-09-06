'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { AuthProvider } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import { ThemeProvider } from 'next-themes';
import { SiteContextProvider } from '@/context/SiteContext';
import { useTranslation } from 'react-i18next';

function LanguageSyncProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Detect language from localStorage, cookie, or browser
    const storedLang =
      typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null;
    const cookieLang =
      typeof document !== 'undefined'
        ? document.cookie.match(/(?:^|;\s*)i18nextLng=([^;]+)/)?.[1]
        : null;
    // Only these two count as the visitor actually picking a language.
    const chosenLang = storedLang || cookieLang;
    const lang =
      chosenLang ||
      (typeof navigator !== 'undefined' && navigator.language.split('-')[0]) ||
      'en';
    // Back-fill the cookie for visitors who chose a language before the switcher
    // started writing one, otherwise the server keeps rendering the default.
    // Only a real choice is persisted: writing a browser-derived guess here
    // would look like an explicit choice to the server and filter the blog down
    // to a language that has no posts.
    if (typeof document !== 'undefined' && storedLang && cookieLang !== storedLang) {
      document.cookie = `i18nextLng=${storedLang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang).then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [i18n]);

  if (!ready) return null;
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageSyncProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteContextProvider>
            <AuthProvider>
              <ChatProvider>
                {children}
              </ChatProvider>
            </AuthProvider>
          </SiteContextProvider>
        </ThemeProvider>
      </LanguageSyncProvider>
    </I18nextProvider>
  );
} 