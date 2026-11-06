import { z } from 'zod';
import { ORDER_STATUSES } from './config';

/** Normalises Pakistani numbers to +92XXXXXXXXXX; accepts 03xx, 3xx, 92xx, +92xx. Returns null if invalid. */
export function normalizePhone(input: string): string | null {
  let d = input.replace(/[^\d+]/g, '');
  if (d.startsWith('+')) d = d.slice(1);
  if (d.startsWith('0092')) d = d.slice(4);
  else if (d.startsWith('92')) d = d.slice(2);
  else if (d.startsWith('0')) d = d.slice(1);
  if (/^3\d{9}$/.test(d)) return `+92${d}`; // mobile
  if (/^[1-9]\d{8,10}$/.test(d) && !d.startsWith('3')) return `+92${d}`; // landline
  return null;
}

const text = (max: number) => z.string().trim().max(max);

export const orderSchema = z.object({
  customerName: text(80).min(2, 'Please enter your full name'),
  phone: text(25).refine((v) => normalizePhone(v) !== null, 'Enter a valid phone number, e.g. 0300 1234567'),
  email: z.union([z.literal(''), text(120).email('Enter a valid email address')]).optional(),
  address: text(300).min(8, 'Please enter your full delivery address'),
  city: text(60).min(2, 'Please enter your city'),
  notes: text(500).optional(),
  paymentMethod: z.enum(['cod', 'transfer']).default('cod'),
  items: z
    .array(z.object({ id: text(40), quantity: z.number().int().min(1).max(20) }))
    .min(1, 'Your cart is empty')
    .max(30),
  website: z.string().max(200).optional(), // honeypot (checked in route)
});

export const contactSchema = z.object({
  name: text(80).min(2),
  email: z.union([z.literal(''), text(120).email()]).optional(),
  phone: text(25).optional(),
  message: text(2000).min(5),
  website: z.string().max(200).optional(),
});

export const chatStartSchema = z.object({
  name: text(60).optional(),
  phone: text(25).optional(),
  message: text(1000).min(1),
});

export const chatSendSchema = z.object({
  sessionId: text(40),
  token: text(80),
  message: text(1000).min(1),
});

export const productSchema = z.object({
  title: text(120).min(2),
  slug: text(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase-letters-and-dashes only'),
  urduTitle: text(120).nullish(),
  description: text(2000).min(10),
  urduDescription: text(2000).nullish(),
  image: text(300).min(1),
  price: z.number().int().min(1).max(1_000_000),
  originalPrice: z.number().int().min(1).max(1_000_000),
  category: text(60).min(2),
  stock: z.number().int().min(0).max(100000),
  active: z.boolean(),
  sort: z.number().int().optional(),
});

export const orderUpdateSchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(['unpaid', 'paid']).optional(),
  trackingNumber: text(60).nullish(),
  courier: text(60).nullish(),
  note: text(300).optional(),
});
