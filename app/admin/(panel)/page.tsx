import Link from 'next/link';
import { AlertTriangle, Banknote, CheckCircle2, Clock, MessageSquare, ShoppingCart, Truck, Users, XCircle } from 'lucide-react';
import { getStats, listOrders } from '@/lib/orders';
import { rs } from '@/app/components/format';
import { StatusBadge } from '@/app/components/admin/StatusBadge';

export const metadata = { title: 'Dashboard' };

export default async function Dashboard() {
  const [s, recent] = await Promise.all([getStats(), listOrders({ limit: 6 })]);

  const now = new Date().getTime(); // server component: evaluated per request
  // build a continuous 14-day series
  const days: { date: string; orders: number; revenue: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 86400000).toISOString().slice(0, 10);
    const f = s.daily.find((x) => x.date === d);
    days.push({ date: d, orders: f?.orders ?? 0, revenue: f?.revenue ?? 0 });
  }
  const max = Math.max(1, ...days.map((d) => d.revenue));

  const cards = [
    { l: 'Total orders', v: s.orders, i: ShoppingCart, c: 'bg-forest text-white' },
    { l: "Today's orders", v: s.todayOrders, sub: rs(s.todayRevenue), i: Clock, c: 'bg-white' },
    { l: 'Revenue', v: rs(s.revenue), i: Banknote, c: 'bg-white' },
    { l: 'To process', v: s.pending, i: AlertTriangle, c: 'bg-saffron/30' },
    { l: 'Shipped', v: s.shipped, i: Truck, c: 'bg-white' },
    { l: 'Delivered', v: s.delivered, i: CheckCircle2, c: 'bg-lime/50' },
    { l: 'Cancelled', v: s.cancelled, i: XCircle, c: 'bg-white' },
    { l: 'Customers', v: s.customers, i: Users, c: 'bg-white' },
  ];

  return (
    <div className="space-y-8">
      <div><h1 className="font-display text-3xl text-forest sm:text-4xl">Dashboard</h1><p className="text-muted">Overview of your store</p></div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.l} className={`rounded-3xl p-5 ring-1 ring-forest/10 ${c.c}`}>
            <c.i size={20} className="opacity-60" />
            <p className="mt-3 text-2xl font-bold sm:text-3xl">{c.v}</p>
            <p className="text-xs uppercase tracking-wider opacity-70">{c.l}{c.sub ? ` · ${c.sub}` : ''}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="card p-6" aria-label="Revenue last 14 days">
          <h2 className="font-semibold text-forest">Revenue · last 14 days</h2>
          <div className="mt-6 flex h-48 items-end gap-1.5 sm:gap-2" role="img" aria-label="Bar chart of daily revenue">
            {days.map((d) => (
              <div key={d.date} className="group relative flex h-full flex-1 flex-col justify-end">
                <div className="rounded-t-lg bg-leaf transition-colors group-hover:bg-forest" style={{ height: `${Math.max(2, (d.revenue / max) * 100)}%` }} />
                <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-forest px-2 py-1 text-xs text-white group-hover:block">{d.date.slice(5)} · {d.orders} orders · {rs(d.revenue)}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted"><span>{days[0].date.slice(5)}</span><span>{days[13].date.slice(5)}</span></div>
        </section>

        <section className="card p-6">
          <h2 className="font-semibold text-forest">Top products</h2>
          <ul className="mt-4 space-y-3">
            {s.top.length === 0 && <li className="text-sm text-muted">No sales yet.</li>}
            {s.top.map((t) => <li key={t.title} className="flex justify-between gap-3 text-sm"><span className="truncate">{t.title}</span><span className="shrink-0 font-semibold">{t.qty} sold · {rs(t.revenue)}</span></li>)}
          </ul>
          {s.low.length > 0 && (<><h3 className="mt-6 flex items-center gap-2 text-sm font-semibold text-berry"><AlertTriangle size={16} /> Low stock</h3>
            <ul className="mt-2 space-y-1 text-sm">{s.low.map((l) => <li key={l.title} className="flex justify-between"><span>{l.title}</span><b>{l.stock}</b></li>)}</ul></>)}
          {s.unreadChats > 0 && <Link href="/admin/chats" className="btn btn-lime btn-sm mt-6"><MessageSquare size={16} /> {s.unreadChats} unread chat message{s.unreadChats > 1 ? 's' : ''}</Link>}
        </section>
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-2"><h2 className="font-semibold text-forest">Recent orders</h2><Link href="/admin/orders" className="text-sm font-semibold text-moss">View all →</Link></div>
        <div className="overflow-x-auto">
          <table className="tbl w-full min-w-[640px]">
            <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Placed</th></tr></thead>
            <tbody>
              {recent.orders.map((o) => (
                <tr key={o.id}>
                  <td><Link href={`/admin/orders/${o.id}`} className="font-semibold text-moss hover:underline">{o.id}</Link></td>
                  <td>{o.customerName}<span className="block text-xs text-muted">{o.city}</span></td>
                  <td>{rs(o.total)}</td><td><StatusBadge status={o.status} /></td>
                  <td className="text-muted">{new Date(o.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                </tr>
              ))}
              {recent.orders.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-muted">No orders yet. They will appear here the moment a customer orders.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
