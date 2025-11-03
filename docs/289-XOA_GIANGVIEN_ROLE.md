# 🗑️ XÓA ROLE GIANGVIEN

## 📋 Tổng Quan

**Ngày Thực Hiện**: 03/11/2025  
**Mục Đích**: Loại bỏ role `GIANGVIEN` khỏi hệ thống để đơn giản hóa RBAC

## ✅ Các Thay Đổi Đã Thực Hiện

### 1. Schema Changes

**File**: `/backend/prisma/schema.prisma`

**Before**:
```prisma
enum UserRoleType {
  ADMIN
  GIANGVIEN  ← Đã xóa
  USER
  GUEST
}
```

**After**:
```prisma
enum UserRoleType {
  ADMIN
  USER
  GUEST
}
```

### 2. Database Migration

**Migration**: `20251103011604_remove_giangvien_role`

**SQL**:
```sql
-- AlterEnum
BEGIN;
CREATE TYPE "UserRoleType_new" AS ENUM ('ADMIN', 'USER', 'GUEST');
ALTER TABLE "public"."users" ALTER COLUMN "roleType" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "roleType" TYPE "UserRoleType_new" 
  USING ("roleType"::text::"UserRoleType_new");
ALTER TYPE "UserRoleType" RENAME TO "UserRoleType_old";
ALTER TYPE "UserRoleType_new" RENAME TO "UserRoleType";
DROP TYPE "public"."UserRoleType_old";
ALTER TABLE "users" ALTER COLUMN "roleType" SET DEFAULT 'USER';
COMMIT;
```

**Cơ chế**:
- Tạo enum type mới không có GIANGVIEN
- Migrate data từ enum cũ sang enum mới
- Xóa enum cũ
- Rename enum mới thành tên gốc

### 3. Scripts Updated

#### A. Xóa Script

**Deleted**: `/backend/scripts/add-giangvien-role.ts`
- Script này không còn cần thiết vì role đã bị xóa

#### B. Update Script

**File**: `/backend/scripts/list-users-roles.ts`

**Changes**:
```typescript
// BEFORE
const roleGroups: Record<string, typeof users> = {
  ADMIN: [],
  GIANGVIEN: [],  ← Đã xóa
  USER: [],
  GUEST: []
};

// AFTER
const roleGroups: Record<string, typeof users> = {
  ADMIN: [],
  USER: [],
  GUEST: []
};
```

Xóa các đoạn code hiển thị GIANGVIEN users.

#### C. Migration Script

**Created**: `/backend/scripts/remove-giangvien-role.ts`
- Script để check và convert GIANGVIEN users sang USER
- Tự động hóa quá trình migration

### 4. TypeScript Types

Prisma Client đã được regenerate:
- Type `UserRoleType` không còn include `'GIANGVIEN'`
- Type-safe: code sử dụng `GIANGVIEN` sẽ báo lỗi compile

## 📊 Impact Analysis

### Users Affected

```bash
# Check users with GIANGVIEN role (before migration)
SELECT COUNT(*) FROM users WHERE "roleType" = 'GIANGVIEN';
# Result: 0 users
```

**Kết luận**: Không có user nào bị ảnh hưởng vì không có user với role GIANGVIEN.

### Code Impact

**Files Changed**:
1. ✅ `schema.prisma` - Xóa GIANGVIEN từ enum
2. ✅ `list-users-roles.ts` - Xóa logic xử lý GIANGVIEN
3. ✅ `add-giangvien-role.ts` - Deleted
4. ✅ Migration created: `20251103011604_remove_giangvien_role`

**Files NOT Impacted**:
- No backend TypeScript code was using `UserRoleType.GIANGVIEN`
- No GraphQL resolvers affected
- No frontend code affected

## 🎯 Lý Do Xóa GIANGVIEN

### 1. **Simplified RBAC System**

**Before** (4 roles):
- ADMIN
- GIANGVIEN
- USER  
- GUEST

**After** (3 roles):
- ADMIN
- USER
- GUEST

### 2. **Sử Dụng RBAC System Mới**

Thay vì dùng `UserRoleType` enum đơn giản, hệ thống đã chuyển sang **RBAC system phức tạp** với:
- ✅ 7 roles (super_admin, admin, manager, team_lead, user, viewer, guest)
- ✅ 39 permissions
- ✅ Dynamic role assignment
- ✅ Permission-based access control

**Ví dụ**: Thay vì tạo role GIANGVIEN trong enum, có thể tạo role mới trong RBAC:
```typescript
// Create 'instructor' role in RBAC system
await rbacService.createRole({
  name: 'instructor',
  displayName: 'LMS Instructor',
  description: 'Instructor for LMS courses',
  priority: 750
});

// Assign LMS permissions
await rbacService.assignPermissionsToRole(role.id, [
  'courses:create',
  'courses:update',
  'lessons:create',
  'students:read'
]);
```

### 3. **Avoid Enum Limitations**

**Vấn đề với Enum**:
- ❌ Không thể thêm/xóa values dễ dàng (cần migration phức tạp)
- ❌ Không flexible (fixed values)
- ❌ Không có hierarchy
- ❌ Không có permissions granular

**Ưu điểm RBAC**:
- ✅ Dynamic roles (tạo/xóa roles dễ dàng)
- ✅ Flexible permissions
- ✅ Role hierarchy với priority
- ✅ Granular access control

## 🔄 Migration Process

### Step 1: Check Existing Data

```bash
cd backend
bun run scripts/remove-giangvien-role.ts
```

**Output**:
```
🔍 Checking for users with GIANGVIEN role...
✅ No users with GIANGVIEN role found
```

### Step 2: Update Schema

```prisma
enum UserRoleType {
  ADMIN
  // GIANGVIEN ← Removed
  USER
  GUEST
}
```

### Step 3: Generate Prisma Client

```bash
bun prisma generate
```

### Step 4: Create Migration

```bash
bun prisma migrate dev --name remove_giangvien_role
```

**Result**:
```
✔ Migration `20251103011604_remove_giangvien_role` created and applied
Your database is now in sync with your schema.
```

## 📝 Checklist

- [x] Update `schema.prisma` - Xóa GIANGVIEN
- [x] Delete `add-giangvien-role.ts` script
- [x] Update `list-users-roles.ts` script
- [x] Create migration script `remove-giangvien-role.ts`
- [x] Generate Prisma Client
- [x] Create migration `remove_giangvien_role`
- [x] Apply migration to database
- [x] Verify no data loss
- [x] Document changes

## 🚨 Rollback Plan (Nếu Cần)

Nếu cần khôi phục GIANGVIEN role:

### 1. Revert Schema

```prisma
enum UserRoleType {
  ADMIN
  GIANGVIEN
  USER
  GUEST
}
```

### 2. Create Migration

```bash
bun prisma migrate dev --name add_back_giangvien_role
```

### 3. Restore Scripts

```bash
git checkout HEAD~1 -- backend/scripts/add-giangvien-role.ts
git checkout HEAD~1 -- backend/scripts/list-users-roles.ts
```

## 🎯 Next Steps

### 1. **Use RBAC System for LMS Roles**

Nếu cần role cho LMS instructors, tạo trong RBAC system:

```typescript
// Create instructor role
const instructorRole = await rbacService.createRole({
  name: 'instructor',
  displayName: 'LMS Instructor',
  description: 'Instructor for LMS courses',
  priority: 750
});

// Create LMS permissions
const lmsPermissions = [
  { name: 'lms:courses:create', displayName: 'Create Courses' },
  { name: 'lms:courses:update', displayName: 'Update Courses' },
  { name: 'lms:courses:delete', displayName: 'Delete Courses' },
  { name: 'lms:lessons:create', displayName: 'Create Lessons' },
  { name: 'lms:students:read', displayName: 'View Students' },
];

// Assign permissions to instructor role
for (const perm of lmsPermissions) {
  const permission = await rbacService.createPermission(perm);
  await rbacService.assignPermissionsToRole(instructorRole.id, [permission.id]);
}
```

### 2. **Simplify User Model**

Có thể xem xét **hoàn toàn loại bỏ `roleType` field** khỏi User model:

```prisma
model User {
  id String @id @default(uuid())
  email String @unique
  // roleType UserRoleType @default(USER) ← Có thể xóa
  
  // Chỉ dùng RBAC system
  userRoles UserRole[]
  userPermissions UserPermission[]
}
```

**Benefits**:
- ✅ Single source of truth (chỉ RBAC)
- ✅ No duplicate role logic
- ✅ More flexible

### 3. **Update Documentation**

- [x] Create `XOA_GIANGVIEN_ROLE.md`
- [ ] Update `TONG_HOP_TINH_NANG_VA_PHAN_QUYEN.md`
- [ ] Update API documentation
- [ ] Update frontend role checks

## 📞 Contact

Nếu có vấn đề sau khi xóa GIANGVIEN role:
- Email: katachanneloffical@gmail.com
- Phone: 0977272967

---

**Version**: 1.0.0  
**Author**: AI Assistant  
**Date**: 03/11/2025
