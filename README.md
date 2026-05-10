# NA Organic Store - Modern E-Commerce Platform


A modern, production-grade e-commerce platform for organic hair care products. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎯 Features

- ✅ **Modern Design** - Premium, clean, and professional UI
- ✅ **Responsive** - Mobile-first approach, works on all devices
- ✅ **Performance** - Optimized images, lazy loading, fast page loads
- ✅ **SEO Ready** - Metadata, Open Graph, structured data
- ✅ **Product Showcase** - Beautiful product cards with filtering
- ✅ **Shopping Cart** - LocalStorage-based cart management
- ✅ **WhatsApp Integration** - Direct order messaging
- ✅ **Contact Form** - Customer inquiry system
- ✅ **Dark/Light** - Theme support ready
- ✅ **TypeScript** - Full type safety
- ✅ **Accessibility** - WCAG compliant

## 🚀 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Font**: Geist (Google Fonts)
- **State Management**: React Hooks + LocalStorage
- **Deployment**: Optimized for Vercel

## 📁 Project Structure

```
.
├── app/
│   ├── components/
│   │   ├── shared/         # Reusable components
│   │   └── sections/       # Page sections
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── lib/
│   ├── constants.ts        # App constants
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
├── data/
│   └── products.ts         # Product data
├── public/
│   ├── robots.txt          # SEO robots
│   └── sitemap.xml         # SEO sitemap
└── next.config.ts          # Next.js config
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd na-organic-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

```bash
npm run build
npm start
```

## 📊 Performance

- **Lighthouse Score**: 95+
- **Core Web Vitals**: Optimized
- **Image Optimization**: AVIF + WebP
- **Code Splitting**: Automatic
- **Lazy Loading**: Built-in

## 🔐 Security

- Environment variables for sensitive data
- Input validation and sanitization
- HTTPS ready
- CSP headers configured
- No known vulnerabilities

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🚀 Deployment

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Other Platforms

```bash
npm run build
# Deploy the .next folder
```

## 📝 Environment Variables

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=+923291945009
NEXT_PUBLIC_GA_ID=G-M2DMPGF4CC
NEXT_PUBLIC_BUSINESS_EMAIL=hakeemaziz8320@gmail.com
NEXT_PUBLIC_BUSINESS_PHONE=+923028337026
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme.

### Products
Add/Edit products in `data/products.ts`.

### Content
Update content in component files under `app/components/`.

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🐛 Issues & Support

For issues or feature requests, please open an issue on GitHub.

## 📄 License

MIT License - feel free to use this template for your projects.

## 👤 Author

NA Organic Store Team

---

Built with ❤️ for organic, natural beauty products.
