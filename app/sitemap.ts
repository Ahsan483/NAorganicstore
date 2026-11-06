import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';
import { listProducts } from '@/lib/products';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/track`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];
  try {
    const products = await listProducts();
    return [...pages, ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 }))];
  } catch {
    return pages;
  }
}
