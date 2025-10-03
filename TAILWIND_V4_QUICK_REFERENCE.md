# Tailwind CSS v4 - Quick Reference Guide

## 🎯 Quick Fix Summary

### What Changed:

1. ❌ **BEFORE** (Tailwind v3 style - KHÔNG hoạt động):
```css
@layer base {
  :root {
    --background: 0 0% 100%;  /* Space-separated */
  }
}

@layer base {
  * {
    @apply border-border;  /* @apply */
  }
}
```

2. ✅ **AFTER** (Tailwind v4 style - HOẠT ĐỘNG):
```css
:root {
  --color-background: hsl(0 0% 100%);  /* Full HSL */
}

* {
  border-color: var(--color-border);  /* Vanilla CSS */
}
```

---

## 📁 Files Modified

1. **`tailwind.config.ts`** - CREATED ✅
2. **`src/app/globals.css`** - UPDATED ✅
3. **`postcss.config.js`** - Already correct ✅
4. **`components.json`** - Already correct ✅

---

## 🎨 How to Use Theme Colors

### In Components (Tailwind Classes):
```tsx
// Background colors
<div className="bg-background">...</div>
<div className="bg-card">...</div>
<div className="bg-primary">...</div>

// Text colors
<p className="text-foreground">...</p>
<p className="text-primary">...</p>
<p className="text-muted-foreground">...</p>

// Borders
<div className="border border-border">...</div>

// Button variants (shadcn/ui)
<Button variant="default">Primary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="secondary">Cancel</Button>
```

### In CSS (Direct Variables):
```css
.my-component {
  background-color: var(--color-background);
  color: var(--color-foreground);
  border-color: var(--color-border);
}

.my-button {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
}
```

---

## 🌓 Dark Mode

### Enable Dark Mode:
```typescript
// Add to your component
document.documentElement.classList.add('dark');
```

### Remove Dark Mode:
```typescript
document.documentElement.classList.remove('dark');
```

### Toggle Dark Mode:
```typescript
document.documentElement.classList.toggle('dark');
```

### Check Current Theme:
```typescript
const isDark = document.documentElement.classList.contains('dark');
```

---

## 🎨 Available Theme Colors

| Color | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `background` | White | Dark Gray |
| `foreground` | Near Black | Near White |
| `card` | White | Dark Gray |
| `popover` | White | Dark Gray |
| `primary` | Blue | Bright Blue |
| `secondary` | Light Gray | Dark Gray |
| `muted` | Light Gray | Dark Gray |
| `accent` | Light Blue | Dark Blue |
| `destructive` | Red | Dark Red |
| `border` | Light Gray | Dark Gray |
| `input` | Light Gray | Dark Gray |
| `ring` | Blue | Bright Blue |

---

## 🔧 Common Tailwind Classes

### Layout:
```tsx
<div className="container mx-auto px-4">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<div className="flex items-center justify-between">
```

### Spacing:
```tsx
<div className="p-4">          {/* Padding all sides */}
<div className="px-6 py-4">    {/* Padding x and y */}
<div className="m-4">          {/* Margin all sides */}
<div className="space-y-4">    {/* Vertical spacing between children */}
```

### Typography:
```tsx
<h1 className="text-3xl font-bold">
<p className="text-sm text-muted-foreground">
<span className="text-destructive">Error message</span>
```

### Borders & Rounded:
```tsx
<div className="border border-border rounded-lg">
<div className="border-2 border-primary">
<div className="rounded-md shadow-sm">
```

### Buttons (shadcn/ui):
```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="default">Medium</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon Only</Button>
```

---

## 🐛 Troubleshooting

### Styles not applying?

1. **Restart dev server:**
```bash
# Stop (Ctrl+C) then:
cd frontend
bun run dev
```

2. **Clear browser cache:**
- Press `Ctrl+Shift+R` (hard reload)
- Or open DevTools → Network → Disable cache

3. **Check if globals.css is imported:**
```typescript
// In app/layout.tsx
import './globals.css';
```

### Colors not showing?

**Check CSS variables in browser console:**
```javascript
getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary')
// Should return: "hsl(221.2 83.2% 53.3%)"
```

### Dark mode not working?

**Check class is applied:**
```javascript
document.documentElement.classList.contains('dark')
// Should return true when dark mode active
```

---

## 📖 Documentation Links

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

---

## ✅ Quick Test

Open browser console and paste:
```javascript
// Test if Tailwind is working
const testDiv = document.createElement('div');
testDiv.className = 'bg-primary text-primary-foreground p-4 rounded-lg';
testDiv.textContent = 'Tailwind v4 is working! ✅';
document.body.appendChild(testDiv);

// Should see a blue box with white text
```

---

**Last Updated:** October 3, 2025  
**Tailwind Version:** 4.1.13  
**Status:** ✅ Working
