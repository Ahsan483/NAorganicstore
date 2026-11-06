import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createSession } from '@/lib/auth';
import { clientIp, rateLimit, tooMany, verifyPassword } from '@/lib/security';
import { timingSafeEqual } from 'node:crypto';

const schema = z.object({ username: z.string().max(80), password: z.string().max(200) });

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = await rateLimit(`login:${ip}`, 6, 900);
  if (!rl.ok) return tooMany(rl.retryAfter);

  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== req.headers.get('host')) return Response.json({ error: 'Bad origin' }, { status: 403 });

  const p = schema.safeParse(await req.json().catch(() => null));
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  let ok = false;
  if (p.success) {
    const a = Buffer.from(p.data.username.padEnd(80));
    const b = Buffer.from(expectedUser.padEnd(80));
    const userOk = a.length === b.length && timingSafeEqual(a, b);
    const passOk = await verifyPassword(p.data.password); // always run to keep timing uniform
    ok = userOk && passOk;
  }
  if (!ok) return Response.json({ error: 'Invalid username or password' }, { status: 401 });
  await createSession(expectedUser);
  return Response.json({ ok: true });
}
