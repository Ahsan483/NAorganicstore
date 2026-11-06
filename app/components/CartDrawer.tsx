'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X, Truck } from 'lucide-react';
import { AnimatePresence, motion } from './motion';
import { useCart } from './cart';
import { rs } from './format';
import { SHIPPING } from '@/lib/config';

export default function CartDrawer() {
  const { open, setOpen, items, subtotal, shipping, total, setQty, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc); };
  }, [open, setOpen]);

  const remaining = Math.max(0, SHIPPING.freeOver - subtotal);
  const progress = Math.min(100, (subtotal / SHIPPING.freeOver) * 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bg" className="fixed inset-0 z-[70] bg-forest/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            key="panel" role="dialog" aria-modal="true" aria-label="Shopping cart"
            className="fixed right-0 top-0 z-[71] flex h-dvh w-full max-w-md flex-col bg-cream shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          >
            <div className="flex items-center justify-between border-b border-forest/10 p-5">
              <h2 className="font-display text-2xl text-forest">Your cart</h2>
              <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full hover:bg-forest/8" aria-label="Close cart"><X size={22} /></button>
            </div>

            {items.length === 0 ? (
              <div className="grid flex-1 place-items-center p-8 text-center">
                <div>
                  <div className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-lime/40 text-forest"><ShoppingBag size={32} /></div>
                  <p className="font-display text-2xl text-forest">Your cart is empty</p>
                  <p className="mt-2 text-muted">Discover our natural herbal range.</p>
                  <Link href="/shop" onClick={() => setOpen(false)} className="btn btn-primary mt-6">Start shopping</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-forest/10 px-5 py-4 text-sm">
                  <div className="mb-2 flex items-center gap-2 text-forest">
                    <Truck size={16} />
                    {remaining > 0 ? <span>Add <b>{rs(remaining)}</b> more for <b>free delivery</b></span> : <span><b>You&apos;ve unlocked free delivery!</b></span>}
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-forest/10"><motion.div className="h-full bg-leaf" initial={{ width: 0 }} animate={{ width: `${progress}%` }} /></div>
                </div>

                <ul className="flex-1 divide-y divide-forest/10 overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li key={i.id} layout exit={{ opacity: 0, height: 0 }} className="flex gap-4 py-4">
                        <Link href={`/products/${i.slug}`} onClick={() => setOpen(false)} className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-sand">
                          <Image src={i.image} alt={i.title} fill sizes="80px" className="object-cover" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="line-clamp-2 text-sm font-semibold text-forest">{i.title}</p>
                          <p className="text-sm text-muted">{rs(i.price)}</p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border border-forest/15 bg-white">
                              <button onClick={() => setQty(i.id, i.quantity - 1)} className="grid size-9 place-items-center" aria-label={`Decrease ${i.title}`}><Minus size={15} /></button>
                              <span className="w-7 text-center text-sm font-semibold" aria-live="polite">{i.quantity}</span>
                              <button onClick={() => setQty(i.id, i.quantity + 1)} className="grid size-9 place-items-center" aria-label={`Increase ${i.title}`}><Plus size={15} /></button>
                            </div>
                            <button onClick={() => remove(i.id)} className="grid size-9 place-items-center rounded-full text-berry hover:bg-berry/10" aria-label={`Remove ${i.title}`}><Trash2 size={17} /></button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="space-y-2 border-t border-forest/10 bg-white p-5 text-sm">
                  <div className="flex justify-between text-muted"><span>Subtotal</span><span>{rs(subtotal)}</span></div>
                  <div className="flex justify-between text-muted"><span>Delivery</span><span>{shipping ? rs(shipping) : 'Free'}</span></div>
                  <div className="flex justify-between pt-1 text-lg font-bold text-forest"><span>Total</span><span>{rs(total)}</span></div>
                  <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary mt-3 w-full">Checkout · {rs(total)}</Link>
                  <p className="text-center text-xs text-muted">Cash on Delivery available · Secure checkout</p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
