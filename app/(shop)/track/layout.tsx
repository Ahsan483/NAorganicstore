import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Track your NA Organic Store order with your order number and phone number.',
  alternates: { canonical: '/track' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
