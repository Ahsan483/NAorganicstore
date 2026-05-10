'use client';

import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProductLightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  productName: string;
}

export default function ProductLightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  productName,
}: ProductLightboxProps) {
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, index, images.length]);

  const goToNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition z-60"
      >
        <X size={28} className="text-white" />
      </button>

      {/* Main Image */}
      <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center">
        <Image
          src={images[index]}
          alt={`${productName} - Image ${index + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
          className="object-contain"
          quality={90}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
            >
              <ChevronLeft size={28} className="text-white" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
            >
              <ChevronRight size={28} className="text-white" />
            </button>
          </>
        )}
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm">
          {index + 1} / {images.length}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                idx === index
                  ? 'border-green-400 opacity-100'
                  : 'border-white/20 opacity-50 hover:opacity-75'
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
                quality={75}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
