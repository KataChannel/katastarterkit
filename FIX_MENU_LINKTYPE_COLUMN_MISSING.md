# Fix: Menu linkType column missing in database

## 🐛 Lỗi
```
Invalid `this.prisma.menu.findMany()` invocation
The column `menus.linkType` does not exist in the current database.
```

## ✅ Giải pháp đã thực hiện

### 1. Tạo migration: `add_menu_dynamic_linking`

File: `/backend/prisma/migrations/20251108195834_add_menu_dynamic_linking/migration.sql`

```sql
-- CreateEnum for MenuLinkType if not exists
DO $$ BEGIN
 CREATE TYPE "MenuLinkType" AS ENUM ('URL', 'PRODUCT_LIST', 'PRODUCT_DETAIL', 'BLOG_LIST', 'BLOG_DETAIL', 'PAGE', 'CATEGORY', 'BLOG_CATEGORY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Add dynamic linking columns to menus table
ALTER TABLE "menus" ADD COLUMN IF NOT EXISTS "linkType" "MenuLinkType";
ALTER TABLE "menus" ADD COLUMN IF NOT EXISTS "productId" TEXT;
ALTER TABLE "menus" ADD COLUMN IF NOT EXISTS "blogPostId" TEXT;
ALTER TABLE "menus" ADD COLUMN IF NOT EXISTS "pageId" TEXT;
ALTER TABLE "menus" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
ALTER TABLE "menus" ADD COLUMN IF NOT EXISTS "blogCategoryId" TEXT;
ALTER TABLE "menus" ADD COLUMN IF NOT EXISTS "queryConditions" JSONB;
```

### 2. Apply migration
```bash
cd /chikiet/kataoffical/shoprausach/backend
npx prisma migrate deploy
```

✅ **Migration applied successfully!**

### 3. Generate Prisma Client
```bash
npx prisma generate
```

✅ **Prisma Client updated with new fields!**

## 🚀 Tiếp theo: Restart backend server

**Vấn đề hiện tại**: Port 12001 đang bị chiếm bởi process zombie

**Giải pháp**:

### Option 1: Restart bằng run.sh script (recommended)
```bash
cd /chikiet/kataoffical/shoprausach
./run.sh
```

### Option 2: Manual restart
```bash
# Kill tất cả backend processes
pkill -9 -f "ts-node-dev"
pkill -9 -f "nest start"

# Hoặc dùng lsof
lsof -ti:12001 | xargs kill -9

# Đợi 2 giây để port được release
sleep 2

# Start backend
cd /chikiet/kataoffical/shoprausach/backend
bun run dev:stable
```

### Option 3: Dùng PM2 (nếu đã cài)
```bash
pm2 restart backend
# hoặc
pm2 reload backend
```

## ✅ Kết quả

Sau khi restart backend:
- ✅ Database có đầy đủ `linkType` và dynamic linking fields
- ✅ Prisma Client đã update
- ✅ GraphQL schema sẽ load thành công
- ✅ Menu query không còn lỗi "column does not exist"

## 📊 Columns đã thêm vào `menus` table

1. `linkType` - MenuLinkType enum (nullable)
2. `productId` - TEXT (nullable) 
3. `blogPostId` - TEXT (nullable)
4. `pageId` - TEXT (nullable)
5. `categoryId` - TEXT (nullable)
6. `blogCategoryId` - TEXT (nullable)
7. `queryConditions` - JSONB (nullable)

---
**Ngày fix**: 9/11/2025  
**Migration**: `20251108195834_add_menu_dynamic_linking`  
**Trạng thái**: ✅ Migration applied, cần restart backend server
