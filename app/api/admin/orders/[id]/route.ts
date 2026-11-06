import { guardAdmin } from '@/lib/auth';
import { getOrder, updateOrder } from '@/lib/orders';
import { orderUpdateSchema } from '@/lib/validation';
import { emailStatusUpdate, whatsappStatusUpdate } from '@/lib/notify';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  const o = await getOrder((await params).id);
  return o ? Response.json(o) : Response.json({ error: 'Not found' }, { status: 404 });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  const id = (await params).id;
  const p = orderUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return Response.json({ error: 'Invalid update' }, { status: 400 });
  const before = await getOrder(id);
  if (!before) return Response.json({ error: 'Not found' }, { status: 404 });
  if (before.status === 'cancelled' && p.data.status && p.data.status !== 'cancelled') {
    return Response.json({ error: 'A cancelled order cannot be reopened. Ask the customer to place a new order.' }, { status: 400 });
  }
  const o = await updateOrder(id, p.data);
  let notified: { email: boolean; whatsapp: boolean } | null = null;
  if (o && p.data.status && p.data.status !== before.status && p.data.status !== 'pending') {
    const [email, whatsapp] = await Promise.all([emailStatusUpdate(o), whatsappStatusUpdate(o)]);
    notified = { email, whatsapp };
  }
  return Response.json({ order: o, notified });
}
