# 📋 Cập Nhật Status Page - Chi Tiết Thay Đổi

## 🎯 Mục Đích

Điều chỉnh status của page trong PageBuilder để hoạt động chính xác với hiển thị bên ngoài frontend.

## 📊 Hiện Trạng

### PageStatus Enum (ĐỊNH NGHĨA)
```typescript
export enum PageStatus {
  DRAFT = 'DRAFT',           // Bản nháp (không hiển thị công khai)
  PUBLISHED = 'PUBLISHED',   // Xuất bản (hiển thị công khai)
  ARCHIVED = 'ARCHIVED',     // Lưu trữ (ẩn/không hiển thị)
}
```

### Hiện Tại - Các Vấn Đề Cần Sửa

1. **Hiển Thị Status Trong Header**
   - Status được hiển thị nhưng chưa có hình ảnh trực quan rõ ràng
   - Badge chỉ phân biệt PUBLISHED vs others

2. **Cảnh Báo Khi Publish/Unpublish**
   - Không có cảnh báo khi chuyển status
   - Không có xác nhận khi publish page

3. **Sự Đồng Bộ Status**
   - Status cần được lưu khi save page
   - Frontend cần phản ánh status hiện tại từ database

4. **Hiển Thị Trên Frontend Website**
   - Trang không xuất bản (DRAFT/ARCHIVED) phải ẩn đi
   - Chỉ trang PUBLISHED mới hiển thị

---

## ✅ Các Thay Đổi Cần Thực Hiện

### 1. Cải Tiến PageSettingsForm
- Thêm visual indicator cho status
- Thêm confirm dialog khi publish
- Thêm mô tả rõ ràng cho mỗi status

### 2. Cải Tiến PageBuilderHeader  
- Hiển thị status badge với màu sắc rõ ràng
- Thêm shortcut button để publish/unpublish

### 3. Thêm Status Change Handler
- Xử lý logic khi status thay đổi
- Ghi lại thời gian publish
- Cache invalidation

### 4. Kiểm Tra Sync Frontend
- Xác nhận status được lưu đúng
- Trang draft không hiển thị public
- Chỉ published pages mới visible

