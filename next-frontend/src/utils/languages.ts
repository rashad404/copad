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
// Keep the existing English default pending an explicit product decision.
export const DEFAULT_SITE_LANGUAGE: SiteLanguage = "en";
