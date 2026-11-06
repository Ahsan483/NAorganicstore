# NA Organic Store

Production e-commerce site for **NA Organic Store** (Peshawar) — https://www.naorganicstore.com

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Motion · libSQL/Turso · Nodemailer · WhatsApp (Cloud API / Twilio / CallMeBot)

## Features

**Storefront** — animated home page (kinetic typography, marquee, parallax), shop with category filter/search/sort, product pages, slide-in cart with free-delivery progress, guest checkout (Cash on Delivery or bank/Easypaisa/JazzCash transfer), order confirmation page, public order tracking (order # + phone), contact form, live chat widget, fully responsive (phone / tablet / desktop), reduced-motion friendly.

**Admin (`/admin`)** — dashboard (orders, revenue, 14-day chart, top products, low stock), orders list with search/filter/pagination, order detail (status, courier + tracking #, payment status, timeline, notification log, re-send alerts), product manager (price, stock, visibility, Urdu fields), live-chat inbox.

**Notifications** — on every new order the owner gets an **email + WhatsApp message**; the customer gets an email (if given) and a WhatsApp message (Cloud API / Twilio). Status changes notify the customer. New chats and contact-form messages alert the owner too. Results are stored on each order and shown in admin.

**Security** — server-side pricing & stock (client prices are ignored), zod validation, DB-backed rate limiting (orders, login, chat, tracking, contact), honeypot spam traps, scrypt password hash, signed HttpOnly/SameSite=Strict/Secure admin session cookie (8h), same-origin check on admin writes, HSTS/CSP/frame/nosniff headers, no public order enumeration (tracking requires the phone number), parameterised SQL everywhere, HTML-escaped emails.

**SEO** — per-page metadata & canonicals, Open Graph/Twitter cards, JSON-LD (Organization, Store, WebSite, Product + offers, BreadcrumbList, ItemList, FAQPage), `sitemap.xml` (includes all products), `robots.txt`, semantic headings, optimised AVIF/WebP images, ISR (60 s).

## Local development

```bash
npm install
cp .env.example .env.local     # then edit
npm run dev                    # http://localhost:3000
```

Without `DATABASE_URL` the app uses a local SQLite file (`./data/local.db`) and seeds the 8 products automatically. Without SMTP / WhatsApp variables, orders still work and the admin shows which notifications failed and why.

## Deploy (Vercel) — do these in order

1. **Database** (free): create a [Turso](https://turso.tech) DB
   ```bash
   turso db create na-organic
   turso db show na-organic --url          # → DATABASE_URL
   turso db tokens create na-organic       # → DATABASE_AUTH_TOKEN
   ```
   Tables and the starter catalogue are created automatically on first run.
2. **Admin password**
   ```bash
   npm run hash-password -- "choose-a-long-password"   # → ADMIN_PASSWORD_HASH
   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"   # → SESSION_SECRET
   ```
3. **Vercel → Project → Settings → Environment Variables** — add everything from `.env.example` (at minimum: `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `SMTP_USER`, `SMTP_PASS`, `ADMIN_EMAIL`, `ADMIN_WHATSAPP`, `WHATSAPP_PROVIDER` + its keys, `NEXT_PUBLIC_SITE_URL`). Wrap `ADMIN_PASSWORD_HASH` in nothing — paste as-is.
4. Push to `main` (Vercel auto-deploys) or redeploy from the dashboard. The build needs `DATABASE_URL` because pages are pre-rendered from the catalogue.
5. Open `/admin/login`, sign in, place a test order, and confirm the email + WhatsApp arrive.
6. **SEO**: add the site in [Google Search Console](https://search.google.com/search-console), submit `https://www.naorganicstore.com/sitemap.xml`, and create a Google Business Profile for the Abaseen Market shop.

### Email (Gmail)
Turn on 2-step verification, create an **App password** (https://myaccount.google.com/apppasswords) and use it as `SMTP_PASS` (`SMTP_USER` = that Gmail address).

### WhatsApp — choose one `WHATSAPP_PROVIDER`
| Provider | Messages the owner | Messages customers | Setup |
|---|---|---|---|
| `callmebot` | yes (free) | no | Send "I allow callmebot to send me messages" to +34 644 52 74 88 from your WhatsApp, put the key in `CALLMEBOT_APIKEY` |
| `cloudapi` | yes | yes | Meta WhatsApp Business Cloud API: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`. For people who haven't messaged you in 24 h you need approved templates (`new_order_admin` with 4 body params: order #, name, total, items; `order_confirmation` with 3: name, order #, total; `order_status` with 3: name, order #, status) then set `WHATSAPP_USE_TEMPLATES=true` |
| `twilio` | yes | yes | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM` |

Whatever the provider, the order-success page also shows a **Confirm on WhatsApp** button that opens a pre-filled chat with the store.

## Useful commands
```bash
npm run dev | build | start | lint
npm run hash-password -- "password"
```

## Structure
```
app/(shop)/…      storefront pages        app/admin/…       dashboard (auth-guarded)
app/api/…         REST endpoints          app/components/…  UI + motion primitives
lib/db.ts         libSQL + schema         lib/orders.ts     order logic & stats
lib/notify.ts     email + WhatsApp        lib/auth.ts       sessions   lib/security.ts  hashing/rate-limit
```
