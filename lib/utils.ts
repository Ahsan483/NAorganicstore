export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    currency: 'PKR',
    style: 'currency',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function validatePhoneNumber(phone: string): boolean {
  const phonePattern = /^(\+92|0)[0-9]{10}$/;
  return phonePattern.test(phone.replace(/[^0-9+]/g, ''));
}

export function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export function calculateDiscount(original: number, current: number): number {
  if (original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}
