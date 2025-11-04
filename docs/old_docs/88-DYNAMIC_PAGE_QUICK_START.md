# 🚀 Dynamic Page Template - Quick Start Guide

## 📖 Cách Tạo 1 Trang Template Cho Nhiều Sản Phẩm

### Bước 1: Mở Page Builder

```
URL: http://localhost:12000/admin/pages/builder
```

### Bước 2: Tạo Page Mới

Click **"Create New Page"** hoặc **"Tạo Trang Mới"**

### Bước 3: Điền Thông Tin Cơ Bản

**Tab "General":**

```
Title: Product Template
Slug: /product/:productSlug
Status: Published
```

⚠️ **Chú ý**: Slug phải có dạng `/product/:productSlug` (dấu `:` là bắt buộc)

### Bước 4: Bật Dynamic Page Template

Kéo xuống dưới trong tab **General**, tìm:

```
☑️ Dynamic Page Template
   Use this page as a template for multiple items
```

**Bật switch này lên!**

### Bước 5: Cấu Hình Dynamic

Sau khi bật, sẽ xuất hiện form:

```
Data Source: [Product ▼]
  - Product (Sản phẩm)
  - Blog Post (Bài viết)
  - Category (Danh mục)
  - Custom API

URL Pattern: /product/:productSlug

Slug Field Name: slug
```

### Bước 6: Thiết Kế Layout

Click tab **"Blocks"**, thêm các blocks:

**Block 1: Image (Hero Image)**
- Type: IMAGE
- Drag vào canvas
- Nhớ ID của block này (VD: `clx123abc`)

**Block 2: Text (Product Title)**
- Type: TEXT
- Style: Heading 1, Bold, 32px
- ID: `clx456def`

**Block 3: Text (Price)**
- Type: TEXT
- Style: Red, 24px, Bold
- ID: `clx789ghi`

**Block 4: Text (Description)**
- Type: TEXT
- Style: Normal, 16px
- ID: `clx101jkl`

### Bước 7: Cấu Hình Data Bindings

Quay lại tab **General** → kéo xuống phần **Data Bindings**

Click **"Add Binding"** cho mỗi block:

#### Binding 1: Hero Image
```
Block: [IMAGE - clx123abc ▼]
Source Field: images[0].url
Target Property: content.src
```

#### Binding 2: Product Title
```
Block: [TEXT - clx456def ▼]
Source Field: name
Target Property: content.html
```

#### Binding 3: Price
```
Block: [TEXT - clx789ghi ▼]
Source Field: price
Target Property: content.html
Transform: formatCurrency
```

#### Binding 4: Description
```
Block: [TEXT - clx101jkl ▼]
Source Field: description
Target Property: content.html
```

### Bước 8: Save Template

Click **"Save"** hoặc **"Lưu"** ở góc trên

✅ Xong! Template đã được tạo.

---

## 🧪 Cách Test

### 1. Kiểm Tra Products Có Sẵn

Vào database hoặc admin panel, xem danh sách products:

```
Product 1: 
  - Name: Giày Nike Air Max
  - Slug: giay-nike-air-max
  - Price: 2500000
  
Product 2:
  - Name: Giày Adidas Ultra Boost
  - Slug: giay-adidas-ultra
  - Price: 3200000
```

### 2. Truy Cập URLs

**Sản phẩm 1:**
```
http://localhost:12000/product/giay-nike-air-max
```

**Kết quả mong đợi:**
- ✅ Hero image: Ảnh giày Nike
- ✅ Title: "Giày Nike Air Max"
- ✅ Price: "2.500.000 ₫"
- ✅ Description: Mô tả sản phẩm Nike

**Sản phẩm 2:**
```
http://localhost:12000/product/giay-adidas-ultra
```

**Kết quả mong đợi:**
- ✅ Hero image: Ảnh giày Adidas
- ✅ Title: "Giày Adidas Ultra Boost"
- ✅ Price: "3.200.000 ₫"
- ✅ Description: Mô tả sản phẩm Adidas

**CÙNG 1 TEMPLATE** - Khác nhau chỉ là DATA!

---

## 📊 Source Field Reference

### Product Fields (Sản Phẩm)

| Source Field | Ví Dụ Giá Trị | Mô Tả |
|--------------|---------------|-------|
| `name` | "Giày Nike Air Max" | Tên sản phẩm |
| `slug` | "giay-nike-air-max" | URL slug |
| `description` | "Giày thể thao cao cấp..." | Mô tả chi tiết |
| `price` | 2500000 | Giá bán |
| `compareAtPrice` | 3000000 | Giá gốc (trước giảm) |
| `stock` | 50 | Số lượng tồn kho |
| `sku` | "NIKE-001" | Mã SKU |
| `images[0].url` | "https://..." | Ảnh đầu tiên |
| `images[0].alt` | "Nike Air Max" | Alt text ảnh |
| `category.name` | "Giày thể thao" | Tên danh mục |

### Transform Functions

| Transform | Input | Output | Dùng Cho |
|-----------|-------|--------|----------|
| `formatCurrency` | 2500000 | "2.500.000 ₫" | Giá tiền |
| `formatDate` | "2024-01-15" | "15/01/2024" | Ngày tháng |
| `uppercase` | "hello" | "HELLO" | Chữ in hoa |
| `lowercase` | "HELLO" | "hello" | Chữ thường |

### Target Property Reference

| Target Property | Block Type | Mô Tả |
|----------------|-----------|-------|
| `content.html` | TEXT | Nội dung text |
| `content.src` | IMAGE | Đường dẫn ảnh |
| `content.alt` | IMAGE | Alt text ảnh |
| `content.url` | VIDEO | Link video |
| `content.text` | BUTTON | Text nút |
| `content.link` | BUTTON | Link nút |

---

## 🎨 Ví Dụ Advanced

### Example 1: Product Card với Button

**Blocks:**
1. Image - Hero (ID: `hero-img`)
2. Text - Title (ID: `title`)
3. Text - Price (ID: `price`)
4. Text - Stock (ID: `stock`)
5. Button - Add to Cart (ID: `btn-cart`)

**Data Bindings:**
```
hero-img:
  - sourceField: images[0].url
  - targetProperty: content.src

title:
  - sourceField: name
  - targetProperty: content.html
  
price:
  - sourceField: price
  - targetProperty: content.html
  - transform: formatCurrency

stock:
  - sourceField: stock
  - targetProperty: content.html

btn-cart:
  - sourceField: id
  - targetProperty: content.productId
```

### Example 2: Blog Post Template

**Settings:**
```
Title: Blog Template
Slug: /blog/:postSlug
Data Source: Post
```

**Bindings:**
```
post-title:
  - sourceField: title
  - targetProperty: content.html

post-author:
  - sourceField: author.name
  - targetProperty: content.html

post-date:
  - sourceField: publishedAt
  - targetProperty: content.html
  - transform: formatDate

post-content:
  - sourceField: content
  - targetProperty: content.html

post-image:
  - sourceField: featuredImage.url
  - targetProperty: content.src
```

---

## ❓ Troubleshooting

### Lỗi: "Page template not found"

**Nguyên nhân:** Chưa tạo template hoặc slug sai

**Giải pháp:**
1. Kiểm tra slug template: phải là `/product/:productSlug`
2. Kiểm tra status: phải là **PUBLISHED**
3. Kiểm tra toggle "Dynamic Page Template": phải bật

### Lỗi: "Product not found"

**Nguyên nhân:** Product không tồn tại trong database

**Giải pháp:**
1. Vào admin panel → Products
2. Kiểm tra product có slug khớp không
3. Kiểm tra product đã publish chưa

### Lỗi: Blocks không hiển thị data

**Nguyên nhân:** Data binding sai

**Kiểm tra:**
1. **Block ID đúng không?** Copy chính xác từ block
2. **Source Field đúng không?** Xem reference table
3. **Target Property đúng không?** `content.html` hoặc `content.src`
4. **Product có field đó không?** Xem trong database

**Debug:**
```
F12 → Console → Check errors
Network → GraphQL → Check response data
```

---

## 💡 Tips & Tricks

### Tip 1: Copy Block ID Nhanh

1. Click vào block trong canvas
2. Xem sidebar bên phải → "Block ID"
3. Copy & paste vào Data Bindings

### Tip 2: Test Data Bindings

Tạo 1 product test với đầy đủ thông tin:
```
Name: Test Product
Slug: test-product
Price: 100000
Description: Test description
Images: Upload 1 ảnh
```

Visit: `/product/test-product` để test

### Tip 3: Nested Fields

Nếu cần lấy data lồng nhau:
```
category.name           → Tên danh mục
category.parent.name    → Tên danh mục cha
author.profile.avatar   → Avatar tác giả
```

### Tip 4: Array Access

Lấy item trong array:
```
images[0].url    → Ảnh đầu tiên
images[1].url    → Ảnh thứ 2
tags[0]          → Tag đầu tiên
```

---

## 🎓 Best Practices

### ✅ DO

- Đặt slug pattern rõ ràng: `/product/:slug`, `/blog/:slug`
- Test với ít nhất 3 sản phẩm khác nhau
- Sử dụng transform cho giá tiền (`formatCurrency`)
- Đặt tên block ID có ý nghĩa
- Publish template sau khi test xong

### ❌ DON'T

- Không dùng slug cố định: `/product/nike` (sai)
- Không quên dấu `:` trong slug pattern
- Không bind sai target property (TEXT block dùng `content.src` sẽ lỗi)
- Không quên set Status = PUBLISHED
- Không dùng source field không tồn tại

---

## 📞 Support

**Nếu gặp vấn đề:**

1. Xem log Console (F12)
2. Xem Network tab → GraphQL requests
3. Check database: product có tồn tại không?
4. Check template: đã published chưa?
5. Restart backend nếu cần:
   ```bash
   cd backend
   npm run start:dev
   ```

---

## 🎉 Kết Quả

Sau khi setup thành công:

**TRƯỚC:**
- 100 products = Tạo 100 pages riêng
- Update design = Sửa 100 pages
- Thêm product = Tạo page mới

**SAU:**
- 100 products = 1 template
- Update design = Sửa 1 template → tất cả tự động update
- Thêm product = Không làm gì, auto work!

---

**Chúc bạn thành công! 🚀**

---

## 📚 Tài Liệu Chi Tiết

- **Full Implementation Guide**: `docs/85-DYNAMIC_PRODUCT_PAGE_GUIDE.md`
- **Technical Details**: `docs/87-DYNAMIC_PAGE_IMPLEMENTATION_COMPLETE.md`
- **Integration Status**: `docs/86-DYNAMIC_PAGE_INTEGRATION_STATUS.md`
