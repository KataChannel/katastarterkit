# LMS - BÁO CÁO CHUYỂN ĐỔI TIẾNG VIỆT

## Ngày cập nhật: 21/10/2025

---

## ✅ ĐÃ HOÀN THÀNH

### 1. Pages (Trang)

#### `/lms/page.tsx` - Trang chủ LMS ✅
- Hero: "Chào mừng đến Katacore LMS"
- Stats: "Khóa học", "Học viên", "Giảng viên", "Tỉ lệ thành công"
- Features: "Khóa học Video", "Nội dung Đa dạng", "Bài kiểm tra", "Chứng chỉ"
- CTA: "Khám phá khóa học", "Học tập của tôi", "Trở thành Giảng viên"
- Quick Links: "Dành cho Học viên", "Dành cho Giảng viên", "Tính năng"

#### `/lms/courses/page.tsx` - Danh sách khóa học ✅
- Hero: "Khám phá Khóa học"
- Search: "Tìm kiếm khóa học..."
- Filters: "Bộ lọc", "Đang lọc", "Xóa tất cả bộ lọc"
- Categories: "Danh mục", "Tất cả danh mục"
- Levels: "Cấp độ", "Tất cả cấp độ"
  - "Cơ bản" (BEGINNER)
  - "Trung cấp" (INTERMEDIATE)
  - "Nâng cao" (ADVANCED)
  - "Chuyên gia" (EXPERT)
- Results: "X khóa học", "Hiển thị kết quả đã lọc"
- Loading: "Đang tải..."
- Error: "Không thể tải khóa học. Vui lòng thử lại."
- Empty: "Không có khóa học phù hợp với bộ lọc", "Chưa có khóa học nào"

#### `/lms/my-learning/page.tsx` - Học tập của tôi ✅
- Header: "Học tập của tôi"
- Stats:
  - "Tổng khóa học" (Total Courses)
  - "Đang học" (In Progress)
  - "Hoàn thành" (Completed)
  - "Tiến độ TB" (Avg. Progress)
- Tabs: "Tất cả", "Đang học", "Hoàn thành"
- Progress: "Tiến độ"
- Status: "Hoàn thành", "Hoàn thành vào {date}"
- Empty states:
  - "Chưa có khóa học nào"
  - "Chưa có khóa học hoàn thành"
  - "Chưa có khóa học đang học"
  - "Bắt đầu học bằng cách ghi danh khóa học"
- Button: "Duyệt khóa học"
- Loading: "Đang tải khóa học của bạn..."
- Error: "Lỗi khi tải khóa học", "Vui lòng thử lại sau"

### 2. Components (Thành phần)

#### `CourseList.tsx` ✅
- Empty message: "Không tìm thấy khóa học"
- Check back: "Kiểm tra lại sau để xem khóa học mới"

#### `CourseCard.tsx` ✅
- Price: "Miễn phí" (Free), "$X" (Paid)
- Level labels:
  - "Cơ bản" (BEGINNER)
  - "Trung cấp" (INTERMEDIATE)
  - "Nâng cao" (ADVANCED)
  - "Chuyên gia" (EXPERT)

#### `EnrollButton.tsx` ✅
- "Vào học" (Go to Course)
- "Đang ghi danh..." (Enrolling...)
- "Ghi danh - $X" (Enroll for $X)
- "Ghi danh miễn phí" (Enroll for Free)
- Error: "Không thể ghi danh khóa học"

#### `ReviewForm.tsx` ✅
- Label: "Đánh giá của bạn *" (Your Rating)
- Rating: "X sao"
- Comment: "Nhận xét của bạn (Tùy chọn)"
- Placeholder: "Chia sẻ trải nghiệm của bạn về khóa học này..."
- Character count: "X / 1000 ký tự"
- Buttons:
  - "Đang gửi..." (Submitting...)
  - "Cập nhật đánh giá" (Update Review)
  - "Gửi đánh giá" (Submit Review)
  - "Hủy" (Cancel)
- Errors:
  - "Vui lòng chọn đánh giá sao" (Please select a rating)
  - "Không thể gửi đánh giá" (Failed to submit review)

---

## 🔄 CẦN CẬP NHẬT THÊM

### 1. Components chưa chuyển hoàn toàn:

#### `ReviewList.tsx` - Cần chuyển
- [ ] "Sort by", "Most Recent", "Most Helpful", "Highest Rating"
- [ ] "No reviews yet", "Be the first to review this course"
- [ ] "Helpful", "Edit", "Delete"
- [ ] "Are you sure you want to delete this review?"
- [ ] Loading states
- [ ] Error messages

#### `ReviewsSection.tsx` - Cần kiểm tra
- [ ] Heading và labels
- [ ] Tab names
- [ ] Filter options

#### `QuizTaker.tsx` - Cần chuyển
- [ ] "Start Quiz", "Submit Quiz", "Retake Quiz"
- [ ] "Time Remaining", "Question X of Y"
- [ ] "Your Score", "Passed", "Failed"
- [ ] Loading và error states

#### `QuizResults.tsx` - Cần chuyển
- [ ] "Quiz Results", "Your Score"
- [ ] "Correct Answers", "Incorrect Answers"
- [ ] "Pass/Fail" status
- [ ] "Review Answers", "Retake Quiz"

#### `LessonViewer.tsx` - Cần kiểm tra
- [ ] "Next Lesson", "Previous Lesson"
- [ ] "Mark as Complete"
- [ ] Progress indicators

#### `FileUpload.tsx` - Cần chuyển
- [ ] "Drag and drop files here"
- [ ] "or click to browse"
- [ ] "Uploading...", "Upload failed"
- [ ] File type và size errors

#### `VideoPlayer.tsx` - Đã OK (chỉ có UI controls)

#### `ProgressBar.tsx` - Đã OK (chỉ có visual)

#### `RatingStars.tsx` - Đã OK (chỉ có visual)

#### `RichTextEditor.tsx` - Cần kiểm tra placeholders

### 2. Pages cần chuyển:

#### `/lms/courses/[slug]/page.tsx` - Course Detail
- [ ] Course information labels
- [ ] "Enroll Now", "Start Learning"
- [ ] "What you'll learn"
- [ ] "Requirements"
- [ ] "Description"
- [ ] "Course Content"
- [ ] "Instructor"
- [ ] "Reviews"
- [ ] Price information

#### `/lms/learn/[slug]/page.tsx` - Learning Page
- [ ] Sidebar navigation
- [ ] Lesson titles
- [ ] Module names
- [ ] Progress indicators
- [ ] Navigation buttons

#### `/lms/instructor/dashboard/page.tsx` - Instructor Dashboard
- [ ] Stats labels
- [ ] "My Courses", "Create Course"
- [ ] Course management actions
- [ ] Analytics labels

### 3. Wizard Components (Course Creation):

#### `BasicInfoStep.tsx` - Cần chuyển
- [ ] Form labels
- [ ] Placeholders
- [ ] Validation messages
- [ ] Help text

#### `LessonsStep.tsx` - Cần chuyển
- [ ] "Add Lesson", "Add Module"
- [ ] Lesson type labels
- [ ] Form fields

#### `ModulesStep.tsx` - Cần chuyển (nếu tồn tại)

#### `PublishStep.tsx` - Cần chuyển (nếu tồn tại)

---

## 📋 CHECKLIST TIẾP THEO

### Ưu tiên cao:
1. ✅ Pages chính (home, courses, my-learning)
2. ✅ CourseList và CourseCard
3. ✅ EnrollButton
4. ✅ ReviewForm
5. ⏳ ReviewList (đang làm)
6. ⏳ Course Detail Page
7. ⏳ Quiz Components
8. ⏳ Learning Page

### Ưu tiên trung bình:
9. ⏳ Instructor Dashboard
10. ⏳ Course Creation Wizard
11. ⏳ FileUpload
12. ⏳ ReviewsSection

### Ưu tiên thấp:
13. ⏳ RichTextEditor placeholders
14. ⏳ Error messages toàn bộ
15. ⏳ Toast notifications
16. ⏳ Confirmation dialogs

---

## 🎯 MỤC TIÊU

- [ ] 100% UI text tiếng Việt
- [ ] Tất cả error messages tiếng Việt
- [ ] Tất cả validation messages tiếng Việt
- [ ] Tất cả placeholders tiếng Việt
- [ ] Tất cả button labels tiếng Việt
- [ ] Format date theo locale vi-VN
- [ ] Format numbers theo locale vi-VN

---

## 📝 GHI CHÚ

### Từ vựng chuẩn hóa:
- Course → Khóa học
- Lesson → Bài học
- Module → Module/Chương
- Instructor → Giảng viên
- Student → Học viên
- Enroll → Ghi danh
- Learning → Học tập
- Progress → Tiến độ
- Complete → Hoàn thành
- Review → Đánh giá
- Rating → Xếp hạng/Sao
- Quiz → Bài kiểm tra
- Submit → Gửi
- Cancel → Hủy
- Edit → Chỉnh sửa
- Delete → Xóa
- Save → Lưu
- Loading → Đang tải
- Error → Lỗi

### Cấp độ:
- BEGINNER → Cơ bản
- INTERMEDIATE → Trung cấp
- ADVANCED → Nâng cao
- EXPERT → Chuyên gia

### Trạng thái:
- Active → Đang hoạt động
- Completed → Hoàn thành
- In Progress → Đang học
- Published → Đã xuất bản
- Draft → Bản nháp

---

*Cập nhật lần cuối: 21/10/2025*
