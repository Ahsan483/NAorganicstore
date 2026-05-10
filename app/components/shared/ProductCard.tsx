'use client';

import Image from 'next/image';
import { Heart, ShoppingCart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  isComingSoon?: boolean;
  images?: string[];
  onAddToCart?: (product: { id: string; name: string; price: number }) => void;
  onWhatsApp?: (product: { name: string; price: number }) => void;
  onImageClick?: (imageIndex: number) => void;
}

export default function ProductCard({
  id,
  title,
  description,
  image,
  price,
  originalPrice,
  isComingSoon = false,
  images = [],
  onAddToCart,
  onWhatsApp,
  onImageClick,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  if (isComingSoon) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-200/50 hover:-translate-y-2 animate-scale-in">
        <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <p className="text-gray-600 text-lg font-bold">Coming Soon</p>
            <p className="text-gray-500 text-sm mt-2">Stay tuned for this amazing product</p>
          </div>
        </div>
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <button
            disabled
            className="w-full mt-4 py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed transition-all"
          >
            Coming Soon
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-200/50 hover:-translate-y-3 animate-scale-in group">
      {/* Image Container */}
      <div
        className="relative w-full bg-gray-50 overflow-hidden cursor-pointer flex items-center justify-center"
        onClick={() => onImageClick?.(0)}
        style={{ aspectRatio: '1/1' }}
      >
        <Image
          src={image}
          alt={title}
          fill
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-105 transition duration-500"
          quality={85}
        />
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-110 transition duration-300">
            -{discount}%
          </div>
        )}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110"
        >
          <Heart
            size={20}
            className={`transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition duration-300">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-3xl font-black text-green-700">Rs. {price}</span>
          {originalPrice > price && (
            <span className="text-sm text-gray-400 line-through font-medium">Rs. {originalPrice}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button
            onClick={() =>
              onAddToCart?.({ id, name: title, price })
            }
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white rounded-xl py-3 font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Add</span>
          </button>
          <button
            onClick={() =>
              onWhatsApp?.({ name: title, price })
            }
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-xl py-3 font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <MessageCircle size={18} />
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
