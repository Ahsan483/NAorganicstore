'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { rs } from '../format';

type Form = { id?: string; title: string; slug: string; urduTitle: string; description: string; urduDescription: string; image: string; price: number; originalPrice: number; category: string; stock: number; active: boolean };
const blank: Form = { title: '', slug: '', urduTitle: '', description: '', urduDescription: '', image: '/images/products/all-products.png', price: 500, originalPrice: 600, category: 'Hair Care', stock: 50, active: true };
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function ProductManager({ products }: { products: Product[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const edit = (p: Product) => setForm({ id: p.id, title: p.title, slug: p.slug, urduTitle: p.urduTitle ?? '', description: p.description, urduDescription: p.urduDescription ?? '', image: p.image, price: p.price, originalPrice: p.originalPrice, category: p.category, stock: p.stock, active: p.active });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true); setErr('');
    const { id, ...rest } = form;
    const body = { ...rest, urduTitle: rest.urduTitle || null, urduDescription: rest.urduDescription || null };
    const r = await fetch(id ? `/api/admin/products/${id}` : '/api/admin/products', { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setBusy(false);
    if (!r.ok) { setErr((await r.json().catch(() => ({}))).error || 'Save failed'); return; }
    setForm(null); router.refresh();
  }

  async function quick(p: Product, patch: Partial<Form>) {
    await fetch(`/api/admin/products/${p.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: p.title, slug: p.slug, urduTitle: p.urduTitle, description: p.description, urduDescription: p.urduDescription, image: p.image, price: p.price, originalPrice: p.originalPrice, category: p.category, stock: p.stock, active: p.active, ...patch }),
    });
    router.refresh();
  }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  return (
    <>
      <button onClick={() => setForm({ ...blank })} className="btn btn-primary"><Plus size={18} /> Add product</button>
      <div className="card overflow-x-auto">
        <table className="tbl w-full min-w-[760px]">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Visible</th><th /></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={p.active ? '' : 'opacity-50'}>
                <td><div className="flex items-center gap-3"><div className="relative size-12 overflow-hidden rounded-xl bg-sand"><Image src={p.image} alt="" fill sizes="48px" className="object-cover" unoptimized={/^https?:/.test(p.image)} /></div><span className="font-semibold">{p.title}</span></div></td>
                <td className="text-muted">{p.category}</td>
                <td>{rs(p.price)}<span className="block text-xs text-muted line-through">{rs(p.originalPrice)}</span></td>
                <td><input type="number" min={0} defaultValue={p.stock} aria-label={`Stock for ${p.title}`} onBlur={(e) => Number(e.target.value) !== p.stock && quick(p, { stock: Number(e.target.value) })} className={`input !min-h-10 w-24 !py-1 ${p.stock <= 10 ? '!border-berry' : ''}`} /></td>
                <td><input type="checkbox" className="size-5 accent-[#2f6b2a]" defaultChecked={p.active} aria-label={`Visible: ${p.title}`} onChange={(e) => quick(p, { active: e.target.checked })} /></td>
                <td><button onClick={() => edit(p)} className="btn btn-ghost btn-sm">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-forest/60 p-4" role="dialog" aria-modal="true">
          <form onSubmit={save} className="my-8 w-full max-w-2xl space-y-4 rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between"><h2 className="font-display text-2xl text-forest">{form.id ? 'Edit product' : 'New product'}</h2><button type="button" onClick={() => setForm(null)} aria-label="Close"><X /></button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Title *</label><input className="input" required value={form.title} onChange={(e) => { set('title', e.target.value); if (!form.id) set('slug', slugify(e.target.value)); }} /></div>
              <div><label className="label">URL slug *</label><input className="input" required value={form.slug} onChange={(e) => set('slug', slugify(e.target.value))} /></div>
              <div><label className="label">Urdu title</label><input className="input urdu" dir="rtl" value={form.urduTitle} onChange={(e) => set('urduTitle', e.target.value)} /></div>
              <div><label className="label">Category *</label><input className="input" required value={form.category} onChange={(e) => set('category', e.target.value)} /></div>
              <div><label className="label">Price (Rs.) *</label><input type="number" min={1} className="input" required value={form.price} onChange={(e) => set('price', Number(e.target.value))} /></div>
              <div><label className="label">Original price (Rs.) *</label><input type="number" min={1} className="input" required value={form.originalPrice} onChange={(e) => set('originalPrice', Number(e.target.value))} /></div>
              <div><label className="label">Stock *</label><input type="number" min={0} className="input" required value={form.stock} onChange={(e) => set('stock', Number(e.target.value))} /></div>
              <div><label className="label">Image path or https URL *</label><input className="input" required value={form.image} onChange={(e) => set('image', e.target.value)} /></div>
            </div>
            <div><label className="label">Description *</label><textarea rows={4} className="input" required minLength={10} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
            <div><label className="label">Urdu description</label><textarea rows={3} dir="rtl" className="input urdu" value={form.urduDescription} onChange={(e) => set('urduDescription', e.target.value)} /></div>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="size-5 accent-[#2f6b2a]" checked={form.active} onChange={(e) => set('active', e.target.checked)} /> Visible on store</label>
            {err && <p className="text-sm text-berry" role="alert">{err}</p>}
            <div className="flex justify-end gap-3"><button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>Cancel</button><button className="btn btn-primary" disabled={busy}>{busy && <Loader2 className="animate-spin" size={18} />} Save product</button></div>
          </form>
        </div>
      )}
    </>
  );
}
