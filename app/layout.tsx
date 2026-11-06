import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, Noto_Nastaliq_Urdu } from 'next/font/google';
import { CONTACT, SITE, SITE_URL } from '@/lib/config';
import './globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });
const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin'], display: 'swap', axes: ['opsz'] });
const urdu = Noto_Nastaliq_Urdu({ variable: '--font-urdu', subsets: ['arabic'], display: 'swap', weight: ['400', '600'] });

export const viewport: Viewport = {
  themeColor: '#12301a',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NA Organic Store | Herbal Hair Oil, Shampoo & Natural Care in Pakistan',
    template: '%s | NA Organic Store',
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'organic store Pakistan', 'herbal hair oil', 'natural shampoo', 'neem soap', 'shafi surma', 'herbal powder',
    'organic products Peshawar', 'buy herbal products online Pakistan', 'chemical free hair care', 'NA Organic Store',
  ],
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  alternates: { canonical: '/' },
  icons: { icon: [{ url: '/favicon.png', type: 'image/png' }, { url: '/favicon.ico' }], apple: '/favicon.png' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE_URL,
    title: 'NA Organic Store | Quality Herbs, Healthy Living',
    description: SITE.description,
    images: [{ url: '/images/products/all-products.png', width: 1402, height: 1122, alt: 'NA Organic Store herbal product range' }],
  },
  twitter: { card: 'summary_large_image', title: SITE.name, description: SITE.description, images: ['/images/products/all-products.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  other: { 'geo.region': 'PK-KP', 'geo.placename': 'Peshawar' },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: SITE.name,
      url: SITE_URL,
      logo: `${SITE_URL}/images/na-store-logo.png`,
      email: CONTACT.email,
      telephone: CONTACT.phone,
      sameAs: [`https://wa.me/${CONTACT.whatsappNumber}`],
    },
    {
      '@type': 'Store',
      '@id': `${SITE_URL}/#store`,
      name: SITE.name,
      image: `${SITE_URL}/images/products/all-products.png`,
      url: SITE_URL,
      telephone: CONTACT.phone,
      priceRange: 'Rs. 250 - Rs. 1,000',
      address: { '@type': 'PostalAddress', streetAddress: 'Abaseen Market, Shop #17', addressLocality: 'Peshawar', addressRegion: 'Khyber Pakhtunkhwa', addressCountry: 'PK' },
      openingHours: 'Mo-Sa 10:00-20:00',
      currenciesAccepted: 'PKR',
      paymentAccepted: 'Cash on Delivery, Bank Transfer, Easypaisa, JazzCash',
      areaServed: { '@type': 'Country', name: 'Pakistan' },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE.name,
      publisher: { '@id': `${SITE_URL}/#org` },
      inLanguage: 'en',
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${urdu.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
