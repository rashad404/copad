import translations from "./translations.json";
import { supportedLanguage } from "@/utils/languages";
export type LabCopy = typeof translations.az;
export const labCopy = (language?: string | null): LabCopy =>
  translations[supportedLanguage(language) || "az"];
