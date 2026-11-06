import nodemailer from 'nodemailer';
import { CONTACT, SITE, SITE_URL, STATUS_LABEL, PAYMENT_METHODS } from './config';
import { escapeHtml as h } from './security';
import { saveNotifications } from './orders';
import type { NotifyResult, Order } from './types';

const money = (n: number) => `Rs. ${n.toLocaleString('en-PK')}`;
const withTimeout = <T,>(p: Promise<T>, ms = 12000): Promise<T> =>
  Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

/* ───────────────────────── Email (SMTP) ───────────────────────── */

let transporter: nodemailer.Transporter | null = null;
function mailer() {
  if (transporter) return transporter;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
  if (!user || !pass) throw new Error('Email not configured (set SMTP_USER / SMTP_PASS)');
  const port = Number(process.env.SMTP_PORT || 465);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

export const adminEmail = () => process.env.ADMIN_EMAIL || CONTACT.email;

export async function sendEmail(opts: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const from = process.env.SMTP_FROM || `"${SITE.name}" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`;
  await withTimeout(mailer().sendMail({ from, ...opts }));
}

function shell(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f3f1e8;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#1c2a1a">
  <div style="max-width:620px;margin:0 auto;padding:24px 12px">
    <div style="background:#17361f;border-radius:18px 18px 0 0;padding:28px;text-align:center">
      <div style="color:#c9e88a;font-size:12px;letter-spacing:3px;text-transform:uppercase">${h(SITE.tagline)}</div>
      <div style="color:#fff;font-size:26px;font-weight:700;margin-top:6px">${h(SITE.name)}</div>
    </div>
    <div style="background:#fff;padding:28px;border-radius:0 0 18px 18px">
      <h2 style="margin:0 0 14px;font-size:20px">${h(title)}</h2>${body}
    </div>
    <p style="text-align:center;color:#7a8576;font-size:12px;margin:16px 0">
      ${h(CONTACT.address)} · <a href="tel:${CONTACT.phone}" style="color:#3d7a2a">${h(CONTACT.phoneDisplay)}</a> ·
      <a href="${SITE_URL}" style="color:#3d7a2a">${SITE_URL.replace('https://', '')}</a></p>
  </div></body></html>`;
}

function itemsTable(o: Order) {
  const rows = o.items
    .map((i) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${h(i.title)} × ${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${money(i.price * i.quantity)}</td></tr>`)
    .join('');
  return `<table style="width:100%;border-collapse:collapse;font-size:14px">${rows}
    <tr><td style="padding:8px 0;color:#666">Subtotal</td><td style="text-align:right">${money(o.subtotal)}</td></tr>
    <tr><td style="padding:4px 0;color:#666">Delivery</td><td style="text-align:right">${o.shipping ? money(o.shipping) : 'Free'}</td></tr>
    <tr><td style="padding:10px 0;font-weight:700;font-size:16px">Total</td><td style="text-align:right;font-weight:700;font-size:16px">${money(o.total)}</td></tr></table>`;
}

export function orderLines(o: Order) {
  return o.items.map((i) => `• ${i.title} × ${i.quantity} — ${money(i.price * i.quantity)}`).join('\n');
}

async function emailAdminOrder(o: Order) {
  const html = shell(`New order ${o.id}`, `
    <p style="margin:0 0 12px;font-size:14px"><strong>${h(o.customerName)}</strong> · <a href="tel:${h(o.phone)}">${h(o.phone)}</a>${o.email ? ` · ${h(o.email)}` : ''}<br>
    ${h(o.address)}, ${h(o.city)}<br>Payment: ${PAYMENT_METHODS[o.paymentMethod]}${o.notes ? `<br>Notes: ${h(o.notes)}` : ''}</p>
    ${itemsTable(o)}
    <p style="margin-top:20px"><a href="${SITE_URL}/admin/orders/${encodeURIComponent(o.id)}" style="background:#17361f;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600">Open in admin</a></p>`);
  await sendEmail({
    to: adminEmail(),
    subject: `🛒 New order ${o.id} — ${money(o.total)} (${o.customerName})`,
    html,
    text: `New order ${o.id}\n${o.customerName} ${o.phone}\n${o.address}, ${o.city}\n\n${orderLines(o)}\n\nTotal ${money(o.total)}\n${SITE_URL}/admin/orders/${o.id}`,
    replyTo: o.email || undefined,
  });
}

async function emailCustomerOrder(o: Order) {
  if (!o.email) return;
  const html = shell(`Thank you, ${o.customerName.split(' ')[0]}! Your order is confirmed`, `
    <p style="font-size:14px;line-height:1.6">We've received your order <strong>${h(o.id)}</strong>. Our team will confirm it on WhatsApp shortly and dispatch it to <strong>${h(o.city)}</strong>.</p>
    ${itemsTable(o)}
    <p style="font-size:14px;margin-top:18px">Payment: <strong>${PAYMENT_METHODS[o.paymentMethod]}</strong><br>Delivery to: ${h(o.address)}, ${h(o.city)}</p>
    <p style="margin-top:20px"><a href="${SITE_URL}/track?order=${encodeURIComponent(o.id)}" style="background:#17361f;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600">Track your order</a></p>`);
  await sendEmail({
    to: o.email,
    subject: `Order ${o.id} confirmed — ${SITE.name}`,
    html,
    text: `Thank you for your order ${o.id}!\n\n${orderLines(o)}\n\nTotal ${money(o.total)}\nTrack: ${SITE_URL}/track?order=${o.id}`,
  });
}

export async function emailStatusUpdate(o: Order) {
  if (!o.email) return false;
  try {
    const track = o.trackingNumber ? `<p style="font-size:14px">Courier: <strong>${h(o.courier || '')}</strong> · Tracking #: <strong>${h(o.trackingNumber)}</strong></p>` : '';
    await sendEmail({
      to: o.email,
      subject: `Order ${o.id} is now ${STATUS_LABEL[o.status]}`,
      html: shell(`Your order is ${STATUS_LABEL[o.status].toLowerCase()}`, `<p style="font-size:14px">Order <strong>${h(o.id)}</strong> status: <strong>${STATUS_LABEL[o.status]}</strong>.</p>${track}
        <p><a href="${SITE_URL}/track?order=${encodeURIComponent(o.id)}" style="color:#3d7a2a">Track your order</a></p>`),
      text: `Order ${o.id} is now ${STATUS_LABEL[o.status]}.`,
    });
    return true;
  } catch (e) {
    console.error('[notify] status email failed', e);
    return false;
  }
}

/* ───────────────────────── WhatsApp ───────────────────────── */

export function waNumber(phone: string) {
  return phone.replace(/\D/g, '');
}

/**
 * Providers (WHATSAPP_PROVIDER):
 *  - cloudapi : Meta WhatsApp Business Cloud API (WHATSAPP_TOKEN, WHATSAPP_PHONE_ID)
 *  - twilio   : Twilio WhatsApp (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM)
 *  - callmebot: free, owner-only alerts (CALLMEBOT_APIKEY)  — cannot message customers
 */
export function whatsappProvider(): 'cloudapi' | 'twilio' | 'callmebot' | null {
  const p = process.env.WHATSAPP_PROVIDER;
  if (p === 'cloudapi' || p === 'twilio' || p === 'callmebot') return p;
  return null;
}

export const adminWhatsapp = () => waNumber(process.env.ADMIN_WHATSAPP || CONTACT.whatsappNumber);

export async function sendWhatsapp(to: string, text: string, tpl?: { name: string; params: string[] }) {
  const provider = whatsappProvider();
  const num = waNumber(to);
  if (!provider) throw new Error('WhatsApp not configured (set WHATSAPP_PROVIDER)');

  if (provider === 'callmebot') {
    if (num !== adminWhatsapp()) throw new Error('CallMeBot can only message the store owner');
    const url = `https://api.callmebot.com/whatsapp.php?phone=${num}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(process.env.CALLMEBOT_APIKEY || '')}`;
    const r = await withTimeout(fetch(url));
    if (!r.ok) throw new Error(`CallMeBot ${r.status}`);
    return;
  }

  if (provider === 'twilio') {
    const sid = process.env.TWILIO_ACCOUNT_SID, tok = process.env.TWILIO_AUTH_TOKEN, from = process.env.TWILIO_WHATSAPP_FROM;
    if (!sid || !tok || !from) throw new Error('Twilio env vars missing');
    const body = new URLSearchParams({ From: `whatsapp:${from.replace('whatsapp:', '')}`, To: `whatsapp:+${num}`, Body: text });
    const r = await withTimeout(fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${tok}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    }));
    if (!r.ok) throw new Error(`Twilio ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return;
  }

  // Meta Cloud API
  const token = process.env.WHATSAPP_TOKEN, phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) throw new Error('WhatsApp Cloud API env vars missing');
  const payload = tpl && process.env.WHATSAPP_USE_TEMPLATES === 'true'
    ? { messaging_product: 'whatsapp', to: num, type: 'template', template: {
        name: tpl.name, language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en' },
        components: [{ type: 'body', parameters: tpl.params.map((t) => ({ type: 'text', text: t })) }] } }
    : { messaging_product: 'whatsapp', to: num, type: 'text', text: { body: text } };
  const r = await withTimeout(fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }));
  if (!r.ok) throw new Error(`WhatsApp ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

function adminWaText(o: Order) {
  return `🛒 *New order ${o.id}*\n\n👤 ${o.customerName}\n📞 ${o.phone}\n📍 ${o.address}, ${o.city}\n💳 ${PAYMENT_METHODS[o.paymentMethod]}\n\n${orderLines(o)}\n\n*Total: ${money(o.total)}*${o.notes ? `\n📝 ${o.notes}` : ''}\n\n${SITE_URL}/admin/orders/${o.id}`;
}

function customerWaText(o: Order) {
  return `Assalam-o-Alaikum ${o.customerName}! 🌿\n\nThank you for ordering from *${SITE.name}*.\nYour order *${o.id}* has been received.\n\n${orderLines(o)}\n\n*Total: ${money(o.total)}* (${PAYMENT_METHODS[o.paymentMethod]})\n\nTrack: ${SITE_URL}/track?order=${o.id}`;
}

export async function whatsappStatusUpdate(o: Order) {
  try {
    const t = `Hi ${o.customerName}, your ${SITE.name} order *${o.id}* is now *${STATUS_LABEL[o.status]}*.${o.trackingNumber ? `\nCourier: ${o.courier || ''} · Tracking: ${o.trackingNumber}` : ''}\n${SITE_URL}/track?order=${o.id}`;
    await sendWhatsapp(o.phone, t, { name: process.env.WHATSAPP_TEMPLATE_STATUS || 'order_status', params: [o.customerName, o.id, STATUS_LABEL[o.status]] });
    return true;
  } catch (e) {
    console.error('[notify] status whatsapp failed', e);
    return false;
  }
}

/* ───────────────────────── Orchestration ───────────────────────── */

export async function notifyNewOrder(o: Order): Promise<NotifyResult> {
  const result: NotifyResult = { errors: [] };
  const run = async (key: keyof Omit<NotifyResult, 'errors'>, fn: () => Promise<unknown>, applicable = true) => {
    if (!applicable) return; // not attempted → not reported
    try { await fn(); result[key] = true; }
    catch (e) { result[key] = false; result.errors!.push(`${key}: ${e instanceof Error ? e.message : String(e)}`); console.error('[notify]', key, e); }
  };
  const tplAdmin = { name: process.env.WHATSAPP_TEMPLATE_ADMIN || 'new_order_admin', params: [o.id, o.customerName, money(o.total), o.items.map((i) => `${i.title} x${i.quantity}`).join(', ')] };
  const tplCustomer = { name: process.env.WHATSAPP_TEMPLATE_CUSTOMER || 'order_confirmation', params: [o.customerName, o.id, money(o.total)] };
  await Promise.all([
    run('adminEmail', () => emailAdminOrder(o)),
    run('customerEmail', () => emailCustomerOrder(o), !!o.email),
    run('adminWhatsapp', () => sendWhatsapp(adminWhatsapp(), adminWaText(o), tplAdmin)),
    run('customerWhatsapp', () => sendWhatsapp(o.phone, customerWaText(o), tplCustomer), ['cloudapi', 'twilio'].includes(whatsappProvider() ?? '')),
  ]);
  if (!result.errors!.length) delete result.errors;
  await saveNotifications(o.id, result).catch(() => {});
  return result;
}

export function customerWhatsappLink(o: Order) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(`Hi ${SITE.name}! I just placed order ${o.id} (${money(o.total)}). Please confirm.`)}`;
}

export async function notifyAdminChat(name: string | null, text: string) {
  const msg = `💬 *New website chat*${name ? ` from ${name}` : ''}\n\n"${text.slice(0, 300)}"\n\nReply: ${SITE_URL}/admin/chats`;
  await Promise.allSettled([
    sendWhatsapp(adminWhatsapp(), msg, { name: process.env.WHATSAPP_TEMPLATE_CHAT || 'new_chat_admin', params: [name || 'Visitor', text.slice(0, 200)] }),
    sendEmail({ to: adminEmail(), subject: `💬 New chat message${name ? ` from ${name}` : ''}`, html: shell('New website chat', `<p style="font-size:15px">"${h(text.slice(0, 500))}"</p><p><a href="${SITE_URL}/admin/chats">Reply in admin</a></p>`), text: msg }),
  ]);
}

export async function notifyAdminContact(c: { name: string; email?: string; phone?: string; message: string }) {
  await sendEmail({
    to: adminEmail(),
    subject: `✉️ Contact form: ${c.name}`,
    replyTo: c.email || undefined,
    html: shell('New contact message', `<p style="font-size:14px"><strong>${h(c.name)}</strong>${c.email ? ` · ${h(c.email)}` : ''}${c.phone ? ` · ${h(c.phone)}` : ''}</p><p style="font-size:15px;white-space:pre-wrap">${h(c.message)}</p>`),
    text: `${c.name} ${c.email || ''} ${c.phone || ''}\n\n${c.message}`,
  });
  await sendWhatsapp(adminWhatsapp(), `✉️ *Contact form* — ${c.name} ${c.phone || ''}\n${c.message.slice(0, 400)}`).catch(() => {});
}
