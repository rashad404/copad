import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { resolveApiBaseUrl } from "./apiBase";
import { supportedLanguage, type SiteLanguage } from "@/utils/languages";
import { labCopy } from "@/components/labs/copy";
import {
  filterQuery,
  type LabFilters,
  type LabPage,
  type LabDetail,
} from "@/components/labs/model";
async function get<T>(path: string): Promise<T | null> {
  const r = await fetch(`${resolveApiBaseUrl()}${path}`, {
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(12000),
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error("Laboratory API unavailable");
  return r.json();
}
export const getLab = cache((slug: string, lang: SiteLanguage) =>
  get<LabDetail>(`/labs/${encodeURIComponent(slug)}?lang=${lang}`),
);
export async function getLabs(filters: LabFilters) {
  const data = await get<LabPage>(`/labs?${filterQuery(filters)}&size=20`);
  if (!data || !Array.isArray(data.content))
    throw new Error("Laboratory API unavailable");
  return data;
}
export async function laboratoryCopy() {
  const language =
    supportedLanguage((await cookies()).get("i18nextLng")?.value) || "az";
  return { language, c: labCopy(language) };
}
