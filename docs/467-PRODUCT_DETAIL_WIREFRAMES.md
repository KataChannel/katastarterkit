# 🎨 Product Detail Page - Layout Wireframes

**Created**: October 24, 2025  
**Route**: `/website/sanpham/[slug]`  
**Purpose**: Visual reference for layout and component positioning

---

## 📐 Desktop Layout (1280px+)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  HOME  >  PRODUCTS  >  ELECTRONICS  >  MACBOOK PRO M3                    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐  ┌─────────────────────────────────────────┐ │
│  │                      │  │  MacBook Pro 13" M3                     │ │
│  │                      │  │  Electronics                            │ │
│  │                      │  │                                         │ │
│  │                      │  │  [NEW] [BESTSELLER] [ON SALE]          │ │
│  │                      │  │                                         │ │
│  │     LARGE IMAGE      │  │  💰 ₫999,000 / unit                    │ │
│  │    (SQUARE 1:1)      │  │  Original: ₫1,299,000                  │ │
│  │                      │  │  Save: ₫300,000                        │ │
│  │      -20% SALE       │  │                                         │ │
│  │    (corner badge)    │  │  ┌─────────────────────────────────────┐ │
│  │                      │  │  │ SKU: MP-M3-001                      │ │
│  │  (Sticky on scroll)  │  │  │ Origin: United States               │ │
│  │                      │  │  │ Weight: 1.5kg                       │ │
│  ├──────────────────────┤  │  │ Stock: ● 45 units available         │ │
│  │  [Thumb]            │  │  └─────────────────────────────────────┘ │
│  │ ├─┼─┼─┼─┼─┤        │  │                                         │ │
│  │  [1]▢[2] [3] [4] [5] │  │  Choose variant:                        │ │
│  │  (scrollable)        │  │  [M] [L] [XL]                          │ │
│  │                      │  │                                         │ │
│  │  Counter: 1 / 5      │  │  Quantity:                              │ │
│  │                      │  │  [−] [  1  ] [+]                        │ │
│  │                      │  │  Available: 45 units                    │ │
│  │                      │  │                                         │ │
│  │                      │  │  [  🛒 ADD TO CART - ₫999,000  ]       │ │
│  │                      │  │  [❤] [📤]                              │ │
│  │                      │  │                                         │ │
│  │                      │  │  [📦 Package] [🚚 Shipping] [🛡️ Quality] │
│  └──────────────────────┘  └─────────────────────────────────────────┘ │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│  DESCRIPTION TAB  |  REVIEWS & RATINGS TAB                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Detailed Product Description                                            │
│  Lorem ipsum dolor sit amet, consectetur adipiscing elit...             │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ SPECIFICATIONS TABLE                                            │   │
│  ├──────────────────────────────────┬──────────────────────────────┤   │
│  │ Processor                        │ Apple M3 8-core             │   │
│  ├──────────────────────────────────┼──────────────────────────────┤   │
│  │ Memory                           │ 8GB Unified Memory           │   │
│  ├──────────────────────────────────┼──────────────────────────────┤   │
│  │ Storage                          │ 256GB SSD                    │   │
│  ├──────────────────────────────────┼──────────────────────────────┤   │
│  │ Display                          │ 13.3" Liquid Retina          │   │
│  ├──────────────────────────────────┼──────────────────────────────┤   │
│  │ Battery Life                     │ Up to 18 hours               │   │
│  └──────────────────────────────────┴──────────────────────────────┘   │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  RELATED PRODUCTS                                                        │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐        │
│  │              │              │              │              │        │
│  │   PRODUCT 1  │   PRODUCT 2  │   PRODUCT 3  │   PRODUCT 4  │        │
│  │              │              │              │              │        │
│  │   [Image]    │   [Image]    │   [Image]    │   [Image]    │        │
│  │              │              │              │              │        │
│  │  MacBook Air │  iPad Pro    │  iMac 24"    │  Mac Mini    │        │
│  │  ₫899,000    │  ₫1,199,000  │  ₫1,999,000  │  ₫699,000    │        │
│  │   / unit     │   / unit     │   / unit     │   / unit     │        │
│  │              │              │              │              │        │
│  │ [🛒] [❤]    │ [🛒] [❤]    │ [🛒] [❤]    │ [🛒] [❤]    │        │
│  └──────────────┴──────────────┴──────────────┴──────────────┘        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Tablet Layout (768px)

```
┌────────────────────────────────────────────────────┐
│ HOME > PRODUCTS > ELECTRONICS > MACBOOK PRO M3    │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │                                              │ │
│  │          LARGE IMAGE (SQUARE)                │ │
│  │                                              │ │
│  │          -20% SALE (corner)                  │ │
│  │                                              │ │
│  ├──────────────────────────────────────────────┤ │
│  │ [Thumb] [Thumb] [Thumb] [Thumb] [Thumb]   │ │
│  │ (scrollable)                                │ │
│  │ Counter: 1 / 5                              │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  MacBook Pro 13" M3                               │
│  Electronics                                       │
│  [NEW] [BESTSELLER]                               │
│                                                    │
│  💰 ₫999,000 / unit                               │
│  Original: ₫1,299,000                             │
│  Save: ₫300,000                                   │
│                                                    │
│  ┌────────────────────────────────────────────┐  │
│  │ SKU: MP-M3-001                             │  │
│  │ Origin: United States | Weight: 1.5kg      │  │
│  │ Stock: ● 45 units                          │  │
│  └────────────────────────────────────────────┘  │
│                                                    │
│  Choose variant: [M] [L] [XL]                    │
│                                                    │
│  Quantity: [−] [  1  ] [+]                       │
│  Available: 45 units                              │
│                                                    │
│  [  ADD TO CART - ₫999,000  ]                    │
│  [❤] [📤]                                        │
│                                                    │
│  [📦 Package] [🚚 Shipping] [🛡️ Quality]       │
│                                                    │
├────────────────────────────────────────────────────┤
│  DESCRIPTION  |  REVIEWS & RATINGS                 │
├────────────────────────────────────────────────────┤
│                                                    │
│  Product Description...                            │
│                                                    │
│  ┌────────────────────────────────────────────┐  │
│  │ SPECIFICATIONS TABLE                       │  │
│  ├──────────────────┬────────────────────────┤  │
│  │ Processor        │ Apple M3 8-core        │  │
│  ├──────────────────┼────────────────────────┤  │
│  │ Memory           │ 8GB Unified Memory     │  │
│  ├──────────────────┼────────────────────────┤  │
│  │ Storage          │ 256GB SSD              │  │
│  └──────────────────┴────────────────────────┘  │
│                                                    │
├────────────────────────────────────────────────────┤
│  RELATED PRODUCTS (2 columns)                     │
│  ┌──────────────────┬──────────────────┐         │
│  │   PRODUCT 1      │   PRODUCT 2      │         │
│  │   [Image]        │   [Image]        │         │
│  │   MacBook Air    │   iPad Pro       │         │
│  │   ₫899,000/unit  │   ₫1,199,000/unit│         │
│  │ [🛒] [❤]       │ [🛒] [❤]        │         │
│  └──────────────────┴──────────────────┘         │
│  ┌──────────────────┬──────────────────┐         │
│  │   PRODUCT 3      │   PRODUCT 4      │         │
│  │   [Image]        │   [Image]        │         │
│  │   iMac 24"       │   Mac Mini       │         │
│  │   ₫1,999,000/unit│   ₫699,000/unit  │         │
│  │ [🛒] [❤]       │ [🛒] [❤]        │         │
│  └──────────────────┴──────────────────┘         │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 📱 Mobile Layout (375px)

```
┌──────────────────────────────────┐
│ HOME > PRODUCTS > ELECTRONICS    │
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐ │
│  │      LARGE IMAGE           │ │
│  │      (FULL WIDTH)          │ │
│  │      (SQUARE 1:1)          │ │
│  │                            │ │
│  │      -20% SALE (corner)    │ │
│  │                            │ │
│  ├────────────────────────────┤ │
│  │ [T1] [T2] [T3] [T4] [T5]  │ │
│  │ (horizontal scroll)        │ │
│  │ Counter: 1 / 5             │ │
│  └────────────────────────────┘ │
│                                  │
│  MacBook Pro 13" M3              │
│  Electronics                      │
│  [NEW] [SALE]                    │
│                                  │
│  💰 ₫999,000                     │
│  Original: ₫1,299,000            │
│  Save: ₫300,000                  │
│                                  │
│  ┌────────────────────────────┐ │
│  │ SKU: MP-M3-001             │ │
│  │ Origin: United States      │ │
│  │ Weight: 1.5kg              │ │
│  │ Stock: ● 45 units          │ │
│  └────────────────────────────┘ │
│                                  │
│  Choose variant:                 │
│  [M] [L] [XL]                   │
│                                  │
│  Quantity:                       │
│  [−] [  1  ] [+]                │
│  Available: 45                   │
│                                  │
│  [ADD TO CART - ₫999,000]       │
│  [❤] [📤]                       │
│                                  │
│  [Package] [Shipping]            │
│  [Quality]                       │
│                                  │
├──────────────────────────────────┤
│  DESCRIPTION | REVIEWS & RATINGS │
├──────────────────────────────────┤
│                                  │
│  Product description...          │
│                                  │
│  SPECIFICATIONS                  │
│  ┌────────────────────────────┐ │
│  │ Processor: Apple M3        │ │
│  ├────────────────────────────┤ │
│  │ Memory: 8GB Unified        │ │
│  ├────────────────────────────┤ │
│  │ Storage: 256GB SSD         │ │
│  ├────────────────────────────┤ │
│  │ Display: 13.3" Retina      │ │
│  └────────────────────────────┘ │
│                                  │
├──────────────────────────────────┤
│  RELATED PRODUCTS                │
│  ┌────────────────────────────┐ │
│  │  PRODUCT 1                 │ │
│  │  [Image]                   │ │
│  │  MacBook Air               │ │
│  │  ₫899,000 / unit           │ │
│  │  [🛒] [❤]                 │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │  PRODUCT 2                 │ │
│  │  [Image]                   │ │
│  │  iPad Pro                  │ │
│  │  ₫1,199,000 / unit         │ │
│  │  [🛒] [❤]                 │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │  PRODUCT 3                 │ │
│  │  [Image]                   │ │
│  │  iMac 24"                  │ │
│  │  ₫1,999,000 / unit         │ │
│  │  [🛒] [❤]                 │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │  PRODUCT 4                 │ │
│  │  [Image]                   │ │
│  │  Mac Mini                  │ │
│  │  ₫699,000 / unit           │ │
│  │  [🛒] [❤]                 │ │
│  └────────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
```

---

## 🖼️ Image Gallery - Detailed View

### Desktop Gallery with Sticky Positioning
```
Desktop (1024px+): Gallery is STICKY
┌─────────────────────┐
│                     │
│   LARGE IMAGE       │ ◄─── Stays in viewport
│   (1000x1000px)     │      while scrolling
│                     │      down page
│   -20% badge        │
│                     │
├─────────────────────┤
│ [T1]▢[T2][T3][T4]  │ ◄─── Thumbnails
│      [T5] (scroll)  │      (80x80px each)
│                     │
│  Counter: 1 / 5     │
│                     │
│  (Sticky until      │
│   related products) │
└─────────────────────┘
     ▼ (scroll down)
┌─────────────────────┐
│ SPECS BOX           │
│ [Product Info]      │
│ [Quantity]          │
│ [Add to Cart]       │
└─────────────────────┘
     ▼ (scroll down)
┌─────────────────────┐
│ DESCRIPTION TAB     │
│ [Content...]        │
└─────────────────────┘
     ▼ (scroll down)
┌─────────────────────┐
│ REVIEWS TAB         │
│ [Ratings & Reviews] │
└─────────────────────┘
     ▼ (scroll down)
┌─────────────────────┐
│ RELATED PRODUCTS    │
│ [Grid...]           │
│ (Gallery becomes    │
│  normal here)       │
└─────────────────────┘
```

### Tablet/Mobile Gallery (NOT Sticky)
```
Mobile/Tablet (<1024px): Gallery is NOT sticky
┌──────────────┐
│              │
│ LARGE IMAGE  │
│              │ ◄─── Normal scroll
│ -20% badge   │
│              │
├──────────────┤
│ [T1][T2][T3] │
│ [T4][T5](..] │
│              │
│ Counter:1/5  │
│              │
└──────────────┘
     ▼ scroll
┌──────────────┐
│ SPECS BOX    │
└──────────────┘
     ▼ scroll
│ DESCRIPTION  │
└──────────────┘
     ▼ scroll
│ REVIEWS      │
└──────────────┘
     ▼ scroll
│ RELATED      │
└──────────────┘
```

---

## 📊 Tabs Layout

### Tab Header
```
┌─────────────────────────────────────────────┐
│ Mô tả chi tiết | Đánh giá & Xếp hạng       │
├──────────────┬────────────────────────────┬─┤
│              │                            │ │
│ Blue line    │  No line                   │ │
│ (active)     │  (inactive)                │ │
│              │                            │ │
└──────────────┴────────────────────────────┴─┘
```

### Tab 1: Description Content
```
┌──────────────────────────────────────────────┐
│ Detailed Product Description                 │
│ Lorem ipsum dolor sit amet, consectetur      │
│ adipiscing elit, sed do eiusmod tempor...    │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ SPECIFICATIONS TABLE                     │ │
│ ├──────────────────────┬────────────────────┤ │
│ │ Processor            │ Apple M3 8-core    │ │
│ ├──────────────────────┼────────────────────┤ │
│ │ Memory               │ 8GB Unified        │ │
│ ├──────────────────────┼────────────────────┤ │
│ │ Storage              │ 256GB SSD          │ │
│ ├──────────────────────┼────────────────────┤ │
│ │ Display              │ 13.3" Liquid Ret.. │ │
│ ├──────────────────────┼────────────────────┤ │
│ │ Battery Life         │ Up to 18 hours     │ │
│ └──────────────────────┴────────────────────┘ │
└──────────────────────────────────────────────┘
```

### Tab 2: Reviews & Ratings Content
```
┌──────────────────────────────────────────────┐
│                                              │
│  Overall Rating:  4.5 ⭐⭐⭐⭐½              │
│  Based on 12 reviews                         │
│                                              │
│  5⭐ ░░░░░░░░░░░░░░░░ 60% (7 reviews)      │
│  4⭐ ░░░░░░░░░░ 25% (3 reviews)            │
│  3⭐ ░░░░░ 10% (1 review)                   │
│  2⭐ ░░░ 5% (1 review)                      │
│                                              │
│  ┌──────────────────────────────────────────┐ │
│  │ Reviewer Name 1                          │ │
│  │ Oct 20, 2025  ⭐⭐⭐⭐⭐                  │ │
│  │ Amazing product! Highly recommended.     │ │
│  │ Great quality and fast delivery.         │ │
│  └──────────────────────────────────────────┘ │
│                                              │
│  ┌──────────────────────────────────────────┐ │
│  │ Reviewer Name 2                          │ │
│  │ Oct 18, 2025  ⭐⭐⭐⭐                   │ │
│  │ Good quality, a bit expensive.           │ │
│  │ Would recommend though.                  │ │
│  └──────────────────────────────────────────┘ │
│                                              │
│  [View more reviews →]                       │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 🛍️ Related Products Grid

### Desktop (4 columns)
```
┌────────────┬────────────┬────────────┬────────────┐
│ PRODUCT 1  │ PRODUCT 2  │ PRODUCT 3  │ PRODUCT 4  │
├────────────┼────────────┼────────────┼────────────┤
│  [Image]   │  [Image]   │  [Image]   │  [Image]   │
│ (1:1 ratio)│ (1:1 ratio)│ (1:1 ratio)│ (1:1 ratio)│
│            │            │            │            │
│MacBook Air │  iPad Pro  │  iMac 24"  │ Mac Mini   │
│            │            │            │            │
│₫899,000    │₫1,199,000  │₫1,999,000  │₫699,000    │
│/ unit      │/ unit      │/ unit      │/ unit      │
│            │            │            │            │
│ [🛒] [❤] │ [🛒] [❤] │ [🛒] [❤] │ [🛒] [❤] │
└────────────┴────────────┴────────────┴────────────┘
```

### Tablet (2 columns)
```
┌────────────┬────────────┐
│ PRODUCT 1  │ PRODUCT 2  │
├────────────┼────────────┤
│  [Image]   │  [Image]   │
│MacBook Air │  iPad Pro  │
│₫899,000    │₫1,199,000  │
│ [🛒] [❤] │ [🛒] [❤] │
└────────────┴────────────┘

┌────────────┬────────────┐
│ PRODUCT 3  │ PRODUCT 4  │
├────────────┼────────────┤
│  [Image]   │  [Image]   │
│  iMac 24"  │ Mac Mini   │
│₫1,999,000  │₫699,000    │
│ [🛒] [❤] │ [🛒] [❤] │
└────────────┴────────────┘
```

### Mobile (1 column)
```
┌──────────────────┐
│   PRODUCT 1      │
├──────────────────┤
│    [Image]       │
│ MacBook Air      │
│ ₫899,000 / unit  │
│ [🛒] [❤]       │
└──────────────────┘

┌──────────────────┐
│   PRODUCT 2      │
├──────────────────┤
│    [Image]       │
│   iPad Pro       │
│₫1,199,000 /unit  │
│ [🛒] [❤]       │
└──────────────────┘

┌──────────────────┐
│   PRODUCT 3      │
├──────────────────┤
│    [Image]       │
│   iMac 24"       │
│₫1,999,000 /unit  │
│ [🛒] [❤]       │
└──────────────────┘

┌──────────────────┐
│   PRODUCT 4      │
├──────────────────┤
│    [Image]       │
│   Mac Mini       │
│ ₫699,000 / unit  │
│ [🛒] [❤]       │
└──────────────────┘
```

---

## 🎯 Product Information Section - Detailed

### Left Side (Product Info)
```
┌─────────────────────────────────────┐
│ Electronics (category - small gray) │
│                                     │
│ MacBook Pro 13" M3                  │ ← H1 Title (28px bold)
│ [NEW] [BESTSELLER] [ON SALE]       │ ← Feature badges
│                                     │
│ 💰 ₫999,000 / unit                  │ ← Current price (32px bold, blue)
│ Original: ₫1,299,000                │ ← Original (strikethrough, gray)
│ Tiết kiệm: ₫300,000                │ ← Savings (14px, green)
│                                     │
│ ┌──────────────────────────────────┐ │
│ │ SKU: MP-M3-001                   │ │ ← Specs box (light gray bg)
│ │ Origin: United States             │ │
│ │ Weight: 1.5kg                     │ │
│ │ Stock: ● 45 units available       │ │ ← Color coded: green
│ └──────────────────────────────────┘ │
│                                     │
│ A powerful laptop with exceptional  │ ← Short description
│ performance and beautiful design... │   (15px, body text)
│                                     │
│ Choose variant:                     │ ← Variant selector
│ [M] [L] [XL]                        │   (if available)
│ Price: +₫0 / +₫200,000 / +₫400,000 │
│                                     │
│ Quantity:                           │ ← Quantity selector
│ [−] [  1  ] [+]                     │
│ Available: 45 units                 │
│                                     │
│ [  ADD TO CART - ₫999,000  ]       │ ← CTA button (blue, full width)
│ [❤ Add to favorites] [📤 Share]   │ ← Secondary actions
│                                     │
│ [📦 Packaged carefully]             │ ← Info cards (3)
│ [🚚 Fast shipping]                  │
│ [🛡️ Quality guaranteed]             │
│                                     │
└─────────────────────────────────────┘
```

### Color Coding for Stock Status
```
Stock Level:    Visual Indicator:    Status:
─────────────────────────────────────────
> 10 units      ● (green)            In Stock
2-10 units      ● (yellow/amber)     Low Stock
< 2 units       ● (red)              Very Low
0 units         ● (gray)             Out of Stock
```

### Badge Styling
```
[NEW]         → Blue background, white text, rounded pill
[BESTSELLER]  → Gold background, dark text, rounded pill
[ON SALE]     → Red background, white text, rounded pill
[LOW STOCK]   → Orange background, white text, rounded pill
```

---

## 🎬 Component States & Animations

### Button States
```
ADD TO CART Button:
┌─────────────────────────────────┐
│ [  ADD TO CART - ₫999,000  ]   │  ← Normal state
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ [  ADD TO CART - ₫999,000  ]   │  ← Hover state (darker blue)
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ [  ⊙ ADDING TO CART...      ]   │  ← Loading state (spinner)
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ [  ✓ ADDED TO CART           ]  │  ← Success state (green, 2s)
└─────────────────────────────────┘
```

### Favorite Button States
```
[❤] Outline (gray)     ← Not added
[❤] Filled (red)       ← Added to favorites (toggles on click)
```

### Thumbnail Selection
```
[Thumb 1]   [Thumb 2]   [Thumb 3]
(White      (No border)  (White
 border -             border -
 selected)           selected)

When clicked, white border (3px) appears
```

---

## 📱 Responsive Breakpoints

```
Mobile First Approach:

Base (0px - 639px):         Mobile
- Full-width stacked layout
- 1-column related products
- No sticky gallery
- Touch-friendly buttons (48px)

Tablet (640px - 1023px):    Medium
- 2-column layout
- 2-column related products
- No sticky gallery
- Normal buttons

Desktop (1024px+):          Large
- 2-column layout (50/50)
- 4-column related products
- Sticky gallery on scroll
- Normal buttons
```

---

## 🎨 Color Usage Examples

```
Title Text:         #111827 (Gray 900)
Body Text:          #374151 (Gray 700)
Secondary Text:     #6B7280 (Gray 600)
Primary Button:     #3B82F6 (Blue)
Primary Hover:      #2563EB (Dark Blue)
Success (Green):    #22C55E (Savings)
Star Rating (Gold): #FBBF24
Borders:            #E5E7EB (Gray 200)
Backgrounds:        #F9FAFB (Gray 50) / #F3F4F6 (Gray 100)
```

---

## 🎯 Interaction Flows

### Image Gallery Interaction
```
User Click:     → Gallery State Change:    → Visual Feedback:
─────────────────────────────────────────────────────────
Click Thumb 2   → Update main image        → Main image updates
                → Set active = 2           → Thumbnail #2 highlighted
                                           → Counter shows "2 / 5"

Click Thumb 5   → Update main image        → Main image updates
                → Set active = 5           → Thumbnail #5 highlighted
                → Counter shows "5 / 5"
```

### Quantity Change
```
User Action:    → State Change:    → Validation:         → Display:
──────────────────────────────────────────────────────────────
Click + button  → qty = qty + 1     → Max = available     → [−] [  2  ] [+]
                                     → Update total price  → "Total: ₫1,998,000"

Click − button  → qty = qty - 1     → Min = 1             → [−] [  1  ] [+]
                                     → Disable − at qty=1  → "[−] disabled"
                                     → Update total price  → "Total: ₫999,000"
```

### Tab Switching
```
User Click:           → Visual Change:           → Content:
──────────────────────────────────────────────────────────
Click Description     → Blue underline on tab    → Show description
                      → Hide reviews content    → Show specs table
                      → Fade-in animation

Click Reviews         → Blue underline on tab    → Show reviews
                      → Hide description        → Show ratings
                      → Fade-in animation       → Show sample reviews
```

---

**Wireframes Created**: October 24, 2025  
**Purpose**: Visual reference for developers and designers  
**Status**: Complete ✅
