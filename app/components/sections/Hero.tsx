'use client';

import Image from 'next/image';
import Link from 'next/link';

interface HeroProps {
  onShopClick: () => void;
}

export default function Hero({ onShopClick }: HeroProps) {
  return (
    <section
      id="home"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-20 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/images/hero-bg.png)',
      }}
    >
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/70 to-green-700/60 z-10" />

      {/* Animated gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl -z-0 animate-float-up" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl -z-0 animate-float-up" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 space-y-6 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-green-500/30 backdrop-blur-md rounded-full border border-green-400/50 text-green-100 text-sm font-semibold mb-4">
            100% Organic & Chemical-Free
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight">
            Transform Your Hair
            <span className="block bg-gradient-to-r from-green-300 via-green-200 to-green-100 bg-clip-text text-transparent">
              Naturally
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-green-50 max-w-3xl mx-auto leading-relaxed font-light">
            Premium organic hair care crafted from nature's finest ingredients for your natural beauty
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={onShopClick}
            className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 text-gray-900 font-bold rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl text-lg shadow-lg"
          >
            Shop Now
          </button>
          <Link
            href="#about"
            className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/20 hover:backdrop-blur-md transition-all duration-300 transform hover:scale-105 text-lg backdrop-blur-sm bg-white/10"
          >
            Learn More
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
