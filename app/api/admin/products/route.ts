import { guardAdmin } from '@/lib/auth';
import { createProduct } from '@/lib/products';
import { productSchema } from '@/lib/validation';

export async function POST(req: Request) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  const p = productSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return Response.json({ error: `${p.error.issues[0]?.path.join('.')}: ${p.error.issues[0]?.message}` }, { status: 400 });
  try {
    const id = await createProduct(p.data);
    return Response.json({ id }, { status: 201 });
  } catch (e) {
    if (String(e).includes('UNIQUE')) return Response.json({ error: 'That slug is already used' }, { status: 409 });
    throw e;
  }
}
