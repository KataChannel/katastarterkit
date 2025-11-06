# CẬP NHẬT TRANG SẢN PHẨM - HIỂN THỊ ĐÚNG THUỘC TÍNH

## 📋 TỔNG QUAN

Cập nhật trang `/san-pham` để hiển thị đúng các thuộc tính sản phẩm từ database theo Prisma schema.

**Ngày:** November 6, 2025  
**File cập nhật:** `frontend/src/app/(website)/san-pham/page.tsx`

---

## ✅ CÁC THAY ĐỔI

### **1. Cập Nhật Hiển Thị Hình Ảnh**

**Trước:**
```tsx
src={product.featuredImage}
```

**Sau:**
```tsx
src={product.thumbnail}
```

**Lý do:** Prisma schema sử dụng field `thumbnail` thay vì `featuredImage`

---

### **2. Cập Nhật Discount Badge**

**Trước:**
```tsx
{product.discount > 0 && (
  <span>-{product.discount}%</span>
)}
```

**Sau:**
```tsx
{product.originalPrice && product.price < product.originalPrice && (
  <span>
    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
  </span>
)}
```

**Lý do:** Tính discount từ `price` và `originalPrice` (không có field `discount` riêng)

---

### **3. Thêm Badges Mới**

**Badges được thêm:**
- ✅ **HOT**: `isFeatured` (màu vàng)
- ✅ **MỚI**: `isNewArrival` (màu xanh lá)
- ✅ **BÁN CHẠY**: `isBestSeller` (màu tím)

---

### **4. Hiển Thị Category & SKU**

**Thêm:**
```tsx
<div className="flex items-center justify-between">
  <span>{product.category?.name}</span>
  {product.sku && <span>SKU: {product.sku}</span>}
</div>
```

---

### **5. Hiển Thị Xuất Xứ**

**Thêm:**
```tsx
{product.origin && (
  <p>📍 Xuất xứ: {product.origin}</p>
)}
```

**Ví dụ:** "📍 Xuất xứ: Đà Lạt, Lâm Đồng"

---

### **6. Hiển Thị Đơn Vị Tính**

**Thêm:**
```tsx
{product.unit && (
  <p>Đơn vị: {product.unit}</p>
)}
```

**Ví dụ:** "Đơn vị: KG" hoặc "Đơn vị: BAO"

---

### **7. Cập Nhật Hiển Thị Giá**

**Trước:**
```tsx
{formatPrice(product.finalPrice)}
{product.compareAtPrice > product.finalPrice && (
  <span>{formatPrice(product.compareAtPrice)}</span>
)}
```

**Sau:**
```tsx
{formatPrice(product.price)}
{product.originalPrice && product.price < product.originalPrice && (
  <span>{formatPrice(product.originalPrice)}</span>
)}
{/* Thêm giá theo đơn vị */}
{product.unit && (
  <div>{formatPrice(product.price)}/{product.unit}</div>
)}
```

**Ví dụ:** "250.000₫/KG"

---

### **8. Cập Nhật Stock Status**

**Trước:**
```tsx
{product.stock > 0 ? (
  <span>Còn hàng ({product.stock})</span>
) : (
  <span>Hết hàng</span>
)}
```

**Sau:**
```tsx
{product.stock > 0 ? (
  <div>
    <span>✓ Còn hàng</span>
    <span>({product.stock} {product.unit || 'sản phẩm'})</span>
  </div>
) : (
  <span>✗ Hết hàng</span>
)}
```

**Ví dụ:** "✓ Còn hàng (150 KG)"

---

### **9. Hiển Thị Product Attributes**

**Thêm mới:**
```tsx
{product.attributes && Object.keys(product.attributes).length > 0 && (
  <div className="flex flex-wrap gap-1">
    {Object.entries(product.attributes).slice(0, 3).map(([key, value]) => (
      value && (
        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
          {key === 'organic' && value ? '🌱 Hữu cơ' :
           key === 'pesticide_free' && value ? '🚫 Không thuốc' :
           key === 'fresh' && value ? '🍃 Tươi mới' :
           key}
        </span>
      )
    ))}
  </div>
)}
```

**Attributes hỗ trợ:**
- `organic`: Hiển thị "🌱 Hữu cơ"
- `pesticide_free`: Hiển thị "🚫 Không thuốc"
- `fresh`: Hiển thị "🍃 Tươi mới"
- Các attributes khác hiển thị tên gốc

---

### **10. Loại Bỏ Rating (Chưa có data)**

**Đã xóa:**
```tsx
{/* Rating - Chưa implement review system */}
<div className="flex items-center gap-1 mb-2">
  <Star ... />
</div>
```

**Lý do:** Database có bảng `ProductReview` nhưng chưa có data, sẽ implement sau.

---

## 🎨 UI/UX IMPROVEMENTS

### **Product Card Layout:**

```
┌─────────────────────────────┐
│ [Image with Badges]         │
│  - Discount badge (top-right)
│  - HOT badge (top-left)      │
│  - MỚI badge (left)          │
│  - BÁN CHẠY badge (left)     │
├─────────────────────────────┤
│ Product Name (2 lines max)  │
│ Category | SKU: XXX         │
│ 📍 Xuất xứ: Đà Lạt          │
│ Đơn vị: KG                  │
│                             │
│ 250.000₫  ̶3̶0̶0̶.̶0̶0̶0̶₫        │
│ 250.000₫/KG                 │
│                             │
│ ✓ Còn hàng (150 KG)         │
│                             │
│ [🌱 Hữu cơ] [🚫 Không thuốc] │
│                             │
│ [🛒 Thêm]        [♥]        │
└─────────────────────────────┘
```

---

## 📊 DATABASE FIELDS MAPPING

| Database Field | Display | Component |
|---------------|---------|-----------|
| `name` | Tên sản phẩm | Title |
| `thumbnail` | Hình ảnh | ProductImage |
| `price` | Giá bán | Main price |
| `originalPrice` | Giá gốc | Strikethrough |
| `category.name` | Danh mục | Category tag |
| `sku` | Mã SKU | SKU label |
| `origin` | Xuất xứ | Origin info |
| `unit` | Đơn vị | Unit label |
| `stock` | Tồn kho | Stock status |
| `isFeatured` | HOT badge | Yellow badge |
| `isNewArrival` | MỚI badge | Green badge |
| `isBestSeller` | BÁN CHẠY badge | Purple badge |
| `attributes` | Thuộc tính | Green pills |

---

## 🔧 PRISMA SCHEMA REFERENCE

### **Product Model:**

```prisma
model Product {
  id            String   @id @default(uuid())
  name          String   // Tên sản phẩm
  slug          String   @unique
  thumbnail     String?  // Ảnh đại diện
  
  // Pricing
  price         Float    @map("giaban")
  originalPrice Float?   @map("giagoc")
  
  // Details
  sku           String?  @unique
  stock         Int      @default(0) @map("soluong")
  unit          ProductUnit @default(KG) @map("dvt")
  origin        String?  // Xuất xứ
  
  // Category
  categoryId    String
  category      Category @relation(...)
  
  // Attributes (JSON)
  attributes    Json?
  
  // Flags
  isFeatured    Boolean @default(false)
  isNewArrival  Boolean @default(false)
  isBestSeller  Boolean @default(false)
  isOnSale      Boolean @default(false)
}
```

---

## 🧪 TESTING

### **Test Cases:**

1. **Hiển thị sản phẩm có đầy đủ thông tin:**
   - ✅ Thumbnail
   - ✅ Name
   - ✅ Price + Original Price
   - ✅ Category
   - ✅ SKU
   - ✅ Origin
   - ✅ Unit
   - ✅ Stock
   - ✅ Attributes

2. **Hiển thị sản phẩm thiếu một số thông tin:**
   - ✅ Không có originalPrice → Không hiển thị giá gạch
   - ✅ Không có SKU → Không hiển thị SKU label
   - ✅ Không có origin → Không hiển thị xuất xứ
   - ✅ Không có attributes → Không hiển thị pills

3. **Badges:**
   - ✅ isFeatured = true → HOT badge
   - ✅ isNewArrival = true → MỚI badge
   - ✅ isBestSeller = true → BÁN CHẠY badge
   - ✅ Discount > 0 → Discount percentage badge

4. **Stock Status:**
   - ✅ stock > 0 → "✓ Còn hàng (X unit)"
   - ✅ stock = 0 → "✗ Hết hàng" + disabled add button

---

## 📝 NOTES

### **Attributes JSON Format:**

```json
{
  "organic": true,
  "pesticide_free": true,
  "fresh": true,
  "harvest_date": "2025-01-08",
  "certification": "VietGAP"
}
```

**Hiển thị:**
- `organic: true` → 🌱 Hữu cơ
- `pesticide_free: true` → 🚫 Không thuốc
- `fresh: true` → 🍃 Tươi mới
- Other keys → Display key name

**Limit:** Chỉ hiển thị 3 attributes đầu tiên để tránh card quá dài.

---

## 🚀 NEXT STEPS

### **To Do:**

1. ✅ Cập nhật trang danh sách sản phẩm
2. ⏳ Tạo trang chi tiết sản phẩm `/san-pham/[slug]`
3. ⏳ Implement Review System
4. ⏳ Implement Variant Selection (sizes, colors)
5. ⏳ Add to Cart functionality
6. ⏳ Wishlist functionality

---

## 🔗 RELATED FILES

- `frontend/src/app/(website)/san-pham/page.tsx` - Trang danh sách (✅ UPDATED)
- `frontend/src/graphql/ecommerce.queries.ts` - GraphQL queries
- `backend/prisma/schema.prisma` - Database schema
- `backend/src/graphql/types/product.type.ts` - GraphQL types

---

**✅ CẬP NHẬT HOÀN TẤT!**

Trang `/san-pham` giờ hiển thị đúng tất cả các thuộc tính từ database.
