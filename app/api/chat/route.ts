import { NextRequest } from 'next/server';
import { chatSendSchema, chatStartSchema } from '@/lib/validation';
import { addMessage, getMessages, startChat, verifyChat } from '@/lib/chat';
import { notifyAdminChat } from '@/lib/notify';
import { clean, clientIp, rateLimit, tooMany } from '@/lib/security';

/** Visitor poll: GET /api/chat?s=<id>&t=<token>&after=<lastMsgId> */
export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams;
  const s = u.get('s') || '', t = u.get('t') || '';
  const rl = await rateLimit(`chatpoll:${clientIp(req)}`, 120, 60);
  if (!rl.ok) return tooMany(rl.retryAfter);
  if (!s || !t || !(await verifyChat(s, t))) return Response.json({ error: 'Invalid session' }, { status: 401 });
  return Response.json({ messages: await getMessages(s, Number(u.get('after')) || 0) });
}

/** POST { message, name?, phone? } starts a chat; POST { sessionId, token, message } continues it. */
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = await rateLimit(`chat:${ip}`, 30, 600);
  if (!rl.ok) return tooMany(rl.retryAfter);
  const body = await req.json().catch(() => null);

  if (body && typeof body === 'object' && 'sessionId' in body) {
    const p = chatSendSchema.safeParse(body);
    if (!p.success) return Response.json({ error: 'Invalid message' }, { status: 400 });
    if (!(await verifyChat(p.data.sessionId, p.data.token))) return Response.json({ error: 'Invalid session' }, { status: 401 });
    await addMessage(p.data.sessionId, 'customer', clean(p.data.message, 1000));
    return Response.json({ ok: true });
  }

  const p = chatStartSchema.safeParse(body);
  if (!p.success) return Response.json({ error: 'Please type a message' }, { status: 400 });
  const msg = clean(p.data.message, 1000);
  const name = p.data.name ? clean(p.data.name, 60) : undefined;
  const { id, token } = await startChat(name, p.data.phone ? clean(p.data.phone, 25) : undefined, msg);
  await notifyAdminChat(name ?? null, msg).catch(() => {}); // alert admin only when a new conversation starts
  return Response.json({ sessionId: id, token });
}
