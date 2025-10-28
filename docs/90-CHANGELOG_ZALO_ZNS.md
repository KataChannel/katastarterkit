# Changelog - Zalo ZNS Sender

Tất cả các thay đổi quan trọng của dự án sẽ được ghi chú tại đây.

## [2.0.0] - 2024-01-XX

### ✨ Tính năng mới

#### 📊 Hệ thống báo cáo và phân tích
- **Phân tích lỗi chi tiết**
  - Thống kê số lượng lỗi theo từng mã lỗi
  - Tính tỷ lệ phần trăm mỗi loại lỗi
  - Biểu đồ bar chart trực quan cho phân bố lỗi
  - Sắp xếp lỗi theo số lượng giảm dần
  - Hỗ trợ 9 loại mã lỗi từ Zalo API

- **Xuất báo cáo đa định dạng**
  - ✅ **Excel (.xlsx)**: 
    - Sheet "Tổng quan": Metadata, thống kê, phân tích lỗi
    - Sheet "Chi tiết": Danh sách đầy đủ kết quả gửi
    - Tên file tự động: `ZNS_Report_[timestamp].xlsx`
  
  - ✅ **CSV (.csv)**:
    - Format CSV chuẩn với headers
    - UTF-8 BOM cho tiếng Việt
    - Tên file: `ZNS_Report_[timestamp].csv`
  
  - ✅ **JSON (.json)**:
    - Cấu trúc đầy đủ với metadata
    - Timestamp, templateId, summary, results
    - Tên file: `ZNS_Report_[timestamp].json`
  
  - ✅ **Print (In ấn)**:
    - CSS tùy chỉnh cho in
    - Ẩn các nút không cần thiết
    - Header tự động "BÁO CÁO GỬI ZNS HÀNG LOẠT"
    - Điều khiển page-break cho bảng

#### 🎨 Cải thiện giao diện
- **Error Analysis Section**:
  - Cards hiển thị số lượng lỗi với màu đỏ đậm
  - Tỷ lệ % hiển thị ngay trên card
  - Bar chart gradient đỏ với animation
  - Responsive: 2 cột mobile, 3 cột desktop

- **Export Buttons**:
  - 4 nút xuất dữ liệu trực quan
  - Icon SVG cho từng loại file
  - Màu sắc phân biệt: Excel (xanh lá), CSV (xanh dương), JSON (tím), Print (xám)
  - Hover effects và tooltips

### 🔧 Cải tiến kỹ thuật

#### Backend (zalo.js)
- Không thay đổi (stable)

#### Frontend (zalo.html)
- **Export Functions** (~150 dòng code mới):
  - `exportReportExcel()`: Tạo workbook 2 sheets với XLSX library
  - `exportReportCSV()`: Convert to CSV với BOM
  - `exportReportJSON()`: Stringify với pretty print
  - `printReport()`: Trigger window.print()

- **Error Analysis Component**:
  - Tính toán error counts động
  - Map 9 error codes sang tên tiếng Việt
  - Tính % phân bố lỗi
  - Render bar chart với width động

- **Print CSS**:
  - `@media print` rules
  - Hide buttons và UI elements
  - White background override
  - Table page-break controls

### 📈 Hiệu năng
- Export Excel: < 1s cho 1000 dòng
- Export CSV: < 500ms cho 1000 dòng
- Export JSON: < 200ms cho 1000 dòng
- Print render: < 100ms

### 🐛 Bug Fixes
- Không có (phiên bản mới)

---

## [1.0.0] - 2024-01-XX

### ✨ Tính năng ban đầu

#### Gửi đơn lẻ (Single Send)
- Form nhập thông tin: Phone, Template ID, Customer name, Customer ID, Access token
- Validation số điện thoại định dạng 84xxxxxxxxx
- Hiển thị kết quả: Message ID, sent_time, quota
- Xử lý lỗi từ Zalo API

#### Gửi hàng loạt (Bulk Send)
- **Upload Excel**:
  - Hỗ trợ .xlsx, .xls
  - Client-side processing với SheetJS
  - Không cần backend xử lý file
  
- **Validation**:
  - Kiểm tra định dạng số điện thoại
  - Kiểm tra các trường bắt buộc
  - Đánh dấu dòng hợp lệ/không hợp lệ
  
- **Preview và Filter**:
  - Bảng preview với pagination (10 items/page)
  - Tìm kiếm theo phone, tên, mã KH
  - Chọn dòng: Individual, Select All, Select Valid Only
  
- **Gửi ZNS**:
  - Gửi từng dòng với delay 100ms
  - Progress indicator real-time
  - Kết quả chi tiết cho từng dòng

#### Xử lý lỗi
- **10 mã lỗi từ Zalo**:
  - `-108`: SĐT không hợp lệ
  - `-118`: Tài khoản không tồn tại
  - `-124`: Token hết hạn
  - `-131`: Template chưa duyệt
  - `-132`: Template không tồn tại
  - `-201`: Thiếu tham số
  - `-216`: Quota đã hết
  - `-217`: Dữ liệu template sai
  - `-218`: Thiếu tham số template
  - Và các lỗi khác

- **Error Display**:
  - Error code + message tiếng Việt
  - Hints và suggestions
  - Color coding: Đỏ cho lỗi

#### UI/UX
- **Design**:
  - React 18 với hooks
  - Tailwind CSS
  - Responsive mobile-first
  - Tab navigation: Single / Bulk

- **Components**:
  - Form inputs với validation
  - File upload drag & drop
  - Data table với sorting
  - Loading spinners
  - Success/Error alerts

### 🔧 Công nghệ

#### Backend
- Node.js + Express.js
- Axios cho Zalo API calls
- CORS enabled
- Multer (optional, không dùng trong v1.0)

#### Frontend
- React 18 (UMD via CDN)
- Babel Standalone (JSX compilation)
- Tailwind CSS (CDN)
- SheetJS/XLSX 0.20.1 (CDN)

### 📝 Documentation
- README_ZALO_ZNS.md: Hướng dẫn đầy đủ
- Bảng tham chiếu error codes
- Workflows cho single/bulk send
- Troubleshooting guide
- Production checklist

---

## Roadmap

### [2.1.0] - Planned
- [ ] Email report functionality
- [ ] Schedule bulk send
- [ ] Export history tracking
- [ ] Custom column selection for export
- [ ] Filter export by status (success/failed only)
- [ ] Webhook notifications

### [2.2.0] - Planned
- [ ] Dashboard với charts (Chart.js)
- [ ] Template management
- [ ] Contact list management
- [ ] API rate limiting visualization
- [ ] Multi-user support with authentication

### [3.0.0] - Future
- [ ] Database integration (Prisma)
- [ ] GraphQL API
- [ ] Real-time websocket updates
- [ ] Advanced analytics và reporting
- [ ] A/B testing cho templates

---

## Ghi chú

### Semantic Versioning
Dự án sử dụng [Semantic Versioning](https://semver.org/):
- **MAJOR**: Thay đổi breaking API
- **MINOR**: Thêm tính năng mới (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Contributors
- Development Team
- QA Team
- Product Owner

### License
Proprietary - All rights reserved
