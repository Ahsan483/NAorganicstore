import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { getOrder } from '@/lib/orders';
import { PAYMENT_METHODS } from '@/lib/config';
import { waNumber } from '@/lib/notify';
import { rs } from '@/app/components/format';
import { StatusBadge } from '@/app/components/admin/StatusBadge';
import OrderControls from '@/app/components/admin/OrderControls';

export const metadata = { title: 'Order' };

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const o = await getOrder((await params).id);
  if (!o) notFound();
  const n = o.notifications;
  const flag = (v: boolean | undefined, label: string) => v === undefined ? null : <li key={label} className={v ? 'text-moss' : 'text-berry'}>{v ? '✓' : '✗'} {label}</li>;

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest"><ArrowLeft size={16} /> All orders</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl text-forest sm:text-4xl">{o.id}</h1><StatusBadge status={o.status} />
        <span className="text-sm text-muted">{new Date(o.createdAt).toLocaleString('en-PK', { dateStyle: 'full', timeStyle: 'short' })}</span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-semibold text-forest">Items</h2>
            <table className="mt-3 w-full text-sm"><tbody>
              {o.items.map((i, k) => <tr key={k} className="border-t border-forest/10"><td className="py-3">{i.title}</td><td className="text-muted">{rs(i.price)} × {i.quantity}</td><td className="text-right font-semibold">{rs(i.price * i.quantity)}</td></tr>)}
              <tr className="border-t border-forest/10"><td colSpan={2} className="py-2 text-muted">Subtotal</td><td className="text-right">{rs(o.subtotal)}</td></tr>
              <tr><td colSpan={2} className="py-1 text-muted">Delivery</td><td className="text-right">{o.shipping ? rs(o.shipping) : 'Free'}</td></tr>
              <tr><td colSpan={2} className="py-2 text-lg font-bold">Total</td><td className="text-right text-lg font-bold">{rs(o.total)}</td></tr>
            </tbody></table>
            <p className="mt-2 text-sm text-muted">{PAYMENT_METHODS[o.paymentMethod]} · <b className={o.paymentStatus === 'paid' ? 'text-moss' : 'text-berry'}>{o.paymentStatus}</b></p>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-forest">Customer</h2>
            <p className="mt-3 text-lg font-semibold">{o.customerName}</p>
            <ul className="mt-2 space-y-2 text-sm text-muted">
              <li className="flex gap-2"><Phone size={16} /> <a href={`tel:${o.phone}`} className="hover:underline">{o.phone}</a></li>
              {o.email && <li className="flex gap-2"><Mail size={16} /> <a href={`mailto:${o.email}`} className="hover:underline">{o.email}</a></li>}
              <li className="flex gap-2"><MapPin size={16} className="shrink-0" /> {o.address}, {o.city}</li>
              {o.notes && <li className="rounded-xl bg-saffron/20 p-3 text-ink">📝 {o.notes}</li>}
            </ul>
            <a className="btn btn-wa btn-sm mt-4" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${waNumber(o.phone)}?text=${encodeURIComponent(`Assalam-o-Alaikum ${o.customerName}, this is NA Organic Store regarding your order ${o.id}.`)}`}><MessageCircle size={16} /> Message on WhatsApp</a>
          </section>

          <section className="card p-6">
            <h2 className="font-semibold text-forest">Timeline</h2>
            <ol className="mt-3 space-y-3 border-l-2 border-leaf/30 pl-5 text-sm">
              {[...(o.events ?? [])].reverse().map((e, i) => <li key={i}><b className="capitalize">{e.status}</b> <span className="text-muted">· {new Date(e.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}</span>{e.note && <p className="text-muted">{e.note}</p>}</li>)}
            </ol>
          </section>
        </div>

        <div className="space-y-6">
          <OrderControls id={o.id} status={o.status} paymentStatus={o.paymentStatus} trackingNumber={o.trackingNumber} courier={o.courier} />
          <section className="card p-6">
            <h2 className="font-semibold text-forest">Notification log</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {flag(n.adminEmail, 'Admin email')}{flag(n.adminWhatsapp, 'Admin WhatsApp')}{flag(n.customerEmail, 'Customer email')}{flag(n.customerWhatsapp, 'Customer WhatsApp')}
              {!Object.keys(n).length && <li className="text-muted">Nothing recorded.</li>}
            </ul>
            {n.errors?.map((e, i) => <p key={i} className="mt-2 break-words rounded-lg bg-berry/10 p-2 text-xs text-berry">{e}</p>)}
          </section>
        </div>
      </div>
    </div>
  );
}
