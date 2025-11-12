# Tạo Khóa Học Từ Tài Liệu Nguồn - 2 Bước

## ✅ Đã hoàn thành

### Backend
1. **Query phân tích tài liệu** (`analyzeDocumentsForCourse`)
   - Input: `documentIds[]`, `additionalContext` (optional)
   - Output: 13 fields gợi ý (title, description, level, objectives, structure, etc.)
   - AI phân tích mà KHÔNG tạo khóa học

2. **Mutation tạo khóa học** (`generateCourseFromDocuments`)
   - Input: Dữ liệu đã chỉnh sửa từ step 2
   - Output: Course với modules, lessons, quizzes đầy đủ

### Frontend
1. **Page 2-step wizard** (`/lms/admin/courses/create-from-documents/page.tsx`)
   - **Bước 1**: Chọn tài liệu + AI phân tích
   - **Bước 2**: Chỉnh sửa kết quả + Tạo khóa học

2. **GraphQL queries**
   - `ANALYZE_DOCUMENTS_FOR_COURSE` query
   - `GENERATE_COURSE_FROM_DOCUMENTS` mutation

3. **Navigation**
   - Thêm button "Từ tài liệu" vào courses page

## 🎨 Giao diện

### Bước 1: Phân tích AI
- Combobox multi-select tài liệu nguồn
- Textarea thông tin bổ sung
- Button "Phân tích AI" với loading state
- Mobile First responsive

### Bước 2: Chỉnh sửa & Tạo
- Card hiển thị kết quả phân tích:
  - Thời lượng ước tính
  - Cấp độ đề xuất  
  - Chủ đề chính (badges)
  - Từ khóa (tags)
  - Tóm tắt phân tích

- Form chỉnh sửa (pre-filled):
  - Tiêu đề khóa học *
  - Mô tả
  - Cấp độ
  - Mục tiêu học tập (multi-line)
  - Bạn sẽ học được gì (multi-line)
  - Yêu cầu (multi-line)
  - Đối tượng học viên (multi-line)
  - Cấu trúc đề xuất (readonly)

- Buttons:
  - "Quay lại" → Bước 1
  - "Tạo khóa học" → Generate

## 🔧 Bug fixes

1. ✅ Import path: `@/components/lms/SourceDocumentSelector`
2. ✅ Named export: `{ SourceDocumentSelector }`
3. ✅ Toast format: Thêm `type: 'success' | 'error'`
4. ✅ Remove emoji và variant trong toast

## 📝 Luồng hoạt động

1. User chọn 1+ tài liệu nguồn
2. Click "Phân tích AI" → Backend gọi Gemini API
3. AI trả về 13 fields gợi ý
4. Frontend hiển thị kết quả + pre-fill form
5. User review/edit thông tin
6. Click "Tạo khóa học" → Backend tạo course đầy đủ
7. Redirect đến course detail page

## 🎯 Tuân thủ rulepromt.txt

- ✅ Clean Architecture
- ✅ Mobile First + Responsive + PWA
- ✅ Combobox (không dùng Select)
- ✅ Tiếng Việt UI
- ✅ Dialog layout (header/footer/scrollable)
- ✅ Performance optimized
- ✅ Code ngắn gọn, dễ maintain
