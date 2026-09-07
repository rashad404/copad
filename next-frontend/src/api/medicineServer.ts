import "server-only";
import { cache } from "react";
import { resolveApiBaseUrl } from "./apiBase";
import type { MedicineDetail, MedicineSummary } from "./medicines";
async function get<T>(path: string): Promise<T | null> {
  const response = await fetch(`${resolveApiBaseUrl()}${path}`, {
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(12000),
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    if (response.status === 400 && error?.message === "Medicine not found")
      return null;
    throw new Error(
      "Dərman məlumatlarını yükləmək mümkün olmadı. Yenidən cəhd edin.",
    );
  }
  return response.json();
}
export const getMedicine = cache((slug: string) =>
  get<MedicineDetail>(`/medicines/${encodeURIComponent(slug)}`),
);
export const searchMedicines = (q: string) =>
  get<MedicineSummary[]>(
    `/medicines?${new URLSearchParams({ q: q.trim(), limit: "50" })}`,
  );

export type MedicineSitemapPage = {
  total: number;
  page: number;
  size: number;
  entries: { slug: string; lastModified: string | null }[];
};

/**
 * One page of drug slugs for the sitemap.
 *
 * Cached for a day: the catalogue is synced monthly, and this is read by
 * crawlers rather than by people.
 */
export async function getMedicineSitemapPage(
  page: number,
  size: number,
): Promise<MedicineSitemapPage | null> {
  const response = await fetch(
    `${resolveApiBaseUrl()}/medicines/sitemap?${new URLSearchParams({
      page: String(page),
      size: String(size),
    })}`,
    { next: { revalidate: 86400 }, signal: AbortSignal.timeout(20000) },
  );
  if (!response.ok) return null;
  return response.json();
}
