# Cập nhật Flow Tạo Khóa Học - LMS

## Tổng quan thay đổi

Đã cập nhật quy trình tạo khóa học theo hướng **bắt buộc chọn tài liệu nguồn trước**, sau đó chọn phương thức tạo (thủ công/AI phân tích/AI tạo hoàn toàn).

## Files thay đổi

### 1. Menu Layout (`frontend/src/app/lms/admin/layout.tsx`)
**Trước:**
```tsx
children: [
  { title: 'Danh sách', href: '/lms/admin/courses' },
  { title: 'Tạo mới', href: '/lms/admin/courses/create' },
  { title: 'Từ tài liệu', href: '/lms/admin/courses/create-from-documents' },
  { title: 'Tạo với AI', href: '/lms/admin/courses/create-with-ai' },
]
```

**Sau:**
```tsx
children: [
  { title: 'Danh sách', href: '/lms/admin/courses' },
  { title: 'Tạo khóa học', href: '/lms/admin/courses/create' },
]
```

### 2. Wizard Page (`/lms/admin/courses/create`)
- **Bước 1:** Chọn tài liệu nguồn
  - Sử dụng `SourceDocumentSelector` component
  - Cho phép chọn nhiều tài liệu
  - Hiển thị số lượng đã chọn
  
- **Bước 2:** Chọn phương thức tạo
  - 3 lựa chọn:
    1. **Tạo thủ công** (Manual) - Kiểm soát hoàn toàn
    2. **Phân tích AI** - AI đề xuất, user chỉnh sửa
    3. **Tạo hoàn toàn bằng AI** - Tự động 100%

### 3. Pages Implementation

#### `/lms/admin/courses/create-manual`
- Form tạo khóa học thủ công chi tiết
- Nhận documents từ query params `?documents=id1,id2,id3`
- Giữ nguyên functionality từ page cũ

#### `/lms/admin/courses/create-ai-analyze`
- **Status:** Coming Soon (Placeholder)
- **Features dự kiến:**
  - AI phân tích nội dung tài liệu
  - Đề xuất cấu trúc modules & lessons
  - Ước tính thời lượng
  - Đề xuất mức độ khó
  - User review và chỉnh sửa

#### `/lms/admin/courses/create-ai-generate`
- **Status:** Coming Soon (Placeholder)
- **Features dự kiến:**
  - Trích xuất nội dung tự động (PDF, Word, PPT...)
  - Sinh cấu trúc khóa học logic
  - Tạo nội dung bài giảng
  - Sinh bài tập & quiz
  - Video scripts & presentations

## Tuân thủ Rules

✅ **Rule 1-8:** Clean Architecture, performance, DX, UX, code quality, feature separation  
✅ **Rule 10:** Mobile First + Responsive - wizard layout responsive với progress indicator  
✅ **Rule 11:** Giao diện tiếng Việt - tất cả text tiếng Việt  
✅ **Rule 12:** Dialog layout - N/A (chưa dùng dialog trong wizard này)

## Flow mới

```
/lms/admin/courses
  └─ Click "Tạo khóa học"
     └─ /create (Wizard)
        ├─ Bước 1: Chọn tài liệu (bắt buộc)
        │   └─ Next →
        └─ Bước 2: Chọn phương thức
            ├─ Tạo thủ công → /create-manual?documents=...
            ├─ Phân tích AI → /create-ai-analyze?documents=... (Coming Soon)
            └─ Tạo bằng AI → /create-ai-generate?documents=... (Coming Soon)
```

## Backup

File gốc được backup tại:
- `frontend/src/app/lms/admin/courses/create/page.tsx.backup`

## Testing

Kiểm tra flow:
1. Vào `/lms/admin/courses`
2. Click "Tạo khóa học"
3. Chọn tài liệu nguồn (minimum 1)
4. Click "Tiếp theo"
5. Chọn phương thức "Tạo thủ công"
6. Verify redirect với documents params

## Next Steps (Future)

1. Implement AI analyze feature
2. Implement AI generate feature
3. Add AI model integration (GPT-4, Claude...)
4. Document extraction service
5. Content generation pipeline
