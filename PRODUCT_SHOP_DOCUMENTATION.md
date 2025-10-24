# 🛍️ Product Shop Layout Documentation

## 📋 Overview

Complete e-commerce product shop layout system for `/website/sanpham` with:
- **Left Sidebar (1/3 width)**: Category navigation + cheap products
- **Main Content (2/3 width)**: Search/Filter + Product Grid with Pagination
- **Responsive Design**: Mobile-friendly with collapsible sidebar

---

## 🏗️ Architecture

### Directory Structure

```
frontend/src/
├── components/
│   ├── shop/                          (NEW)
│   │   ├── CategorySidebar.tsx       (Categories + Cheap Products)
│   │   ├── ProductFilter.tsx         (Search + Sort dropdown)
│   │   ├── ProductGrid.tsx           (3-column grid + Pagination)
│   │   ├── ProductShopPage.tsx       (Main container)
│   │   └── index.ts                  (Exports)
│   └── product/                       (Existing - reused)
│       └── ProductCard.tsx
├── app/
│   └── website/
│       └── sanpham/
│           └── page.tsx              (Route entry point)
└── graphql/
    └── product.queries.ts            (Updated with GET_CHEAP_PRODUCTS)
```

---

## 📊 Component Breakdown

### 1. **CategorySidebar** (`CategorySidebar.tsx`)

**Purpose**: Left sidebar with category list and discounted products

**Features**:
- Fetches all active categories with product count
- "Tất cả danh mục" button to show all products
- Displays 5 cheapest products (sorted by price ASC)
- Shows product image, name, and price
- Category selection with active state highlighting

**Props**:
```typescript
interface CategorySidebarProps {
  selectedCategoryId?: string | null;
  onCategorySelect?: (categoryId: string | null) => void;
  className?: string;
}
```

**GraphQL Queries**:
- `GET_ACTIVE_CATEGORIES`: Fetches categories with product count
- `GET_CHEAP_PRODUCTS`: Fetches cheapest 5 products

**Responsive**: Hidden on mobile, visible on `lg:` breakpoint

---

### 2. **ProductFilter** (`ProductFilter.tsx`)

**Purpose**: Search and sorting controls

**Features**:
- **Search Input**: Real-time product search
- **Product Counter**: Shows "X sản phẩm" total
- **Sort Dropdown**: 5 sort options:
  - 🆕 Mới nhất (newest)
  - ⬆️ Giá thấp đến cao (price-low)
  - ⬇️ Giá cao đến thấp (price-high)
  - 🔥 Bán chạy nhất (bestseller)
  - ⭐ Phổ biến nhất (popular)

**Props**:
```typescript
interface ProductFilterProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  totalProducts?: number;
  className?: string;
}

type SortOption = 'newest' | 'price-low' | 'price-high' | 'bestseller' | 'popular';
```

---

### 3. **ProductGrid** (`ProductGrid.tsx`)

**Purpose**: Display products in a responsive grid with pagination

**Features**:
- **Grid Layout**: 3 columns on desktop, 2 on tablet, 1 on mobile
- **12 Products Per Page**: Configurable via `ITEMS_PER_PAGE`
- **Product Card**: Uses existing `ProductCard` component with:
  - Product image
  - Category name
  - Product name
  - Price (with original price if on sale)
  - "Mua" button (Add to cart)
  - Favorite toggle button
- **Pagination**:
  - Previous/Next buttons
  - Smart page number display (shows nearby + first/last pages)
  - Page counter: "Trang X trên Y"
  - Disabled states when at first/last page

**Props**:
```typescript
interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: Error | null;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  className?: string;
  emptyMessage?: string;
}
```

**Empty States**:
- Loading: Shows 12 skeleton cards
- Error: Displays error message
- No products: Shows "📦 Không tìm thấy sản phẩm nào"

---

### 4. **ProductShopPage** (`ProductShopPage.tsx`)

**Purpose**: Main container component that orchestrates all parts

**Features**:
- **State Management**:
  - `selectedCategoryId`: Filter by category
  - `currentPage`: Current page number
  - `searchQuery`: Search text
  - `sortBy`: Sort option
  - `isMobileFilterOpen`: Mobile sidebar toggle
- **Responsive Layout**:
  - Desktop: Sidebar (1/3) + Content (2/3)
  - Mobile: Collapsible sidebar with filter button
- **Auto-Reset**: Resets to page 1 when category/search changes
- **GraphQL Integration**:
  - Switches between `GET_PRODUCTS` and `GET_PRODUCTS_BY_CATEGORY`
  - Applies sort, search, and pagination parameters
- **Breadcrumb Navigation**: Home > Sản phẩm

**Layout**:
```
┌─────────────────────────────────────────────────┐
│            Breadcrumb Navigation                 │
├────────────────────┬──────────────────────────────┤
│                    │                              │
│ CategorySidebar    │ ProductFilter                │
│ (1/3 width)        │ (Full width)                 │
│                    │                              │
│ - Categories       │ ProductGrid                  │
│ - Cheap Products   │ - 3 columns grid             │
│                    │ - 12 products/page           │
│                    │ - Pagination controls        │
│                    │                              │
└────────────────────┴──────────────────────────────┘
```

---

## 🔧 GraphQL Queries

### New Query: `GET_CHEAP_PRODUCTS`

```graphql
query GetCheapProducts($input: GetProductsInput) {
  products(input: $input) {
    items {
      id
      name
      slug
      price
      originalPrice
      thumbnail
      category { name }
      isFeatured
      isNewArrival
      isBestSeller
      isOnSale
    }
    total
    page
    limit
    totalPages
  }
}
```

**Usage in CategorySidebar**:
```typescript
const { data: cheapProductsData } = useQuery(GET_CHEAP_PRODUCTS, {
  variables: {
    input: {
      limit: 5,
      sortBy: 'price',
      sortOrder: 'ASC'
    }
  },
  errorPolicy: 'all'
});
```

### Existing Queries Used

- `GET_ACTIVE_CATEGORIES`: Fetch active categories
- `GET_PRODUCTS`: Fetch all products with filters/sort/pagination
- `GET_PRODUCTS_BY_CATEGORY`: Fetch category-specific products

---

## 📱 Responsive Breakpoints

| Screen Size | Layout |
|---|---|
| Mobile (< 1024px) | Full-width content, collapsible sidebar |
| Tablet (768px - 1023px) | 2-column grid in products |
| Desktop (≥ 1024px) | Sidebar + Content 3-column grid |

**CSS Classes Used**:
- `hidden lg:block` - Hide sidebar on mobile
- `lg:hidden` - Hide on desktop
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` - Responsive columns

---

## 🎯 Feature Implementation

### Search Functionality

1. User types in search input
2. `onSearchChange` updates parent state
3. Re-queries with `filters: { search: searchQuery }`
4. Results update automatically
5. Pagination resets to page 1

```typescript
const handleSearchChange = (query: string) => {
  setSearchQuery(query);
  setCurrentPage(1); // Auto-reset
};
```

### Sorting

Sort options map to GraphQL sort parameters:

```typescript
const getSortParams = (sort: SortOption) => {
  switch (sort) {
    case 'price-low':
      return { sortBy: 'price', sortOrder: 'ASC' };
    case 'price-high':
      return { sortBy: 'price', sortOrder: 'DESC' };
    case 'bestseller':
      return { sortBy: 'isBestSeller', sortOrder: 'DESC' };
    case 'popular':
      return { sortBy: 'isFeatured', sortOrder: 'DESC' };
    case 'newest':
    default:
      return { sortBy: 'createdAt', sortOrder: 'DESC' };
  }
};
```

### Pagination

- **Items per page**: 12 (configurable)
- **Total pages**: `Math.ceil(total / ITEMS_PER_PAGE)`
- **Current page**: State-managed, updated via `onPageChange`
- **Page display**: Smart navigation showing 1, nearby pages, and last page

Example: With 50 products and page 3 of 5:
```
[◄] [1] [2] [3] [4] [5] [►]
```

Example: With 100 products and page 8 of 10:
```
[◄] [1] [...] [6] [7] [8] [9] [10] [►]
```

---

## 🎨 UI Components Used

All components from your existing UI library:

| Component | Usage |
|---|---|
| `Card` | Container for sidebar sections |
| `Badge` | Product count badges |
| `Button` | Pagination, sort buttons |
| `Input` | Search input |
| `Skeleton` | Loading placeholders |
| `DropdownMenu` | Sort options |
| `Icon` (lucide-react) | Filter, search, arrows |

---

## 💾 State Management Flow

```
ProductShopPage
├── selectedCategoryId (filter)
├── currentPage (pagination)
├── searchQuery (search)
├── sortBy (sort)
└── isMobileFilterOpen (mobile UI)
    ├── CategorySidebar
    │   ├── onCategorySelect → setSelectedCategoryId
    │   └── onCategorySelect → setIsMobileFilterOpen(false)
    ├── ProductFilter
    │   ├── onSearchChange → setSearchQuery + reset page
    │   └── onSortChange → setSortBy
    └── ProductGrid
        ├── onPageChange → setCurrentPage
        ├── onAddToCart → handleAddToCart
        └── onToggleFavorite → handleToggleFavorite
```

---

## 🚀 Usage Example

### Basic Setup

```typescript
// In your layout or page
import { ProductShopPage } from '@/components/shop';

export default function SanPhamPage() {
  return <ProductShopPage />;
}
```

### Customization

**Change items per page**:
```typescript
const ITEMS_PER_PAGE = 24; // Instead of 12
```

**Add to cart implementation**:
```typescript
const handleAddToCart = (product: Product) => {
  // Add your cart logic here
  addToCart(product);
  toast.success(`${product.name} thêm vào giỏ hàng`);
};
```

**Favorite functionality**:
```typescript
const handleToggleFavorite = (product: Product) => {
  toggleWishlist(product.id);
  toast.success('Đã cập nhật danh sách yêu thích');
};
```

---

## 📝 File Locations

| File | Purpose |
|---|---|
| `/frontend/src/components/shop/CategorySidebar.tsx` | Sidebar with categories & cheap products |
| `/frontend/src/components/shop/ProductFilter.tsx` | Search & sort controls |
| `/frontend/src/components/shop/ProductGrid.tsx` | Product grid & pagination |
| `/frontend/src/components/shop/ProductShopPage.tsx` | Main container |
| `/frontend/src/components/shop/index.ts` | Component exports |
| `/frontend/src/app/website/sanpham/page.tsx` | Route entry point |
| `/frontend/src/graphql/product.queries.ts` | GraphQL queries (updated) |

---

## 🧪 Testing Checklist

- [ ] Desktop layout: Sidebar + Content displayed correctly
- [ ] Mobile layout: Collapsible sidebar works
- [ ] Category filtering: Click category updates products
- [ ] Search: Type query updates results and resets pagination
- [ ] Sorting: All 5 sort options work correctly
- [ ] Pagination: Navigate through pages without errors
- [ ] Loading states: Skeleton cards show while loading
- [ ] Empty state: Message displays when no products found
- [ ] Error handling: Error message shows on API failure
- [ ] Responsive images: Product images load and resize correctly
- [ ] Links: Click product goes to detail page
- [ ] Cheap products sidebar: Shows 5 cheapest items correctly

---

## 🔄 Update Summary

**Files Created**:
1. ✅ `/frontend/src/components/shop/CategorySidebar.tsx`
2. ✅ `/frontend/src/components/shop/ProductFilter.tsx`
3. ✅ `/frontend/src/components/shop/ProductGrid.tsx`
4. ✅ `/frontend/src/components/shop/ProductShopPage.tsx`
5. ✅ `/frontend/src/components/shop/index.ts`
6. ✅ `/frontend/src/app/website/sanpham/page.tsx`

**Files Updated**:
1. ✅ `/frontend/src/graphql/product.queries.ts` (Added GET_CHEAP_PRODUCTS)

**Total Lines of Code**: ~1,000 lines
**Components**: 4 main + 1 page
**GraphQL Queries**: 1 new + 3 existing
**Features**: Search, Sort, Filter, Pagination, Responsive Design

---

## 🎯 Features Summary

### ✨ Layout Section 1/3
- [x] List danh mục sản phẩm (hình nhỏ, title)
- [x] List sản phẩm giá rẻ (hình nhỏ, title)

### ✨ Layout Section 2/3
- [x] Search với số lượng sản phẩm hiển thị
- [x] Sort dropdown (5 options: newest, price-low, price-high, bestseller, popular)
- [x] Grid 3 columns hiển thị 12 sản phẩm
  - [x] Hình ảnh
  - [x] Tiêu đề
  - [x] Icon giỏ hàng (Add to cart button)
  - [x] Giá (Price)
  - [x] "Mua ngay" button
- [x] Pagination (Previous, page numbers, next)

---

## 🎓 Learning Resources

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Apollo Client Queries](https://www.apollographql.com/docs/react/data/queries/)
- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid-template-columns)
- [Responsive Design Patterns](https://web.dev/responsive-web-design-basics/)

