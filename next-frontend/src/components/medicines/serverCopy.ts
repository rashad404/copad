import { cookies } from "next/headers";
import { supportedLanguage } from "@/utils/languages";
import { medicineCopy } from "./copy";
export async function medicineServerCopy() {
  const language =
    supportedLanguage((await cookies()).get("i18nextLng")?.value) || "az";
  return { language, copy: medicineCopy(language) };
}
