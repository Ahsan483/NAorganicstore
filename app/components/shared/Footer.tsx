import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="animate-fade-in-up">
            <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              NA Organic Store
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transform your hair naturally with 100% organic, chemical-free products crafted with passion and nature.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="font-black text-lg mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#home" className="hover:text-green-400 transition-colors duration-300 font-semibold hover:translate-x-1 inline-block">→ Home</a></li>
              <li><a href="#products" className="hover:text-green-400 transition-colors duration-300 font-semibold hover:translate-x-1 inline-block">→ Products</a></li>
              <li><a href="#about" className="hover:text-green-400 transition-colors duration-300 font-semibold hover:translate-x-1 inline-block">→ About Us</a></li>
              <li><a href="#contact" className="hover:text-green-400 transition-colors duration-300 font-semibold hover:translate-x-1 inline-block">→ Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-black text-lg mb-6 text-white">Contact</h4>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-center gap-3 group hover:text-green-400 transition-colors duration-300">
                <Mail size={18} className="text-green-500 group-hover:scale-125 transition-transform duration-300" />
                <span className="font-semibold">hakeemaziz8320@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 group hover:text-green-400 transition-colors duration-300">
                <Phone size={18} className="text-green-500 group-hover:scale-125 transition-transform duration-300" />
                <span className="font-semibold">+92 302 833 7026</span>
              </div>
              <div className="flex items-center gap-3 group hover:text-green-400 transition-colors duration-300">
                <MapPin size={18} className="text-green-500 group-hover:scale-125 transition-transform duration-300" />
                <span className="font-semibold">Abaseen Market, Shop #17</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h4 className="font-black text-lg mb-6 text-white">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-gray-800 hover:bg-green-700 rounded-lg transition-all duration-300 transform hover:scale-125 hover:shadow-lg font-bold text-white">
                f
              </a>
              <a href="#" className="p-3 bg-gray-800 hover:bg-green-700 rounded-lg transition-all duration-300 transform hover:scale-125 hover:shadow-lg font-bold text-white">
                📷
              </a>
              <a href="#" className="p-3 bg-gray-800 hover:bg-green-700 rounded-lg transition-all duration-300 transform hover:scale-125 hover:shadow-lg font-bold text-white">
                𝕏
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-semibold">
            &copy; {currentYear} NA Organic Store. All rights reserved. 🌿
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-green-400 transition-colors duration-300 font-semibold">Privacy Policy</a>
            <a href="#" className="hover:text-green-400 transition-colors duration-300 font-semibold">Terms of Service</a>
            <a href="#" className="hover:text-green-400 transition-colors duration-300 font-semibold">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
