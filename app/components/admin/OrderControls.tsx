'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { ORDER_STATUSES, STATUS_LABEL, type OrderStatus } from '@/lib/config';

export default function OrderControls(props: { id: string; status: OrderStatus; paymentStatus: 'paid' | 'unpaid'; trackingNumber: string | null; courier: string | null }) {
  const router = useRouter();
  const [status, setStatus] = useState(props.status);
  const [paid, setPaid] = useState(props.paymentStatus);
  const [tracking, setTracking] = useState(props.trackingNumber ?? '');
  const [courier, setCourier] = useState(props.courier ?? '');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function save() {
    setBusy(true); setMsg('');
    const r = await fetch(`/api/admin/orders/${props.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus: paid, trackingNumber: tracking, courier, note: note || undefined }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setMsg(d.error || 'Save failed'); return; }
    setNote('');
    setMsg(d.notified ? `Saved. Customer notified — email: ${d.notified.email ? '✓' : '✗'}, WhatsApp: ${d.notified.whatsapp ? '✓' : '✗'}` : 'Saved.');
    router.refresh();
  }

  async function resend() {
    setBusy(true); setMsg('');
    const r = await fetch(`/api/admin/orders/${props.id}/resend`, { method: 'POST' });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    setMsg(r.ok ? (d.errors?.length ? `Some failed: ${d.errors.join(' | ')}` : 'Notifications re-sent.') : d.error || 'Failed');
    router.refresh();
  }

  return (
    <section className="card space-y-4 p-6">
      <h2 className="font-semibold text-forest">Manage order</h2>
      <div><label className="label" htmlFor="st">Status</label>
        <select id="st" className="input" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label" htmlFor="co">Courier</label><input id="co" className="input" placeholder="TCS, Leopards…" value={courier} onChange={(e) => setCourier(e.target.value)} /></div>
        <div><label className="label" htmlFor="tn">Tracking #</label><input id="tn" className="input" value={tracking} onChange={(e) => setTracking(e.target.value)} /></div>
      </div>
      <div><label className="label" htmlFor="pay">Payment</label>
        <select id="pay" className="input" value={paid} onChange={(e) => setPaid(e.target.value as 'paid' | 'unpaid')}><option value="unpaid">Unpaid</option><option value="paid">Paid</option></select></div>
      <div><label className="label" htmlFor="nt">Note for timeline (optional)</label><input id="nt" className="input" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} /></div>
      <button onClick={save} disabled={busy} className="btn btn-primary w-full">{busy && <Loader2 className="animate-spin" size={18} />} Save changes</button>
      <p className="text-xs text-muted">Changing the status automatically emails and WhatsApps the customer (if configured).</p>
      <button onClick={resend} disabled={busy} className="btn btn-ghost btn-sm w-full"><RefreshCw size={15} /> Re-send new-order alerts</button>
      {msg && <p className="break-words rounded-xl bg-lime/30 p-3 text-sm" role="status">{msg}</p>}
    </section>
  );
}
