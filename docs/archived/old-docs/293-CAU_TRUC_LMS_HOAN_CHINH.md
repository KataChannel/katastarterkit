# 🎓 CẤU TRÚC HỆ THỐNG LMS HOÀN CHỈNH

**Ngày thực hiện**: 03/11/2025  
**Mục tiêu**: Tổ chức lại toàn bộ LMS vào `/app/lms` với phân quyền rõ ràng

---

## 📁 CẤU TRÚC DIRECTORY

```
frontend/src/app/lms/
├── page.tsx                    # LMS Landing Page (Public)
├── layout.tsx                  # LMS Root Layout
│
├── admin/                      # 🔴 ADMIN ONLY (ADMIN role)
│   ├── layout.tsx             # Admin LMS Layout
│   ├── page.tsx               # Admin Dashboard
│   ├── courses/
│   │   └── page.tsx           # Quản lý tất cả khóa học
│   ├── instructors/
│   │   └── page.tsx           # Quản lý giảng viên
│   ├── students/              # (TODO)
│   ├── categories/            # (TODO)
│   ├── enrollments/           # (TODO)
│   ├── quizzes/               # (TODO)
│   ├── reports/               # (TODO)
│   └── settings/              # (TODO)
│
├── instructor/                 # 🟣 INSTRUCTOR (GIANGVIEN role)
│   ├── layout.tsx             # Instructor Layout
│   ├── page.tsx               # Instructor Dashboard
│   ├── courses/               # Khóa học của tôi
│   ├── students/              # Học viên trong khóa
│   ├── quizzes/               # Bài kiểm tra
│   ├── reports/               # Báo cáo khóa học
│   └── settings/              # Cài đặt cá nhân
│
├── student/                    # 🔵 STUDENT (USER role)
│   ├── layout.tsx             # Student Layout
│   ├── page.tsx               # Student Dashboard
│   ├── my-courses/
│   │   └── page.tsx           # Khóa học của tôi
│   ├── certificates/
│   │   └── page.tsx           # Chứng chỉ
│   └── profile/               # (TODO)
│
└── courses/                    # 🟢 PUBLIC (All roles)
    ├── page.tsx               # Danh sách khóa học
    ├── [slug]/
    │   └── page.tsx           # Chi tiết khóa học
    └── ...

components/auth/
└── ProtectedRoute.tsx          # Auth guard với allowedRoles
```

---

## 🔐 PHÂN QUYỀN

### 1. ADMIN (`/lms/admin/*`)

**Role**: `ADMIN`  
**Quyền**:
- ✅ Xem tất cả khóa học (all courses)
- ✅ Xem tất cả giảng viên
- ✅ Xem tất cả học viên
- ✅ Quản lý danh mục
- ✅ Quản lý ghi danh
- ✅ Xem báo cáo tổng hợp
- ✅ Cài đặt hệ thống LMS

**Layout Features**:
- Sidebar 9 menu items
- Blue theme
- Quick actions
- Stats cards

**Routes**:
```
/lms/admin              - Dashboard
/lms/admin/courses      - Quản lý khóa học
/lms/admin/instructors  - Quản lý giảng viên
/lms/admin/students     - Quản lý học viên
/lms/admin/categories   - Quản lý danh mục
/lms/admin/enrollments  - Quản lý ghi danh
/lms/admin/quizzes      - Quản lý bài kiểm tra
/lms/admin/reports      - Báo cáo tổng hợp
/lms/admin/settings     - Cài đặt LMS
```

---

### 2. GIANGVIEN (`/lms/instructor/*`)

**Role**: `GIANGVIEN`  
**Quyền**:
- ✅ Xem chỉ khóa học của mình
- ✅ Tạo khóa học mới
- ✅ Sửa khóa học của mình
- ✅ Xóa khóa học của mình
- ✅ Xem học viên trong khóa
- ✅ Chấm điểm học viên
- ✅ Quản lý bài kiểm tra
- ✅ Xem báo cáo khóa học

**Layout Features**:
- Sidebar 6 menu items
- Purple theme
- Focused on own content
- Mobile responsive

**Routes**:
```
/lms/instructor           - Dashboard
/lms/instructor/courses   - Khóa học của tôi
/lms/instructor/students  - Học viên trong khóa
/lms/instructor/quizzes   - Bài kiểm tra
/lms/instructor/reports   - Báo cáo
/lms/instructor/settings  - Cài đặt
```

---

### 3. USER (`/lms/student/*`)

**Role**: `USER`  
**Quyền**:
- ✅ Xem khóa học public
- ✅ Ghi danh khóa học
- ✅ Học bài
- ✅ Làm bài kiểm tra
- ✅ Xem tiến độ
- ✅ Nhận chứng chỉ

**Layout Features**:
- Top navigation bar
- Horizontal menu
- Mobile-first design
- Quick access to courses

**Routes**:
```
/lms/student              - Dashboard
/lms/student/my-courses   - Khóa học đã ghi danh
/lms/student/certificates - Chứng chỉ
/lms/student/profile      - Hồ sơ học tập
```

---

### 4. PUBLIC (`/lms/*`)

**Access**: All roles + guests  
**Routes**:
```
/lms                - Landing page
/lms/courses        - Danh sách khóa học
/lms/courses/[slug] - Chi tiết khóa học
```

---

## 🚀 REDIRECT LOGIC

### Auto Redirect sau Login

**File**: `backend/src/utils/auth-redirect.utils.ts`

```typescript
switch (userRole) {
  case 'ADMIN':
    return '/lms/admin';
  case 'GIANGVIEN':
    return '/lms/instructor';
  case 'USER':
    return '/lms/student';
  default:
    return '/lms/courses';
}
```

### Protected Routes

**File**: `frontend/src/components/auth/ProtectedRoute.tsx`

```typescript
<ProtectedRoute allowedRoles={['ADMIN']}>
  {/* Admin content */}
</ProtectedRoute>

<ProtectedRoute allowedRoles={['GIANGVIEN']}>
  {/* Instructor content */}
</ProtectedRoute>

<ProtectedRoute allowedRoles={['USER']}>
  {/* Student content */}
</ProtectedRoute>
```

---

## 🎨 UI/UX DESIGN

### Admin Layout
- **Color**: Blue (`bg-blue-50`, `text-blue-700`)
- **Sidebar**: Fixed left, 64px width
- **Icons**: Bold, professional
- **Style**: Data-heavy, tables, stats

### Instructor Layout
- **Color**: Purple (`bg-purple-50`, `text-purple-700`)
- **Sidebar**: Fixed left, 64px width
- **Icons**: Friendly, teaching-focused
- **Style**: Content creation, student management

### Student Layout
- **Color**: Green (`bg-green-50`, `text-green-700`)
- **Navigation**: Top horizontal bar
- **Icons**: Simple, learning-focused
- **Style**: Clean, distraction-free learning

---

## 📊 FEATURES BY ROLE

### ADMIN Features
✅ Dashboard với stats tổng hợp  
✅ Quản lý courses (all)  
✅ Quản lý instructors  
✅ Search & filter courses  
✅ View course details  
✅ Quick actions  

### GIANGVIEN Features
✅ Dashboard cá nhân  
✅ My courses (own only)  
✅ Create new course  
✅ Empty states với CTAs  
✅ Course stats  
✅ Student progress tracking (TODO)

### USER Features
✅ Dashboard học tập  
✅ Enrolled courses  
✅ Certificates  
✅ Learning progress  
✅ Stats cards  

---

## 🔗 NAVIGATION FLOW

### Landing Page (`/lms`)
```
Guest → /lms → Browse courses
User  → /lms → Can redirect to /lms/student (optional)
Instructor → /lms → Can redirect to /lms/instructor (optional)
Admin → /lms → Can redirect to /lms/admin (optional)
```

### Login Redirect
```
Login as ADMIN → /lms/admin
Login as GIANGVIEN → /lms/instructor  
Login as USER → /lms/student
```

### Unauthorized Access
```
USER tries /lms/admin → Redirect to /lms/student
GIANGVIEN tries /lms/admin → Redirect to /lms/instructor
ADMIN has access to all
```

---

## 💡 USAGE EXAMPLES

### 1. Admin muốn xem tất cả courses

```typescript
// Route: /lms/admin/courses
// Component uses useFindMany('Course')
// No filter by instructorId
// Shows ALL courses from ALL instructors
```

### 2. Giảng viên xem khóa của mình

```typescript
// Route: /lms/instructor/courses
// Component uses useFindMany('Course', {
//   where: { instructorId: currentUserId }
// })
// Only shows OWN courses
```

### 3. Student học bài

```typescript
// Route: /lms/student/my-courses
// Component uses useFindMany('Enrollment', {
//   where: { userId: currentUserId }
//   include: { course: true }
// })
// Shows enrolled courses only
```

---

## 📦 FILES MODIFIED/CREATED

### Created Files (10+)
1. ✅ `frontend/src/app/lms/admin/layout.tsx`
2. ✅ `frontend/src/app/lms/admin/page.tsx`
3. ✅ `frontend/src/app/lms/admin/courses/page.tsx` (copied)
4. ✅ `frontend/src/app/lms/admin/instructors/page.tsx` (copied)
5. ✅ `frontend/src/app/lms/instructor/layout.tsx`
6. ✅ `frontend/src/app/lms/instructor/page.tsx` (updated)
7. ✅ `frontend/src/app/lms/student/layout.tsx`
8. ✅ `frontend/src/app/lms/student/page.tsx`
9. ✅ `frontend/src/app/lms/student/my-courses/page.tsx`
10. ✅ `frontend/src/app/lms/student/certificates/page.tsx`

### Modified Files (3)
1. ✅ `frontend/src/components/auth/ProtectedRoute.tsx` - Added `allowedRoles` array
2. ✅ `frontend/src/app/lms/page.tsx` - Added role detection
3. ✅ `backend/src/utils/auth-redirect.utils.ts` - Added GIANGVIEN redirect

---

## 🎯 ROADMAP

### Phase 1 (Hoàn thành) ✅
- [x] Cấu trúc directory `/lms`
- [x] 3 layouts: Admin, Instructor, Student
- [x] Protected routes với allowedRoles
- [x] Landing page với role detection
- [x] Dashboard cho 3 roles

### Phase 2 (Tiếp theo)
- [ ] Complete all TODO pages
- [ ] Course detail pages
- [ ] Enrollment system
- [ ] Quiz interface
- [ ] Progress tracking
- [ ] Certificates generation

### Phase 3 (Nâng cao)
- [ ] Real-time GraphQL subscriptions
- [ ] Video streaming
- [ ] Live chat support
- [ ] Analytics dashboard
- [ ] Mobile app

---

## 📝 TESTING

### Test Admin Access
```bash
1. Login as ADMIN
2. Should redirect to /lms/admin
3. Can access all /lms/admin/* routes
4. Cannot be blocked from any LMS route
```

### Test Instructor Access
```bash
1. Login as GIANGVIEN
2. Should redirect to /lms/instructor
3. Can access /lms/instructor/* routes
4. Blocked from /lms/admin/* (redirect to /lms/instructor)
5. Can access /lms/courses (public)
```

### Test Student Access
```bash
1. Login as USER
2. Should redirect to /lms/student
3. Can access /lms/student/* routes
4. Blocked from /lms/admin/* (redirect to /lms/student)
5. Blocked from /lms/instructor/* (redirect to /lms/student)
6. Can access /lms/courses (public)
```

---

## 🎉 KẾT QUẢ

✅ **Cấu trúc rõ ràng** - 3 folders riêng biệt: admin, instructor, student  
✅ **Phân quyền đầy đủ** - ProtectedRoute với allowedRoles array  
✅ **Auto redirect** - Dựa trên role sau login  
✅ **3 layouts khác nhau** - Optimized cho từng role  
✅ **Mobile responsive** - Tất cả layouts đều responsive  
✅ **Consistent UI** - Shadcn components throughout  
✅ **Empty states** - CTAs hướng dẫn user  

---

**Version**: 2.0.0  
**Ngày cập nhật**: 03/11/2025  
**Status**: ✅ Cấu trúc hoàn chỉnh

**Author**: KataChannel Team  
**Project**: RauSachCore - Modern LMS Platform
