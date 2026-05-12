'use client';

import { useState } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (customerInfo: any) => void;
}

export default function CartModal({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!customerPhone.trim()) {
      alert('Please enter your phone number');
      return;
    }
    setIsSubmitting(true);
    try {
      await onCheckout({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        location: customerLocation,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-700 to-green-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-black">Shopping Cart</h2>
            <p className="text-green-100 text-sm mt-1">{items.length} items in cart</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-green-800 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-green-100/50 hover:border-green-200 transition"
                  >
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Rs. {item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-12 text-center border rounded"
                        min="1"
                      />
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="w-20 text-right font-semibold">
                      Rs. {item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-700">Rs. {total}</span>
                </div>
              </div>

              {/* Customer Info Form */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl mb-6 space-y-4 border border-green-100">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <span className="text-green-700">📦</span> Delivery Information
                </h3>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-green-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition"
                />
                <input
                  type="email"
                  placeholder="Email Address (for order confirmation)"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-green-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (required) - +92..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-red-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
                />
                <input
                  type="text"
                  placeholder="Delivery Location / City"
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-green-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-100">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition transform hover:scale-105"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white rounded-xl font-bold transition disabled:opacity-50 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  {isSubmitting ? '⏳ Processing...' : '✓ Place Order'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
