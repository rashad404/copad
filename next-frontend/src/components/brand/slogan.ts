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

/**
 * The browser tab title, in the language the page is being read in.
 *
 * DEFAULT_BRAND_TITLE is fixed to Azerbaijani, which is right as a fallback and
 * wrong as the answer: somebody reading the site in English saw a tab that said
 * "Sizin virtual həkiminiz".
 */
export function brandTitle(language?: string) {
  return `azdoc - ${brandSlogan(language).replace(/\.$/, "")}`;
}
