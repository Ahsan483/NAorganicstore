'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2, PackageSearch } from 'lucide-react';
import { motion } from '@/app/components/motion';
import { rs } from '@/app/components/format';
import { STATUS_LABEL, type OrderStatus } from '@/lib/config';

interface Tracked {
  id: string; status: OrderStatus; createdAt: string; total: number; city: string; trackingNumber: string | null; courier: string | null;
  items: { title: string; quantity: number; price: number }[]; events: { status: string; note: string | null; createdAt: string }[];
}
const FLOW: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function Inner() {
  const [order, setOrder] = useState(useSearchParams().get('order') || '');
  const [phone, setPhone] = useState('');
  const [res, setRes] = useState<Tracked | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(''); setRes(null);
    try {
      const r = await fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order, phone }) });
      const d = await r.json();
      if (!r.ok) setErr(d.error || 'Not found'); else setRes(d);
    } catch { setErr('Network error. Please try again.'); } finally { setBusy(false); }
  }

  const idx = res ? FLOW.indexOf(res.status) : -1;

  return (
    <div className="container-x py-12 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[.24em] text-leaf">Order tracking</p>
        <h1 className="font-display mt-3 text-5xl text-forest sm:text-6xl">Where&apos;s my order?</h1>
        <form onSubmit={go} className="card mt-8 grid gap-4 p-6 sm:p-8">
          <div><label className="label" htmlFor="o">Order number</label><input id="o" className="input uppercase" placeholder="NA-250611-1234" value={order} onChange={(e) => setOrder(e.target.value)} required /></div>
          <div><label className="label" htmlFor="p">Phone number used on the order</label><input id="p" type="tel" inputMode="tel" className="input" placeholder="0300 1234567" value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
          {err && <p className="text-sm text-berry" role="alert">{err}</p>}
          <button className="btn btn-primary" disabled={busy}>{busy ? <Loader2 className="animate-spin" size={18} /> : <PackageSearch size={18} />} Track order</button>
        </form>

        {res && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mt-8 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><p className="text-xs uppercase tracking-widest text-muted">Order</p><p className="font-display text-2xl text-forest">{res.id}</p></div>
              <span className={`chip ${res.status === 'cancelled' ? 'bg-berry/15 text-berry' : 'bg-lime text-forest'}`}>{STATUS_LABEL[res.status]}</span>
            </div>

            {res.status !== 'cancelled' && (
              <ol className="mt-8 grid grid-cols-5 gap-1">
                {FLOW.map((s, i) => (
                  <li key={s} className="text-center">
                    <div className={`mx-auto grid size-9 place-items-center rounded-full text-sm transition-colors ${i <= idx ? 'bg-leaf text-white' : 'bg-forest/10 text-muted'}`}>{i <= idx ? <Check size={18} /> : i + 1}</div>
                    <p className={`mt-2 text-[11px] sm:text-xs ${i <= idx ? 'font-semibold text-forest' : 'text-muted'}`}>{STATUS_LABEL[s]}</p>
                  </li>
                ))}
              </ol>
            )}

            {res.trackingNumber && <p className="mt-6 rounded-2xl bg-lime/30 p-4 text-sm">Courier: <b>{res.courier || '—'}</b> · Tracking #: <b>{res.trackingNumber}</b></p>}
            <ul className="mt-6 divide-y divide-forest/10 text-sm">
              {res.items.map((i, k) => <li key={k} className="flex justify-between py-2"><span>{i.title} × {i.quantity}</span><span>{rs(i.price * i.quantity)}</span></li>)}
              <li className="flex justify-between py-2 font-bold text-forest"><span>Total (to {res.city})</span><span>{rs(res.total)}</span></li>
            </ul>
            <ol className="mt-6 space-y-3 border-l-2 border-leaf/30 pl-5 text-sm">
              {[...res.events].reverse().map((e, i) => (
                <li key={i}><b className="text-forest">{STATUS_LABEL[e.status as OrderStatus] ?? e.status}</b> <span className="text-muted">· {new Date(e.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}</span>{e.note && <p className="text-muted">{e.note}</p>}</li>
              ))}
            </ol>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return <Suspense><Inner /></Suspense>;
}
