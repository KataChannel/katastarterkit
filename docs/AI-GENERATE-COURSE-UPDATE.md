# Cập Nhật Tính Năng AI Generate Course

## Tóm tắt
Đã hoàn thành cập nhật tính năng "Tạo khóa học hoàn toàn bằng AI" với cấu trúc modular, dễ maintenance.

## Cấu trúc Files

```
frontend/src/components/lms/ai-generate/
├── index.ts                    # Export tập trung
├── types.ts                    # Types & interfaces
├── DocumentSelectionStep.tsx   # Bước 1: Chọn tài liệu
├── CourseConfigStep.tsx        # Bước 2: Cấu hình khóa học
├── GenerationProgressStep.tsx  # Bước 3: Hiển thị tiến độ
├── CoursePreviewStep.tsx       # Bước 4: Xem trước kết quả
├── AIGenerateWizardHeader.tsx  # Header với navigation
└── useAIGenerate.ts            # Custom hook xử lý logic
```

## Tính năng chính

1. **Multi-step Wizard (4 bước)**
   - Chọn tài liệu nguồn
   - Cấu hình khóa học (cấp độ, số modules, bài/module...)
   - Xem tiến độ AI tạo khóa học
   - Xem trước & chỉnh sửa

2. **Cấu hình linh hoạt**
   - Cấp độ: Cơ bản/Trung cấp/Nâng cao
   - Số modules: 2-10
   - Số bài/module: 2-8
   - Độ dài bài: Ngắn/Trung bình/Dài
   - Phong cách: Học thuật/Thực hành/Đối thoại
   - Tùy chọn: Ví dụ, bài tập, quiz

3. **Theo dõi tiến độ realtime**
   - 6 bước xử lý với status
   - Progress bar tổng thể
   - Thông báo lỗi chi tiết

4. **Xem trước kết quả**
   - Thông tin khóa học
   - Cấu trúc modules/lessons
   - Expand/Collapse modules

## Tuân thủ Rule
- ✅ Mobile First + Responsive
- ✅ Combobox thay Select
- ✅ Dialog layout chuẩn
- ✅ Giao diện tiếng Việt
- ✅ Clean Architecture
- ✅ Phân tách components
