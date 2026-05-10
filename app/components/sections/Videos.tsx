'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const videos = [
    {
      id: 'making',
      title: 'How Our Products Are Made',
      description: 'Watch our organic products being crafted with care',
      src: '/videos/making.mp4',
      thumbnail: '/images/hero-bg.png',
    },
    {
      id: 'product',
      title: 'See Our Products in Action',
      description: 'Discover the transformation with our products',
      src: '/videos/product.mp4',
      thumbnail: '/images/home-bg.png',
    },
  ];

  return (
    <section id="videos" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-semibold mb-6">
            Featured Content
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
            Watch Our <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">Stories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how we craft our organic products with passion and discover the transformations they bring
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {videos.map((video, idx) => (
            <div
              key={video.id}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:-translate-y-4">
                {/* Video Container */}
                <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
                  <video
                    controls
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    poster={video.thumbnail}
                  >
                    <source src={video.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-green-500/30 backdrop-blur-md p-6 rounded-full transform group-hover:scale-125 transition-transform duration-300">
                      <Play className="w-12 h-12 text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200/50">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition duration-300">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Videos Matter */}
        <div className="bg-gradient-to-br from-green-50 via-green-50/50 to-transparent rounded-3xl p-8 sm:p-16 border border-green-200/30 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-3xl font-black text-gray-900 mb-12 text-center">
            Why Our <span className="text-green-700">Process</span> Matters
          </h3>
          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            <div className="text-center group hover:bg-white hover:shadow-lg p-6 rounded-2xl transition-all duration-300">
              <div className="text-5xl font-black bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent mb-4">100%</div>
              <p className="text-gray-700 font-semibold text-lg">Organic Ingredients</p>
              <p className="text-gray-500 text-sm mt-2">Pure nature, no chemicals</p>
            </div>
            <div className="text-center group hover:bg-white hover:shadow-lg p-6 rounded-2xl transition-all duration-300">
              <div className="text-5xl font-black mb-4">✨</div>
              <p className="text-gray-700 font-semibold text-lg">Handcrafted with Care</p>
              <p className="text-gray-500 text-sm mt-2">Made by dedicated hands</p>
            </div>
            <div className="text-center group hover:bg-white hover:shadow-lg p-6 rounded-2xl transition-all duration-300">
              <div className="text-5xl font-black mb-4">🌍</div>
              <p className="text-gray-700 font-semibold text-lg">Eco-Friendly Process</p>
              <p className="text-gray-500 text-sm mt-2">Sustainable from start to finish</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
