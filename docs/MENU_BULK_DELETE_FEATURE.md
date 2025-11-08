# Tính năng Xóa Menu Hàng Loạt

## Tổng quan
Đã cập nhật trang quản lý menu (`/admin/menu`) với tính năng xóa hàng loạt và dialog xác nhận.

## Các tính năng mới

### 1. Checkbox chọn menu
- Thêm checkbox ở đầu mỗi dòng menu
- Checkbox "Chọn tất cả" ở header của bảng
- Có thể chọn nhiều menu cùng lúc để xóa

### 2. Nút xóa hàng loạt
- Xuất hiện khi có ít nhất 1 menu được chọn
- Hiển thị số lượng menu đã chọn
- Màu đỏ (destructive) để cảnh báo

### 3. Dialog xác nhận xóa
- **Xóa đơn lẻ**: Hiển thị tên menu cần xóa
- **Xóa hàng loạt**: Hiển thị số lượng menu sẽ bị xóa
- Có 2 nút:
  - **Hủy**: Đóng dialog và không xóa
  - **Xóa**: Xác nhận xóa menu

### 4. Thông báo kết quả
- Hiển thị số lượng menu đã xóa thành công
- Hiển thị số lượng menu không thể xóa (nếu có lỗi)
- Tự động làm mới danh sách menu sau khi xóa

## Các file đã thay đổi

### 1. `/frontend/src/app/admin/menu/page.tsx`
**Thêm state mới:**
- `selectedMenuIds`: Set chứa ID các menu được chọn
- `isDeleteDialogOpen`: Trạng thái mở/đóng dialog xác nhận
- `menuToDelete`: Thông tin menu đang được xóa (đơn lẻ)

**Thêm handlers:**
- `handleDelete()`: Mở dialog xác nhận cho xóa đơn
- `confirmDelete()`: Thực hiện xóa menu đơn lẻ
- `handleBulkDelete()`: Mở dialog xác nhận cho xóa hàng loạt
- `confirmBulkDelete()`: Thực hiện xóa hàng loạt với error handling
- `toggleSelectMenu()`: Toggle chọn/bỏ chọn một menu
- `toggleSelectAll()`: Toggle chọn/bỏ chọn tất cả menu

**UI mới:**
- Checkbox ở header table
- Nút "Xóa X menu" khi có menu được chọn
- Dialog xác nhận với nội dung động

### 2. `/frontend/src/components/menu/SortableMenuRow.tsx`
**Props mới:**
- `isSelected`: Boolean cho biết menu có được chọn không
- `onToggleSelect`: Callback để toggle trạng thái chọn

**UI mới:**
- TableCell đầu tiên chứa Checkbox
- Checkbox được truyền xuống các menu con

## Cách sử dụng

### Xóa menu đơn lẻ:
1. Click vào icon Trash (🗑️) ở cột "Hành động"
2. Dialog xác nhận xuất hiện với tên menu
3. Click "Xóa" để xác nhận hoặc "Hủy" để hủy bỏ

### Xóa menu hàng loạt:
1. Check vào các checkbox của menu muốn xóa
2. Nút "Xóa X menu" xuất hiện ở header card
3. Click vào nút "Xóa X menu"
4. Dialog xác nhận xuất hiện với số lượng menu
5. Click "Xóa" để xác nhận

### Chọn tất cả menu:
1. Click vào checkbox ở header table
2. Tất cả menu sẽ được chọn
3. Click lại để bỏ chọn tất cả

## Xử lý lỗi

- Nếu xóa hàng loạt và có menu bị lỗi:
  - Menu khác vẫn tiếp tục được xóa
  - Hiển thị thông báo tổng hợp kết quả
  - Console log các lỗi chi tiết

## Ghi chú kỹ thuật

- Sử dụng `Set<string>` để lưu trữ ID menu được chọn (hiệu quả hơn Array)
- Convert Set thành Array khi iterate để tránh lỗi TypeScript
- Dialog component từ shadcn/ui với variant destructive
- Toast notifications từ sonner
- Xóa tuần tự (không parallel) để tránh race condition

## Cải tiến trong tương lai

- [ ] Thêm animation khi xóa menu
- [ ] Undo function (hoàn tác xóa)
- [ ] Export danh sách menu trước khi xóa
- [ ] Soft delete (đánh dấu xóa thay vì xóa vĩnh viễn)
- [ ] Xóa đệ quy các menu con khi xóa menu cha
- [ ] Progress bar cho xóa hàng loạt nhiều menu
