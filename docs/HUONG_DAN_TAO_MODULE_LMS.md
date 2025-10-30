# 📚 Hướng Dẫn Tạo Chương Trình Học (Module) - LMS

## 🎯 Truy Cập Chức Năng Quản Lý Module

### Cách 1: Từ Dashboard
1. Đi đến **Dashboard** của giảng viên:
   ```
   /lms/instructor/dashboard
   ```

2. Tìm khóa học bạn muốn quản lý trong bảng "Khóa học của tôi"

3. Click vào icon **List** (màu tím) ở cột "Hành động"
   - Icon này có tooltip "Quản lý Module"

4. Bạn sẽ được chuyển đến trang quản lý module:
   ```
   /lms/instructor/courses/[id]/manage
   ```

### Cách 2: Truy Cập Trực Tiếp
```
/lms/instructor/courses/[COURSE_ID]/manage
```
Thay `[COURSE_ID]` bằng ID khóa học của bạn.

---

## 📋 Các Bước Tạo Module

### Bước 1: Vào Trang Quản Lý
- Dashboard → Chọn khóa học → Click icon **List** (màu tím)
- Hoặc truy cập trực tiếp URL quản lý module

### Bước 2: Thêm Module Mới

#### Giao Diện
- Danh sách module hiện có (nếu có)
- Nút **"Add Module"** (màu xanh, có icon Plus)

#### Click "Add Module"
Form sẽ hiển thị với các trường:

1. **Module Title** (Bắt buộc)
   - Tên của module
   - VD: "Module 1: Giới thiệu về React"
   
2. **Description** (Tùy chọn)
   - Mô tả ngắn về module
   - VD: "Học cơ bản về React components"

#### Lưu Module
- Click **"Add Module"** để lưu
- Hoặc **"Cancel"** để hủy

### Bước 3: Quản Lý Module Đã Tạo

Mỗi module có các tùy chọn:

#### 1. **Edit** (Icon bút chì)
- Sửa tên module
- Sửa mô tả
- Click "Update Module" để lưu

#### 2. **Delete** (Icon thùng rác)
- Xóa module
- Hiển thị confirm dialog
- Lưu ý: Sẽ xóa cả lessons bên trong!

#### 3. **Reorder** (Icon GripVertical)
- Kéo thả để sắp xếp lại thứ tự module
- Tự động lưu khi thả

---

## 🎨 Giao Diện Chi Tiết

### Header
```
[← Quay lại Dashboard]
```

### Tiêu Đề
```
Course Modules
Organize your course content into modules
```

### Module List
```
┌─────────────────────────────────────────────┐
│ ≡ 1. Module 1: Giới thiệu                  │ [Edit] [Delete]
│   Học cơ bản về React                       │
│   0 lessons                                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ≡ 2. Module 2: Components                  │ [Edit] [Delete]
│   Deep dive vào React Components            │
│   5 lessons                                 │
└─────────────────────────────────────────────┘
```

### Add Module Button
```
┌───────────────────────────────────────────┐
│         [+] Add Module                    │
└───────────────────────────────────────────┘
```

### Form Thêm Module
```
Add New Module
─────────────────
Module Title *
[_________________________________]

Description (Optional)
[_________________________________]
[_________________________________]

[Add Module]  [Cancel]
```

---

## 🔍 Icons Trong Dashboard

| Icon | Màu | Chức năng |
|------|-----|-----------|
| 👁️ Eye | Xanh dương | Xem khóa học (public view) |
| 📋 List | Tím | **Quản lý Module** |
| ✏️ Edit | Xám | Sửa thông tin khóa học |
| 📦 Archive | Cam | Lưu trữ khóa học |

---

## ✅ Workflow Hoàn Chỉnh

### 1. Tạo Khóa Học
```
Dashboard → [Tạo khóa học] → Điền thông tin cơ bản → Lưu
```

### 2. Thêm Module
```
Dashboard → [List icon] → Add Module → Điền thông tin → Lưu
```

### 3. Thêm Lesson (Sẽ có sau)
```
Module → Add Lesson → Upload video/tài liệu → Lưu
```

### 4. Publish Khóa Học
```
Dashboard → [Edit icon] → Change status to PUBLISHED → Lưu
```

---

## 📱 Mobile Responsive

Giao diện tối ưu cho:
- 📱 **Mobile**: Danh sách dọc, buttons full width
- 📱 **Tablet**: 2 columns, compact buttons
- 💻 **Desktop**: Full table view, inline actions

---

## 🐛 Troubleshooting

### Không thấy nút "Add Module"?
- ✅ Đảm bảo bạn đã login
- ✅ Bạn phải là owner của khóa học
- ✅ Kiểm tra role: Chỉ INSTRUCTOR mới tạo được

### Lỗi 403 Forbidden?
- ✅ Backend đã được fix (đã loại bỏ role ADMIN)
- ✅ Restart backend server
- ✅ Clear cache và reload page

### Module không hiển thị?
- ✅ Kiểm tra query đã include modules
- ✅ Refetch sau khi create
- ✅ Check console log

---

## 🔧 Technical Details

### API Endpoint
```graphql
mutation CreateModule {
  createModule(input: {
    courseId: "course-id"
    title: "Module Title"
    description: "Optional description"
    order: 0
  }) {
    id
    title
    description
    order
    courseId
  }
}
```

### Hook Sử Dụng
```tsx
const [createModule, { loading }] = useCreateOne('module');

await createModule({
  data: {
    courseId: "...",
    title: "...",
    description: "..."
  }
});
```

### Authorization
- **Resolver**: `@UseGuards(JwtAuthGuard)` - Chỉ cần login
- **Service**: Kiểm tra `course.instructorId === userId`

---

## 📊 Database Schema

```prisma
model CourseModule {
  id          String   @id @default(cuid())
  courseId    String
  title       String
  description String?
  order       Int      @default(0)
  
  course      Course   @relation(fields: [courseId], references: [id])
  lessons     Lesson[]
  
  @@index([courseId])
}
```

---

## 🎓 Best Practices

### 1. Cấu Trúc Module
- Chia nhỏ nội dung thành modules logic
- Mỗi module tập trung vào 1 chủ đề
- VD: Module 1: Giới thiệu, Module 2: Thực hành

### 2. Đặt Tên Module
- Rõ ràng, có số thứ tự
- VD: "Module 1: Getting Started" ✅
- Tránh: "Module abc" ❌

### 3. Description
- Ngắn gọn, súc tích
- Nêu được mục tiêu học
- VD: "Học cách tạo React components"

### 4. Thứ Tự
- Sắp xếp theo logic học tập
- Dễ → Khó
- Lý thuyết → Thực hành

---

**Cập nhật**: 30/10/2025  
**Status**: ✅ Hoàn thành
