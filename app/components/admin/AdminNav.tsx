'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, LogOut, Menu, MessageSquare, Package, ShoppingCart, ExternalLink, X } from 'lucide-react';

export default function AdminNav({ user, unread, pending }: { user: string; unread: number; pending: number }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const items = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, badge: pending },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/chats', label: 'Chats', icon: MessageSquare, badge: unread },
  ];

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login'); router.refresh();
  }

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {items.map((i) => {
        const active = i.exact ? path === i.href : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${active ? 'bg-lime text-forest' : 'text-white/80 hover:bg-white/10'}`}>
            <i.icon size={19} /> {i.label}
            {!!i.badge && <span className="ml-auto rounded-full bg-saffron px-2 py-0.5 text-xs font-bold text-forest">{i.badge}</span>}
          </Link>
        );
      })}
      <Link href="/" target="_blank" className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/60 hover:bg-white/10"><ExternalLink size={19} /> View store</Link>
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between bg-forest px-4 py-3 text-white lg:hidden">
        <span className="font-display text-lg">NA Admin</span>
        <button onClick={() => setOpen(!open)} aria-label="Menu" className="grid size-10 place-items-center">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="bg-forest p-4 lg:hidden">{nav}<button onClick={logout} className="mt-2 flex w-full items-center gap-3 px-4 py-3 text-sm text-white/70"><LogOut size={19} /> Sign out</button></div>}
      <aside className="sticky top-0 hidden h-dvh flex-col bg-forest p-5 text-white lg:flex">
        <div className="mb-8 flex items-center gap-3"><Image src="/images/na-store-logo.png" alt="" width={44} height={44} className="rounded-full bg-white" /><div><p className="font-display text-lg leading-none">NA Organic</p><p className="text-xs text-white/50">Admin panel</p></div></div>
        {nav}
        <div className="mt-auto border-t border-white/10 pt-4">
          <p className="px-4 text-xs text-white/50">Signed in as {user}</p>
          <button onClick={logout} className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/80 hover:bg-white/10"><LogOut size={19} /> Sign out</button>
        </div>
      </aside>
    </>
  );
}
