export const rs = (n: number) => `Rs. ${n.toLocaleString('en-PK')}`;
export const discountPct = (orig: number, price: number) => (orig > price ? Math.round(((orig - price) / orig) * 100) : 0);
