# 🧹 BLOG WEBSITE CLEANUP PLAN

## Mục tiêu
Xóa tất cả code e-commerce/HR/call-center không cần thiết cho website blog

## ✅ CÁC MODULE CẦN GIỮ (Blog Essentials)

```
src/app/admin/
├── blog/              ✅ Quản lý bài viết
├── categories/        ✅ Quản lý danh mục
├── dashboard/         ✅ Tổng quan admin
├── filemanager/       ✅ Upload ảnh/file
├── menu/              ✅ Quản lý menu
├── pagebuilder/       ✅ Page builder (landing pages)
├── settings/          ✅ Cài đặt website
├── users/             ✅ Quản lý users
├── projects/          ⚠️  Optional - showcase projects
└── tasks/             ⚠️  Optional - todo list
```

## ❌ CÁC MODULE CẦN XÓA (E-commerce/Enterprise)

```
src/app/admin/
├── products/          ❌ E-commerce - DELETE
├── orders/            ❌ E-commerce - DELETE  
├── hr/                ❌ HR Management - DELETE
├── callcenter/        ❌ Call Center - DELETE
├── affiliate/         ❌ Affiliate Marketing - DELETE
├── support-chat/      ❌ Live Chat - DELETE
├── data-management/   ❌ Advanced features - DELETE
├── dynamic-demo/      ❌ Demo pages - DELETE
└── request-access/    ❌ Access requests - DELETE
```

## 📝 FILES CẦN XÓA

```
src/hooks/
└── useProducts.ts               ❌ 470 lines - imports Sanpham

src/actions/
└── products.ts                  ❌ 245 lines - imports Sanpham

src/graphql/
└── ecommerce.queries.ts         ❌ GraphQL stubs

src/components/
└── (các components liên quan products)
```

## 🔧 BƯỚC THỰC HIỆN

### Bước 1: Backup (Tùy chọn)
```bash
mkdir -p /mnt/chikiet/Innerbright/innerv2/archived_modules
mv src/app/admin/products archived_modules/
mv src/app/admin/orders archived_modules/
mv src/app/admin/hr archived_modules/
mv src/app/admin/callcenter archived_modules/
mv src/app/admin/affiliate archived_modules/
mv src/app/admin/support-chat archived_modules/
mv src/app/admin/data-management archived_modules/
mv src/app/admin/dynamic-demo archived_modules/
mv src/app/admin/request-access archived_modules/

mv src/hooks/useProducts.ts archived_modules/
mv src/actions/products.ts archived_modules/
mv src/graphql/ecommerce.queries.ts archived_modules/
```

### Bước 2: Xóa trực tiếp (Recommended)
```bash
cd /mnt/chikiet/Innerbright/innerv2/frontend

# Xóa admin pages
rm -rf src/app/admin/products
rm -rf src/app/admin/orders
rm -rf src/app/admin/hr
rm -rf src/app/admin/callcenter
rm -rf src/app/admin/affiliate
rm -rf src/app/admin/support-chat
rm -rf src/app/admin/data-management
rm -rf src/app/admin/dynamic-demo
rm -rf src/app/admin/request-access

# Xóa hooks/actions
rm src/hooks/useProducts.ts
rm src/actions/products.ts

# Xóa GraphQL stubs
rm src/graphql/ecommerce.queries.ts
```

### Bước 3: Clean up imports
Tìm và xóa các imports không còn dùng:
```bash
grep -r "useProducts" src/
grep -r "products.ts" src/
grep -r "ecommerce.queries" src/
```

### Bước 4: Regenerate Prisma Client
```bash
cd /mnt/chikiet/Innerbright/innerv2/frontend
bunx prisma generate
```

### Bước 5: Test Blog System
```bash
bun run type-check
bun run build
```

## 📊 TỔNG QUAN SAU KHI DỌN DẸP

### Admin Dashboard Structure
```
admin/
├── 📊 dashboard/      (Tổng quan)
├── 📝 blog/           (Posts management)
├── 📁 categories/     (Category management)
├── 🎨 pagebuilder/    (Landing pages)
├── 🔗 menu/           (Menu management)
├── 👥 users/          (User management)
├── 📁 filemanager/    (Media library)
├── ⚙️  settings/       (Website settings)
├── 💼 projects/       (Optional)
└── ✅ tasks/          (Optional)
```

### Prisma Models Sử dụng
```prisma
✅ User, AuthMethod, Role, Permission (Auth & RBAC)
✅ Menu, MenuItem (Menu system)
✅ Page, Block (Page builder)
✅ Post, Category, Tag, Comment, Like (Blog)
✅ WebsiteSetting (Config)
✅ AuditLog (Activity tracking)
```

## ⚠️ LƯU Ý

1. **Kiểm tra dependencies**: Trước khi xóa, grep xem có file nào còn import không
2. **Backup quan trọng**: Nếu không chắc, hãy backup trước
3. **Test thoroughly**: Sau khi xóa, test toàn bộ blog system
4. **Git commit**: Commit từng bước để dễ rollback

## 🎯 KẾT QUẢ MONG ĐỢI

- ✅ 0 TypeScript errors
- ✅ Website blog clean và minimal
- ✅ Chỉ giữ features cần thiết
- ✅ Dễ maintain và extend
- ✅ Performance tốt hơn (ít code hơn)

