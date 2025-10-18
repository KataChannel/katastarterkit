# ⚡ Quick Start: Import Hóa Đơn từ Excel

## 🎯 Mục Đích
Hướng dẫn nhanh để import hóa đơn từ file Excel vào hệ thống trong 5 phút.

## 📋 Các Bước

### 1️⃣ Tải File Mẫu (30 giây)

1. Vào trang: **`/ketoan/listhoadon`**
2. Click nút **"Import Excel"** (màu xanh, icon tải lên)
3. Click **"Tải file mẫu"**
4. File `Mau_Import_Hoadon_[timestamp].xlsx` sẽ được tải về

### 2️⃣ Điền Dữ Liệu (2-3 phút)

**Mở file Excel vừa tải:**

#### Sheet 1: Danh sách hóa đơn
```
A: Số HĐ         | B: Ký hiệu  | C: Mẫu số | D: Ngày lập          | E: MST NB
0000001          | AA/23E      | 1/001     | 2025-10-18 10:00:00  | 0123456789
0000002          | AA/23E      | 1/001     | 2025-10-18 11:00:00  | 0123456789
```

**Các cột bắt buộc (có dấu *):**
- ✅ A: Số hóa đơn
- ✅ B: Ký hiệu hóa đơn
- ✅ C: Ký hiệu mẫu số
- ✅ D: Thời điểm lập (định dạng: `YYYY-MM-DD HH:mm:ss`)
- ✅ E: MST người bán

**Các cột tùy chọn:**
- F-R: Thông tin bổ sung (tên NB, địa chỉ, MST NM, tiền, v.v.)

#### Sheet 2: Chi tiết hóa đơn (Tùy chọn)
```
A: Số HĐ  | B: STT | C: Tên hàng hóa    | D: ĐVT | E: SL | F: Đơn giá
0000001   | 1      | Dịch vụ tư vấn     | Giờ    | 10    | 1000000
0000001   | 2      | Thiết kế logo      | Bộ     | 1     | 5000000
```

### 3️⃣ Import Dữ Liệu (1 phút)

1. Quay lại modal **"Import dữ liệu hóa đơn"**
2. Click **"Chọn file"** → Chọn file Excel vừa điền
3. *(Tùy chọn)* Click **"Xem trước dữ liệu"** để kiểm tra
4. Click **"Import ngay"**
5. Chờ xử lý (vài giây đến vài chục giây tùy số lượng)

### 4️⃣ Xem Kết Quả (30 giây)

**Kết quả hiển thị:**
```
✅ Import completed: 2 thành công, 0 lỗi

Tổng số:      2
Thành công:   2 ✅
Lỗi:          0 ❌
```

**Nếu có lỗi:**
```
❌ Chi tiết lỗi (1)

📍 Dòng 3
Hóa đơn đã tồn tại: 0000003
```

→ Sửa lỗi trong file Excel và import lại.

### 5️⃣ Xác Nhận

- Danh sách hóa đơn tự động làm mới
- Kiểm tra hóa đơn vừa import trong bảng
- Click vào hóa đơn để xem chi tiết

## 💡 Tips & Tricks

### ✅ DO's
- ✅ Luôn dùng file mẫu từ hệ thống
- ✅ Điền đúng định dạng ngày: `YYYY-MM-DD HH:mm:ss`
- ✅ Số tiền không dấu phân cách: `10000000`
- ✅ MST: 10 hoặc 13 số
- ✅ Import từ 10-200 hóa đơn/lần để nhanh nhất
- ✅ Xem trước trước khi import số lượng lớn

### ❌ DON'Ts
- ❌ Không đổi tên các sheet
- ❌ Không xóa dòng tiêu đề
- ❌ Không để trống cột bắt buộc
- ❌ Không dùng format số có dấu phẩy: ~~10,000,000~~
- ❌ Không import quá 500 hóa đơn/lần (chậm)

## 🔥 Shortcuts

### Import Nhanh (Chỉ hóa đơn, không chi tiết)
1. Tải mẫu → Xóa dữ liệu mẫu
2. Điền sheet 1 (bỏ qua sheet 2)
3. Import → Done!

### Import Đầy Đủ (Có chi tiết)
1. Tải mẫu → Xóa dữ liệu mẫu
2. Điền sheet 1 (hóa đơn)
3. Điền sheet 2 (chi tiết) - Nhớ link qua số HĐ
4. Import → Done!

### Import Batch Lớn
1. Chia file thành nhiều file nhỏ (100-200 HĐ/file)
2. Import lần lượt
3. Hoặc dùng nút "Import tiếp" sau mỗi lần

## 📊 Ví Dụ Nhanh

### File Minimal (Chỉ trường bắt buộc)

**Sheet: Danh sách hóa đơn**
| Số HĐ | Ký hiệu | Mẫu số | Ngày lập | MST NB |
|-------|---------|--------|----------|--------|
| 001 | AA/23E | 1/001 | 2025-10-18 10:00:00 | 0123456789 |
| 002 | AA/23E | 1/001 | 2025-10-18 11:00:00 | 0123456789 |

→ **Import thành công!** ✅

### File Đầy Đủ

**Sheet: Danh sách hóa đơn**
| Số HĐ | Ký hiệu | Mẫu số | Ngày lập | MST NB | Tên NB | MST NM | Tên NM | Tổng tiền |
|-------|---------|--------|----------|--------|---------|--------|---------|-----------|
| 001 | AA/23E | 1/001 | 2025-10-18 10:00:00 | 0123456789 | CÔNG TY ABC | 9876543210 | CÔNG TY XYZ | 11000000 |

**Sheet: Chi tiết hóa đơn**
| Số HĐ | STT | Tên | ĐVT | SL | Đơn giá | Thành tiền |
|-------|-----|-----|-----|----|---------|------------|
| 001 | 1 | Dịch vụ | Giờ | 10 | 1000000 | 11000000 |

→ **Import thành công với chi tiết!** ✅

## ⚠️ Troubleshooting

| Lỗi | Giải pháp |
|-----|-----------|
| "Thiếu thông tin bắt buộc" | Điền đầy đủ 5 cột đầu (A-E) |
| "Hóa đơn đã tồn tại" | Đổi số HĐ hoặc xóa HĐ cũ |
| "File phải là Excel" | Đảm bảo file .xlsx hoặc .xls |
| "Không tìm thấy sheet" | Không đổi tên sheet trong mẫu |
| "Định dạng ngày không hợp lệ" | Dùng: `YYYY-MM-DD HH:mm:ss` |
| Import chậm | Giảm số lượng xuống < 200 HĐ |

## 🎬 Demo Flow

```
1. Click "Import Excel" 
   ↓
2. Click "Tải file mẫu"
   ↓
3. Mở Excel → Điền dữ liệu → Lưu
   ↓
4. "Chọn file" → Chọn file vừa lưu
   ↓
5. (Optional) "Xem trước dữ liệu"
   ↓
6. "Import ngay"
   ↓
7. Xem kết quả:
   ✅ Thành công: X hóa đơn
   ❌ Lỗi: Y hóa đơn (có chi tiết)
   ↓
8. Danh sách tự động refresh
   ↓
9. Done! 🎉
```

## 📞 Cần Trợ Giúp?

1. **Xem hướng dẫn chi tiết:** `/docs/INVOICE_IMPORT_GUIDE.md`
2. **Check console:** F12 → Console tab
3. **Check network:** F12 → Network tab
4. **Backend logs:** `/backend/logs`

## 🚀 Advanced

### API Trực Tiếp

```bash
# Download template
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/invoice-import/template \
  -o template.xlsx

# Upload & Import
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@your_file.xlsx" \
  http://localhost:3001/api/invoice-import/upload
```

### Bulk Import Script

```bash
#!/bin/bash
# Import nhiều file cùng lúc

for file in invoices/*.xlsx; do
  echo "Importing $file..."
  curl -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@$file" \
    http://localhost:3001/api/invoice-import/upload
  sleep 2  # Delay giữa các lần
done
```

---

**Thời gian hoàn thành:** 5 phút  
**Độ khó:** ⭐⭐☆☆☆ (Dễ)  
**Version:** 1.0.0
