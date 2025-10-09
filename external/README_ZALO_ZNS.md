# Zalo ZNS Sender - Hướng dẫn sử dụng

## 📋 Mô tả

Ứng dụng gửi tin nhắn Zalo Notification Service (ZNS) với 2 chế độ:
- **Gửi đơn lẻ**: Gửi 1 tin nhắn đến 1 số điện thoại
- **Gửi hàng loạt**: Upload file Excel để gửi nhiều tin nhắn cùng lúc (xử lý Excel tại Frontend)

## 🚀 Khởi động

### 1. Cài đặt dependencies (nếu chưa có)

```bash
cd external
npm install express axios cors multer xlsx
```

### 2. Chạy server

```bash
node zalo.js
```

Server sẽ chạy tại: `http://localhost:3999`

### 3. Mở giao diện

Mở file `zalo.html` hoặc `zalo-advanced.html` trong trình duyệt:

```bash
# Mở trực tiếp
open zalo.html

# Hoặc
firefox zalo.html
google-chrome zalo.html
```

## 📁 Cấu trúc file

```
external/
├── zalo.js                    # Backend server (Express + Axios)
├── zalo.html                  # Frontend (React + SheetJS) - Advanced version
├── zalo-advanced.html         # Bản sao với tên rõ ràng hơn
├── sample_customers.csv       # File CSV mẫu
└── uploads/                   # Thư mục tạm để lưu file upload (tự động tạo)
```

## 🔑 Lấy Access Token

1. Truy cập [Zalo Developer Console](https://developers.zalo.me/)
2. Đăng nhập với tài khoản Zalo Business
3. Chọn ứng dụng của bạn
4. Vào phần **ZNS** → **Access Token**
5. Copy access token (có thời hạn, cần refresh định kỳ)

## 📊 Các trường hợp Response từ Zalo API

### ✅ Thành công (Error Code = 0)

```json
{
  "error": 0,
  "message": "Success",
  "data": {
    "sent_time": "1759983921893",
    "sending_mode": null,
    "quota": {
      "remainingQuota": "0",
      "dailyQuota": "0"
    },
    "msg_id": "3367db02643ff967a028"
  }
}
```

**Hiển thị:**
- ✅ Trạng thái: Thành công
- Message ID
- Thời gian gửi
- Quota còn lại/tổng quota

---

### ❌ Access Token không hợp lệ (Error Code = -124)

```json
{
  "error": -124,
  "message": "Access token invalid"
}
```

**Hiển thị:**
- ❌ Lỗi: Access token không hợp lệ hoặc đã hết hạn
- Code: -124
- 💡 Gợi ý: Lấy token mới từ Zalo Developer Console

---

### ❌ Số điện thoại không hợp lệ (Error Code = -108)

```json
{
  "error": -108,
  "message": "Phone number invalid"
}
```

**Hiển thị:**
- ❌ Lỗi: Số điện thoại không hợp lệ
- Code: -108
- 💡 Gợi ý: Format đúng là `84xxxxxxxxx` (không có dấu +)

---

### ❌ Tài khoản Zalo không tồn tại (Error Code = -118)

```json
{
  "error": -118,
  "message": "Zalo account not existed"
}
```

**Hiển thị:**
- ❌ Lỗi: Tài khoản Zalo không tồn tại
- Code: -118
- 💡 Gợi ý: Người dùng cần đăng ký Zalo trước

---

### ❌ Template chưa được duyệt (Error Code = -131)

```json
{
  "error": -131,
  "message": "ZNS template not approved"
}
```

**Hiển thị:**
- ❌ Lỗi: Template ZNS chưa được duyệt
- Code: -131
- 💡 Gợi ý: Kiểm tra trạng thái template trong Zalo Business Account

---

### ❌ Template không tồn tại (Error Code = -132)

```json
{
  "error": -132,
  "message": "ZNS template not existed"
}
```

---

### ❌ Quota đã hết (Error Code = -216)

```json
{
  "error": -216,
  "message": "ZNS quota exceeded"
}
```

**Hiển thị:**
- ❌ Lỗi: Quota ZNS đã hết
- Code: -216
- 💡 Gợi ý: Nâng cấp gói hoặc chờ reset quota hàng ngày

---

## 📝 Error Code Reference

| Code | Message | Ý nghĩa | Giải pháp |
|------|---------|---------|-----------|
| 0 | Success | Thành công | - |
| -108 | Phone number invalid | SĐT không hợp lệ | Kiểm tra format `84xxxxxxxxx` |
| -118 | Zalo account not existed | Tài khoản Zalo không tồn tại | Người dùng cần đăng ký Zalo |
| -124 | Access token invalid | Token không hợp lệ hoặc hết hạn | Lấy token mới |
| -131 | ZNS template not approved | Template chưa được duyệt | Chờ duyệt template |
| -132 | ZNS template not existed | Template không tồn tại | Kiểm tra template ID |
| -201 | Missing required fields | Thiếu tham số bắt buộc | Kiểm tra payload |
| -216 | ZNS quota exceeded | Quota đã hết | Nâng cấp hoặc chờ reset |
| -217 | Template data invalid | Data không hợp lệ | Kiểm tra template_data |
| -218 | Template data missing params | Thiếu tham số trong data | Bổ sung đầy đủ params |

## 🎯 Workflow gửi đơn lẻ

1. Chọn tab **"📱 Gửi đơn lẻ"**
2. Nhập thông tin:
   - Số điện thoại (VD: `84987654321`)
   - Template ID (VD: `492946`)
   - Tên khách hàng
   - Mã khách hàng
   - Tracking ID
   - Access Token
3. Hoặc nhấn **"📝 Dữ liệu mẫu"** để điền nhanh
4. Nhấn **"📤 Gửi ZNS"**
5. Xem kết quả:
   - ✅ Thành công: Hiển thị Message ID, thời gian, quota
   - ❌ Thất bại: Hiển thị error message, code, và gợi ý

## 📊 Workflow gửi hàng loạt

1. Chọn tab **"📊 Gửi hàng loạt (Excel Frontend)"**
2. Nhập **Template ID** và **Access Token**
3. Download file Excel mẫu (click **"Tải file Excel mẫu"**)
4. Chuẩn bị file Excel với 3 cột:
   - `phone`: Số điện thoại (84xxxxxxxxx)
   - `customer_name`: Tên khách hàng
   - `customer_id`: Mã khách hàng
5. Upload file Excel
6. Hệ thống sẽ:
   - Đọc và parse file Excel
   - Validate từng dòng
   - Hiển thị preview với trạng thái (hợp lệ/lỗi)
7. Sử dụng các chức năng:
   - 🔍 **Tìm kiếm**: Filter theo SĐT, tên, mã KH
   - ✅ **Chọn tất cả**: Chọn tất cả các dòng
   - ✓ **Chọn hợp lệ**: Chỉ chọn dòng hợp lệ
   - Checkbox: Chọn từng dòng cụ thể
8. Nhấn **"🚀 Gửi ZNS cho X dòng đã chọn"**
9. Xem kết quả chi tiết:
   - Tổng số / Thành công / Thất bại / Tỷ lệ
   - Bảng kết quả với chi tiết từng dòng
   - Message ID và quota cho dòng thành công
   - Error message và code cho dòng thất bại

## 💡 Tính năng nâng cao

### Frontend (zalo.html)

✅ **Xử lý Excel hoàn toàn tại client-side**
- Sử dụng SheetJS để đọc file Excel
- Không cần upload lên server
- Preview ngay lập tức

✅ **Validation realtime**
- Kiểm tra SĐT (phải bắt đầu bằng 84, độ dài 10-12)
- Kiểm tra trường bắt buộc
- Hiển thị lỗi cụ thể cho từng dòng

✅ **UI/UX tối ưu**
- Phân trang (10 dòng/trang)
- Tìm kiếm instant
- Chọn lọc linh hoạt
- Responsive design

✅ **Error Handling thông minh**
- Phân tích error code từ Zalo
- Hiển thị message tiếng Việt
- Gợi ý giải pháp cụ thể
- Chi tiết quota và message ID

### Backend (zalo.js)

✅ **API Endpoints**

**1. POST `/sendzns` - Gửi đơn lẻ**

Request:
```json
{
  "phone": "84987654321",
  "template_id": "492946",
  "customer_name": "Nguyễn Văn A",
  "customer_id": "CUST001",
  "tracking_id": "ORDER_001",
  "access_token": "your_token"
}
```

Response (Success):
```json
{
  "success": true,
  "data": {
    "error": 0,
    "message": "Success",
    "data": {
      "msg_id": "xxx",
      "sent_time": "xxx",
      "quota": {...}
    }
  }
}
```

Response (Error):
```json
{
  "success": false,
  "error": "Access token không hợp lệ hoặc đã hết hạn",
  "errorCode": -124,
  "details": {...}
}
```

**2. POST `/sendzns/bulk` - Gửi hàng loạt (Backend processing)**

Request:
```
Content-Type: multipart/form-data

file: Excel file
template_id: "492946"
access_token: "your_token"
```

Response:
```json
{
  "success": true,
  "summary": {
    "total": 100,
    "success": 95,
    "failed": 5,
    "successRate": "95.00%"
  },
  "results": [...]
}
```

## 🔒 Bảo mật

⚠️ **Lưu ý quan trọng:**

1. **Access Token**: 
   - Không commit token vào git
   - Token có thời hạn, cần refresh định kỳ
   - Lưu trữ an toàn (biến môi trường)

2. **CORS**:
   - Server đã bật CORS cho development
   - Production nên giới hạn origin cụ thể

3. **Rate Limiting**:
   - Có delay 100ms giữa các request
   - Tránh gửi quá nhanh để không bị chặn

4. **File Upload**:
   - Giới hạn 10MB
   - Tự động xóa file sau khi xử lý
   - Chỉ chấp nhận .xlsx, .xls, .csv

## 🐛 Xử lý lỗi thường gặp

### 1. Không kết nối được server

**Lỗi:** `Không thể kết nối đến server`

**Giải pháp:**
```bash
# Kiểm tra server đang chạy
ps aux | grep node

# Khởi động lại server
node zalo.js
```

### 2. CORS Error

**Lỗi:** `Access to fetch has been blocked by CORS policy`

**Giải pháp:** Server đã có CORS middleware, nhưng nếu vẫn lỗi:
```javascript
// Trong zalo.js, thay đổi:
app.use(cors({
  origin: 'http://localhost:8080' // URL của frontend
}));
```

### 3. File Excel không đọc được

**Lỗi:** `Thiếu cột bắt buộc`

**Giải pháp:**
- Đảm bảo file có 3 cột: `phone`, `customer_name`, `customer_id`
- Tên cột phải chính xác (lowercase, không dấu)
- Download file mẫu để tham khảo

### 4. Token hết hạn

**Lỗi:** `Error Code: -124`

**Giải pháp:**
1. Vào [Zalo Developer Console](https://developers.zalo.me/)
2. Refresh access token
3. Copy token mới vào form

## 📞 Support

- **Zalo Documentation**: https://developers.zalo.me/docs/api/zalo-notification-service-api
- **Zalo Developer Console**: https://developers.zalo.me/
- **ZNS Business**: https://zalo.cloud/zns

## 🎉 Demo Data

File mẫu (`sample_customers.csv`):
```csv
phone,customer_name,customer_id
84987654321,Nguyễn Văn A,CUST001
84987654322,Trần Thị B,CUST002
84987654323,Lê Văn C,CUST003
```

## 📈 Performance

- **Backend processing**: Xử lý Excel trên server, upload file qua FormData
- **Frontend processing** (Recommended): Xử lý Excel tại client với SheetJS
  - Không tốn băng thông upload
  - Preview ngay lập tức
  - Validation trước khi gửi
  - UX tốt hơn

## 🚀 Production Checklist

- [ ] Sử dụng biến môi trường cho sensitive data
- [ ] Giới hạn CORS origin cụ thể
- [ ] Thêm authentication cho API
- [ ] Logging và monitoring
- [ ] Error tracking (Sentry, LogRocket)
- [ ] Rate limiting nghiêm ngặt hơn
- [ ] Backup logs gửi tin
- [ ] SSL/HTTPS
- [ ] Minify frontend code
- [ ] CDN cho static assets

---

**Version:** 2.0.0  
**Last Updated:** October 9, 2025  
**License:** Proprietary
