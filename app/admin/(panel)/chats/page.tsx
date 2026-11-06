import ChatInbox from '@/app/components/admin/ChatInbox';

export const metadata = { title: 'Chats' };

export default function ChatsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl text-forest sm:text-4xl">Live chats</h1><p className="text-muted">Conversations from the website chat widget. New chats also alert you on WhatsApp and email.</p></div>
      <ChatInbox />
    </div>
  );
}
