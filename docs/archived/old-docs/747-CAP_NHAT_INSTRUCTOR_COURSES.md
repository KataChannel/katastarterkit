# Cập nhật: Instructor Courses giống Admin Courses

## Tổng quan
Cập nhật hệ thống tạo khóa học cho Instructor để hoạt động giống như Admin, bao gồm 2-step creation flow và AI analyze với confirmation.

## Files đã cập nhật

### 1. `/frontend/src/app/lms/instructor/courses/create/page.tsx`
- ✅ Copy từ admin create page
- ✅ Đổi routes từ `/lms/admin` → `/lms/instructor`
- **Flow:** Step 1 chọn documents → Step 2 chọn method (manual/ai-analyze/ai-generate)

### 2. `/frontend/src/app/lms/instructor/courses/create-manual/page.tsx` (NEW)
- ✅ Copy từ admin create-manual page
- ✅ Update routes về instructor courses
- **Tính năng:** Form tạo khóa học thủ công với đầy đủ fields

### 3. `/frontend/src/app/lms/instructor/courses/create-ai-analyze/page.tsx` (NEW)
- ✅ Copy từ admin create-ai-analyze với confirmation step
- ✅ Không auto-analyze, user phải click "Bắt đầu phân tích bằng AI"
- ✅ Fix loop bug với `hasAttemptedAnalysis` flag
- **Tính năng:** AI phân tích documents + user xác nhận trước khi analyze

### 4. `/frontend/src/app/lms/instructor/layout.tsx`
- ✅ Update submenu "Khóa học của tôi"
- ✅ Chỉ giữ: "Danh sách" và "Tạo khóa học" (giống admin)
- ✅ Xóa các submenu cũ: "Từ tài liệu", "Tạo với AI"

## Thay đổi chính

### Route Changes
```
Admin                                    → Instructor
/lms/admin/courses/create               → /lms/instructor/courses/create
/lms/admin/courses/create-manual        → /lms/instructor/courses/create-manual
/lms/admin/courses/create-ai-analyze    → /lms/instructor/courses/create-ai-analyze
```

### UI/UX
- ✅ Giữ nguyên design shadcn UI
- ✅ Mobile-first responsive
- ✅ 2-step wizard với progress indicator
- ✅ Confirmation step cho AI analyze (không auto-run)

### Bug Fixes đã áp dụng
1. **Loop prevention:** `hasAttemptedAnalysis` flag
2. **No setCurrentStep trong onError:** Tránh trigger useEffect loop
3. **Manual confirm button:** User control AI analyze timing

## Kết quả

✅ Instructor có đầy đủ tính năng tạo khóa học như Admin
✅ Không có loop error
✅ User experience tốt hơn với confirmation step
✅ Code clean, maintainable, dễ expand

## Testing

1. Navigate: `/lms/instructor/courses/create`
2. Chọn 1+ documents → Next
3. Chọn method (manual hoặc ai-analyze)
4. Với AI Analyze: Nhìn thấy documents, click "Bắt đầu phân tích" để confirm
5. Verify không có loop khi document chưa published
