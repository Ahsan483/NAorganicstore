import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NA Organic Store - Premium Organic Hair Care Products',
  description: 'Transform your hair naturally with our 100% organic, chemical-free hair care products. Premium shampoos, oils, and serums crafted for all hair types.',
  keywords: 'organic hair care, natural shampoo, herbal products, cruelty-free, chemical-free',
  authors: [{ name: 'NA Organic Store', url: 'https://naorganicstore.com' }],
  metadataBase: new URL('https://naorganicstore.com'),
  openGraph: {
    title: 'NA Organic Store - Premium Organic Hair Care',
    description: 'Transform your hair naturally with our 100% organic products',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NA Organic Store',
    description: 'Premium organic hair care products',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
