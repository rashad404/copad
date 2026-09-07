export const revalidate = 300;
import type { MetadataRoute } from "next";
import { DOCTOR_SITEMAP_SIZE, getDoctorSitemapPage } from "@/api/doctorServer";
import { profileUrl } from "@/components/doctors/model";
export async function generateSitemaps() {
  const first = await getDoctorSitemapPage(0).catch(() => null);
  return Array.from(
    {
      length: Math.max(1, Math.ceil((first?.total ?? 0) / DOCTOR_SITEMAP_SIZE)),
    },
    (_, id) => ({ id }),
  );
}
export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const page = await getDoctorSitemapPage(id).catch(() => null);
  return (page?.entries || []).map((entry) => ({
    url: profileUrl(entry.slug),
    lastModified: entry.lastModified ? new Date(entry.lastModified) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}
