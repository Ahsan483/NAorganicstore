import { NextRequest } from 'next/server';
import { orderSchema } from '@/lib/validation';
import { createOrder, OrderError } from '@/lib/orders';
import { notifyNewOrder, customerWhatsappLink } from '@/lib/notify';
import { clean, clientIp, rateLimit, tooMany } from '@/lib/security';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  try {
    const rl = await rateLimit(`order:${ip}`, 8, 3600);
    if (!rl.ok) return tooMany(rl.retryAfter);

    const parsed = orderSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message ?? 'Invalid order' }, { status: 400 });
    }
    const d = parsed.data;
    if (d.website) return Response.json({ success: true, orderId: 'NA-OK' }); // honeypot: pretend success

    const order = await createOrder({
      customerName: clean(d.customerName, 80),
      phone: d.phone,
      email: d.email ? clean(d.email, 120) : undefined,
      address: clean(d.address, 300),
      city: clean(d.city, 60),
      notes: d.notes ? clean(d.notes, 500) : undefined,
      paymentMethod: d.paymentMethod,
      items: d.items,
      ip,
    });

    // Fire email + WhatsApp alerts (awaited so serverless doesn't freeze them; result stored on the order)
    const notifications = await notifyNewOrder(order);

    return Response.json(
      { success: true, orderId: order.id, total: order.total, whatsappLink: customerWhatsappLink(order), notified: notifications },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof OrderError) return Response.json({ error: e.message }, { status: 400 });
    console.error('[orders] failed', e);
    return Response.json({ error: 'We could not place your order. Please try again or contact us on WhatsApp.' }, { status: 500 });
  }
}
