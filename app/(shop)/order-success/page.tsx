'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, MessageCircle, Copy } from 'lucide-react';
import { motion } from '@/app/components/motion';
import { rs } from '@/app/components/format';

function Inner() {
  const id = useSearchParams().get('order') || '';
  const [o, setO] = useState<{ id: string; total: number; whatsappLink: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try { const s = JSON.parse(sessionStorage.getItem('na-last-order') || 'null'); if (s && s.id === id) setO(s); } catch { /* */ }
  }, [id]);

  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-16 text-center">
      <div className="max-w-xl">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="mx-auto grid size-24 place-items-center rounded-full bg-leaf text-white shadow-xl">
          <motion.span initial={{ pathLength: 0 }}><Check size={48} strokeWidth={3} /></motion.span>
        </motion.div>
        <h1 className="font-display mt-8 text-4xl text-forest sm:text-6xl">Order placed{o ? `, ${o.name.split(' ')[0]}` : ''}!</h1>
        <p className="mt-4 text-lg text-muted">Thank you for choosing NA Organic Store. We&apos;ve sent the details to our team and will confirm with you on WhatsApp shortly.</p>

        <div className="card mx-auto mt-8 inline-block px-8 py-5">
          <p className="text-xs uppercase tracking-widest text-muted">Order number</p>
          <button onClick={() => { navigator.clipboard?.writeText(id); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="font-display mt-1 flex items-center gap-2 text-3xl text-forest" aria-label="Copy order number">
            {id} <Copy size={16} className="opacity-50" />
          </button>
          <p className="text-xs text-leaf">{copied ? 'Copied!' : o ? `Total ${rs(o.total)}` : 'Keep this number to track your order'}</p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {o?.whatsappLink && <a href={o.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><MessageCircle size={18} /> Confirm on WhatsApp</a>}
          <Link href={`/track?order=${encodeURIComponent(id)}`} className="btn btn-primary">Track order</Link>
          <Link href="/shop" className="btn btn-ghost">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return <Suspense><Inner /></Suspense>;
}
