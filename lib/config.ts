export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.naorganicstore.com').replace(/\/$/, '');

export const SITE = {
  name: 'NA Organic Store',
  shortName: 'NA Organic',
  tagline: 'Quality Herbs, Healthy Living',
  description:
    'Shop 100% natural herbal hair oil, shampoo, beauty cream, neem soap, surma and herbal powders. Chemical-free, made in Peshawar and delivered across Pakistan with Cash on Delivery.',
  locale: 'en_PK',
};

export const CONTACT = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hakeemaziz8320@gmail.com',
  phoneDisplay: '+92 302 833 7026',
  phone: '+923028337026',
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923489374748').replace(/\D/g, ''),
  address: 'Abaseen Market, Shop #17, Peshawar, Pakistan',
  hours: 'Mon – Sat, 10:00 – 20:00',
};

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappNumber}`;

/** Shipping rules (PKR). Change here to adjust at checkout. */
export const SHIPPING = {
  flatRate: Number(process.env.SHIPPING_FLAT_RATE ?? 250),
  freeOver: Number(process.env.SHIPPING_FREE_OVER ?? 3000),
};

export function calcShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= SHIPPING.freeOver ? 0 : SHIPPING.flatRate;
}

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = {
  cod: 'Cash on Delivery',
  transfer: 'Bank / Easypaisa / JazzCash transfer',
} as const;
export type PaymentMethod = keyof typeof PAYMENT_METHODS;

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Packing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
