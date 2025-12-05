# 🔧 Hướng Dẫn Fix Lỗi Google Drive Permission

## ❌ Lỗi hiện tại
```json
{
  "connected": false,
  "message": "Không thể kết nối Google Drive: File not found: 1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG."
}
```

## 🔍 Nguyên nhân
Service Account `app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com` **CHƯA CÓ QUYỀN TRUY CẬP** vào folder:
- **Folder URL**: https://drive.google.com/drive/folders/1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG
- **Folder ID**: `1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG`

## ✅ Cách Sửa (3 Bước)

### Bước 1: Copy Email của Service Account
```
app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com
```

### Bước 2: Mở Folder Google Drive
1. Truy cập: https://drive.google.com/drive/folders/1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG
2. Hoặc tìm folder này trong Google Drive của bạn

### Bước 3: Share Folder với Service Account
1. **Click phải vào folder** → Chọn "**Chia sẻ**" (Share)
2. **Paste email Service Account** vào ô "Thêm người hoặc nhóm":
   ```
   app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com
   ```
3. **Chọn quyền**: **"Người chỉnh sửa" (Editor)** hoặc **"Người quản lý nội dung" (Content Manager)**
4. **BỎ TÍCH** ô "Thông báo cho mọi người" (để không spam email)
5. Click **"Chia sẻ"** hoặc **"Gửi"**

### ⚠️ Quan Trọng
- Service Account email sẽ hiển thị như một email bình thường trong danh sách người được chia sẻ
- Không cần xác nhận email (Service Account không có inbox)
- Quyền có hiệu lực **ngay lập tức** (hoặc tối đa 2-3 phút)

## 🧪 Test Sau Khi Share

### Cách 1: Dùng Script Test Nhanh
```bash
cd /chikiet/kataoffical/shoprausach/backend
node test-google-drive-direct.js
```

### Cách 2: Test qua API
```bash
curl -X GET http://localhost:13001/api/lms/source-documents/google-drive/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Cách 3: Test qua Frontend
1. Mở: http://localhost:13000/lms/admin/source-documents/new
2. Kiểm tra status Google Drive ở phần "Chọn nơi lưu trữ"
3. Nếu thành công sẽ thấy: ✅ **"Google Drive (Đã kết nối)"**

## ✅ Kết Quả Mong Đợi

Sau khi share xong, test sẽ trả về:
```json
{
  "connected": true,
  "message": "Kết nối Google Drive thành công"
}
```

## 📝 Lưu Ý Bảo Mật

1. **Chỉ share với Service Account này** - đây là account chính thức của hệ thống
2. **Quyền Editor** cho phép:
   - Tạo sub-folder (Images, Videos, PDFs, Documents, etc.)
   - Upload file vào các folder
   - Đặt quyền public cho file đã upload
3. **Không ảnh hưởng** đến các file/folder khác trong Google Drive của bạn

## 🔐 Thông Tin Service Account

- **Email**: app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com
- **Project ID**: tazagroup-480011
- **Type**: Service Account (Google Cloud Platform)
- **Scopes**: `https://www.googleapis.com/auth/drive.file`

## 🐛 Troubleshooting

### Nếu sau khi share vẫn bị lỗi:
1. **Đợi 2-3 phút** để Google đồng bộ permission
2. **Restart backend**:
   ```bash
   pkill -f "ts-node.*main.ts"
   # Backend sẽ tự restart nếu dùng concurrently
   ```
3. **Kiểm tra lại quyền** trong folder:
   - Vào folder settings
   - Tìm Service Account email
   - Đảm bảo có quyền "Người chỉnh sửa" hoặc cao hơn
4. **Thử remove & re-add** Service Account:
   - Remove Service Account khỏi folder
   - Đợi 30 giây
   - Add lại với quyền Editor

### Nếu không thể share (folder bị khóa):
- Liên hệ người sở hữu folder
- Hoặc tạo folder mới và cập nhật `COMPANY_FOLDER_ID` trong code

## 📞 Hỗ Trợ

Nếu vẫn gặp vấn đề, cung cấp thông tin:
1. Screenshot màn hình share folder
2. Output của script test: `node test-google-drive-direct.js`
3. Log backend khi khởi động (tìm dòng "Google Drive")
