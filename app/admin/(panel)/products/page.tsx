import { listProducts } from '@/lib/products';
import ProductManager from '@/app/components/admin/ProductManager';

export const metadata = { title: 'Products' };

export default async function ProductsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl text-forest sm:text-4xl">Products</h1><p className="text-muted">Edit prices, stock and visibility. Changes appear on the store within a minute.</p></div>
      <ProductManager products={await listProducts({ includeInactive: true })} />
    </div>
  );
}
