# 📊 Sample Data - Custom Header & Footer Pages

## 🎯 Overview

File này chứa **5 sample pages** với custom layout settings để demo tất cả variants của header/footer.

---

## 📄 Sample Pages

### 1. E-commerce Homepage (`/website/ecommerce-home`)

**Layout:**
- Header: `mega` variant
- Footer: `extended` variant with newsletter

**Features:**
- Mega menu with dropdown categories
- Shopping cart & search
- Social media links
- Newsletter signup

**Use Case:** E-commerce site, online shop

**Config Highlights:**
```json
{
  "headerVariant": "mega",
  "headerConfig": {
    "brand": { "name": "ShopHub" },
    "menuItems": [/* Shop, New Arrivals, Brands */],
    "showSearch": true,
    "showCart": true
  },
  "footerVariant": "extended",
  "footerConfig": {
    "showNewsletter": true,
    "newsletterTitle": "Get 10% off your first order"
  }
}
```

---

### 2. SaaS Landing Page (`/website/cloudapp-landing`)

**Layout:**
- Header: `minimal` variant with transparent style
- Footer: `newsletter` variant with gradient

**Features:**
- Transparent header overlay
- Single CTA button
- Newsletter-focused footer
- Gradient background

**Use Case:** SaaS product, landing page, lead generation

**Config Highlights:**
```json
{
  "headerVariant": "minimal",
  "headerStyle": "transparent",
  "headerConfig": {
    "transparent": true,
    "textColor": "text-white",
    "ctaButton": { "text": "Start Free Trial" }
  },
  "footerVariant": "newsletter",
  "footerConfig": {
    "backgroundColor": "bg-gradient-to-r from-blue-600 to-purple-600"
  }
}
```

---

### 3. Technology Blog (`/website/techblog`)

**Layout:**
- Header: `centered` variant with sticky style
- Footer: `default` variant

**Features:**
- Centered logo and navigation
- Sticky header on scroll
- Multiple footer columns
- Social links

**Use Case:** Blog, content site, magazine

**Config Highlights:**
```json
{
  "headerVariant": "centered",
  "headerStyle": "sticky",
  "headerConfig": {
    "brand": {
      "name": "TechBlog",
      "tagline": "Insights on Technology & Innovation"
    },
    "sticky": true,
    "showSearch": true
  },
  "footerVariant": "default"
}
```

---

### 4. Product Launch (`/website/product-launch`)

**Layout:**
- Header: **Hidden**
- Footer: **Hidden**

**Features:**
- Fullscreen content
- No navigation distractions
- Perfect for landing pages

**Use Case:** Product launch, waitlist, sign-up page

**Config Highlights:**
```json
{
  "hasHeader": false,
  "hasFooter": false
}
```

---

### 5. Startup Homepage (`/website/startup-home`)

**Layout:**
- Header: `default` variant with fixed style
- Footer: `default` variant

**Features:**
- Fixed header (always visible)
- Custom brand color (indigo-600)
- Nested menu with dropdowns
- Standard footer columns

**Use Case:** Startup, corporate, business site

**Config Highlights:**
```json
{
  "headerVariant": "default",
  "headerStyle": "fixed",
  "headerConfig": {
    "backgroundColor": "bg-indigo-600",
    "textColor": "text-white",
    "ctaButton": { "text": "Get Started Free" }
  }
}
```

---

## 🚀 How to Use

### Step 1: Run Seed Script

```bash
cd backend
bun run scripts/seed-sample-pages.ts
```

### Step 2: View Pages

Visit these URLs:
- http://localhost:3000/website/ecommerce-home
- http://localhost:3000/website/cloudapp-landing
- http://localhost:3000/website/techblog
- http://localhost:3000/website/product-launch
- http://localhost:3000/website/startup-home

### Step 3: Edit in PageBuilder

1. Go to http://localhost:3000/admin/pagebuilder
2. Select any sample page
3. Click Settings → Layout tab
4. See the pre-configured layout settings
5. Modify and test

---

## 📊 Variant Coverage

| Variant | Header | Footer |
|---------|--------|--------|
| **default** | ✅ Startup | ✅ TechBlog, Startup |
| **minimal** | ✅ CloudApp | ❌ (No sample) |
| **centered** | ✅ TechBlog | ❌ (No sample) |
| **mega** | ✅ ShopHub | ❌ (No sample) |
| **extended** | ❌ (N/A) | ✅ ShopHub |
| **newsletter** | ❌ (N/A) | ✅ CloudApp |

---

## 🎨 Visual Comparison

### Header Variants

```
┌─────────────────────────────────────────────┐
│ DEFAULT (ShopHub, Startup)                  │
│ [Logo]  Menu1  Menu2  Menu3  [Search][Cart]│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ MINIMAL (CloudApp)                          │
│ [Logo]                    [Start Free Trial]│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ CENTERED (TechBlog)                         │
│              [Logo + Tagline]               │
│         Menu1  Menu2  Menu3  Menu4          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ MEGA (ShopHub)                              │
│ [Logo]  Shop▼  New Arrivals  Brands▼       │
│         [Large dropdown with categories]    │
└─────────────────────────────────────────────┘
```

### Footer Variants

```
┌─────────────────────────────────────────────┐
│ DEFAULT (TechBlog, Startup)                 │
│ [Logo]    Column1   Column2   Column3       │
│           Links     Links     Links          │
│                                              │
│ © 2025 Brand. All rights reserved.          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ EXTENDED (ShopHub)                          │
│ ┌───────────────────────────────────────┐   │
│ │  Subscribe to newsletter              │   │
│ │  [Email input] [Subscribe button]     │   │
│ └───────────────────────────────────────┘   │
│                                              │
│ [Logo]    Column1   Column2   Column3       │
│                                              │
│ © 2025 Brand. All rights reserved.          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ NEWSLETTER (CloudApp)                       │
│                                              │
│     Start your free trial today             │
│     No credit card required                 │
│                                              │
│     [Email input] [Subscribe]               │
│                                              │
│     [Social Icons]                          │
│                                              │
│ © 2025 Brand. All rights reserved.          │
└─────────────────────────────────────────────┘
```

---

## 🔍 Database Schema

Each page is stored with:

```typescript
{
  id: string;
  title: string;
  slug: string;
  status: 'PUBLISHED';
  layoutSettings: {
    hasHeader: boolean;
    hasFooter: boolean;
    headerStyle?: 'default' | 'transparent' | 'fixed' | 'sticky';
    footerStyle?: 'default' | 'minimal' | 'extended';
    headerVariant?: 'default' | 'minimal' | 'centered' | 'mega';
    footerVariant?: 'default' | 'minimal' | 'extended' | 'newsletter';
    headerConfig?: {
      brand?: { name, logo, tagline };
      menuItems?: MenuItem[];
      showSearch?: boolean;
      showCart?: boolean;
      showAuth?: boolean;
      backgroundColor?: string;
      textColor?: string;
      ctaButton?: { text, href, variant };
    };
    footerConfig?: {
      brand?: { name, tagline };
      columns?: FooterColumn[];
      socialLinks?: SocialLink[];
      copyright?: string;
      backgroundColor?: string;
      textColor?: string;
      showNewsletter?: boolean;
      newsletterTitle?: string;
    };
  };
}
```

---

## 📝 Seed Script Output

```bash
$ bun run scripts/seed-sample-pages.ts

🌱 Seeding sample pages with custom layout settings...

✅ Created: "Homepage - E-commerce Demo" (website/ecommerce-home)
   📐 Layout: Header=mega, Footer=extended
   🏷️  Brand: ShopHub

✅ Created: "CloudApp - SaaS Landing Page" (website/cloudapp-landing)
   📐 Layout: Header=minimal, Footer=newsletter
   🏷️  Brand: CloudApp

✅ Created: "TechBlog - Technology Insights" (website/techblog)
   📐 Layout: Header=centered, Footer=default
   🏷️  Brand: TechBlog

✅ Created: "Product Launch - Minimal Landing" (website/product-launch)
   📐 Layout: Header=undefined, Footer=undefined

✅ Created: "Startup Homepage" (website/startup-home)
   📐 Layout: Header=default, Footer=default
   🏷️  Brand: StartupX

📊 Summary:
   ✅ Created: 5 pages
   ⏭️  Skipped: 0 pages
   📄 Total: 5 pages

📋 Pages with custom layouts:

📄 Homepage - E-commerce Demo
   URL: /website/ecommerce-home
   Status: PUBLISHED
   Layout:
     - Header: mega (shown)
     - Footer: extended (shown)
     - Brand: ShopHub

📄 CloudApp - SaaS Landing Page
   URL: /website/cloudapp-landing
   Status: PUBLISHED
   Layout:
     - Header: minimal (shown)
     - Footer: newsletter (shown)
     - Brand: CloudApp

... (etc)

✅ Seeding completed successfully!
```

---

## 🎓 Learning Examples

### Customize E-commerce Page

1. Open in PageBuilder
2. Go to Settings → Layout
3. Try changing:
   - `headerVariant` to `default`
   - `footerVariant` to `minimal`
   - Brand name to your shop name
   - Add/remove menu items

### Create Landing Page from Scratch

1. Start with Product Launch template (no header/footer)
2. Add blocks: Hero, Features, CTA
3. Optionally add minimal header with CTA
4. Keep footer hidden or add newsletter variant

### Build Blog Layout

1. Start with TechBlog template
2. Customize:
   - Change brand name & tagline
   - Update menu items to your categories
   - Adjust footer columns to your content
   - Enable sticky header for better UX

---

## 🔧 Customization Tips

### Change Colors
```json
{
  "headerConfig": {
    "backgroundColor": "bg-purple-600",
    "textColor": "text-white"
  }
}
```

### Add More Menu Items
```json
{
  "menuItems": [
    {
      "label": "Products",
      "href": "/products",
      "children": [
        { "label": "Category A", "href": "/products/a" },
        { "label": "Category B", "href": "/products/b" }
      ]
    }
  ]
}
```

### Add Social Links
```json
{
  "footerConfig": {
    "socialLinks": [
      { "platform": "twitter", "url": "https://twitter.com/yourhandle" },
      { "platform": "github", "url": "https://github.com/yourorg" }
    ]
  }
}
```

---

## ✅ Next Steps

1. ✅ Run seed script
2. ✅ View sample pages
3. ✅ Edit in PageBuilder
4. ✅ Create your own pages
5. ✅ Customize layouts
6. ✅ Deploy to production

---

**Created:** October 13, 2025  
**File:** `backend/data/sample-pages-layout.json`  
**Script:** `backend/scripts/seed-sample-pages.ts`  
**Purpose:** Demo custom header/footer system
