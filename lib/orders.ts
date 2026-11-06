import { randomInt } from 'node:crypto';
import { db, iso } from './db';
import { calcShipping, type OrderStatus, type PaymentMethod } from './config';
import { getProductsByIds } from './products';
import { normalizePhone } from './validation';
import type { NotifyResult, Order, OrderEvent, OrderItem } from './types';

type Row = Record<string, unknown>;

function mapOrder(r: Row, items: OrderItem[], events?: OrderEvent[]): Order {
  let notifications: NotifyResult = {};
  try { notifications = JSON.parse(String(r.notifications || '{}')); } catch { /* ignore */ }
  return {
    id: String(r.id),
    customerName: String(r.customer_name),
    phone: String(r.phone),
    email: (r.email as string) || null,
    address: String(r.address),
    city: String(r.city),
    notes: (r.notes as string) || null,
    paymentMethod: String(r.payment_method) as PaymentMethod,
    paymentStatus: String(r.payment_status) as 'unpaid' | 'paid',
    subtotal: Number(r.subtotal),
    shipping: Number(r.shipping),
    total: Number(r.total),
    status: String(r.status) as OrderStatus,
    trackingNumber: (r.tracking_number as string) || null,
    courier: (r.courier as string) || null,
    notifications,
    createdAt: iso(String(r.created_at)),
    updatedAt: iso(String(r.updated_at)),
    items,
    events,
  };
}

function newOrderId(): string {
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  return `NA-${ymd}-${randomInt(1000, 10000)}`;
}

export class OrderError extends Error {}

export interface NewOrderInput {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  items: { id: string; quantity: number }[];
  ip?: string;
}

/** Prices, totals and stock are ALWAYS taken from the database — never from the client. */
export async function createOrder(input: NewOrderInput): Promise<Order> {
  const phone = normalizePhone(input.phone);
  if (!phone) throw new OrderError('Invalid phone number');

  // merge duplicate lines
  const qty = new Map<string, number>();
  for (const it of input.items) qty.set(it.id, Math.min(20, (qty.get(it.id) ?? 0) + it.quantity));
  const products = await getProductsByIds([...qty.keys()]);
  const byId = new Map(products.map((p) => [p.id, p]));

  const items: OrderItem[] = [];
  for (const [id, q] of qty) {
    const p = byId.get(id);
    if (!p || !p.active) throw new OrderError('One of the products in your cart is no longer available.');
    if (p.stock < q) throw new OrderError(`Sorry, only ${p.stock} of "${p.title}" left in stock.`);
    items.push({ productId: p.id, title: p.title, price: p.price, quantity: q, image: p.image });
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;
  const c = await db();

  for (let attempt = 0; attempt < 5; attempt++) {
    const id = newOrderId();
    try {
      await c.batch(
        [
          {
            sql: `INSERT INTO orders (id, customer_name, phone, email, address, city, notes, payment_method, subtotal, shipping, total, ip)
                  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
            args: [id, input.customerName, phone, input.email || null, input.address, input.city, input.notes || null,
              input.paymentMethod, subtotal, shipping, total, input.ip ?? null],
          },
          ...items.map((i) => ({
            sql: 'INSERT INTO order_items (order_id, product_id, title, price, quantity, image) VALUES (?,?,?,?,?,?)',
            args: [id, i.productId, i.title, i.price, i.quantity, i.image],
          })),
          ...items.map((i) => ({
            sql: 'UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?',
            args: [i.quantity, i.productId],
          })),
          { sql: `INSERT INTO order_events (order_id, status, note) VALUES (?, 'pending', 'Order placed')`, args: [id] },
        ],
        'write',
      );
      const o = await getOrder(id);
      return o!;
    } catch (e) {
      if (String(e).includes('UNIQUE') && attempt < 4) continue;
      throw e;
    }
  }
  throw new OrderError('Could not create order, please retry.');
}

async function loadItems(ids: string[]): Promise<Map<string, OrderItem[]>> {
  const m = new Map<string, OrderItem[]>();
  if (!ids.length) return m;
  const c = await db();
  const r = await c.execute({
    sql: `SELECT * FROM order_items WHERE order_id IN (${ids.map(() => '?').join(',')}) ORDER BY id`,
    args: ids,
  });
  for (const x of r.rows) {
    const k = String(x.order_id);
    const arr = m.get(k) ?? [];
    arr.push({ productId: String(x.product_id), title: String(x.title), price: Number(x.price), quantity: Number(x.quantity), image: String(x.image) });
    m.set(k, arr);
  }
  return m;
}

export async function getOrder(id: string): Promise<Order | null> {
  const c = await db();
  const r = await c.execute({ sql: 'SELECT * FROM orders WHERE id = ?', args: [id] });
  if (!r.rows[0]) return null;
  const items = (await loadItems([id])).get(id) ?? [];
  const ev = await c.execute({ sql: 'SELECT status, note, created_at FROM order_events WHERE order_id = ? ORDER BY id', args: [id] });
  const events = ev.rows.map((e) => ({ status: String(e.status), note: (e.note as string) || null, createdAt: iso(String(e.created_at)) }));
  return mapOrder(r.rows[0] as Row, items, events);
}

/** Public tracking: requires the order number AND the phone number used on the order. */
export async function trackOrder(id: string, phone: string): Promise<Order | null> {
  const o = await getOrder(id.trim().toUpperCase());
  const p = normalizePhone(phone);
  if (!o || !p || o.phone !== p) return null;
  return o;
}

export async function listOrders(opts: { status?: string; q?: string; limit?: number; offset?: number } = {}) {
  const c = await db();
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (opts.status && opts.status !== 'all') { where.push('status = ?'); args.push(opts.status); }
  if (opts.q) {
    where.push('(id LIKE ? OR customer_name LIKE ? OR phone LIKE ? OR city LIKE ?)');
    const like = `%${opts.q}%`;
    args.push(like, like, like, like);
  }
  const w = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const total = Number((await c.execute({ sql: `SELECT COUNT(*) n FROM orders ${w}`, args })).rows[0].n);
  const r = await c.execute({
    sql: `SELECT * FROM orders ${w} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
    args: [...args, opts.limit ?? 25, opts.offset ?? 0],
  });
  const items = await loadItems(r.rows.map((x) => String(x.id)));
  return { total, orders: r.rows.map((x) => mapOrder(x as Row, items.get(String(x.id)) ?? [])) };
}

export async function updateOrder(
  id: string,
  patch: { status?: OrderStatus; paymentStatus?: 'unpaid' | 'paid'; trackingNumber?: string | null; courier?: string | null; note?: string },
): Promise<Order | null> {
  const c = await db();
  const cur = await getOrder(id);
  if (!cur) return null;
  const stmts = [];
  const sets: string[] = ["updated_at = datetime('now')"];
  const args: (string | number | null)[] = [];
  if (patch.status && patch.status !== cur.status) {
    sets.push('status = ?'); args.push(patch.status);
    stmts.push({ sql: 'INSERT INTO order_events (order_id, status, note) VALUES (?,?,?)', args: [id, patch.status, patch.note ?? null] });
    if (patch.status === 'cancelled' && cur.status !== 'cancelled') {
      for (const i of cur.items) stmts.push({ sql: 'UPDATE products SET stock = stock + ? WHERE id = ?', args: [i.quantity, i.productId] });
    }
    if (patch.status === 'delivered' && cur.paymentMethod === 'cod') { sets.push("payment_status = 'paid'"); }
  }
  if (patch.paymentStatus) { sets.push('payment_status = ?'); args.push(patch.paymentStatus); }
  if (patch.trackingNumber !== undefined) { sets.push('tracking_number = ?'); args.push(patch.trackingNumber || null); }
  if (patch.courier !== undefined) { sets.push('courier = ?'); args.push(patch.courier || null); }
  await c.batch([{ sql: `UPDATE orders SET ${sets.join(', ')} WHERE id = ?`, args: [...args, id] }, ...stmts], 'write');
  return getOrder(id);
}

export async function saveNotifications(id: string, n: NotifyResult) {
  const c = await db();
  await c.execute({ sql: 'UPDATE orders SET notifications = ? WHERE id = ?', args: [JSON.stringify(n), id] });
}

export async function getStats() {
  const c = await db();
  const one = async (sql: string, args: (string | number)[] = []) => Number((await c.execute({ sql, args })).rows[0]?.n ?? 0);
  const today = new Date().toISOString().slice(0, 10);
  const [orders, todayOrders, pending, revenue, todayRevenue, delivered, shipped, cancelled, customers] = await Promise.all([
    one('SELECT COUNT(*) n FROM orders'),
    one('SELECT COUNT(*) n FROM orders WHERE date(created_at) = ?', [today]),
    one("SELECT COUNT(*) n FROM orders WHERE status IN ('pending','confirmed','processing')"),
    one("SELECT COALESCE(SUM(total),0) n FROM orders WHERE status != 'cancelled'"),
    one("SELECT COALESCE(SUM(total),0) n FROM orders WHERE status != 'cancelled' AND date(created_at) = ?", [today]),
    one("SELECT COUNT(*) n FROM orders WHERE status = 'delivered'"),
    one("SELECT COUNT(*) n FROM orders WHERE status = 'shipped'"),
    one("SELECT COUNT(*) n FROM orders WHERE status = 'cancelled'"),
    one('SELECT COUNT(DISTINCT phone) n FROM orders'),
  ]);
  const daily = await c.execute(
    `SELECT date(created_at) d, COUNT(*) orders, COALESCE(SUM(CASE WHEN status!='cancelled' THEN total END),0) revenue
     FROM orders WHERE created_at >= datetime('now','-13 days') GROUP BY d ORDER BY d`,
  );
  const top = await c.execute(
    `SELECT oi.title, SUM(oi.quantity) qty, SUM(oi.quantity*oi.price) revenue FROM order_items oi
     JOIN orders o ON o.id = oi.order_id WHERE o.status != 'cancelled' GROUP BY oi.product_id, oi.title ORDER BY qty DESC LIMIT 5`,
  );
  const low = await c.execute('SELECT title, stock FROM products WHERE active = 1 AND stock <= 10 ORDER BY stock LIMIT 5');
  const unreadChats = await one('SELECT COALESCE(SUM(unread_admin),0) n FROM chat_sessions');
  return {
    orders, todayOrders, pending, revenue, todayRevenue, delivered, shipped, cancelled, customers, unreadChats,
    daily: daily.rows.map((r) => ({ date: String(r.d), orders: Number(r.orders), revenue: Number(r.revenue) })),
    top: top.rows.map((r) => ({ title: String(r.title), qty: Number(r.qty), revenue: Number(r.revenue) })),
    low: low.rows.map((r) => ({ title: String(r.title), stock: Number(r.stock) })),
  };
}
