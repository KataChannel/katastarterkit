# 📘 Dynamic Block Documentation

Bộ hướng dẫn toàn diện về cách sử dụng Dynamic Block trong rausachcore Page Builder.

---

## 📚 Tài Liệu Có Sẵn

### 1. **DYNAMIC_BLOCK_QUICK_START.md** ⚡ (BẮT ĐẦU TỪ ĐÂY)
**Cho:** Người mới bắt đầu  
**Nội dung:**
- 3 bước cơ bản để tạo Dynamic Block
- Template syntax cơ bản
- Các ví dụ thực tế đơn giản
- Troubleshooting nhanh

**👉 Đọc trước nếu bạn muốn bắt đầu nhanh!**

---

### 2. **DYNAMIC_BLOCK_GUIDE.md** 📖 (CHI TIẾT)
**Cho:** Developer muốn hiểu sâu  
**Nội dung:**
- Giới thiệu chi tiết
- Tất cả loại Data Source (Static, API, GraphQL, Database)
- Template Advanced Features
- Demo Database Implementation
- Best Practices & Performance Tips
- Q&A Section

---

### 3. **seed-dynamic-block-demo.ts** 🗄️ (DEMO DATA)
**Cho:** Tạo sample data trong database  
**Tính năng:**
- Tạo 3 sample products
- Tạo demo page với Dynamic Block
- Static Data configuration
- Ready to use in development

**Chạy:**
```bash
cd backend
npx ts-node scripts/seed-dynamic-block-demo.ts
```

---

## 🎯 Lộ Trình Học Tập

### Mới Bắt Đầu?
```
1. Đọc DYNAMIC_BLOCK_QUICK_START.md (5-10 phút)
   ↓
2. Chạy seed script (2 phút)
   ↓
3. Xem demo page trên browser (5 phút)
   ↓
4. Tạo Dynamic Block đầu tiên (10 phút)
```

### Muốn Biết Chi Tiết?
```
1. Đọc DYNAMIC_BLOCK_GUIDE.md từ đầu đến cuối
   ↓
2. Thử tất cả ví dụ
   ↓
3. Tạo Dynamic Block phức tạp
```

---

## 🚀 Quick Links

| Tài Liệu | Đề Cập | Thời Gian |
|----------|--------|----------|
| Quick Start | Bắt đầu nhanh | 15 phút |
| Full Guide | Toàn bộ tính năng | 1 giờ |
| Seed Script | Demo data | 2 phút |
| API Docs | Endpoints | 30 phút |
| Schema | Database | 20 phút |

---

## 📋 Yêu Cầu

### Cần Thiết
- ✅ rausachcore Page Builder installed
- ✅ PostgreSQL hoặc database compatible
- ✅ Node.js 16+

### Optional (Cho Advanced Features)
- GraphQL endpoint
- REST API endpoint
- Custom database

---

## 💡 Trường Hợp Sử Dụng

### ✅ Hợp Lý Dùng Dynamic Block Khi:

1. **Dữ liệu từ Database**
   - Danh sách sản phẩm
   - Blog posts
   - Team members
   - Testimonials

2. **Real-time Updates**
   - Price lists
   - Stock levels
   - Latest news
   - Live counters

3. **Reusable Content**
   - Featured items
   - Category showcase
   - Product carousels
   - Gallery grids

### ❌ Không Phải Dynamic Block Khi:

1. **Static Content**
   - Use Text Block instead
   - Use Card Block for simple items

2. **Custom JavaScript Needed**
   - Use Custom Code block
   - Implement as separate component

3. **Real-time Streaming**
   - Implement custom WebSocket solution
   - Use separate real-time service

---

## 🎨 Template Examples

### Simple Product Card
```html
<div class="card p-4 border rounded">
  <img src="{{image}}" alt="{{name}}" class="w-full h-48 object-cover rounded">
  <h3 class="font-bold mt-2">{{name}}</h3>
  <p class="text-blue-600 font-bold">${{price}}</p>
</div>
```

### Loop Multiple Items
```html
<div class="grid grid-cols-3 gap-4">
  {{#each items}}
    <div>{{name}}</div>
  {{/each}}
</div>
```

### Conditional Content
```html
{{#if isFeatured}}
  <span class="badge">⭐ Featured</span>
{{/if}}
```

---

## 🔧 Troubleshooting

### Template variables tidak render?
```
✓ Pastikan nama variabel cocok dengan response data
✓ Gunakan {{variableName}} syntax yang benar
✓ Cek opening/closing braces
```

### Data source error?
```
✓ Verify endpoint URL adalah correct
✓ Untuk GraphQL, pastikan query syntax valid
✓ Untuk API, pastikan return format JSON
✓ Cek network tab di DevTools
```

### Repeater tidak loop?
```
✓ Enable toggle harus "ON"
✓ Pastikan dataPath menunjuk ke array (misal: "products", "items.data")
✓ Cek data structure di DevTools
```

---

## 📞 Support

| Channel | Link |
|---------|------|
| 📖 Documentation | `DYNAMIC_BLOCK_GUIDE.md` |
| ⚡ Quick Start | `DYNAMIC_BLOCK_QUICK_START.md` |
| 💻 GitHub Issues | https://github.com/KataChannel/katastarterkit/issues |
| 💬 Discord | https://discord.gg/kata |

---

## 📋 Changelog

### v1.0.0 (Oct 23, 2025)
- ✅ Dynamic Block Component
- ✅ Static Data Source
- ✅ GraphQL Integration
- ✅ REST API Support
- ✅ Template System
- ✅ Repeater Pattern
- ✅ Documentation

---

## 👨‍💻 Developers

### Files Modified
- `frontend/src/components/page-builder/blocks/DynamicBlock.tsx`
- `frontend/src/components/page-builder/PageBuilderCanvas.tsx`
- `backend/src/services/page.service.ts`
- `backend/src/graphql/queries/pages.ts`

### Related Docs
- Page Builder Guide
- GraphQL Schema
- Database Schema

---

**Happy Building! 🚀**

Last Updated: October 23, 2025
