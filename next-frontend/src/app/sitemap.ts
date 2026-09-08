// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getBlogPosts, getTopTags } from '@/api/serverFetch';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://azdoc.ai';

/**
 * The public pages.
 *
 * Only pages a stranger can actually open. The list used to include /admin/**,
 * /admin/test, /login, /logout, /register, /profile and /dashboard - every one
 * of them already disallowed in robots.ts, so the sitemap was inviting crawlers
 * to pages the same site told them not to visit.
 *
 * Drug pages are not here. There are over ten thousand, and they have their own
 * sitemap files under /dermanlar.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    { url: `${baseUrl}/laboratoriyalar`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/hekimler`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/`, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/dermanlar`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/security`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/terms-of-service`, changeFrequency: 'monthly' as const, priority: 0.4 },
  ].map((route) => ({ ...route, lastModified: new Date() }));

  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    // getBlogPosts returns { posts, pagination }; posts is either the array
    // itself or a Spring page wrapper depending on the endpoint.
    const { posts: rawPosts } = await getBlogPosts(0, 100);
    const posts = Array.isArray(rawPosts) ? rawPosts : rawPosts?.content ?? [];

    if (Array.isArray(posts)) {
      blogPosts = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  let tagPages: MetadataRoute.Sitemap = [];
  try {
    const tags = await getTopTags(50);

    if (Array.isArray(tags)) {
      tagPages = tags.map(tag => ({
        url: `${baseUrl}/blog/tag/${tag.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error fetching tags for sitemap:', error);
  }

  return [...routes, ...blogPosts, ...tagPages];
}