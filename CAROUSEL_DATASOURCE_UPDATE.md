# Cập Nhật CarouselBlock với Data Source từ API & Database

## 🎯 Tổng Quan

Đã cập nhật **CarouselBlock** để hỗ trợ 3 nguồn dữ liệu:
1. **Manual** - Thêm slides thủ công (như cũ)
2. **Database** - Tự động load dữ liệu từ GraphQL Database
3. **API** - Fetch dữ liệu từ REST API endpoint

## ✨ Tính Năng Mới

### 1. Data Source Configuration
- **Manual Mode**: Thêm/sửa slides thủ công với đầy đủ control
- **Database Mode**: 
  - Tự động load products từ database qua GraphQL
  - Hỗ trợ 3 query types: Featured Products, All Products, Custom Query
  - Tự động mapping fields: name, thumbnail, description, price...
  - Tự động thêm badge (Nổi bật, Giảm giá) dựa trên product flags
  - Tự động tạo CTA links đến trang sản phẩm
- **API Mode**: Cấu hình endpoint để fetch data (advanced)

### 2. UI/UX Improvements
- **Loading State**: Hiển thị spinner khi đang load data từ database
- **Refresh Button**: Refresh data trong edit mode (chỉ hiện ở database mode)
- **Smart Controls**: 
  - Manual mode: Hiện nút "Add Slide" + edit controls trên từng slide
  - Database mode: Hiện nút "Refresh" thay vì Add Slide
  - Data source info hiển thị trong placeholder
- **Edit Restrictions**: Chỉ cho phép edit slides trong manual mode

### 3. Settings Dialog Enhancement
- **Tab mới "Data Source"**: 
  - Chọn data source type (Manual/Database/API)
  - Configure query type cho database mode
  - Set limit (1-50 items)
  - API endpoint configuration
  - Helpful info boxes cho từng mode

## 📁 Files Đã Chỉnh Sửa

### 1. `/frontend/src/components/page-builder/blocks/CarouselBlock.tsx`
**Thay đổi chính**:
- Import `useQuery` từ Apollo Client
- Import `GET_FEATURED_PRODUCTS`, `GET_PRODUCTS` queries
- Thêm `DataSourceType` và `DataSourceConfig` interfaces
- State mới: `dynamicSlides` để lưu slides từ database/API
- Logic fetch data từ database với `useQuery` hook
- Transform products → slides với field mapping
- Conditional rendering dựa trên data source type
- Smart button controls (Add Slide vs Refresh)
- Loading state trong placeholder
- Chỉ cho edit slides trong manual mode

**Dòng code quan trọng**:
```typescript
// Fetch data from database
const { data: productsData, loading: productsLoading, refetch: refetchProducts } = useQuery(
  dataSource.queryType === 'featured' ? GET_FEATURED_PRODUCTS : GET_PRODUCTS,
  {
    variables: dataSource.queryType === 'featured' 
      ? { limit: dataSource.limit || 10 }
      : { input: { limit: dataSource.limit || 10, filters: dataSource.filters || {} } },
    skip: dataSource.type !== 'database',
  }
);

// Transform products to slides
const transformedSlides: CarouselSlide[] = products.map((product, index) => {
  const productAny = product as any;
  return {
    id: product.id || `slide-${index}`,
    title: productAny[dataSource.titleField || 'name'] || product.name,
    description: productAny[dataSource.descriptionField || 'description'] || product.description,
    image: productAny[dataSource.imageField || 'thumbnail'] || product.thumbnail,
    cta: {
      text: 'Xem chi tiết',
      link: `/san-pham/${product.slug}`,
    },
    badge: product.isFeatured ? 'Nổi bật' : product.isOnSale ? 'Giảm giá' : undefined,
    bgColor: 'bg-gradient-to-r from-blue-500 to-purple-600',
    textColor: 'text-white',
    imagePosition: 'right',
  };
});
```

### 2. `/frontend/src/components/page-builder/blocks/CarouselSettingsDialog.tsx`
**Thay đổi chính**:
- Thêm `dataSource` vào settings interface
- Tab mới "Data Source" (5 tabs total)
- UI cho Database Mode: Query Type selector, Limit input
- UI cho API Mode: Endpoint input
- Info boxes giải thích từng mode
- Grid layout 5 cột cho tabs

**UI Structure**:
```
Tabs: [Data Source | Behavior | Appearance | Content | Controls]

Data Source Tab:
├── Data Source Type Selector (Manual/Database/API)
├── Database Mode Settings:
│   ├── Query Type (Featured/Products/Custom)
│   ├── Limit (1-50)
│   └── Info box
├── API Mode Settings:
│   ├── Endpoint input
│   └── Info box
└── Manual Mode:
    └── Info box
```

### 3. `/frontend/src/data/blockTemplates.ts`
**Template mới**: `carousel-featured-products`
- **Category**: custom
- **Structure**: Section → Container → Title + Subtitle + Carousel
- **Carousel Config**:
  - Data Source: Database mode
  - Query Type: featured
  - Limit: 12 products
  - 3 slides per view
  - Auto-play 4s interval
  - Circle arrow style
  - Dots indicators

**Code**:
```typescript
{
  id: 'carousel-featured-products',
  name: 'Featured Products Carousel',
  description: 'Carousel tự động hiển thị sản phẩm nổi bật từ database',
  category: 'custom',
  blocks: [
    {
      type: BlockType.CAROUSEL,
      content: {
        slides: [], // Empty - loaded from DB
        dataSource: {
          type: 'database',
          queryType: 'featured',
          limit: 12,
          titleField: 'name',
          descriptionField: 'shortDesc',
          imageField: 'thumbnail',
          badgeField: 'isFeatured'
        },
        slidesPerView: 3,
        autoPlay: true,
        // ... other settings
      }
    }
  ]
}
```

### 4. `/frontend/src/utils/templateThumbnails.ts`
**Thêm thumbnail**: `carousel-featured-products`
- SVG với 3 product cards
- Navigation arrows
- Slide indicators (dots)
- Product card structure: Image + Title + Description + CTA button

## 🎨 Template: Featured Products Carousel

### Đặc điểm
- **Tự động**: Load sản phẩm nổi bật từ database
- **Responsive**: 3 slides cùng lúc (desktop), tự động điều chỉnh
- **Interactive**: Auto-play 4s, có arrows + dots indicators
- **Dynamic Content**: 
  - Product name → Slide title
  - Product thumbnail → Slide image
  - Product shortDesc → Slide description
  - Product slug → CTA link (`/san-pham/{slug}`)
  - isFeatured flag → Badge "Nổi bật"

### Cách sử dụng
1. Mở Page Builder
2. Click "Templates" trong left panel
3. Tìm "Featured Products Carousel" (category: Custom)
4. Click để add vào page
5. Template tự động load 12 sản phẩm nổi bật đầu tiên

### Tùy chỉnh
- **Settings → Data Source**: 
  - Thay đổi query type (featured/products)
  - Điều chỉnh limit (số lượng products)
- **Settings → Content**: 
  - Thay đổi slides per view (1-5)
- **Settings → Behavior**: 
  - Bật/tắt auto-play
  - Điều chỉnh interval
  - Thay đổi animation

## 🔧 Technical Details

### GraphQL Integration
```typescript
// Featured products query
const { data } = useQuery(GET_FEATURED_PRODUCTS, {
  variables: { limit: 12 }
});

// All products query  
const { data } = useQuery(GET_PRODUCTS, {
  variables: { 
    input: { 
      limit: 10, 
      filters: {} 
    } 
  }
});
```

### Data Flow
```
Database → GraphQL Query → Apollo Client → useQuery Hook
→ Transform Function → dynamicSlides State → CarouselBlock Render
```

### Field Mapping
| Product Field | Slide Property | Default |
|---------------|----------------|---------|
| name | title | ✓ |
| shortDesc | description | - |
| thumbnail | image | ✓ |
| slug | cta.link | ✓ |
| isFeatured | badge | "Nổi bật" |
| isOnSale | badge | "Giảm giá" |

## 📝 Best Practices

### Khi dùng Database Mode
✅ **Nên**:
- Set limit hợp lý (8-12 products cho carousel)
- Đảm bảo products có thumbnail chất lượng
- Kiểm tra data trước khi publish
- Sử dụng featured products cho homepage

❌ **Không nên**:
- Set limit quá cao (>20) - ảnh hưởng performance
- Dùng cho products không có hình ảnh
- Edit slides trong database mode (không có effect)

### Khi dùng Manual Mode
✅ **Nên**:
- Dùng cho custom content, banner, promotion
- Tối ưu hình ảnh trước khi upload
- Đặt CTA links rõ ràng
- Test responsive trên mobile

## 🚀 Future Enhancements
- [ ] API Mode implementation với custom endpoints
- [ ] Advanced field mapping UI
- [ ] Filter configuration cho database queries
- [ ] Cache strategy cho GraphQL queries
- [ ] Image lazy loading optimization
- [ ] A/B testing support
- [ ] Analytics tracking integration

## ✅ Kết Quả

### Trước Update
- ❌ Chỉ hỗ trợ manual slides
- ❌ Phải add/edit từng slide thủ công
- ❌ Không sync với database
- ❌ Update content phải edit lại carousel

### Sau Update
- ✅ 3 data source modes (Manual/Database/API)
- ✅ Tự động load products từ database
- ✅ Real-time sync với product data
- ✅ Zero-config template "Featured Products Carousel"
- ✅ Smart UI controls theo context
- ✅ Loading states & refresh functionality

## 🎯 Use Cases

1. **Homepage**: Featured Products Carousel (12 products, auto-play)
2. **Category Page**: Products Carousel filtered by category
3. **Promotion**: Manual carousel với custom banners
4. **Landing Page**: Mixed - Manual slides + Database products
5. **Sale Page**: Database carousel with filters (isOnSale = true)

---

**Code Like Senior** ✨ | **Mobile First + Responsive + PWA** 📱 | **Dynamic GraphQL** 🚀
