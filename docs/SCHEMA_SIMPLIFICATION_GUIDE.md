# 🎯 InnerBright Schema Simplification Guide

## ✨ Tổng Quan

Đã đơn giản hóa schema từ **107 models** xuống còn **18 models** cốt lõi.

### 📦 Các Module Được Giữ Lại:

1. **Authentication & User Management** (5 models)
   - User
   - AuthMethod
   - VerificationToken  
   - UserSession
   - AuditLog

2. **RBAC - Role Based Access Control** (5 models)
   - Role
   - Permission
   - UserRoleAssignment
   - RolePermission
   - UserPermission

3. **Menu Management** (2 models)
   - Menu
   - MenuItem

4. **Page Builder** (2 models)
   - Page
   - Block

5. **Blog/Posts System** (4 models)
   - Category
   - Tag
   - Post
   - Comment
   - Like

6. **System Settings** (1 model)
   - WebsiteSetting

## 📊 So Sánh Trước/Sau

### ❌ Models Đã Xóa (89 models):

**E-commerce**: Product, ProductVariant, Cart, Order, Payment, Shipping, etc.
**LMS**: Course, Lesson, Module, Quiz, Student, Enrollment, etc.
**Affiliate**: AffiliateProgram, Commission, Referral, etc.
**Task Management**: Task, TaskComment, TaskActivity, etc.
**Advanced Features**: Notification, Analytics, SEO, Social, etc.

### ✅ Schema Mới (18 models):

```
Authentication (5) → User, AuthMethod, Token, Session, AuditLog
RBAC (5) → Role, Permission, + Assignment tables
Content (9) → Menu, Page, Block, Post, Category, Tag, Comment, Like
Settings (1) → WebsiteSetting
```

## 🚀 Migration Steps

### Bước 1: Backup Database Hiện Tại

```bash
cd backend
bun db:backup
# hoặc
bun prisma/backup.ts
```

### Bước 2: Tạo Migration (DRY RUN)

```bash
# Xem preview migration
bun prisma migrate dev --name simplify_to_core_models --create-only

# File migration sẽ được tạo tại:
# backend/prisma/migrations/YYYYMMDDHHMMSS_simplify_to_core_models/
```

### Bước 3: Review Migration SQL

Kiểm tra file `.sql` trong thư mục migration để đảm bảo:
- ✅ Các table cần giữ không bị drop
- ✅ Foreign keys được xử lý đúng
- ✅ Data quan trọng không bị mất

### Bước 4: Apply Migration

**⚠️ CẢNH BÁO: Bước này sẽ XÓA DATA!**

```bash
# Apply migration lên database
bun prisma migrate dev

# Hoặc production
bun prisma migrate deploy
```

### Bước 5: Generate Prisma Client Mới

```bash
bun prisma generate
```

### Bước 6: Restart Backend

```bash
# Development
bun run dev

# Production
docker-compose restart backend
```

## 🔄 Rollback Plan

Nếu cần rollback về schema cũ:

### Option 1: Restore từ Backup

```bash
cd backend
bun db:restore
# Restore toàn bộ data từ backup
```

### Option 2: Restore Schema File

```bash
cd backend/prisma
cp schema.prisma.backup schema.prisma
bun prisma generate
```

## 📝 Cập Nhật Code

### 1. GraphQL Schema

Xóa các resolvers không dùng:

```bash
cd backend/src
# Xóa các resolvers cho modules đã remove
rm -rf lms/
rm -rf ecommerce/
rm -rf affiliate/
rm -rf tasks/
# ... etc
```

Giữ lại:
- `auth/` - Authentication
- `users/` - User management
- `rbac/` - Role & Permissions
- `menu/` - Menu management
- `pages/` - Page builder
- `posts/` - Blog system
- `website-settings/` - Settings

### 2. Update GraphQL Type Definitions

```bash
# File cần update
backend/src/schema.gql
```

Xóa các types không dùng:
- Product, Order, Cart
- Course, Lesson, Module
- Task, TaskComment
- Notification, Analytics
- ... etc

### 3. Update Services & Modules

Xóa các service modules:
```
backend/src/
  ├── auth/ ✅ GIỮ
  ├── users/ ✅ GIỮ
  ├── rbac/ ✅ GIỮ
  ├── menu/ ✅ GIỮ
  ├── pages/ ✅ GIỮ
  ├── posts/ ✅ GIỮ
  ├── website-settings/ ✅ GIỮ
  ├── ecommerce/ ❌ XÓA
  ├── lms/ ❌ XÓA
  ├── tasks/ ❌ XÓA
  ├── notifications/ ❌ XÓA
  └── ... (các module khác)
```

## 🧪 Testing

### Test Checklist:

- [ ] Authentication hoạt động (login/register)
- [ ] User management (CRUD users)
- [ ] RBAC (roles & permissions)
- [ ] Menu management (create/update menus)
- [ ] Page builder (create/edit pages)
- [ ] Blog system (posts, comments, likes)
- [ ] Website settings (update config)

### Test Commands:

```bash
# Run tests
cd backend
bun test

# Test specific modules
bun test auth
bun test users
bun test posts
```

## 📌 Important Notes

### Data Loss Warning:

⚠️ **CÁC DATA SAU SẼ BỊ MẤT:**

- Tất cả products, orders, payments (E-commerce)
- Tất cả courses, lessons, enrollments (LMS)
- Tất cả tasks, task comments (Task Management)
- Tất cả notifications
- Tất cả analytics data
- ... và 89 tables khác

### Data Được Giữ Lại:

✅ **CÁC DATA NÀY SẼ ĐƯỢC GIỮ:**

- Users & authentication
- Roles & permissions
- Menus & menu items
- Pages & blocks (page builder)
- Posts, comments, likes
- Categories & tags
- Website settings

## 🛠️ Troubleshooting

### Error: Foreign Key Constraints

Nếu gặp lỗi foreign key khi migrate:

```sql
-- Thêm vào đầu migration file
SET session_replication_role = 'replica';

-- ... your migration SQL ...

SET session_replication_role = 'origin';
```

### Error: Migration Failed

```bash
# Reset database (⚠️ XÓA TẤT CẢ DATA)
bun prisma migrate reset

# Apply migrations again
bun prisma migrate dev
```

### Error: Prisma Client Out of Sync

```bash
# Regenerate Prisma Client
bun prisma generate

# Clear node_modules và reinstall
rm -rf node_modules
bun install
```

## 📦 Files Changed

### Modified:
- `backend/prisma/schema.prisma` - Simplified schema (18 models)

### Backup Created:
- `backend/prisma/schema.prisma.backup` - Original schema (107 models)
- `backend/prisma/schema.core.prisma` - Reference core schema

### To Be Deleted:
- GraphQL resolvers cho các modules không dùng
- Service files cho các modules không dùng
- Test files cho các modules không dùng

## 🎯 Next Steps

1. ✅ Review simplified schema
2. ⏳ Backup current database
3. ⏳ Create migration
4. ⏳ Apply migration
5. ⏳ Update GraphQL schema
6. ⏳ Delete unused code
7. ⏳ Run tests
8. ⏳ Deploy to production

## 📞 Support

Nếu cần help, tham khảo:
- Original schema: `backend/prisma/schema.prisma.backup`
- Core schema: `backend/prisma/schema.core.prisma`
- This guide: `docs/SCHEMA_SIMPLIFICATION_GUIDE.md`
