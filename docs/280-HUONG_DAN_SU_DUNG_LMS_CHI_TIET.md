# 📚 Hướng Dẫn Sử Dụng Chi Tiết - Hệ Thống LMS

## 🎯 Mục Lục

1. [Dành cho Học Viên](#học-viên)
2. [Dành cho Giảng Viên](#giảng-viên)
3. [Tính Năng Nâng Cao](#tính-năng-nâng-cao)
4. [FAQ](#faq)

---

## 👨‍🎓 Dành cho Học Viên

### 1. Tìm Kiếm và Khám Phá Khóa Học

#### Trang Danh Sách Khóa Học (`/lms/courses`)

**Tìm kiếm nhanh:**
- Nhập từ khóa vào ô tìm kiếm ở đầu trang
- Tìm theo: tên khóa học, giảng viên, nội dung, kỹ năng

**Lọc theo Danh Mục:**
- Sidebar bên trái hiển thị danh mục với:
  - 📌 **Icon** đại diện cho từng danh mục
  - 🔢 **Badge count** hiển thị số khóa học
  - ✓ **Radio button** chọn 1 danh mục

Danh mục phổ biến:
- 💻 **Programming** - Lập trình
- 💼 **Business** - Kinh doanh
- 🎨 **Design** - Thiết kế
- 📊 **Data** - Dữ liệu & Analytics
- 📱 **Marketing** - Marketing số
- 🔧 **Technology** - Công nghệ

**Lọc theo Cấp Độ:**
- 🌱 **Cơ bản** (Beginner) - Người mới bắt đầu
- 📚 **Trung cấp** (Intermediate) - Có kiến thức cơ bản
- 🚀 **Nâng cao** (Advanced) - Trình độ cao
- 🏆 **Chuyên gia** (Expert) - Chuyên gia

**Chế độ hiển thị:**
- **Lưới** (Grid) - Hiển thị 3-4 khóa học/hàng với thumbnail lớn
- **Danh sách** (List) - Hiển thị 1 khóa học/hàng với thông tin chi tiết

**Mobile:**
- Nhấn nút **"Bộ lọc"** để mở sidebar filter
- Sidebar trượt từ bên trái
- Chọn filter và đóng sidebar

### 2. Xem Chi Tiết Khóa Học

#### Trang Chi Tiết (`/lms/courses/[slug]`)

**Thông tin hiển thị:**

**Header:**
- Tiêu đề khóa học
- Mô tả ngắn gọn
- Rating (⭐ 4.5/5) và số lượt đánh giá
- Giảng viên (avatar + tên)
- Giá khóa học (hoặc "Miễn phí")
- Nút **"Đăng ký ngay"** hoặc **"Tiếp tục học"**

**Tab Navigation:**
1. **Tổng quan**
   - Bạn sẽ học được gì
   - Yêu cầu (Prerequisites)
   - Đối tượng học viên

2. **Nội dung khóa học**
   - Danh sách Module (Section)
   - Mỗi module có:
     - Tiêu đề
     - Số bài học
     - Tổng thời lượng
     - Danh sách lessons (expand/collapse)

3. **Giảng viên**
   - Thông tin giảng viên
   - Tiểu sử
   - Số khóa học đã tạo
   - Số học viên

4. **Đánh giá**
   - Thống kê rating
   - Danh sách reviews từ học viên
   - Form viết review (sau khi hoàn thành khóa học)

**Preview Lessons:**
- Một số bài học có nhãn **"Preview"**
- Click để xem trước không cần đăng ký

### 3. Đăng Ký Khóa Học

**Khóa học Miễn phí:**
1. Nhấn **"Enroll Now"** / **"Đăng ký ngay"**
2. Xác nhận đăng ký
3. ✅ Tự động chuyển đến trang học

**Khóa học Có phí:**
1. Nhấn **"Enroll Now"**
2. Chuyển đến trang thanh toán
3. Chọn phương thức thanh toán
4. Hoàn tất thanh toán
5. ✅ Enrollment được tạo
6. Bắt đầu học

### 4. Học Bài

#### Trang Học (`/lms/learn/[slug]`)

**Layout:**

```
┌─────────────────────────────────────┐
│   Course Title | Progress Bar       │
├──────────┬──────────────────────────┤
│ Sidebar  │  Video Player            │
│          │                          │
│ Lessons  │  (hoặc Text Content)     │
│ List     │                          │
│          ├──────────────────────────┤
│ Module 1 │  Tabs:                   │
│  ✓ L1    │  - Overview              │
│  → L2    │  - Resources             │
│    L3    │  - Discussions           │
│          │  - Quiz                  │
│ Module 2 │                          │
│    L4    │                          │
└──────────┴──────────────────────────┘
```

**Sidebar (Lessons List):**
- Danh sách module và lessons
- ✓ Completed lessons có checkmark
- → Lesson đang học có arrow
- Progress bar cho từng module
- Click lesson để chuyển

**Video Player:**
- Play/Pause
- Speed control (0.5x - 2x)
- Fullscreen
- Volume control
- Timeline với progress

**Text Lesson:**
- Nội dung markdown/HTML
- Code blocks với syntax highlighting
- Images và diagrams
- Attachments download

**Tabs:**
- **Overview**: Mô tả bài học
- **Resources**: Tài liệu đính kèm
- **Discussions**: Thảo luận, hỏi đáp
- **Quiz**: Bài kiểm tra (nếu có)

**Navigation:**
- Nút **"Previous"** - Bài trước
- Nút **"Next"** - Bài tiếp theo
- Nút **"Mark as Complete"** - Đánh dấu hoàn thành

**Auto-save Progress:**
- Video position tự động lưu
- Tiến độ cập nhật real-time
- Quay lại tiếp tục từ vị trí đã xem

### 5. Làm Bài Kiểm Tra (Quiz)

**Trước khi làm:**
- Xem thông tin: Số câu hỏi, thời gian, điểm đạt
- Nhấn **"Start Quiz"** để bắt đầu

**Trong khi làm:**
- Đếm ngược thời gian (nếu có)
- Trả lời từng câu hỏi
- Đánh dấu để review sau
- Có thể quay lại câu trước

**Các loại câu hỏi:**
- **Multiple Choice** - Chọn 1 đáp án
- **Multi Select** - Chọn nhiều đáp án
- **True/False** - Đúng/Sai
- **Short Answer** - Điền câu trả lời ngắn

**Sau khi làm:**
- Nhấn **"Submit Quiz"**
- Xem kết quả ngay lập tức:
  - Điểm số (X/100)
  - Số câu đúng/tổng số câu
  - Pass/Fail status
- Xem giải thích chi tiết
- Có thể làm lại (nếu fail)

### 6. Quản Lý Học Tập

#### Trang "Học tập của tôi" (`/lms/my-learning`)

**Hiển thị:**
- Danh sách khóa học đã đăng ký
- Progress bar cho từng khóa học
- Filter theo:
  - **Đang học** (In Progress)
  - **Hoàn thành** (Completed)
  - **Chưa bắt đầu** (Not Started)

**Mỗi card khóa học:**
- Thumbnail
- Tiêu đề
- Giảng viên
- Progress: X% hoàn thành
- Nút **"Continue Learning"** / **"Tiếp tục học"**
- Ngày đăng ký

**Quick Actions:**
- Sắp xếp theo: Mới nhất, Cũ nhất, Tiến độ
- Tìm kiếm trong khóa học của tôi

### 7. Chứng Chỉ

#### Điều kiện nhận chứng chỉ:
- ✅ Hoàn thành 100% lessons
- ✅ Pass tất cả quizzes
- ✅ Đạt điểm tối thiểu (nếu có yêu cầu)

#### Trang Chứng Chỉ (`/lms/my-certificates`)

**Danh sách chứng chỉ:**
- Thumbnail của chứng chỉ
- Tên khóa học
- Ngày hoàn thành
- Certificate ID
- Nút **"View"** - Xem chi tiết
- Nút **"Download PDF"** - Tải về

**Chứng chỉ bao gồm:**
- Logo LMS
- Tên học viên
- Tên khóa học
- Ngày hoàn thành
- QR Code xác thực
- Certificate ID
- Chữ ký giảng viên

**Chia sẻ:**
- Share link công khai
- Tải PDF
- Share lên LinkedIn/Facebook

### 8. Thảo Luận và Hỏi Đáp

**Trong bài học:**
- Tab **"Discussions"**
- Xem câu hỏi của học viên khác
- Đặt câu hỏi mới
- Reply/Comment
- Upvote câu hỏi hay
- Giảng viên trả lời có badge "Instructor"

**Tính năng:**
- Markdown formatting
- Upload images
- Tag giảng viên (@instructor)
- Filter: All, Unanswered, Following

---

## 👨‍🏫 Dành cho Giảng Viên

### 1. Truy Cập Dashboard

**URL:** `/lms/instructor/dashboard`

**Yêu cầu:** Role ADMIN

**Tổng quan hiển thị:**
- 📊 Total Courses
- 👥 Total Students
- 💰 Total Revenue
- ⭐ Average Rating

**Danh sách khóa học:**
- Grid/List view
- Filter: All, Published, Draft, Archived
- Mỗi card hiển thị:
  - Thumbnail
  - Title
  - Status badge
  - Students count
  - Revenue
  - Quick actions: Edit, Manage, Stats

### 2. Tạo Khóa Học Mới

**URL:** `/lms/instructor/courses/create`

#### Bước 1: Thông Tin Cơ Bản

**Form fields:**
- **Tiêu đề*** - Tên khóa học (tự động tạo slug)
- **Mô tả ngắn*** - Summary (150-200 ký tự)
- **Danh mục*** - Chọn từ dropdown
- **Cấp độ*** - Beginner/Intermediate/Advanced/Expert
- **Giá*** - Nhập số (0 = miễn phí)
- **Thời lượng** - Ước tính (giờ)

**Upload Media:**
- **Thumbnail*** - Ảnh đại diện (1280x720px khuyến nghị)
- **Trailer Video** - Video giới thiệu (YouTube/Vimeo link)

#### Bước 2: Nội Dung Chi Tiết

**What you'll learn:**
- Danh sách outcomes
- Mỗi item một dòng
- Tối thiểu 3 items

**Requirements:**
- Kiến thức cần có trước
- Tools/Software cần thiết
- Optional nhưng nên điền

**Target Audience:**
- Khóa học phù hợp với ai
- Giúp học viên tự đánh giá

**Tags:**
- Từ khóa liên quan
- Ngăn cách bởi dấu phẩy
- Tối đa 10 tags

#### Bước 3: SEO

**Meta Title** - Title cho SEO (60 ký tự)
**Meta Description** - Description cho SEO (160 ký tự)

**Sau khi tạo:**
- Khóa học ở trạng thái **DRAFT**
- Chuyển đến trang Manage để thêm nội dung

### 3. Quản Lý Nội Dung

**URL:** `/lms/instructor/courses/[id]/manage`

**Sidebar Navigation:**
- 📋 **Lessons** - Quản lý bài học
- 📝 **Quizzes** - Quản lý bài kiểm tra
- ⚙️ **Settings** - Cài đặt khóa học
- 📊 **Students** - Danh sách học viên
- 💬 **Discussions** - Q&A

#### Tab Lessons

**Structure:**
```
Course
 └─ Module 1: Introduction
     ├─ Lesson 1: Welcome (Video)
     ├─ Lesson 2: Overview (Text)
     └─ Lesson 3: Setup (Video)
 └─ Module 2: Core Concepts
     └─ ...
```

**Tạo Module:**
1. Nhấn **"Add Module"**
2. Nhập tên module
3. Mô tả (optional)
4. Save

**Tạo Lesson:**
1. Chọn module
2. Nhấn **"Add Lesson"**
3. Nhập thông tin:
   - Title
   - Type: Video / Text / Quiz
   - Duration (phút)
   - isFree (checkbox cho preview)
4. **Video Lesson:**
   - Upload video file
   - Hoặc nhập video URL (YouTube, Vimeo, S3)
5. **Text Lesson:**
   - Rich text editor
   - Upload images
   - Embed code
   - Attachments
6. Save

**Sắp xếp:**
- Drag & drop để thay đổi thứ tự
- Module và lesson tự động đánh số

**Bulk Actions:**
- Delete multiple lessons
- Move to another module
- Set as preview

#### Tab Quizzes

**Tạo Quiz:**
1. Nhấn **"Create Quiz"**
2. Thông tin cơ bản:
   - Title
   - Description
   - Module/Lesson liên kết
   - Passing Score (%)
   - Time Limit (phút)
   - Max Attempts
3. Add Questions:
   - Type: Multiple Choice, Multi Select, True/False
   - Question text
   - Options (A, B, C, D)
   - Correct Answer
   - Explanation (hiện sau khi submit)
   - Points
4. Save

**Preview Quiz:**
- Làm thử như học viên
- Kiểm tra logic
- Test auto-grading

#### Tab Students

**Hiển thị:**
- Danh sách học viên enrolled
- Progress của từng học viên
- Completion date
- Quiz scores

**Actions:**
- Xem chi tiết progress
- Message học viên
- Unenroll (nếu cần)
- Export danh sách Excel

### 4. Xuất Bản Khóa Học

**Checklist trước khi publish:**
- ✅ Có ít nhất 1 module
- ✅ Có ít nhất 3 lessons
- ✅ Thumbnail đã upload
- ✅ Mô tả đầy đủ
- ✅ Đã preview toàn bộ

**Publish:**
1. Vào trang Edit
2. Nhấn **"Publish Course"**
3. Confirm
4. ✅ Status chuyển sang PUBLISHED
5. Khóa học hiện trên catalog
6. Học viên có thể enroll

### 5. Quản Lý Thảo Luận

**Tab Discussions:**
- Xem tất cả câu hỏi từ học viên
- Filter: Unanswered, All Lessons, By Date
- Sort: Newest, Most Upvoted, Unanswered First

**Trả lời:**
- Click vào thread
- Viết reply
- Auto badge "Instructor"
- Email thông báo cho học viên

**Best Practices:**
- Trả lời trong 24h
- Detailed explanations
- Encourage peer learning
- Pin important threads

### 6. Xem Thống Kê

**Metrics:**
- Total Enrollments (theo thời gian)
- Completion Rate (%)
- Average Progress
- Quiz Performance
- Reviews & Ratings
- Revenue (nếu có)

**Charts:**
- Line chart: Enrollments over time
- Bar chart: Completion by module
- Pie chart: Rating distribution

**Export:**
- PDF report
- Excel data
- Share link

---

## 🚀 Tính Năng Nâng Cao

### 1. Xác Thực Chứng Chỉ

**Public verification:** `/lms/certificates/verify`

**Cách sử dụng:**
1. Nhập Certificate ID
2. Hoặc scan QR Code
3. ✅ Hiển thị thông tin:
   - Tên học viên
   - Khóa học
   - Ngày hoàn thành
   - Valid/Invalid status

**Use cases:**
- Nhà tuyển dụng verify
- Chia sẻ credential
- Portfolio proof

### 2. Bookmarks (Đánh dấu)

**Trong lesson:**
- Click **"Bookmark"** icon
- Thêm note (optional)
- Save

**Xem bookmarks:**
- Sidebar "My Bookmarks"
- Jump to timestamp (video)
- Jump to content (text)

### 3. Notes (Ghi chú)

**Trong khi học:**
- Tab "My Notes"
- Viết ghi chú theo lesson
- Auto-save
- Markdown support

**Quản lý:**
- Xem tất cả notes
- Search trong notes
- Export PDF
- Share với giảng viên

### 4. Speed Learning

**Video controls:**
- 0.5x - Chậm hơn
- 0.75x
- 1x - Normal
- 1.25x
- 1.5x
- 2x - Nhanh gấp đôi

**Keyboard shortcuts:**
- Space: Play/Pause
- ← →: Seek 5s
- ↑ ↓: Volume
- F: Fullscreen
- S: Toggle speed

### 5. Mobile App Features

**Offline Mode:**
- Download lessons
- Watch offline
- Auto-sync progress khi online

**Push Notifications:**
- New content available
- Assignment due date
- Quiz results
- Discussion replies
- Achievement unlocked

---

## ❓ FAQ

### Học Viên

**Q: Khóa học có thời hạn không?**
A: Không, một khi đã enroll, bạn có quyền truy cập vĩnh viễn.

**Q: Tôi có thể hoàn tiền không?**
A: Có, trong vòng 30 ngày nếu chưa hoàn thành >30% khóa học.

**Q: Làm sao để nhận chứng chỉ?**
A: Hoàn thành 100% bài học và pass tất cả quizzes.

**Q: Tôi fail quiz thì sao?**
A: Bạn có thể làm lại không giới hạn số lần.

**Q: Có thể xem trên mobile không?**
A: Có, LMS responsive hoàn toàn, hỗ trợ mọi thiết bị.

### Giảng Viên

**Q: Tôi nhận được bao nhiêu % revenue?**
A: 70% revenue sau khi trừ phí thanh toán.

**Q: Bao lâu để course được approve?**
A: 1-2 ngày làm việc sau khi submit.

**Q: Tôi có thể edit course sau khi publish?**
A: Có, nhưng nên thông báo học viên về thay đổi lớn.

**Q: Làm sao tăng enrollment?**
A: Tối ưu SEO, giá cạnh tranh, preview lessons, marketing.

**Q: Tôi có thể xóa course không?**
A: Chỉ khi chưa có học viên enroll. Nếu có, chỉ archive được.

---

## 📞 Hỗ Trợ

**Email:** support@lms.com
**Hotline:** 1900-xxxx
**Live Chat:** Click icon góc phải màn hình

**Giờ làm việc:** 8:00 - 17:00, Thứ 2 - Thứ 6

---

**Cập nhật:** 3/11/2025
**Version:** 2.0
