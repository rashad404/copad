"use client";
import { useTranslation } from "react-i18next";
import { supportedLanguage } from "@/utils/languages";
import { useHydrated } from "@/utils/useHydrated";
import { useInitialLanguage } from "@/context/InitialLanguage";
import copy from "./copy.json";
export function usePrivacyCopy() {
  const { i18n } = useTranslation();
  const hydrated = useHydrated();
  // The server's language before hydration, so the first HTML is not English.
  const initialLanguage = useInitialLanguage();
  const language = hydrated
    ? supportedLanguage(i18n.resolvedLanguage || i18n.language) ||
      initialLanguage
    : initialLanguage;
  return { p: copy[language], language };
}
