export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  category?: string;
  rating?: number;
  reviews?: number;
  isComingSoon?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  location: string;
}

export interface Order {
  id: string;
  customerId?: string;
  customerInfo: CustomerInfo;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  timestamp: Date;
}
