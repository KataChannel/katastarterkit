# Refactor Projects Module

## Tổng quan

Refactor module `(projects)` để loại bỏ route `/projects/dashboard` không cần thiết, đơn giản hóa cấu trúc.

## Thay đổi

### 1. Xóa folder dashboard
- Đã xóa: `frontend/src/app/(projects)/projects/dashboard/`
- Lý do: Dashboard view đã được tích hợp vào `/projects/views?view=dashboard`

### 2. Cập nhật redirect
**File:** `frontend/src/app/(projects)/projects/page.tsx`
```
/projects → /projects/views (thay vì /projects/dashboard)
```

### 3. Cấu trúc mới
```
frontend/src/app/(projects)/
├── layout.tsx          # Header với view tabs
└── projects/
    ├── page.tsx        # Redirect → /projects/views
    ├── settings/       # Cài đặt dự án
    ├── team/           # Quản lý nhóm
    └── views/          # Tất cả views (Dashboard, List, Kanban, Calendar, Roadmap)
```

### 4. View Navigation
Header layout chứa tabs điều hướng:
- **Dashboard** → `/projects/views?view=dashboard`
- **Danh sách** → `/projects/views?view=list`
- **Kanban** → `/projects/views?view=kanban`
- **Lịch** → `/projects/views?view=calendar`
- **Roadmap** → `/projects/views?view=roadmap`

## Lợi ích
- ✅ Đơn giản hóa routing
- ✅ Giảm code trùng lặp  
- ✅ Dễ maintenance
- ✅ Single source of truth cho views
