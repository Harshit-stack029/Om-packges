import Product from '../models/Product.js';
import Category from '../models/Category.js';
import BlogPost from '../models/BlogPost.js';

const STATIC_PATHS = [
  { path: '/',              priority: '1.0', changefreq: 'weekly' },
  { path: '/about',         priority: '0.7', changefreq: 'monthly' },
  { path: '/products',      priority: '0.9', changefreq: 'weekly' },
  { path: '/industries',    priority: '0.8', changefreq: 'monthly' },
  { path: '/certifications',priority: '0.6', changefreq: 'monthly' },
  { path: '/gallery',       priority: '0.7', changefreq: 'weekly' },
  { path: '/blog',          priority: '0.8', changefreq: 'weekly' },
  { path: '/clients',       priority: '0.6', changefreq: 'monthly' },
  { path: '/contact',       priority: '0.7', changefreq: 'yearly' },
  { path: '/request-quote', priority: '0.9', changefreq: 'yearly' },
];

const fmt = (d) => new Date(d || Date.now()).toISOString().split('T')[0];

const esc = (s) => String(s || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

// GET /sitemap.xml
export const sitemap = async (req, res, next) => {
  try {
    const baseUrl = (process.env.SITE_URL || 'https://www.ompack.in').replace(/\/$/, '');

    const [categories, products, posts] = await Promise.all([
      Category.find({ isActive: true }).select('slug updatedAt').lean(),
      Product.find({ isActive: true }).select('slug updatedAt category').populate('category', 'slug').lean(),
      BlogPost.find({ isPublished: true }).select('slug updatedAt').lean(),
    ]);

    const entries = [];

    // Static pages
    for (const { path, priority, changefreq } of STATIC_PATHS) {
      entries.push({ loc: `${baseUrl}${path}`, lastmod: fmt(), changefreq, priority });
    }

    // Categories
    for (const c of categories) {
      entries.push({
        loc: `${baseUrl}/products/${esc(c.slug)}`,
        lastmod: fmt(c.updatedAt),
        changefreq: 'weekly',
        priority: '0.7',
      });
    }

    // Products (nested under category)
    for (const p of products) {
      if (!p.category?.slug) continue;
      entries.push({
        loc: `${baseUrl}/products/${esc(p.category.slug)}/${esc(p.slug)}`,
        lastmod: fmt(p.updatedAt),
        changefreq: 'monthly',
        priority: '0.8',
      });
    }

    // Blog posts
    for (const b of posts) {
      entries.push({
        loc: `${baseUrl}/blog/${esc(b.slug)}`,
        lastmod: fmt(b.updatedAt),
        changefreq: 'monthly',
        priority: '0.6',
      });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`
  )
  .join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    next(err);
  }
};

// GET /robots.txt — served by API (fallback; usually served from frontend public/)
export const robots = (_req, res) => {
  const baseUrl = (process.env.SITE_URL || 'https://www.ompack.in').replace(/\/$/, '');
  res.type('text/plain').send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: ${baseUrl}/sitemap.xml
`);
};
