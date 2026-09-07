import { MetadataRoute } from "next";
import { getMedicineSitemapPage } from "@/api/medicineServer";

/**
 * The drug pages.
 *
 * There are over ten thousand of them and, until now, not one appeared in a
 * sitemap - which is most of the reason to have built them. They are split
 * across several files because a single sitemap has limits, and because a
 * failure while generating one page should not lose the rest.
 */
/** Exported so robots.ts names the same files this route generates. */
export const MEDICINE_SITEMAP_PAGE_SIZE = 5000;
const PAGE_SIZE = MEDICINE_SITEMAP_PAGE_SIZE;
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://azdoc.ai";

export async function generateSitemaps() {
  const first = await getMedicineSitemapPage(0, PAGE_SIZE);
  const total = first?.total ?? 0;
  // At least one file, so the route exists even when the catalogue is empty
  // and the index does not point at a 404.
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return Array.from({ length: pages }, (_, id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const page = await getMedicineSitemapPage(id, PAGE_SIZE);
  if (!page) return [];

  return page.entries.map((entry) => ({
    url: `${baseUrl}/dermanlar/${encodeURIComponent(entry.slug)}`,
    lastModified: entry.lastModified ? new Date(entry.lastModified) : undefined,
    // Prices move with the monthly sync; the page itself is stable.
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
