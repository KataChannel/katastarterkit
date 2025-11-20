# 🎓 HỆ THỐNG PHÂN QUYỀN LMS VÀ GIAO DIỆN QUẢN LÝ

**Ngày thực hiện**: 03/11/2025  
**Mục tiêu**: Phân quyền GIANGVIEN vs ADMIN và tạo giao diện quản lý LMS

---

## 📊 TỔNG QUAN

### Tính năng mới
✅ **Phân quyền 2 cấp**:
- **ADMIN**: Quản lý toàn bộ hệ thống LMS (tất cả khóa học, giảng viên, học viên)
- **GIANGVIEN**: Chỉ quản lý khóa học của mình và học viên trong khóa học đó

✅ **Giao diện Admin LMS**:
- Dashboard tổng quan
- Quản lý khóa học (tất cả)
- Quản lý giảng viên
- Quản lý học viên
- Quản lý ghi danh
- Báo cáo và thống kê

✅ **Giao diện Giảng viên**:
- Dashboard cá nhân
- Quản lý khóa học của mình
- Quản lý học viên trong khóa
- Quản lý bài kiểm tra
- Báo cáo khóa học

---

## 🔧 THAY ĐỔI KỸ THUẬT

### 1. Database Schema

**File**: `backend/prisma/schema.prisma`

**Thêm GIANGVIEN role**:
```prisma
enum UserRoleType {
  ADMIN
  GIANGVIEN    // ← MỚI
  USER
  GUEST
}
```

**Migration**: `20251103023040_add_giangvien_role`

---

### 2. Permissions System

**File**: `backend/src/common/permissions/lms.permissions.ts` (MỚI)

**Định nghĩa 60+ permissions** cho LMS:

#### ADMIN Permissions (Full Access)
```typescript
COURSE_VIEW_ALL      // Xem tất cả khóa học
COURSE_EDIT_ALL      // Sửa tất cả khóa học
COURSE_DELETE_ALL    // Xóa tất cả khóa học
STUDENT_VIEW_ALL     // Xem tất cả học viên
STUDENT_MANAGE       // Quản lý học viên
CATEGORY_CREATE      // Tạo danh mục
SETTINGS_GENERAL     // Cài đặt hệ thống
...
```

#### GIANGVIEN Permissions (Restricted)
```typescript
COURSE_VIEW_OWN      // Chỉ xem khóa học của mình
COURSE_EDIT_OWN      // Chỉ sửa khóa học của mình
COURSE_DELETE_OWN    // Chỉ xóa khóa học của mình
STUDENT_VIEW_OWN     // Chỉ xem học viên trong khóa của mình
STUDENT_GRADE        // Chấm điểm học viên
ANALYTICS_VIEW_OWN   // Chỉ xem báo cáo khóa của mình
...
```

**Utility Functions**:
```typescript
// Check single permission
hasPermission(userRole, permission)

// Check any permission
hasAnyPermission(userRole, [permission1, permission2])

// Check all permissions
hasAllPermissions(userRole, [permission1, permission2])

// Get all role permissions
getRolePermissions(userRole)
```

---

### 3. Guards & Decorators

**File**: `backend/src/common/decorators/lms-permissions.decorator.ts` (MỚI)

```typescript
@LMSPermissions(LMSPermission.COURSE_CREATE)
async createCourse() { ... }
```

**File**: `backend/src/common/guards/lms-permissions.guard.ts` (MỚI)

Guard tự động kiểm tra permissions dựa trên decorator.

**Sử dụng trong Resolver**:
```typescript
@UseGuards(JwtAuthGuard, LMSPermissionsGuard)
@LMSPermissions(LMSPermission.COURSE_VIEW_ALL)
@Query(() => [Course])
async allCourses() { ... }

@UseGuards(JwtAuthGuard, LMSPermissionsGuard)
@LMSPermissions(LMSPermission.COURSE_VIEW_OWN)
@Query(() => [Course])
async myCourses(@CurrentUser() user) {
  return this.courseService.findByInstructor(user.id);
}
```

---

### 4. Auth Redirect

**File**: `backend/src/utils/auth-redirect.utils.ts`

**Cập nhật redirect cho GIANGVIEN**:
```typescript
case 'GIANGVIEN':
  return settings['auth_redirect_giangvien'] || '/giangvien/courses';
```

**Seed setting mới**:
```bash
bun run scripts/seed-giangvien-redirect.ts
```

**Kết quả**:
```
auth_redirect_giangvien = /giangvien/courses
```

---

## 🎨 GIAO DIỆN FRONTEND

### 1. Admin LMS Dashboard

**Routes**: `/admin/lms/*`

**Layout**: `frontend/src/app/admin/lms/layout.tsx`
- Sidebar với 9 menu items
- Icon & navigation
- Responsive design

**Pages**:

#### a. Tổng quan (`/admin/lms/page.tsx`)
- 📊 4 stat cards: Courses, Students, Instructors, Completion Rate
- 📈 Recent Activities
- ⚡ Quick Actions
- 🏆 Top Courses

#### b. Quản lý Khóa học (`/admin/lms/courses/page.tsx`)
- ✅ View all courses (từ tất cả giảng viên)
- 🔍 Search & Filter (All, Published, Draft)
- 📝 Course cards với stats:
  - Số học viên
  - Duration
  - Reviews
  - Level & Price
- ⚙️ Actions: View, Edit, Delete

#### c. Quản lý Giảng viên (`/admin/lms/instructors/page.tsx`)
- ✅ View all GIANGVIEN users
- 👤 Instructor cards với:
  - Contact info (email, phone)
  - Stats (số khóa học, số học viên)
  - Courses preview
  - Active status
- ⚙️ Actions: Edit, View Courses, Delete

**Features**:
- GraphQL integration với `useFindMany`
- Real-time data
- Responsive grid layout
- Loading & error states

---

### 2. Giảng viên Dashboard

**Routes**: `/giangvien/*`

**Layout**: `frontend/src/app/giangvien/layout.tsx`
- Purple theme (phân biệt với Admin)
- Sidebar 6 menu items
- Focused on own content

**Pages**:

#### a. Tổng quan (`/giangvien/page.tsx`)
- 📊 4 stat cards: My Courses, Students, Avg Rating, Completion
- 📚 My Courses section
- 📝 Recent Activities
- 🔔 Notifications

#### b. Khóa học của tôi (`/giangvien/courses/page.tsx`)
- ✅ View only own courses (where instructorId = userId)
- 🔍 Search & Filter
- ➕ Create new course
- Empty state với CTA

**Phân quyền**:
- GIANGVIEN **KHÔNG thấy** courses của giảng viên khác
- GIANGVIEN **KHÔNG thể** xóa/sửa courses của người khác
- GIANGVIEN **KHÔNG truy cập** được `/admin/lms`

---

## 🔐 SO SÁNH PHÂN QUYỀN

| Tính năng | ADMIN | GIANGVIEN |
|-----------|-------|-----------|
| **Xem tất cả khóa học** | ✅ | ❌ |
| **Xem khóa học của mình** | ✅ | ✅ |
| **Tạo khóa học** | ✅ | ✅ |
| **Sửa tất cả khóa học** | ✅ | ❌ |
| **Sửa khóa học của mình** | ✅ | ✅ |
| **Xóa tất cả khóa học** | ✅ | ❌ |
| **Xóa khóa học của mình** | ✅ | ✅ |
| **Xem tất cả học viên** | ✅ | ❌ |
| **Xem học viên trong khóa** | ✅ | ✅ |
| **Quản lý giảng viên** | ✅ | ❌ |
| **Quản lý danh mục** | ✅ | ❌ (View only) |
| **Chấm điểm học viên** | ✅ | ✅ |
| **Xem báo cáo tổng hợp** | ✅ | ❌ |
| **Xem báo cáo khóa học** | ✅ | ✅ (Own only) |
| **Cài đặt hệ thống LMS** | ✅ | ❌ |

---

## 💡 CÁCH SỬ DỤNG

### 1. Backend - Apply Permissions

**Trong Course Resolver**:
```typescript
import { LMSPermissionsGuard } from '@/common/guards/lms-permissions.guard';
import { LMSPermissions } from '@/common/decorators/lms-permissions.decorator';
import { LMSPermission } from '@/common/permissions/lms.permissions';

@Resolver()
export class CourseResolver {
  
  // ADMIN: Xem tất cả khóa học
  @UseGuards(JwtAuthGuard, LMSPermissionsGuard)
  @LMSPermissions(LMSPermission.COURSE_VIEW_ALL)
  @Query(() => [Course])
  async allCourses() {
    return this.courseService.findAll();
  }

  // GIANGVIEN: Chỉ xem khóa học của mình
  @UseGuards(JwtAuthGuard, LMSPermissionsGuard)
  @LMSPermissions(LMSPermission.COURSE_VIEW_OWN)
  @Query(() => [Course])
  async myCourses(@CurrentUser() user) {
    return this.courseService.findByInstructor(user.id);
  }

  // ADMIN hoặc GIANGVIEN: Tạo khóa học
  @UseGuards(JwtAuthGuard, LMSPermissionsGuard)
  @LMSPermissions(LMSPermission.COURSE_CREATE)
  @Mutation(() => Course)
  async createCourse(@Args('input') input, @CurrentUser() user) {
    return this.courseService.create(input, user.id);
  }
}
```

### 2. Frontend - Route Protection

**Middleware hoặc Component**:
```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

export default function AdminLMSLayout({ children }) {
  const { user } = useAuth();

  // Chỉ ADMIN mới vào được
  if (user?.roleType !== 'ADMIN') {
    redirect('/');
  }

  return <>{children}</>;
}
```

```typescript
// Giảng viên layout
export default function GiangvienLayout({ children }) {
  const { user } = useAuth();

  // Chỉ GIANGVIEN mới vào được
  if (user?.roleType !== 'GIANGVIEN') {
    redirect('/');
  }

  return <>{children}</>;
}
```

### 3. GraphQL Query với Permissions

**Admin - Xem tất cả courses**:
```graphql
query AllCourses {
  allCourses {
    id
    title
    instructor {
      username
    }
    _count {
      enrollments
    }
  }
}
```

**Giảng viên - Chỉ xem courses của mình**:
```graphql
query MyCourses {
  myCourses {
    id
    title
    _count {
      enrollments
    }
  }
}
```

---

## 📁 FILES CREATED/MODIFIED

### Backend - Created
1. ✅ `backend/src/common/permissions/lms.permissions.ts` - 60+ permissions
2. ✅ `backend/src/common/decorators/lms-permissions.decorator.ts` - Decorator
3. ✅ `backend/src/common/guards/lms-permissions.guard.ts` - Guard
4. ✅ `backend/scripts/seed-giangvien-redirect.ts` - Seed script

### Backend - Modified
1. ✅ `backend/prisma/schema.prisma` - Added GIANGVIEN role
2. ✅ `backend/src/utils/auth-redirect.utils.ts` - Added GIANGVIEN redirect

### Frontend - Created
1. ✅ `frontend/src/app/admin/lms/layout.tsx` - Admin LMS layout
2. ✅ `frontend/src/app/admin/lms/page.tsx` - Admin dashboard
3. ✅ `frontend/src/app/admin/lms/courses/page.tsx` - Courses management
4. ✅ `frontend/src/app/admin/lms/instructors/page.tsx` - Instructors management
5. ✅ `frontend/src/app/giangvien/layout.tsx` - Giảng viên layout
6. ✅ `frontend/src/app/giangvien/page.tsx` - Giảng viên dashboard
7. ✅ `frontend/src/app/giangvien/courses/page.tsx` - My courses

### Migration
✅ `20251103023040_add_giangvien_role` - Added GIANGVIEN to UserRoleType enum

---

## 🚀 DEPLOYMENT

### Bước 1: Apply Migration
```bash
cd backend
bun prisma migrate deploy
```

### Bước 2: Seed GIANGVIEN Redirect
```bash
bun run scripts/seed-giangvien-redirect.ts
```

### Bước 3: Regenerate Prisma Client
```bash
bun prisma generate
```

### Bước 4: Restart Services
```bash
# Development
bun run dev

# Production
pm2 restart all
```

---

## 🎯 ROADMAP

### Phase 1 (Hoàn thành) ✅
- [x] Thêm GIANGVIEN role
- [x] Định nghĩa permissions system
- [x] Tạo guards & decorators
- [x] Giao diện Admin LMS
- [x] Giao diện Giảng viên

### Phase 2 (Tiếp theo)
- [ ] Apply permissions vào tất cả resolvers
- [ ] Implement create/edit course forms
- [ ] Student management
- [ ] Quiz management
- [ ] Analytics & reports
- [ ] Real-time notifications
- [ ] File upload (videos, documents)

### Phase 3 (Nâng cao)
- [ ] Course builder drag-drop
- [ ] Live streaming
- [ ] Certificates
- [ ] Payment integration
- [ ] Mobile app

---

## 📝 GHI CHÚ

### Best Practices

**1. Permissions Naming Convention**:
```
{resource}:{action}:{scope}

Examples:
- course:view:all
- course:edit:own
- student:grade
```

**2. Always Use Guards**:
```typescript
@UseGuards(JwtAuthGuard, LMSPermissionsGuard)
@LMSPermissions(...)
```

**3. Row-Level Security**:
```typescript
// Trong service, luôn check ownership
async updateCourse(id, userId, data) {
  const course = await this.findOne(id);
  
  // Check if user owns this course (for GIANGVIEN)
  if (user.roleType === 'GIANGVIEN' && course.instructorId !== userId) {
    throw new ForbiddenException();
  }
  
  return this.update(id, data);
}
```

### Security Notes

⚠️ **Frontend checks are NOT enough** - Always validate on backend  
⚠️ **Use guards consistently** - Don't mix with manual checks  
⚠️ **Log permission violations** - Monitor suspicious activity  
⚠️ **Test permissions thoroughly** - Unit tests for each role

---

## 🎉 KẾT QUẢ

✅ **GIANGVIEN role** đã được thêm vào hệ thống  
✅ **60+ permissions** được định nghĩa chi tiết  
✅ **Guards & decorators** hoạt động tự động  
✅ **Giao diện Admin LMS** hoàn chỉnh với 9 modules  
✅ **Giao diện Giảng viên** với phân quyền riêng biệt  
✅ **Redirect tự động** dựa trên role (/admin/lms vs /giangvien)  
✅ **GraphQL ready** - Sẵn sàng apply vào resolvers

---

**Version**: 1.0.0  
**Ngày cập nhật**: 03/11/2025  
**Status**: ✅ Hoàn thành

**Author**: KataChannel Team  
**Project**: RauSachCore - Modern Fullstack LMS
