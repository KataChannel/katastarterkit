# Cập nhật Menu Route LMS Admin & Instructor

## ✅ Đã hoàn thành

### Admin Layout (`/lms/admin/layout.tsx`)

**Menu chính:**
1. Tổng quan
2. **Khóa học** (có submenu)
   - Danh sách
   - Tạo mới
   - Từ tài liệu (NEW)
   - Tạo với AI
3. Danh mục
4. **Tài liệu nguồn** (có submenu)
   - Danh sách
   - Thêm mới
   - Danh mục
5. Giảng viên
6. Học viên
7. Ghi danh
8. Bài kiểm tra
9. Báo cáo
10. Cài đặt

### Instructor Layout (`/lms/instructor/layout.tsx`)

**Menu chính:**
1. Tổng quan
2. **Khóa học của tôi** (có submenu)
   - Danh sách
   - Tạo mới
   - Từ tài liệu (NEW)
   - Tạo với AI
3. **Tài liệu nguồn** (có submenu)
   - Danh sách
   - Thêm mới
4. Học viên
5. Bài kiểm tra
6. Báo cáo
7. Cài đặt

## 🎨 Tính năng Submenu

### Desktop
- Submenu hiển thị khi parent menu active
- Indent với margin-left
- Highlight submenu item khi đang ở route đó
- Màu sắc phù hợp với theme (blue cho admin, purple cho instructor)

### Mobile
- Component riêng: `InstructorMobileSidebar`
- Auto close sheet sau khi navigate
- Responsive font sizes và spacing
- Truncate text dài để tránh overflow

## 🎯 Tuân thủ rulepromt.txt

- ✅ Clean Architecture - Tách component Sidebar
- ✅ Mobile First - Responsive với breakpoints
- ✅ PWA ready - Sticky mobile header
- ✅ Tiếng Việt UI
- ✅ Performance - Conditional rendering submenu
- ✅ UX - Auto close mobile menu sau navigate

## 📝 Chi tiết cập nhật

### Admin
- Thêm route "Từ tài liệu" vào submenu Khóa học
- Thêm submenu cho Tài liệu nguồn (Danh sách, Thêm mới, Danh mục)
- Submenu chỉ hiển thị khi parent active
- Highlight submenu item theo pathname

### Instructor
- Tạo `InstructorMobileSidebar` component riêng
- Thêm route "Từ tài liệu" vào submenu Khóa học
- Thêm submenu cho Tài liệu nguồn (Danh sách, Thêm mới)
- Mobile menu auto close sau navigate

## 🔧 Technical

**Cấu trúc menuItems:**
```typescript
{
  title: string,
  icon: LucideIcon,
  href: string,
  children?: Array<{
    title: string,
    href: string
  }>
}
```

**Active detection:**
- Parent: `pathname === item.href || pathname?.startsWith(item.href + '/')`
- Child: `pathname === child.href`

**Color scheme:**
- Admin: Blue (bg-blue-50, text-blue-700)
- Instructor: Purple (bg-purple-50, text-purple-700)
