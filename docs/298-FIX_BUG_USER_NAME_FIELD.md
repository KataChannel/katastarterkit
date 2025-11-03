# FIX BUG USER NAME FIELD

## 🐛 LỖI
```
Unknown field `name` for select statement on model `User`
```

## ✅ GIẢI PHÁP

### Schema User đúng:
```prisma
model User {
  id        String  @id @default(uuid())
  email     String? @unique
  username  String  @unique
  firstName String? // ✅ Có
  lastName  String? // ✅ Có
  // ❌ KHÔNG có field `name`
}
```

### File: `/frontend/src/app/lms/admin/courses/page.tsx`

#### 1. GraphQL Select
```typescript
// ❌ SAI
instructor: {
  select: {
    id: true,
    name: true,      // Field không tồn tại
    username: true,
  }
}

// ✅ ĐÚNG
instructor: {
  select: {
    id: true,
    firstName: true,  // ✅
    lastName: true,   // ✅
    username: true,
  }
}
```

#### 2. Interface
```typescript
// ❌ SAI
instructor: {
  id: string;
  username: string;
  email: string;  // Không cần thiết
}

// ✅ ĐÚNG
instructor: {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}
```

#### 3. Display Logic
```typescript
// ❌ SAI
{course.instructor.name || course.instructor.username}

// ✅ ĐÚNG
{course.instructor.firstName && course.instructor.lastName 
  ? `${course.instructor.firstName} ${course.instructor.lastName}` 
  : course.instructor.username}
```

## 📊 KẾT QUẢ
- ✅ Query Course với instructor thành công
- ✅ Hiển thị tên đầy đủ giảng viên (firstName + lastName)
- ✅ Fallback về username nếu không có firstName/lastName
- ✅ Không query field không cần thiết

---
**Status**: ✅ FIXED
**Date**: 03/11/2024
