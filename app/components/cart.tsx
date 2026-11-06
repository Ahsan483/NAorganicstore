'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { calcShipping } from '@/lib/config';

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  hydrated: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Pick<Product, 'id' | 'slug' | 'title' | 'price' | 'image'>, qty?: number, openDrawer?: boolean) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'na-cart-v2';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && typeof i.id === 'string' && i.quantity > 0));
      }
    } catch { /* corrupt storage – start empty */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  // keep tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) { try { setItems(JSON.parse(e.newValue)); } catch { /* */ } }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add: CartCtx['add'] = useCallback((p, qty = 1, openDrawer = true) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      if (ex) return prev.map((i) => (i.id === p.id ? { ...i, quantity: Math.min(20, i.quantity + qty) } : i));
      return [...prev, { id: p.id, slug: p.slug, title: p.title, price: p.price, image: p.image, quantity: Math.min(20, qty) }];
    });
    if (openDrawer) setOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(20, qty) } : i))));
  }, []);
  const remove = useCallback((id: string) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = calcShipping(subtotal);
    return {
      items, count: items.reduce((s, i) => s + i.quantity, 0), subtotal, shipping, total: subtotal + shipping,
      hydrated, open, setOpen, add, setQty, remove, clear,
    };
  }, [items, hydrated, open, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used inside CartProvider');
  return c;
}
