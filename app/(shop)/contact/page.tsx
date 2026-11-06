import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import ContactForm from '@/app/components/ContactForm';
import { SplitText } from '@/app/components/motion';
import { CONTACT, WHATSAPP_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Contact Us – Peshawar Herbal Store',
  description: 'Contact NA Organic Store: Abaseen Market, Shop #17, Peshawar. Call, WhatsApp or email us for product advice and orders.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const rows = [
    { icon: MapPin, t: 'Visit us', v: CONTACT.address, href: `https://maps.google.com/?q=${encodeURIComponent(CONTACT.address)}` },
    { icon: Phone, t: 'Call', v: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone}` },
    { icon: MessageCircle, t: 'WhatsApp', v: 'Chat with our team', href: WHATSAPP_URL },
    { icon: Mail, t: 'Email', v: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: Clock, t: 'Hours', v: CONTACT.hours },
  ];
  return (
    <div className="container-x py-12 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[.24em] text-leaf">Get in touch</p>
      <h1 className="font-display mt-3 text-5xl text-forest sm:text-7xl"><SplitText as="span" text="Let's talk herbs" /></h1>
      <div className="mt-12 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <ul className="space-y-4">
          {rows.map((r) => {
            const body = <><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-lime/60 text-forest"><r.icon size={22} /></span><span><span className="block text-xs uppercase tracking-widest text-muted">{r.t}</span><span className="font-semibold text-forest break-words">{r.v}</span></span></>;
            return <li key={r.t}>{r.href ? <a href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-lg">{body}</a> : <div className="card flex items-center gap-4 p-5">{body}</div>}</li>;
          })}
        </ul>
        <ContactForm />
      </div>
    </div>
  );
}
