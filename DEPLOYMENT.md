# NA Organic Store - Deployment Guide

## ✅ Build Status

The project successfully compiles and builds:
- ✅ TypeScript compilation successful
- ✅ Next.js build complete
- ✅ All routes optimized
- ✅ Ready for production

## 🚀 Quick Start

### Development
```bash
npm run dev
# Open http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
# Server runs on http://localhost:3000
```

## 📦 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the creator of Next.js and provides the best experience:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or connect GitHub and auto-deploy on push
# https://vercel.com/new
```

**Advantages:**
- One-click deployment
- Automatic HTTPS
- Edge functions
- Analytics included
- Custom domains
- Environment variables management

### Option 2: Railway

Easy Node.js hosting:

1. Go to https://railway.app
2. Connect GitHub
3. Select this repository
4. Set environment variables
5. Deploy

### Option 3: Render

Another great Node.js hosting option:

1. https://render.com
2. Connect GitHub
3. Create new Web Service
4. Build: `npm install && npm run build`
5. Start: `npm start`

### Option 4: Self-Hosted (VPS/Server)

Using DigitalOcean, Linode, AWS EC2, etc.:

```bash
# SSH into your server
ssh user@your-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone your repo
git clone https://github.com/yourusername/na-organic-frontend.git
cd na-organic-frontend

# Install and build
npm install
npm run build

# Use PM2 to keep app running
npm install -g pm2
pm2 start "npm start" --name "organic-store"
pm2 startup
pm2 save

# Setup Nginx as reverse proxy
# (instructions below)
```

#### Nginx Configuration

Create `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

### Option 5: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t organic-store .
docker run -p 3000:3000 organic-store
```

## 🔧 Environment Variables

Create `.env.local` with:

```env
# Optional: API configuration
NEXT_PUBLIC_API_URL=https://your-domain.com

# WhatsApp integration
NEXT_PUBLIC_WHATSAPP_NUMBER=+923291945009

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-M2DMPGF4CC

# Business info
NEXT_PUBLIC_BUSINESS_EMAIL=hakeemaziz8320@gmail.com
NEXT_PUBLIC_BUSINESS_PHONE=+923028337026
NEXT_PUBLIC_BUSINESS_ADDRESS=Abaseen Market, Shop #17
```

## 🌍 Custom Domain

### For Vercel

1. Go to your project settings
2. Domains → Add domain
3. Update DNS records at your registrar
4. Vercel will auto-generate SSL

### For Other Hosts

Update DNS A record to point to your server IP:

```
A  @  your-server-ip
```

Or use CNAME (if provider supports):

```
CNAME  www  your-host-cname
```

## 📊 Performance Monitoring

### Vercel Analytics
- Automatic with Vercel
- Real user metrics
- Performance insights

### Google Analytics

Add to `app/layout.tsx`:

```tsx
<script
  async
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
/>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
    `,
  }}
/>
```

## 🔒 Security Checklist

Before deployment:

- [ ] Update all secrets in environment variables
- [ ] Set `NEXT_PUBLIC_*` only for truly public data
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS if needed
- [ ] Set secure headers (done in next.config.ts)
- [ ] Update privacy policy
- [ ] Enable rate limiting for APIs
- [ ] Set up backup system
- [ ] Configure monitoring/alerting
- [ ] Review security dependencies: `npm audit`

## 📈 Optimization Tips

### Image Optimization
Already configured in `next.config.ts`:
- AVIF + WebP formats
- Automatic responsive sizing
- Lazy loading

### Code Splitting
Automatic with Next.js. Verify:
```bash
npm run build
# Check .next/static/chunks/app/
```

### Caching
Configure in `.env.production`:
```env
# Cache busting disabled by default
# Configure as needed
```

## 🔄 CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy
        run: |
          # Add your deployment command here
          # e.g., vercel --prod
```

## 🆘 Troubleshooting

### Build fails
```bash
npm ci  # Clean install
npm run build
```

### Port 3000 already in use
```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

### Database/API not connecting
- Check environment variables
- Verify API endpoints
- Check firewall rules
- Review logs

### Images not loading
- Verify image paths
- Check image optimization settings
- Review next.config.ts

## 📞 Support Contacts

- **For Vercel Issues**: vercel.com/support
- **For Node.js Issues**: nodejs.org
- **For Next.js Issues**: github.com/vercel/next.js/issues

---

**Recommended Deployment**: Vercel (simplest, most optimized)
**First Deployment**: Follow Vercel option above
**Custom Domain Cost**: $0-15/year (registrar dependent)
**Hosting Cost**: Free to $15/month depending on provider
