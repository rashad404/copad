"use client";

import { createContext, useContext, type ReactNode } from "react";
import { supportedLanguage, DEFAULT_SITE_LANGUAGE } from "@/utils/languages";

/**
 * The language the server already knew about, from the request cookie.
 *
 * Chrome that depends on the language had to render English on the server,
 * because a client component cannot read the cookie and guessing would break
 * hydration. The server can read it, so it passes it down: an Azerbaijani
 * reader gets an Azerbaijani header in the first HTML rather than a flash of
 * English, and so does a crawler. It is the same value the client resolves a
 * moment later, so the two agree.
 *
 * Kept in its own module, free of i18n: importing it from the providers pulled
 * the whole i18next setup into anything that needed only this one string.
 */
const InitialLanguage = createContext<string>(DEFAULT_SITE_LANGUAGE);

export const useInitialLanguage = () => useContext(InitialLanguage);

export function InitialLanguageProvider({
  value,
  children,
}: {
  value?: string;
  children: ReactNode;
}) {
  return (
    <InitialLanguage.Provider
      value={supportedLanguage(value) || DEFAULT_SITE_LANGUAGE}
    >
      {children}
    </InitialLanguage.Provider>
  );
}
