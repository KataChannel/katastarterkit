# 🎯 Quick Reference - Frontend Stack

## Current Versions (2025-10-04)

```
Next.js:      15.5.4  ✅
React:        19.2.0  ✅
TailwindCSS:  4.1.14  ✅
shadcn/ui:    3.3.1   ✅
TypeScript:   5.9.3   ✅
```

## Essential Commands

```bash
# Development
npm run dev              # Port 13000
npm run build           # Production build
npm start               # Start prod server

# Code Quality
npm run type-check      # TypeScript
npm run lint            # ESLint
npm run format          # Prettier

# shadcn/ui
npx shadcn@latest add <component>
npx shadcn@latest diff <component>
```

## Import Patterns

### shadcn/ui Components
```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
```

### Custom Components
```tsx
import { Header } from "@/components/layout/website-header"
import { usePWA } from "@/hooks/usePWA"
```

## TailwindCSS v4 Patterns

### Theme Variables
```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
}
```

### Custom Variants
```css
@custom-variant dark (&:is(.dark *));
@custom-variant hover (&:hover);
```

### Usage in Components
```tsx
className="bg-background text-foreground dark:bg-dark"
```

## Next.js 15 Patterns

### Server Component (Default)
```tsx
// app/page.tsx
export default async function Page() {
  const data = await fetch('...')
  return <div>{data}</div>
}
```

### Client Component
```tsx
'use client'
// For interactivity
import { useState } from 'react'
```

## File Structure

```
frontend/
├── src/
│   ├── app/              # Next.js 15 App Router
│   │   ├── globals.css   # Tailwind v4
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/          # shadcn/ui
│   │   └── layout/      # Custom layouts
│   ├── lib/             # Utils
│   ├── hooks/           # Custom hooks
│   └── types/           # TypeScript types
├── components.json      # shadcn config
├── next.config.js      # Next.js config
└── tsconfig.json       # TypeScript
```

## Common Tasks

### Add shadcn Component
```bash
npx shadcn@latest add dialog
```

### Create New Page
```tsx
// app/my-page/page.tsx
export default function MyPage() {
  return <div>My Page</div>
}
```

### Add API Route
```tsx
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ hello: 'world' })
}
```

## Troubleshooting

### Type Errors
```bash
npm run type-check
```

### Build Errors
```bash
rm -rf .next
npm run build
```

### Module Not Found
Check `tsconfig.json` paths:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind v4](https://tailwindcss.com/docs/v4-beta)
- [React 19](https://react.dev)
