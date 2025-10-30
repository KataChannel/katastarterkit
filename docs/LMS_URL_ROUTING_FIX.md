# LMS URL Routing - Bug Fixes

## Vấn Đề

User báo 2 lỗi 404:
1. `http://localhost:12000/courses/khoa-hoc-1` → 404
2. `http://localhost:12000/instructor/courses/[id]/edit` → 404

## Nguyên Nhân

### Bug #1: Thiếu prefix `/lms` trong URLs
- Dashboard page có links thiếu prefix `/lms`
- Learn page có back link thiếu prefix `/lms`

### Bug #2: Thiếu Edit Course Page
- Route `/lms/instructor/courses/[id]/edit/page.tsx` chưa tồn tại
- Create page redirect đến route này nhưng chưa implement

---

## Giải Pháp

### 1. Fix URLs trong Dashboard
**File**: `frontend/src/app/lms/instructor/dashboard/page.tsx`

**Thay đổi**:
```tsx
// Trước:
href={`/courses/${course.slug}`}              // ❌ Thiếu /lms
href={`/instructor/courses/${course.id}/edit`} // ❌ Thiếu /lms

// Sau:
href={`/lms/courses/${course.slug}`}              // ✅
href={`/lms/instructor/courses/${course.id}/edit`} // ✅
```

**Lines**: 229, 236

---

### 2. Fix URL trong Learn Page
**File**: `frontend/src/app/lms/learn/[slug]/page.tsx`

**Thay đổi**:
```tsx
// Trước:
<Link href={`/courses/${slug}`}>  // ❌

// Sau:
<Link href={`/lms/courses/${slug}`}>  // ✅
```

**Line**: 105

---

### 3. Tạo Edit Course Page
**File**: `frontend/src/app/lms/instructor/courses/[id]/edit/page.tsx` (MỚI)

**Features**:
- ✅ Query `GET_COURSE_BY_ID` để load data
- ✅ Mutation `UPDATE_COURSE` để save changes
- ✅ Load course data khi mount với `useQuery`
- ✅ Pre-fill form với data từ backend
- ✅ Validation giống Create page
- ✅ Mobile-first design
- ✅ Spinner khi loading data
- ✅ Redirect về dashboard sau khi save

**GraphQL Query**:
```graphql
query GetCourseById($id: ID!) {
  course(id: $id) {
    id
    title
    slug
    description
    thumbnail
    trailer
    price
    level
    status
    duration
    metaTitle
    metaDescription
    tags
    whatYouWillLearn
    requirements
    targetAudience
    categoryId
  }
}
```

**Workflow**:
```
1. User click "Edit" button trong dashboard
2. Route: /lms/instructor/courses/[id]/edit
3. Query course(id: $id) từ backend
4. Pre-fill form với data
5. User edit và click "Lưu thay đổi"
6. Mutation updateCourse(input: UpdateCourseInput!)
7. Redirect về /lms/instructor/dashboard
```

---

## Kiểm Tra Toàn Bộ URLs

### ✅ All LMS Routes (Đã Fix)
```
/lms                                    ✅ Homepage
/lms/courses                            ✅ Course listing
/lms/courses/[slug]                     ✅ Course detail
/lms/my-learning                        ✅ My courses
/lms/my-certificates                    ✅ My certificates
/lms/learn/[slug]                       ✅ Learning page
/lms/instructor/dashboard               ✅ Dashboard
/lms/instructor/courses/create          ✅ Create course
/lms/instructor/courses/[id]/edit       ✅ Edit course (MỚI)
/lms/certificates/verify                ✅ Verify certificate
```

### ✅ All Links (Checked)
```tsx
// Dashboard
href="/lms/instructor/courses/create"          ✅
href={`/lms/courses/${course.slug}`}            ✅
href={`/lms/instructor/courses/${course.id}/edit`} ✅

// Learn Page
href={`/lms/courses/${slug}`}                   ✅

// My Learning
href={`/lms/courses/${enrollment.course.slug}`} ✅

// Course Card
href={`/lms/courses/${course.slug}`}            ✅
```

---

## Testing

### Test Case 1: View Course
1. Login as instructor
2. Go to `/lms/instructor/dashboard`
3. Click "View" (eye icon) trên course
4. ✅ Navigate to `/lms/courses/[slug]` (không còn 404)

### Test Case 2: Edit Course
1. Login as instructor
2. Go to `/lms/instructor/dashboard`
3. Click "Edit" (pencil icon) trên course
4. ✅ Navigate to `/lms/instructor/courses/[id]/edit`
5. ✅ Form pre-filled với course data
6. Edit fields
7. Click "Lưu thay đổi"
8. ✅ Redirect về dashboard
9. ✅ Changes saved

### Test Case 3: Create → Edit Flow
1. Create new course
2. ✅ Redirect to `/lms/instructor/courses/[id]/edit`
3. ✅ Edit page loads với course vừa tạo
4. Add modules/lessons
5. Save changes

---

## Files Changed

### Modified (2 files)
1. `frontend/src/app/lms/instructor/dashboard/page.tsx`
   - Line 229: Fix view course URL
   - Line 236: Fix edit course URL

2. `frontend/src/app/lms/learn/[slug]/page.tsx`
   - Line 105: Fix back to course URL

### Created (1 file)
3. `frontend/src/app/lms/instructor/courses/[id]/edit/page.tsx`
   - Complete edit course page (700+ lines)
   - Query GET_COURSE_BY_ID
   - Mutation UPDATE_COURSE
   - Form validation
   - Mobile responsive

---

## Backend Support

### Existing Queries (Already Working)
```graphql
# Get course by ID
query {
  course(id: "uuid") { ... }
}

# Update course
mutation {
  updateCourse(input: UpdateCourseInput!) { ... }
}
```

Backend resolver đã support đầy đủ, không cần thay đổi.

---

## Summary

**Bugs Fixed**: 2
- ✅ URL routing thiếu `/lms` prefix
- ✅ Thiếu Edit Course page

**Files Changed**: 3
- 2 modified (dashboard, learn page)
- 1 created (edit page)

**Result**: Hệ thống LMS giờ có complete CRUD flow cho courses:
- ✅ **C**reate: `/lms/instructor/courses/create`
- ✅ **R**ead: `/lms/courses/[slug]`
- ✅ **U**pdate: `/lms/instructor/courses/[id]/edit` (MỚI)
- ✅ **D**elete: Archive trong dashboard

**Status**: ✅ Tất cả routes hoạt động, không còn 404

---

Date: 30/10/2025
