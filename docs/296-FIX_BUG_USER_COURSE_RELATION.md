# FIX BUG RELATION USER - COURSE

## 🐛 LỖI
```
Unknown field `createdCourses` for include statement on model `User`
```

## ✅ GIẢI PHÁP

### File: `/frontend/src/app/lms/admin/instructors/page.tsx`

**Đổi relation từ `createdCourses` → `coursesInstructed`**

### Schema đúng:
```prisma
model User {
  coursesInstructed Course[] @relation("InstructorCourses")
}

model Course {
  instructor User @relation("InstructorCourses")
}
```

### Các thay đổi:

1. **Interface Instructor**:
   - `createdCourses` → `coursesInstructed`
   - `_count.createdCourses` → `_count.coursesInstructed`

2. **GraphQL Query**:
   ```typescript
   include: {
     coursesInstructed: {  // ✅ Đúng
       select: { id, title, status }
     },
     _count: {
       select: { coursesInstructed: true }
     }
   }
   ```

3. **Display**:
   - `instructor._count?.coursesInstructed`
   - `instructor.coursesInstructed.map()`
   - `course.status === 'PUBLISHED'` thay vì `course.isPublished`

## 📊 KẾT QUẢ
- ✅ Query User với roleType GIANGVIEN thành công
- ✅ Hiển thị số khóa học của giảng viên
- ✅ Hiển thị danh sách khóa học đang dạy
- ✅ Badge status (PUBLISHED/DRAFT) chính xác

---
**Status**: ✅ FIXED
**Date**: 03/11/2024
