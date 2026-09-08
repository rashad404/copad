import { MetadataRoute } from 'next';
import { DOCTOR_SITEMAP_SIZE, getDoctorSitemapPage } from '@/api/doctorServer';
import { getMedicineSitemapPage } from '@/api/medicineServer';
import { MEDICINE_SITEMAP_PAGE_SIZE } from '@/app/dermanlar/sitemap';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://azdoc.ai';

/**
 * Every sitemap file is named here.
 *
 * The drug pages are split across numbered files by generateSitemaps, and Next
 * does not publish an index for them, so pointing at /dermanlar/sitemap.xml
 * would send crawlers to a 404 and hide the ten thousand pages that are most of
 * the site.
 */
async function medicineSitemaps(): Promise<string[]> {
  try {
    const first = await getMedicineSitemapPage(0, MEDICINE_SITEMAP_PAGE_SIZE);
    const total = first?.total ?? 0;
    const pages = Math.max(1, Math.ceil(total / MEDICINE_SITEMAP_PAGE_SIZE));
    return Array.from(
      { length: pages },
      (_, id) => `${baseUrl}/dermanlar/sitemap/${id}.xml`,
    );
  } catch {
    // A robots.txt without the drug sitemaps is worse than one without them
    // and no robots.txt at all; the main sitemap still gets published.
    return [];
  }
}

async function doctorSitemaps(): Promise<string[]> {
  const first = await getDoctorSitemapPage(0).catch(() => null);
  const pages = Math.max(1, Math.ceil((first?.total ?? 0) / DOCTOR_SITEMAP_SIZE));
  return Array.from({ length: pages }, (_, id) => `${baseUrl}/hekimler/sitemap/${id}.xml`);
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: [
        '/admin/',
        '/api/',
        '/login',
        '/logout',
        '/register',
        '/dashboard',
        '/profile',
        '/analizlerim',
      ],
    },
    sitemap: [`${baseUrl}/sitemap.xml`, ...(await medicineSitemaps()), ...(await doctorSitemaps())],
  };
}
