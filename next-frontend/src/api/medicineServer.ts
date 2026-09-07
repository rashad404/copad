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
