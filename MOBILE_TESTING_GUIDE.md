# Mobile Testing & Feature Verification Guide

## 📱 Mobile Responsiveness Checklist

### Navigation & Header
- [ ] Hamburger menu appears on mobile (width < 768px)
- [ ] Logo visible on mobile
- [ ] Cart icon visible on mobile with badge
- [ ] Sticky navbar works when scrolling
- [ ] All nav links clickable on mobile

### Home/Hero Section
- [ ] Hero title stacks properly on small screens
- [ ] "Shop Now" button full width or properly sized
- [ ] "Learn More" button visible
- [ ] Background image loads without issues
- [ ] Scroll indicator animated at bottom

### Videos Section
- [ ] Video thumbnails display correctly
- [ ] Video player responsive
- [ ] Play button overlay visible
- [ ] Video titles and descriptions wrap properly
- [ ] Info boxes stack on mobile

### Products Section
- [ ] Product grid: 1 column on mobile, 2 on tablet, 3 on desktop
- [ ] Product cards have proper padding
- [ ] Product images load without distortion
- [ ] Price badge visible
- [ ] "Add to Cart" button full width
- [ ] Discount percentage displays correctly

### About Section
- [ ] Content stacks vertically on mobile
- [ ] Image doesn't overflow
- [ ] Feature cards stack in single column
- [ ] Text size readable on small screens
- [ ] "Get in Touch" button properly sized

### Contact Section
- [ ] Contact info icons visible
- [ ] Email/phone links clickable
- [ ] Form inputs full width
- [ ] Form labels visible
- [ ] "Chat on WhatsApp" button full width
- [ ] Form submit button large enough to tap

### Footer
- [ ] All sections stack vertically
- [ ] Links clickable with enough padding
- [ ] Social icons large enough to tap
- [ ] Text readable on small screens

---

## 🔧 Feature Testing Checklist

### Phone Call Links (tel:)
**Test on Mobile:**
1. Go to Contact section
2. Tap the phone number: **+92 302 833 7026**
3. ✅ Should open phone call dialog
4. ✅ Can accept or decline the call

**Test on Desktop:**
1. Tap the same phone number
2. ✅ Should show phone options (Skype, Teams, etc.)

---

### WhatsApp Integration
**Test on Mobile:**
1. Click "Chat on WhatsApp" button in Contact section
2. ✅ WhatsApp app opens (if installed)
3. ✅ Pre-filled message appears
4. ✅ Can send the message directly

**Test from Products:**
1. Add a product to cart
2. Click "WhatsApp" link on product card
3. ✅ Opens WhatsApp with product inquiry

**Test from Checkout:**
1. Add product to cart
2. Click cart icon
3. Fill in customer details
4. Click "Place Order"
5. ✅ WhatsApp opens with order details
6. ✅ Can confirm order via WhatsApp

---

### Email Links (mailto:)
**Test on Mobile:**
1. Tap email address in Contact section
2. ✅ Opens email app with address pre-filled
3. ✅ Can compose email

**Test on Desktop:**
1. Tap email address
2. ✅ Opens default email client

---

### Contact Form
**Test Locally:**
1. Fill out contact form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Message: "Test message from mobile"
2. Click "Send Message"
3. ✅ Success message appears
4. ✅ Form fields clear
5. Check emails:
   - ✅ John receives confirmation email
   - ✅ Admin receives notification email

---

### Shopping Cart
**Test on Mobile:**
1. Add product to cart
2. ✅ Cart badge shows quantity
3. ✅ Cart badge updates when adding more items
4. Click cart icon
5. Verify CartModal:
   - [ ] Modal opens fully
   - [ ] Close button (X) works
   - [ ] Quantity controls work (+/-)
   - [ ] Remove button works (trash icon)
   - [ ] Subtotal calculates correctly

---

### Order Checkout & Email
**Test Complete Flow:**
1. Add product to cart
2. Click cart icon
3. Fill in details:
   - Name: "Test Customer"
   - Email: "test@gmail.com"
   - Phone: "03001234567"
   - Location: "Peshawar"
4. Click "Place Order"
5. Verify:
   - ✅ Success message with Order ID
   - ✅ Cart clears
   - ✅ Modal closes
   - ✅ Check "test@gmail.com" inbox for order confirmation
   - ✅ Check admin email for order notification
   - ✅ WhatsApp opens with order details

---

## 📊 Performance Testing

### Page Load
- [ ] Homepage loads in < 3 seconds
- [ ] Images load progressively
- [ ] No console errors
- [ ] No missing assets (broken images)

### Animations
- [ ] Hero animations smooth on mobile
- [ ] Scroll animations trigger when visible
- [ ] No jank or stuttering
- [ ] Hover effects work on desktop

### Forms
- [ ] Form inputs focus properly
- [ ] Keyboard appears on mobile
- [ ] Validation works (required fields)
- [ ] Submit button disables during submission

---

## 🌐 Cross-Browser Testing

Test on these browsers if possible:

### Mobile Browsers
- [ ] Chrome on Android
- [ ] Safari on iOS
- [ ] Firefox on Android

### Desktop Browsers
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Edge

---

## 📐 Screen Sizes to Test

### Mobile (320px - 640px)
- iPhone SE, iPhone 6/7/8
- Small Android phones

### Tablet (768px - 1024px)
- iPad Mini
- iPad
- Android tablets

### Desktop (1024px+)
- Laptop
- Desktop monitor
- Extra wide screens (1920px+)

---

## 🚀 Testing Steps

### 1. Local Testing (Before Production)
```bash
npm run dev
# Open http://localhost:3000
# Test all features on mobile/tablet using Chrome DevTools
# Simulate different screen sizes
```

### 2. Production Testing (After Vercel Deployment)
```bash
# Visit https://naorganicstore.com
# Test on actual mobile device
# Test on different networks (WiFi + 4G)
# Test in different browsers
```

### 3. Email Testing
```bash
# Set up .env.local with Gmail credentials
# Test contact form
# Test order checkout
# Verify emails in both inboxes (customer + admin)
```

---

## 📋 Testing Report

Use this template to document your testing:

```
Date: ___________
Tester: ___________
Device: ___________ (iPhone 12, Samsung Galaxy, etc.)
OS: ___________ (iOS 15, Android 12, etc.)
Browser: ___________ (Chrome, Safari, etc.)

✅ All Navigation Working
✅ All Forms Working
✅ All Email Features Working
✅ All Links (tel:, mailto:, WhatsApp) Working
✅ Mobile Responsive (no horizontal scroll, text readable)
✅ Images Loading
✅ Animations Smooth
✅ Performance Good (loads fast)

Issues Found:
- Issue 1: ___________
- Issue 2: ___________

Signed: ___________
```

---

## 🔍 Common Issues & Solutions

### Issue: Phone numbers not clickable on desktop
**Solution:** Use actual phone or test with tel: link in dev tools

### Issue: WhatsApp not opening
**Solution:** WhatsApp must be installed, or use WhatsApp Web on desktop

### Issue: Emails going to spam
**Solution:** Check spam folder, add sender to contacts after first email

### Issue: Form not submitting
**Solution:** Check browser console for errors, verify all fields filled

### Issue: Images not loading
**Solution:** Check public/ folder for images, verify paths in components

### Issue: Mobile menu not closing
**Solution:** Click menu item to navigate, menu should auto-close

---

## ✅ Sign Off

When all tests pass, you're ready for production! 🎉

- [ ] All mobile tests passing
- [ ] All features working
- [ ] All emails sending correctly
- [ ] Site responsive on all devices
- [ ] Performance good
- [ ] No console errors
