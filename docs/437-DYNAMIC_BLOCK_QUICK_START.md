# 🚀 Dynamic Block - Quick Start Guide

## 📋 Giới Thiệu Nhanh

**Dynamic Block** cho phép bạn tải dữ liệu từ API/GraphQL/Database và hiển thị với templates mà không cần code.

## ⚡ Cách Sử Dụng (3 Bước)

### Bước 1: Thêm Dynamic Block

```
1. Click "Add New Block" ở dưới canvas
2. Chọn "⚡ Dynamic Block"
3. Block sẽ xuất hiện trên canvas
```

### Bước 2: Cấu Hình Block

```
1. Hover vào Dynamic Block
2. Click icon "⚙️ Settings"
3. Nhập thông tin:
   - Template Name: đặt tên block
   - Data Source: chọn loại (Static/API/GraphQL)
   - Enable Repeater: tích để lặp dữ liệu
   - Template HTML: viết HTML để hiển thị dữ liệu
```

### Bước 3: Save & Preview

```
1. Click "Save" để lưu cấu hình
2. Click "Refresh" để tải dữ liệu mới
3. Preview để xem kết quả
4. Save page để lưu vào database
```

---

## 🎯 Các Loại Data Source

### 1. Static Data (Dữ liệu Tĩnh)

**Khi nào:** Dữ liệu không thay đổi

```json
{
  "type": "static",
  "staticData": {
    "title": "My Products",
    "items": [
      { "name": "Product 1", "price": 100 },
      { "name": "Product 2", "price": 200 }
    ]
  }
}
```

**Template:**
```html
<h1>{{title}}</h1>
{{#each items}}
  <div>{{name}} - ${{price}}</div>
{{/each}}
```

### 2. REST API

**Khi nào:** Dữ liệu từ REST API

```json
{
  "type": "api",
  "endpoint": "/api/products",
  "variables": { "limit": 10 }
}
```

### 3. GraphQL

**Khi nào:** Dữ liệu từ GraphQL

```json
{
  "type": "graphql",
  "endpoint": "/graphql",
  "query": "query { products { id name price } }",
  "variables": { "limit": 10 }
}
```

### 4. Database

**Khi nào:** Dữ liệu trực tiếp từ DB

```json
{
  "type": "database",
  "table": "products",
  "filters": { "isFeatured": true },
  "limit": 10
}
```

---

## 🎨 Template Syntax

### Biến Đơn Giản
```html
<h1>{{title}}</h1>
<p>{{description}}</p>
```

### Loop
```html
{{#each items}}
  <div>{{name}}</div>
{{/each}}
```

### Condition
```html
{{#if isFeatured}}
  <div class="badge">Featured</div>
{{/if}}
```

### Repeat (Ví dụ: Stars)
```html
{{#repeat rating}}<span>⭐</span>{{/repeat}}
```

### Ví Dụ Đầy Đủ
```html
<div class="products">
  {{#each products}}
    <div class="card">
      <h2>{{name}}</h2>
      {{#if onSale}}
        <span class="badge">On Sale!</span>
      {{/if}}
      <p>Price: ${{price}}</p>
      <div class="rating">
        {{#repeat rating}}⭐{{/repeat}}
      </div>
    </div>
  {{/each}}
</div>
```

---

## 💾 Demo Database

### Tạo Demo Data

```bash
# Từ project root
cd backend
npx ts-node scripts/seed-dynamic-block-demo.ts
```

### Kết quả

```
✨ Dynamic Block Demo Data Seeded!

📊 Summary:
   • Products: 3 items
   • Demo Page: featured-products-static-demo

🔗 Access URLs:
   🌐 View Demo:  http://localhost:3000/pages/featured-products-static-demo
   📝 Admin:      http://localhost:3000/admin/pages
```

---

## 🎓 Ví Dụ Thực Tế

### Ví Dụ 1: Product Grid (Static Data)

**Config:**
```json
{
  "templateName": "product-grid",
  "dataSource": {
    "type": "static",
    "staticData": {
      "products": [
        {
          "name": "MacBook Pro",
          "price": 1999,
          "image": "url-to-image",
          "badge": "Best Seller"
        }
      ]
    }
  },
  "repeater": {
    "enabled": true,
    "dataPath": "products",
    "limit": 12
  }
}
```

**Template:**
```html
<div class="grid grid-cols-3 gap-6">
  {{#each products}}
  <div class="card rounded-lg shadow">
    <img src="{{image}}" alt="{{name}}">
    <span class="badge">{{badge}}</span>
    <h3>{{name}}</h3>
    <p class="price">${{price}}</p>
    <button>Add to Cart</button>
  </div>
  {{/each}}
</div>
```

### Ví Dụ 2: Product List (GraphQL)

**GraphQL Query:**
```graphql
query GetProducts($limit: Int!) {
  products(limit: $limit, isFeatured: true) {
    id
    name
    price
    image
    category { name }
  }
}
```

**Template:**
```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Category</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    {{#each products}}
    <tr>
      <td>{{name}}</td>
      <td>{{categoryName}}</td>
      <td>${{price}}</td>
    </tr>
    {{/each}}
  </tbody>
</table>
```

---

## ✅ Checklist

### Tạo Dynamic Block

- [ ] Add "⚡ Dynamic Block"
- [ ] Đặt "Template Name"
- [ ] Chọn "Data Source Type"
- [ ] Nhập endpoint/query/data
- [ ] Enable "Repeater" (nếu cần)
- [ ] Viết "Template HTML"
- [ ] Click "Save"
- [ ] Preview kết quả
- [ ] Save Page

### Deploy

- [ ] Test trên local
- [ ] Kiểm tra API/GraphQL
- [ ] Verify data hiển thị đúng
- [ ] Test responsive design
- [ ] Deploy to production

---

## 🆘 Troubleshooting

**Q: Template không render dữ liệu?**
A: Kiểm tra tên biến trong template phải khớp với response API/data

**Q: Data source lỗi?**
A: Kiểm tra endpoint URL, GraphQL query, hoặc static data format

**Q: Repeater không hoạt động?**
A: Kiểm tra "dataPath" phải trỏ đúng tới array trong data

**Q: Responsive không OK?**
A: Sử dụng Tailwind CSS classes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## 📞 Liên Hệ

📖 Full Documentation: `DYNAMIC_BLOCK_GUIDE.md`  
💻 GitHub: [rausachcore](https://github.com/KataChannel/katastarterkit)  
💬 Discord: [rausachcore Community](https://discord.gg/kata)

---

**Last Updated:** October 23, 2025  
**Version:** 1.0.0
