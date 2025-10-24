# 🧪 Product Detail Page - Testing Checklist

**Date**: October 24, 2025  
**Route**: `/website/sanpham/[slug]`  
**Status**: Ready for Testing

---

## 📋 Pre-Testing Checklist

- [ ] Backend server running
- [ ] Frontend dev server running (`npm run dev`)
- [ ] Database seeded with products
- [ ] Sample product exists: `macbook-pro-m3`
- [ ] No console errors

---

## 🔍 Manual Testing (Desktop - 1920x1080)

### 1. Page Load & Navigation
- [ ] Navigate to: `http://localhost:3000/website/sanpham/macbook-pro-m3`
- [ ] Page loads without errors
- [ ] Breadcrumb visible: "Home > Products > Electronics > MacBook Pro M3"
- [ ] All components render (gallery, info, tabs)

### 2. Image Gallery (Top Left 1/2)
- [ ] Large product image displays (square aspect ratio)
- [ ] Image has discount badge if on sale
- [ ] 5+ thumbnail images visible
- [ ] Thumbnails scrollable (use scroll/arrow)
- [ ] Image counter shows "1 / 5" format
- [ ] **Click 1st thumbnail** → Large image updates
- [ ] **Click 3rd thumbnail** → Large image updates
- [ ] **Click last thumbnail** → Large image updates
- [ ] Counter updates correctly (e.g., "3 / 5")
- [ ] Thumbnails have white border on selected
- [ ] Smooth transitions between images

### 3. Product Info (Top Right 1/2)

#### Title & Category
- [ ] Product title displays (large, bold)
- [ ] Category name shows above title (small, gray)
- [ ] Feature badges show if applicable: [New] [Bestseller] [On Sale] [Low Stock]

#### Price Display
- [ ] Current price: "₫ 999,000 / kg" (or unit)
- [ ] Price formatted with commas (e.g., 1,299,000)
- [ ] If on sale:
  - [ ] Original price crossed out
  - [ ] Green savings text (e.g., "Tiết kiệm: ₫ 300,000")

#### Specifications Box (Gray box)
- [ ] SKU displays correctly (e.g., "MP-001")
- [ ] Origin shows (e.g., "Vietnam")
- [ ] Weight shows (e.g., "500g")
- [ ] Stock displays with color:
  - [ ] Green if > 10 units
  - [ ] Yellow if 2-10 units
  - [ ] Red if < 2 units

#### Short Description
- [ ] Product short description visible
- [ ] Text wraps correctly

#### Variants (if available)
- [ ] Variant buttons display (e.g., [M] [L] [XL])
- [ ] **Click variant** → Highlights selected
- [ ] **Click variant** → Price updates if different
- [ ] Disabled variants show grayed out if no stock

#### Quantity Selector
- [ ] Default quantity: 1
- [ ] Minus button **disabled** when quantity = 1
- [ ] **Click plus** → Quantity increases to 2
- [ ] **Click plus again** → Quantity increases to 3
- [ ] **Click minus** → Quantity decreases to 2
- [ ] **Can't increase** beyond available stock (e.g., 45)
- [ ] Plus button disabled when at max stock
- [ ] Shows "Available: 45 kg" text

#### Action Buttons
- [ ] Add to Cart button (blue, full width)
  - [ ] Shows total price (e.g., "Add to Cart - ₫ 999,000")
  - [ ] **Click** → Button shows loading/success feedback
  - [ ] Check console for cart action (or toast if implemented)
- [ ] ❤ Favorite button
  - [ ] **Click** → Heart fills/unfills
  - [ ] Color changes (red filled or gray outline)
- [ ] 📤 Share button
  - [ ] **Click** → Shows share options or notification

#### Info Cards (3 cards below buttons)
- [ ] Package icon + "Carefully packaged"
- [ ] Truck icon + "Fast shipping"
- [ ] Shield icon + "Quality guaranteed"

### 4. Tabs Section

#### Tab 1: Mô tả chi tiết (Detailed Description)
- [ ] Tab is selected by default
- [ ] Tab has underline/highlight
- [ ] Shows product description (HTML rendered)
- [ ] Shows specifications table:
  - [ ] Key-value pairs visible
  - [ ] Alternating row colors (light/white)
  - [ ] Examples: "Processor: Apple M3", "Memory: 8GB", etc.

#### Tab 2: Đánh giá & Xếp hạng (Reviews & Ratings)
- [ ] **Click tab** → Switches to reviews section
- [ ] Tab underline moves to this tab
- [ ] Shows overall rating (e.g., "4.5 ⭐")
- [ ] Shows review count (e.g., "Based on 12 reviews")
- [ ] Shows rating breakdown chart/bars:
  - [ ] 5⭐: 7 (60%) - bar shows 60%
  - [ ] 4⭐: 3 (25%) - bar shows 25%
  - [ ] 3⭐: 1 (10%) - bar shows 10%
  - [ ] 2⭐: 1 (5%) - bar shows 5%
- [ ] Shows sample reviews (2-3 visible):
  - [ ] Author name
  - [ ] Star rating (⭐⭐⭐⭐⭐)
  - [ ] Date (e.g., "Oct 20, 2025")
  - [ ] Review title
  - [ ] Review comment text
- [ ] Shows "Xem thêm đánh giá" (View more reviews) button
- [ ] **Click tab 1 again** → Switches back to description

### 5. Related Products (Below Detail Section)
- [ ] Shows 4 product cards in grid
- [ ] Each card shows:
  - [ ] Product image
  - [ ] Product name
  - [ ] Price
  - [ ] Unit (kg, túi, bó)
  - [ ] Heart/favorite button
- [ ] Grid layout: 4 columns
- [ ] No current product in the list (excluded)
- [ ] All from same category
- [ ] **Click add to cart** on related product → Works
- [ ] **Click heart** on related product → Toggles

### 6. Sticky Gallery (Scroll Behavior)
- [ ] **Scroll down** → Gallery stays fixed in top-left
- [ ] Stays visible while scrolling through info
- [ ] Stays visible while scrolling through tabs
- [ ] Returns to normal position when scroll back up
- [ ] Related products grid shows below

---

## 📱 Mobile Testing (375x667 - iPhone SE)

### Layout Changes
- [ ] Gallery is full-width, not side-by-side
- [ ] Product info stacks below gallery
- [ ] Thumbnails horizontal scroll still works
- [ ] Gallery is NOT sticky (stacks normally)
- [ ] Text is readable without zoom
- [ ] Buttons are touch-friendly (48px+ height)

### Image Gallery
- [ ] Large image full-width
- [ ] Thumbnails can scroll horizontally
- [ ] Image counter visible
- [ ] Click thumbnail updates image

### Product Info
- [ ] Title visible (large)
- [ ] Price readable
- [ ] Specs box formatted for mobile
- [ ] Quantity selector works
- [ ] Buttons full-width or 2-column

### Tabs
- [ ] Both tabs visible (may need scroll)
- [ ] Can switch between tabs
- [ ] Content readable

### Related Products
- [ ] Shows 1 column (stacked)
- [ ] Or 2 columns (depending on responsive breakpoints)
- [ ] Can scroll down to see all

---

## 🖥️ Tablet Testing (768x1024 - iPad)

### Layout
- [ ] 2-column layout (if space allows)
- [ ] Or stacked layout depending on breakpoints
- [ ] Gallery takes 50% or less width
- [ ] Info takes other 50%

### Related Products
- [ ] Shows 2-3 columns (not 4)
- [ ] Responsive grid visible

---

## 🐛 Error Scenarios Testing

### Invalid Product Slug
- [ ] Navigate to: `/website/sanpham/invalid-product-xyz`
- [ ] Page shows error message
- [ ] Shows "Quay lại cửa hàng" (Back to shop) link
- [ ] Clicking link goes to `/website/sanpham`

### Network Error (Simulate)
- [ ] Open DevTools → Network tab
- [ ] Set to "Offline" or throttle
- [ ] Navigate to product page
- [ ] See loading skeleton
- [ ] See error state with retry option

### Slow Network
- [ ] Set network throttle to "Slow 3G"
- [ ] Navigate to product
- [ ] Watch skeleton loader
- [ ] Content eventually loads
- [ ] Smooth transition from skeleton to content

---

## ⚡ Performance Testing

### Page Load
- [ ] First Contentful Paint (FCP) < 2s
- [ ] Largest Contentful Paint (LCP) < 3s
- [ ] Images load quickly
- [ ] No layout shift while loading

### Image Optimization
- [ ] Images are compressed (check DevTools)
- [ ] Using webp format if available
- [ ] Thumbnails are smaller than main image

### Interaction Performance
- [ ] Clicking thumbnail instant (no lag)
- [ ] Switching tabs instant
- [ ] Quantity +/- responds immediately
- [ ] Add to cart button animates smoothly

---

## 🎨 Visual/UX Testing

### Colors & Styling
- [ ] Primary color used for call-to-actions (blue usually)
- [ ] Prices in contrasting color
- [ ] Badges have appropriate colors
- [ ] Stock indicators: green/yellow/red
- [ ] Text is readable (contrast ratio WCAG AA)

### Typography
- [ ] Headings are appropriately sized
- [ ] Product title is largest
- [ ] Tab text is visible
- [ ] Review text is readable
- [ ] No text overflow (wrapping works)

### Spacing
- [ ] Components have proper padding
- [ ] No cramped sections
- [ ] Gallery has breathing room from info
- [ ] Tab content not touching edges

### Hover States
- [ ] Buttons highlight on hover (desktop)
- [ ] Thumbnail shows selection state
- [ ] Links are underlined or colored differently
- [ ] Favorite heart shows hover effect
- [ ] Share button shows hover effect

---

## 🎯 Functional Testing Checklist

| Feature | Expected | Actual | Status |
|---------|----------|--------|--------|
| Page loads | No errors | | ☐ |
| Images display | 5+ images visible | | ☐ |
| Click thumbnail | Main image updates | | ☐ |
| Image counter | Shows correct count | | ☐ |
| Price displays | Formatted correctly | | ☐ |
| Discount shows | Strikethrough & savings | | ☐ |
| Specs box | All 4 specs visible | | ☐ |
| Quantity + | Increases value | | ☐ |
| Quantity - | Decreases value | | ☐ |
| Add to cart | Callback triggered | | ☐ |
| Favorite toggle | Switches state | | ☐ |
| Share button | Shows options/notification | | ☐ |
| Description tab | Shows content | | ☐ |
| Reviews tab | Shows ratings & reviews | | ☐ |
| Tab switch | Both tabs functional | | ☐ |
| Related products | 4 in grid | | ☐ |
| Related add cart | Works | | ☐ |
| Breadcrumb | All links work | | ☐ |
| Mobile layout | Responsive | | ☐ |
| Tablet layout | Responsive | | ☐ |
| Error handling | Shows message | | ☐ |

---

## 🔗 Test URLs

```
✅ Valid Product: /website/sanpham/macbook-pro-m3
✅ Other products: /website/sanpham/iphone-15-pro
❌ Invalid product: /website/sanpham/xyz-invalid
🏠 Shop page: /website/sanpham
```

---

## 📊 Test Results Summary

| Category | Pass | Fail | Notes |
|----------|------|------|-------|
| Loading | | | |
| Gallery | | | |
| Product Info | | | |
| Pricing | | | |
| Actions | | | |
| Tabs | | | |
| Related Products | | | |
| Responsive | | | |
| Performance | | | |
| Errors | | | |
| **TOTAL** | | | |

---

## 🚀 Final Checklist

- [ ] All manual tests passed
- [ ] No console errors
- [ ] Mobile layout verified
- [ ] Tablet layout verified
- [ ] Desktop layout verified
- [ ] Image gallery works
- [ ] Tabs work
- [ ] Related products visible
- [ ] All buttons functional
- [ ] Responsive at breakpoints

---

**Status**: Ready for Production Testing ✅  
**Last Updated**: October 24, 2025  
**Tester**: [Your Name]  
**Date Tested**: ___________  
**Result**: ✅ PASS / ❌ FAIL
