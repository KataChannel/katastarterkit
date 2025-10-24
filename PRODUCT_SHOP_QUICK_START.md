# 🚀 Product Shop Layout - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. **Already Created - Just Use It!** ✅

All components are created and ready to use. The shop page is automatically available at:
```
http://localhost:3000/website/sanpham
```

### 2. **File Locations**

```
✅ /frontend/src/components/shop/
   ├── CategorySidebar.tsx       (Sidebar: Categories + Cheap Products)
   ├── ProductFilter.tsx          (Search + Sort)
   ├── ProductGrid.tsx            (Products + Pagination)
   ├── ProductShopPage.tsx        (Main container)
   └── index.ts                   (Exports)

✅ /frontend/src/app/website/sanpham/
   └── page.tsx                   (Route)

✅ /frontend/src/graphql/product.queries.ts
   └── GET_CHEAP_PRODUCTS         (New query)
```

---

## 🎯 How It Works

### Desktop Layout
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                             
  [Sidebar]      [Search + Sort]            
  Categories     [Product 1] [Product 2] ... 
  Cheap Prod    [Product 4] [Product 5] ... 
                [Product 7] [Product 8] ... 
                                             
                [◄ 1 2 3 4 5 ►]              
                                             
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Mobile Layout
```
━━━━━━━━━━━━━━━━━━━━━━
[🔽 Bộ lọc]  [⋯]
━━━━━━━━━━━━━━━━━━━━━━
[Search + Sort]
[Product 1]
[Product 2]
[Product 3]

[◄ 1 2 3 ►]
━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔧 Customization

### Change Products Per Page

**File**: `/frontend/src/components/shop/ProductShopPage.tsx`

```typescript
// Change from 12 to 24
const ITEMS_PER_PAGE = 24;
```

### Add Toast Notifications

**File**: `/frontend/src/components/shop/ProductShopPage.tsx`

```typescript
import { useToast } from '@/hooks/use-toast'; // or your toast hook

export function ProductShopPage() {
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    // Add to cart logic
    addToCart(product);
    
    toast({
      title: 'Thành công',
      description: `${product.name} đã thêm vào giỏ hàng`,
    });
  };
}
```

### Add Favorite Feature

```typescript
import { useFavorites } from '@/hooks/use-favorites';

export function ProductShopPage() {
  const { toggleFavorite } = useFavorites();

  const handleToggleFavorite = (product: Product) => {
    toggleFavorite(product.id);
  };
}
```

---

## 🔌 API Integration

### GraphQL Queries Used

1. **GET_ACTIVE_CATEGORIES** - Sidebar categories
2. **GET_CHEAP_PRODUCTS** - Sidebar cheap products
3. **GET_PRODUCTS** - Main product list
4. **GET_PRODUCTS_BY_CATEGORY** - Filter by category

All queries are in `/frontend/src/graphql/product.queries.ts`

---

## 🎨 Styling

All components use:
- **TailwindCSS v4** for styling
- **shadcn/ui** components for UI
- **lucide-react** for icons
- **Responsive design** with mobile-first approach

To customize colors, edit Tailwind config or update class names.

---

## 📊 Component Features

| Component | Features |
|---|---|
| **CategorySidebar** | Category list, product count badges, 5 cheap products, hover effects |
| **ProductFilter** | Search input, sort dropdown (5 options), product counter |
| **ProductGrid** | 3-column grid, 12 products/page, pagination, loading states, empty state |
| **ProductShopPage** | State management, responsive layout, breadcrumb, mobile sidebar toggle |

---

## 🧪 Test It

### 1. Navigate to Shop Page
```
http://localhost:3000/website/sanpham
```

### 2. Test Features
- [ ] See sidebar on desktop
- [ ] Filter by category
- [ ] Search for products
- [ ] Sort by different options
- [ ] Paginate through results
- [ ] Collapse sidebar on mobile
- [ ] Add to cart button clicks
- [ ] Favorite button works

---

## 🐛 Troubleshooting

### **Products not showing?**
1. Check backend GraphQL is running
2. Verify categories exist in database
3. Check browser console for errors

### **Sidebar not showing on desktop?**
Check for `hidden lg:block` class - might be CSS breakpoint issue

### **Search not working?**
Verify `GET_PRODUCTS` query includes search filter in backend

### **Pagination not working?**
Check `totalPages` calculation: `Math.ceil(total / ITEMS_PER_PAGE)`

---

## 📱 Responsive Testing

Use browser DevTools to test:
- **Mobile**: 375px width
- **Tablet**: 768px width
- **Desktop**: 1280px width

---

## 🔄 Next Steps

1. **Add cart functionality** → Implement `handleAddToCart`
2. **Add wishlist** → Implement `handleToggleFavorite`
3. **Add filters** → Add price range, rating, etc.
4. **Add product comparison** → Select multiple products
5. **Add reviews section** → Show product reviews

---

## 📚 File Reference

```
ProductShopPage (Main Container)
├── CategorySidebar
│   ├── GET_ACTIVE_CATEGORIES query
│   └── GET_CHEAP_PRODUCTS query
├── ProductFilter
│   ├── Search input
│   ├── Sort dropdown
│   └── Product counter
└── ProductGrid
    ├── ProductCard (reused from existing)
    ├── Pagination controls
    └── Empty/Error states
```

---

## ✅ Implementation Checklist

- [x] CategorySidebar component created
- [x] ProductFilter component created
- [x] ProductGrid component created
- [x] ProductShopPage component created
- [x] Route page created (`/website/sanpham`)
- [x] GraphQL query added
- [x] Responsive design implemented
- [x] Error handling added
- [x] Loading states added
- [x] Empty state added

---

## 🚀 Deploy

Once tested locally:

```bash
# Build frontend
npm run build

# Deploy to production
# Your deployment commands here
```

The shop page will be available at `/website/sanpham` in production!

---

**Documentation Created**: PRODUCT_SHOP_DOCUMENTATION.md  
**Quick Start**: This file  
**Status**: ✅ Ready to Use
