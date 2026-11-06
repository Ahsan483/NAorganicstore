import { createClient, type Client } from '@libsql/client';

/**
 * Database layer (libSQL / SQLite dialect).
 *  - Production: set DATABASE_URL (+ DATABASE_AUTH_TOKEN) to a Turso database.
 *  - Local dev:  falls back to a file at ./data/local.db
 */
let client: Client | null = null;
let ready: Promise<void> | null = null;

function getClient(): Client {
  if (client) return client;
  const url = process.env.DATABASE_URL;
  if (!url && process.env.NODE_ENV === 'production' && process.env.VERCEL) {
    throw new Error('DATABASE_URL is not set. Create a Turso/libSQL database and add DATABASE_URL + DATABASE_AUTH_TOKEN.');
  }
  if (!url) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('node:fs').mkdirSync('./data', { recursive: true });
  }
  client = createClient({
    url: url || 'file:./data/local.db',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  return client;
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    urdu_title TEXT,
    description TEXT NOT NULL,
    urdu_description TEXT,
    image TEXT NOT NULL,
    images TEXT NOT NULL DEFAULT '[]',
    price INTEGER NOT NULL,
    original_price INTEGER NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    rating REAL NOT NULL DEFAULT 4.8,
    reviews INTEGER NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 100,
    active INTEGER NOT NULL DEFAULT 1,
    sort INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    notes TEXT,
    payment_method TEXT NOT NULL DEFAULT 'cod',
    payment_status TEXT NOT NULL DEFAULT 'unpaid',
    subtotal INTEGER NOT NULL,
    shipping INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    tracking_number TEXT,
    courier TEXT,
    notifications TEXT NOT NULL DEFAULT '{}',
    ip TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    title TEXT NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT NOT NULL DEFAULT ''
  )`,
  `CREATE INDEX IF NOT EXISTS idx_items_order ON order_items(order_id)`,
  `CREATE TABLE IF NOT EXISTS order_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY,
    token_hash TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    unread_admin INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_message_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_msgs_session ON chat_messages(session_id, id)`,
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    count INTEGER NOT NULL,
    reset_at INTEGER NOT NULL
  )`,
];

export async function db(): Promise<Client> {
  const c = getClient();
  if (!ready) {
    ready = (async () => {
      await c.batch(SCHEMA, 'write');
      const { seedProductsIfEmpty } = await import('./seed');
      await seedProductsIfEmpty(c);
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  await ready;
  return c;
}

/** SQLite datetime('now') is UTC without a zone marker; make it ISO. */
export function iso(s: string | null | undefined): string {
  if (!s) return '';
  return s.includes('T') ? s : s.replace(' ', 'T') + 'Z';
}
