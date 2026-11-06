import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ShieldCheck, Star, Truck, Leaf } from 'lucide-react';
import ProductImage from '@/app/components/ProductImage';
import ProductBuy from '@/app/components/ProductBuy';
import ProductCard from '@/app/components/ProductCard';
import { Reveal } from '@/app/components/motion';
import { discountPct, rs } from '@/app/components/format';
import { getProductBySlug, listProducts } from '@/lib/products';
import { SITE_URL, SITE } from '@/lib/config';

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try { return (await listProducts()).map((p) => ({ slug: p.slug })); } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProductBySlug((await params).slug);
  if (!p) return { title: 'Product not found' };
  const title = `${p.title} – Buy Online in Pakistan`;
  const description = `${p.description.slice(0, 150)} Rs. ${p.price}. Cash on Delivery across Pakistan.`;
  return {
    title, description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title, description, url: `${SITE_URL}/products/${p.slug}`, images: [{ url: p.image }], type: 'website' },
  };
}

export default async function ProductPage({ params }: Props) {
  const slug = (await params).slug;
  const p = await getProductBySlug(slug);
  if (!p) notFound();
  const related = (await listProducts()).filter((x) => x.id !== p.id).slice(0, 4);
  const off = discountPct(p.originalPrice, p.price);
  const abs = (u: string) => (u.startsWith('http') ? u : `${SITE_URL}${u}`);

  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'Product',
      name: p.title, description: p.description, image: p.images.map(abs), sku: p.id, category: p.category,
      brand: { '@type': 'Brand', name: SITE.name },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews },
      offers: {
        '@type': 'Offer', url: `${SITE_URL}/products/${p.slug}`, priceCurrency: 'PKR', price: p.price,
        availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition', seller: { '@type': 'Organization', name: SITE.name },
        shippingDetails: { '@type': 'OfferShippingDetails', shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'PK' } },
      },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: `${SITE_URL}/shop` },
        { '@type': 'ListItem', position: 3, name: p.title, item: `${SITE_URL}/products/${p.slug}` },
      ],
    },
  ];

  return (
    <div className="container-x py-8 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-forest">Home</Link><ChevronRight size={14} />
        <Link href="/shop" className="hover:text-forest">Shop</Link><ChevronRight size={14} />
        <span className="truncate text-forest">{p.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-sand lg:sticky lg:top-28">
            <ProductImage src={p.image} alt={p.title} sizes="(max-width:1024px) 100vw, 640px" priority />
            {off > 0 && <span className="chip absolute left-4 top-4 bg-saffron text-forest">Save {off}%</span>}
          </div>
        </Reveal>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-leaf">{p.category}</p>
          <h1 className="font-display mt-2 text-4xl leading-tight text-forest sm:text-6xl">{p.title}</h1>
          {p.urduTitle && <p className="urdu mt-2 text-2xl text-moss">{p.urduTitle}</p>}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted">
            <span className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={16} className={i < Math.round(p.rating) ? 'fill-saffron text-saffron' : 'text-forest/20'} />)}</span>
            {p.rating.toFixed(1)} · {p.reviews} reviews
          </div>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl text-forest sm:text-5xl">{rs(p.price)}</span>
            {p.originalPrice > p.price && <span className="text-lg text-muted line-through">{rs(p.originalPrice)}</span>}
          </div>
          <p className="mt-6 text-lg leading-relaxed text-muted">{p.description}</p>
          {p.urduDescription && <p className="urdu mt-4 text-lg text-ink/80">{p.urduDescription}</p>}

          <ProductBuy p={p} />

          <ul className="mt-10 grid gap-3 rounded-3xl bg-white p-6 ring-1 ring-forest/10 sm:grid-cols-3">
            <li className="flex items-center gap-3 text-sm"><Leaf className="text-leaf" size={22} /> 100% natural</li>
            <li className="flex items-center gap-3 text-sm"><Truck className="text-leaf" size={22} /> Cash on Delivery</li>
            <li className="flex items-center gap-3 text-sm"><ShieldCheck className="text-leaf" size={22} /> Secure ordering</li>
          </ul>
          <p className="mt-6 text-xs text-muted">Herbal products support wellbeing and are not a substitute for medical advice. Consult your doctor if you have a medical condition.</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="rel">
          <h2 id="rel" className="font-display text-3xl text-forest sm:text-5xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
