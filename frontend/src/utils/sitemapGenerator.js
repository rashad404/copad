import { DOMAINS } from '../config/domains.js';

// Define common routes for all domains
const COMMON_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/blog',
  '/faq'
];

// Generate sitemap for a specific domain
export const generateSitemap = (domain) => {
  const baseUrl = `https://${domain}`;
  
  // XML header
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add each route
  COMMON_ROUTES.forEach(route => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}${route}</loc>\n`;
    sitemap += '    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n';
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>0.8</priority>\n';
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>';

  return sitemap;
}; 