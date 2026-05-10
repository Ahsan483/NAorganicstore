'use client';

import Image from 'next/image';

export default function ProductShowcase() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
            Our Complete <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">Product Line</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our complete collection of organic, herbal beauty and wellness products
          </p>
        </div>

        {/* Showcase Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 animate-fade-in-up">
          <div className="bg-gray-100 relative w-full" style={{ aspectRatio: '16/9' }}>
            <Image
              src="/images/products/all-products.png"
              alt="NA Organic Store - Complete Product Collection"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 85vw"
              className="object-contain hover:scale-105 transition duration-500 cursor-pointer"
              quality={85}
            />
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Call to Action */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="text-white text-lg font-bold mb-4">
              Explore All Our Products
            </p>
            <button
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-xl shadow-lg"
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* Product Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center group p-6 hover:bg-gray-50 rounded-2xl transition-all duration-300">
            <div className="text-5xl font-black bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent mb-4">
              100%
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Organic</h3>
            <p className="text-gray-600">Pure natural ingredients, no harmful chemicals</p>
          </div>

          <div className="text-center group p-6 hover:bg-gray-50 rounded-2xl transition-all duration-300">
            <div className="text-5xl font-black mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Certified</h3>
            <p className="text-gray-600">Quality assured and tested for safety</p>
          </div>

          <div className="text-center group p-6 hover:bg-gray-50 rounded-2xl transition-all duration-300">
            <div className="text-5xl font-black mb-4">🌿</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Herbal</h3>
            <p className="text-gray-600">Made with nature's finest ingredients</p>
          </div>
        </div>
      </div>
    </section>
  );
}
