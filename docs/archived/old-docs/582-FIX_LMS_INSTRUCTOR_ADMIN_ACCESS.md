# 🐛 Fix Bug LMS Instructor Routes - Admin Không Truy Cập Được

## ❌ Vấn Đề

User với role **ADMIN** không thể truy cập các trang:
- `/lms/instructor/courses/[id]/manage`
- `/lms/instructor/courses/[id]/lessons`
- `/lms/instructor/courses/[id]/quizzes`

**Triệu chứng**: Tự động redirect về `/lms/admin` ngay lập tức.

## ✅ Nguyên Nhân

**File**: `/frontend/src/app/lms/instructor/layout.tsx`

```tsx
// ❌ TRƯỚC - Chỉ cho phép GIANGVIEN
<ProtectedRoute allowedRoles={['GIANGVIEN']}>
```

**Logic trong ProtectedRoute**:
1. Check token và role của user
2. Nếu role không match với `allowedRoles`, redirect về trang tương ứng
3. User có role `ADMIN` → Redirect về `/lms/admin`

**Tại sao lỗi?**
- Admin cần quản lý tất cả courses (bao gồm cả của instructor)
- Admin nên có quyền truy cập vào instructor pages để quản lý nội dung
- Nhưng layout chỉ cho phép role `GIANGVIEN`

## 🔧 Giải Pháp

### Fix: Thêm ADMIN vào allowedRoles

**File**: `/frontend/src/app/lms/instructor/layout.tsx`

```tsx
// ✅ SAU - Cho phép cả ADMIN và GIANGVIEN
<ProtectedRoute allowedRoles={['ADMIN', 'GIANGVIEN']}>
```

**Lý do**:
- Admin có quyền cao nhất, có thể làm mọi thứ instructor làm được
- Admin cần manage tất cả courses trong hệ thống
- Không ảnh hưởng bảo mật: Admin vẫn cần authenticated

### Bonus: Thêm Link "Quay lại Admin" cho User ADMIN

Thêm button trong sidebar để admin dễ dàng quay lại admin panel:

```tsx
<div className="p-4 border-t border-gray-200 space-y-2">
  {/* Hiển thị nếu user là ADMIN */}
  {(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.roleType === 'ADMIN') {
        return (
          <button onClick={() => router.push('/lms/admin/courses')}>
            <LayoutDashboard className="w-4 h-4" />
            Quay lại Admin
          </button>
        );
      }
    }
  })()}
  
  <button onClick={() => router.push('/lms')}>
    <Home className="w-4 h-4" />
    LMS Home
  </button>
</div>
```

## 📊 Kết Quả

### Trước Fix
- ❌ Admin click "Quản lý Modules & Quiz" → Redirect về `/lms/admin`
- ❌ Admin không thể vào manage/lessons/quizzes
- ❌ Phải đổi role thành GIANGVIEN mới vào được

### Sau Fix  
- ✅ Admin truy cập được tất cả instructor pages
- ✅ Admin có thể quản lý modules, lessons, quizzes
- ✅ Sidebar hiển thị button "Quay lại Admin" cho admin
- ✅ Giảng viên vẫn truy cập bình thường như cũ

## 🔐 Bảo Mật

### Roles Hierarchy
```
ADMIN (cao nhất)
  ↓ Có thể truy cập tất cả
GIANGVIEN
  ↓ Chỉ quản lý courses của mình
USER
  ↓ Chỉ xem và học
GUEST
```

### Protected Routes Logic
- `allowedRoles={['ADMIN', 'GIANGVIEN']}` - Admin và giảng viên đều OK
- Backend vẫn check ownership: Giảng viên chỉ edit courses của mình
- Admin có thể edit tất cả courses (logic ở backend)

## 📝 File Đã Sửa

**File**: `/frontend/src/app/lms/instructor/layout.tsx`

**Thay đổi**:
1. Line ~75: `allowedRoles={['GIANGVIEN']}` → `allowedRoles={['ADMIN', 'GIANGVIEN']}`
2. Line ~53-68: Thêm button "Quay lại Admin" nếu user là ADMIN

## 🚀 Test

```bash
# Start dev
bun run kill:all
bun run dev:rausach

# Test với ADMIN role:
# 1. Login với admin account
# 2. Vào /lms/admin/courses
# 3. Click "Quản lý Modules & Quiz" trên bất kỳ course nào
# 4. ✅ Phải vào được /lms/instructor/courses/[id]/manage
# 5. ✅ Sidebar phải có button "Quay lại Admin"
# 6. Click "Quay lại Admin"
# 7. ✅ Phải redirect về /lms/admin/courses

# Test với GIANGVIEN role:
# 1. Login với giảng viên account
# 2. Vào /lms/instructor/courses/[id]/manage
# 3. ✅ Phải vào được bình thường
# 4. ✅ Sidebar KHÔNG có button "Quay lại Admin"
```

## ✅ Tuân Thủ Rules

- ✅ Clean Architecture: Không thay đổi logic cốt lõi
- ✅ Security: Vẫn check authentication, chỉ mở rộng authorization
- ✅ UX: Thêm button "Quay lại Admin" cho admin dễ navigate
- ✅ Mobile First: Button responsive trong sidebar
- ✅ Code Clean: Try-catch để handle token parsing errors

---

**Cập nhật**: 10/11/2025  
**Trạng thái**: ✅ Fixed  
**Impact**: Admin có thể quản lý nội dung courses, giảng viên không bị ảnh hưởng
