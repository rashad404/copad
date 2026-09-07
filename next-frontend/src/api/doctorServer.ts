import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { resolveApiBaseUrl } from "./apiBase";
import { supportedLanguage } from "@/utils/languages";
import { doctorCopy, defaultSpecialties } from "@/components/doctors/copy";
import {
  filterQuery,
  type Filters,
  type PublicDoctor,
  type DoctorPage,
  type Slot,
} from "@/components/doctors/model";
async function get<T>(path: string, live = false): Promise<T | null> {
  const response = await fetch(`${resolveApiBaseUrl()}${path}`, {
    ...(live ? { cache: "no-store" as const } : { next: { revalidate: 300 } }),
    signal: AbortSignal.timeout(12000),
  });
  if (response.status === 404) return null;
  if (response.status === 400) {
    const error = await response.json().catch(() => null);
    if (error?.message === "Doctor not found") return null;
  }
  if (!response.ok) throw new Error("Directory API unavailable");
  return response.json();
}
export const getDoctor = cache((slug: string) =>
  get<PublicDoctor>(`/doctors/${encodeURIComponent(slug)}`),
);
export async function getDoctors(filters: Filters) {
  const result = await get<DoctorPage>(
    `/doctors?${filterQuery(filters)}&size=20`,
  );
  if (!result || !Array.isArray(result.content))
    throw new Error("Directory API unavailable");
  return result;
}
export async function getSpecialties() {
  return (
    (await get<{ code: string; name: string }[]>("/specialties").catch(
      () => null,
    )) || defaultSpecialties()
  );
}
export async function getSlots(id: number, from: string, to: string) {
  const result = await get<Slot[]>(
    `/doctors/${id}/slots?${new URLSearchParams({ from, to })}`,
    true,
  );
  if (!Array.isArray(result)) throw new Error("Slots API unavailable");
  return result;
}
export async function directoryCopy() {
  const language =
    supportedLanguage((await cookies()).get("i18nextLng")?.value) || "az";
  return { language, c: doctorCopy(language) };
}

export const DOCTOR_SITEMAP_SIZE = 5000;
export type DoctorSitemapPage = {
  total: number;
  page: number;
  size: number;
  entries: { slug: string; lastModified: string | null }[];
};
export async function getDoctorSitemapPage(page: number) {
  return get<DoctorSitemapPage>(
    `/doctors/sitemap?page=${page}&size=${DOCTOR_SITEMAP_SIZE}`,
  );
}
