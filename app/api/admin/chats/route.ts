import { guardAdmin } from '@/lib/auth';
import { listSessions } from '@/lib/chat';

export async function GET(req: Request) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  return Response.json({ sessions: await listSessions() });
}
