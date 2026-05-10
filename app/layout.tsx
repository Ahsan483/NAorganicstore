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
  title: 'NA Organic Store - 100% Organic Beauty & Wellness',
  description: 'NA Organic Store - Premium 100% organic, herbal beauty and wellness products. Natural shampoos, oils, creams, and serums.',
  keywords: 'organic products, natural beauty, herbal remedies, organic hair care, cruelty-free, chemical-free',
  authors: [{ name: 'NA Organic Store', url: 'https://naorganicstore.com' }],
  metadataBase: new URL('https://naorganicstore.com'),
  icons: {
    icon: [
      { url: '/images/na-store-logo.png', type: 'image/png' },
    ],
    apple: '/images/na-store-logo.png',
    shortcut: '/images/na-store-logo.png',
  },
  openGraph: {
    title: 'NA Organic Store | 100% Natural Beauty & Wellness',
    description: 'Premium 100% organic, herbal beauty and wellness products. Transform your health naturally.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/na-store-logo.png',
        width: 512,
        height: 512,
        alt: 'NA Organic Store Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NA Organic Store | 100% Natural Products',
    description: 'Premium organic beauty and wellness products',
    images: ['/images/na-store-logo.png'],
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
