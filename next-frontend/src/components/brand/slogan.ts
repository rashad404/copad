import { supportedLanguage } from "@/utils/languages";

export const SLOGANS = {
  az: "Sizin virtual həkiminiz.",
  en: "Your virtual doctor.",
  ru: "Ваш виртуальный врач.",
} as const;

export function brandSlogan(language?: string) {
  return SLOGANS[supportedLanguage(language) || "az"];
}

export const DEFAULT_BRAND_TITLE = `azdoc - ${SLOGANS.az.replace(/\.$/, "")}`;
