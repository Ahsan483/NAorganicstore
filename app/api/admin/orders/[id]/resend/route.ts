import { guardAdmin } from '@/lib/auth';
import { getOrder } from '@/lib/orders';
import { notifyNewOrder } from '@/lib/notify';

/** Re-send the new-order email + WhatsApp alerts (e.g. after fixing credentials). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  const o = await getOrder((await params).id);
  if (!o) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(await notifyNewOrder(o));
}
