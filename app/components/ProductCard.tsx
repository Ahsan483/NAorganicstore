'use client';

import Link from 'next/link';
import { Plus, Star } from 'lucide-react';
import { motion } from './motion';
import { useCart } from './cart';
import ProductImage from './ProductImage';
import { discountPct, rs } from './format';
import type { Product } from '@/lib/types';

export default function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const { add } = useCart();
  const off = discountPct(p.originalPrice, p.price);
  const out = p.stock <= 0;
  return (
    <motion.article
      whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group card flex h-full flex-col overflow-hidden"
    >
      <Link href={`/products/${p.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-sand" aria-label={p.title}>
        <ProductImage src={p.image} alt={p.title} sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" priority={priority} className="transition-transform duration-700 ease-out group-hover:scale-110" />
        <div className="absolute left-3 top-3 flex gap-2">
          {off > 0 && <span className="chip bg-saffron text-forest">-{off}%</span>}
          {out && <span className="chip bg-ink text-white">Sold out</span>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-leaf">{p.category}</p>
        <Link href={`/products/${p.slug}`} className="mt-1">
          <h3 className="font-display text-lg leading-snug text-forest sm:text-xl">{p.title}</h3>
          {p.urduTitle && <p className="urdu text-base text-muted">{p.urduTitle}</p>}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted"><Star size={13} className="fill-saffron text-saffron" /> {p.rating.toFixed(1)} <span>({p.reviews})</span></div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="text-lg font-bold text-forest sm:text-xl">{rs(p.price)}</p>
            {p.originalPrice > p.price && <p className="text-xs text-muted line-through">{rs(p.originalPrice)}</p>}
          </div>
          <button
            disabled={out}
            onClick={() => add(p)}
            className="btn btn-primary !min-h-11 !px-4 sm:!px-5"
            aria-label={`Add ${p.title} to cart`}
          >
            <Plus size={18} /><span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
