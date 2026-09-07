"use client";
import { useTranslation } from "react-i18next";
import { supportedLanguage } from "@/utils/languages";
import { useHydrated } from "@/utils/useHydrated";
import copy from "./copy.json";
export function usePrivacyCopy() {
  const { i18n } = useTranslation();
  const hydrated = useHydrated();
  const language = hydrated
    ? supportedLanguage(i18n.resolvedLanguage || i18n.language) || "az"
    : "en";
  return { p: copy[language], language };
}
