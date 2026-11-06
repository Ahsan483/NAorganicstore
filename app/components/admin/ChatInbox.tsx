'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import type { ChatMessage, ChatSession } from '@/lib/types';

export default function ChatInbox() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [active, setActive] = useState<ChatSession | null>(null);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const last = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  const loadSessions = useCallback(async () => {
    const r = await fetch('/api/admin/chats', { cache: 'no-store' });
    if (r.ok) setSessions((await r.json()).sessions);
  }, []);

  const loadMsgs = useCallback(async (id: string) => {
    const r = await fetch(`/api/admin/chats/${id}?after=${last.current}`, { cache: 'no-store' });
    if (!r.ok) return;
    const { messages } = (await r.json()) as { messages: ChatMessage[] };
    if (messages.length) { last.current = messages[messages.length - 1].id; setMsgs((p) => [...p, ...messages.filter((m) => !p.some((x) => x.id === m.id))]); }
  }, []);

  useEffect(() => { loadSessions(); const t = setInterval(loadSessions, 6000); return () => clearInterval(t); }, [loadSessions]);
  useEffect(() => {
    if (!active) return;
    last.current = 0; setMsgs([]);
    loadMsgs(active.id);
    const t = setInterval(() => loadMsgs(active.id), 3000);
    return () => clearInterval(t);
  }, [active, loadMsgs]);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight }); }, [msgs]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!active || !text.trim()) return;
    const m = text; setText('');
    await fetch(`/api/admin/chats/${active.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: m }) });
    loadMsgs(active.id); loadSessions();
  }

  return (
    <div className="card grid h-[calc(100dvh-14rem)] min-h-[28rem] overflow-hidden md:grid-cols-[20rem_1fr]">
      <ul className={`divide-y divide-forest/10 overflow-y-auto ${active ? 'hidden md:block' : ''}`}>
        {sessions.length === 0 && <li className="p-8 text-center text-sm text-muted">No conversations yet.</li>}
        {sessions.map((s) => (
          <li key={s.id}>
            <button onClick={() => setActive(s)} className={`w-full p-4 text-left hover:bg-forest/5 ${active?.id === s.id ? 'bg-lime/30' : ''}`}>
              <div className="flex items-center justify-between gap-2"><b className="truncate">{s.name || 'Visitor'}</b>{s.unreadAdmin > 0 && <span className="rounded-full bg-saffron px-2 text-xs font-bold">{s.unreadAdmin}</span>}</div>
              <p className="truncate text-sm text-muted">{s.lastMessage}</p>
              <p className="text-xs text-muted/70">{new Date(s.lastMessageAt).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })}</p>
            </button>
          </li>
        ))}
      </ul>
      <div className={`flex min-h-0 flex-col border-l border-forest/10 ${active ? '' : 'hidden md:flex'}`}>
        {!active ? <div className="grid flex-1 place-items-center text-muted">Select a conversation</div> : (
          <>
            <div className="flex items-center gap-3 border-b border-forest/10 p-4"><button className="md:hidden" onClick={() => setActive(null)} aria-label="Back"><ArrowLeft /></button><b>{active.name || 'Visitor'}</b></div>
            <div ref={box} className="flex-1 space-y-3 overflow-y-auto bg-cream p-4">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : ''}`}>
                  <div className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl p-3 text-sm shadow-sm ${m.sender === 'admin' ? 'bg-forest-2 text-white' : 'bg-white'}`}>{m.body}</div>
                </div>
              ))}
            </div>
            <form onSubmit={send} className="flex gap-2 border-t border-forest/10 p-3">
              <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Reply…" maxLength={1000} aria-label="Reply" />
              <button className="btn btn-primary" aria-label="Send"><Send size={18} /></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
