# Cập Nhật Hiển Thị Số Lượng Tài Liệu Nguồn Trong Khóa Học LMS

## Tổng Quan
Đã cập nhật toàn bộ hệ thống LMS để hiển thị số lượng tài liệu nguồn (source documents) tại tất cả các nơi hiển thị danh sách khóa học.

## Các Thay Đổi Backend

### 1. GraphQL Entity - Course
**File:** `backend/src/lms/courses/entities/course.entity.ts`

Thêm field `sourceDocumentsCount` vào GraphQL schema:
```typescript
@Field(() => Int, { nullable: true })
sourceDocumentsCount?: number;
```

### 2. Service Layer
**File:** `backend/src/lms/courses/courses.service.ts`

Cập nhật các method để bao gồm count của sourceDocuments:

#### Method `findAll()`
- Thêm `_count.sourceDocuments` vào query
- Map kết quả để include `sourceDocumentsCount`

#### Method `findOne()` và `findBySlug()`
- Thêm `_count.sourceDocuments` vào query
- Return object với `sourceDocumentsCount`

#### Method `getMyCourses()`
- Thêm `sourceDocuments` vào `_count.select`
- Map courses để include count

## Các Thay Đổi Frontend

### 1. GraphQL Queries
**File:** `frontend/src/graphql/lms/courses.graphql.ts`

Cập nhật `COURSE_BASIC_FRAGMENT`:
```graphql
fragment CourseBasic on Course {
  ...
  sourceDocumentsCount
  ...
}
```

### 2. Admin Courses Page
**File:** `frontend/src/app/lms/admin/courses/page.tsx`

- Thêm `sourceDocumentsCount` vào Course interface
- Import icon `FileText` từ lucide-react
- Hiển thị count trong stats section với icon màu xanh lá:
  ```tsx
  {course.sourceDocumentsCount > 0 && (
    <div className="flex items-center gap-1 whitespace-nowrap">
      <FileText className="w-4 h-4 text-green-600" />
      <span>{course.sourceDocumentsCount} tài liệu</span>
    </div>
  )}
  ```

### 3. Instructor Dashboard
**File:** `frontend/src/app/lms/instructor/page.tsx`

- Import icon `FileText`
- Thêm cột "Tài liệu" vào table header
- Hiển thị count trong table cell:
  ```tsx
  <div className="flex items-center gap-1 text-sm">
    <FileText className="w-4 h-4 text-green-600" />
    <span>{course.sourceDocumentsCount || 0}</span>
  </div>
  ```

### 4. Course Card Component
**File:** `frontend/src/components/lms/CourseCard.tsx`

- Thêm `sourceDocumentsCount` vào interface
- Import icon `FileText`
- Hiển thị trong stats section (chỉ khi > 0):
  ```tsx
  {course.sourceDocumentsCount && course.sourceDocumentsCount > 0 && (
    <div className="flex items-center gap-1">
      <FileText className="w-4 h-4 text-green-600" />
      <span className="text-xs">{course.sourceDocumentsCount} TL</span>
    </div>
  )}
  ```

## Giao Diện Người Dùng

### Hiển Thị
- **Icon:** FileText (màu xanh lá - `text-green-600`)
- **Format Admin:** `{số} tài liệu`
- **Format Public/Card:** `{số} TL` (viết tắt của Tài Liệu)
- **Điều kiện:** Chỉ hiển thị khi sourceDocumentsCount > 0

### Vị Trí
1. **Admin Courses List:** Trong card stats, hiển thị cùng với enrollments, modules, reviews
2. **Instructor Dashboard:** Cột riêng trong table "Tài liệu"
3. **Public Course List:** Trong course card stats, dưới stats bar

## Tuân Thủ Rules

✅ **Clean Architecture:** Tách biệt concerns - entity, service, resolver, UI components  
✅ **Mobile First + Responsive:** Sử dụng hidden classes (lg:table-cell) cho responsive  
✅ **shadcn UI:** Sử dụng đúng components và patterns  
✅ **Tiếng Việt:** Tất cả labels và text đều tiếng Việt  
✅ **Performance:** Denormalized count để tránh N+1 queries  
✅ **User Experience:** Icon màu xanh lá dễ nhận biết, conditional rendering

## Testing

Để test thay đổi:
1. Tạo khóa học mới từ tài liệu nguồn
2. Kiểm tra hiển thị count ở:
   - `/lms/admin/courses` (Admin)
   - `/lms/instructor` (Instructor Dashboard)
   - `/lms/courses` (Public Courses)
3. Verify count chính xác với số lượng tài liệu đã link

## Database Schema

Sử dụng relation có sẵn trong Prisma:
```prisma
model Course {
  sourceDocuments CourseSourceDocument[]
}

model CourseSourceDocument {
  courseId   String
  documentId String
  course     Course @relation(...)
}
```

Count được tính tự động qua Prisma `_count`.
