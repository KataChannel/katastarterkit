# Project Views - Facebook Group Layout

## Tổng quan

Cập nhật layout trang `/projects/views` theo phong cách Facebook Group với 3 cột responsive.

## Layout Structure

```
┌─────────────┬─────────────────────────────┬─────────────┐
│   SIDEBAR   │       MAIN CONTENT          │    CHAT     │
│   (Left)    │       (Center)              │   (Right)   │
│    272px    │       flex-1                │    320px    │
│ collapsible │                             │ collapsible │
└─────────────┴─────────────────────────────┴─────────────┘
```

## Responsive Breakpoints

| Breakpoint | Sidebar | Content | Chat |
|------------|---------|---------|------|
| Mobile (<1024px) | Hidden/Overlay | 100% | Hidden/Overlay |
| Desktop (1024-1280px) | 272px/Collapsed | flex-1 | Hidden |
| Large (>1280px) | 272px/Collapsed | flex-1 | 320px/Collapsed |

## Components

### 1. Left Sidebar (Projects List)
- Danh sách dự án với avatar, tên, methodology
- Stats: tasks count, messages count, members count
- Nút tạo dự án mới
- Collapsible (16px khi thu gọn)

### 2. Main Content
- Project header với avatar và tên
- View tabs: Dashboard, List, Kanban, Calendar, Roadmap
- View content area

### 3. Right Chat Panel (ChatPanel)
- Real-time chat với Socket.IO
- Online users indicator
- Typing indicator
- Message reactions
- Collapsible (14px khi thu gọn)

## Mobile UX

- **Sidebar**: Toggle button fixed bottom-left
- **Chat**: Floating action button fixed bottom-right
- **Overlay**: Full-screen overlay với backdrop blur

## Views Available

| View | Icon | Description | Methodologies |
|------|------|-------------|---------------|
| Dashboard | LayoutDashboard | Tổng quan nhanh | ALL |
| List | List | Chi tiết, báo cáo, export | ALL |
| Kanban | Kanban | Theo dõi luồng công việc | KANBAN, AGILE, HYBRID, LEAN |
| Calendar | Calendar | Deadline, sự kiện | ALL |
| Roadmap | Map | Chiến lược dài hạn | ALL |

## Files Changed

- `frontend/src/app/(projects)/projects/views/page.tsx`
  - Added 3-column layout
  - Integrated ChatPanel
  - Added collapsible states for sidebar and chat
  - Mobile responsive with overlay panels

## Usage

1. Chọn dự án từ sidebar trái
2. Chuyển đổi views bằng tabs
3. Chat với team ở panel phải
4. Thu gọn panels để tập trung vào content
