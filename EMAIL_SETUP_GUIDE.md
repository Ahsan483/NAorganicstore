# Email Setup Guide - NA Organic Store

## Overview
Your website now has complete email functionality:
- **Contact Form** → Sends email to admin + confirmation to customer
- **Order Checkout** → Sends beautiful order confirmation to customer + admin notification
- **Professional HTML Emails** → Beautiful, mobile-responsive email templates

---

## Gmail SMTP Setup (Required)

### Step 1: Enable 2-Factor Authentication
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left menu
3. Enable **2-Step Verification** if not already enabled
   - You'll receive a code on your phone to confirm

### Step 2: Generate Gmail App Password
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select **Mail** from the app dropdown
3. Select **Windows Computer** (or your device type)
4. Click **Generate**
5. Gmail will show a 16-character password (example: `abcd efgh ijkl mnop`)
6. **Copy this password** (without spaces)

### Step 3: Update Environment Variables

#### For Local Development:
1. Create a file named `.env.local` in your project root (same folder as `package.json`)
2. Add these lines:
```env
EMAIL_USER=hakeemaziz8320@gmail.com
EMAIL_PASSWORD=your_16_character_gmail_app_password_here
EMAIL_FROM=noreply@naorganicstore.com
EMAIL_TO_ADMIN=hakeemaziz8320@gmail.com
```

3. Replace `your_16_character_gmail_app_password_here` with the password from Step 2 (example: `abcdefghijklmnop`)
4. Save the file
5. Restart your dev server: `npm run dev`

#### For Vercel (Production):
1. Go to your Vercel project: [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **NAorganicstore** project
3. Go to **Settings** → **Environment Variables**
4. Add these 4 variables:
   - `EMAIL_USER` = `hakeemaziz8320@gmail.com`
   - `EMAIL_PASSWORD` = Your 16-character Gmail app password
   - `EMAIL_FROM` = `noreply@naorganicstore.com`
   - `EMAIL_TO_ADMIN` = `hakeemaziz8320@gmail.com`
5. Click **Save**
6. Redeploy your site:
   - Go to **Deployments**
   - Click on the latest deployment
   - Click **Redeploy**

---

## Email Features

### 1. Contact Form Emails
When someone fills the contact form:
- **Admin Email**: Professional notification with customer details
- **Customer Email**: Confirmation message with their message body

**Template includes:**
- Green branded header with logo
- Customer information (name, email, timestamp)
- Customer's message in a highlighted box
- Next steps information
- Contact options (phone, email, WhatsApp)

### 2. Order Confirmation Emails
When someone places an order:
- **Admin Email**: Full order details with customer info for processing
- **Customer Email**: Order summary with what happens next

**Template includes:**
- Order ID and timestamp
- Customer name, phone, delivery location
- Itemized table with products, quantities, and prices
- Total amount highlighted
- Next steps (team will contact them within 24 hours)
- Support contact information

---

## Testing the Email Functionality

### Test Contact Form:
1. Open your website: https://naorganicstore.com
2. Scroll to "Get in Touch" section
3. Fill out the form:
   - Name: Test Name
   - Email: your-email@gmail.com
   - Message: This is a test message
4. Click "Send Message"
5. Check:
   - ✅ You receive a confirmation email
   - ✅ Admin email (hakeemaziz8320@gmail.com) receives notification

### Test Order Checkout:
1. Add a product to cart (click "Add to Cart")
2. Click the shopping cart icon
3. Fill out delivery information:
   - Name: Test Customer
   - Email: your-email@gmail.com
   - Phone: 03001234567
   - Location: Peshawar
4. Click "Place Order"
5. Check:
   - ✅ Success message shows with Order ID
   - ✅ You receive beautiful order confirmation email
   - ✅ Admin receives order notification email
   - ✅ WhatsApp opens with order details

---

## Mobile Responsiveness Testing

### Phone Features Working on Mobile:
1. **Phone Calls**: Tap phone number → Opens call dialog
2. **WhatsApp**: Click WhatsApp button → Opens WhatsApp app
3. **Email**: Tap email address → Opens email app
4. **Responsive Design**: All sections stack properly on small screens

### Test on Mobile:
1. Open https://naorganicstore.com on your phone
2. Test each section:
   - **Header**: Hamburger menu works
   - **Hero**: Title and buttons visible
   - **Products**: Grid stacks to 1 column
   - **Contact**: Form inputs full width
   - **Footer**: All links clickable

---

## Troubleshooting

### Emails Not Sending?

**Error: "Invalid credentials"**
- Check Gmail app password is correct (16 characters)
- Verify 2FA is enabled on your Google account
- Regenerate app password and update environment variables

**Error: "Cannot find module 'nodemailer'"**
- Run: `npm install nodemailer`
- Run: `npm install --save-dev @types/nodemailer`
- Restart dev server

**Error: "ENOTFOUND smtp.gmail.com"**
- Check internet connection
- Gmail SMTP might be blocked by firewall
- Try restarting the dev server

**Emails going to spam?**
- Gmail might filter them initially
- Check spam folder in your email
- After receiving a few, they'll go to inbox
- Add sender email to contacts to ensure inbox delivery

### Mobile Issues?

**Phone links not working?**
- Ensure you use `tel:` prefix (already done)
- Test on actual mobile device (not browser dev tools)

**WhatsApp not opening?**
- Make sure WhatsApp is installed on mobile
- WhatsApp link format is correct
- On desktop, opens WhatsApp Web

---

## Environment Variables Reference

| Variable | Value | Purpose |
|----------|-------|---------|
| `EMAIL_USER` | Gmail address | SMTP login username |
| `EMAIL_PASSWORD` | 16-char app password | SMTP login password |
| `EMAIL_FROM` | noreply@naorganicstore.com | Sender email address |
| `EMAIL_TO_ADMIN` | Admin email | Where orders/messages go |

---

## Email Template Features

Both email templates are:
- ✅ Fully responsive (mobile-friendly)
- ✅ Beautifully styled with green branding
- ✅ Include professional footer with contact info
- ✅ Have clickable phone/email/WhatsApp links
- ✅ Display in all major email clients

---

## Next Steps

1. **Generate Gmail App Password** (see Step 2 above)
2. **Update .env.local** for local testing
3. **Test contact form and checkout** locally
4. **Update Vercel environment variables** for production
5. **Verify emails arrive** in both customer and admin inboxes
6. **Test on mobile** to ensure all features work

---

## Support

If you have issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check your Gmail account security settings
4. Ensure nodemailer and types are installed: `npm install nodemailer @types/nodemailer`

---

**Your website is now ready for real email communications! 🎉**
