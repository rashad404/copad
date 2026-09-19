import { siteLanguage } from "@/utils/geo/visitorLanguage";
import { medicineCopy } from "./copy";
export async function medicineServerCopy() {
  const language =
    await siteLanguage();
  return { language, copy: medicineCopy(language) };
}
