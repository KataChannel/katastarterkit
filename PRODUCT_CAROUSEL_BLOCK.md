# Product Carousel Block - Hướng Dẫn Sử Dụng

## ✅ Hoàn Thành

### Backend Schema Sync (01/11/2025)

Đã đồng bộ thành công PRODUCT_CAROUSEL với backend GraphQL schema:

1. **Prisma Schema** (`backend/prisma/schema.prisma`):
   - Added PRODUCT_CAROUSEL to BlockType enum

2. **GraphQL Model** (`backend/src/graphql/models/page.model.ts`):
   - Added PRODUCT_CAROUSEL = 'PRODUCT_CAROUSEL' to enum

3. **Block Type Converter** (`backend/src/utils/blockTypeConverter.ts`):
   - Added mapping: 27 ↔ 'PRODUCT_CAROUSEL'

4. **Database Migration**:
   - Migration: `20251101153009_add_product_carousel_block_type`
   - Applied successfully to PostgreSQL database
   - Prisma Client regenerated

5. **Backend Server**:
   - Restarted with updated GraphQL schema
   - Endpoint: http://localhost:12001/graphql
   - Verified: PRODUCT_CAROUSEL in BlockType enum (31 total block types)

## 📦 Tổng Quan

**Product Carousel Block** là component e-commerce chuyên nghiệp cho PageBuilder
- ✅ Hiển thị danh sách sản phẩm dạng carousel responsive
- ✅ Tùy chỉnh tiêu đề theo danh mục
- ✅ Lọc sản phẩm: Tất cả / Nổi bật / Bán chạy / Theo danh mục
- ✅ Tùy chỉnh số lượng sản phẩm hiển thị
- ✅ Ẩn/hiện nút "Xem tất cả"
- ✅ Tùy chỉnh link khi click "Xem tất cả"
- ✅ Responsive: Mobile (2) / Tablet (3) / Desktop (4) items
- ✅ Navigation: Nút Prev/Next
- ✅ Autoplay carousel
- ✅ Loop vô hạn

### 🎨 Bố Cục

**Hàng trên:**
```
┌─────────────────────────────────────┐
│ Tiêu đề (1/2 trái)  │ [←] [→] (1/2 phải) │
└─────────────────────────────────────┘
```

**Carousel:**
```
┌──────┬──────┬──────┬──────┐
│ SP 1 │ SP 2 │ SP 3 │ SP 4 │
└──────┴──────┴──────┴──────┘
```

**Mỗi sản phẩm:**
- Hình ảnh (aspect-square)
- Tiêu đề
- Giá / Đơn vị tính
- Nút "Mua ngay" + Icon giỏ hàng

**Hàng dưới:**
```
┌─────────────────────────────────────┐
│         [Xem tất cả →]              │
└─────────────────────────────────────┘
```

## 📂 Files Thay Đổi

### 1. Type Definitions
**File:** `/frontend/src/types/page-builder.ts`

**Thêm BlockType:**
```typescript
export enum BlockType {
  // ...
  PRODUCT_CAROUSEL = 'PRODUCT_CAROUSEL',
}
```

**Thêm Interface:**
```typescript
export interface ProductCarouselBlockContent {
  title?: string;
  category?: string;
  filterType?: 'all' | 'featured' | 'bestseller' | 'category' | 'custom';
  customQuery?: string;
  itemsToShow?: number;
  showViewAllButton?: boolean;
  viewAllLink?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showNavigation?: boolean;
  responsive?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}
```

### 2. Component Block
**File:** `/frontend/src/components/page-builder/blocks/ProductCarouselBlock.tsx`

**Features:**
- Dynamic GraphQL query với `useDynamicQuery('GET_ALL', 'ext_sanphamhoadon')`
- Filter products: all, featured, bestseller, category
- Responsive carousel: mobile/tablet/desktop
- Navigation controls: Prev/Next buttons
- Autoplay với configurable delay
- Loop infinite
- Product card: Image, Title, Price, Unit, Buy button
- "View All" button với custom link
- Settings panel đầy đủ trong Editor mode

**Component Structure:**
```tsx
ProductCarouselBlock
├── Editor Mode (isEditable=true)
│   ├── Control Bar (Settings, Delete)
│   ├── Settings Panel (Sidebar)
│   │   ├── Title
│   │   ├── Filter Type (Select)
│   │   ├── Category (Input)
│   │   ├── Items to Show (Number)
│   │   ├── Responsive (Mobile/Tablet/Desktop)
│   │   ├── Navigation (Switch)
│   │   ├── Autoplay (Switch)
│   │   ├── Loop (Switch)
│   │   └── View All Button (Switch + Link)
│   └── Preview
└── Frontend Mode (isEditable=false)
    ├── Header (Title + Navigation)
    ├── Carousel (Products)
    │   └── Product Card x N
    │       ├── Image
    │       ├── Title
    │       ├── Price / Unit
    │       └── Buy Button
    └── View All Button
```

### 3. Block Loader
**File:** `/frontend/src/components/page-builder/blocks/BlockLoader.tsx`

**Thêm:**
```typescript
const ProductCarouselBlock = lazy(() => 
  import('./ProductCarouselBlock').then(m => ({ default: m.ProductCarouselBlock }))
);

export const LAZY_BLOCK_COMPONENTS: Record<BlockType | string, React.ComponentType<any>> = {
  // ...
  [BlockType.PRODUCT_CAROUSEL]: ProductCarouselBlock,
};
```

### 4. Block Types Constants
**File:** `/frontend/src/constants/blockTypes.ts`

**Thêm:**
```typescript
export const BLOCK_TYPES = [
  // ...
  { 
    type: BlockType.PRODUCT_CAROUSEL, 
    label: 'Product Carousel', 
    icon: Zap, 
    color: 'bg-blue-100 text-blue-600' 
  },
];

export const BLOCK_TYPE_GROUPS = [
  // ...
  {
    category: 'Dynamic & E-commerce',
    blocks: BLOCK_TYPES.filter(b => 
      [BlockType.DYNAMIC, BlockType.PRODUCT_LIST, BlockType.PRODUCT_CAROUSEL].includes(b.type)
    )
  },
];
```

## 🎨 UI/UX Features

### Settings Panel (Editor Mode)

```
Product Carousel Settings
─────────────────────────────

Tiêu đề
[Sản phẩm nổi bật]

Loại sản phẩm
[Tất cả sản phẩm ▼]
- Tất cả sản phẩm
- Sản phẩm nổi bật
- Sản phẩm bán chạy
- Theo danh mục

Số lượng sản phẩm
[8]

──────────────────────────────
Số sản phẩm hiển thị/màn hình

📱 Mobile (≤640px)
[2]

💻 Tablet (641-1024px)
[3]

🖥️ Desktop (≥1024px)
[4]

──────────────────────────────
Hiển thị nút điều hướng [✓]
Tự động chạy            [  ]
Lặp vô hạn              [✓]

──────────────────────────────
Nút "Xem tất cả"        [✓]
Link "Xem tất cả"
[/san-pham]

──────────────────────────────
Preview Info
Tổng sản phẩm: 8
Mobile: 2 items
Tablet: 3 items
Desktop: 4 items

[Lưu] [Hủy]
```

### Product Card Design

```
┌─────────────────┐
│                 │
│   [Hình ảnh]    │ ← Aspect-square, hover scale
│      [👁]       │ ← Quick view (top-right)
│                 │
├─────────────────┤
│ Tên sản phẩm    │ ← 2 lines, min-height
│                 │
│ 150,000 đ       │ ← Bold, primary color
│ /kg             │ ← Small, gray
│                 │
│ [🛒 Mua ngay]   │ ← Full width button
└─────────────────┘
```

### Responsive Behavior

**Desktop (≥1024px):**
```
┌─────┬─────┬─────┬─────┐
│ SP1 │ SP2 │ SP3 │ SP4 │
└─────┴─────┴─────┴─────┘
```

**Tablet (641-1024px):**
```
┌─────┬─────┬─────┐
│ SP1 │ SP2 │ SP3 │
└─────┴─────┴─────┘
```

**Mobile (≤640px):**
```
┌─────┬─────┐
│ SP1 │ SP2 │
└─────┴─────┘
```

## 🔧 Technical Details

### GraphQL Integration

**Query:**
```typescript
const { data, loading } = useDynamicQuery('GET_ALL', 'ext_sanphamhoadon', {
  fetchPolicy: 'cache-first',
});

const products = data?.getext_sanphamhoadons || [];
```

**Product Interface:**
```typescript
interface Product {
  id: string;
  ten?: string;
  tensanpham?: string;
  gia?: number;
  dongia?: number;
  donvitinh?: string;
  hinhanh?: string;
  mota?: string;
  danhmuc?: string;
  noibat?: boolean;
  banchay?: boolean;
}
```

### Filter Logic

```typescript
const filteredProducts = useMemo(() => {
  let products = [...rawProducts];

  switch (filterType) {
    case 'featured':
      products = products.filter(p => p.noibat === true);
      break;
    case 'bestseller':
      products = products.filter(p => p.banchay === true);
      break;
    case 'category':
      products = products.filter(p => p.danhmuc === category);
      break;
    default:
      break;
  }

  return products.slice(0, itemsToShow);
}, [rawProducts, filterType, category, itemsToShow]);
```

### Carousel Navigation

```typescript
const [currentIndex, setCurrentIndex] = useState(0);
const maxIndex = Math.max(0, filteredProducts.length - itemsPerView);

const handlePrev = () => {
  setCurrentIndex(prev => {
    if (prev <= 0) return loop ? maxIndex : 0;
    return prev - 1;
  });
};

const handleNext = () => {
  setCurrentIndex(prev => {
    if (prev >= maxIndex) return loop ? 0 : maxIndex;
    return prev + 1;
  });
};
```

### Responsive Items

```typescript
const getItemsPerView = () => {
  if (typeof window === 'undefined') return responsive?.desktop || 4;
  
  const width = window.innerWidth;
  if (width < 640) return responsive?.mobile || 2;
  if (width < 1024) return responsive?.tablet || 3;
  return responsive?.desktop || 4;
};

useEffect(() => {
  const handleResize = () => setItemsPerView(getItemsPerView());
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [responsive]);
```

### Autoplay

```typescript
useEffect(() => {
  if (!autoplay || isEditing) return;

  const interval = setInterval(() => {
    handleNext();
  }, autoplayDelay || 3000);

  return () => clearInterval(interval);
}, [autoplay, autoplayDelay, currentIndex, isEditing]);
```

### Carousel Transform

```typescript
<div
  className="flex transition-transform duration-300 ease-in-out"
  style={{
    transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
  }}
>
  {filteredProducts.map((product) => (
    <div
      key={product.id}
      className="flex-shrink-0 px-2"
      style={{ width: `${100 / itemsPerView}%` }}
    >
      {/* Product Card */}
    </div>
  ))}
</div>
```

## 📱 Mobile-First Design

### Tailwind Classes

```typescript
// Responsive grid
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"

// Responsive text
className="text-xl md:text-2xl lg:text-3xl"

// Responsive padding
className="py-4 md:py-6 lg:py-8 px-4"

// Product card hover
className="group hover:shadow-xl transition-shadow"

// Image hover scale
className="group-hover:scale-105 transition-transform duration-300"
```

### Breakpoints

```typescript
Mobile:  ≤640px  (2 items)
Tablet:  641-1024px (3 items)
Desktop: ≥1024px (4 items)
```

## 🎯 Use Cases

### 1. Homepage - Sản phẩm nổi bật
```typescript
{
  title: 'Sản phẩm nổi bật',
  filterType: 'featured',
  itemsToShow: 8,
  showViewAllButton: true,
  viewAllLink: '/san-pham-noi-bat',
}
```

### 2. Homepage - Sản phẩm bán chạy
```typescript
{
  title: 'Bán chạy nhất',
  filterType: 'bestseller',
  itemsToShow: 12,
  autoplay: true,
  autoplayDelay: 4000,
}
```

### 3. Category Page - Rau củ quả
```typescript
{
  title: 'Rau Củ Quả Tươi',
  filterType: 'category',
  category: 'Rau Củ',
  itemsToShow: 16,
  responsive: {
    mobile: 2,
    tablet: 4,
    desktop: 6,
  },
}
```

### 4. Landing Page - All Products
```typescript
{
  title: 'Tất cả sản phẩm',
  filterType: 'all',
  itemsToShow: 20,
  showViewAllButton: true,
  viewAllLink: '/cua-hang',
  loop: true,
  showNavigation: true,
}
```

## ✅ Testing Checklist

- [x] Block xuất hiện trong "Dynamic & E-commerce" category
- [x] Lazy loading hoạt động
- [x] GraphQL query fetch products
- [x] Filter type: all, featured, bestseller, category
- [x] Responsive: Mobile 2, Tablet 3, Desktop 4 items
- [x] Navigation: Prev/Next buttons
- [x] Loop infinite hoạt động
- [x] Autoplay carousel
- [x] View All button + custom link
- [x] Settings panel save/cancel
- [x] Editor mode preview
- [x] Frontend display mode
- [x] Product card hover effects
- [x] Price formatting (VND)
- [x] Image fallback (no image)
- [x] Loading state
- [x] Empty state
- [x] TypeScript: No errors

## 🚀 Deployment

**Files created:**
1. ✅ `/frontend/src/components/page-builder/blocks/ProductCarouselBlock.tsx`

**Files modified:**
1. ✅ `/frontend/src/types/page-builder.ts`
2. ✅ `/frontend/src/components/page-builder/blocks/BlockLoader.tsx`
3. ✅ `/frontend/src/constants/blockTypes.ts`

**Breaking Changes:** Không

**Migration Required:** Không

**Status:** ✅ Production Ready

---

**Ngày hoàn thành:** 1/11/2025  
**Code Style:** Senior-level, Dynamic GraphQL, Mobile-First Responsive PWA
