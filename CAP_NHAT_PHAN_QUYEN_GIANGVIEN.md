# CẬP NHẬT HỆ THỐNG PHÂN QUYỀN GIẢNG VIÊN

## Tổng Quan
Chuyển đổi từ hệ thống phân quyền cứng (hardcoded `UserRoleType.GIANGVIEN`) sang hệ thống phân quyền linh hoạt dựa trên RBAC (Role-Based Access Control) cho giảng viên.

## Vấn Đề Trước Đây
- ❌ Giảng viên sử dụng enum `UserRoleType.GIANGVIEN` cứng trong database
- ❌ Không linh hoạt, khó mở rộng permissions
- ❌ Logic redirect dựa vào `roleType` thay vì permissions
- ❌ Khó tùy chỉnh quyền hạn cho từng giảng viên

## Giải Pháp Mới
- ✅ Loại bỏ `GIANGVIEN` khỏi enum `UserRoleType`
- ✅ Tạo role `giangvien` trong hệ thống RBAC
- ✅ 54 LMS permissions mới cho quản lý khóa học
- ✅ Logic redirect thông minh dựa trên assigned roles
- ✅ Dễ dàng tùy chỉnh permissions cho từng user

## Các Thay Đổi Chi Tiết

### 1. Database Schema (Prisma)
**File**: `backend/prisma/schema.prisma`

```prisma
// TRƯỚC
enum UserRoleType {
  ADMIN
  GIANGVIEN  // ❌ Bị xóa
  USER
  GUEST
}

// SAU
enum UserRoleType {
  ADMIN
  USER
  GUEST
}
```

### 2. LMS Permissions (54 permissions mới)
**File**: `backend/src/security/services/rbac-seeder.service.ts`

#### Nhóm Permissions:
- **Course Management** (7): create, read, update, delete, publish, manage_own, manage_all
- **Lesson Management** (4): create, read, update, delete
- **Module Management** (4): create, read, update, delete
- **Quiz Management** (5): create, read, update, delete, grade
- **Enrollment Management** (5): create, read, update, delete, approve
- **Review Management** (5): create, read, update, delete, moderate
- **Category Management** (4): create, read, update, delete
- **Document Management** (4): create, read, update, delete
- **Certificate Management** (4): create, read, issue, revoke
- **Discussion Management** (5): create, read, update, delete, moderate
- **Student Actions** (5): enroll, learn, take_quiz, view_progress, review

### 3. Role Giangvien
**Permissions được assign** (39 permissions):

```typescript
{
  name: 'giangvien',
  displayName: 'Giảng viên',
  description: 'Instructor role with full LMS course management capabilities',
  priority: 750,
  permissions: [
    // Course Management (Own courses)
    'lms:courses:create', 'lms:courses:read', 'lms:courses:update', 
    'lms:courses:delete', 'lms:courses:publish', 'lms:courses:manage_own',
    
    // Full Lesson, Module, Quiz Management
    'lms:lessons:*', 'lms:modules:*', 'lms:quizzes:*',
    
    // Enrollment & Review Management (Read + Moderate)
    'lms:enrollments:read', 'lms:enrollments:update', 'lms:enrollments:approve',
    'lms:reviews:read', 'lms:reviews:moderate',
    
    // Category (Read only)
    'lms:categories:read',
    
    // Full Document, Certificate, Discussion Management
    'lms:documents:*', 'lms:certificates:*', 'lms:discussions:*',
    
    // Basic access
    'content:read', 'analytics:read'
  ]
}
```

### 4. Auth Redirect Logic
**File**: `backend/src/utils/auth-redirect.utils.ts`

```typescript
// TRƯỚC - Dựa vào roleType
export async function getLoginRedirectUrl(userRole: string): Promise<string> {
  switch (userRole.toUpperCase()) {
    case 'GIANGVIEN':  // ❌ Hardcoded
      return '/lms/instructor';
  }
}

// SAU - Dựa vào assigned roles
export async function getLoginRedirectUrl(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { userRoles: { include: { role: true } } }
  });

  // Check giangvien role (priority cao nhất cho LMS)
  const hasGiangvienRole = user.userRoles.some(ur => ur.role.name === 'giangvien');
  if (hasGiangvienRole) {
    return settings['auth_redirect_giangvien'] || '/lms/instructor';
  }

  // Fallback to roleType
  switch (user.roleType.toUpperCase()) {
    case 'ADMIN': return '/admin';
    case 'USER': return '/dashboard';
    case 'GUEST': return '/courses';
  }
}
```

### 5. Login Resolvers
**File**: `backend/src/graphql/resolvers/user.resolver.ts`

```typescript
// TRƯỚC
const redirectUrl = await getLoginRedirectUrl(user.roleType);

// SAU
const redirectUrl = await getLoginRedirectUrl(user.id);
```

**Áp dụng cho các mutations**:
- `loginUser`
- `loginWithGoogle`
- `loginWithFacebook`
- `loginWithPhone`

## Scripts Hỗ Trợ

### 1. Seed RBAC (Standalone)
**File**: `backend/scripts/seed-rbac-standalone.ts`

Tạo:
- 54 LMS permissions
- Role `giangvien` với 39 permissions
- Không phụ thuộc NestJS (chạy độc lập)

```bash
bun run scripts/seed-rbac-standalone.ts
```

### 2. Migration Script
**File**: `backend/scripts/migrate-giangvien-to-role.ts`

Chuyển đổi users:
- Tìm users có `roleType = GIANGVIEN`
- Assign role `giangvien` vào
- Update `roleType` thành `USER`

```bash
bun run scripts/migrate-giangvien-to-role.ts
```

### 3. Verification Script
**File**: `backend/scripts/verify-migration.ts`

Kiểm tra:
- Users đã được assign role `giangvien`
- Có đủ 39 LMS permissions
- Redirect logic hoạt động đúng

```bash
bun run scripts/verify-migration.ts
```

## Quy Trình Migration

### Bước 1: Seed LMS Permissions & Role
```bash
cd backend
bun run scripts/seed-rbac-standalone.ts
```

**Kết quả**:
- ✅ 54 LMS permissions created
- ✅ Role `giangvien` created
- ✅ 39 permissions assigned to role

### Bước 2: Migrate Existing Users
```bash
bun run scripts/migrate-giangvien-to-role.ts
```

**Kết quả**:
- ✅ 2 users found with `GIANGVIEN` roleType
- ✅ Assigned `giangvien` role to both
- ✅ Updated roleType to `USER`

### Bước 3: Update Database Schema
```bash
bunx prisma db push --accept-data-loss
```

**Kết quả**:
- ✅ Removed `GIANGVIEN` from enum
- ✅ Schema synced with database
- ✅ Prisma Client regenerated

### Bước 4: Verify Migration
```bash
bun run scripts/verify-migration.ts
```

**Kết quả**:
- ✅ Users có `roleType = USER`
- ✅ Users có role `giangvien` với 39 permissions
- ✅ Redirect đến `/lms/instructor`

## Kết Quả Migration

### Users Được Migrate:
```
👤 touyen.ceo@tazagroup.vn
   roleType: USER
   Assigned Roles: 1
     - Giảng viên (giangvien)
       Permissions: 39
       Has LMS permissions: ✅ YES
   Expected redirect: /lms/instructor

👤 wetdragon1996@gmail.com
   roleType: USER
   Assigned Roles: 1
     - Giảng viên (giangvien)
       Permissions: 39
       Has LMS permissions: ✅ YES
   Expected redirect: /lms/instructor
```

## Lợi Ích Của Hệ Thống Mới

### 1. Linh Hoạt
- Có thể tạo nhiều instructor roles khác nhau
- Tùy chỉnh permissions cho từng giảng viên
- Dễ dàng thêm/bớt quyền mà không cần code

### 2. Mở Rộng
- Thêm permissions mới cho LMS dễ dàng
- Tạo role mới (senior instructor, teaching assistant, etc.)
- Kết hợp nhiều roles cho 1 user

### 3. Bảo Mật
- Permissions chi tiết hơn (own courses vs all courses)
- Scope-based access control
- Audit trail đầy đủ

### 4. Backward Compatible
- Users không có role vẫn dùng `roleType`
- Redirect logic fallback về `roleType`
- Không ảnh hưởng existing functionality

## Cách Sử Dụng

### Tạo Giảng Viên Mới
```typescript
// 1. Tạo user với roleType = USER
const user = await prisma.user.create({
  data: {
    email: 'newteacher@example.com',
    username: 'newteacher',
    password: hashedPassword,
    roleType: 'USER',  // Không dùng GIANGVIEN nữa
    isVerified: true,
  }
});

// 2. Assign role giangvien
const giangvienRole = await prisma.role.findUnique({
  where: { name: 'giangvien' }
});

await prisma.userRoleAssignment.create({
  data: {
    userId: user.id,
    roleId: giangvienRole.id,
    effect: 'allow',
  }
});
```

### Kiểm Tra Permissions
```typescript
// Check if user is instructor
const hasInstructorRole = await prisma.userRoleAssignment.findFirst({
  where: {
    userId: user.id,
    role: { name: 'giangvien' }
  }
});

// Check specific permission
const canCreateCourse = await checkUserPermission(
  user.id,
  'lms:courses:create'
);
```

### Tùy Chỉnh Permissions
```typescript
// Add extra permission to specific instructor
await prisma.userPermission.create({
  data: {
    userId: instructorId,
    permissionId: 'lms:courses:manage_all', // Can manage ALL courses
    effect: 'allow',
  }
});

// Revoke permission
await prisma.rolePermission.update({
  where: { 
    roleId_permissionId: {
      roleId: giangvienRole.id,
      permissionId: deletePermissionId
    }
  },
  data: { effect: 'deny' }
});
```

## Files Thay Đổi

### Backend
- `backend/prisma/schema.prisma` - Removed GIANGVIEN enum
- `backend/src/security/services/rbac-seeder.service.ts` - Added LMS permissions & giangvien role
- `backend/src/utils/auth-redirect.utils.ts` - Role-based redirect logic
- `backend/src/graphql/resolvers/user.resolver.ts` - Updated login mutations

### Scripts
- `backend/scripts/seed-rbac-standalone.ts` - Standalone RBAC seeder
- `backend/scripts/migrate-giangvien-to-role.ts` - Migration script
- `backend/scripts/verify-migration.ts` - Verification script

## Testing

### Test Login Flow
1. Login với email: `touyen.ceo@tazagroup.vn`
2. Verify redirect đến: `http://localhost:13000/lms/instructor`
3. Check permissions trong LMS admin dashboard
4. Verify có thể tạo/sửa/xóa courses

### Test Permissions
```graphql
query TestInstructorPermissions {
  getMe {
    id
    email
    roleType
    userRoles {
      role {
        name
        displayName
        permissions {
          permission {
            name
            displayName
          }
        }
      }
    }
  }
}
```

## Troubleshooting

### Vấn đề: Invalid input value for enum "UserRoleType": "GIANGVIEN"
**Nguyên nhân**: Database có records với `roleType = 'GIANGVIEN'` nhưng enum đã bị xóa khỏi schema.

**Giải pháp**:
```bash
# Bước 1: Add GIANGVIEN back vào schema.prisma tạm thời
# Edit: backend/prisma/schema.prisma
enum UserRoleType {
  ADMIN
  GIANGVIEN  # Add lại
  USER
  GUEST
}

# Bước 2: Push schema để add enum vào database
bunx prisma db push

# Bước 3: Run migration để convert users
bun run scripts/migrate-giangvien-to-role.ts

# Bước 4: Remove GIANGVIEN khỏi schema
enum UserRoleType {
  ADMIN
  USER
  GUEST
}

# Bước 5: Push lại schema (final)
bunx prisma db push --accept-data-loss

# Bước 6: Verify
bun run scripts/verify-migration.ts

# Bước 7: Restart backend server
```

### Vấn đề: User không redirect đến /lms/instructor
**Giải pháp**:
```bash
# Kiểm tra user có role giangvien
bun run scripts/verify-migration.ts

# Re-assign role nếu cần
bun run scripts/migrate-giangvien-to-role.ts
```

### Vấn đề: Thiếu permissions
**Giải pháp**:
```bash
# Re-run seeder
bun run scripts/seed-rbac-standalone.ts
```

### Vấn đề: Database enum vẫn còn GIANGVIEN
**Giải pháp**:
```bash
# Force push schema
bunx prisma db push --accept-data-loss

# Hoặc tạo migration
bunx prisma migrate dev --name remove_giangvien
```

## Notes

### ⚠️ Breaking Changes
- Không thể dùng `UserRoleType.GIANGVIEN` nữa
- Phải dùng role assignment thay vì enum
- Login redirect logic thay đổi từ `roleType` sang `userId`

### ✅ Backward Compatibility
- Users không có role vẫn hoạt động bình thường
- `roleType` vẫn được sử dụng làm fallback
- Existing redirect settings vẫn hoạt động

### 🚀 Future Improvements
- Add scope-based permission checking (own vs all courses)
- Implement permission conditions (JSON-based)
- Add permission templates for quick role creation
- Create UI for permission management

## Kết Luận

Hệ thống phân quyền mới:
- ✅ Linh hoạt và dễ mở rộng
- ✅ Tuân thủ Clean Architecture
- ✅ Reusable cho các modules khác
- ✅ Maintainable và scalable
- ✅ Không ảnh hưởng existing users

**Tất cả giảng viên hiện tại đã được migrate thành công và sẵn sàng sử dụng!** 🎉
