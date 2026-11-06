import { CartProvider } from '@/app/components/cart';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import CartDrawer from '@/app/components/CartDrawer';
import ChatWidget from '@/app/components/ChatWidget';
import { ScrollProgress } from '@/app/components/motion';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2">Skip to content</a>
      <ScrollProgress />
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </CartProvider>
  );
}
