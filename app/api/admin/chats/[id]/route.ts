import { z } from 'zod';
import { guardAdmin } from '@/lib/auth';
import { addMessage, getMessages, markRead } from '@/lib/chat';
import { clean } from '@/lib/security';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  const id = (await params).id;
  await markRead(id);
  const after = Number(new URL(req.url).searchParams.get('after')) || 0;
  return Response.json({ messages: await getMessages(id, after) });
}

export async function POST(req: Request, { params }: Ctx) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  const p = z.object({ message: z.string().trim().min(1).max(1000) }).safeParse(await req.json().catch(() => null));
  if (!p.success) return Response.json({ error: 'Invalid message' }, { status: 400 });
  await addMessage((await params).id, 'admin', clean(p.data.message, 1000));
  return Response.json({ ok: true });
}
