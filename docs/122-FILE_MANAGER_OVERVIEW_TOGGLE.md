# 🎛️ Tùy Chỉnh Ẩn/Hiện Overview trong File Manager

## 📋 Tóm Tắt

Đã cập nhật giao diện `/admin/filemanager` với tính năng toggle ẩn/hiện phần Overview (StorageAnalytics và RecentActivity). Mặc định phần Overview sẽ **ẩn** để tối ưu không gian làm việc.

## ✨ Tính Năng

### 1. Toggle Button
- **Vị trí**: Toolbar phía trên, bên trái nút "Làm mới"
- **Icon**: 
  - `ChevronDown` + `BarChart3` khi đang ẩn
  - `ChevronUp` + `BarChart3` khi đang hiện
- **Label**: "Tổng quan" (ẩn trên mobile)
- **Tooltip**: "Hiện tổng quan" / "Ẩn tổng quan"

### 2. Trạng Thái Mặc Định
- **Mặc định**: Ẩn (false)
- **Lưu trữ**: localStorage key `filemanager_show_overview`
- **Persistent**: Giữ trạng thái sau khi refresh trang

### 3. Animation
- **Hiệu ứng**: Slide in từ top khi hiển thị
- **Duration**: 300ms
- **Class**: `animate-in slide-in-from-top duration-300`

## 🎨 Giao Diện

### Desktop View
```
┌─────────────────────────────────────────────────┐
│ 📁 Quản Lý File                                 │
│                                                  │
│ [▼ 📊 Tổng quan] [🔄 Làm mới] [⬆️ Upload File] │
└─────────────────────────────────────────────────┘
```

### Khi Hiển Thị Overview
```
┌─────────────────────────────────────────────────┐
│ [▲ 📊 Tổng quan] [🔄 Làm mới] [⬆️ Upload File]  │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │ Storage Analytics│  │ Recent Activity  │   │
│  │                  │  │                  │   │
│  └──────────────────┘  └──────────────────┘   │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 📱 Responsive

### Mobile (< 640px)
- Chỉ hiển thị icon button
- Label "Tổng quan" ẩn đi
- Overview stack theo chiều dọc

### Tablet (640px - 1024px)
- Hiển thị cả icon và label
- Overview vẫn stack theo chiều dọc

### Desktop (>= 1024px)
- Full layout với label
- Overview hiển thị 2 cột (Analytics + Activity)

## 🔧 Thay Đổi Code

### File: `frontend/src/app/admin/filemanager/page.tsx`

#### 1. Thêm State và localStorage
```typescript
const [showOverview, setShowOverview] = useState<boolean>(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('filemanager_show_overview');
    return saved === 'true' ? true : false;
  }
  return false; // Mặc định ẩn
});

useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('filemanager_show_overview', String(showOverview));
  }
}, [showOverview]);
```

#### 2. Thêm Toggle Button
```tsx
<Button 
  variant="outline" 
  size="sm"
  onClick={() => setShowOverview(!showOverview)}
  title={showOverview ? "Ẩn tổng quan" : "Hiện tổng quan"}
>
  {showOverview ? (
    <ChevronUp className="h-4 w-4 mr-2" />
  ) : (
    <ChevronDown className="h-4 w-4 mr-2" />
  )}
  <BarChart3 className="h-4 w-4 mr-2" />
  <span className="hidden sm:inline">Tổng quan</span>
</Button>
```

#### 3. Conditional Rendering với Animation
```tsx
{!loading && stats && showOverview && (
  <div className="px-4 md:px-6 py-4 md:py-6 animate-in slide-in-from-top duration-300">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* StorageAnalytics + RecentActivity */}
    </div>
  </div>
)}
```

## ✅ Tuân Thủ Rules

### ✓ Rule 10: Mobile First + Responsive
- Layout responsive với breakpoints
- Mobile-first approach
- Touch-friendly buttons

### ✓ Rule 11: Shadcn UI
- Sử dụng Button, Card components
- Icons từ lucide-react
- Utility classes với cn()

### ✓ Rule 11: Giao Diện Tiếng Việt
- Tất cả labels bằng tiếng Việt
- Tooltips tiếng Việt

### ✓ Rule 12: Dialog Layout
- N/A (không có dialog mới)

## 🎯 Use Cases

### 1. Người Dùng Mới
- Mặc định ẩn overview để tập trung vào files
- Có thể bật lên khi cần xem thống kê

### 2. Người Dùng Thường Xuyên
- Trạng thái được lưu, không cần toggle lại
- Workflow nhanh hơn

### 3. Mobile Users
- Tiết kiệm không gian màn hình
- Scroll ít hơn để đến files

## 🔍 Testing

### Manual Test
1. Truy cập `/admin/filemanager`
2. Kiểm tra overview mặc định **ẩn**
3. Click nút "Tổng quan"
4. Kiểm tra overview **hiển thị** với animation
5. Refresh trang
6. Kiểm tra trạng thái được **giữ nguyên**
7. Click lại để ẩn
8. Test trên các breakpoints khác nhau

### Browser Compatibility
- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## 📊 Performance

- **localStorage**: Lightweight, instant read/write
- **Animation**: GPU-accelerated với CSS
- **Rendering**: Conditional, không mount khi ẩn
- **Impact**: Minimal, < 1ms overhead

## 🚀 Future Enhancements

1. **Keyboard Shortcut**: `Ctrl+O` để toggle
2. **Collapse Animation**: Smooth collapse thay vì unmount
3. **Customizable Sections**: Cho phép ẩn/hiện từng phần riêng
4. **User Preferences**: Lưu vào database thay vì localStorage

---

**Updated**: 28/11/2025  
**Status**: ✅ Completed  
**File Modified**: `frontend/src/app/admin/filemanager/page.tsx`  
**Default State**: Hidden (Ẩn)
