# Đơn giản hóa trang Tạo Khóa Học Với AI

## ✅ Đã hoàn thành

### Thay đổi chính
Loại bỏ tab "Từ Tài Liệu Nguồn" khỏi trang `create-with-ai` vì đã có trang riêng `/lms/admin/courses/create-from-documents`

### Trước khi cập nhật
Trang có 2 tabs:
1. **Từ Mô Tả** - Tạo từ prompt text
2. **Từ Tài Liệu Nguồn** - Chọn documents và AI tổng hợp (TRÙNG LẶP)

### Sau khi cập nhật
Chỉ còn 1 chức năng duy nhất:
- **Tạo từ Mô Tả AI** - Nhập prompt và AI tạo khóa học

### Đã xóa
- ❌ Tab "Từ Tài Liệu Nguồn"
- ❌ Component `SourceDocumentSelector`
- ❌ Component `AIAnalysisPanel`
- ❌ State `selectedDocumentIds`, `additionalPrompt`
- ❌ Query `GET_SOURCE_DOCUMENTS`
- ❌ Mutation `generateFromDocuments`
- ❌ Function `handleGenerateFromDocuments()`
- ❌ Icon `FileStack`

### Giữ lại
- ✅ Prompt input với Textarea
- ✅ Category selector (Select)
- ✅ Sample prompts (gợi ý nhanh)
- ✅ Templates sidebar (4 mẫu chi tiết)
- ✅ Tips section
- ✅ Mobile First responsive
- ✅ Loading states
- ✅ Toast notifications

## 🎯 Phân tách rõ ràng

**`/lms/admin/courses/create-with-ai`**
- Tạo từ mô tả text (prompt)
- Có sample prompts và templates
- Đơn giản, nhanh chóng

**`/lms/admin/courses/create-from-documents`** 
- Tạo từ tài liệu nguồn (2 bước)
- Bước 1: Chọn documents → AI phân tích
- Bước 2: Chỉnh sửa → Tạo khóa học
- Chi tiết, có thể review/edit

## 📊 Kết quả

- Code gọn gàng hơn (từ 542 dòng → 357 dòng)
- Tránh trùng lặp chức năng
- UX rõ ràng: 2 trang riêng biệt với 2 mục đích khác nhau
- Tuân thủ Clean Architecture - Separation of Concerns
- Dễ maintain và mở rộng

## 🎨 Giao diện

Layout 2 cột:
- **Cột trái (lg:col-span-2)**: Input area
  - Prompt textarea
  - Category select
  - Generate button
  - Sample prompts
  
- **Cột phải (lg:col-span-1)**: Templates sidebar
  - 4 mẫu khóa học chi tiết
  - Click để copy vào prompt
  - Sticky để luôn hiển thị

Mobile: Responsive stack layout
