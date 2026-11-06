import type { Metadata } from 'next';
import { Suspense } from 'react';
import ShopGrid from '@/app/components/ShopGrid';
import { SplitText } from '@/app/components/motion';
import { listProducts } from '@/lib/products';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop Herbal Hair Oil, Shampoo, Soap, Surma & Powders',
  description: 'Browse all NA Organic Store products: herbal hair oil, shampoo, beauty cream, neem soap, shafi surma and herbal powders. Cash on Delivery across Pakistan.',
  alternates: { canonical: '/shop' },
};

export default async function ShopPage() {
  const products = await listProducts();
  return (
    <div className="container-x py-12 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[.24em] text-leaf">The collection</p>
      <h1 className="font-display mt-3 text-5xl text-forest sm:text-7xl"><SplitText as="span" text="Shop natural" /></h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">Every product is made from traditional herbs and natural oils. Add to cart and pay when it arrives.</p>
      <div className="mt-8">
        <Suspense fallback={<div className="h-96" />}><ShopGrid products={products} /></Suspense>
      </div>
    </div>
  );
}
