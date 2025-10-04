Module,Tính năng cần lập trình cơ bản,Mô tả ngắn gọn
1. Quản lý Người dùng (User Management),"- Đăng ký/Đăng nhập (email/password, xác thực cơ bản).
- Phân quyền role (Affiliate/Merchant/Admin).
- Profile cơ bản (tên, email, địa chỉ thanh toán).","Core để phân biệt người dùng. Implement với JWT hoặc session đơn giản (backend: Node.js/PHP, DB: MySQL). MVP: Không cần 2FA."
2. Quản lý Chương trình Affiliate (Campaign Management),"- Merchant tạo campaign (tên, mô tả sản phẩm, link sản phẩm, tỷ lệ hoa hồng %).
- Affiliate xem danh sách campaign và join (approve manual).
- Danh sách campaign active/inactive.","Merchant đẩy sản phẩm, Affiliate chọn tham gia. MVP: Form CRUD đơn giản, không cần upload hình ảnh phức tạp."
3. Tạo và Theo dõi Link Affiliate (Link Generation & Tracking),"- Tạo unique tracking link (e.g., domain.com/affiliate?ref=ID).
- Theo dõi click (log IP, timestamp, referer).
- Gán cookie (30-90 ngày) để track attribution.",Theo dõi nguồn traffic. MVP: Sử dụng URL shortener đơn giản + DB log clicks; không cần pixel tracking nâng cao.
4. Theo dõi Chuyển đổi (Conversion Tracking),"- Postback webhook hoặc pixel để ghi nhận sale/lead từ merchant.
- Tính commission dựa trên sale amount và rate.
- Validate conversion (manual approve ở MVP).",Ghi nhận doanh thu từ link. MVP: API endpoint nhận data từ merchant; DB lưu conversions với status pending/approved.
5. Bảng Điều Khiển và Báo cáo (Dashboard & Reporting),"- Dashboard Affiliate: Tổng clicks, conversions, earnings pending/paid.
- Dashboard Merchant: Top affiliates, total sales, commissions paid.
- Export report CSV cơ bản.","Hiển thị metrics. MVP: UI đơn giản với charts (Chart.js), query DB real-time."
6. Quản lý Thanh Toán (Payment Management),"- Tính tổng commission theo period (tháng).
- Request payout (Affiliate submit, Admin approve).
- Lịch sử thanh toán (manual export).","Xử lý hoa hồng. MVP: Không tích hợp gateway (e.g., PayPal); chỉ track và notify email."
7. Bảng Điều Khiển Admin (Admin Panel),"- Quản lý users/campaigns (CRUD).
- Approve joins/conversions/payouts.
- Log hoạt động cơ bản (audit trail).","Giám sát hệ thống. MVP: Giao diện admin đơn giản, quyền cao nhất."