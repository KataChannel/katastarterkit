# 📄 Hướng Dẫn Import Dữ Liệu Hóa Đơn

## 📋 Tổng Quan

Hệ thống import hóa đơn cho phép bạn nhập hàng loạt dữ liệu hóa đơn vào database từ file Excel. Tính năng này hỗ trợ:

- ✅ Import hóa đơn và chi tiết từ file Excel
- ✅ Tải file mẫu Excel để điền dữ liệu
- ✅ Xem trước dữ liệu trước khi import
- ✅ Báo cáo chi tiết kết quả import
- ✅ Xử lý lỗi và validation

## 🚀 Tính Năng

### Backend

#### 1. **InvoiceImportService** (`/backend/src/services/invoice-import.service.ts`)

Service xử lý import hóa đơn với các chức năng:

**Tạo file mẫu Excel:**
```typescript
async generateImportTemplate(): Promise<Buffer>
```
- Tạo file Excel với 3 sheets:
  - Sheet 1: Danh sách hóa đơn (thông tin tổng hợp)
  - Sheet 2: Chi tiết hóa đơn (thông tin hàng hóa/dịch vụ)
  - Sheet 3: Hướng dẫn sử dụng
- Định dạng sẵn với màu sắc, border, và dữ liệu mẫu

**Parse file Excel:**
```typescript
async parseImportFile(buffer: Buffer): Promise<ImportInvoiceData[]>
```
- Đọc và parse dữ liệu từ file Excel
- Validate định dạng và kiểu dữ liệu
- Liên kết chi tiết hóa đơn với hóa đơn chính qua số hóa đơn

**Import vào database:**
```typescript
async importInvoices(data: ImportInvoiceData[]): Promise<ImportResult>
```
- Validate dữ liệu bắt buộc
- Kiểm tra trùng lặp
- Tạo hóa đơn và chi tiết trong database
- Trả về báo cáo chi tiết

#### 2. **InvoiceImportController** (`/backend/src/controllers/invoice-import.controller.ts`)

REST API controller với các endpoints:

**GET `/api/invoice-import/template`**
- Tải file Excel mẫu
- Trả về: File Excel với cấu trúc và dữ liệu mẫu

**POST `/api/invoice-import/upload`**
- Upload và import file Excel
- Input: File Excel (multipart/form-data)
- Trả về: Kết quả import với thống kê

**POST `/api/invoice-import/preview`**
- Xem trước dữ liệu trong file
- Input: File Excel
- Trả về: 10 hóa đơn đầu tiên để preview

### Frontend

#### 1. **InvoiceImportModal** (`/frontend/src/components/InvoiceImportModal.tsx`)

Component modal import với UI hoàn chỉnh:

**Tính năng:**
- 📥 Tải file mẫu Excel
- 📤 Upload file Excel
- 👁️ Xem trước dữ liệu
- ⚡ Import nhanh
- 📊 Hiển thị kết quả chi tiết
- ❌ Báo cáo lỗi cụ thể

**Props:**
```typescript
interface InvoiceImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
```

#### 2. **Integration vào ListHoaDonPage**

Đã tích hợp nút "Import Excel" vào trang danh sách hóa đơn:
- Nút màu xanh với icon Upload
- Hiển thị modal khi click
- Tự động làm mới danh sách sau khi import thành công

## 📝 Cấu Trúc File Excel

### Sheet 1: Danh sách hóa đơn

| Cột | Tên Trường | Bắt Buộc | Định Dạng | Ví Dụ |
|-----|-----------|----------|-----------|-------|
| A | Số hóa đơn | ✅ | Text | 0000001 |
| B | Ký hiệu hóa đơn | ✅ | Text | AA/23E |
| C | Ký hiệu mẫu số | ✅ | Text | 1/001 |
| D | Thời điểm lập | ✅ | DateTime | 2025-10-18 10:00:00 |
| E | MST người bán | ✅ | Text (10-13 số) | 0123456789 |
| F | Tên người bán | ❌ | Text | CÔNG TY TNHH ABC |
| G | Địa chỉ người bán | ❌ | Text | 123 Đường ABC, Q1, HCM |
| H | STK người bán | ❌ | Text | 1234567890 |
| I | MST người mua | ❌ | Text (10-13 số) | 9876543210 |
| J | Tên người mua | ❌ | Text | CÔNG TY CP XYZ |
| K | Địa chỉ người mua | ❌ | Text | 456 Đường XYZ, Q2, HCM |
| L | STK người mua | ❌ | Text | 0987654321 |
| M | Tổng tiền chưa thuế | ❌ | Number | 10000000 |
| N | Tổng tiền thuế | ❌ | Number | 1000000 |
| O | Tổng tiền TT | ❌ | Number | 11000000 |
| P | Tổng tiền bằng chữ | ❌ | Text | Mười một triệu đồng chẵn |
| Q | Trạng thái | ❌ | Text | Đã ký |
| R | HT thanh toán | ❌ | Text | Chuyển khoản |

### Sheet 2: Chi tiết hóa đơn

| Cột | Tên Trường | Bắt Buộc | Định Dạng | Ví Dụ |
|-----|-----------|----------|-----------|-------|
| A | Số hóa đơn | ✅ | Text | 0000001 |
| B | STT | ❌ | Number | 1 |
| C | Tên hàng hóa/DV | ✅ | Text | Dịch vụ tư vấn |
| D | Đơn vị tính | ❌ | Text | Giờ |
| E | Số lượng | ❌ | Number | 10 |
| F | Đơn giá | ❌ | Number | 1000000 |
| G | Thành tiền chưa thuế | ❌ | Number | 10000000 |
| H | Thuế suất (%) | ❌ | Number | 10 |
| I | Tiền thuế | ❌ | Number | 1000000 |
| J | Thành tiền | ❌ | Number | 11000000 |

## 🎯 Quy Tắc Nhập Liệu

### 1. Định Dạng Ngày Tháng
Hỗ trợ các định dạng:
- `YYYY-MM-DD HH:mm:ss` (khuyến nghị): `2025-10-18 10:30:00`
- `YYYY-MM-DD`: `2025-10-18`
- `DD/MM/YYYY`: `18/10/2025`

### 2. Số Tiền
- Chỉ nhập số, không nhập dấu phân cách
- Ví dụ: `10000000` thay vì `10,000,000`

### 3. Mã Số Thuế
- 10 hoặc 13 ký tự số
- Ví dụ: `0123456789` hoặc `0123456789001`

### 4. Liên Kết Dữ Liệu
- Chi tiết hóa đơn được liên kết với hóa đơn qua trường "Số hóa đơn"
- Một hóa đơn có thể có nhiều dòng chi tiết
- Số hóa đơn ở sheet chi tiết PHẢI tồn tại ở sheet danh sách

### 5. Trùng Lặp
Hệ thống kiểm tra trùng lặp dựa trên:
- MST người bán (`nbmst`)
- Ký hiệu mẫu số (`khmshdon`)
- Số hóa đơn (`shdon`)
- Ký hiệu hóa đơn (`khhdon`)

Nếu hóa đơn đã tồn tại, sẽ bỏ qua và báo lỗi.

## 📖 Hướng Dẫn Sử Dụng

### Bước 1: Tải File Mẫu

1. Vào trang "Danh sách hóa đơn điện tử" (`/ketoan/listhoadon`)
2. Click nút **"Import Excel"**
3. Click **"Tải file mẫu"**
4. File Excel sẽ được tải về máy tính

### Bước 2: Điền Dữ Liệu

1. Mở file Excel vừa tải về
2. Đọc sheet "Hướng dẫn" để hiểu cấu trúc
3. Điền dữ liệu vào sheet "Danh sách hóa đơn"
   - Các trường có dấu (*) là bắt buộc
   - Tuân thủ định dạng đã quy định
4. Điền chi tiết hóa đơn vào sheet "Chi tiết hóa đơn" (nếu có)
5. Lưu file Excel

### Bước 3: Xem Trước (Tùy Chọn)

1. Click **"Chọn file"** và chọn file Excel đã điền
2. Click **"Xem trước dữ liệu"**
3. Kiểm tra 5-10 hóa đơn đầu tiên
4. Đảm bảo dữ liệu đúng trước khi import

### Bước 4: Import

1. Click **"Import ngay"**
2. Chờ hệ thống xử lý
3. Xem báo cáo kết quả:
   - Tổng số hóa đơn
   - Số thành công
   - Số lỗi
   - Chi tiết lỗi (nếu có)

### Bước 5: Kiểm Tra Kết Quả

1. Nếu import thành công, click **"Import tiếp"** để import batch mới
2. Nếu có lỗi, xem chi tiết và sửa file Excel
3. Danh sách sẽ tự động làm mới sau khi import thành công

## 🔧 API Endpoints

### 1. Download Template

```http
GET /api/invoice-import/template
Authorization: Bearer {token}
```

**Response:** Excel file (binary)

### 2. Upload & Import

```http
POST /api/invoice-import/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: {excel_file}
```

**Response:**
```json
{
  "success": true,
  "totalRows": 10,
  "successCount": 8,
  "errorCount": 2,
  "errors": [
    {
      "row": 3,
      "error": "Hóa đơn đã tồn tại: 0000003",
      "data": {...}
    }
  ],
  "invoiceIds": ["uuid1", "uuid2", ...],
  "message": "Import completed: 8 thành công, 2 lỗi"
}
```

### 3. Preview

```http
POST /api/invoice-import/preview
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: {excel_file}
```

**Response:**
```json
{
  "success": true,
  "totalInvoices": 50,
  "data": [...], // First 10 invoices
  "message": "Tìm thấy 50 hóa đơn trong file"
}
```

## ⚠️ Lưu Ý Quan Trọng

### 1. Giới Hạn File
- Kích thước file tối đa: 10MB
- Số lượng hóa đơn khuyến nghị: < 1000 hóa đơn/lần
- Nếu có nhiều hơn, chia nhỏ thành nhiều file

### 2. Hiệu Suất
- Import 100 hóa đơn: ~5-10 giây
- Import 500 hóa đơn: ~30-60 giây
- Import 1000 hóa đơn: ~1-2 phút

### 3. Xử Lý Lỗi
- Nếu có lỗi, hệ thống sẽ tiếp tục import các dòng khác
- Báo cáo chi tiết lỗi cho từng dòng
- Sửa lỗi và import lại các dòng bị lỗi

### 4. Bảo Mật
- Chỉ user đã đăng nhập mới import được
- Cần quyền ADMIN hoặc USER
- Token authentication bắt buộc

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi 1: "Thiếu thông tin bắt buộc"
**Nguyên nhân:** Các trường có dấu (*) chưa điền

**Giải pháp:** Kiểm tra và điền đầy đủ:
- Số hóa đơn
- Ký hiệu hóa đơn
- Ký hiệu mẫu số
- MST người bán

### Lỗi 2: "Hóa đơn đã tồn tại"
**Nguyên nhân:** Hóa đơn với cùng thông tin đã có trong database

**Giải pháp:**
- Kiểm tra database trước khi import
- Hoặc xóa dòng trùng khỏi file Excel

### Lỗi 3: "File phải là định dạng Excel"
**Nguyên nhân:** File upload không phải .xlsx hoặc .xls

**Giải pháp:**
- Đảm bảo file có đuôi .xlsx hoặc .xls
- Không upload file .csv, .txt, etc.

### Lỗi 4: "Không tìm thấy sheet Danh sách hóa đơn"
**Nguyên nhân:** Tên sheet bị đổi hoặc xóa

**Giải pháp:**
- Không đổi tên các sheet trong file mẫu
- Tải lại file mẫu nếu cần

### Lỗi 5: "Định dạng ngày không hợp lệ"
**Nguyên nhân:** Ngày tháng không đúng định dạng

**Giải pháp:**
- Sử dụng định dạng: `YYYY-MM-DD HH:mm:ss`
- Ví dụ: `2025-10-18 10:30:00`

## 📊 Ví Dụ Dữ Liệu

### File Excel Hoàn Chỉnh

**Sheet: Danh sách hóa đơn**
```
Số HĐ    | Ký hiệu | Mẫu số | Thời điểm lập       | MST NB      | ...
---------|---------|--------|---------------------|-------------|----
0000001  | AA/23E  | 1/001  | 2025-10-18 10:00:00 | 0123456789  | ...
0000002  | AA/23E  | 1/001  | 2025-10-18 11:00:00 | 0123456789  | ...
```

**Sheet: Chi tiết hóa đơn**
```
Số HĐ   | STT | Tên hàng hóa    | ĐVT  | SL | Đơn giá  | ...
--------|-----|-----------------|------|----|----------|----
0000001 | 1   | Dịch vụ tư vấn  | Giờ  | 10 | 1000000  | ...
0000001 | 2   | Thiết kế logo   | Bộ   | 1  | 5000000  | ...
0000002 | 1   | Hosting 1 năm   | Năm  | 1  | 2000000  | ...
```

## 🎓 Best Practices

### 1. Chuẩn Bị Dữ Liệu
- ✅ Kiểm tra MST trước khi import
- ✅ Đảm bảo số hóa đơn unique
- ✅ Format số tiền đúng (không dấu phân cách)
- ✅ Sử dụng định dạng ngày chuẩn

### 2. Import Hiệu Quả
- ✅ Import theo batch nhỏ (100-200 hóa đơn/lần)
- ✅ Sử dụng "Xem trước" để validate
- ✅ Kiểm tra kết quả sau mỗi lần import

### 3. Xử Lý Lỗi
- ✅ Đọc kỹ thông báo lỗi
- ✅ Sửa lỗi ở file Excel gốc
- ✅ Import lại chỉ các dòng bị lỗi

### 4. Backup
- ✅ Backup database trước khi import số lượng lớn
- ✅ Giữ file Excel gốc để tham khảo
- ✅ Xuất Excel từ hệ thống để so sánh

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. **Kiểm tra Console:** Mở Developer Tools (F12) để xem lỗi chi tiết
2. **Kiểm tra Network:** Tab Network để xem request/response
3. **Kiểm tra Backend Logs:** Xem logs ở `/backend/logs`
4. **File mẫu:** Luôn sử dụng file mẫu mới nhất từ hệ thống

## 🔄 Changelog

### Version 1.0.0 (2025-10-18)
- ✅ Tạo service import hóa đơn
- ✅ Tạo REST API endpoints
- ✅ Tạo UI import modal
- ✅ Tích hợp vào trang danh sách
- ✅ Hỗ trợ preview và validation
- ✅ Báo cáo chi tiết kết quả

## 📁 Files Created

### Backend
- `/backend/src/services/invoice-import.service.ts` - Import service
- `/backend/src/controllers/invoice-import.controller.ts` - REST controller
- `/backend/src/graphql/models/invoice.model.ts` - Updated with ImportResult model

### Frontend
- `/frontend/src/components/InvoiceImportModal.tsx` - Import modal component
- `/frontend/src/app/ketoan/listhoadon/page.tsx` - Updated with import button

### Documentation
- `/docs/INVOICE_IMPORT_GUIDE.md` - This file

## ✅ Testing Checklist

- [ ] Tải file mẫu thành công
- [ ] File mẫu có đầy đủ 3 sheets
- [ ] Upload file Excel thành công
- [ ] Preview hiển thị đúng dữ liệu
- [ ] Import thành công các hóa đơn hợp lệ
- [ ] Báo lỗi đúng khi thiếu thông tin bắt buộc
- [ ] Báo lỗi khi trùng hóa đơn
- [ ] Tự động làm mới danh sách sau import
- [ ] Chi tiết hóa đơn được tạo đúng
- [ ] Số liệu thống kê chính xác

---

**Tác giả:** GitHub Copilot  
**Ngày tạo:** 18/10/2025  
**Version:** 1.0.0
