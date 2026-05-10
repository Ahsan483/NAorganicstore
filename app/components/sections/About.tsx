import Image from 'next/image';
import { CheckCircle, Leaf, Droplets, Heart } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Leaf,
      title: '100% Organic',
      description: 'Pure natural ingredients without harmful chemicals',
    },
    {
      icon: Heart,
      title: 'Cruelty-Free',
      description: 'Never tested on animals, always eco-conscious',
    },
    {
      icon: Droplets,
      title: 'Effective Results',
      description: 'Scientifically proven to nourish and strengthen hair',
    },
    {
      icon: CheckCircle,
      title: 'Quality Assured',
      description: 'Every batch meets highest international standards',
    },
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-semibold mb-6">
            Our Story
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">NA Organic Store</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We believe in the power of nature. Every product we create is a testament to our commitment to your natural beauty and the planet's health.
          </p>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-16 mb-20 items-center">
          <div className="animate-slide-in-left">
            <div className="inline-block px-4 py-2 bg-green-100 rounded-lg text-green-700 text-sm font-bold mb-4">
              OUR MISSION
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-6">Transforming Beauty Naturally</h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
              At NA Organic Store, we're passionate about providing you with the best organic solutions for your hair care needs. Nature meets innovation in every product we offer.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Our mission is to harness the power of natural ingredients to create hair care products that are safe, effective, and environmentally friendly. We aim to redefine beauty by focusing on holistic health and sustainable practices.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Get in Touch
            </button>
          </div>
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 animate-slide-in-right group">
            <img
              src="/images/about-us.png"
              alt="About NA Organic"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-8 bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-200/50 group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="bg-gradient-to-br from-green-100 to-green-50 p-4 rounded-xl w-fit mb-6 group-hover:shadow-lg transition duration-300">
                  <Icon className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-green-50 via-green-50/50 to-green-100/50 rounded-3xl p-12 sm:p-16 border border-green-200/50 animate-fade-in-up">
          <h3 className="text-4xl font-black text-gray-900 mb-12 text-center">
            Why <span className="text-green-700">Choose</span> Us?
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              'Free from Harmful Chemicals',
              'Proven Results for All Hair Types',
              'Sustainable & Eco-Friendly',
              'Quality You Can Trust',
              'Customer Satisfaction Guaranteed',
              'Fast & Reliable Delivery',
            ].map((item, idx) => (
              <div
                key={item}
                className="flex items-center gap-4 p-4 hover:bg-white/80 rounded-xl transition-all duration-300"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-700" />
                </div>
                <span className="text-gray-700 font-semibold text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
