# FIX BUG COURSE SCHEMA

## 🐛 LỖI
```
Unknown field `lessons` for select statement on model `CourseCountOutputType`
```

## ✅ GIẢI PHÁP

### File: `/frontend/src/app/lms/admin/courses/page.tsx`

**Schema Course đúng**:
```prisma
model Course {
  status      CourseStatus  // DRAFT | PUBLISHED | ARCHIVED
  modules     CourseModule[] // ✅ Không có relation lessons trực tiếp
  enrollments Enrollment[]
  reviews     Review[]
}

model CourseModule {
  lessons Lesson[] // Lessons nằm trong Module
}
```

### Các thay đổi:

#### 1. **GraphQL Query - _count**
```typescript
// ❌ SAI
_count: {
  select: {
    lessons: true,  // Course không có lessons
  }
}

// ✅ ĐÚNG
_count: {
  select: {
    modules: true,  // Course có modules
  }
}
```

#### 2. **Select fields**
```typescript
// ❌ SAI
select: {
  isPublished: true,  // Course không có field này
}

// ✅ ĐÚNG
select: {
  status: true,  // DRAFT | PUBLISHED | ARCHIVED
}
```

#### 3. **Interface Course**
```typescript
// ❌ SAI
isPublished: boolean;
_count: {
  lessons: number;
}

// ✅ ĐÚNG
status: string;  // 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
_count: {
  modules: number;
}
```

#### 4. **Filter logic**
```typescript
// ❌ SAI
filterStatus === 'published' && course.isPublished

// ✅ ĐÚNG
filterStatus === 'published' && course.status === 'PUBLISHED'
```

#### 5. **Toggle publish**
```typescript
// ❌ SAI
data: {
  isPublished: !course.isPublished
}

// ✅ ĐÚNG
const newStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
data: {
  status: newStatus
}
```

#### 6. **Display badge**
```typescript
// ❌ SAI
variant={course.isPublished ? 'default' : 'secondary'}
{course.isPublished ? 'Đã xuất bản' : 'Nháp'}

// ✅ ĐÚNG
variant={course.status === 'PUBLISHED' ? 'default' : 'secondary'}
{course.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Nháp'}
```

#### 7. **Stats display**
```typescript
// ❌ SAI
{course._count?.lessons || 0} bài
{course.duration || 0}h

// ✅ ĐÚNG
{course._count?.modules || 0} modules
{course.duration || 0}p  // duration ở dạng phút (minutes)
```

## 📊 KẾT QUẢ
- ✅ Query Course thành công
- ✅ Hiển thị số modules thay vì lessons
- ✅ Filter theo status (DRAFT/PUBLISHED) chính xác
- ✅ Toggle status hoạt động đúng
- ✅ Badge hiển thị đúng trạng thái
- ✅ Thời lượng hiển thị đúng đơn vị (phút)

---
**Status**: ✅ FIXED
**Date**: 03/11/2024
