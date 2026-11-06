'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf, ShieldCheck, Truck, Star } from 'lucide-react';
import { motion, SplitText, Magnetic, Marquee, Parallax } from './motion';
import { WHATSAPP_URL } from '@/lib/config';

function LeafShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path d="M50 4C20 22 6 52 14 80c6 14 22 18 36 14 28-8 44-38 36-76C70 4 58 2 50 4Z" fill="currentColor" />
      <path d="M50 94C50 60 46 36 30 18" stroke="rgba(0,0,0,.18)" strokeWidth="2" fill="none" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="relative -mt-16 sm:-mt-20 overflow-hidden bg-forest pt-16 sm:pt-20 text-white grain">
      <div className="pointer-events-none absolute -left-40 top-20 size-[34rem] rounded-full bg-leaf/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-[30rem] rounded-full bg-saffron/15 blur-[120px]" />
      <LeafShape className="pointer-events-none absolute left-[6%] top-[22%] hidden size-16 animate-float text-leaf/50 lg:block" />
      <LeafShape className="pointer-events-none absolute bottom-[8%] left-[52%] hidden size-10 rotate-90 animate-float text-lime/40 [animation-delay:-3s] lg:block" />

      <div className="container-x relative grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-6 lg:pb-24 lg:pt-16">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="chip border border-white/20 bg-white/10 text-lime backdrop-blur"
          >
            <Leaf size={14} /> Quality Herbs · Healthy Living
          </motion.span>

          <h1 className="font-display mt-6 text-[2.9rem] font-medium leading-[0.98] sm:text-7xl lg:text-[5.4rem]">
            <SplitText text="Nature's own" delay={0.2} as="span" className="block" />
            <SplitText text="recipe for" delay={0.45} as="span" className="block" />
            <span className="block italic text-lime"><SplitText text="radiant you." delay={0.7} as="span" /></span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-7 max-w-xl text-base text-white/75 sm:text-lg"
          >
            Herbal hair oil, shampoo, beauty cream, neem soap, surma and traditional powders — crafted in Peshawar from pure botanicals, delivered across Pakistan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic><Link href="/shop" className="btn btn-lime">Shop the collection <ArrowRight size={18} /></Link></Magnetic>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn border-white/25 text-white hover:bg-white/10">Order on WhatsApp</a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
            className="mt-10 grid max-w-xl grid-cols-1 gap-3 text-sm text-white/80 sm:grid-cols-3"
          >
            <li className="flex items-center gap-2"><ShieldCheck size={18} className="text-lime" /> Chemical-free</li>
            <li className="flex items-center gap-2"><Truck size={18} className="text-lime" /> COD nationwide</li>
            <li className="flex items-center gap-2"><Star size={18} className="text-lime" /> Made in Peshawar</li>
          </motion.ul>
        </div>

        <Parallax offset={30} className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative mx-auto aspect-[5/4] w-full max-w-[640px] overflow-hidden rounded-[2.5rem] border border-white/15 shadow-[0_40px_120px_-30px_rgba(0,0,0,.7)]"
          >
            <Image src="/images/products/all-products.png" alt="NA Organic Store herbal hair oil, shampoo, cream, neem soap, surma and powders" fill priority sizes="(max-width:1024px) 100vw, 640px" className="object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4, duration: 0.8 }}
            className="absolute -bottom-5 left-2 rounded-2xl bg-cream px-5 py-3 text-forest shadow-xl sm:-left-6"
          >
            <p className="font-display text-3xl leading-none">100%</p>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">natural herbs</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.8 }}
            className="absolute -top-4 right-2 rounded-2xl bg-saffron px-5 py-3 text-forest shadow-xl sm:-right-4"
          >
            <p className="font-display text-3xl leading-none">Rs. 250+</p>
            <p className="text-xs font-semibold uppercase tracking-wider">starting price</p>
          </motion.div>
        </Parallax>
      </div>

      <div className="border-y border-white/10 py-5 font-display text-2xl text-white/80 sm:text-4xl">
        <Marquee items={['Herbal Hair Oil', 'Pro Shampoo', 'Neem Soap', 'Shafi Surma', 'Beauty Cream', 'Digestive Powder', 'Sugar Control']} />
      </div>
    </section>
  );
}
