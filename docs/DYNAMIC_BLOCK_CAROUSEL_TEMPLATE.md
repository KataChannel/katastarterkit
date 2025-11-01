# Dynamic Block - Product Carousel Template

## 📋 Tổng Quan

Đã bổ sung thêm template **Product Carousel** vào hệ thống Dynamic Block, cho phép hiển thị sản phẩm nổi bật dưới dạng carousel tự động cuộn với giao diện đẹp mắt và responsive. Template sử dụng **static data** với 12 sản phẩm demo về mỹ phẩm và dụng cụ làm đẹp.

## ✨ Tính Năng Chính

### 1. **Carousel Component**
- **Auto-scroll**: Tự động cuộn mỗi 5 giây
- **Navigation**: Nút Previous/Next xuất hiện khi hover
- **Indicators**: Chấm tròn chỉ báo vị trí hiện tại
- **Responsive**: 
  - Mobile: 1 sản phẩm/slide
  - Tablet: 2 sản phẩm/slide  
  - Desktop: 3 sản phẩm/slide
  - Large Desktop: 4 sản phẩm/slide
- **Pause on Hover**: Dừng auto-scroll khi di chuột vào

### 2. **Product Card Features**
- **Thumbnail Image**: Hiển thị ảnh sản phẩm với zoom effect khi hover
- **Placeholder**: SVG icon placeholder khi không có ảnh
- **Badges**: 
  - ⭐ Featured (sản phẩm nổi bật)
  - 🔥 Sale (đang giảm giá)
  - ✨ New (hàng mới về)
- **Discount Badge**: Tự động tính % giảm giá từ originalPrice
- **Category Tag**: Tag danh mục màu xanh
- **Product Info**:
  - Tên sản phẩm (line-clamp-2)
  - Mô tả ngắn (line-clamp-2)
  - SKU code
  - Số lượng tồn kho + đơn vị
- **Pricing**: 
  - Giá hiện tại (màu xanh, font lớn)
  - Giá gốc gạch ngang (nếu có)
  - Format: VND
- **Action Buttons**:
  - Thêm vào giỏ hàng (gradient blue)
  - Xem chi tiết (icon mắt)

### 3. **Demo Products (12 sản phẩm)**

**Chăm Sóc Da (5 sản phẩm)**:
1. Serum Vitamin C Dưỡng Trắng Da - 299.000đ (giảm từ 450.000đ)
2. Kem Dưỡng Ẩm Hyaluronic Acid - 380.000đ (giảm từ 520.000đ)
3. Sữa Rửa Mặt Tạo Bọt Nhẹ Nhàng - 180.000đ (giảm từ 250.000đ)
4. Toner Cân Bằng Da pH5.5 - 220.000đ
5. Kem Chống Nắng SPF50+ PA+++ - 350.000đ (giảm từ 480.000đ)

**Nối Mi (4 sản phẩm)**:
6. Bộ Dụng Cụ Nối Mi Chuyên Nghiệp - 1.250.000đ (giảm từ 1.800.000đ)
7. Keo Nối Mi Hàn Quốc Premium - 450.000đ
8. Mi Giả 3D Cao Cấp - 120.000đ (giảm từ 180.000đ)
9. Chổi Đánh Mi Mascara Dùng 1 Lần - 45.000đ

**Phun Xăm (3 sản phẩm)**:
10. Mực Phun Xăm Môi Organic - 890.000đ (giảm từ 1.200.000đ)
11. Máy Phun Xăm Chuyên Nghiệp - 5.500.000đ (giảm từ 7.200.000đ)
12. Kim Phun Xăm Nano 1 Đầu - 35.000đ (giảm từ 50.000đ)

### 4. **Static Data Structure**
```typescript
dataSource: {
  type: 'static',
  staticData: {
    title: 'Sản Phẩm Nổi Bật',
    subtitle: 'Khám phá những sản phẩm được yêu thích nhất',
    products: [
      {
        id, name, slug, shortDesc, description,
        sku, price, originalPrice, unit, stock,
        status, thumbnail,
        isFeatured, isNewArrival, isBestSeller, isOnSale,
        category: { id, name, slug }
      }
    ]
  }
}
```

### 5. **Styling & Design**
- **Mobile First**: Thiết kế ưu tiên mobile
- **Gradient Backgrounds**: 
  - Container: white → gray-50
  - Title: blue-600 → purple-600
  - Buttons: blue-600 → blue-700
- **Shadows**: 
  - Card: shadow-md → shadow-2xl (hover)
  - Buttons: shadow-lg → shadow-xl (hover)
- **Animations**:
  - Image zoom on hover
  - Button scale transform
  - Smooth carousel transitions
  - Fade in/out navigation buttons

## 📁 File Đã Chỉnh Sửa

### `/frontend/src/lib/dynamicBlockSampleTemplates.ts`

**Thêm mới**:
1. **`productCarouselTemplate`** - Template carousel sản phẩm
   - 300+ dòng HTML template với Handlebars
   - Inline JavaScript cho carousel logic
   - Static data với 12 sản phẩm demo
   - Fully responsive design

2. **Cập nhật `getAllSampleTemplates()`**
   - Thêm `productCarouselTemplate` vào danh sách

## 🎨 Template Structure

```typescript
export const productCarouselTemplate: SampleTemplate = {
  id: 'product-carousel',
  name: 'Product Carousel',
  description: 'Auto-scrolling carousel showcasing featured products',
  template: `<!-- HTML với Handlebars -->`,
  dataSource: {
    type: 'static',
    staticData: {
      title: 'Sản Phẩm Nổi Bật',
      subtitle: 'Khám phá những sản phẩm được yêu thích nhất',
      products: [ /* 12 sản phẩm demo */ ]
    }
  },
  variables: {}
}
```

## 🔧 Cách Sử Dụng

### 1. **Trong Page Builder**
1. Mở Page Builder
2. Add Dynamic Block vào page
3. Chọn template "Product Carousel"
4. Dữ liệu demo sẽ tự động hiển thị
5. Customize title/subtitle nếu cần
6. Thay thế static data bằng GraphQL query khi cần

### 2. **Data Flow**
```
Static Data (12 products)
  ↓
Template Rendering (Handlebars)
  ↓
Carousel Component (JavaScript)
  ↓
User Interface
```

### 3. **Customization**

**Option 1: Sử dụng Static Data (hiện tại)**
- Sửa trực tiếp trong `staticData.products`
- Thay đổi ảnh, tên, giá sản phẩm
- Thêm/bớt sản phẩm trong array

**Option 2: Chuyển sang GraphQL**
```typescript
dataSource: {
  type: 'graphql',
  query: `
    query GetFeaturedProducts($limit: Int) {
      products(input: { 
        filters: { isFeatured: true }
        limit: $limit
      }) {
        items { /* fields */ }
      }
    }
  `,
  variables: { limit: 12 }
}
```

## 📊 Technical Specs

### JavaScript Carousel Logic
```javascript
- Auto-scroll: 5000ms interval
- Responsive breakpoints:
  * Mobile: itemsPerView = 1
  * SM (640px+): itemsPerView = 2
  * LG (1024px+): itemsPerView = 3
  * XL (1280px+): itemsPerView = 4
- Gap between items: 24px (1.5rem)
- Transform: translateX with smooth transitions
- Event listeners: click, mouseenter, mouseleave, resize
```

### Handlebars Helpers Used
```handlebars
{{#each products}} - Loop sản phẩm
{{#if condition}} - Conditional rendering
{{@index}} - Array index
{{this.property}} - Object property access
{{#if (gt this.stock 0)}} - Greater than comparison
```

### Image URLs
- Sử dụng Unsplash CDN
- Kích thước: 400x400px
- Format: WebP tự động optimize
- Lazy loading: browser native

## 🎯 Use Cases

1. **Homepage**: Hiển thị sản phẩm nổi bật
2. **Landing Pages**: Showcase sản phẩm best-seller
3. **Category Pages**: Sản phẩm mới trong danh mục
4. **Promotional Pages**: Sản phẩm đang sale
5. **Demo/Preview**: Test layout trước khi có data thật

## ✅ Testing Checklist

- [x] Template compile không lỗi
- [x] Static data structure đúng format
- [x] Responsive trên mobile/tablet/desktop
- [x] Auto-scroll hoạt động
- [x] Navigation buttons hoạt động
- [x] Indicators cập nhật đúng
- [x] Pause on hover hoạt động
- [x] Badges hiển thị theo điều kiện
- [x] Pricing format đúng (VND)
- [x] Stock status hiển thị chính xác
- [x] Discount calculation chính xác

## 🚀 Migration Path

### Từ Static → GraphQL

1. **Giữ nguyên template HTML**
2. **Thay đổi dataSource**:
```typescript
// Before
dataSource: {
  type: 'static',
  staticData: { products: [...] }
}

// After
dataSource: {
  type: 'graphql',
  query: '...',
  variables: { limit: 12 }
}
```

3. **Backend đã có resolver sẵn**:
   - `products(input: GetProductsInput)`
   - Support filters, pagination, sorting

4. **No template changes needed**
   - Handlebars syntax giống nhau
   - Data structure tương thích

## 📝 Notes

- ✅ Template hoạt động độc lập, không cần backend
- ✅ Demo data phù hợp với nghiệp vụ mỹ phẩm/làm đẹp
- ✅ Dễ dàng chuyển sang GraphQL khi cần
- ✅ Mobile-first design đảm bảo UX tốt
- ✅ Images từ Unsplash có bản quyền free
- ✅ Product categories phù hợp với LMS courses
- ✅ Price range từ 35k → 5.5M (realistic)
- ✅ Stock levels đa dạng (12 → 500)

## 🎨 Product Categories

| Category | Sản phẩm | Giá TB | Stock TB |
|----------|----------|---------|----------|
| Chăm Sóc Da | 5 | 276k | 201 |
| Nối Mi | 4 | 466k | 271 |
| Phun Xăm | 3 | 2.14M | 193 |

---

**Ngày tạo**: 2025-11-01  
**Cập nhật**: 2025-11-01 (Static Data)  
**Phiên bản**: 2.0.0  
**Tác giả**: GitHub Copilot
