# Timeline/Gantt View & Dự án Timona Migration

## Tổng quan

Cập nhật hệ thống quản lý dự án ProjectHub với:
1. **Timeline/Gantt View** - Giao diện quản lý thời gian và phụ thuộc (Waterfall, Hybrid methodology)
2. **Seed data** cho dự án "Chuyển đổi hosting và fix website timona"

## 1. Timeline/Gantt View

### Tính năng
- Hiển thị tasks dạng Gantt chart
- Chế độ xem: Theo ngày / Theo tuần / Theo tháng
- Đánh dấu ngày hiện tại
- Hiển thị weekend với màu nền khác
- Color coding theo trạng thái (Chờ/Đang làm/Hoàn thành)
- Border left theo độ ưu tiên (Khẩn cấp/Cao/TB/Thấp)

### Files đã cập nhật

```
frontend/src/app/(projects)/layout.tsx
  - Thêm GanttChart icon
  - Thêm 'timeline' vào ViewType
  - Thêm Timeline tab vào navigation

frontend/src/app/(projects)/projects/views/page.tsx
  - Import TimelineView component
  - Thêm 'timeline' vào ViewType và viewConfig
  - Thêm case timeline trong renderView()
```

### Methodology phù hợp
- **Waterfall** - Dự án có timeline cố định
- **Hybrid** - Kết hợp Timeline + Kanban

## 2. Dự án Timona Migration

### Thông tin dự án
- **Tên**: Chuyển đổi hosting và fix website timona
- **ID**: `timona-migration-project`
- **Owner**: katachanneloffical@gmail.com (admin@gmail.com)
- **Methodology**: HYBRID
- **Views**: LIST, KANBAN, TIMELINE, CALENDAR, DASHBOARD

### Timeline

```
📅 Giai đoạn 1: 8/12/2025 - 15/12/2025 (1 tuần)
   Chuyển đổi công nghệ mới
   - Website cũ vẫn chạy bình thường
   - 15/12/2025: Off server cũ, bật server mới

📅 Giai đoạn 2: 15/12/2025 - 22/12/2025 (1 tuần)
   Fix giao diện + Khai báo Google SEO
   - Khôi phục chỉ số SEO
```

### Tasks (15 tasks)

#### Giai đoạn 1: Chuyển đổi công nghệ (7 tasks)
1. Backup toàn bộ dữ liệu website cũ
2. Setup môi trường server mới
3. Deploy ứng dụng mới lên server
4. Migrate dữ liệu từ database cũ
5. Test toàn bộ chức năng trên môi trường staging
6. Cấu hình DNS trỏ về server mới
7. Tắt server cũ và bật server mới chính thức

#### Giai đoạn 2: Fix giao diện + SEO (8 tasks)
1. Khai báo website với Google Search Console
2. Cấu hình Google Analytics 4
3. Tối ưu SEO on-page cho trang chủ
4. Fix giao diện responsive trên mobile
5. Tối ưu tốc độ tải trang (Core Web Vitals)
6. Setup redirect 301 cho URLs cũ
7. Fix các lỗi giao diện còn lại
8. Review và đánh giá kết quả chuyển đổi

### Seed file
```
backend/prisma/seeds/seed-timona-migration-project.ts
```

### Chạy seed
```bash
cd backend
npx ts-node prisma/seeds/seed-timona-migration-project.ts
```

## 3. Sử dụng

### Truy cập Timeline View
1. Vào `/projects/views`
2. Chọn dự án "Chuyển đổi hosting và fix website timona"
3. Click tab **Timeline** trên navigation

### Thao tác
- **Chuyển chế độ xem**: Dropdown "Theo ngày/Theo tuần/Theo tháng"
- **Di chuyển**: Nút < > hoặc "Hôm nay"
- **Xem chi tiết task**: Hover vào thanh task

## 4. Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS, shadcn/ui
- **Backend**: NestJS, GraphQL, Prisma
- **Database**: PostgreSQL
- **Chart**: Custom Gantt implementation với date-fns

---
*Cập nhật: 4/12/2025*
