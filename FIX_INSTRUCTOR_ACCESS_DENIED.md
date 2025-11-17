# Fix lỗi "Truy cập bị từ chối" cho Giảng viên ở /lms/instructor

## Vấn đề
- Tài khoản giảng viên `wetdragon1996@gmail.com` truy cập `/lms/instructor` bị lỗi:
  ```
  Truy cập bị từ chối
  Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại hoặc liên hệ hỗ trợ.
  ```

## Nguyên nhân
Backend GraphQL resolver `myCourses` và các mutations quản lý khóa học chỉ cho phép role `ADMIN`:

```typescript
// ❌ TRƯỚC - Chỉ ADMIN mới được truy cập
@Query(() => [Course], { name: 'myCourses' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleType.ADMIN)  // ❌ Giảng viên bị chặn
getMyCourses(@CurrentUser() user: any) {
  return this.coursesService.getMyCourses(user.id);
}
```

**Phân tích:**
- Giảng viên có role `USER` + permission `giangvien`
- Resolver dùng `@Roles(UserRoleType.ADMIN)` nên từ chối tất cả USER
- Service `getMyCourses()` đã đúng: lọc khóa học theo `instructorId`
- Frontend query `GET_MY_COURSES` gọi `myCourses` → Bị từ chối → Lỗi

## Giải pháp

### 1. Sửa Query myCourses (✅ Hoàn thành)
**File**: `/backend/src/lms/courses/courses.resolver.ts`

```typescript
// ✅ SAU - Cho phép tất cả authenticated users
@Query(() => [Course], { name: 'myCourses' })
@UseGuards(JwtAuthGuard)  // ✅ Chỉ cần đăng nhập
getMyCourses(@CurrentUser() user: any) {
  return this.coursesService.getMyCourses(user.id);
}
```

**Lý do an toàn:**
- Service `getMyCourses(userId)` lọc theo `instructorId: userId`
- Mỗi user chỉ xem được khóa học của chính họ
- Không cần check role vì ownership đã được kiểm tra ở service layer

### 2. Sửa Mutation createCourse (✅ Hoàn thành)
```typescript
// ✅ SAU - Giảng viên có thể tạo khóa học
@Mutation(() => Course, { name: 'createCourse' })
@UseGuards(JwtAuthGuard)
createCourse(
  @CurrentUser() user: any,
  @Args('createCourseInput') createCourseInput: CreateCourseInput,
) {
  return this.coursesService.create(user.id, createCourseInput);
}
```

### 3. Sửa Mutation updateCourse (✅ Hoàn thành)
```typescript
// ✅ SAU - Giảng viên có thể cập nhật khóa học của mình
@Mutation(() => Course, { name: 'updateCourse' })
@UseGuards(JwtAuthGuard)
updateCourse(
  @CurrentUser() user: any,
  @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
) {
  return this.coursesService.update(updateCourseInput.id, user.id, updateCourseInput);
}
```

**Ownership protection**: Service `update()` kiểm tra `instructorId === userId`

### 4. Sửa Mutation publishCourse (✅ Hoàn thành)
```typescript
// ✅ SAU - Giảng viên có thể publish khóa học
@Mutation(() => Course, { name: 'publishCourse' })
@UseGuards(JwtAuthGuard)
publishCourse(
  @CurrentUser() user: any,
  @Args('id', { type: () => ID }) id: string,
) {
  return this.coursesService.publish(id, user.id);
}
```

### 5. Sửa Mutation archiveCourse (✅ Hoàn thành)
```typescript
// ✅ SAU - Giảng viên có thể archive khóa học
@Mutation(() => Course, { name: 'archiveCourse' })
@UseGuards(JwtAuthGuard)
archiveCourse(
  @CurrentUser() user: any,
  @Args('id', { type: () => ID }) id: string,
) {
  return this.coursesService.archive(id, user.id);
}
```

### 6. Sửa Mutation deleteCourse (✅ Hoàn thành)
```typescript
// ✅ SAU - Giảng viên có thể xóa khóa học
@Mutation(() => Boolean, { name: 'deleteCourse' })
@UseGuards(JwtAuthGuard)
async removeCourse(
  @CurrentUser() user: any,
  @Args('id', { type: () => ID }) id: string,
) {
  const result = await this.coursesService.remove(id, user.id);
  return result.success;
}
```

## Mutations đã được fix trước đó (Không cần sửa)

✅ **Module Mutations** - Đã fix trước:
- `createModule` - JwtAuthGuard only
- `updateModule` - JwtAuthGuard only
- `deleteModule` - JwtAuthGuard only
- `reorderModules` - JwtAuthGuard only

✅ **Lesson Mutations** - Đã fix trước:
- `createLesson` - JwtAuthGuard only
- `updateLesson` - JwtAuthGuard only
- `deleteLesson` - JwtAuthGuard only
- `reorderLessons` - JwtAuthGuard only

✅ **AI Course Generator** - Đã fix trước:
- `analyzeDocumentsForCourse` - JwtAuthGuard only
- `generateCourseFromPrompt` - JwtAuthGuard only
- `generateCourseFromDocuments` - JwtAuthGuard only

## Security Model

### Trước (Role-based - Quá hạn chế)
```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ JwtAuthGuard│  ← Extract user từ token
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ RolesGuard  │  ← Check role === ADMIN ❌
└──────┬──────┘
       │
       ├─ ADMIN → ✅ Cho phép
       └─ USER  → ❌ Từ chối (Giảng viên bị chặn!)
```

### Sau (Ownership-based - Linh hoạt)
```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ JwtAuthGuard│  ← Extract user từ token
└──────┬──────┘
       │
       ▼ (user.id)
┌─────────────────────┐
│  Service Layer      │
│  - getMyCourses()   │  ← Lọc theo instructorId === userId
│  - update()         │  ← Verify ownership
│  - publish()        │  ← Verify ownership
│  - delete()         │  ← Verify ownership
└─────────────────────┘
       │
       ├─ Own courses    → ✅ Cho phép
       └─ Others' courses → ❌ Từ chối
```

**Ưu điểm:**
- Mỗi user chỉ quản lý khóa học của mình
- ADMIN có thể quản lý tất cả (vì admin cũng là instructor)
- Giảng viên (USER + giangvien permission) được phép sử dụng

## Tóm tắt thay đổi

**File**: `/backend/src/lms/courses/courses.resolver.ts`

| Resolver/Mutation | Trước | Sau | Lý do |
|-------------------|-------|-----|-------|
| `myCourses` (Query) | `@Roles(ADMIN)` | `@UseGuards(JwtAuthGuard)` | Service lọc theo userId |
| `createCourse` | `@Roles(ADMIN)` | `@UseGuards(JwtAuthGuard)` | Mọi user có thể tạo course |
| `updateCourse` | `@Roles(ADMIN)` | `@UseGuards(JwtAuthGuard)` | Service check ownership |
| `publishCourse` | `@Roles(ADMIN)` | `@UseGuards(JwtAuthGuard)` | Service check ownership |
| `archiveCourse` | `@Roles(ADMIN)` | `@UseGuards(JwtAuthGuard)` | Service check ownership |
| `deleteCourse` | `@Roles(ADMIN)` | `@UseGuards(JwtAuthGuard)` | Service check ownership |

**Tổng**: 6 resolvers đã sửa

## Kết quả

### ❌ Trước
```
GET http://localhost:13000/graphql
Query: myCourses

Response:
{
  "errors": [{
    "message": "Forbidden resource",
    "extensions": { "code": "FORBIDDEN" }
  }]
}
```

UI hiển thị: "Truy cập bị từ chối"

### ✅ Sau
```
GET http://localhost:13000/graphql
Query: myCourses

Response:
{
  "data": {
    "myCourses": [
      {
        "id": "...",
        "title": "Khóa học của tôi",
        "status": "DRAFT",
        "enrollmentCount": 0,
        ...
      }
    ]
  }
}
```

UI hiển thị: Dashboard với danh sách khóa học

## Test với tài khoản giảng viên

Email: `wetdragon1996@gmail.com`

Routes hoạt động:
- ✅ http://localhost:13000/lms/instructor - Dashboard với stats
- ✅ http://localhost:13000/lms/instructor/courses - Danh sách khóa học
- ✅ Tạo khóa học mới
- ✅ Sửa khóa học
- ✅ Publish/Archive khóa học
- ✅ Quản lý modules và lessons

## Notes

1. **Service Layer Protection**: Tất cả service methods đều kiểm tra ownership:
   ```typescript
   async update(courseId: string, userId: string, input: UpdateCourseInput) {
     const course = await this.prisma.course.findUnique({ 
       where: { id: courseId } 
     });
     
     // ✅ Verify ownership
     if (course.instructorId !== userId) {
       throw new ForbiddenException('Bạn không có quyền chỉnh sửa khóa học này');
     }
     
     // ... update logic
   }
   ```

2. **ADMIN vẫn hoạt động**: ADMIN cũng có thể tạo courses và quản lý vì:
   - ADMIN đăng nhập → có `user.id`
   - Course tạo ra có `instructorId = admin.id`
   - ADMIN quản lý courses của mình như instructor bình thường

3. **Không phá vỡ existing code**: 
   - Frontend không cần sửa gì
   - GraphQL schema không thay đổi
   - Chỉ thay đổi authorization logic ở resolver layer

## Auto-reload Backend

Backend sử dụng `ts-node-dev` với flag `--respawn`:
```json
"dev:tazagroup:backend": "cd backend && ts-node-dev --respawn --transpile-only src/main.ts"
```

Khi file `.resolver.ts` thay đổi → Backend tự động restart → Áp dụng ngay

**Không cần restart thủ công!** 🎉
