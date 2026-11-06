import { STATUS_LABEL, type OrderStatus } from '@/lib/config';

const COLORS: Record<OrderStatus, string> = {
  pending: 'bg-saffron/25 text-[#7a5600]',
  confirmed: 'bg-sky-100 text-sky-800',
  processing: 'bg-violet-100 text-violet-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-lime text-forest',
  cancelled: 'bg-berry/15 text-berry',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`chip !text-[11px] ${COLORS[status]}`}>{STATUS_LABEL[status]}</span>;
}
