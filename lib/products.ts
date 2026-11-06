import { db } from './db';
import type { Product } from './types';

type Row = Record<string, unknown>;

function map(r: Row): Product {
  let images: string[] = [];
  try { images = JSON.parse(String(r.images || '[]')); } catch { /* ignore */ }
  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title),
    urduTitle: (r.urdu_title as string) || null,
    description: String(r.description),
    urduDescription: (r.urdu_description as string) || null,
    image: String(r.image),
    images: images.length ? images : [String(r.image)],
    price: Number(r.price),
    originalPrice: Number(r.original_price),
    category: String(r.category),
    rating: Number(r.rating),
    reviews: Number(r.reviews),
    stock: Number(r.stock),
    active: Number(r.active) === 1,
    sort: Number(r.sort),
  };
}

export async function listProducts(opts: { includeInactive?: boolean } = {}): Promise<Product[]> {
  const c = await db();
  const r = await c.execute(
    `SELECT * FROM products ${opts.includeInactive ? '' : 'WHERE active = 1'} ORDER BY sort ASC, created_at ASC`,
  );
  return r.rows.map((x) => map(x as Row));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const c = await db();
  const r = await c.execute({ sql: 'SELECT * FROM products WHERE slug = ? AND active = 1', args: [slug] });
  return r.rows[0] ? map(r.rows[0] as Row) : null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  const c = await db();
  const r = await c.execute({
    sql: `SELECT * FROM products WHERE id IN (${ids.map(() => '?').join(',')})`,
    args: ids,
  });
  return r.rows.map((x) => map(x as Row));
}

export interface ProductInput {
  title: string;
  slug: string;
  urduTitle?: string | null;
  description: string;
  urduDescription?: string | null;
  image: string;
  price: number;
  originalPrice: number;
  category: string;
  stock: number;
  active: boolean;
  sort?: number;
}

export async function createProduct(p: ProductInput): Promise<string> {
  const c = await db();
  const id = crypto.randomUUID().slice(0, 8);
  await c.execute({
    sql: `INSERT INTO products (id, slug, title, urdu_title, description, urdu_description, image, images, price, original_price, category, stock, active, sort)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [id, p.slug, p.title, p.urduTitle ?? null, p.description, p.urduDescription ?? null, p.image,
      JSON.stringify([p.image]), p.price, p.originalPrice, p.category, p.stock, p.active ? 1 : 0, p.sort ?? 99],
  });
  return id;
}

export async function updateProduct(id: string, p: ProductInput): Promise<void> {
  const c = await db();
  await c.execute({
    sql: `UPDATE products SET slug=?, title=?, urdu_title=?, description=?, urdu_description=?, image=?, images=?,
          price=?, original_price=?, category=?, stock=?, active=?, sort=COALESCE(?, sort) WHERE id=?`,
    args: [p.slug, p.title, p.urduTitle ?? null, p.description, p.urduDescription ?? null, p.image,
      JSON.stringify([p.image]), p.price, p.originalPrice, p.category, p.stock, p.active ? 1 : 0, p.sort ?? null, id],
  });
}

export async function deleteProduct(id: string): Promise<void> {
  // Soft-delete so historical orders keep their references.
  const c = await db();
  await c.execute({ sql: 'UPDATE products SET active = 0 WHERE id = ?', args: [id] });
}
