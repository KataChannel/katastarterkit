# 👨‍🏫 HƯỚNG DẪN GIẢNG VIÊN - LMS

## 📚 Mục lục
1. [Dashboard giảng viên](#dashboard-giảng-viên)
2. [Tạo khóa học mới](#tạo-khóa-học-mới)
3. [Quản lý modules và lessons](#quản-lý-modules-và-lessons)
4. [Tạo và quản lý Quiz](#tạo-và-quản-lý-quiz)
5. [Quản lý học viên](#quản-lý-học-viên)
6. [Quản lý tài liệu nguồn](#quản-lý-tài-liệu-nguồn)
7. [Xem báo cáo và thống kê](#xem-báo-cáo-và-thống-kê)

---

## 📊 Dashboard giảng viên

### Truy cập
Đường dẫn: `/lms/instructor`

### Thông tin hiển thị
- **Tổng quan**:
  - Số khóa học đã tạo
  - Tổng học viên
  - Doanh thu (nếu có khóa trả phí)
  - Đánh giá trung bình

- **Khóa học của tôi**:
  - Danh sách tất cả khóa học
  - Trạng thái: Draft, Published, Archived
  - Số học viên đăng ký
  - Rating

- **Quick Actions**:
  - ➕ Tạo khóa học mới
  - 📚 Quản lý khóa học
  - 👥 Xem học viên
  - 📊 Xem báo cáo

---

## ➕ Tạo khóa học mới

### Các phương thức tạo khóa học

#### 1️⃣ Tạo thủ công (Manual)
**Đường dẫn**: `/lms/instructor/courses/create-manual`

**Bước 1: Thông tin cơ bản**
- Tiêu đề khóa học
- Mô tả ngắn
- Mô tả chi tiết
- Chọn danh mục
- Cấp độ: Beginner/Intermediate/Advanced
- Giá (0 = miễn phí)
- Thumbnail (ảnh đại diện)
- Video giới thiệu (trailer)

**Bước 2: Mục tiêu học tập**
- Học viên sẽ học được gì
- Yêu cầu kiến thức đầu vào
- Đối tượng phù hợp

**Bước 3: SEO và Marketing**
- Meta title, description
- Tags (từ khóa)

**Bước 4: Lưu**
- **Save as Draft**: Lưu nháp
- **Publish**: Xuất bản ngay

#### 2️⃣ Tạo từ tài liệu (From Documents)
**Đường dẫn**: `/lms/instructor/courses/create-from-documents`

**Quy trình**:
1. Chọn tài liệu từ thư viện
2. Chọn nhiều files: PDF, DOC, PPT
3. AI phân tích và gợi ý:
   - Tiêu đề khóa học
   - Modules
   - Lessons
4. Chỉnh sửa và xác nhận
5. Hệ thống tự động tạo cấu trúc

#### 3️⃣ Tạo với AI (AI Generate)
**Đường dẫn**: `/lms/instructor/courses/create-ai-generate`

**Quy trình**:
1. Nhập chủ đề khóa học
2. Chọn cấp độ và số lượng lessons
3. AI tự động:
   - Tạo outline
   - Tạo nội dung chi tiết
   - Tạo quiz
4. Review và chỉnh sửa
5. Publish

#### 4️⃣ Phân tích AI (AI Analyze)
**Đường dẫn**: `/lms/instructor/courses/create-ai-analyze`

**Dùng khi**:
- Upload video/audio dài
- AI transcribe và tạo nội dung
- Tự động chia thành các lessons

---

## 📖 Quản lý modules và lessons

### Truy cập quản lý khóa học
1. Vào Dashboard → **"Khóa học của tôi"**
2. Click **"Manage"** trên khóa học
3. Hoặc: `/lms/instructor/courses/[courseId]/manage`

### Tab quản lý

#### 📋 Tab "Lessons"
**Đường dẫn**: `/lms/instructor/courses/[id]/lessons`

##### Tạo Module (Chương)
1. Click **"+ Add Module"**
2. Nhập:
   - Tên module
   - Mô tả
   - Thứ tự
3. Click **"Create"**

##### Thêm Lesson vào Module
1. Click **"+ Add Lesson"** trong module
2. Chọn loại lesson:
   - **Video**: Upload hoặc paste link YouTube/Vimeo
   - **Text**: Soạn nội dung với Rich Text Editor
   - **Quiz**: Tạo bài kiểm tra
   - **Assignment**: Bài tập nộp file

3. Điền thông tin:
   - Tiêu đề
   - Mô tả
   - Nội dung/URL
   - Thời lượng (phút)
   - Đánh dấu "Free Preview" (cho phép xem trước)
   - Đánh dấu "Is Free" (bài miễn phí)

4. Upload tài liệu đính kèm (PDF, DOC, slides)

5. Click **"Save"**

##### Sắp xếp thứ tự
- **Drag & Drop** để sắp xếp modules
- **Drag & Drop** lessons trong module
- Hoặc dùng nút ⬆️⬇️

##### Chỉnh sửa/Xóa
- Click icon **"Edit"** ✏️ để chỉnh sửa
- Click icon **"Delete"** 🗑️ để xóa
- Xác nhận trước khi xóa

---

## ✅ Tạo và quản lý Quiz

### Tab "Quizzes"
**Đường dẫn**: `/lms/instructor/courses/[id]/quizzes`

### Tạo Quiz mới
1. Click **"+ Create Quiz"**
2. Chọn lesson để gắn quiz

#### Thông tin Quiz
- Tiêu đề quiz
- Mô tả
- **Passing Score**: Điểm đạt (%) - VD: 70%
- **Time Limit**: Thời gian (phút) - 0 = không giới hạn
- **Max Attempts**: Số lần làm tối đa
- **Is Required**: Bắt buộc để hoàn thành khóa học

### Thêm câu hỏi

#### Loại câu hỏi
1. **Multiple Choice**: Chọn 1 hoặc nhiều đáp án
2. **True/False**: Đúng/Sai
3. **Fill in Blank**: Điền vào chỗ trống (coming soon)

#### Tạo câu hỏi Multiple Choice
1. Click **"+ Add Question"**
2. Nhập:
   - Câu hỏi
   - Điểm (points)
   - Giải thích (hiện sau khi trả lời)
3. Thêm đáp án:
   - Click **"+ Add Answer"**
   - Nhập text đáp án
   - Đánh dấu ✅ nếu là đáp án đúng
   - Có thể có nhiều đáp án đúng
4. Upload hình ảnh câu hỏi (nếu cần)

#### Tạo câu True/False
1. Click **"+ Add Question"** → Chọn "True/False"
2. Nhập câu hỏi
3. Chọn đáp án đúng: True hoặc False
4. Thêm giải thích

### Xem trước Quiz
- Click **"Preview"** để test quiz
- Làm thử như học viên

### Auto-generate Quiz với AI
1. Click **"Generate with AI"**
2. Chọn lesson làm nguồn
3. AI tự động tạo 5-7 câu hỏi
4. Review và edit
5. Save

---

## 👥 Quản lý học viên

### Xem danh sách học viên
**Đường dẫn**: `/lms/instructor/students`

### Thông tin hiển thị
- Danh sách tất cả học viên trong khóa học của bạn
- Lọc theo khóa học
- Thông tin:
  - Tên học viên
  - Email
  - Khóa học đang học
  - Tiến độ (%)
  - Ngày đăng ký
  - Trạng thái: Active/Completed/Dropped

### Xem chi tiết học viên
1. Click vào học viên
2. Đường dẫn: `/lms/instructor/students/[id]`
3. Xem:
   - Tất cả khóa học đã đăng ký
   - Tiến độ từng khóa
   - Lessons đã hoàn thành
   - Điểm quiz
   - Lịch sử hoạt động

### Tương tác với học viên
- **Message**: Gửi tin nhắn trực tiếp
- **View Progress**: Xem chi tiết tiến độ
- **Reset Progress**: Reset tiến độ (nếu cần)
- **Issue Certificate**: Cấp chứng chỉ thủ công

---

## 📚 Quản lý tài liệu nguồn

### Thư viện tài liệu
**Đường dẫn**: `/lms/instructor/source-documents`

### Tạo tài liệu mới
1. Click **"+ New Document"**
2. Đường dẫn: `/lms/instructor/source-documents/new`

#### Loại tài liệu
- **File**: PDF, DOC, XLS, PPT
- **Video**: MP4, YouTube, Vimeo
- **Audio**: MP3, Podcast
- **Text**: Markdown, Plain text
- **Link**: External URL
- **Image**: PNG, JPG, Diagram

#### Thông tin tài liệu
- Tiêu đề
- Mô tả
- Chọn danh mục
- Tags
- Upload file hoặc paste URL
- Trạng thái:
  - **Draft**: Nháp
  - **Processing**: Đang xử lý
  - **Published**: Đã xuất bản

### Phân tích AI (AI Analysis)
- Click **"Analyze with AI"**
- AI tự động:
  - Tạo summary
  - Trích xuất keywords
  - Nhận diện topics
- Giúp tổ chức tài liệu tốt hơn

### Gắn tài liệu vào khóa học
1. Vào tab **"Documents"** trong quản lý khóa học
2. Click **"+ Add Document"**
3. Chọn từ thư viện
4. Đánh dấu "Required" nếu bắt buộc
5. Thêm mô tả tại sao tài liệu quan trọng

### Quản lý
- **Edit**: Chỉnh sửa thông tin
- **Delete**: Xóa tài liệu
- **View Stats**: Xem lượt xem, download

---

## 📊 Xem báo cáo và thống kê

### Dashboard Analytics
**Đường dẫn**: `/lms/instructor/reports`

### Báo cáo tổng quan
- **Enrollment Trends**: Xu hướng đăng ký theo thời gian
- **Completion Rate**: Tỉ lệ hoàn thành
- **Revenue**: Doanh thu (nếu có)
- **Student Engagement**: Mức độ tương tác

### Báo cáo từng khóa học
1. Chọn khóa học
2. Xem:
   - Số học viên đăng ký
   - Tiến độ trung bình
   - Lessons phổ biến nhất
   - Quiz khó nhất (tỉ lệ fail cao)
   - Đánh giá và reviews

### Báo cáo Quiz
- Câu hỏi nào khó nhất
- Tỉ lệ đúng/sai từng câu
- Thời gian làm bài trung bình
- Số lần retry

### Export báo cáo
- Click **"Export"**
- Chọn định dạng: PDF, Excel
- Download về máy

---

## 🎯 Yêu cầu phê duyệt khóa học

### Quy trình phê duyệt
Khóa học cần được Admin phê duyệt trước khi công khai.

#### Bước 1: Hoàn thiện khóa học
- ✅ Có ít nhất 3 modules
- ✅ Có ít nhất 10 lessons
- ✅ Có quiz cho các lessons chính
- ✅ Có mô tả đầy đủ
- ✅ Có thumbnail và trailer

#### Bước 2: Request Approval
1. Vào khóa học → Click **"Request Approval"**
2. Hệ thống kiểm tra điều kiện
3. Nếu đủ điều kiện, gửi yêu cầu đến Admin
4. Trạng thái: **"Pending Approval"**

#### Bước 3: Chờ Admin review
- Admin sẽ xem xét
- Có thể approve hoặc reject
- Nếu reject, sẽ có lý do

#### Bước 4: Sau khi được duyệt
- Khóa học chuyển sang **"Published"**
- Hiển thị công khai
- Học viên có thể đăng ký

---

## 💬 Tương tác với học viên

### Tab "Discussions"
**Đường dẫn**: `/lms/instructor/discussions`

### Quản lý thảo luận
- Xem tất cả câu hỏi từ học viên
- Lọc theo khóa học
- Pin câu hỏi quan trọng
- Trả lời câu hỏi

### Trả lời nhanh
1. Click vào discussion
2. Nhập câu trả lời
3. Click **"Reply"**
4. Có thể attach files, links

### Moderate (Kiểm duyệt)
- **Pin**: Ghim lên đầu
- **Close**: Đóng chủ đề
- **Delete**: Xóa nếu vi phạm
- **Report**: Báo cáo với Admin

---

## 🎓 Cấp chứng chỉ

### Tự động cấp
Hệ thống tự động cấp chứng chỉ khi học viên:
- ✅ Hoàn thành 100% lessons
- ✅ Pass tất cả quiz required
- ✅ Đạt passing score tổng thể

### Cấp thủ công
**Khi nào**: Trường hợp đặc biệt

1. Vào **Students** → Chọn học viên
2. Click **"Issue Certificate"**
3. Xác nhận
4. Học viên nhận chứng chỉ ngay

### Xem danh sách chứng chỉ đã cấp
**Đường dẫn**: `/lms/instructor/certificates`

- Danh sách tất cả certificates
- Lọc theo khóa học
- Xem chi tiết:
  - Học viên
  - Ngày cấp
  - Mã chứng chỉ
  - Link xác thực

---

## ⚙️ Cài đặt Giảng viên

### Profile Settings
**Đường dẫn**: `/lms/instructor/settings`

#### Thông tin cá nhân
- Tên hiển thị
- Bio (giới thiệu ngắn)
- Avatar
- Chuyên môn
- Social links

#### Notification Settings
- Email khi có học viên mới
- Email khi có câu hỏi mới
- Weekly report
- Monthly report

#### Payment Settings (Nếu có)
- Thông tin ngân hàng
- Tax information
- Payout schedule

---

## 📈 Mẹo tăng hiệu quả giảng dạy

### 1. Nội dung chất lượng
- Video rõ ràng, âm thanh tốt
- Slides đẹp, dễ hiểu
- Ví dụ thực tế

### 2. Tương tác với học viên
- Trả lời câu hỏi nhanh (< 24h)
- Tạo discussions để kết nối
- Tổ chức live Q&A

### 3. Cập nhật thường xuyên
- Thêm lessons mới
- Cập nhật nội dung cũ
- Fix lỗi theo feedback

### 4. Marketing khóa học
- Viết mô tả hấp dẫn
- Tạo trailer thu hút
- Giá cạnh tranh
- Chạy promotion

### 5. Phân tích dữ liệu
- Xem báo cáo thường xuyên
- Lessons nào khó, học viên bỏ dở
- Cải thiện dựa trên data

---

## ❓ Câu hỏi thường gặp

**Q: Tôi có thể tạo bao nhiêu khóa học?**
A: Không giới hạn số lượng khóa học.

**Q: Ai có thể xem khóa học của tôi?**
A: Sau khi publish và được Admin approve, mọi người đều có thể xem.

**Q: Tôi có thể xóa khóa học đã có học viên không?**
A: Nên Archive thay vì xóa. Xóa sẽ ảnh hưởng học viên đang học.

**Q: Làm sao để khóa học của tôi được nhiều người đăng ký?**
A: Nội dung chất lượng + Marketing tốt + Giá hợp lý + Reviews tốt.

**Q: Tôi nhận tiền từ khóa học khi nào?**
A: Tùy chính sách platform. Thường là payout hàng tháng.

---

**🔗 Liên kết hữu ích**:
- [Trang chủ LMS](../LMS-MANUAL-INDEX.md)
- [Hướng dẫn AI Course](./LMS-MANUAL-AI-COURSE.md)
- [Hướng dẫn Admin](./LMS-MANUAL-ADMIN.md)

**Cập nhật**: 28/11/2025
