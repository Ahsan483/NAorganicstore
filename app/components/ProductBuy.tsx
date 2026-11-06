'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, Minus, Plus, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from './cart';
import { motion } from './motion';
import { CONTACT } from '@/lib/config';
import type { Product } from '@/lib/types';

export default function ProductBuy({ p }: { p: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const out = p.stock <= 0;
  const max = Math.max(1, Math.min(20, p.stock));

  const wa = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(`Hi! I'd like to order ${qty} × ${p.title} (Rs. ${p.price}).`)}`;

  return (
    <div className="mt-8 space-y-4">
      {!out && p.stock <= 10 && <p className="text-sm font-semibold text-berry">Only {p.stock} left in stock</p>}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-forest/20 bg-white">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-12 place-items-center" aria-label="Decrease quantity"><Minus size={18} /></button>
          <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(max, q + 1))} className="grid size-12 place-items-center" aria-label="Increase quantity"><Plus size={18} /></button>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }} disabled={out}
          onClick={() => { add(p, qty); setDone(true); setTimeout(() => setDone(false), 1800); }}
          className="btn btn-primary flex-1 sm:flex-none sm:min-w-56"
        >
          {done ? <><Check size={18} /> Added</> : out ? 'Sold out' : <><ShoppingBag size={18} /> Add to cart</>}
        </motion.button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/checkout" onClick={() => !out && add(p, qty, false)} className="btn btn-lime flex-1 sm:flex-none">Buy now</Link>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-wa flex-1 sm:flex-none"><MessageCircle size={18} /> Ask on WhatsApp</a>
      </div>
    </div>
  );
}
