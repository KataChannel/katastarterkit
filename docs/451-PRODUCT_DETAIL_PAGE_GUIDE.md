# 📘 Hướng Dẫn Sử Dụng Product Detail Page Demo

## 🎯 Tổng Quan

Product Detail Page Demo là một trang mẫu động hoàn chỉnh được tạo trong **PageBuilder** để hiển thị chi tiết sản phẩm với:
- ✅ Dynamic slug từ URL
- ✅ Dữ liệu từ database qua GraphQL
- ✅ Template variables mapping
- ✅ Fully editable trong PageBuilder

---

## 🚀 Bước 1: Truy Cập Page Builder

### Cách 1: Từ giao diện
1. Mở browser: `http://localhost:13000/page-builder`
2. Bạn sẽ thấy danh sách các page

### Cách 2: Trực tiếp
```
URL: http://localhost:13000/page-builder
```

---

## 📄 Bước 2: Tìm Product Detail Page

### Trong Page Builder:
1. Tìm page có tên **"Product Detail"**
2. Click vào page để mở
3. Bạn sẽ thấy 3 blocks:
   - 🎨 **Hero Section** (HERO block)
   - 📋 **Details Section** (TEXT block)
   - 🔗 **Related Products** (GRID block)

---

## 🎨 Bước 3: Chỉnh Sửa Blocks

### Cách Chỉnh Sửa Block:

1. **Hover vào block** bạn muốn sửa
2. Click nút **⚙️ Settings** (góc phải)
3. Dialog sẽ mở ra với 3 cột:
   - **Cột Trái**: Configuration (Data Source, Repeater)
   - **Cột Giữa**: Template HTML Editor
   - **Cột Phải**: Live Preview

---

## 🔧 Bước 4: Hiểu Cấu Trúc Mỗi Block

### A. Hero Block (Block 1)

**Purpose**: Hiển thị thông tin chính sản phẩm

**Template Variables**:
```
{{productName}}          → Tên sản phẩm
{{productDescription}}   → Mô tả sản phẩm
{{productPrice}}         → Giá bán
{{productOriginalPrice}} → Giá gốc
{{productImage}}         → URL ảnh sản phẩm
{{productSku}}           → Mã SKU
{{productWeight}}        → Trọng lượng
```

**GraphQL Query**:
```graphql
query GetProduct($slug: String!) {
  getProductBySlug(slug: $slug) {
    id
    name
    slug
    description
    price
    originalPrice
    sku
    weight
    images {
      id
      url
      alt
      isPrimary
    }
  }
}
```

**Variable Mappings**:
- `productName` → `name`
- `productPrice` → `price`
- `productImage` → `images[0].url`
- etc.

---

### B. Details Block (Block 2)

**Purpose**: Hiển thị chi tiết sản phẩm (SKU, Weight, Stock)

**Template Variables**:
```
{{productSku}}     → Mã SKU
{{productWeight}}  → Trọng lượng
```

**GraphQL Query**:
```graphql
query GetProduct($slug: String!) {
  getProductBySlug(slug: $slug) {
    sku
    weight
  }
}
```

---

### C. Related Products Block (Block 3)

**Purpose**: Hiển thị sản phẩm liên quan

**Template Variables (trong loop)**:
```
{{#each relatedProducts}}
  {{name}}              → Tên sản phẩm
  {{description}}       → Mô tả
  {{price}}             → Giá
  {{image}}             → Ảnh
{{/each}}
```

**GraphQL Query**:
```graphql
query GetAllProducts {
  getProducts(limit: 3) {
    items {
      id
      name
      slug
      description
      price
      images {
        url
        isPrimary
      }
    }
  }
}
```

---

## 🧪 Bước 5: Test Demo

### Test URLs:
```
http://localhost:13000/product-detail/macbook-pro-m3
http://localhost:13000/product-detail/iphone-15-pro
http://localhost:13000/product-detail/airpods-pro
```

### Tại mỗi URL, bạn sẽ thấy:
- ✅ Ảnh sản phẩm
- ✅ Tên sản phẩm
- ✅ Giá tiền
- ✅ Mô tả
- ✅ SKU, Weight
- ✅ Sản phẩm liên quan

---

## 🛠️ Bước 6: Chỉnh Sửa Template

### Ví dụ: Thêm thông tin mới

**Bước 1**: Mở PageBuilder → Product Detail → Click Settings trên Hero Block

**Bước 2**: Trong cột Giữa, tìm Template HTML, thêm dòng:
```html
<p class="text-sm text-gray-500">Availability: In Stock ✅</p>
```

**Bước 3**: Xem preview ở cột Phải → Click "Save Changes" ✅

---

## 📝 Bước 7: Thêm Variable Mới

### Ví dụ: Hiển thị Barcode

**Bước 1**: Trong Dialog Settings, tìm **"Static Data (JSON)"** (nếu dùng static data)

hoặc chỉnh sửa **GraphQL Query** để thêm field:
```graphql
query GetProduct($slug: String!) {
  getProductBySlug(slug: $slug) {
    id
    name
    description
    price
    originalPrice
    sku
    weight
    barcode  # 👈 Thêm field này
    images {
      id
      url
      alt
      isPrimary
    }
  }
}
```

**Bước 2**: Thêm Variable Mapping:
```
productBarcode → barcode
```

**Bước 3**: Dùng trong template:
```html
<p>Barcode: {{productBarcode}}</p>
```

---

## 🔄 Bước 8: Hiểu Cơ Chế Data Flow

```
User visits URL
    ↓
/product-detail/[slug]
    ↓
Page Builder detects [slug]
    ↓
Passes slug to GraphQL query
    ↓
getProductBySlug(slug: "macbook-pro-m3")
    ↓
Database returns product data
    ↓
Template variables replaced
    ↓
HTML rendered on screen ✅
```

---

## 💡 Bước 9: Tips & Tricks

### Tip 1: Live Preview
Mỗi khi bạn sửa Template HTML, Live Preview bên phải tự động cập nhật ✨

### Tip 2: Variable Debugging
Nếu biến không hiển thị:
1. Check xem GraphQL query có field đó không
2. Check xem Variable Mapping có đúng không
3. Xem Live Preview để debug

### Tip 3: Thêm CSS Classes
Dùng TailwindCSS classes để style:
```html
<div class="bg-blue-50 p-6 rounded-lg shadow">
  <h3 class="text-2xl font-bold text-blue-600">{{productName}}</h3>
</div>
```

### Tip 4: Conditional Rendering
```html
{{#if productOriginalPrice}}
  <span class="line-through text-gray-400">${{productOriginalPrice}}</span>
{{/if}}
```

### Tip 5: Loops
```html
{{#each relatedProducts}}
  <div class="bg-white rounded-lg p-4">
    <img src="{{image}}" />
    <h3>{{name}}</h3>
    <p>${{price}}</p>
  </div>
{{/each}}
```

---

## 🎓 Bước 10: Advanced - Thêm Block Mới

### Thêm Reviews Section

1. **Click "Add Block"** di cuối page
2. Chọn **"Dynamic Block"**
3. Configure:
   - **Data Source**: GraphQL
   - **Query**: 
   ```graphql
   query GetProductReviews($productId: String!) {
     getProductReviews(productId: $productId) {
       id
       rating
       comment
       author
     }
   }
   ```
   - **Template**:
   ```html
   {{#each reviews}}
   <div class="border-l-4 border-yellow-400 p-4 mb-4">
     <div class="flex gap-1 mb-2">
       {{#repeat rating}}⭐{{/repeat}}
     </div>
     <p class="italic mb-2">"{{comment}}"</p>
     <p class="text-sm text-gray-600">— {{author}}</p>
   </div>
   {{/each}}
   ```

4. Click **"Save Changes"** ✅

---

## 🐛 Troubleshooting

### Problem: Data không hiển thị
**Solution**:
1. Check GraphQL query lỗi (console network)
2. Check Variable Mapping đúng chưa
3. Reload page

### Problem: Template syntax error
**Solution**:
1. Check đóng mở ngoặc `{{` `}}`
2. Check tên variable đúng chưa
3. Xem error trong Live Preview

### Problem: Style không apply
**Solution**:
1. Use full TailwindCSS classes
2. Kiểm tra CSS conflict
3. Inspect element với DevTools

---

## 📚 Tài Liệu Liên Quan

- **Template Syntax**: `{{variable}}`, `{{#each}}`, `{{#if}}`
- **GraphQL Queries**: `/backend/src/schema.gql`
- **PageBuilder API**: `/frontend/src/types/page-builder.ts`
- **Demo Data**: Product, ProductImage được tạo bởi seed

---

## ✨ Kết Luận

Product Detail Page Demo cho thấy:
- ✅ Cách làm page động với slug
- ✅ Cách fetch data từ database
- ✅ Cách map variables
- ✅ Cách edit trong PageBuilder
- ✅ Live preview realtime

Bây giờ bạn có thể tạo các page demo khác tương tự! 🚀
