# HƯỚNG DẪN QUẢN LÝ KHÓA HỌC LMS ADMIN

## 📋 TỔNG QUAN

File `/frontend/src/app/lms/admin/courses/page.tsx` đã được cập nhật với đầy đủ các tính năng quản lý khóa học.

## ✅ CÁC TÍNH NĂNG ĐÃ HOẠT ĐỘNG

### 1. **Hiển thị danh sách khóa học**
- ✅ Query GraphQL với useFindMany
- ✅ Hiển thị grid responsive (1/2/3 columns)
- ✅ Loading state với spinner
- ✅ Error state với icon
- ✅ Empty state với nút tạo khóa học

### 2. **Tìm kiếm và lọc**
- ✅ Tìm kiếm theo tên và mô tả khóa học
- ✅ Lọc theo trạng thái: Tất cả / Đã xuất bản / Nháp
- ✅ Real-time filtering khi gõ

### 3. **Xem khóa học (View)**
```typescript
const handleViewCourse = (courseId: string) => {
  router.push(`/lms/admin/courses/${courseId}`);
};
```
- ✅ Navigate đến `/lms/admin/courses/{id}`
- 📝 Cần tạo page `[id]/page.tsx` (chưa có)

### 4. **Sửa khóa học (Edit)**
```typescript
const handleEditCourse = (courseId: string) => {
  router.push(`/lms/admin/courses/${courseId}/edit`);
};
```
- ✅ Navigate đến `/lms/admin/courses/{id}/edit`
- 📝 Cần tạo page `[id]/edit/page.tsx` (chưa có)

### 5. **Xóa khóa học (Delete)**
```typescript
const handleDeleteClick = (course: any) => {
  setCourseToDelete(course);
  setDeleteDialogOpen(true);
};
```
- ✅ Alert dialog xác nhận
- ✅ Warning message về dữ liệu liên quan
- ✅ GraphQL mutation với useDeleteOne
- ✅ Toast notification
- ✅ Auto refetch sau khi xóa
- ✅ Loading state trên button

### 6. **Xuất bản/Ẩn khóa học (Toggle Publish)**
```typescript
const handleTogglePublish = async (course: any) => {
  await updateCourse({
    where: { id: course.id },
    data: { isPublished: !course.isPublished },
  });
  refetch();
};
```
- ✅ Click vào badge để toggle
- ✅ GraphQL mutation với useUpdateOne
- ✅ Toast notification
- ✅ Auto refetch sau khi cập nhật

### 7. **Tạo khóa học mới (Create)**
```typescript
const handleCreateCourse = () => {
  router.push('/lms/admin/courses/create');
};
```
- ✅ Navigate đến `/lms/admin/courses/create`
- 📝 Cần tạo page `create/page.tsx` (chưa có)

## 📊 DỮ LIỆU HIỂN THỊ

### Course Card Information:
```typescript
{
  id: string
  title: string
  description: string | null
  level: string | null (Beginner/Intermediate/Advanced)
  price: number
  thumbnail: string | null
  isPublished: boolean
  duration: number | null
  createdAt: DateTime
  
  _count: {
    enrollments: number  // Số học viên
    lessons: number      // Số bài học
    reviews: number      // Số đánh giá
  }
  
  instructor: {
    id: string
    name: string | null
    username: string
  }
}
```

## 🎨 UI/UX FEATURES

### 1. **Course Card Layout**
- Badge trạng thái (Đã xuất bản/Nháp) - clickable để toggle
- Badge level (Beginner/Intermediate/Advanced)
- Tiêu đề và mô tả (line-clamp-2)
- Thông tin giảng viên
- Stats: Học viên, Bài học, Thời lượng, Đánh giá
- Giá (VND format hoặc "Miễn phí")
- 3 action buttons: Xem, Sửa, Xóa

### 2. **Empty State**
- Icon BookOpen
- Message "Không tìm thấy khóa học nào"
- Button "Tạo khóa học đầu tiên"

### 3. **Error State**
- Icon AlertCircle màu đỏ
- Error message

### 4. **Delete Dialog**
- Warning message rõ ràng
- Tên khóa học được highlight
- 2 buttons: Hủy và Xóa (màu đỏ)
- Loading state khi đang xóa

## 🔧 GRAPHQL OPERATIONS

### 1. **Query - Fetch Courses**
```typescript
useFindMany('Course', {
  select: {
    id: true,
    title: true,
    slug: true,
    description: true,
    level: true,
    price: true,
    thumbnail: true,
    isPublished: true,
    createdAt: true,
    duration: true,
  },
  include: {
    _count: {
      select: {
        enrollments: true,
        lessons: true,
        reviews: true,
      },
    },
    instructor: {
      select: {
        id: true,
        name: true,
        username: true,
      },
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
})
```

### 2. **Mutation - Delete Course**
```typescript
const [deleteCourse, { loading: deleteLoading }] = useDeleteOne('Course');

await deleteCourse({
  where: { id: courseId },
});
```

### 3. **Mutation - Update Course**
```typescript
const [updateCourse] = useUpdateOne('Course');

await updateCourse({
  where: { id: courseId },
  data: { isPublished: newValue },
});
```

## 📝 CÁC PAGE CẦN TẠO TIẾP

### 1. **Course Detail Page** 
`/frontend/src/app/lms/admin/courses/[id]/page.tsx`
- Xem chi tiết đầy đủ khóa học
- Danh sách bài học (lessons)
- Danh sách học viên (enrollments)
- Thống kê chi tiết

### 2. **Course Create Page**
`/frontend/src/app/lms/admin/courses/create/page.tsx`
- Form tạo khóa học mới
- Các field: title, slug, description, level, price, duration, thumbnail
- Chọn instructor
- Button Lưu nháp / Xuất bản

### 3. **Course Edit Page**
`/frontend/src/app/lms/admin/courses/[id]/edit/page.tsx`
- Form giống Create nhưng pre-filled
- Update mutation
- Button Cập nhật

## 🎯 LUỒNG SỬ DỤNG

### 1. **Tạo khóa học mới**
```
Admin clicks "Tạo khóa học mới" 
  → Navigate to /lms/admin/courses/create
  → Fill form
  → Submit
  → GraphQL createOne mutation
  → Navigate back to list
  → Show success toast
```

### 2. **Xem chi tiết**
```
Admin clicks "Xem" button
  → Navigate to /lms/admin/courses/{id}
  → Show full course details
  → Show lessons, enrollments, stats
```

### 3. **Sửa khóa học**
```
Admin clicks "Sửa" button
  → Navigate to /lms/admin/courses/{id}/edit
  → Form pre-filled with current data
  → Submit changes
  → GraphQL updateOne mutation
  → Navigate back to list
  → Show success toast
```

### 4. **Xóa khóa học**
```
Admin clicks "Trash" button
  → Show confirmation dialog
  → Admin confirms
  → GraphQL deleteOne mutation
  → Refetch course list
  → Show success toast
```

### 5. **Toggle xuất bản**
```
Admin clicks on badge (Đã xuất bản/Nháp)
  → GraphQL updateOne mutation (isPublished)
  → Refetch course list
  → Show success toast
  → Badge changes color
```

## 🛡️ ERROR HANDLING

### 1. **Query Error**
- Show error card với icon AlertCircle
- Display error message
- User có thể reload page

### 2. **Mutation Error**
- Show toast with type: 'error'
- Keep dialog open (cho delete)
- User có thể retry

### 3. **Loading States**
- Spinner cho initial load
- Button disabled + text "Đang xóa..." cho delete
- Prevent multiple clicks

## 🎨 STYLING

### Colors:
- Blue (#3B82F6): Primary, price
- Green: Success toast
- Red (#DC2626): Delete button, error
- Gray: Neutral text, borders
- Yellow: Star rating icon

### Badges:
- Published: variant="default" (blue)
- Draft: variant="secondary" (gray)
- Level: variant="outline"

### Buttons:
- Create: Primary blue
- View/Edit: Outline
- Delete: Outline with red text

## 🔐 PERMISSIONS

### Admin LMS Permissions:
```typescript
COURSE_VIEW_ALL      // ✅ Implemented (query all courses)
COURSE_CREATE        // 📝 Pending (create page)
COURSE_EDIT_ALL      // 📝 Pending (edit page)
COURSE_DELETE        // ✅ Implemented
COURSE_PUBLISH       // ✅ Implemented (toggle)
```

## 📌 NOTES

1. **Optimization**: Có thể cache danh sách khóa học với Apollo cache
2. **Pagination**: Nên implement pagination khi có nhiều khóa học
3. **Bulk Actions**: Có thể thêm checkbox để xóa/publish nhiều khóa học
4. **Image Upload**: Cần implement upload thumbnail
5. **Rich Text Editor**: Cần cho description field
6. **Validation**: Cần validate form data khi tạo/sửa

## ✨ NEXT STEPS

1. [ ] Tạo Course Detail Page (`[id]/page.tsx`)
2. [ ] Tạo Course Create Page (`create/page.tsx`)
3. [ ] Tạo Course Edit Page (`[id]/edit/page.tsx`)
4. [ ] Implement Image Upload cho thumbnail
5. [ ] Thêm Rich Text Editor cho description
6. [ ] Implement Pagination
7. [ ] Thêm Export/Import courses
8. [ ] Thêm Course Duplicate feature

---

**File updated**: `/frontend/src/app/lms/admin/courses/page.tsx`
**Date**: 2024
**Status**: ✅ Core CRUD operations completed
