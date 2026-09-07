import translations from "@/translations/medicines.json";
import type { SiteLanguage } from "@/utils/languages";
const dictionary: Record<string, { en: string; ru: string }> = translations;
export const medicineCopy = (language: SiteLanguage) => (az: string) =>
  language === "az"
    ? az.replace(/&quot;/g, '"')
    : (dictionary[az]?.[language] ?? az);

// Translate only recognized dispensing labels, not drug names or free-text records.
export function prescriptionLabel(
  value: string | null,
  copy: (az: string) => string,
) {
  if (!value) return copy("Resept statusu qeyd edilməyib");
  const status = value.trim().toLocaleLowerCase("az");
  if (
    ["reseptsiz", "otc", "non-prescription", "over the counter"].includes(
      status,
    )
  )
    return copy("Reseptsiz");
  if (
    [
      "reseptlə",
      "reseptli",
      "prescription",
      "prescription only",
      "rx",
    ].includes(status)
  )
    return copy("Reseptlə");
  return value;
}
