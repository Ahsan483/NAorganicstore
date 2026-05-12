'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingCart } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#products', label: 'Products' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-lg ${
        isScrolled
          ? 'bg-white/95 shadow-xl py-3 border-b border-gray-200/50'
          : 'bg-gradient-to-b from-black/30 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`w-12 h-12 relative flex items-center justify-center rounded-lg transition-all duration-300 ${
              isScrolled ? 'bg-green-50 group-hover:bg-green-100' : 'bg-white/20 group-hover:bg-white/30'
            }`}>
              <Image
                src="/images/na-store-logo.png"
                alt="NA Organic Store"
                width={48}
                height={48}
                className="object-contain transform group-hover:scale-110 transition duration-300"
              />
            </div>
            <span className={`text-xl font-black hidden sm:inline transition-all duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              NA Organic Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-all duration-300 relative group ${
                  isScrolled
                    ? 'text-gray-700 hover:text-green-700'
                    : 'text-white hover:text-green-200'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled ? 'bg-green-700' : 'bg-green-300'
                }`} />
              </a>
            ))}
            <button
              onClick={onCartClick}
              className={`relative p-3 rounded-xl font-semibold transition-all duration-300 group ${
                isScrolled
                  ? 'bg-green-700 hover:bg-green-800 text-white shadow-lg hover:shadow-xl'
                  : 'bg-green-500/80 backdrop-blur-md hover:bg-green-600 text-white'
              }`}
            >
              <ShoppingCart size={20} className="group-hover:scale-110 transition duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={onCartClick}
              className={`relative p-2 rounded-lg transition-all duration-300 ${
                isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/20'
              }`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/20'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl mt-2 rounded-2xl border border-gray-200/50 animate-slide-in-down mx-4">
            <div className="px-6 py-6 space-y-2">
              {navLinks.map((link, idx) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-gray-700 hover:text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
