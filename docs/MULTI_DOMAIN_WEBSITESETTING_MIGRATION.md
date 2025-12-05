# 📋 Multi-Domain WebsiteSetting Migration Guide

## Tổng quan

Tài liệu này hướng dẫn cách migrate WebsiteSetting để hỗ trợ multi-domain isolation.

## 🏗️ Kiến trúc mới

### Dual-Layer Protection (Bảo vệ 2 lớp)

1. **Layer 1 - Database riêng biệt (Primary)**
   - Rausach: `rausachcore` database
   - Timona: `timonacore` database  
   - Tazagroup: `tazagroupcore` database

2. **Layer 2 - Domain field trong schema (Secondary)**
   - Mỗi WebsiteSetting có trường `domain`
   - Ngăn chặn cross-contamination nếu seed script chạy nhầm database

### Schema Changes

```prisma
model WebsiteSetting {
  id          String   @id @default(uuid())
  key         String
  domain      String   @default("default")  // NEW FIELD
  // ... other fields
  
  @@unique([key, domain])  // Composite unique constraint
  @@index([domain])        // Performance index
}
```

## 🚀 Các bước Migration

### Bước 1: Apply Prisma Migration

```bash
# Chạy từ thư mục backend với ENV tương ứng
cd backend

# Cho Rausach
cp ../env/.env.dev.rausach .env
bun run db:migrate

# Cho Timona
cp ../env/.env.dev.timona .env
bun run db:migrate

# Cho Tazagroup
cp ../env/.env.dev.tazagroup .env
bun run db:migrate
```

### Bước 2: Migrate dữ liệu hiện có

```bash
# Cho Rausach
SITE_DOMAIN=rausach DATABASE_URL="postgresql://..." bun run scripts/migrate-website-settings-domain.ts --force

# Cho Timona
SITE_DOMAIN=timona DATABASE_URL="postgresql://..." bun run scripts/migrate-website-settings-domain.ts --force

# Cho Tazagroup
SITE_DOMAIN=tazagroup DATABASE_URL="postgresql://..." bun run scripts/migrate-website-settings-domain.ts --force
```

### Bước 3: Verify Migration

```sql
-- Kiểm tra số lượng settings theo domain
SELECT domain, COUNT(*) as count 
FROM "WebsiteSetting" 
GROUP BY domain;

-- Đảm bảo không còn settings với domain 'default'
SELECT COUNT(*) FROM "WebsiteSetting" WHERE domain = 'default';
```

## 🔧 Configuration

### Environment Variables

Mỗi domain cần có biến `SITE_DOMAIN` trong file `.env`:

| Domain    | SITE_DOMAIN |
|-----------|-------------|
| Rausach   | `rausach`   |
| Timona    | `timona`    |
| Tazagroup | `tazagroup` |

### Đã cập nhật trong các file:

- `env/.env.dev.rausach` ✅
- `env/.env.dev.timona` ✅
- `env/.env.dev.tazagroup` ✅
- `env/.env.prod.rausach` ✅
- `env/.env.prod.timona` ✅
- `env/.env.prod.tazagroup` ✅

## 📝 Code Changes

### Files đã thay đổi

1. **`backend/prisma/schema.prisma`**
   - Thêm trường `domain` với default `"default"`
   - Thêm unique constraint `@@unique([key, domain])`
   - Thêm index `@@index([domain])`

2. **`backend/src/graphql/resolvers/website-setting.resolver.ts`**
   - Thêm `domain` field vào ObjectType
   - Thêm helper `getCurrentDomain()` để lấy domain từ ENV
   - Tất cả queries/mutations đều filter theo domain

3. **`backend/src/graphql/dto/website-setting.input.ts`**
   - Thêm `domain` field vào `CreateWebsiteSettingInput`

4. **`backend/src/main.ts`**
   - Thêm Timona domain vào CORS origins

### Files mới tạo

1. **`backend/scripts/cleanup-timona-settings-from-rausach.ts`**
   - Script cleanup các settings Timona khỏi database Rausach

2. **`backend/scripts/migrate-website-settings-domain.ts`**
   - Script migrate domain field cho dữ liệu hiện có

## ⚠️ Lưu ý quan trọng

### Khi chạy seed scripts

1. **LUÔN KIỂM TRA** database URL trước khi chạy seed
2. **LUÔN ĐẶT** `SITE_DOMAIN` đúng với database đang seed
3. **SỬ DỤNG** naming convention nhất quán cho keys:
   - Rausach: `site.name`, `site.logo`, etc.
   - Timona: `site_name`, `site_logo`, etc.

### Fallback Logic

Resolver có fallback logic để tương thích ngược:
1. Tìm setting với domain hiện tại
2. Nếu không tìm thấy, fallback về domain `"default"`

### Cleanup nếu bị cross-contamination

```bash
# Ví dụ: Xóa settings Timona (underscore keys) khỏi Rausach database
bun run scripts/cleanup-timona-settings-from-rausach.ts
```

## 📊 Verification Checklist

- [ ] Prisma migration đã apply thành công cho cả 3 databases
- [ ] Dữ liệu đã được migrate với domain đúng
- [ ] Không còn settings với domain `"default"`
- [ ] Application khởi động không có lỗi
- [ ] WebsiteSetting queries trả về data đúng domain
- [ ] CORS hoạt động đúng cho tất cả domains

## 🔄 Rollback Plan

Nếu cần rollback:

1. Không xóa trường `domain` khỏi schema
2. Có thể đặt tất cả settings về domain `"default"`:
   ```sql
   UPDATE "WebsiteSetting" SET domain = 'default';
   ```
3. Application vẫn hoạt động với fallback logic
