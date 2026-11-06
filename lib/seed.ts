import type { Client } from '@libsql/client';

/** Initial catalogue — inserted once when the products table is empty. Edit afterwards from /admin/products. */
const SEED = [
  {
    id: '1', slug: 'pro-herbal-hair-oil', title: 'Pro Herbal Hair Oil',
    description: 'Premium blend of natural oils to strengthen and nourish your hair deeply. Infused with argan, coconut, and jojoba oils. Perfect for all hair types.',
    image: '/images/products/herbal-oil-new.png', price: 1000, original: 1200, category: 'Hair Care', rating: 4.8, reviews: 124,
  },
  {
    id: '5', slug: 'pro-herbal-shampoo', title: 'Pro Herbal Shampoo',
    description: 'Premium herbal shampoo with natural extracts. Professional strength formula for healthy, strong hair.',
    image: '/images/products/pro-herbal-shampoo-new.png', price: 800, original: 1000, category: 'Hair Care', rating: 4.9, reviews: 203,
  },
  {
    id: '3', slug: 'beauty-cream', title: 'Beauty Cream',
    description: 'Natural brightening cream for melasma, freckles, and wrinkles. Infused with plant extracts for radiant skin.',
    image: '/images/products/brightening-cream-bg.png', price: 600, original: 800, category: 'Skin Care', rating: 4.7, reviews: 95,
  },
  {
    id: '4', slug: 'neem-soap', title: 'Neem Soap',
    description: 'Herbal neem soap with anti-bacterial properties. Natural moisturizer for healthy skin. Perfect for daily use.',
    image: '/images/products/neem-soap-bg.png', price: 250, original: 350, category: 'Skin Care', rating: 4.5, reviews: 156,
  },
  {
    id: '6', slug: 'shafi-surma', title: 'Shafi Surma',
    description: 'Premium herbal surma with natural ingredients. Protects and nourishes delicate eye area. Pure organic formula.',
    image: '/images/products/eye-serum-bg.png', price: 500, original: 650, category: 'Eye Care', rating: 4.8, reviews: 87,
  },
  {
    id: '7', slug: 'safoof-e-hazma-digestive-powder', title: 'Safoof-e-Hazma Digestive Powder',
    urduTitle: 'سفوفِ ہاضمہ',
    description: 'A natural herbal digestive powder made from traditional ingredients. Supports healthy digestion, eases stomach discomfort and improves appetite. Pure herbs for everyday digestive care.',
    urduDescription: 'ایک قدرتی جڑی بوٹیوں سے بنا ہوا ہاضمے کو درست رکھنے والا پاؤڈر جو روایتی اجزاء سے تیار کیا گیا ہے۔ یہ صحت مند ہاضمے کو سپورٹ کرتا ہے، پیٹ کی تکلیف کو کم کرتا ہے اور بھوک میں اضافہ کرتا ہے۔ خالص جڑی بوٹیوں سے روز مرہ کی صحت اور ہاضمے کی دیکھ بھال کے لیے تیار۔',
    image: '/images/products/herbal-powder-1-bg.png', price: 800, original: 1000, category: 'Herbal Powders', rating: 4.6, reviews: 72,
  },
  {
    id: '8', slug: 'sugar-control-herbal-powder', title: 'Sugar Control Herbal Powder',
    urduTitle: 'شوگر کنٹرول',
    description: 'A herbal wellness powder made from natural ingredients to help maintain healthy sugar balance. Pure traditional herbs for daily use and natural health support.',
    urduDescription: 'ایک جڑی بوٹیوں سے بنا ہوا صحت کا پاؤڈر جو قدرتی اجزاء سے خصوصی طور پر تیار کیا گیا ہے۔ یہ صحت مند شوگر کے توازن کو برقرار رکھنے میں مدد دیتا ہے اور مکمل صحت کی فلاح و بہبود کے لیے تیار۔ خالص روایتی جڑی بوٹیوں سے روز مرہ کے استعمال اور قدرتی صحت کی سپورٹ کے لیے۔',
    image: '/images/products/herbal-powder-2-bg.png', price: 800, original: 1000, category: 'Herbal Powders', rating: 4.6, reviews: 68,
  },
] as Array<{
  id: string; slug: string; title: string; urduTitle?: string; description: string; urduDescription?: string;
  image: string; price: number; original: number; category: string; rating: number; reviews: number;
}>;

export async function seedProductsIfEmpty(c: Client) {
  const r = await c.execute('SELECT COUNT(*) AS n FROM products');
  if (Number(r.rows[0].n) > 0) return;
  await c.batch(
    SEED.map((p, i) => ({
      sql: `INSERT OR IGNORE INTO products
        (id, slug, title, urdu_title, description, urdu_description, image, images, price, original_price, category, rating, reviews, stock, active, sort)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,100,1,?)`,
      args: [p.id, p.slug, p.title, p.urduTitle ?? null, p.description, p.urduDescription ?? null, p.image,
        JSON.stringify([p.image]), p.price, p.original, p.category, p.rating, p.reviews, i],
    })),
    'write',
  );
}
