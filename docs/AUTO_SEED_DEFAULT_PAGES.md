# Auto-Seed Default Pages

## 📋 Tổng Quan

Hệ thống tự động seed 4 trang mẫu khi backend khởi động lần đầu:

1. **Trang Chủ** (`/trang-chu`) - Header default fixed, Footer extended
2. **Giới Thiệu Công Ty** (`/gioi-thieu`) - Header centered sticky, Footer default
3. **Giới Thiệu Sản Phẩm** (`/san-pham`) - Header mega, Footer extended
4. **Landing Page Khuyến Mãi** (`/khuyen-mai`) - Header minimal transparent, Footer minimal

## 🏗️ Kiến Trúc

### Files Created:

```
backend/
├── data/
│   └── default-pages.json          # Seed data cho 4 trang
├── src/
│   └── seed/
│       ├── seed.module.ts          # Module cho seed service
│       └── seed.service.ts         # Service auto-seed khi khởi động
└── src/app.module.ts               # Import SeedModule
```

### SeedService Features:

```typescript
@Injectable()
export class SeedService implements OnModuleInit {
  // ✅ Tự động chạy khi module khởi tạo
  async onModuleInit() { ... }
  
  // ✅ Kiểm tra môi trường trước khi seed
  // ✅ Không seed lại nếu trang đã tồn tại
  // ✅ Log chi tiết quá trình seed
  // ✅ Không crash app nếu seed lỗi
}
```

## ⚙️ Cấu Hình

### Biến Môi Trường:

Thêm vào file `.env` (optional):

```bash
# Auto-seed default pages
SEED_DEFAULT_PAGES=true     # Bật/tắt auto-seed (mặc định: true trong development)
```

### Điều Kiện Seed:

Seed sẽ chạy tự động khi:
- `NODE_ENV=development` (môi trường phát triển)
- HOẶC `SEED_DEFAULT_PAGES=true`

Để **TẮT auto-seed**, set:
```bash
SEED_DEFAULT_PAGES=false
```

## 📄 Chi Tiết 4 Trang Mẫu

### 1. 🏠 Trang Chủ (`/trang-chu`)

**Layout Settings:**
- Header: `default` variant, `fixed` style
- Footer: `extended` variant với newsletter
- Brand: "Công Ty ABC"
- Menu items: Trang Chủ, Giới Thiệu, Sản Phẩm (dropdown), Liên Hệ

**Content:**
- Hero section: "Chào Mừng Đến Với Công Ty Chúng Tôi"
- Features: 3 tính năng chính (Phát Triển Nhanh, Bảo Mật Cao, Tối Ưu Hiệu Suất)

**Header Config:**
```json
{
  "brand": { "name": "Công Ty ABC", "logo": "/images/logo.png" },
  "menuItems": [ /* 4 menu items */ ],
  "ctaButton": { "text": "Tư Vấn Miễn Phí" },
  "showSearch": true
}
```

**Footer Config:**
```json
{
  "columns": [ /* 4 columns */ ],
  "socialLinks": [ "facebook", "twitter", "linkedin" ],
  "showNewsletter": true,
  "newsletterTitle": "Đăng Ký Nhận Tin Tức"
}
```

### 2. 📖 Giới Thiệu Công Ty (`/gioi-thieu`)

**Layout Settings:**
- Header: `centered` variant, `sticky` style
- Footer: `default` variant
- Brand: "Công Ty ABC - Về Chúng Tôi"

**Content:**
- About hero: "Về Chúng Tôi"
- Story section: Lịch sử công ty, 10 năm kinh nghiệm
- Values grid: 4 giá trị cốt lõi (Chất Lượng, Đội Ngũ, Đổi Mới, Tận Tâm)

**Header Config:**
```json
{
  "variant": "centered",
  "brand": { "name": "Công Ty ABC", "tagline": "Về Chúng Tôi" },
  "centered": true,
  "colors": { "background": "#f9fafb", "primary": "#10b981" }
}
```

### 3. 📦 Giới Thiệu Sản Phẩm (`/san-pham`)

**Layout Settings:**
- Header: `mega` variant (dropdown lớn), `fixed` style
- Footer: `extended` variant với newsletter
- Brand: "Công Ty ABC - Sản Phẩm & Dịch Vụ"

**Content:**
- Product hero với CTA "Xem Demo"
- Product grid: 3 sản phẩm (ERP, Mobile App, Website)
- Chi tiết features cho từng sản phẩm

**Header Config:**
```json
{
  "variant": "mega",
  "menuItems": [
    {
      "label": "Sản Phẩm",
      "children": [
        { "label": "Phần Mềm Quản Lý", "description": "ERP, CRM, HRM", "featured": true },
        { "label": "Ứng Dụng Di Động", "description": "iOS & Android App" },
        { "label": "Website", "description": "Landing page, E-commerce" },
        { "label": "AI & Machine Learning", "description": "Chatbot, Recommendation" }
      ]
    }
  ],
  "ctaButton": { "text": "Đặt Demo" },
  "showSearch": true
}
```

**Footer Config:**
```json
{
  "columns": [ /* 4 columns: Sản Phẩm, Giải Pháp, Hỗ Trợ, Công Ty */ ],
  "socialLinks": [ "facebook", "twitter", "linkedin", "youtube" ],
  "showNewsletter": true,
  "newsletterTitle": "Nhận Bản Demo Miễn Phí"
}
```

### 4. 🚀 Landing Page Khuyến Mãi (`/khuyen-mai`)

**Layout Settings:**
- Header: `minimal` variant, `transparent` style
- Footer: `minimal` variant
- Tối giản để focus vào conversion

**Content:**
- Hero: "Giảm Giá 50% Cho Khách Hàng Mới"
- Countdown timer: 7 ngày
- Benefits: 3 lý do chọn (Triển Khai Nhanh, Bảo Hành 12 Tháng, Giá Tốt Nhất)
- Dual CTA: "Đăng Ký Ngay" + "Tìm Hiểu Thêm"

**Header Config:**
```json
{
  "variant": "minimal",
  "brand": { "name": "Công Ty ABC", "logo": "/images/logo-white.png" },
  "ctaButton": { 
    "text": "Đăng Ký", 
    "variant": "primary", 
    "size": "lg",
    "highlight": true 
  },
  "transparent": true,
  "colors": { "background": "transparent", "text": "#ffffff" }
}
```

**Footer Config:**
```json
{
  "variant": "minimal",
  "copyright": "© 2025 Công Ty ABC - Hotline: 0123 456 789",
  "links": [ "Điều Khoản", "Chính Sách" ],
  "colors": { "background": "#1f2937", "text": "#9ca3af" }
}
```

## 🚀 Sử Dụng

### Auto-Seed khi khởi động:

```bash
# Backend sẽ tự động seed khi start
cd backend
bun run dev

# Output:
# 🌱 Checking default pages...
# ✅ Created: "Trang Chủ" (trang-chu)
#    📐 Layout: Header=default, Footer=extended
# ✅ Created: "Giới Thiệu Công Ty" (gioi-thieu)
# ...
# ✅ Default pages seeding completed!
```

### Manual Seed (nếu cần):

```typescript
// Trong controller hoặc resolver
constructor(private seedService: SeedService) {}

// Re-seed tất cả
await this.seedService.reseedDefaultPages();

// Xóa tất cả default pages
await this.seedService.clearDefaultPages();
```

### Xem Pages:

Frontend URLs:
- http://localhost:13000/trang-chu
- http://localhost:13000/gioi-thieu  
- http://localhost:13000/san-pham
- http://localhost:13000/khuyen-mai

## 🔄 Workflow

```
Backend Start
    ↓
SeedModule.onModuleInit()
    ↓
Check môi trường (dev or SEED_DEFAULT_PAGES=true)
    ↓
Yes → Đọc default-pages.json
    ↓
Loop qua 4 pages
    ↓
Check tồn tại? (by id or slug)
    ↓
No → Create page với layoutSettings
    ↓
Log thông tin page created
    ↓
Summary: Created/Skipped/Total
    ↓
List tất cả pages với layout details
```

## 🛡️ Error Handling

- **File không tồn tại**: Log error, không crash app
- **Database error**: Log error, không crash app
- **Duplicate pages**: Skip và log "already exists"
- **Invalid JSON**: Log error, không crash app

## 📊 Log Output

```
🌱 Checking default pages...

✅ Created: "Trang Chủ" (trang-chu)
   📐 Layout: Header=default, Footer=extended
   🏷️  Brand: Công Ty ABC

✅ Created: "Giới Thiệu Công Ty" (gioi-thieu)
   📐 Layout: Header=centered, Footer=default
   🏷️  Brand: Công Ty ABC

✅ Created: "Giới Thiệu Sản Phẩm" (san-pham)
   📐 Layout: Header=mega, Footer=extended
   🏷️  Brand: Công Ty ABC

✅ Created: "Landing Page - Khuyến Mãi Đặc Biệt" (khuyen-mai)
   📐 Layout: Header=minimal, Footer=minimal
   🏷️  Brand: Công Ty ABC

📊 Seed Summary:
   ✅ Created: 4 pages
   📄 Total: 4 pages

📋 Default Pages:

📄 Trang Chủ
   URL: /trang-chu
   Status: PUBLISHED
   Layout:
     - Header: default (shown)
     - Footer: extended (shown)
     - Brand: Công Ty ABC

📄 Giới Thiệu Công Ty
   URL: /gioi-thieu
   Status: PUBLISHED
   Layout:
     - Header: centered (shown)
     - Footer: default (shown)
     - Brand: Công Ty ABC

📄 Giới Thiệu Sản Phẩm
   URL: /san-pham
   Status: PUBLISHED
   Layout:
     - Header: mega (shown)
     - Footer: extended (shown)
     - Brand: Công Ty ABC

📄 Landing Page - Khuyến Mãi Đặc Biệt
   URL: /khuyen-mai
   Status: PUBLISHED
   Layout:
     - Header: minimal (shown)
     - Footer: minimal (shown)
     - Brand: Công Ty ABC

✅ Default pages seeding completed!
```

## 🎯 Best Practices

1. **Môi Trường Production**: Set `SEED_DEFAULT_PAGES=false`
2. **Custom Pages**: Tạo file JSON riêng và tạo seed service khác
3. **Update Content**: Sửa `default-pages.json` và restart backend
4. **Migration**: Sử dụng Prisma migrations cho schema changes
5. **Testing**: Clear pages trước khi re-seed để test

## 🔧 Customization

### Thêm Page Mới:

Thêm vào `default-pages.json`:
```json
{
  "pages": [
    // ... existing pages
    {
      "id": "page-contact",
      "title": "Liên Hệ",
      "slug": "lien-he",
      "layoutSettings": {
        "headerVariant": "default",
        "footerVariant": "default"
      }
    }
  ]
}
```

### Thay Đổi Layout:

Sửa `layoutSettings` trong JSON:
```json
{
  "layoutSettings": {
    "hasHeader": true,
    "hasFooter": true,
    "headerVariant": "minimal",
    "headerStyle": "transparent",
    "footerVariant": "minimal",
    "headerConfig": { /* custom config */ },
    "footerConfig": { /* custom config */ }
  }
}
```

## ✅ Hoàn Thành

- ✅ 4 trang mẫu với layout khác nhau
- ✅ Auto-seed khi backend khởi động
- ✅ Không seed lại nếu đã tồn tại
- ✅ Log chi tiết và dễ đọc
- ✅ Error handling không crash app
- ✅ Hỗ trợ manual seed/clear
- ✅ Documentation đầy đủ
