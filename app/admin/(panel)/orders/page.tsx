import Link from 'next/link';
import { listOrders } from '@/lib/orders';
import { ORDER_STATUSES, STATUS_LABEL } from '@/lib/config';
import { rs } from '@/app/components/format';
import { StatusBadge } from '@/app/components/admin/StatusBadge';

export const metadata = { title: 'Orders' };
const PAGE = 20;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const { orders, total } = await listOrders({ status: sp.status, q: sp.q?.slice(0, 60), limit: PAGE, offset: (page - 1) * PAGE });
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    Object.entries({ status: sp.status, q: sp.q, ...o }).forEach(([k, v]) => v && p.set(k, v));
    return `/admin/orders?${p}`;
  };

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl text-forest sm:text-4xl">Orders</h1><p className="text-muted">{total} order{total === 1 ? '' : 's'}</p></div>

      <form className="flex flex-col gap-3 sm:flex-row" role="search">
        <input name="q" defaultValue={sp.q} placeholder="Search order #, name, phone, city…" className="input sm:max-w-sm" aria-label="Search orders" />
        <select name="status" defaultValue={sp.status || 'all'} className="input sm:w-48" aria-label="Filter by status">
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <button className="btn btn-primary">Filter</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="tbl w-full min-w-[820px]">
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Placed</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-forest/[.03]">
                <td><Link href={`/admin/orders/${o.id}`} className="font-semibold text-moss hover:underline">{o.id}</Link></td>
                <td>{o.customerName}<span className="block text-xs text-muted">{o.phone} · {o.city}</span></td>
                <td className="max-w-[220px] truncate text-muted">{o.items.map((i) => `${i.title} ×${i.quantity}`).join(', ')}</td>
                <td className="font-semibold">{rs(o.total)}</td>
                <td className="text-xs">{o.paymentMethod === 'cod' ? 'COD' : 'Transfer'} · <b className={o.paymentStatus === 'paid' ? 'text-moss' : 'text-berry'}>{o.paymentStatus}</b></td>
                <td><StatusBadge status={o.status} /></td>
                <td className="text-muted">{new Date(o.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-muted">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          {page > 1 ? <Link className="btn btn-ghost btn-sm" href={qs({ page: String(page - 1) })}>← Previous</Link> : <span />}
          <span className="text-muted">Page {page} of {pages}</span>
          {page < pages ? <Link className="btn btn-ghost btn-sm" href={qs({ page: String(page + 1) })}>Next →</Link> : <span />}
        </div>
      )}
    </div>
  );
}
