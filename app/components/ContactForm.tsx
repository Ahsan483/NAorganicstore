'use client';

import { useState } from 'react';
import { Check, Loader2, Send } from 'lucide-react';

export default function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', phone: '', message: '', website: '' });
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [err, setErr] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('busy'); setErr('');
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      setState('done');
    } catch (x) { setErr(x instanceof Error ? x.message : 'Something went wrong'); setState('idle'); }
  }

  if (state === 'done') {
    return (
      <div className="card grid place-items-center p-10 text-center">
        <div><div className="mx-auto grid size-16 place-items-center rounded-full bg-leaf text-white"><Check size={32} /></div>
          <h2 className="font-display mt-5 text-3xl text-forest">Message sent</h2><p className="mt-2 text-muted">Thank you! We&apos;ll get back to you shortly.</p></div>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8">
      <h2 className="font-display text-2xl text-forest">Send us a message</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="cn">Name *</label><input id="cn" className="input" value={f.name} onChange={set('name')} required minLength={2} autoComplete="name" /></div>
        <div><label className="label" htmlFor="cp">Phone</label><input id="cp" type="tel" className="input" value={f.phone} onChange={set('phone')} autoComplete="tel" /></div>
      </div>
      <div><label className="label" htmlFor="ce">Email</label><input id="ce" type="email" className="input" value={f.email} onChange={set('email')} autoComplete="email" /></div>
      <div><label className="label" htmlFor="cm">Message *</label><textarea id="cm" rows={5} className="input" value={f.message} onChange={set('message')} required minLength={5} maxLength={2000} /></div>
      <input tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" value={f.website} onChange={set('website')} />
      {err && <p className="text-sm text-berry" role="alert">{err}</p>}
      <button className="btn btn-primary w-full sm:w-auto" disabled={state === 'busy'}>{state === 'busy' ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Send message</button>
    </form>
  );
}
