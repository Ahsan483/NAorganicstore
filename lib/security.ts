import { createHash, randomBytes, scrypt as _scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { db } from './db';

const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export function clientIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for');
  return (xf?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown').trim();
}

export function sha256(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}

export function randomToken(bytes = 24): string {
  return randomBytes(bytes).toString('base64url');
}

/** Fixed-window rate limiter stored in the database (works across serverless instances). */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<{ ok: boolean; retryAfter: number }> {
  const c = await db();
  const now = Math.floor(Date.now() / 1000);
  const r = await c.execute({ sql: 'SELECT count, reset_at FROM rate_limits WHERE key = ?', args: [key] });
  const row = r.rows[0];
  if (!row || Number(row.reset_at) <= now) {
    await c.execute({
      sql: 'INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = 1, reset_at = excluded.reset_at',
      args: [key, now + windowSec],
    });
    return { ok: true, retryAfter: 0 };
  }
  if (Number(row.count) >= limit) return { ok: false, retryAfter: Number(row.reset_at) - now };
  await c.execute({ sql: 'UPDATE rate_limits SET count = count + 1 WHERE key = ?', args: [key] });
  return { ok: true, retryAfter: 0 };
}

export function tooMany(retryAfter: number) {
  return Response.json(
    { error: 'Too many requests. Please try again shortly.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  );
}

/** Hash for ADMIN_PASSWORD_HASH: "scrypt$<saltHex>$<hashHex>" */
export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(16);
  const h = await scrypt(pw, salt, 64);
  return `scrypt$${salt.toString('hex')}$${h.toString('hex')}`;
}

export async function verifyPassword(pw: string): Promise<boolean> {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (stored) {
    const [scheme, saltHex, hashHex] = stored.split('$');
    if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
    const expected = Buffer.from(hashHex, 'hex');
    const actual = await scrypt(pw, Buffer.from(saltHex, 'hex'), expected.length);
    return timingSafeEqual(actual, expected);
  }
  const plain = process.env.ADMIN_PASSWORD;
  if (!plain) return false;
  const a = createHash('sha256').update(pw).digest();
  const b = createHash('sha256').update(plain).digest();
  return timingSafeEqual(a, b);
}

/** Strip control chars & collapse whitespace; React escapes output, emails escape separately. */
export function clean(s: string, max = 500): string {
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
