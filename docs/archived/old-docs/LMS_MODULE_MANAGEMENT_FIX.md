# 🔧 Fix Bug: Quản Lý Module trong Khóa Học LMS

## 📋 Tóm Tắt
Fix bug về quyền truy cập khi tạo Module (Chương trình học) trong hệ thống LMS. Instructor không thể tạo module vì resolver yêu cầu role ADMIN.

---

## 🐛 Bug Phát Hiện

### Vấn Đề
Khi instructor cố gắng tạo module cho khóa học của mình:
- **Dashboard → My Courses → Edit Course → Add Module**
- Lỗi: `403 Forbidden` - Yêu cầu role ADMIN
- Frontend hiển thị form nhưng mutation bị reject

### Nguyên Nhân
Resolver `createModule`, `updateModule`, `deleteModule`, và các mutation liên quan đều có:
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleType.ADMIN)  // ❌ Chỉ ADMIN mới được phép!
```

Trong khi logic nghiệp vụ:
- Instructor cần tạo module cho khóa học của họ
- Service layer đã có kiểm tra ownership (instructor owns course)
- Role guard không cần thiết ở resolver level

---

## ✅ Giải Pháp

### File Đã Fix
**`backend/src/lms/courses/courses.resolver.ts`**

### Thay Đổi
Loại bỏ `@Roles(UserRoleType.ADMIN)` khỏi các mutation:

#### Module Mutations
```typescript
// ✅ FIXED: Chuyển từ @Roles(ADMIN) sang JwtAuthGuard
// Service layer sẽ kiểm tra ownership của course

@Mutation(() => CourseModule, { name: 'createModule' })
@UseGuards(JwtAuthGuard)  // Chỉ cần login
createModule(
  @CurrentUser() user: any,
  @Args('input') input: CreateModuleInput,
) {
  return this.coursesService.createModule(user.id, input);
}

@Mutation(() => CourseModule, { name: 'updateModule' })
@UseGuards(JwtAuthGuard)
updateModule(...) { ... }

@Mutation(() => Boolean, { name: 'deleteModule' })
@UseGuards(JwtAuthGuard)
deleteModule(...) { ... }

@Mutation(() => [CourseModule], { name: 'reorderModules' })
@UseGuards(JwtAuthGuard)
reorderModules(...) { ... }
```

#### Lesson Mutations (Tương tự)
```typescript
@Mutation(() => Lesson, { name: 'createLesson' })
@UseGuards(JwtAuthGuard)
createLesson(...) { ... }

@Mutation(() => Lesson, { name: 'updateLesson' })
@UseGuards(JwtAuthGuard)
updateLesson(...) { ... }

@Mutation(() => Boolean, { name: 'deleteLesson' })
@UseGuards(JwtAuthGuard)
deleteLesson(...) { ... }

@Mutation(() => [Lesson], { name: 'reorderLessons' })
@UseGuards(JwtAuthGuard)
reorderLessons(...) { ... }
```

### Bảo Mật Vẫn Được Đảm Bảo
Service layer (`courses.service.ts`) đã có logic kiểm tra:

```typescript
async createModule(userId: string, input: CreateModuleInput) {
  // ✅ Verify user owns the course
  const course = await this.prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new NotFoundException('Course not found');
  }

  if (course.instructorId !== userId) {
    throw new ForbiddenException('You do not have permission...');
  }
  
  // ... create module
}
```

---

## 🎯 Cách Sử Dụng

### Bước 1: Đi đến Dashboard
```
/lms/instructor/dashboard
```

### Bước 2: Chọn Khóa Học
- Click **Edit** (icon bút chì) trên khóa học
- Hoặc tạo khóa học mới

### Bước 3: Tạo Module
- Navigate đến tab **Modules**
- Click **Add Module**
- Điền thông tin:
  - **Title**: Tên module (VD: "Module 1: Giới thiệu")
  - **Description**: Mô tả (optional)
  - **Order**: Thứ tự hiển thị (tự động nếu không điền)

### Bước 4: Quản Lý Module
- **Edit**: Sửa tên, mô tả
- **Delete**: Xóa module
- **Reorder**: Kéo thả để sắp xếp
- **Add Lesson**: Thêm bài học vào module

---

## 🧪 Testing

### Test Case 1: Tạo Module Mới
```graphql
mutation CreateModule {
  createModule(input: {
    courseId: "course-id"
    title: "Module 1: Getting Started"
    description: "Introduction to the course"
  }) {
    id
    title
    order
  }
}
```

**Expected**: ✅ Module được tạo thành công

### Test Case 2: Update Module
```graphql
mutation UpdateModule {
  updateModule(input: {
    id: "module-id"
    title: "Module 1: Updated Title"
  }) {
    id
    title
  }
}
```

**Expected**: ✅ Module được cập nhật

### Test Case 3: Unauthorized Access
- User A cố sửa module của course thuộc User B
- **Expected**: ❌ `403 ForbiddenException`

---

## 📊 Impact

### Trước Fix
- ❌ Chỉ ADMIN mới tạo được module
- ❌ Instructor không thể quản lý khóa học
- ❌ Workflow tạo khóa học bị gián đoạn

### Sau Fix
- ✅ Instructor tạo module cho khóa học của họ
- ✅ Ownership được kiểm tra ở service layer
- ✅ Workflow hoàn chỉnh: Create Course → Add Modules → Add Lessons → Publish

---

## 🔐 Security Notes

### Authorization Layers
1. **Resolver Layer**: `@UseGuards(JwtAuthGuard)` - Chỉ cần login
2. **Service Layer**: Kiểm tra ownership - User owns course?
3. **Database**: Foreign key constraints

### Best Practices
- Role guard ở resolver: Cho permissions toàn hệ thống (ADMIN-only features)
- Ownership check ở service: Cho resource-specific permissions
- Frontend cũng nên validate UI (hide buttons if not owner)

---

## 📝 Files Changed

### Backend
- `backend/src/lms/courses/courses.resolver.ts` - Loại bỏ role guards

### Frontend (Already Using Dynamic GraphQL)
- `frontend/src/components/lms/wizard/ModulesStep.tsx` - Module management UI
- Frontend đã dùng `useCreateOne('module')` - Dynamic GraphQL

---

## ✅ Checklist

- [x] Fix resolver role guards
- [x] Verify service layer có ownership check
- [x] Test create module
- [x] Test update module
- [x] Test delete module
- [x] Test unauthorized access
- [x] Tạo tài liệu

---

## 🚀 Deploy Notes

Sau khi fix:
1. Restart backend server
2. Clear GraphQL cache (nếu có)
3. Test trên môi trường dev trước
4. Deploy lên production

---

**Ngày fix**: 30/10/2025
**Người fix**: GitHub Copilot
**Status**: ✅ Completed
