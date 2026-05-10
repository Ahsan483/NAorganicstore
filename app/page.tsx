'use client';

import { useState, useEffect } from 'react';
import { products } from '@/data/products';
import Navbar from '@/app/components/shared/Navbar';
import Footer from '@/app/components/shared/Footer';
import CartModal from '@/app/components/shared/CartModal';
import Hero from '@/app/components/sections/Hero';
import Videos from '@/app/components/sections/Videos';
import Products from '@/app/components/sections/Products';
import About from '@/app/components/sections/About';
import Contact from '@/app/components/sections/Contact';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: { id: string; name: string; price: number }) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleWhatsApp = (product: { name: string; price: number }) => {
    const message = `Hello! I'm interested in *${product.name}* priced at Rs.${product.price}`;
    const phoneNumber = '+923291945009';
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      '_blank'
    );
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = async (customerInfo: any) => {
    try {
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Send order to API (which will send confirmation email)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo,
          items: cartItems,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error}`);
        return;
      }

      // Show success message
      alert(`✅ Order placed successfully! Order ID: ${data.orderId}\nConfirmation email has been sent. Our team will contact you shortly.`);

      // Open WhatsApp with order confirmation message
      const message = `
Hi! I just placed an order ${data.orderId} on NA Organic Store.

Customer: ${customerInfo.name}
Items: ${cartItems.map((item) => `${item.name} (x${item.quantity})`).join(', ')}
Total: Rs. ${total}

Please confirm receipt of my order. Thank you!
      `.trim();

      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = '+923291945009';
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
        '_blank'
      );

      setCartItems([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process order. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar cartCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />

      <main className="flex-1">
        <Hero onShopClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} />
        <Videos />
        <Products
          products={products}
          onAddToCart={handleAddToCart}
          onWhatsApp={handleWhatsApp}
        />
        <About />
        <Contact onWhatsAppClick={() => handleWhatsApp({ name: 'General Inquiry', price: 0 })} />
      </main>

      <Footer />

      <CartModal
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
