# Gộp Quản Lý Blog & Danh Mục - Cấu Trúc Tree

## 📋 Tổng Quan

Đã tạo trang mới `/admin/blog-tree` để gộp quản lý bài viết và danh mục bài viết thành cấu trúc cây (tree view), thay thế 2 trang riêng biệt `/admin/blog` và `/admin/blog-categories`.

## 🎯 Tính Năng

### Cấu Trúc Tree
- **Danh mục** (Category) - Cấp 1: Hiển thị với icon folder, có thể mở/đóng
- **Bài viết** (Blog) - Cấp 2: Hiển thị dưới danh mục tương ứng
- **Chưa phân loại** - Danh mục đặc biệt cho bài viết chưa có category

### Chức Năng

1. **Hiển thị thống kê**: Tổng danh mục, tổng bài viết, đã xuất bản, nháp, nổi bật
2. **Tìm kiếm**: Search theo tên danh mục hoặc tiêu đề bài viết
3. **Mở/Thu gọn**: 
   - Mở/thu gọn từng danh mục
   - Nút "Mở tất cả" / "Thu gọn"
4. **Thao tác danh mục**:
   - Tạo mới
   - Chỉnh sửa (tên, slug, mô tả, hình ảnh, thứ tự, trạng thái)
   - Xóa:
     - **Không có bài viết**: Xóa danh mục trực tiếp
     - **Có bài viết**: Hiện dialog xác nhận → Xóa tất cả bài viết bên trong → Xóa danh mục
5. **Thao tác bài viết**:
   - Tạo mới (chuyển sang /admin/blog/create)
   - Xem bài viết (mở tab mới)
   - Chỉnh sửa
   - Xóa

## 📁 Cấu Trúc Files

### Page
- `/frontend/src/app/admin/blog-tree/page.tsx` - Trang chính

### Components
```
/frontend/src/components/admin/blog-tree/
├── BlogTreeHeader.tsx     - Header với nút tạo danh mục/bài viết
├── BlogTreeStats.tsx      - 5 cards thống kê
├── BlogTreeView.tsx       - Tree view hiển thị danh mục & bài viết
└── CategoryDialog.tsx     - Dialog tạo/sửa danh mục
```

## 🎨 UI/UX

### Tuân Thủ Rules
✅ Shadcn UI components  
✅ Mobile First + Responsive  
✅ Dialog với layout: Header, Footer, Content scrollable  
✅ Giao diện tiếng Việt  
✅ Phân tách components để dễ maintain/reuse  

### Responsive Design
- **Mobile**: Stack layout, actions ẩn -> hiện khi tap
- **Desktop**: Tree view full width, hover để hiện actions

### Visual Hierarchy
- **Danh mục**: Folder icon màu vàng, font đậm, background khác khi hover
- **Bài viết**: File icon xám, indent bên trái, border dọc để thể hiện cấp độ
- **Badge**: Status (Xuất bản/Nháp), Featured (icon trending), Post count

## 🔧 Technical

### GraphQL Queries
- `GET_BLOG_CATEGORIES_WITH_COUNT` - Lấy danh mục + số bài viết
- `GET_BLOGS` - Lấy tất cả bài viết (limit 1000)
- `CREATE_BLOG_CATEGORY` - Tạo danh mục
- `UPDATE_BLOG_CATEGORY` - Cập nhật danh mục
- `DELETE_BLOG_CATEGORY` - Xóa danh mục
- `DELETE_BLOG` - Xóa bài viết

### State Management
- `expandedCategories` - Set<string> tracking danh mục đang mở
- `searchTerm` - String filter theo tên
- Local state cho dialogs

### Data Flow
1. Fetch categories + blogs
2. Group blogs by categoryId
3. Build tree structure
4. Filter by search term
5. Render tree với expand/collapse

## � Tính Năng Nâng Cao

### Xóa Danh Mục Thông Minh
Khi xóa danh mục có bài viết:
1. Hiện dialog cảnh báo với background đỏ
2. Thông báo số lượng bài viết sẽ bị xóa
3. Nút xác nhận hiển thị: "Xóa danh mục và X bài viết"
4. Khi xác nhận:
   - Loading toast: "Đang xóa bài viết..."
   - Xóa tuần tự từng bài viết
   - Toast thành công: "Đã xóa X bài viết"
   - Xóa danh mục
   - Refetch data

## �📝 Next Steps

1. ✅ Tạo trang `/admin/blog-tree`
2. ✅ Tạo 4 components con
3. ✅ Implement xóa danh mục có bài viết
4. ⏳ Test giao diện mobile/desktop
5. ⏳ Cập nhật menu admin (thay 2 link cũ bằng link mới)
6. ⏳ Có thể xóa 2 trang cũ nếu không cần thiết

## 🚀 Ưu Điểm

- **Trực quan**: Thấy ngay cấu trúc danh mục - bài viết
- **Tiện lợi**: Quản lý cả 2 loại ở 1 màn hình
- **Hiệu quả**: Không cần chuyển qua lại giữa 2 trang
- **Mở rộng**: Dễ dàng thêm subcategory nếu cần (cấp 3)
