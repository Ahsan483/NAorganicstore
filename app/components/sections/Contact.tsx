'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

interface ContactProps {
  onWhatsAppClick: () => void;
}

export default function Contact({ onWhatsAppClick }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error}`);
        return;
      }

      alert('Thank you! We\'ve received your message and will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-semibold mb-6">
            Let's Connect
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
            Get in <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about our products? We're here to help! Reach out anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="animate-slide-in-left">
            <div>
              <h3 className="text-3xl font-black text-gray-900 mb-10">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex gap-6 group p-6 rounded-2xl hover:bg-green-50 transition-all duration-300 border border-transparent hover:border-green-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-700 to-green-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300 shadow-lg">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Email</h4>
                    <a
                      href="mailto:hakeemaziz8320@gmail.com"
                      className="text-gray-600 hover:text-green-700 font-semibold transition"
                    >
                      hakeemaziz8320@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-6 group p-6 rounded-2xl hover:bg-green-50 transition-all duration-300 border border-transparent hover:border-green-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-700 to-green-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300 shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Phone</h4>
                    <a
                      href="tel:+923028337026"
                      className="text-gray-600 hover:text-green-700 font-semibold transition"
                    >
                      +92 302 833 7026
                    </a>
                  </div>
                </div>

                <div className="flex gap-6 group p-6 rounded-2xl hover:bg-green-50 transition-all duration-300 border border-transparent hover:border-green-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-700 to-green-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300 shadow-lg">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Address</h4>
                    <p className="text-gray-600 leading-relaxed font-semibold">
                      Abaseen Market<br />
                      Shop #17<br />
                      Peshawar, Pakistan
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onWhatsAppClick}
                className="mt-10 w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 hover:shadow-xl shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.519c-1.51.844-2.733 2.039-3.614 3.403-.875 1.35-1.344 2.854-1.403 4.409-.028 1.062.144 2.114.545 3.116l-1.088 3.968a1.187 1.187 0 001.451 1.452l3.968-1.089c.995.401 2.055.573 3.117.545 1.555-.06 3.059-.528 4.409-1.403 1.364-.881 2.559-2.104 3.403-3.614.943-1.546 1.501-3.27 1.519-4.946-.006-3.257-1.318-6.337-3.653-8.671-2.336-2.336-5.413-3.652-8.671-3.653z" />
                </svg>
                Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-in-right">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-10 rounded-3xl shadow-2xl space-y-6 border border-gray-200/50"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-gray-900 mb-3"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all duration-300 placeholder:text-gray-400"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-900 mb-3"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all duration-300 placeholder:text-gray-400"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-bold text-gray-900 mb-3"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all duration-300 placeholder:text-gray-400 resize-none"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 transform hover:scale-105 hover:shadow-xl shadow-lg"
              >
                <Send size={20} className="group-hover:translate-x-1 transition" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
