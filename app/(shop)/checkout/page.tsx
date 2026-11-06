'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Banknote, Loader2, Lock, Smartphone, ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/components/cart';
import { rs } from '@/app/components/format';
import { PAYMENT_METHODS, SHIPPING, type PaymentMethod } from '@/lib/config';

type Errors = Partial<Record<'customerName' | 'phone' | 'email' | 'address' | 'city' | 'form', string>>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, clear, hydrated, setQty, remove } = useCart();
  const [f, setF] = useState({ customerName: '', phone: '', email: '', address: '', city: '', notes: '', website: '' });
  const [pay, setPay] = useState<PaymentMethod>('cod');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  function validate(): Errors {
    const e: Errors = {};
    if (f.customerName.trim().length < 2) e.customerName = 'Please enter your full name';
    if (!/^(\+?92|0)?3\d{9}$/.test(f.phone.replace(/[\s-]/g, '')) && f.phone.replace(/\D/g, '').length < 9) e.phone = 'Enter a valid phone number, e.g. 0300 1234567';
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email or leave it empty';
    if (f.address.trim().length < 8) e.address = 'Please enter your full delivery address';
    if (f.city.trim().length < 2) e.city = 'Please enter your city';
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) { document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); return; }
    setBusy(true);
    try {
      const r = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, paymentMethod: pay, items: items.map((i) => ({ id: i.id, quantity: i.quantity })) }),
      });
      const d = await r.json();
      if (!r.ok) { setErrors({ form: d.error || 'Something went wrong' }); return; }
      sessionStorage.setItem('na-last-order', JSON.stringify({ id: d.orderId, total: d.total, whatsappLink: d.whatsappLink, name: f.customerName }));
      clear();
      router.push(`/order-success?order=${encodeURIComponent(d.orderId)}`);
    } catch {
      setErrors({ form: 'Network error. Please check your connection and try again.' });
    } finally { setBusy(false); }
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <ShoppingBag size={48} className="mx-auto text-leaf" />
          <h1 className="font-display mt-4 text-4xl text-forest">Your cart is empty</h1>
          <Link href="/shop" className="btn btn-primary mt-6">Browse products</Link>
        </div>
      </div>
    );
  }

  const field = (id: keyof Errors) => ({ 'aria-invalid': !!errors[id], 'aria-describedby': errors[id] ? `${id}-err` : undefined });
  const err = (id: keyof Errors) => (errors[id] ? <p id={`${id}-err`} className="mt-1 text-xs text-berry" role="alert">{errors[id]}</p> : null);

  return (
    <div className="container-x py-10 sm:py-16">
      <h1 className="font-display text-4xl text-forest sm:text-6xl">Checkout</h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Lock size={14} /> Secure checkout · No account required</p>

      <form onSubmit={submit} noValidate className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:gap-14">
        <div className="space-y-8">
          <fieldset className="card space-y-4 p-6 sm:p-8">
            <legend className="font-display float-left mb-4 w-full text-2xl text-forest">Delivery details</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label" htmlFor="name">Full name *</label><input id="name" autoComplete="name" className="input" value={f.customerName} onChange={set('customerName')} {...field('customerName')} />{err("customerName")}</div>
              <div><label className="label" htmlFor="phone">Phone / WhatsApp *</label><input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0300 1234567" className="input" value={f.phone} onChange={set('phone')} {...field('phone')} />{err("phone")}</div>
            </div>
            <div><label className="label" htmlFor="email">Email (for order receipt, optional)</label><input id="email" type="email" autoComplete="email" className="input" value={f.email} onChange={set('email')} {...field('email')} />{err("email")}</div>
            <div><label className="label" htmlFor="address">Full address *</label><input id="address" autoComplete="street-address" placeholder="House #, street, area" className="input" value={f.address} onChange={set('address')} {...field('address')} />{err("address")}</div>
            <div><label className="label" htmlFor="city">City *</label><input id="city" autoComplete="address-level2" className="input" value={f.city} onChange={set('city')} {...field('city')} />{err("city")}</div>
            <div><label className="label" htmlFor="notes">Order notes (optional)</label><textarea id="notes" rows={3} className="input" value={f.notes} onChange={set('notes')} maxLength={500} /></div>
            {/* honeypot */}
            <input tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" value={f.website} onChange={set('website')} />
          </fieldset>

          <fieldset className="card p-6 sm:p-8">
            <legend className="font-display float-left mb-4 w-full text-2xl text-forest">Payment</legend>
            <div className="grid gap-3">
              {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((k) => (
                <label key={k} className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors ${pay === k ? 'border-leaf bg-lime/25' : 'border-forest/15 hover:bg-forest/5'}`}>
                  <input type="radio" name="pay" className="size-5 accent-[#2f6b2a]" checked={pay === k} onChange={() => setPay(k)} />
                  {k === 'cod' ? <Banknote className="text-moss" /> : <Smartphone className="text-moss" />}
                  <span><span className="block font-semibold text-forest">{PAYMENT_METHODS[k]}</span>
                    <span className="text-xs text-muted">{k === 'cod' ? 'Pay in cash when your parcel arrives.' : "We'll send our account details on WhatsApp after you order."}</span></span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl text-forest">Order summary</h2>
            <ul className="mt-5 divide-y divide-forest/10">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3 py-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-sand"><Image src={i.image} alt="" fill sizes="64px" className="object-cover" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-forest">{i.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                      <select aria-label={`Quantity for ${i.title}`} value={i.quantity} onChange={(e) => setQty(i.id, Number(e.target.value))} className="rounded-lg border border-forest/15 bg-white px-2 py-1">
                        {Array.from({ length: 20 }, (_, n) => n + 1).map((n) => <option key={n}>{n}</option>)}
                      </select>
                      <button type="button" onClick={() => remove(i.id)} className="underline hover:text-berry">Remove</button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{rs(i.price * i.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-forest/10 pt-4 text-sm">
              <div className="flex justify-between text-muted"><dt>Subtotal</dt><dd>{rs(subtotal)}</dd></div>
              <div className="flex justify-between text-muted"><dt>Delivery</dt><dd>{shipping ? rs(shipping) : 'Free'}</dd></div>
              {shipping > 0 && <p className="text-xs text-leaf">Free delivery on orders over {rs(SHIPPING.freeOver)}</p>}
              <div className="flex justify-between pt-2 text-xl font-bold text-forest"><dt>Total</dt><dd>{rs(total)}</dd></div>
            </dl>
            {errors.form && <p className="mt-4 rounded-xl bg-berry/10 p-3 text-sm text-berry" role="alert">{errors.form}</p>}
            <button className="btn btn-primary mt-6 w-full" disabled={busy || !items.length}>
              {busy ? <><Loader2 className="animate-spin" size={18} /> Placing order…</> : <>Place order · {rs(total)}</>}
            </button>
            <p className="mt-3 text-center text-xs text-muted">Prices are confirmed securely on our server when you place the order.</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
