# 🎓 Hướng Dẫn Sử Dụng Product Detail Page

## 📚 Tài Liệu Có Sẵn

Chúng tôi đã tạo **3 hướng dẫn chi tiết** để bạn sử dụng:

### 1️⃣ **QUICK_START_PRODUCT_PAGE.md** ⚡
- **Dành cho**: Người muốn làm việc ngay
- **Nội dung**: 5 bước nhanh, 5 phút hoàn tất
- **Ưu điểm**: Rất ngắn gọn, dễ hiểu
- **👉 Bắt đầu ở đây nếu bạn mới**

### 2️⃣ **PRODUCT_DETAIL_PAGE_GUIDE.md** 📖
- **Dành cho**: Người muốn hiểu sâu
- **Nội dung**: Hướng dẫn 10 bước chi tiết
- **Ưu điểm**: Giải thích cách hoạt động
- **👉 Đọc tiếp sau khi làm Quick Start**

### 3️⃣ **PRODUCT_PAGE_EXAMPLES.json** 🎨
- **Dành cho**: Người muốn copy-paste code
- **Nội dung**: 10 ví dụ thực tế, có code sẵn
- **Ưu điểm**: Ready-to-use examples
- **👉 Sử dụng khi cần sửa đổi specific**

---

## 🚀 Bắt Đầu Nhanh (3 Phút)

### Step 1: Mở Page Builder
```
http://localhost:13000/page-builder
```

### Step 2: Tìm "Product Detail" Page
- Scroll danh sách
- Click vào page có tên "Product Detail"
- Bạn sẽ thấy 3 blocks

### Step 3: Test Trực Tiếp
```
https://localhost:13000/product-detail/macbook-pro-m3
https://localhost:13000/product-detail/iphone-15-pro
https://localhost:13000/product-detail/airpods-pro
```

### Step 4: Chỉnh Sửa Block
- Hover vào block → Click ⚙️
- Sửa Template HTML ở cột giữa
- Xem Live Preview bên phải
- Click Save ✅

---

## 🎯 Tìm Kiếm Giải Pháp

### Tôi muốn... (Quick Reference)

| Tôi muốn | Hành động | File |
|---------|---------|------|
| Làm việc ngay lập tức | Step 1-3 trong Quick Start | QUICK_START_PRODUCT_PAGE.md |
| Hiểu cách hoạt động | Đọc Bước 4-10 | PRODUCT_DETAIL_PAGE_GUIDE.md |
| Copy code example | Tìm ví dụ tương ứng | PRODUCT_PAGE_EXAMPLES.json |
| Đổi màu sắc | Ví dụ #1 | PRODUCT_PAGE_EXAMPLES.json |
| Thêm badge/tag | Ví dụ #2 | PRODUCT_PAGE_EXAMPLES.json |
| Hiển thị discount | Ví dụ #3 | PRODUCT_PAGE_EXAMPLES.json |
| Thêm stock status | Ví dụ #4 | PRODUCT_PAGE_EXAMPLES.json |
| Thêm rating stars | Ví dụ #5 | PRODUCT_PAGE_EXAMPLES.json |
| Custom button | Ví dụ #6 | PRODUCT_PAGE_EXAMPLES.json |
| Share buttons | Ví dụ #7 | PRODUCT_PAGE_EXAMPLES.json |
| Product tabs | Ví dụ #8 | PRODUCT_PAGE_EXAMPLES.json |
| Quantity selector | Ví dụ #9 | PRODUCT_PAGE_EXAMPLES.json |
| Loop products | Ví dụ #10 | PRODUCT_PAGE_EXAMPLES.json |

---

## 📁 File Structure

```
/katacore
├── QUICK_START_PRODUCT_PAGE.md     ← 5 phút nhanh
├── PRODUCT_DETAIL_PAGE_GUIDE.md    ← Chi tiết 10 bước
├── PRODUCT_PAGE_EXAMPLES.json      ← 10 ví dụ code
└── seed-product-page.ts            ← Seed data (đã chạy)
```

---

## 🔑 Key Concepts

### 1. Dynamic Slug
```
URL: /product-detail/[slug]
slug = "macbook-pro-m3"
→ Tự động fetch product từ database
```

### 2. Template Variables
```
{{productName}}    → Tên sản phẩm
{{productPrice}}   → Giá tiền
{{productImage}}   → Ảnh sản phẩm
```

### 3. GraphQL Queries
```graphql
query GetProduct($slug: String!) {
  getProductBySlug(slug: $slug) {
    name
    price
    description
    images { url }
  }
}
```

### 4. Template Loops
```html
{{#each relatedProducts}}
  <div>{{name}} - ${{price}}</div>
{{/each}}
```

---

## 🎨 Ví Dụ Thực Tế

### Ví dụ 1: Đổi Màu
```diff
- <div class="bg-blue-50">
+ <div class="bg-purple-50">
```

### Ví dụ 2: Thêm Badge
```html
<span class="bg-red-500 text-white px-3 rounded">
  ⭐ Best Seller
</span>
```

### Ví dụ 3: Conditional Rendering
```html
{{#if productOriginalPrice}}
  <span class="line-through">${{productOriginalPrice}}</span>
{{/if}}
```

---

## 🧪 Test Checklist

- [ ] Truy cập /product-detail/macbook-pro-m3
- [ ] Thấy ảnh sản phẩm
- [ ] Thấy tên sản phẩm
- [ ] Thấy giá tiền
- [ ] Thấy nút "Add to Cart"
- [ ] Thấy related products
- [ ] Mở PageBuilder
- [ ] Edit Hero Block template
- [ ] Live Preview cập nhật
- [ ] Click Save Changes
- [ ] Reload page, change persistent ✅

---

## 🐛 Troubleshooting

### Data không hiển thị
```
1. Check GraphQL query (Network tab)
2. Check Variable Mapping
3. Check template syntax
4. Reload page
```

### Style không áp dụng
```
1. Check TailwindCSS class spelling
2. Check CSS precedence
3. DevTools Inspector (F12)
4. Full page refresh
```

### Variable hiển thị {{variable}}
```
1. Check tên variable đúng chưa
2. Check GraphQL có field đó
3. Check Variable Mapping
4. Case-sensitive!
```

---

## 📝 Template Syntax Cheat Sheet

```html
<!-- Variables -->
{{productName}}
{{productPrice}}

<!-- Conditionals -->
{{#if productOriginalPrice}}
  Content here
{{/if}}

<!-- Loops -->
{{#each products}}
  <div>{{name}} - ${{price}}</div>
{{/each}}

<!-- Repeats (for stars) -->
{{#repeat rating}}
  ⭐
{{/repeat}}
```

---

## 🎓 Learning Path

### Day 1: Basics (30 min)
1. Read QUICK_START_PRODUCT_PAGE.md
2. Test 3 product URLs
3. Modify 1 block (change color)

### Day 2: Intermediate (1 hour)
1. Read PRODUCT_DETAIL_PAGE_GUIDE.md
2. Try examples #1-3 from JSON
3. Add one new element

### Day 3: Advanced (1+ hours)
1. Explore examples #4-10
2. Create new block with loop
3. Add custom GraphQL query

---

## 🚀 Next Steps

### Create Your Own Page
1. Copy Product Detail setup
2. Modify for category page
3. Add filters/sorting
4. Deploy!

### Advanced Features
- [ ] Add reviews section
- [ ] Add variant selector
- [ ] Add wishlist
- [ ] Add stock counter
- [ ] Add coupon code
- [ ] Add rating widget

---

## 💬 Questions?

### Check These Files First:
1. QUICK_START_PRODUCT_PAGE.md → for quick answers
2. PRODUCT_DETAIL_PAGE_GUIDE.md → for explanations
3. PRODUCT_PAGE_EXAMPLES.json → for code samples

### Files Location:
```
/mnt/chikiet/kataoffical/fullstack/katacore/
├── QUICK_START_PRODUCT_PAGE.md
├── PRODUCT_DETAIL_PAGE_GUIDE.md
└── PRODUCT_PAGE_EXAMPLES.json
```

---

## ✨ Summary

✅ **Product Detail Page Demo** dengan:
- Dynamic slug từ URL
- Data từ database via GraphQL
- Fully editable trong PageBuilder
- Live preview
- 10 examples siêu sẵn

🎉 **Bạn có thể:**
- View product details
- Edit templates
- Add variables
- Customize styling
- Create new blocks

📚 **Tài liệu:**
- Quick Start (5 min)
- Complete Guide (30 min)
- 10 Real Examples (copy-paste)

**Happy learning! 🚀**
