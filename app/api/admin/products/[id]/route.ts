import { guardAdmin } from '@/lib/auth';
import { deleteProduct, updateProduct } from '@/lib/products';
import { productSchema } from '@/lib/validation';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  const p = productSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return Response.json({ error: `${p.error.issues[0]?.path.join('.')}: ${p.error.issues[0]?.message}` }, { status: 400 });
  try {
    await updateProduct((await params).id, p.data);
    return Response.json({ ok: true });
  } catch (e) {
    if (String(e).includes('UNIQUE')) return Response.json({ error: 'That slug is already used' }, { status: 409 });
    throw e;
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  await deleteProduct((await params).id);
  return Response.json({ ok: true });
}
