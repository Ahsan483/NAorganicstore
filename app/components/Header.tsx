'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from './motion';
import { useCart } from './cart';
import { SITE } from '@/lib/config';

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'Our Story' },
  { href: '/track', label: 'Track Order' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const { count, setOpen, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const home = pathname === '/';

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menu]);

  const dark = home && !scrolled && !menu;

  return (
    <>
      <div className="bg-forest text-lime text-xs sm:text-[13px]">
        <div className="container-x flex items-center justify-center gap-2 py-2 text-center">
          <MapPin size={13} aria-hidden /> Free delivery over Rs. 3,000 · Cash on Delivery across Pakistan
        </div>
      </div>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${scrolled || menu ? 'bg-cream/85 backdrop-blur-xl shadow-[0_1px_0_rgba(18,48,26,.08)]' : home ? 'bg-forest/0' : 'bg-cream'}`}
      >
        <div className="container-x flex h-16 sm:h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.name} home`}>
            <Image src="/images/na-store-logo.png" alt="" width={48} height={48} priority className="size-11 sm:size-12 rounded-full bg-white object-contain ring-1 ring-black/5" />
            <span className={`font-display whitespace-nowrap text-lg sm:text-xl font-semibold leading-none transition-colors ${dark ? 'text-white' : 'text-forest'}`}>
              NA Organic<span className="hidden xs:block text-[10px] sm:text-[11px] font-sans font-medium tracking-[.22em] uppercase opacity-70 mt-1">Store · Peshawar</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + '/');
              return (
                <Link key={l.href} href={l.href} className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${dark ? 'text-white/85 hover:text-white' : 'text-forest/80 hover:text-forest'}`}>
                  {l.label}
                  {active && <motion.span layoutId="nav-pill" className={`absolute inset-0 -z-10 rounded-full ${dark ? 'bg-white/15' : 'bg-forest/8'}`} />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className={`relative grid size-11 place-items-center rounded-full transition-colors ${dark ? 'text-white hover:bg-white/10' : 'text-forest hover:bg-forest/8'}`}
              aria-label={`Open cart, ${hydrated ? count : 0} items`}
            >
              <ShoppingBag size={22} />
              <AnimatePresence>
                {hydrated && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 grid min-w-5 h-5 place-items-center rounded-full bg-saffron px-1 text-[11px] font-bold text-forest"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <Link href="/shop" className="btn btn-lime btn-sm hidden sm:inline-flex">Shop now</Link>
            <button
              onClick={() => setMenu((m) => !m)}
              className={`grid size-11 place-items-center rounded-full md:hidden ${dark ? 'text-white' : 'text-forest'}`}
              aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu}
            >
              {menu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-cream md:hidden pt-28 px-6"
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {[{ href: '/', label: 'Home' }, ...LINKS].map((l, i) => (
                <motion.div key={l.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 * i + 0.1, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}>
                  <Link href={l.href} className="block border-b border-forest/10 py-4 font-display text-4xl text-forest">{l.label}</Link>
                </motion.div>
              ))}
            </nav>
            <Link href="/shop" className="btn btn-primary mt-8 w-full">Shop all products</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
