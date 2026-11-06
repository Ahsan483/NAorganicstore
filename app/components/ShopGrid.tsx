'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import ProductCard from './ProductCard';
import { AnimatePresence, motion } from './motion';
import type { Product } from '@/lib/types';

export default function ShopGrid({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const [cat, setCat] = useState(params.get('category') || 'All');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('featured');
  const cats = useMemo(() => ['All', ...Array.from(new Set(products.map((p) => p.category)))], [products]);

  const list = useMemo(() => {
    let l = products.filter((p) => (cat === 'All' || p.category === cat) && (`${p.title} ${p.urduTitle ?? ''} ${p.category}`.toLowerCase().includes(q.toLowerCase())));
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price);
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price);
    if (sort === 'rating') l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [products, cat, q, sort]);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 bg-cream/90 px-4 py-4 backdrop-blur-lg sm:top-20 sm:mx-0 sm:rounded-3xl sm:px-0">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Categories">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${cat === c ? 'bg-forest-2 text-white' : 'bg-white text-forest ring-1 ring-forest/15 hover:bg-forest/5'}`}>{c}</button>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search products</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="input !pl-11" />
          </label>
          <label>
            <span className="sr-only">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="input sm:w-52">
              <option value="featured">Featured</option><option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option><option value="rating">Top rated</option>
            </select>
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">{list.length} product{list.length === 1 ? '' : 's'}</p>
      <motion.div layout className="mt-4 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35 }}>
              <ProductCard p={p} priority={i < 4} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && <p className="py-20 text-center text-muted">No products match your search.</p>}
    </div>
  );
}
