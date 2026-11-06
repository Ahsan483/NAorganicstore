import { NextRequest } from 'next/server';
import { contactSchema } from '@/lib/validation';
import { db } from '@/lib/db';
import { notifyAdminContact } from '@/lib/notify';
import { clean, clientIp, rateLimit, tooMany } from '@/lib/security';

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`contact:${clientIp(req)}`, 5, 3600);
  if (!rl.ok) return tooMany(rl.retryAfter);
  const p = contactSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return Response.json({ error: p.error.issues[0]?.message ?? 'Invalid message' }, { status: 400 });
  if (p.data.website) return Response.json({ success: true });
  const d = { name: clean(p.data.name, 80), email: p.data.email || undefined, phone: p.data.phone ? clean(p.data.phone, 25) : undefined, message: clean(p.data.message, 2000) };
  const c = await db();
  await c.execute({ sql: 'INSERT INTO contact_messages (name, email, phone, message) VALUES (?,?,?,?)', args: [d.name, d.email ?? null, d.phone ?? null, d.message] });
  await notifyAdminContact(d).catch((e) => console.error('[contact] notify failed', e));
  return Response.json({ success: true });
}
