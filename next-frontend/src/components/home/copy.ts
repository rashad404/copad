import translations from "./translations.json";
import { supportedLanguage } from "@/utils/languages";

export type HomeCopy = typeof translations.az;
export const homeCopy: Record<"az" | "en" | "ru", HomeCopy> = translations;
export function getHomeCopy(language?: string | null): HomeCopy {
  return homeCopy[supportedLanguage(language) || "az"];
}
