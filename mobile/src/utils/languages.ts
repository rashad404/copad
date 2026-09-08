export const SUPPORTED_LANGUAGES = ["az", "en", "ru"] as const;
export type SiteLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export function supportedLanguage(
  value?: string | null,
): SiteLanguage | undefined {
  const code = value?.toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(code as SiteLanguage)
    ? (code as SiteLanguage)
    : undefined;
}
/**
 * Where a visitor lands when their browser asks for a language we do not have.
 *
 * The browser's own preference is honoured first, so someone with a Russian or
 * English device already gets Russian or English wherever they are. This is only
 * the residual: a browser set to Turkish, Farsi, Arabic or French, where we have
 * to guess.
 *
 * Azerbaijani, because this is an Azerbaijani service. The blog and the drug
 * catalogue are written in it, the prices are in manat, and someone arriving
 * with no recognisable preference is more likely to be in Azerbaijan than
 * anywhere else. Defaulting to English served the residual visitor a foreign
 * language in a country where the product is local.
 */
export const DEFAULT_SITE_LANGUAGE: SiteLanguage = "az";
