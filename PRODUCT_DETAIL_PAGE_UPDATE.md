# Cập Nhật Trang Chi Tiết Sản Phẩm `/san-pham/[slug]`

## 📅 Ngày cập nhật: 6/11/2025

## ✅ Đã Hoàn Thành

### 1. **Cập nhật GraphQL Query GET_PRODUCT_BY_SLUG**

**File:** `/frontend/src/graphql/ecommerce.queries.ts`

**Thêm các fields từ database:**
```graphql
query GetProductBySlug($slug: String!) {
  productBySlug(slug: $slug) {
    # Thông tin cơ bản
    id, name, slug, description, shortDesc
    
    # Giá cả
    price, originalPrice, costPrice
    discountPercentage, profitMargin
    
    # Kho hàng
    sku, barcode, stock, minStock, maxStock
    
    # Chi tiết sản phẩm
    unit (KG/G/BUNDLE/PIECE/BAG/BOX)
    weight (gram)
    origin (Xuất xứ)
    status (DRAFT/ACTIVE/INACTIVE/OUT_OF_STOCK/DISCONTINUED)
    
    # Hình ảnh
    thumbnail (ảnh đại diện)
    images { # Mảng hình ảnh
      id, url, alt, title, isPrimary, order
    }
    
    # Phân loại sản phẩm
    variants {
      id, name, sku, barcode, price, stock
      attributes (JSON)
      isActive, order
    }
    
    # Thuộc tính (JSON)
    attributes (VD: organic, pesticide_free, harvest_date)
    
    # Category
    category {
      id, name, slug, description, image
    }
    
    # SEO
    metaTitle, metaDescription, metaKeywords
    
    # Display
    isFeatured, isNewArrival, isBestSeller, isOnSale
    displayOrder
    
    # Thống kê
    viewCount (lượt xem)
    soldCount (đã bán)
    
    # Timestamps
    createdAt, updatedAt, publishedAt
  }
}
```

---

### 2. **Cập nhật Product Detail Page Component**

**File:** `/frontend/src/app/(website)/san-pham/[slug]/page.tsx`

#### **Thay đổi chính:**

**A. Hiển thị hình ảnh:**
```typescript
// ✅ Sử dụng images từ database
const productImages = product.images?.sort((a, b) => a.order - b.order)
  .map(img => img.url) || [];
const images = product.thumbnail 
  ? [product.thumbnail, ...productImages]
  : productImages;

// ✅ Hiển thị placeholder nếu không có ảnh
{images.length > 0 ? (
  <ProductImage src={images[selectedImage]} ... />
) : (
  <div className="flex items-center justify-center">
    <span className="text-gray-400">Chưa có hình ảnh</span>
  </div>
)}
```

**B. Badges sản phẩm:**
```tsx
{discountPercent > 0 && <span>-{discountPercent}%</span>}
{product.isBestSeller && <span>Bán chạy</span>}
{product.isNewArrival && <span>Mới</span>}
```

**C. Thông tin sản phẩm:**
```tsx
{/* Thống kê */}
<div>
  {product.viewCount || 0} lượt xem
  Đã bán: {product.soldCount || 0}
</div>

{/* Thuộc tính cơ bản */}
{product.sku && <span>SKU: {product.sku}</span>}
{product.origin && <span>Xuất xứ: {product.origin}</span>}
{product.unit && <span>Đơn vị: {product.unit}</span>}
{product.weight && <span>Trọng lượng: {product.weight}g</span>}
```

**D. Giá và giảm giá:**
```tsx
<div className="bg-gray-50 rounded-lg p-4">
  <span className="text-3xl font-bold text-blue-600">
    {formatPrice(effectivePrice)}
  </span>
  {product.originalPrice > product.price && (
    <>
      <span className="line-through">
        {formatPrice(product.originalPrice)}
      </span>
      <span className="text-red-600">
        Tiết kiệm {formatPrice(product.originalPrice - product.price)}
      </span>
    </>
  )}
  {product.profitMargin && (
    <p>Lợi nhuận ước tính: {product.profitMargin.toFixed(1)}%</p>
  )}
</div>
```

**E. Mô tả ngắn:**
```tsx
{product.shortDesc && (
  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
    <p>{product.shortDesc}</p>
  </div>
)}
```

**F. Thuộc tính sản phẩm (JSON attributes):**
```tsx
{product.attributes && Object.keys(product.attributes).length > 0 && (
  <div className="mb-6">
    <h3>Đặc điểm nổi bật:</h3>
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(product.attributes).map(([key, value]) => (
        <div key={key}>
          <span className="text-green-600">✓</span>
          {key}: <strong>{String(value)}</strong>
        </div>
      ))}
    </div>
  </div>
)}
```

**G. Phân loại sản phẩm (Variants):**
```tsx
{product.variants?.map((variant) => (
  <button
    onClick={() => setSelectedVariant(variant.id)}
    disabled={variant.stock === 0 || !variant.isActive}
  >
    <div>
      <span>{variant.name}</span>
      {variant.sku && <span className="text-xs">SKU: {variant.sku}</span>}
      {variant.price !== product.price && (
        <span className="text-xs text-blue-600">
          {formatPrice(variant.price)}
        </span>
      )}
    </div>
    {variant.stock === 0 && <span>(Hết hàng)</span>}
  </button>
))}
```

**H. Tab Thông số kỹ thuật:**
```tsx
{activeTab === 'specifications' && (
  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {product.sku && <div>Mã SKU: {product.sku}</div>}
    {product.barcode && <div>Mã vạch: {product.barcode}</div>}
    {product.origin && <div>Xuất xứ: {product.origin}</div>}
    {product.unit && <div>Đơn vị tính: {product.unit}</div>}
    {product.weight && <div>Trọng lượng: {product.weight}g</div>}
    <div>Tồn kho: {product.stock} {product.unit}</div>
    {product.minStock && <div>Tồn kho tối thiểu: {product.minStock}</div>}
    
    {/* Hiển thị attributes từ JSON */}
    {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
      <div key={key}>{key}: {String(value)}</div>
    ))}
  </dl>
)}
```

**I. Tab Reviews - Thống kê:**
```tsx
{activeTab === 'reviews' && (
  <div>
    <p>Chức năng đánh giá đang được phát triển</p>
    <div className="bg-blue-50 rounded-lg p-4">
      <strong>Thống kê:</strong>
      <ul>
        <li>Lượt xem: {product.viewCount || 0}</li>
        <li>Đã bán: {product.soldCount || 0}</li>
        <li>Còn lại: {product.stock}</li>
      </ul>
    </div>
  </div>
)}
```

**J. Breadcrumb & Links:**
```tsx
// ✅ Sửa link từ /products → /san-pham
<Link href="/san-pham">Sản phẩm</Link>
<Link href={`/san-pham?category=${product.category.slug}`}>
  {product.category.name}
</Link>
```

---

## 📊 So sánh Trước/Sau

### **Trước khi cập nhật:**
- ❌ Sử dụng fields không tồn tại: `featuredImage`, `finalPrice`, `compareAtPrice`, `rating`, `reviewCount`, `relatedProducts`
- ❌ Không hiển thị: SKU, barcode, origin, unit, weight, attributes, variants details
- ❌ Không có badges: Best Seller, New Arrival
- ❌ Không hiển thị statistics: viewCount, soldCount
- ❌ Link sai: `/products` thay vì `/san-pham`

### **Sau khi cập nhật:**
- ✅ Sử dụng đúng fields từ database schema
- ✅ Hiển thị đầy đủ: SKU, origin, unit, weight, stock, attributes
- ✅ Badges động: Giảm giá %, Bán chạy, Sản phẩm mới
- ✅ Thống kê: Lượt xem, Đã bán, Tồn kho
- ✅ Variants chi tiết: Tên, SKU, Giá, Tồn kho, Trạng thái
- ✅ Attributes JSON hiển thị động
- ✅ Short description với styling
- ✅ Profit margin hiển thị
- ✅ Links đúng: `/san-pham`
- ✅ Placeholder cho ảnh trống

---

## 🎨 UI/UX Improvements

1. **Badges hệ thống:**
   - 🔴 Giảm giá % (đỏ, góc phải trên)
   - 🟡 Bán chạy (vàng, góc trái trên)
   - 🟢 Sản phẩm mới (xanh lá, bên dưới "Bán chạy")

2. **Info Pills:**
   - SKU, Xuất xứ, Đơn vị, Trọng lượng
   - Màu xám, rounded, inline

3. **Đặc điểm nổi bật:**
   - Checkbox xanh ✓
   - Grid 2 cột responsive
   - Dữ liệu từ `attributes` JSON

4. **Variants:**
   - Hiển thị SKU nhỏ
   - Giá riêng nếu khác giá gốc
   - Disabled nếu hết hàng hoặc inactive

5. **Thống kê:**
   - Lượt xem | Đã bán
   - Hiển thị trong tab Reviews

---

## 🔧 Technical Details

### **Database Schema (Product Model):**
```prisma
model Product {
  # Giá
  price         Float  @map("giaban")
  originalPrice Float? @map("giagoc")
  costPrice     Float?
  
  # Kho
  stock       Int    @map("soluong")
  stockInWare Int?   @map("soluongkho")
  
  # Chi tiết
  unit   ProductUnit   # KG/G/BUNDLE/PIECE/BAG/BOX
  origin String?       # Đà Lạt, Lâm Đồng...
  weight Float?        # gram
  
  # Hình ảnh
  thumbnail String?           @map("hinhanh")
  images    ProductImage[]    # Array
  
  # Attributes
  attributes Json?  # {organic: true, pesticide_free: true, ...}
  
  # Variants
  variants ProductVariant[]
  
  # Stats
  viewCount Int @default(0)
  soldCount Int @default(0)
  
  # Flags
  isFeatured   Boolean
  isNewArrival Boolean
  isBestSeller Boolean
  isOnSale     Boolean
}
```

### **GraphQL Type:**
```typescript
@ObjectType()
export class ProductType {
  @Field(() => Float) price: number;
  @Field(() => Float, { nullable: true }) originalPrice?: number;
  @Field(() => Float, { nullable: true }) discountPercentage?: number;
  @Field(() => Float, { nullable: true }) profitMargin?: number;
  
  @Field(() => ProductUnit) unit: ProductUnit;
  @Field({ nullable: true }) origin?: string;
  @Field(() => Float, { nullable: true }) weight?: number;
  
  @Field({ nullable: true }) thumbnail?: string;
  @Field(() => [ProductImageType], { nullable: true }) images?: ProductImageType[];
  
  @Field(() => GraphQLJSON, { nullable: true }) attributes?: any;
  
  @Field(() => [ProductVariantType], { nullable: true }) variants?: ProductVariantType[];
  
  @Field(() => Int) viewCount: number;
  @Field(() => Int) soldCount: number;
  
  @Field() isFeatured: boolean;
  @Field() isNewArrival: boolean;
  @Field() isBestSeller: boolean;
  @Field() isOnSale: boolean;
}
```

---

## 🧪 Test Checklist

- [ ] Trang load thành công với slug hợp lệ
- [ ] Hiển thị đúng thumbnail và gallery images
- [ ] Badges hiển thị đúng (giảm giá, bán chạy, mới)
- [ ] Thông tin cơ bản: SKU, origin, unit, weight
- [ ] Giá hiển thị đúng (price, originalPrice, tiết kiệm)
- [ ] Attributes JSON hiển thị dynamic
- [ ] Variants hiển thị đầy đủ (name, SKU, price, stock)
- [ ] Variants disabled khi hết hàng hoặc inactive
- [ ] Short description hiển thị với border xanh
- [ ] Tab Description: HTML render đúng
- [ ] Tab Specifications: Tất cả fields hiển thị
- [ ] Tab Reviews: Thống kê hiển thị
- [ ] Breadcrumb links đúng (/san-pham)
- [ ] Add to cart hoạt động
- [ ] Quantity selector hoạt động
- [ ] Related products placeholder hiển thị

---

## 🚀 Deployment

```bash
# 1. Build frontend
./build-frontend.sh

# 2. Deploy
./deploy.sh

# 3. Verify
curl http://116.118.49.243:12001/san-pham/test-product-slug
```

---

## 📝 Notes

1. **Related Products:** Chưa implement query, hiện placeholder
2. **Reviews System:** Chưa có, hiện thông báo "Đang phát triển"
3. **Rating:** Default 4.0 stars, chờ review system
4. **Images:** Sắp xếp theo `order` field
5. **Variants:** Check `isActive` và `stock` trước khi enable
6. **Attributes:** Dynamic render từ JSON, support mọi key/value
7. **Profit Margin:** Hiển thị nếu có trong response

---

## ✅ Kết luận

Trang chi tiết sản phẩm đã được cập nhật hoàn toàn để:
- ✅ Sử dụng đúng các fields từ database Prisma schema
- ✅ Hiển thị đầy đủ thông tin sản phẩm (giá, kho, thuộc tính, phân loại)
- ✅ UI/UX cải thiện với badges, pills, thống kê
- ✅ GraphQL query tối ưu với tất cả fields cần thiết
- ✅ Xử lý edge cases (no image, no variants, out of stock)
- ✅ Links và routing đúng (/san-pham)

**Ready for testing!** 🎉
