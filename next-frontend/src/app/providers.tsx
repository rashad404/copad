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
    const lang =
      (typeof window !== 'undefined' && localStorage.getItem('i18nextLng')) ||
      (typeof navigator !== 'undefined' && navigator.language.split('-')[0]) ||
      'en';
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