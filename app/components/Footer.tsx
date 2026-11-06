import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { CONTACT, SITE, WHATSAPP_URL } from '@/lib/config';
import { Marquee } from './motion';

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-forest text-white grain">
      <div className="border-b border-white/10 py-6 font-display text-3xl sm:text-5xl text-lime/90" >
        <Marquee items={['100% Natural', 'Chemical-free', 'Made in Peshawar', 'Cash on Delivery', 'Quality Herbs, Healthy Living']} />
      </div>
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/images/na-store-logo.png" alt="" width={56} height={56} className="size-14 rounded-full bg-white" />
            <p className="font-display text-2xl">{SITE.name}</p>
          </div>
          <p className="mt-5 max-w-sm text-white/70">{SITE.tagline}. Traditional herbal recipes, prepared with care in Peshawar and delivered to your door anywhere in Pakistan.</p>
        </div>
        <nav aria-label="Shop links">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-lime">Shop</p>
          <ul className="space-y-3 text-white/80">
            <li><Link className="hover:text-lime" href="/shop">All products</Link></li>
            <li><Link className="hover:text-lime" href="/shop?category=Hair%20Care">Hair care</Link></li>
            <li><Link className="hover:text-lime" href="/shop?category=Skin%20Care">Skin care</Link></li>
            <li><Link className="hover:text-lime" href="/shop?category=Herbal%20Powders">Herbal powders</Link></li>
          </ul>
        </nav>
        <nav aria-label="Company links">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-lime">Company</p>
          <ul className="space-y-3 text-white/80">
            <li><Link className="hover:text-lime" href="/about">Our story</Link></li>
            <li><Link className="hover:text-lime" href="/track">Track your order</Link></li>
            <li><Link className="hover:text-lime" href="/contact">Contact</Link></li>
          </ul>
        </nav>
        <address className="not-italic">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-lime">Visit & talk</p>
          <ul className="space-y-3 text-white/80">
            <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-lime" />{CONTACT.address}</li>
            <li><a className="flex gap-3 hover:text-lime" href={`tel:${CONTACT.phone}`}><Phone size={18} className="shrink-0 text-lime" />{CONTACT.phoneDisplay}</a></li>
            <li><a className="flex gap-3 break-all hover:text-lime" href={`mailto:${CONTACT.email}`}><Mail size={18} className="shrink-0 text-lime" />{CONTACT.email}</a></li>
            <li><a className="flex gap-3 hover:text-lime" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} className="shrink-0 text-lime" />WhatsApp us</a></li>
          </ul>
        </address>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved. Herbal products are not a substitute for medical advice.
      </div>
    </footer>
  );
}
