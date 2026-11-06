import { NextRequest } from 'next/server';
import { z } from 'zod';
import { trackOrder } from '@/lib/orders';
import { clientIp, rateLimit, tooMany } from '@/lib/security';

const schema = z.object({ order: z.string().trim().max(30), phone: z.string().trim().max(25) });

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`track:${clientIp(req)}`, 15, 600);
  if (!rl.ok) return tooMany(rl.retryAfter);
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return Response.json({ error: 'Enter your order number and phone number.' }, { status: 400 });
  const o = await trackOrder(p.data.order, p.data.phone);
  if (!o) return Response.json({ error: 'No order found with those details.' }, { status: 404 });
  return Response.json({
    id: o.id, status: o.status, createdAt: o.createdAt, total: o.total, shipping: o.shipping, subtotal: o.subtotal,
    city: o.city, paymentMethod: o.paymentMethod, paymentStatus: o.paymentStatus,
    trackingNumber: o.trackingNumber, courier: o.courier, items: o.items, events: o.events,
  });
}
