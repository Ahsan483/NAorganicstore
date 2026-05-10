import { Product } from '@/lib/types';

export const products: Product[] = [
  {
    id: '1',
    title: 'Organic Hair Oil',
    description: 'Premium blend of natural oils to strengthen and nourish your hair deeply. Infused with argan, coconut, and jojoba oils. Perfect for all hair types.',
    image: '/images/oilProduct.png',
    price: 999,
    originalPrice: 1100,
    category: 'Oils',
    rating: 4.8,
    reviews: 124,
  },
  {
    id: '2',
    title: 'Herbal Shampoo',
    description: 'Gentle yet effective herbal formula suitable for all hair types. Contains organic herbs and plant extracts for natural cleansing.',
    image: '/images/shampooProduct.png',
    price: 450,
    originalPrice: 600,
    category: 'Shampoos',
    rating: 4.6,
    reviews: 89,
  },
  {
    id: '3',
    title: 'Hair Growth Serum',
    description: 'Advanced botanical blend to promote healthy hair growth naturally. Stay tuned for this exciting new product!',
    image: '/images/oilProduct.png',
    price: 1500,
    originalPrice: 1800,
    category: 'Serums',
    isComingSoon: true,
  },
];
