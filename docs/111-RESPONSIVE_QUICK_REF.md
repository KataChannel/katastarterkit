# Responsive Design Quick Reference

## 📱 Breakpoints Cheat Sheet

```css
Mobile:   < 640px   (sm breakpoint)
Tablet:   640-1024px (sm to lg)
Desktop:  > 1024px   (lg+)
```

## 🎯 Common Patterns

### Padding/Margin
```tsx
// Mobile 12px → Desktop 24px
p-3 sm:p-4 md:p-6

// Mobile 8px → Desktop 16px  
gap-2 sm:gap-4

// Mobile 12px → Desktop 16px
space-y-3 sm:space-y-4
```

### Typography
```tsx
// Headings
text-2xl sm:text-3xl md:text-4xl    // 24→30→36px
text-lg sm:text-xl                  // 18→20px

// Body
text-sm sm:text-base                // 14→16px
text-xs sm:text-sm                  // 12→14px
```

### Icons
```tsx
h-5 w-5 sm:h-6 sm:w-6              // 20→24px
h-4 w-4 sm:h-5 sm:w-5              // 16→20px
h-3 w-3 sm:h-4 sm:w-4              // 12→16px
```

### Layouts
```tsx
// Stack → Horizontal
flex flex-col lg:flex-row

// 2 cols → 4 cols
grid grid-cols-2 lg:grid-cols-4

// Full → Sidebar
grid grid-cols-1 lg:grid-cols-3
  lg:col-span-2  // Takes 2/3
```

## 🔧 Essential Utilities

### Text Overflow
```tsx
truncate                    // Single line
line-clamp-1               // Max 1 line
line-clamp-2               // Max 2 lines
min-w-0                    // Allow flex shrink
```

### Flex Helpers
```tsx
flex-shrink-0              // Don't shrink
flex-1 min-w-0             // Grow + allow shrink
flex-wrap                  // Wrap if needed
```

### Responsive Display
```tsx
hidden sm:inline           // Hide mobile, show desktop
sm:hidden                  // Show mobile, hide desktop
```

## 📏 Touch Targets

```tsx
// Minimum sizes
h-8                        // 32px (mobile buttons)
h-16 sm:h-20              // 64→80px (large buttons)

// Full width touchable
w-full p-2.5              // Easy to tap
```

## ✅ Quick Checklist

- [ ] Padding: `p-3 sm:p-6`
- [ ] Text: `text-sm sm:text-base`
- [ ] Icons: `h-5 sm:h-6`
- [ ] Gap: `gap-2 sm:gap-4`
- [ ] Truncate: `truncate` or `line-clamp-2`
- [ ] Touch: min `h-8` or `h-16`
- [ ] Grid: `grid-cols-2 lg:grid-cols-4`
- [ ] Flex: `flex-col lg:flex-row`

---

**File:** `/frontend/src/app/page.tsx`  
**Status:** ✅ Fully Responsive  
**Updated:** 10/10/2025
