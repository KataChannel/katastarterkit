# Product Tree - Quản lý Sản phẩm & Danh mục

## Mô tả
Trang quản lý sản phẩm theo cấu trúc cây danh mục, tương tự blog-tree.

## Route
`/admin/product-tree`

## Components đã tạo

### 1. ProductTreeHeader
- **File**: `components/admin/product-tree/ProductTreeHeader.tsx`
- Header với tiêu đề và nút tạo danh mục/sản phẩm

### 2. ProductTreeStats  
- **File**: `components/admin/product-tree/ProductTreeStats.tsx`
- Hiển thị thống kê: Tổng danh mục, Tổng sản phẩm, Đang bán, Nháp, Nổi bật, Hết hàng

### 3. ProductTreeView
- **File**: `components/admin/product-tree/ProductTreeView.tsx`
- Hiển thị cây sản phẩm theo danh mục
- Expand/collapse từng danh mục
- Xem/sửa/xóa sản phẩm và danh mục
- Hiển thị giá, tồn kho, SKU, trạng thái

### 4. ProductCategoryDialog
- **File**: `components/admin/product-tree/ProductCategoryDialog.tsx`
- Dialog tạo/sửa danh mục sản phẩm
- Auto generate slug từ tên

### 5. Page
- **File**: `app/admin/product-tree/page.tsx`
- Trang chính tích hợp tất cả components
- Tìm kiếm, mở/thu gọn tất cả

## Tính năng
- ✅ Hiển thị sản phẩm theo cây danh mục
- ✅ Tìm kiếm theo tên/SKU/danh mục
- ✅ Mở/thu gọn tất cả danh mục
- ✅ Tạo/sửa/xóa danh mục
- ✅ Xóa danh mục kèm sản phẩm (có cảnh báo)
- ✅ Xem/sửa/xóa sản phẩm
- ✅ Hiển thị thống kê
- ✅ Mobile First + Responsive
- ✅ Giao diện tiếng Việt
