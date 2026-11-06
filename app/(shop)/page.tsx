import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Droplets, FlaskConical, HandHeart, MessageCircle, PackageCheck, ShoppingBag, Sprout } from 'lucide-react';
import HeroSection from '@/app/components/HeroSection';
import ProductCard from '@/app/components/ProductCard';
import { Reveal, SplitText, Counter, Parallax } from '@/app/components/motion';
import { listProducts } from '@/lib/products';
import { WHATSAPP_URL, SITE_URL } from '@/lib/config';

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: 'NA Organic Store | Herbal Hair Oil, Shampoo & Natural Care in Pakistan' },
  description: 'Buy 100% natural herbal hair oil, shampoo, beauty cream, neem soap, shafi surma and herbal powders online. Made in Peshawar. Cash on Delivery across Pakistan.',
  alternates: { canonical: '/' },
};

const FAQ = [
  { q: 'Are your products 100% natural?', a: 'Yes. NA Organic Store products are prepared from traditional herbs and natural oils without harsh chemicals. Each product page lists what it is made for.' },
  { q: 'Do you deliver all over Pakistan?', a: 'We deliver to every major city and most towns across Pakistan. Orders above Rs. 3,000 get free delivery; otherwise a small flat delivery fee applies.' },
  { q: 'Can I pay Cash on Delivery?', a: 'Yes — Cash on Delivery is available nationwide. You can also pay by bank, Easypaisa or JazzCash transfer and confirm on WhatsApp.' },
  { q: 'How long does delivery take?', a: 'Most orders arrive in 2–5 working days. You receive WhatsApp and email updates and can track your order any time on our Track Order page.' },
  { q: 'How do I place an order?', a: 'Add products to your cart, enter your delivery details and confirm. You instantly get an order number, and our team confirms with you on WhatsApp.' },
];

export default async function Home() {
  const products = await listProducts();
  const featured = products.slice(0, 4);

  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const listLd = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/products/${p.slug}`, name: p.title })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([faqLd, listLd]) }} />
      <HeroSection />

      {/* Featured */}
      <section className="container-x py-20 sm:py-28" aria-labelledby="featured">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.24em] text-leaf">Bestsellers</p>
            <h2 id="featured" className="font-display mt-3 text-4xl text-forest sm:text-6xl"><SplitText text="Loved by our customers" /></h2>
          </div>
          <Link href="/shop" className="btn btn-ghost">View all products <ArrowRight size={18} /></Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}><ProductCard p={p} priority={i < 2} /></Reveal>
          ))}
        </div>
      </section>

      {/* Statement */}
      <section className="bg-sand py-20 sm:py-32" aria-labelledby="why">
        <div className="container-x">
          <h2 id="why" className="font-display max-w-5xl text-4xl leading-[1.05] text-forest sm:text-7xl">
            <SplitText text="No shortcuts." stagger={0.08} /> <span className="italic text-moss"><SplitText text="No harsh chemicals." delay={0.3} stagger={0.08} /></span>{' '}
            <SplitText text="Just patient, traditional herbal craft." delay={0.7} stagger={0.05} />
          </h2>
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              { icon: Sprout, t: 'Pure botanicals', d: 'Neem, saffron, herbs and cold-handled natural oils chosen for what they do, not how they look on a label.' },
              { icon: FlaskConical, t: 'Small-batch craft', d: 'Prepared in small batches in Peshawar so every bottle, jar and bar stays fresh and potent.' },
              { icon: HandHeart, t: 'Care you can reach', d: 'Real people on WhatsApp and live chat to guide you to the right product — before and after you order.' },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 0.1}>
                <div className="card h-full p-8 transition-shadow hover:shadow-xl">
                  <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-lime/60 text-forest"><f.icon size={26} /></div>
                  <h3 className="font-display text-2xl text-forest">{f.t}</h3>
                  <p className="mt-3 text-muted">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story / video */}
      <section className="container-x grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2" aria-labelledby="story">
        <Parallax offset={24}>
          <div className="relative overflow-hidden rounded-[2rem] bg-forest shadow-2xl">
            <video className="aspect-[4/3] w-full object-cover" controls playsInline preload="none" poster="/images/hero-bg.png" aria-label="How NA Organic products are made">
              <source src="/videos/making.mp4" type="video/mp4" />
            </video>
          </div>
        </Parallax>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-leaf">Our process</p>
          <h2 id="story" className="font-display mt-3 text-4xl text-forest sm:text-6xl"><SplitText text="From herb to bottle, with care" /></h2>
          <p className="mt-6 text-lg text-muted">Watch how our team prepares each batch. Every product is made by hand from traditional recipes — then packed and shipped fresh from our shop in Abaseen Market, Peshawar.</p>
          <dl className="mt-10 grid grid-cols-3 gap-4">
            {[{ n: products.length, s: '', l: 'Products' }, { n: 100, s: '%', l: 'Natural' }, { n: 5, s: ' days', l: 'Avg. delivery' }].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white p-4 text-center ring-1 ring-forest/10">
                <dt className="sr-only">{s.l}</dt>
                <dd><Counter to={s.n} suffix={s.s} className="font-display text-3xl text-forest sm:text-4xl" /><p className="mt-1 text-xs text-muted">{s.l}</p></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-forest py-20 text-white sm:py-28 relative overflow-hidden" aria-labelledby="how">
        <div className="container-x">
          <h2 id="how" className="font-display text-4xl sm:text-6xl"><SplitText text="Order in three easy steps" /></h2>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: ShoppingBag, t: 'Choose', d: 'Browse the range and add your favourites to the cart.' },
              { icon: PackageCheck, t: 'Confirm', d: 'Enter your address, pick Cash on Delivery and place your order. No account needed.' },
              { icon: Droplets, t: 'Receive', d: 'Get WhatsApp & email updates, track the parcel and pay at your door.' },
            ].map((s, i) => (
              <Reveal as="li" key={s.t} delay={i * 0.12}>
                <div className="relative h-full rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur">
                  <span className="font-display absolute right-6 top-4 text-7xl text-white/10">0{i + 1}</span>
                  <s.icon className="text-lime" size={30} />
                  <h3 className="font-display mt-6 text-2xl">{s.t}</h3>
                  <p className="mt-2 text-white/70">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="container-x py-20 sm:py-28" aria-labelledby="faq">
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.24em] text-leaf">Good to know</p>
            <h2 id="faq" className="font-display mt-3 text-4xl text-forest sm:text-6xl"><SplitText text="Questions, answered" /></h2>
            <div className="relative mt-8 hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block">
              <Image src="/images/about-us.png" alt="NA Organic Store shop in Peshawar" fill sizes="40vw" className="object-cover" />
            </div>
          </div>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group card p-6 open:shadow-lg">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-forest">
                  {f.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-lime/50 text-lg transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-lime px-6 py-16 text-center sm:py-24">
          <h2 className="font-display mx-auto max-w-3xl text-4xl text-forest sm:text-6xl"><SplitText text="Ready to feel the difference?" /></h2>
          <p className="mx-auto mt-5 max-w-xl text-forest/75">Order today — pay when it arrives. Questions? We&apos;re one WhatsApp message away.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn btn-primary">Shop now <ArrowRight size={18} /></Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><MessageCircle size={18} /> Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
