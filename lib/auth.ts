import { SignJWT, jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';

export const SESSION_COOKIE = 'na_admin';
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET must be set (min 32 chars).');
    return new TextEncoder().encode('dev-only-insecure-secret-change-me-please-0000');
  }
  return new TextEncoder().encode(s);
}

export async function createSession(username: string) {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getAdmin(): Promise<{ username: string } | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] });
    if (payload.role !== 'admin' || !payload.sub) return null;
    return { username: payload.sub };
  } catch {
    return null;
  }
}

/** For route handlers: returns a Response when unauthorised, otherwise null. Also enforces same-origin on writes. */
export async function guardAdmin(req: Request): Promise<Response | null> {
  const admin = await getAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!['GET', 'HEAD'].includes(req.method)) {
    const origin = req.headers.get('origin');
    const host = (await headers()).get('host');
    if (!origin || new URL(origin).host !== host) {
      return Response.json({ error: 'Bad origin' }, { status: 403 });
    }
  }
  return null;
}
