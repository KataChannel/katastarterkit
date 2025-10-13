# 🎨 Custom Header & Footer Guide

## ✨ Tổng Quan

Bạn có **3 cách** để custom header và footer trong PageBuilder:

### 1. **Basic Customization** (Qua UI Settings)
- Bật/tắt header/footer
- Chọn style/variant có sẵn
- Đơn giản, không cần code

### 2. **Advanced Customization** (Config JSON)
- Pass props để customize màu, logo, menu items
- Control chi tiết hơn
- Cần hiểu JSON structure

### 3. **Full Custom** (Create Component)
- Tạo component header/footer riêng
- Control 100%
- Cần biết React/TypeScript

---

## 📖 Method 1: Basic Customization (UI Settings)

### Step 1: Vào PageBuilder Settings

```
PageBuilder → Click Settings (⚙️) → Tab "Layout"
```

### Step 2: Chọn Header Variant

**Available Variants:**
```
default   → Logo trái, menu giữa, actions phải
minimal   → Chỉ logo và 1 CTA button (compact)
centered  → Logo + menu + CTA center (elegant)
mega      → Mega menu với large dropdowns (e-commerce)
```

### Step 3: Chọn Footer Variant

**Available Variants:**
```
default     → 4 columns with links (standard)
minimal     → Chỉ copyright (landing pages)
extended    → Newsletter + nhiều columns (homepage)
newsletter  → Focus newsletter signup (email capture)
```

### Example: Landing Page
```
Settings → Layout:
  Header Variant: minimal
  Footer Variant: minimal

Result: Clean landing page với minimal nav
```

---

## 🚀 Method 2: Advanced Customization (Config JSON)

### Cách Hoạt Động

Bạn có thể pass **JSON config** để customize header/footer với:
- Custom logo & brand name
- Custom menu items
- Custom colors
- Custom CTA buttons
- Custom social links

### Step 1: Tạo Header Config

Trong PageBuilder, thêm config JSON vào `layoutSettings.headerConfig`:

```json
{
  "brand": {
    "name": "My Startup",
    "logo": "/images/logo.png",
    "tagline": "Building the future"
  },
  "menuItems": [
    {
      "label": "Products",
      "href": "/products",
      "children": [
        { "label": "Product A", "href": "/products/a" },
        { "label": "Product B", "href": "/products/b" }
      ]
    },
    {
      "label": "Pricing",
      "href": "/pricing"
    },
    {
      "label": "About",
      "href": "/about"
    }
  ],
  "showSearch": true,
  "showCart": true,
  "showAuth": true,
  "backgroundColor": "bg-blue-600",
  "textColor": "text-white",
  "ctaButton": {
    "text": "Get Started",
    "href": "/signup",
    "variant": "secondary"
  }
}
```

### Step 2: Tạo Footer Config

```json
{
  "brand": {
    "name": "My Startup",
    "tagline": "Building amazing products since 2025"
  },
  "columns": [
    {
      "title": "Product",
      "links": [
        { "label": "Features", "href": "/features" },
        { "label": "Pricing", "href": "/pricing" },
        { "label": "Demo", "href": "/demo" }
      ]
    },
    {
      "title": "Company",
      "links": [
        { "label": "About", "href": "/about" },
        { "label": "Blog", "href": "/blog" },
        { "label": "Careers", "href": "/careers" }
      ]
    },
    {
      "title": "Support",
      "links": [
        { "label": "Help Center", "href": "/help" },
        { "label": "Contact", "href": "/contact" }
      ]
    }
  ],
  "socialLinks": [
    { "platform": "github", "url": "https://github.com/yourcompany" },
    { "platform": "twitter", "url": "https://twitter.com/yourcompany" },
    { "platform": "linkedin", "url": "https://linkedin.com/company/yourcompany" }
  ],
  "copyright": "© 2025 My Startup. All rights reserved.",
  "backgroundColor": "bg-gray-900",
  "textColor": "text-gray-300"
}
```

### Step 3: Apply Config Programmatically

Nếu bạn dùng API/GraphQL để tạo page:

```typescript
const pageInput = {
  title: "Landing Page",
  slug: "landing",
  layoutSettings: {
    hasHeader: true,
    hasFooter: true,
    headerVariant: "minimal",
    footerVariant: "extended",
    headerConfig: {
      brand: { name: "My Startup", logo: "/logo.png" },
      ctaButton: { text: "Sign Up", href: "/signup", variant: "default" },
      backgroundColor: "bg-white",
      textColor: "text-gray-900"
    },
    footerConfig: {
      brand: { name: "My Startup" },
      columns: [...],
      socialLinks: [...],
      showNewsletter: true,
      newsletterTitle: "Stay Updated",
      backgroundColor: "bg-gray-900"
    }
  }
};
```

---

## 💎 Method 3: Full Custom Components

### Khi Nào Dùng?

- Cần design hoàn toàn unique
- Variants có sẵn không đáp ứng
- Có animation/interaction phức tạp
- Integrate với service khác (auth, search, etc.)

### Step 1: Tạo Custom Header Component

```tsx
// components/layout/MyCustomHeader.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function MyCustomHeader() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            🚀 MyBrand
          </Link>
          
          <nav className="flex space-x-6">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/about">About</Link>
          </nav>
          
          <Button variant="secondary">
            Get Started Free
          </Button>
        </div>
      </div>
    </header>
  );
}
```

### Step 2: Tạo Custom Footer Component

```tsx
// components/layout/MyCustomFooter.tsx
'use client';

export function MyCustomFooter() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold mb-4">
          Ready to get started?
        </h3>
        <p className="text-gray-400 mb-6">
          Join thousands of happy customers
        </p>
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-full">
          Start Free Trial
        </button>
      </div>
    </footer>
  );
}
```

### Step 3: Update Dynamic Page

```tsx
// app/website/[slug]/page.tsx
import { MyCustomHeader } from '@/components/layout/MyCustomHeader';
import { MyCustomFooter } from '@/components/layout/MyCustomFooter';

// In render logic:
{layoutSettings.hasHeader && (
  layoutSettings.customHeaderComponent === 'MyCustomHeader' ? (
    <MyCustomHeader />
  ) : layoutSettings.headerConfig ? (
    <CustomHeader {...layoutSettings.headerConfig} />
  ) : (
    <WebsiteHeader />
  )
)}
```

---

## 📚 Complete Examples

### Example 1: E-commerce Homepage

```json
{
  "layoutSettings": {
    "hasHeader": true,
    "hasFooter": true,
    "headerVariant": "mega",
    "footerVariant": "extended",
    "headerConfig": {
      "brand": {
        "name": "ShopHub",
        "logo": "/shop-logo.png"
      },
      "menuItems": [
        {
          "label": "Shop",
          "href": "/shop",
          "children": [
            { "label": "Men", "href": "/shop/men" },
            { "label": "Women", "href": "/shop/women" },
            { "label": "Kids", "href": "/shop/kids" },
            { "label": "Sale", "href": "/shop/sale" }
          ]
        },
        { "label": "New Arrivals", "href": "/new" },
        { "label": "Brands", "href": "/brands" }
      ],
      "showSearch": true,
      "showCart": true,
      "showAuth": true,
      "backgroundColor": "bg-white",
      "textColor": "text-gray-900"
    },
    "footerConfig": {
      "brand": {
        "name": "ShopHub",
        "tagline": "Your one-stop online shop"
      },
      "columns": [
        {
          "title": "Shop",
          "links": [
            { "label": "Men's Fashion", "href": "/shop/men" },
            { "label": "Women's Fashion", "href": "/shop/women" },
            { "label": "Accessories", "href": "/shop/accessories" }
          ]
        },
        {
          "title": "Customer Service",
          "links": [
            { "label": "Track Order", "href": "/track" },
            { "label": "Returns", "href": "/returns" },
            { "label": "Shipping Info", "href": "/shipping" }
          ]
        },
        {
          "title": "About",
          "links": [
            { "label": "Our Story", "href": "/about" },
            { "label": "Careers", "href": "/careers" },
            { "label": "Press", "href": "/press" }
          ]
        }
      ],
      "socialLinks": [
        { "platform": "instagram", "url": "https://instagram.com/shophub" },
        { "platform": "facebook", "url": "https://facebook.com/shophub" }
      ],
      "showNewsletter": true,
      "newsletterTitle": "Get 10% off your first order",
      "newsletterDescription": "Subscribe to our newsletter for exclusive deals"
    }
  }
}
```

### Example 2: SaaS Landing Page

```json
{
  "layoutSettings": {
    "hasHeader": true,
    "hasFooter": true,
    "headerVariant": "minimal",
    "footerVariant": "newsletter",
    "headerStyle": "transparent",
    "headerConfig": {
      "brand": {
        "name": "CloudApp"
      },
      "ctaButton": {
        "text": "Start Free Trial",
        "href": "/signup",
        "variant": "default"
      },
      "transparent": true,
      "textColor": "text-white"
    },
    "footerConfig": {
      "brand": {
        "name": "CloudApp"
      },
      "backgroundColor": "bg-gradient-to-r from-blue-600 to-purple-600",
      "newsletterTitle": "Start your free trial today",
      "newsletterDescription": "No credit card required. Cancel anytime.",
      "socialLinks": [
        { "platform": "twitter", "url": "https://twitter.com/cloudapp" },
        { "platform": "linkedin", "url": "https://linkedin.com/company/cloudapp" }
      ]
    }
  }
}
```

### Example 3: Blog/Content Site

```json
{
  "layoutSettings": {
    "hasHeader": true,
    "hasFooter": true,
    "headerVariant": "centered",
    "footerVariant": "default",
    "headerConfig": {
      "brand": {
        "name": "TechBlog",
        "tagline": "Insights on Technology & Innovation"
      },
      "menuItems": [
        { "label": "Articles", "href": "/articles" },
        { "label": "Videos", "href": "/videos" },
        { "label": "Podcasts", "href": "/podcasts" },
        { "label": "About", "href": "/about" }
      ],
      "showSearch": true,
      "backgroundColor": "bg-white",
      "textColor": "text-gray-900"
    },
    "footerConfig": {
      "brand": {
        "name": "TechBlog",
        "tagline": "Stay curious, stay informed"
      },
      "columns": [
        {
          "title": "Content",
          "links": [
            { "label": "Latest Posts", "href": "/latest" },
            { "label": "Categories", "href": "/categories" },
            { "label": "Authors", "href": "/authors" }
          ]
        },
        {
          "title": "Connect",
          "links": [
            { "label": "Newsletter", "href": "/newsletter" },
            { "label": "RSS Feed", "href": "/rss" },
            { "label": "Contact", "href": "/contact" }
          ]
        }
      ],
      "socialLinks": [
        { "platform": "twitter", "url": "https://twitter.com/techblog" },
        { "platform": "youtube", "url": "https://youtube.com/techblog" }
      ]
    }
  }
}
```

---

## 🎯 Header Props Reference

```typescript
interface HeaderProps {
  variant?: 'default' | 'minimal' | 'centered' | 'mega';
  brand?: {
    name: string;
    logo?: string;
    tagline?: string;
  };
  menuItems?: MenuItem[];
  showSearch?: boolean;
  showCart?: boolean;
  showAuth?: boolean;
  backgroundColor?: string; // Tailwind class
  textColor?: string; // Tailwind class
  logoPosition?: 'left' | 'center';
  ctaButton?: {
    text: string;
    href: string;
    variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  };
  sticky?: boolean;
  transparent?: boolean;
}

interface MenuItem {
  label: string;
  href: string;
  icon?: string;
  children?: MenuItem[];
}
```

## 🎯 Footer Props Reference

```typescript
interface FooterProps {
  variant?: 'default' | 'minimal' | 'extended' | 'newsletter';
  brand?: {
    name: string;
    logo?: string;
    tagline?: string;
  };
  columns?: FooterColumn[];
  socialLinks?: SocialLink[];
  copyright?: string;
  backgroundColor?: string; // Tailwind class
  textColor?: string; // Tailwind class
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterDescription?: string;
}

interface FooterColumn {
  title: string;
  links: { label: string; href: string; }[];
}

interface SocialLink {
  platform: 'github' | 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'youtube';
  url: string;
}
```

---

## ✅ Best Practices

### 1. Choose the Right Variant

**Minimal Header/Footer:**
- ✅ Landing pages
- ✅ Sign-up flows
- ✅ Single-purpose pages
- ❌ Content-heavy sites

**Default:**
- ✅ Standard websites
- ✅ Blogs
- ✅ Corporate sites
- ✅ Portfolio sites

**Mega/Extended:**
- ✅ E-commerce
- ✅ Large catalogs
- ✅ Multi-category sites
- ❌ Simple sites (overkill)

### 2. Color Consistency

```json
{
  "headerConfig": {
    "backgroundColor": "bg-blue-600",
    "textColor": "text-white"
  },
  "footerConfig": {
    "backgroundColor": "bg-blue-900",
    "textColor": "text-gray-100"
  }
}
```

### 3. Mobile-First Menu

Keep menu items ≤ 5 for better mobile UX:

```json
{
  "menuItems": [
    { "label": "Products", "href": "/products" },
    { "label": "Pricing", "href": "/pricing" },
    { "label": "About", "href": "/about" },
    { "label": "Contact", "href": "/contact" }
  ]
}
```

### 4. Clear CTA

Always have 1 primary CTA in header:

```json
{
  "ctaButton": {
    "text": "Get Started",
    "href": "/signup",
    "variant": "default"
  }
}
```

---

## 🔧 Troubleshooting

**Q: Header config không hoạt động?**  
A: Kiểm tra `layoutSettings.headerVariant` đã set chưa. Nếu chưa, dùng default header.

**Q: Màu không đổi?**  
A: Dùng Tailwind classes (`bg-blue-600` không phải `#0000ff`). Ensure Tailwind compiled.

**Q: Menu items không hiện?**  
A: Check `menuItems` array có data. Variant `minimal` không show menu.

**Q: Custom component không render?**  
A: Đảm bảo import đúng và conditional logic check variant/config.

---

**Created:** October 13, 2025  
**Version:** 2.0  
**Feature:** Custom Header & Footer System
