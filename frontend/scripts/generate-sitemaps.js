import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSitemap } from '../src/utils/sitemapGenerator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Generate sitemaps for each domain
const domains = ['virtualhekim.az', 'azdoc.ai', 'logman.az'];
domains.forEach(domain => {
    const sitemap = generateSitemap(domain);
    fs.writeFileSync(path.join(publicDir, `sitemap-${domain}.xml`), sitemap);
});

console.log('Sitemaps generated successfully!'); 