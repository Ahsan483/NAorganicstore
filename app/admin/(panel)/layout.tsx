import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import AdminNav from '@/app/components/admin/AdminNav';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect('/admin/login');
  const c = await db();
  const unread = Number((await c.execute('SELECT COALESCE(SUM(unread_admin),0) n FROM chat_sessions')).rows[0].n);
  const pending = Number((await c.execute("SELECT COUNT(*) n FROM orders WHERE status = 'pending'")).rows[0].n);
  return (
    <div className="lg:grid lg:grid-cols-[17rem_1fr]">
      <AdminNav user={admin.username} unread={unread} pending={pending} />
      <div className="min-w-0 p-4 sm:p-8">{children}</div>
    </div>
  );
}
