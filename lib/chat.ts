import { db, iso } from './db';
import { randomToken, sha256 } from './security';
import type { ChatMessage, ChatSession } from './types';

export async function startChat(name: string | undefined, phone: string | undefined, first: string) {
  const c = await db();
  const id = randomToken(9);
  const token = randomToken(24);
  await c.batch(
    [
      { sql: 'INSERT INTO chat_sessions (id, token_hash, name, phone, unread_admin) VALUES (?,?,?,?,1)', args: [id, sha256(token), name || null, phone || null] },
      { sql: "INSERT INTO chat_messages (session_id, sender, body) VALUES (?, 'customer', ?)", args: [id, first] },
    ],
    'write',
  );
  return { id, token };
}

export async function verifyChat(id: string, token: string): Promise<boolean> {
  const c = await db();
  const r = await c.execute({ sql: 'SELECT token_hash FROM chat_sessions WHERE id = ?', args: [id] });
  return !!r.rows[0] && r.rows[0].token_hash === sha256(token);
}

export async function addMessage(sessionId: string, sender: 'customer' | 'admin', body: string) {
  const c = await db();
  await c.batch(
    [
      { sql: 'INSERT INTO chat_messages (session_id, sender, body) VALUES (?,?,?)', args: [sessionId, sender, body] },
      sender === 'customer'
        ? { sql: "UPDATE chat_sessions SET unread_admin = unread_admin + 1, last_message_at = datetime('now') WHERE id = ?", args: [sessionId] }
        : { sql: "UPDATE chat_sessions SET unread_admin = 0, last_message_at = datetime('now') WHERE id = ?", args: [sessionId] },
    ],
    'write',
  );
}

export async function getMessages(sessionId: string, afterId = 0): Promise<ChatMessage[]> {
  const c = await db();
  const r = await c.execute({
    sql: 'SELECT id, sender, body, created_at FROM chat_messages WHERE session_id = ? AND id > ? ORDER BY id LIMIT 200',
    args: [sessionId, afterId],
  });
  return r.rows.map((m) => ({ id: Number(m.id), sender: String(m.sender) as 'customer' | 'admin', body: String(m.body), createdAt: iso(String(m.created_at)) }));
}

export async function listSessions(): Promise<ChatSession[]> {
  const c = await db();
  const r = await c.execute(
    `SELECT s.*, (SELECT body FROM chat_messages m WHERE m.session_id = s.id ORDER BY m.id DESC LIMIT 1) AS last_body
     FROM chat_sessions s ORDER BY s.last_message_at DESC LIMIT 100`,
  );
  return r.rows.map((s) => ({
    id: String(s.id), name: (s.name as string) || null, phone: (s.phone as string) || null,
    createdAt: iso(String(s.created_at)), lastMessageAt: iso(String(s.last_message_at)),
    unreadAdmin: Number(s.unread_admin), lastMessage: (s.last_body as string) || '',
  }));
}

export async function markRead(sessionId: string) {
  const c = await db();
  await c.execute({ sql: 'UPDATE chat_sessions SET unread_admin = 0 WHERE id = ?', args: [sessionId] });
}
