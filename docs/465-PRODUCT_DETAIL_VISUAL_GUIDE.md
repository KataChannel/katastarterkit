# 🎨 Product Detail Page - Visual Design Guide

**Date**: October 24, 2025  
**Route**: `/website/sanpham/[slug]`  
**Framework**: TailwindCSS v4 + shadcn/ui

---

## 📐 Layout Grid

### Desktop (≥1024px)
```
Full Width: 1280px max container
Grid: 2 columns (1fr 1fr)
Gap: 48px (3rem)

Column 1 (Gallery):
- Width: ~50%
- Sticky: top (on scroll)
- Position: Fixed until related products

Column 2 (Info):
- Width: ~50%
- Scroll: Normal
- Flex: column (stack vertically)
```

### Tablet (640px - 1023px)
```
Full Width: Full container
Stack: Vertical (gallery above info)
Gap: 32px (2rem)

Gallery:
- Width: Full width
- Height: 400px max
- Margin bottom: 32px

Info:
- Width: Full width
- Normal scroll
```

### Mobile (<640px)
```
Full Width: Full viewport (minus padding)
Stack: Vertical
Gap: 24px (1.5rem)
Padding: 16px sides

Gallery:
- Width: Full width
- Height: auto (aspect-square)
- Margin bottom: 24px

Info:
- Width: Full width
- Normal scroll
```

---

## 🎯 Component Sizes

### Breadcrumb
```
Height: 40px
Font: 14px
Color: Text secondary
Spacing: 8px between items
Example: Home > Products > Category > Product
```

### Image Gallery

#### Main Image
```
Desktop:
- Width: 100% of column (or max 450px)
- Aspect Ratio: 1:1 (square)
- Border Radius: 8px
- Background: Light gray placeholder
- Position: Sticky top on desktop

Mobile:
- Width: 100vw (full viewport)
- Aspect Ratio: 1:1 (square)
- Position: Normal (not sticky)
- Margin: -16px (full edge-to-edge)
```

#### Thumbnail Strip
```
Layout: Horizontal scroll (overflow-x-auto)
Height: 100px (or fit content)
Gap: 8px
Items per row: 5-6 on desktop, 3-4 on mobile

Single Thumbnail:
- Size: 80x80px
- Border Radius: 4px
- Border: 2px transparent (3px white when selected)
- Opacity: 0.7 (0.9 on hover)
- Cursor: pointer
```

#### Image Counter
```
Position: Bottom-right of gallery (or bottom-center)
Format: "1 / 5"
Font: 12px bold
Background: rgba(0, 0, 0, 0.5)
Color: White
Padding: 4px 8px
Border Radius: 4px
```

#### Discount Badge
```
Position: Top-left of main image
Format: "-20%"
Font: 14px bold
Background: Red (#EF4444)
Color: White
Padding: 6px 12px
Border Radius: 4px
```

### Title Section
```
Title (H1):
- Font: 28px (24px mobile)
- Font Weight: 700 (bold)
- Color: text-gray-900 (#111827)
- Line Height: 1.2
- Margin: 0 0 8px 0

Category:
- Font: 14px
- Font Weight: 500
- Color: text-gray-500 (#6B7280)
- Margin: 0 0 8px 0

Badges Container:
- Display: flex
- Gap: 8px
- Margin: 12px 0
- Wrap: wrap

Badge:
- Font: 12px
- Font Weight: 600
- Padding: 4px 12px
- Border Radius: 12px (pill-shaped)
- Colors:
  - New: Blue background, white text
  - Bestseller: Gold background, dark text
  - On Sale: Red background, white text
  - Low Stock: Orange background, white text
```

### Price Section
```
Current Price:
- Font: 32px bold
- Color: Primary (blue, usually #3B82F6)
- Format: "₫ 1,299,000 / kg"

Unit:
- Font: 14px
- Color: text-gray-600

Original Price (if on sale):
- Font: 16px
- Color: text-gray-400
- Text Decoration: line-through
- Margin: 4px 0

Savings (if on sale):
- Font: 14px
- Font Weight: 600
- Color: Green (#22C55E)
- Format: "Tiết kiệm: ₫ 300,000"
```

### Specifications Box
```
Container:
- Background: #F3F4F6 (light gray)
- Border Radius: 8px
- Padding: 20px
- Margin: 20px 0

Layout: Grid 2 columns (or flex column on mobile)
Gap: 12px

Item:
- Display: flex
- Flex direction: column

Label:
- Font: 12px
- Font Weight: 600
- Color: text-gray-600
- Text Transform: uppercase

Value:
- Font: 14px
- Color: text-gray-900
- Font Weight: 500

Stock Status:
- Colored dot (circle) + text
- Green (●) if > 10: "45 kg"
- Yellow (●) if 2-10: "5 kg"
- Red (●) if < 2: "1 kg"
```

### Short Description
```
Font: 15px
Line Height: 1.6
Color: text-gray-700
Margin: 20px 0
Max Width: 100%
Word Break: break-word
```

### Variant Buttons
```
Container:
- Display: flex
- Gap: 12px
- Margin: 20px 0
- Wrap: wrap

Button:
- Padding: 10px 16px
- Border: 2px solid #E5E7EB
- Border Radius: 6px
- Font: 14px font-medium
- Cursor: pointer
- Transition: all 200ms

States:
- Default: Gray border, text-gray-700
- Hover: Light blue background
- Selected: Blue border (3px), blue background
- Disabled: Gray border, gray text, opacity 50%, cursor not-allowed

Price per Variant:
- Font: 12px
- Color: text-gray-600
- Show below or inside button
```

### Quantity Selector
```
Container:
- Display: flex
- Align Items: center
- Gap: 12px
- Margin: 20px 0
- Padding: 12px
- Background: #F9FAFB

Minus Button:
- Width: 36px
- Height: 36px
- Border: 1px solid #E5E7EB
- Border Radius: 4px
- Icon: Minus icon (18px)
- Cursor: pointer
- Background: white
- Hover: Light gray background
- Disabled: Gray color, cursor not-allowed

Input:
- Width: 80px
- Height: 36px
- Border: 1px solid #E5E7EB
- Border Radius: 4px
- Text Align: center
- Font: 14px font-medium
- No spinner (appearance: none)

Plus Button:
- Width: 36px
- Height: 36px
- Border: 1px solid #E5E7EB
- Border Radius: 4px
- Icon: Plus icon (18px)
- Cursor: pointer
- Background: white
- Hover: Light gray background
- Disabled: Gray color, cursor not-allowed

Available Text:
- Font: 12px
- Color: text-gray-600
- Margin Left: 12px
```

### Action Buttons

#### Add to Cart Button
```
Width: 100%
Height: 48px
Font: 16px font-bold
Text: "🛒 Thêm vào giỏ - ₫ 999,000"
Background: Primary color (blue)
Color: White
Border: None
Border Radius: 6px
Cursor: pointer
Margin: 20px 0

States:
- Default: Blue background
- Hover: Darker blue
- Active: Even darker blue
- Loading: Show spinner animation
- Success: Green background (temporary)

Responsive:
- Desktop: Full width
- Mobile: Full width
```

#### Favorite & Share Buttons
```
Container:
- Display: flex
- Gap: 12px

Button:
- Width: 48px (or 44px on mobile)
- Height: 48px
- Border: 1px solid #E5E7EB
- Border Radius: 6px
- Background: white
- Icon: 20px
- Cursor: pointer

Favorite Button:
- Default: Heart outline, gray
- Active: Heart filled, red
- Color change on toggle

Share Button:
- Icon: Share/external link
- Color: gray
- Hover: Light blue background

Responsive:
- Both buttons: Stack below on mobile
- Or inline with cart button on desktop
```

### Info Cards (3 cards)
```
Container:
- Display: flex
- Gap: 24px
- Margin: 24px 0
- Justify: space-between
- Flex wrap: wrap on mobile

Card:
- Display: flex
- Flex direction: column
- Align Items: center
- Text Align: center
- Flex: 1

Icon:
- Size: 32px
- Color: Primary (blue)
- Margin: 0 0 8px 0

Title:
- Font: 14px font-semibold
- Color: text-gray-900

Description:
- Font: 12px
- Color: text-gray-600
- Margin: 4px 0 0 0

Mobile:
- Gap: 16px
- Each card: Full width or 50% width
```

### Tabs

#### Tab List
```
Container:
- Display: flex
- Border-bottom: 2px solid #E5E7EB
- Margin: 32px 0 0 0

Tab Button:
- Padding: 12px 24px
- Font: 15px font-medium
- Color: text-gray-600
- Border: None
- Background: transparent
- Cursor: pointer
- Position: relative
- Border-bottom: 3px solid transparent

States:
- Default: Gray text, no bottom border
- Hover: Dark gray text
- Active: Blue text, blue bottom border (3px)
- Active Animation: Smooth slide-in bottom border

Responsive:
- Desktop: Horizontal
- Mobile: Horizontal (may need scroll if many tabs)
```

#### Tab Content
```
Container:
- Padding: 24px 0
- Min Height: 200px

Description Tab:
- Font: 15px
- Line Height: 1.8
- Color: text-gray-700

Specs Table:
- Width: 100%
- Border-collapse: separate
- Border-spacing: 0 8px

Table Row:
- Odd rows: Background #FAFAFA
- Even rows: Background white
- Border-bottom: 1px solid #E5E7EB

Table Cell:
- Padding: 12px 16px
- Font: 14px
- Color: text-gray-900 (key), text-gray-700 (value)

Reviews Tab:
- Display: flex
- Flex direction: column
- Gap: 20px
```

### Ratings & Reviews Section

#### Overall Rating
```
Container:
- Display: flex
- Align Items: center
- Gap: 12px
- Margin: 0 0 20px 0

Rating Text:
- Font: 28px bold
- Color: text-gray-900
- Format: "4.5"

Stars:
- Color: Gold (#FBBF24)
- Size: 20px
- Display: inline

Count Text:
- Font: 14px
- Color: text-gray-600
- Format: "Based on 12 reviews"
```

#### Rating Breakdown

```
Container:
- Margin: 20px 0

Item (per star):
- Display: flex
- Align Items: center
- Gap: 12px
- Margin: 8px 0

Label:
- Width: 40px
- Font: 14px
- Format: "5⭐"

Bar Container:
- Flex: 1
- Height: 8px
- Background: #E5E7EB
- Border Radius: 4px
- Overflow: hidden

Bar Fill:
- Height: 100%
- Background: Gold (#FBBF24)
- Width: percentage (e.g., 60%)

Percentage:
- Width: 50px
- Text-align: right
- Font: 12px
- Color: text-gray-600
- Format: "60% (7)"
```

#### Sample Reviews

```
Container:
- Margin: 20px 0
- Display: flex
- Flex direction: column
- Gap: 16px

Review Card:
- Padding: 16px
- Border: 1px solid #E5E7EB
- Border-radius: 8px
- Background: white

Review Header:
- Display: flex
- Justify-content: space-between
- Margin: 0 0 8px 0

Author:
- Font: 14px font-semibold
- Color: text-gray-900

Date:
- Font: 12px
- Color: text-gray-600

Rating:
- Display: flex
- Gap: 2px
- Margin: 0 0 8px 0
- Color: Gold

Title:
- Font: 14px font-medium
- Color: text-gray-900
- Margin: 0 0 8px 0

Comment:
- Font: 14px
- Color: text-gray-700
- Line-height: 1.6

View More Button:
- Font: 14px font-medium
- Color: Primary (blue)
- Cursor: pointer
- Hover: Underline
```

### Related Products Grid

```
Container:
- Margin: 48px 0
- Display: grid
- Grid-template-columns: repeat(4, 1fr)
- Gap: 20px

Breakpoints:
- Desktop (≥1024px): 4 columns
- Tablet (640px - 1023px): 2-3 columns
- Mobile (<640px): 1 column

Product Card:
- Border: 1px solid #E5E7EB
- Border-radius: 8px
- Padding: 12px
- Background: white
- Transition: all 200ms

Product Card Hover:
- Box-shadow: 0 4px 12px rgba(0,0,0,0.1)
- Border-color: #D1D5DB

Image:
- Aspect-ratio: 1 / 1 (square)
- Width: 100%
- Border-radius: 6px
- Background: #F3F4F6
- Object-fit: cover

Name:
- Font: 14px font-medium
- Color: text-gray-900
- Margin: 8px 0 4px 0
- Line-height: 1.4
- Overflow: hidden
- Text-overflow: ellipsis
- Display: -webkit-box
- -webkit-line-clamp: 2

Price:
- Font: 16px font-bold
- Color: Primary (blue)
- Margin: 4px 0

Unit:
- Font: 12px
- Color: text-gray-600
- Format: "/ kg"

Action Buttons:
- Display: flex
- Gap: 8px
- Margin: 8px 0 0 0

Add to Cart Button:
- Flex: 1
- Padding: 8px
- Font: 12px
- Background: Primary
- Color: white
- Border-radius: 4px
- Cursor: pointer

Favorite Button:
- Width: 36px
- Height: 36px
- Border: 1px solid #E5E7EB
- Border-radius: 4px
- Icon: Heart
```

---

## 🎭 Color Palette

```
Primary Colors:
- Primary: #3B82F6 (Blue)
- Primary Dark: #2563EB (Hover)
- Primary Light: #DBEAFE (Background)

Semantic Colors:
- Success: #22C55E (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)
- Info: #0EA5E9 (Sky)

Neutral Colors:
- Black: #000000
- Gray 900: #111827 (Dark text)
- Gray 700: #374151 (Body text)
- Gray 600: #4B5563 (Secondary text)
- Gray 500: #6B7280 (Disabled text)
- Gray 400: #9CA3AF
- Gray 300: #D1D5DB (Borders)
- Gray 200: #E5E7EB (Light borders)
- Gray 100: #F3F4F6 (Backgrounds)
- Gray 50: #F9FAFB (Light backgrounds)
- White: #FFFFFF

Special:
- Gold: #FBBF24 (Star ratings)
```

---

## 🔤 Typography

```
Font Stack: 
- Sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif

Font Sizes:
- H1: 28px (24px mobile)
- H2: 24px (20px mobile)
- H3: 20px
- Body Large: 16px
- Body: 15px
- Body Small: 14px
- Caption: 12px
- Tiny: 11px

Font Weights:
- Thin: 100
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800
- Black: 900

Line Heights:
- Tight: 1.2
- Normal: 1.5
- Relaxed: 1.6
- Loose: 1.8
```

---

## 📦 Spacing Scale

```
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
7: 28px
8: 32px
9: 36px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
28: 112px
32: 128px
```

---

## 🎯 Responsive Breakpoints

```
Mobile:
- sm: 640px (small mobile)
- 0-639px: Base styles

Tablet:
- md: 768px
- 640px-1023px: Medium breakpoint

Desktop:
- lg: 1024px
- xl: 1280px
- 1024px+: Large screens
```

---

## 🎬 Animations & Transitions

```
Transitions:
- Default: 200ms ease-in-out
- Long: 300ms ease-in-out
- Smooth: 400ms ease

Effects:
- Hover: Color change, shadow
- Active: Slight scale (0.98)
- Disabled: Opacity 50%, cursor not-allowed

Loading:
- Spinner: Infinite rotation
- Skeleton: Pulse animation

Tab Switch:
- Border slide-in: 300ms
- Content fade: 200ms
```

---

## ♿ Accessibility

```
Contrast Ratios:
- Text on background: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

Focus States:
- All interactive: Blue outline (3px)
- Offset: 2px from element
- Visible on keyboard navigation

Semantics:
- Buttons: <button>
- Links: <a> with href
- Forms: <input> with labels
- Images: Alt text always
- Headings: Proper hierarchy (h1, h2, h3)
- ARIA: For interactive elements
```

---

## 📝 Usage Examples

### Component Import
```tsx
import { ProductDetail } from '@/components/product';
import { RelatedProducts } from '@/components/product';
import { Breadcrumb } from '@/components/ui/breadcrumb';
```

### Basic Usage
```tsx
<div className="min-h-screen bg-white">
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/website">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>{product.name}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
  
  <ProductDetail product={product} />
  <RelatedProducts categoryId={product.categoryId} excludeProductId={product.id} />
</div>
```

---

## 📐 Grid Examples

### Desktop 2-Column Layout
```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 1023px) {
  .container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
```

### Related Products 4-Column Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-top: 3rem;
}

@media (max-width: 1023px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 639px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

---

## ✅ Design Checklist

- [x] Color palette defined
- [x] Typography system set
- [x] Spacing scale applied
- [x] Responsive breakpoints
- [x] Component sizes
- [x] Button states
- [x] Hover/focus states
- [x] Accessibility standards
- [x] Animations & transitions
- [x] Dark mode (if applicable)

---

**Last Updated**: October 24, 2025  
**Framework**: TailwindCSS v4  
**Status**: Production Ready ✅
