'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from './motion';
import { CONTACT } from '@/lib/config';
import type { ChatMessage } from '@/lib/types';

const KEY = 'na-chat-v1';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<{ id: string; token: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [unseen, setUnseen] = useState(0);
  const lastId = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s?.id && s?.token) setSession(s); } catch { /* */ }
  }, []);

  const poll = useCallback(async () => {
    if (!session) return;
    try {
      const r = await fetch(`/api/chat?s=${encodeURIComponent(session.id)}&t=${encodeURIComponent(session.token)}&after=${lastId.current}`, { cache: 'no-store' });
      if (r.status === 401) { localStorage.removeItem(KEY); setSession(null); setMessages([]); lastId.current = 0; return; }
      if (!r.ok) return;
      const { messages: m } = (await r.json()) as { messages: ChatMessage[] };
      if (m.length) {
        lastId.current = m[m.length - 1].id;
        setMessages((prev) => [...prev, ...m.filter((x) => !prev.some((p) => p.id === x.id))]);
        if (!open) setUnseen((u) => u + m.filter((x) => x.sender === 'admin').length);
      }
    } catch { /* offline – retry next tick */ }
  }, [session, open]);

  useEffect(() => {
    if (!session) return;
    poll();
    const t = setInterval(() => { if (!document.hidden) poll(); }, open ? 4000 : 20000);
    return () => clearInterval(t);
  }, [session, open, poll]);

  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' }); }, [messages, open]);
  useEffect(() => { if (open) setUnseen(0); }, [open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const msg = text.trim();
    if (!msg || sending) return;
    setSending(true); setError('');
    try {
      const r = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session ? { sessionId: session.id, token: session.token, message: msg } : { message: msg, name: name || undefined }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Could not send');
      setText('');
      if (!session) {
        const s = { id: d.sessionId, token: d.token };
        localStorage.setItem(KEY, JSON.stringify(s));
        setSession(s);
      } else poll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send. Please try again.');
    } finally { setSending(false); }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[55] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog" aria-label="Chat with NA Organic Store"
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="absolute bottom-16 right-0 flex h-[min(34rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10"
          >
            <div className="flex items-center justify-between bg-forest-2 p-4 text-white">
              <div>
                <p className="font-display text-lg leading-tight">Chat with us</p>
                <p className="flex items-center gap-1.5 text-xs text-lime"><span className="size-2 animate-pulse rounded-full bg-lime" /> We reply within minutes</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="grid size-9 place-items-center rounded-full hover:bg-white/10"><X size={20} /></button>
            </div>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-cream p-4">
              <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white p-3 text-sm shadow-sm">
                Assalam-o-Alaikum 🌿 Ask us anything about our herbal products, prices or delivery.
              </div>
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'customer' ? 'justify-end' : ''}`}>
                  <div className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl p-3 text-sm shadow-sm ${m.sender === 'customer' ? 'rounded-br-md bg-forest-2 text-white' : 'rounded-bl-md bg-white'}`}>{m.body}</div>
                </div>
              ))}
            </div>

            <form onSubmit={send} className="space-y-2 border-t border-forest/10 bg-white p-3">
              {!session && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" maxLength={60} className="input !min-h-10 !py-2 text-sm" />}
              {error && <p className="text-xs text-berry" role="alert">{error}</p>}
              <div className="flex gap-2">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message…" maxLength={1000} className="input !min-h-11 !py-2" aria-label="Message" />
                <button className="btn btn-primary !min-h-11 !px-4" disabled={sending || !text.trim()} aria-label="Send message"><Send size={18} /></button>
              </div>
              <a href={`https://wa.me/${CONTACT.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="block text-center text-xs text-muted hover:text-forest">Prefer WhatsApp? Message us there →</a>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'} aria-expanded={open}
        className="relative grid size-14 place-items-center rounded-full bg-lime text-forest shadow-xl transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X size={24} /> : <MessageCircle size={26} />}
        {!open && unseen > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-berry text-[11px] font-bold text-white">{unseen}</span>}
      </button>
    </div>
  );
}
