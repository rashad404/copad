"use client";
import { useHydrated } from "@/utils/useHydrated";
import { useTranslation } from "react-i18next";
import { supportedLanguage } from "@/utils/languages";
import { medicineCopy } from "./copy";
export function useMedicineCopy() {
  const { i18n } = useTranslation();
  const hydrated = useHydrated();
  const language =
    (hydrated
      ? supportedLanguage(i18n.resolvedLanguage || i18n.language)
      : "en") || "az";
  return { language, copy: medicineCopy(language) };
}
