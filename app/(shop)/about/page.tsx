import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, SplitText, Parallax } from '@/app/components/motion';

export const metadata: Metadata = {
  title: 'Our Story – Traditional Herbal Care from Peshawar',
  description: 'NA Organic Store creates natural herbal hair, skin and wellness products in Peshawar using traditional recipes and pure botanicals.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="container-x">
        <p className="text-xs font-semibold uppercase tracking-[.24em] text-leaf">Our story</p>
        <h1 className="font-display mt-3 max-w-4xl text-5xl leading-[1.02] text-forest sm:text-7xl"><SplitText as="span" text="Quality herbs, healthy living — rooted in Peshawar." /></h1>
      </div>

      <div className="container-x mt-14 grid items-center gap-12 lg:grid-cols-2">
        <Parallax offset={20}><div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white"><Image src="/images/about-us.png" alt="NA Organic Store" fill sizes="(max-width:1024px) 100vw, 600px" className="object-cover" /></div></Parallax>
        <div className="space-y-6 text-lg leading-relaxed text-muted">
          <Reveal><p>NA Organic Store began with a simple belief: the best care comes from nature. From our shop in Abaseen Market, Peshawar, we prepare herbal hair oil, shampoo, beauty cream, neem soap, shafi surma and traditional powders using time-honoured recipes.</p></Reveal>
          <Reveal delay={0.1}><p>We keep batches small so everything stays fresh, avoid harsh chemicals, and package each order by hand. Our customers across Pakistan trust us because we answer every message personally.</p></Reveal>
          <Reveal delay={0.2}><Link href="/shop" className="btn btn-primary">Explore the collection</Link></Reveal>
        </div>
      </div>

      <div className="container-x mt-20 grid gap-5 md:grid-cols-3">
        {[['Natural first', 'Botanical ingredients chosen for purpose, not marketing.'], ['Honest craft', 'Traditional methods, small batches, no shortcuts.'], ['Personal service', 'Real people on WhatsApp, live chat and phone.']].map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.1}><div className="card h-full p-8"><h2 className="font-display text-2xl text-forest">{t}</h2><p className="mt-3 text-muted">{d}</p></div></Reveal>
        ))}
      </div>
    </div>
  );
}
