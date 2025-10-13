# 🚀 Auto-Seed Default Pages - Quick Start

## ✅ Hoàn Thành

Đã tạo hệ thống tự động seed 4 trang mẫu khi backend khởi động:

1. **Trang Chủ** (`/trang-chu`) - Header default, Footer extended
2. **Giới Thiệu** (`/gioi-thieu`) - Header centered, Footer default  
3. **Sản Phẩm** (`/san-pham`) - Header mega, Footer extended
4. **Landing** (`/khuyen-mai`) - Header minimal, Footer minimal

## 📦 Files Created

```
backend/
├── data/
│   └── default-pages.json              # Seed data cho 4 trang
├── src/seed/
│   ├── seed.module.ts                  # Seed module
│   └── seed.service.ts                 # Auto-seed service
└── src/app.module.ts                   # ✅ Updated: Import SeedModule

docs/
└── AUTO_SEED_DEFAULT_PAGES.md          # Documentation đầy đủ

AUTO_SEED_IMPLEMENTATION.md             # Implementation report
```

## 🎯 Cách Sử Dụng

### Auto-Seed (Mặc định)

Backend tự động seed khi:
- `NODE_ENV=development` (mặc định)
- HOẶC `SEED_DEFAULT_PAGES=true`

```bash
# Start backend
cd backend
bun run dev

# Output:
# 🌱 Checking default pages...
# ✅ Created: "Trang Chủ" (trang-chu)
# ✅ Created: "Giới Thiệu Công Ty" (gioi-thieu)
# ...
# ✅ Default pages seeding completed!
```

### Xem Pages

Frontend URLs:
- http://localhost:13000/trang-chu
- http://localhost:13000/gioi-thieu
- http://localhost:13000/san-pham
- http://localhost:13000/khuyen-mai

### Tắt Auto-Seed

Thêm vào `.env`:
```bash
SEED_DEFAULT_PAGES=false
```

## 📊 Output Log

```
[SeedService] 🌱 Checking default pages...

[SeedService] ✅ Created: "Trang Chủ" (trang-chu)
   📐 Layout: Header=default, Footer=extended
   🏷️  Brand: Công Ty ABC

[SeedService] ✅ Created: "Giới Thiệu Công Ty" (gioi-thieu)
   📐 Layout: Header=centered, Footer=default
   🏷️  Brand: Công Ty ABC

[SeedService] ✅ Created: "Giới Thiệu Sản Phẩm" (san-pham)
   📐 Layout: Header=mega, Footer=extended
   🏷️  Brand: Công Ty ABC

[SeedService] ✅ Created: "Landing Page - Khuyến Mãi Đặc Biệt" (khuyen-mai)
   📐 Layout: Header=minimal, Footer=minimal
   🏷️  Brand: Công Ty ABC

📊 Seed Summary:
   ✅ Created: 4 pages
   📄 Total: 4 pages

✅ Default pages seeding completed!
```

**Lần chạy sau:**
```
[SeedService] 🌱 Checking default pages...
[SeedService] ⏭️  Skipping "Trang Chủ" - already exists
[SeedService] ⏭️  Skipping "Giới Thiệu Công Ty" - already exists
[SeedService] ⏭️  Skipping "Giới Thiệu Sản Phẩm" - already exists
[SeedService] ⏭️  Skipping "Landing Page - Khuyến Mãi Đặc Biệt" - already exists

📊 Seed Summary:
   ✅ Created: 0 pages
   ⏭️  Skipped: 4 pages (already exist)
   📄 Total: 4 pages
```

## 🎨 Layout Variants

| Page | Header | Footer | Use Case |
|------|--------|--------|----------|
| Trang Chủ | default (fixed) | extended (newsletter) | Homepage chuẩn |
| Giới Thiệu | centered (sticky) | default | About page |
| Sản Phẩm | mega (dropdown) | extended (newsletter) | Product catalog |
| Landing | minimal (transparent) | minimal | Promotion page |

## 🔧 Customization

### Thêm Page Mới

Edit `backend/data/default-pages.json`:
```json
{
  "pages": [
    // ... existing pages
    {
      "id": "page-new",
      "title": "Your New Page",
      "slug": "new-page",
      "layoutSettings": {
        "headerVariant": "default",
        "footerVariant": "default"
      }
    }
  ]
}
```

Restart backend → Auto-seed page mới

### Manual Seed/Clear

```typescript
// Inject SeedService
constructor(private seedService: SeedService) {}

// Re-seed tất cả
await this.seedService.reseedDefaultPages();

// Xóa tất cả default pages
await this.seedService.clearDefaultPages();
```

## 📚 Documentation

Chi tiết đầy đủ: `/docs/AUTO_SEED_DEFAULT_PAGES.md`

Nội dung:
- Chi tiết 4 trang mẫu
- Layout config cho từng page
- Header/Footer config examples
- Customization guide
- Troubleshooting
- Best practices

## ✅ Test Results

- ✅ Backend khởi động thành công
- ✅ 4 pages được seed tự động
- ✅ Không duplicate khi restart
- ✅ Log output rõ ràng
- ✅ Error handling không crash app
- ✅ Frontend render đúng tất cả pages

## 🎯 Next Steps

1. **View Pages**: Truy cập các URLs ở trên
2. **Edit in PageBuilder**: Admin panel → PageBuilder → Select page
3. **Customize**: Sửa `default-pages.json` và restart
4. **Add More**: Tạo thêm page templates theo ý muốn

---

**Status**: ✅ Complete  
**Date**: October 13, 2025
