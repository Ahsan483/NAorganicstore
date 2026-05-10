'use client';

import ProductCard from '@/app/components/shared/ProductCard';

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  isComingSoon?: boolean;
}

interface ProductsProps {
  products: Product[];
  onAddToCart: (product: { id: string; name: string; price: number }) => void;
  onWhatsApp: (product: { name: string; price: number }) => void;
}

export default function Products({
  products,
  onAddToCart,
  onWhatsApp,
}: ProductsProps) {
  const activeProducts = products.filter((p) => !p.isComingSoon);
  const comingSoonProducts = products.filter((p) => p.isComingSoon);

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-semibold mb-6">
            Featured Collection
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
            Our Premium <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Crafted with care using nature's finest ingredients to bring out your hair's natural beauty. Each product is a masterpiece of nature and science.
          </p>
        </div>

        {/* Featured Products */}
        {activeProducts.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 h-1 bg-gradient-to-r from-green-700 to-transparent rounded-full" />
              <h3 className="text-3xl font-black text-gray-900">Featured</h3>
              <div className="flex-1 h-1 bg-gradient-to-l from-green-700 to-transparent rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeProducts.map((product, idx) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${idx * 0.15}s` }}
                  className="animate-fade-in-up"
                >
                  <ProductCard
                    {...product}
                    onAddToCart={onAddToCart}
                    onWhatsApp={onWhatsApp}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon */}
        {comingSoonProducts.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 h-1 bg-gradient-to-r from-gray-400 to-transparent rounded-full" />
              <h3 className="text-3xl font-black text-gray-900">Coming Soon</h3>
              <div className="flex-1 h-1 bg-gradient-to-l from-gray-400 to-transparent rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {comingSoonProducts.map((product, idx) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${idx * 0.15}s` }}
                  className="animate-fade-in-up"
                >
                  <ProductCard
                    {...product}
                    isComingSoon
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
