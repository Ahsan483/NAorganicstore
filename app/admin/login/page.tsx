'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
    if (r.ok) { router.replace('/admin'); router.refresh(); return; }
    setErr((await r.json().catch(() => ({}))).error || 'Login failed');
    setBusy(false);
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-forest p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <Image src="/images/na-store-logo.png" alt="" width={72} height={72} className="mx-auto size-18 rounded-full" />
        <h1 className="font-display mt-4 text-center text-3xl text-forest">Admin sign in</h1>
        <p className="mt-1 text-center text-sm text-muted">NA Organic Store dashboard</p>
        <div className="mt-6 space-y-4">
          <div><label className="label" htmlFor="u">Username</label><input id="u" className="input" autoComplete="username" value={u} onChange={(e) => setU(e.target.value)} required /></div>
          <div><label className="label" htmlFor="p">Password</label><input id="p" type="password" className="input" autoComplete="current-password" value={p} onChange={(e) => setP(e.target.value)} required /></div>
          {err && <p className="text-sm text-berry" role="alert">{err}</p>}
          <button className="btn btn-primary w-full" disabled={busy}>{busy ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />} Sign in</button>
        </div>
      </form>
    </div>
  );
}
