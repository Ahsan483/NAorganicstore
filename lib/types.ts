import type { OrderStatus, PaymentMethod } from './config';

export interface Product {
  id: string;
  slug: string;
  title: string;
  urduTitle?: string | null;
  description: string;
  urduDescription?: string | null;
  image: string;
  images: string[];
  price: number;
  originalPrice: number;
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  active: boolean;
  sort: number;
}

export interface CartItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderEvent {
  status: string;
  note: string | null;
  createdAt: string;
}

export interface NotifyResult {
  adminEmail?: boolean;
  customerEmail?: boolean;
  adminWhatsapp?: boolean;
  customerWhatsapp?: boolean;
  errors?: string[];
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  notes: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid';
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  trackingNumber: string | null;
  courier: string | null;
  notifications: NotifyResult;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  events?: OrderEvent[];
}

export interface ChatMessage {
  id: number;
  sender: 'customer' | 'admin';
  body: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  name: string | null;
  phone: string | null;
  createdAt: string;
  lastMessageAt: string;
  unreadAdmin: number;
  lastMessage?: string;
}
