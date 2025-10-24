# 🎬 Quick Start Guide - Product Detail Page

## 5 Bước Nhanh (5 phút)

### Step 1️⃣: Mở PageBuilder
```
URL: http://localhost:13000/page-builder
```

### Step 2️⃣: Tìm Page "Product Detail"
```
- Scroll danh sách page
- Click vào "Product Detail"
- Bạn sẽ thấy 3 blocks
```

### Step 3️⃣: Test URLs
```
Truy cập các URL này để xem kết quả:
✅ http://localhost:13000/product-detail/macbook-pro-m3
✅ http://localhost:13000/product-detail/iphone-15-pro  
✅ http://localhost:13000/product-detail/airpods-pro
```

### Step 4️⃣: Chỉnh Sửa Block
```
1. Hover vào Hero Block
2. Click ⚙️ Settings
3. Xem Live Preview bên phải
4. Sửa Template HTML ở giữa
5. Click "Save Changes"
```

### Step 5️⃣: Thêm Variable Mới
```
1. Vào Settings → cột Trái
2. Tìm "Static Data (JSON)" hoặc GraphQL Query
3. Thêm field mới
4. Add Variable Mapping
5. Dùng {{newVariable}} trong template
```

---

## 🎨 Demo Modifications (Ví Dụ Chỉnh Sửa)

### Ví dụ 1: Đổi Style Hero
**Vào Hero Block → Settings → Template**

Tìm dòng:
```html
<div class="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
```

Đổi thành:
```html
<div class="bg-gradient-to-r from-purple-50 to-pink-50 py-16">
```

→ Hero sẽ đổi màu! ✅

---

### Ví dụ 2: Thêm Badge "Bestseller"
**Vào Hero Block → Tìm `<h1>` → Thêm trước:**

```html
<div class="inline-block bg-red-500 text-white px-3 py-1 rounded text-sm mb-4">
  ⭐ Bestseller
</div>
```

→ Sẽ có badge hiển thị! ✅

---

### Ví dụ 3: Thêm Discount Badge
**Thêm sau phần giá:**

```html
{{#if productOriginalPrice}}
<div class="bg-red-100 text-red-700 px-3 py-1 rounded text-sm inline-block">
  {{discount}}% OFF
</div>
{{/if}}
```

Sau đó thêm Variable Mapping:
```
discount → calculateDiscount(originalPrice, price)
```

→ Sẽ hiển thị % discount! ✅

---

## 🔍 Understanding Variables

### Template Variables Available

| Variable | Source | Example |
|----------|--------|---------|
| `{{productName}}` | Database | MacBook Pro M3 |
| `{{productPrice}}` | Database | 1999 |
| `{{productOriginalPrice}}` | Database | 2399 |
| `{{productDescription}}` | Database | Powerful laptop... |
| `{{productImage}}` | Database | https://... |
| `{{productSku}}` | Database | MBP-M3-2024 |
| `{{productWeight}}` | Database | 3.5 |

---

## 🔗 Understanding Data Flow

```
Step 1: User visits URL
        /product-detail/macbook-pro-m3
        
Step 2: Page captures slug
        slug = "macbook-pro-m3"
        
Step 3: Send GraphQL query
        query GetProduct($slug: "macbook-pro-m3")
        
Step 4: Database returns data
        {
          name: "MacBook Pro M3",
          price: 1999,
          description: "...",
          images: [...]
        }
        
Step 5: Variables replaced
        {{productName}} → MacBook Pro M3
        {{productPrice}} → 1999
        
Step 6: HTML rendered
        <h1>MacBook Pro M3</h1>
        <span>$1999</span>
```

---

## 🎯 Common Tasks

### Task 1: Change Button Text
**Find in template**: `<button>Add to Cart</button>`
**Change to**: `<button>Buy Now</button>`
**Result**: ✅ Button text updated

### Task 2: Change Button Color
**Find**: `class="bg-blue-600"`
**Change to**: `class="bg-green-600"`
**Result**: ✅ Button color changed

### Task 3: Add New Section
**At end of template, add**:
```html
<div class="max-w-6xl mx-auto px-4 py-12">
  <h2 class="text-3xl font-bold mb-4">Shipping Info</h2>
  <p>Free shipping worldwide!</p>
</div>
```
**Result**: ✅ New section added

### Task 4: Hide Element
**Find element**, wrap with:
```html
{{#if showDetails}}
  <div>Details here</div>
{{/if}}
```
**Result**: ✅ Element shows/hides based on condition

---

## 🐛 If Something Goes Wrong

### Issue: Page shows "Error"
```
Solution:
1. Check browser console (F12 → Console)
2. Check GraphQL query syntax
3. Reload page
4. Check if database has data
```

### Issue: Variables show as {{variable}}
```
Solution:
1. Check Variable Mapping
2. Check GraphQL query returns that field
3. Check spelling (case-sensitive)
4. Reload page
```

### Issue: Styling doesn't work
```
Solution:
1. Use correct TailwindCSS classes
2. Check for typos in class names
3. Inspect element (F12 → Inspector)
4. Check CSS precedence
```

---

## 📱 View on Mobile

Test responsive design:
1. Open DevTools (F12)
2. Click **Toggle device toolbar** (or Ctrl+Shift+M)
3. Select different devices
4. See how layout adapts

---

## 🚀 Next Steps

### Learn More:
1. **Add new products** via database
2. **Create new page** with different layout
3. **Add reviews section** with loops
4. **Add filters section** with conditions
5. **Create category pages** with dynamic filtering

### Explore:
- PageBuilder Features
- GraphQL Queries
- Template Syntax
- TailwindCSS Classes

---

## 📞 Quick Reference

### PageBuilder URL
```
http://localhost:13000/page-builder
```

### Test URLs
```
http://localhost:13000/product-detail/macbook-pro-m3
http://localhost:13000/product-detail/iphone-15-pro
http://localhost:13000/product-detail/airpods-pro
```

### Admin Credentials
```
Email: admin@katacore.dev
Password: admin123
```

### GraphQL Endpoint
```
http://localhost:3001/graphql
```

---

## ✅ You're Ready!

Now you can:
- ✅ View product details
- ✅ Edit templates
- ✅ Add variables
- ✅ Customize styling
- ✅ Create new blocks

**Happy building! 🎉**
