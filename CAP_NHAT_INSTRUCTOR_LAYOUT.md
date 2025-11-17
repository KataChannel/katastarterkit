# Cập nhật Layout Giảng viên - LMS Instructor

## Tổng quan
Cập nhật giao diện và cấu trúc menu cho giảng viên theo chuẩn RBAC và quy tắc thiết kế Mobile First.

## Thay đổi chính

### 1. Layout Instructor (/lms/instructor/layout.tsx)

**Cải tiến Architecture:**
- ✅ Refactor thành component duy nhất `SidebarContent` (DRY principle)
- ✅ Loại bỏ duplicate code giữa Desktop/Mobile sidebar
- ✅ Mobile First responsive design

**Menu mới:**
- Tổng quan (Dashboard)
- Khóa học của tôi (với submenu: Danh sách, Tạo mới, Từ tài liệu, Tạo với AI)
- Tài liệu nguồn (với submenu: Danh sách, Thêm mới)
- Học viên
- Bài kiểm tra
- **Thảo luận** (mới - lms:discussions permissions)
- **Chứng chỉ** (mới - lms:certificates permissions)
- Báo cáo
- Cài đặt

**Phân quyền:**
- `allowedRoles={['USER', 'ADMIN']}` - Cho phép cả USER với role giangvien và ADMIN
- Kiểm tra role động với `checkUserRole()` để hiển thị link Admin
- Sử dụng `useEffect` để tránh hydration error

**UI/UX:**
- Mobile: Fixed header + Sheet sidebar (280-320px)
- Desktop: Fixed sidebar (64-72px = w-64 xl:w-72)
- Responsive spacing: p-3 sm:p-4, text-xs sm:text-sm
- Icons: w-4 h-4 sm:w-5 h-5
- Purple theme cho instructor (khác Admin blue theme)

### 2. Quyền của Giảng viên (39 permissions)

**Course Management:**
- create, read, update, delete, publish, manage_own

**Content Management:**
- lessons, modules (CRUD)
- documents (CRUD)

**Assessment:**
- quizzes (CRUD + grade)
- certificates (create, read, issue)

**Student Management:**
- enrollments (read, update, approve)
- reviews (read, moderate)

**Communication:**
- discussions (CRUD + moderate)

**Analytics:**
- content:read, analytics:read

### 3. Auth Redirect Logic

**Đã được cập nhật tại:** `/backend/src/utils/auth-redirect.utils.ts`

```typescript
// Priority check:
1. Giangvien role → /lms/instructor
2. ADMIN roleType → /admin  
3. USER roleType → /dashboard
4. GUEST roleType → /courses
```

## Technical Stack

- **Framework:** Next.js 14+ App Router
- **UI:** shadcn/ui components
- **Icons:** lucide-react
- **State:** React hooks (useState, useEffect)
- **Routing:** next/navigation
- **Auth:** JWT token decode

## Files Modified

1. `/frontend/src/app/lms/instructor/layout.tsx` - Complete refactor
2. `/backend/src/utils/auth-redirect.utils.ts` - Already updated (giangvien priority)

## Testing Checklist

- [x] Mobile menu mở/đóng mượt
- [x] Desktop sidebar hiển thị đầy đủ
- [x] Submenu expand khi active
- [x] Admin user thấy link "Quay lại Admin"
- [x] USER với role giangvien truy cập được
- [x] Responsive trên mobile/tablet/desktop
- [x] Icon và spacing nhất quán

## Next Steps

Các tính năng cần implement:
1. `/lms/instructor/discussions` - Quản lý thảo luận
2. `/lms/instructor/certificates` - Quản lý chứng chỉ
3. Permission-based UI hiding (chỉ hiển thị menu user có quyền)
4. Real-time notification cho instructor
