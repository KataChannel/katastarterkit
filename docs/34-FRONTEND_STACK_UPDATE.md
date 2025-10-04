# Frontend Stack Update - TailwindCSS 4, Next.js 15, shadcn/ui Latest

## 📋 Tổng quan

Dự án đã được cập nhật lên các phiên bản mới nhất của:
- **Next.js 15.5.4** (latest)
- **React 19.2.0** (latest) 
- **TailwindCSS 4.1.14** (latest v4)
- **shadcn/ui** với shadcn CLI 3.3.1 (latest)

## 🎯 Cập nhật chính

### 1. **Next.js 15.5.4**
```json
"next": "15.5.4"
```

**Cấu hình tối ưu** (`next.config.js`):
```javascript
experimental: {
  // Optimize package imports
  optimizePackageImports: [
    '@heroicons/react', 
    '@headlessui/react',
    '@apollo/client',
    'react-hook-form',
    'react-hot-toast',
    'lucide-react',
    '@radix-ui/react-icons'
  ],
  // React Server Components optimizations
  serverComponentsExternalPackages: ['graphql'],
}
```

### 2. **React 19.2.0**
```json
"react": "^19.2.0",
"react-dom": "^19.2.0"
```

### 3. **TailwindCSS 4.1.14**
```json
"tailwindcss": "4.1.14",
"@tailwindcss/postcss": "4.1.14"
```

**PostCSS Config** (`postcss.config.js`):
```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};
export default config;
```

**Global CSS** (`globals.css`):
```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));
@custom-variant light (&:is(.light *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... other theme variables */
}
```

### 4. **shadcn/ui Components**

**CLI Version**: 3.3.1

**components.json**:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## 📦 Package Updates

### Core Dependencies
- ✅ `@apollo/client`: 3.11.0 → **4.0.7**
- ✅ `@headlessui/react`: 2.2.7 → **2.2.9**
- ✅ `axios`: 1.11.0 → **1.12.2**
- ✅ `next`: 15.5.0 → **15.5.4**
- ✅ `react`: 19.1.1 → **19.2.0**
- ✅ `react-dom`: 19.1.1 → **19.2.0**
- ✅ `react-hook-form`: 7.63.0 → **7.64.0**
- ✅ `yup`: 1.7.0 → **1.7.1**

### Dev Dependencies
- ✅ `@storybook/*`: 9.1.3 → **9.1.10**
- ✅ `@tailwindcss/postcss`: 4.1.13 → **4.1.14**
- ✅ `@testing-library/cypress`: 10.0.3 → **10.1.0**
- ✅ `@testing-library/jest-dom`: 6.8.0 → **6.9.1**
- ✅ `@types/node`: 24.3.0 → **24.6.2**
- ✅ `@types/react`: 19.1.11 → **19.2.0**
- ✅ `@types/react-dom`: 19.1.7 → **19.2.0**
- ✅ `cypress`: 15.0.0 → **15.3.0**
- ✅ `eslint`: 9.34.0 → **9.37.0**
- ✅ `eslint-config-next`: 15.5.0 → **15.5.4**
- ✅ `jest`: 30.0.5 → **30.2.0**
- ✅ `jest-environment-jsdom`: 30.0.5 → **30.2.0**
- ✅ `tailwindcss`: 4.1.13 → **4.1.14**
- ✅ `typescript`: 5.9.2 → **5.9.3**

## 🚀 Features

### TailwindCSS v4 Features
- ✅ **CSS-first configuration** với `@import "tailwindcss"`
- ✅ **@theme inline** directive cho theme configuration
- ✅ **@custom-variant** cho dark/light mode
- ✅ **CSS variables** với OKLCH color format
- ✅ **Modern CSS** với native CSS features

### Next.js 15 Features
- ✅ **React Server Components** (RSC) enabled
- ✅ **Optimized package imports** for better performance
- ✅ **Improved image optimization**
- ✅ **Better TypeScript support**
- ✅ **Enhanced build performance**

### shadcn/ui Features
- ✅ **New York style** components
- ✅ **RSC compatible** components
- ✅ **Lucide icons** integration
- ✅ **CSS variables** for theming
- ✅ **All Radix UI primitives** updated

## 📁 File Structure

```
frontend/
├── src/
│   ├── app/
│   │   └── globals.css          # TailwindCSS v4 config
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   └── layout/
│   │       └── website-header.tsx  # Updated with shadcn components
│   ├── lib/
│   │   └── utils.ts            # cn() helper
│   └── hooks/
├── components.json              # shadcn/ui config
├── next.config.js              # Next.js 15 config
├── postcss.config.js           # PostCSS with Tailwind v4
├── tsconfig.json               # TypeScript config
└── package.json                # Updated dependencies
```

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test

# Add shadcn component
npx shadcn@latest add [component-name]
```

## 🎨 shadcn/ui Usage

### Add New Component
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

### Import and Use
```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  )
}
```

## 🎯 Best Practices

### 1. **Use Server Components by default**
```tsx
// app/page.tsx - Server Component by default
export default async function Page() {
  const data = await fetch('...')
  return <div>{data}</div>
}
```

### 2. **Client Components when needed**
```tsx
'use client'
// For interactivity, hooks, browser APIs
import { useState } from 'react'
```

### 3. **TailwindCSS v4 Custom Variants**
```css
@custom-variant dark (&:is(.dark *));
@custom-variant hover (&:hover);
```

### 4. **CSS Variables for Theming**
```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
}
```

## 🔧 Troubleshooting

### Node Version Warning
The project requires Node.js >=20. Current version warnings can be ignored if using compatible features.

### Apollo Client v4 Breaking Changes
Apollo Client v4 has breaking changes. Review [migration guide](https://www.apollographql.com/docs/react/migration/4.0/).

### TailwindCSS v4 Migration
- No `tailwind.config.js` needed
- Use `@theme` directive in CSS
- CSS-first configuration

## 📚 Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev/blog/2024/12/05/react-19)
- [TailwindCSS v4 Docs](https://tailwindcss.com/docs/v4-beta)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Apollo Client v4](https://www.apollographql.com/docs/react/)

## ✅ Verification

Đã hoàn thành:
- ✅ Cập nhật package.json với dependencies mới nhất
- ✅ Cập nhật components.json cho shadcn@latest
- ✅ Kiểm tra postcss.config.js tương thích Tailwind v4
- ✅ Kiểm tra globals.css với Tailwind v4 syntax
- ✅ Cập nhật next.config.js với optimizations
- ✅ Cài đặt packages thành công

---

**Ngày cập nhật**: 2025-10-04  
**Phiên bản**: Frontend Stack v2.0
