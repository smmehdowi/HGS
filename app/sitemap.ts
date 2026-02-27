import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.himalayangulfstones.com';

const routes = [
  '',
  '/about',
  '/products',
  '/products/natural-slate',
  '/products/marble',
  '/products/granite',
  '/projects',
  '/services',
  '/contact',
  '/quote',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ['ar', 'en']) {
    for (const route of routes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.8,
        alternates: {
          languages: {
            ar: `${BASE_URL}/ar${route}`,
            en: `${BASE_URL}/en${route}`,
          },
        },
      });
    }
  }

  return entries;
}
