import { useCopy } from "./copy";
import medicines from "../copy/website/medicines.json";
import az from "../copy/website/az.json";
import en from "../copy/website/en.json";
import ru from "../copy/website/ru.json";
// Normalize punctuation only. Do not transliterate names, medical content or AZ letters.
export const plain = (text: string) =>
  text
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\u00b7/g, "-")
    .replace(/&quot;/g, '"');
export function useMedicineCopy() {
  const { language } = useCopy();
  return (key: string) =>
    plain(
      language === "az"
        ? key
        : (medicines as Record<string, { en: string; ru: string }>)[key]?.[
            language
          ] ||
            (key === "Dərman kataloqu"
              ? language === "ru"
                ? "Каталог лекарств"
                : "Medicine catalogue"
              : key),
    );
}
export function useWebsiteCopy() {
  const { language } = useCopy();
  return (key: string, args: Record<string, string | number> = {}) => {
    const value = key
      .split(".")
      .reduce<any>((v, k) => v?.[k], { az, en, ru }[language]);
    return plain(
      typeof value === "string"
        ? value.replace(/\{\{(\w+)\}\}/g, (_, name) =>
            String(args[name] ?? (name === "agentName" ? "azdoc" : "")),
          )
        : key,
    );
  };
}
