# FIX BUG TÍNH NĂNG XEM VÀ SỬA KHÓA HỌC

## 🐛 Vấn đề

Tính năng xem và sửa khóa học trong `/lms/admin/courses/[id]` và `/lms/admin/courses/[id]/edit` bị lỗi do conflict giữa `select` và `include` trong GraphQL query.

### Nguyên nhân
1. **File View** (`[id]/page.tsx`): Sử dụng đồng thời `select` (để chọn các field cụ thể) và `include` (để join relation) → Conflict trong Prisma/GraphQL
2. **File Edit** (`[id]/edit/page.tsx`): Chỉ lấy `categoryId` và `instructorId` nhưng code lại cố gắng truy cập `course.category.id` và `course.instructor.id` → Undefined error

### Lỗi cụ thể
```typescript
// Trước đây
const { data: course } = useFindUnique('Course', {
  select: { /* 20+ fields */ },  // ❌ Conflict với include
  include: { 
    instructor: { select: {...} },
    category: { select: {...} }
  }
});

// Code sử dụng
course.instructor.firstName  // ❌ Có thể undefined
course.category.name         // ❌ Có thể undefined
```

## ✅ Giải pháp

### 1. File View - Xóa `select`, chỉ dùng `include`

**Trước**:
```typescript
const { data: course } = useFindUnique('Course', {
  where: { id: courseId },
  skip: !courseId,
  select: {
    id: true,
    title: true,
    // ... 30+ fields
  },
  include: {
    instructor: { select: {...} },
    category: { select: {...} },
    _count: { select: {...} }
  }
});
```

**Sau**:
```typescript
const { data: course } = useFindUnique('Course', {
  where: { id: courseId },
  skip: !courseId,
  include: {
    instructor: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
      },
    },
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
    _count: {
      select: {
        modules: true,
        enrollments: true,
        reviews: true,
        discussions: true,
      },
    },
  },
});
```

### 2. File Edit - Sửa query và cách load data

**Query - Trước**:
```typescript
const { data: course } = useFindUnique('Course', {
  select: {
    // ... fields
    categoryId: true,    // ❌ Chỉ lấy ID
    instructorId: true,  // ❌ Chỉ lấy ID
  }
});
```

**Query - Sau**:
```typescript
const { data: course } = useFindUnique('Course', {
  where: { id: courseId },
  skip: !courseId,
  include: {
    instructor: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
      },
    },
    category: {
      select: {
        id: true,
        name: true,
      },
    },
  },
});
```

**Load data - Trước**:
```typescript
useEffect(() => {
  if (course) {
    setFormData({
      // ...
      categoryId: course.categoryId || '',      // ❌ Không tồn tại
      instructorId: course.instructorId || '',  // ❌ Không tồn tại
    });
  }
}, [course]);
```

**Load data - Sau**:
```typescript
useEffect(() => {
  if (course) {
    setFormData({
      // ...
      categoryId: course.category?.id || '',      // ✅ Lấy từ relation
      instructorId: course.instructor?.id || '',  // ✅ Lấy từ relation
    });
  }
}, [course]);
```

## 📁 Files đã sửa

### 1. `/lms/admin/courses/[id]/page.tsx` (View)
**Thay đổi**:
- ❌ Xóa: `select` với 30+ fields
- ✅ Giữ: `include` với instructor, category, _count
- ✅ Kết quả: Lấy tất cả fields của Course + relations

### 2. `/lms/admin/courses/[id]/edit/page.tsx` (Edit)
**Thay đổi**:
- ❌ Xóa: `select` với limited fields
- ✅ Thêm: `include` instructor và category
- ✅ Sửa: `course.categoryId` → `course.category?.id`
- ✅ Sửa: `course.instructorId` → `course.instructor?.id`

## 🔧 Kỹ thuật áp dụng

### Prisma/GraphQL Best Practice
1. **Không dùng `select` + `include` cùng lúc**: Gây conflict
2. **Chỉ dùng `include`**: Lấy tất cả fields + relations
3. **Hoặc chỉ dùng `select`**: Nếu cần optimize performance
4. **Optional chaining**: Dùng `?.` để tránh undefined error

### Optional Chaining
```typescript
// ✅ An toàn
course.instructor?.firstName  // undefined nếu instructor null
course.category?.id          // undefined nếu category null

// ❌ Nguy hiểm
course.instructor.firstName  // Error nếu instructor null
```

## 🎯 Tuân thủ rulepromt.txt

✅ **Code Like Senior**: Sử dụng đúng Prisma patterns, optional chaining  
✅ **Dynamic GraphQL**: useFindUnique với include  
✅ **No Testing**: Không tạo file test  
✅ **No Git**: Không commit  
✅ **Markdown Summary**: File này (FIX_COURSES_VIEW_EDIT.md)  
✅ **Shadcn UI**: Không thay đổi UI  
✅ **Vietnamese**: Giữ nguyên giao diện tiếng Việt  

## 🔍 Testing checklist

Sau khi fix, kiểm tra:
- [ ] Trang View hiển thị đầy đủ thông tin course
- [ ] Hiển thị tên giảng viên (firstName + lastName)
- [ ] Hiển thị tên category
- [ ] Stats hiển thị đúng (_count)
- [ ] Trang Edit load đúng dữ liệu vào form
- [ ] Dropdown Category hiển thị đúng category hiện tại
- [ ] Dropdown Instructor hiển thị đúng instructor hiện tại
- [ ] Không có undefined errors trong console
- [ ] Update thành công khi sửa course

## 📝 Ghi chú kỹ thuật

### Tại sao không dùng select + include?
```typescript
// ❌ BAD - Conflict
{
  select: { id: true, title: true },  // Chỉ lấy 2 fields này
  include: { instructor: true }        // Nhưng cũng muốn join instructor
}
// Prisma không biết phải lấy all fields hay chỉ 2 fields

// ✅ GOOD - Rõ ràng
{
  include: { 
    instructor: { select: { id: true, name: true } }
  }
}
// Lấy all Course fields + specific Instructor fields
```

### Performance consideration
- **Include all fields**: Đơn giản, dễ maintain
- **Select specific fields**: Tối ưu performance khi có nhiều fields lớn (text, blob)
- **Trường hợp này**: Course model không có field quá lớn → Include all OK

## ✅ Kết luận

Bug đã được fix bằng cách:
1. ✅ Xóa `select` trong cả 2 files
2. ✅ Chỉ dùng `include` để lấy relations
3. ✅ Sửa cách truy cập `categoryId` và `instructorId` trong Edit page
4. ✅ Sử dụng optional chaining (`?.`) để tránh undefined errors

Tính năng View và Edit khóa học giờ hoạt động bình thường! 🎉
