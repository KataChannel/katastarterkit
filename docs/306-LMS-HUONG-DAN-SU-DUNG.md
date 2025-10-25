# 📚 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG LMS rausachcore

## 📅 Ngày cập nhật: 21 tháng 10, 2025
## 🎯 Phiên bản: MVP 2 - Hoàn thành 100%

---

## 🌟 TỔNG QUAN HỆ THỐNG

**rausachcore LMS** là một hệ thống quản lý học tập (Learning Management System) đầy đủ tính năng, cho phép:
- 👨‍🏫 **Giảng viên**: Tạo và quản lý khóa học
- 👨‍🎓 **Học viên**: Học tập và theo dõi tiến độ
- 🏢 **Quản trị viên**: Quản lý toàn bộ hệ thống

---

## 📊 CÁC TÍNH NĂNG CHÍNH

### ✅ Đã hoàn thành (100%)

1. **🎥 Hệ thống Video Player**
   - Trình phát video chuyên nghiệp
   - Lưu tiến độ xem tự động
   - Chuyển bài học tự động
   - Điều khiển tốc độ phát
   - Hỗ trợ phím tắt

2. **📝 Hệ thống Quiz (Kiểm tra)**
   - Tạo đề kiểm tra trắc nghiệm
   - Chấm điểm tự động
   - Giới hạn thời gian
   - Xem kết quả chi tiết
   - Theo dõi lịch sử làm bài

3. **⭐ Hệ thống Đánh giá & Nhận xét**
   - Đánh giá 5 sao
   - Viết nhận xét
   - Bình chọn "Hữu ích"
   - Thống kê phân bổ đánh giá
   - Sắp xếp và lọc nhận xét

4. **🎓 Trình tạo Khóa học (Course Wizard)**
   - Hướng dẫn từng bước
   - Quản lý Module (Chương)
   - Tạo Bài học (Lesson)
   - Kiểm tra xác thực
   - Xuất bản khóa học

5. **📤 Hệ thống Upload File**
   - Upload ảnh thumbnail
   - Upload video bài học
   - Upload tài liệu
   - Thanh tiến trình upload
   - Xem trước file

6. **✏️ Trình soạn thảo Rich Text**
   - Định dạng văn bản
   - Thêm tiêu đề, danh sách
   - Chèn link, hình ảnh
   - Trích dẫn, code
   - Undo/Redo

---

## 👥 HƯỚNG DẪN CHO TỪNG VAI TRÒ

---

## 👨‍🎓 A. HƯỚNG DẪN CHO HỌC VIÊN

### 1. Đăng ký & Đăng nhập

#### Đăng ký tài khoản mới:
```
1. Truy cập: http://localhost:13000/register
2. Điền thông tin:
   - Email
   - Mật khẩu
   - Họ tên
3. Nhấn "Đăng ký"
4. Kiểm tra email xác nhận (nếu có)
```

#### Đăng nhập:
```
1. Truy cập: http://localhost:13000/login
2. Nhập email và mật khẩu
3. Nhấn "Đăng nhập"
```

### 2. Tìm kiếm & Xem Khóa học

#### Duyệt khóa học:
```
1. Vào trang chủ: http://localhost:13000/courses
2. Xem danh sách khóa học:
   - Hình ảnh thumbnail
   - Tên khóa học
   - Giảng viên
   - Giá tiền
   - Đánh giá trung bình (⭐)
   - Số học viên
```

#### Lọc khóa học:
```
- Theo danh mục: Web Development, Mobile, Design, etc.
- Theo cấp độ: Beginner, Intermediate, Advanced
- Theo giá: Miễn phí, Có phí
- Theo đánh giá: 5⭐, 4⭐+, 3⭐+
```

#### Tìm kiếm:
```
- Gõ từ khóa vào ô tìm kiếm
- Kết quả hiển thị theo độ liên quan
- Tìm theo: Tên khóa học, Giảng viên, Nội dung
```

### 3. Xem Chi tiết Khóa học

#### Thông tin hiển thị:
```
✅ Tổng quan:
   - Mô tả khóa học
   - Những gì bạn sẽ học
   - Yêu cầu trước khi học
   - Cấp độ khóa học
   - Thời lượng tổng

✅ Nội dung:
   - Danh sách Module (Chương)
   - Danh sách Lesson (Bài học)
   - Loại bài học: Video/Text/Quiz
   - Thời lượng từng bài

✅ Giảng viên:
   - Ảnh đại diện
   - Tên và tiểu sử
   - Số khóa học đã tạo
   - Đánh giá trung bình

✅ Đánh giá:
   - Điểm trung bình
   - Phân bổ đánh giá
   - Nhận xét của học viên
```

### 4. Ghi danh Khóa học

#### Khóa học miễn phí:
```
1. Vào trang chi tiết khóa học
2. Nhấn nút "Enroll Now" (Ghi danh ngay)
3. Xác nhận ghi danh
4. Tự động chuyển đến trang học
```

#### Khóa học có phí:
```
1. Nhấn "Buy Now" (Mua ngay)
2. Chọn phương thức thanh toán:
   - Thẻ tín dụng
   - PayPal
   - Chuyển khoản
3. Hoàn tất thanh toán
4. Tự động ghi danh
```

### 5. Học Bài

#### Xem video:
```
1. Click vào bài học video
2. Trình phát video tự động mở:
   - Phát/Tạm dừng: Spacebar hoặc nút Play
   - Tua: Mũi tên trái/phải (10s)
   - Âm lượng: Mũi tên lên/xuống
   - Toàn màn hình: F hoặc nút fullscreen
   - Tốc độ: 0.5x, 1x, 1.25x, 1.5x, 2x

3. Tiến độ tự động lưu:
   - Cứ 5 giây lưu 1 lần
   - Bài học đánh dấu hoàn thành khi xem 90%
   
4. Chuyển bài tự động:
   - Khi xem xong, tự động chuyển bài tiếp theo
   - Hoặc click "Next Lesson"
```

#### Đọc bài Text:
```
1. Click vào bài học text
2. Nội dung hiển thị với định dạng đẹp:
   - Tiêu đề
   - Đoạn văn
   - Danh sách
   - Link và hình ảnh
   - Trích dẫn

3. Đánh dấu hoàn thành:
   - Kéo xuống cuối bài
   - Click "Mark as Complete"
```

#### Làm Quiz:
```
1. Click vào bài Quiz
2. Màn hình hiển thị:
   - Tiêu đề quiz
   - Số câu hỏi
   - Thời gian (nếu có)
   - Điểm yêu cầu đạt

3. Bắt đầu làm bài:
   - Click "Start Quiz"
   - Đồng hồ đếm ngược bắt đầu
   - Trả lời từng câu hỏi
   - Có thể bỏ qua và quay lại

4. Nộp bài:
   - Click "Submit Quiz"
   - Xem kết quả ngay lập tức:
     * Điểm số
     * Số câu đúng/sai
     * Xem giải thích từng câu
     * So sánh với điểm yêu cầu

5. Làm lại (nếu được phép):
   - Click "Retake Quiz"
   - Số lần làm có thể giới hạn
```

### 6. Theo dõi Tiến độ

#### Dashboard học viên:
```
Truy cập: /student/dashboard

Hiển thị:
✅ Khóa học đang học:
   - Tiến độ hoàn thành (%)
   - Bài học hiện tại
   - Thời gian đã học
   - Bài quiz đã làm

✅ Thống kê:
   - Tổng số khóa học
   - Khóa học hoàn thành
   - Giờ học tích lũy
   - Quiz đã làm

✅ Hoạt động gần đây:
   - Bài học vừa xem
   - Quiz vừa làm
   - Điểm số đạt được
```

### 7. Đánh giá Khóa học

#### Viết đánh giá:
```
1. Sau khi ghi danh khóa học
2. Vào trang chi tiết khóa học
3. Cuộn xuống phần "Reviews"
4. Click "Write a Review"

5. Điền thông tin:
   ⭐ Chọn số sao (1-5):
      - 1 sao: Rất tệ
      - 2 sao: Tệ
      - 3 sao: Trung bình
      - 4 sao: Tốt
      - 5 sao: Xuất sắc
   
   📝 Viết nhận xét:
      - Chia sẻ trải nghiệm
      - Điểm mạnh/yếu của khóa học
      - Đề xuất cải thiện
      - Tối đa 1000 ký tự

6. Click "Submit Review"
7. Đánh giá hiển thị ngay lập tức
```

#### Chỉnh sửa đánh giá:
```
1. Tìm đánh giá của bạn
2. Click nút "Edit" (biểu tượng bút chì)
3. Sửa số sao hoặc nhận xét
4. Click "Update Review"
```

#### Xóa đánh giá:
```
1. Tìm đánh giá của bạn
2. Click nút "Delete" (biểu tượng thùng rác)
3. Xác nhận xóa
```

#### Bình chọn "Hữu ích":
```
1. Xem đánh giá của học viên khác
2. Click nút "Helpful" (👍)
3. Số lượng "helpful" tăng lên
4. Click lại để bỏ vote
```

#### Lọc & Sắp xếp đánh giá:
```
Sắp xếp theo:
- Recent (Mới nhất)
- Helpful (Hữu ích nhất)
- Rating (Đánh giá cao nhất)

Lọc theo số sao:
- Click vào thanh phân bổ (5⭐, 4⭐, 3⭐, 2⭐, 1⭐)
- Chỉ hiển thị đánh giá có số sao đó
- Click lại để bỏ lọc
```

---

## 👨‍🏫 B. HƯỚNG DẪN CHO GIẢNG VIÊN

### 1. Trở thành Giảng viên

#### Đăng ký vai trò Instructor:
```
1. Đăng nhập với tài khoản user
2. Liên hệ Admin để được cấp quyền Instructor
3. Hoặc tự đăng ký (nếu hệ thống cho phép):
   - Vào /become-instructor
   - Điền thông tin:
     * Tiểu sử
     * Chuyên môn
     * Kinh nghiệm giảng dạy
     * Liên kết mạng xã hội
   - Đợi Admin phê duyệt
```

### 2. Tạo Khóa học Mới

#### Bước 1: Thông tin Cơ bản

```
Truy cập: /instructor/courses/new

📋 Điền thông tin:
   
   ✏️ Tên khóa học *:
      - Ngắn gọn, súc tích
      - Ví dụ: "Complete React Developer Course"
   
   📝 Mô tả *:
      - Giới thiệu khóa học
      - Nội dung sẽ học được
      - Đối tượng phù hợp
      - Tối thiểu 100 ký tự
   
   📁 Danh mục *:
      - Chọn từ dropdown
      - Web Development, Mobile, Design, etc.
   
   📊 Cấp độ:
      - BEGINNER (Cơ bản)
      - INTERMEDIATE (Trung cấp)
      - ADVANCED (Nâng cao)
      - ALL_LEVELS (Mọi cấp độ)
   
   💰 Giá tiền:
      - Nhập số tiền (USD)
      - 0 = Miễn phí
      - Ví dụ: 49.99
   
   🖼️ Upload Thumbnail *:
      - Kéo thả ảnh vào khung
      - Hoặc click để chọn file
      - Định dạng: JPG, PNG, GIF, WebP
      - Kích thước đề xuất: 1280x720px
      - Dung lượng tối đa: 5MB
      - Xem trước ngay sau khi upload
   
   🎯 Những gì học viên sẽ học *:
      - Thêm ít nhất 3 mục
      - Ví dụ:
        * "Xây dựng ứng dụng React từ đầu"
        * "Hiểu về React Hooks"
        * "Làm việc với Redux"
      - Click "+" để thêm mục mới
      - Click "×" để xóa mục
   
   📚 Yêu cầu:
      - Kiến thức cần có trước khi học
      - Ví dụ:
        * "Biết HTML/CSS cơ bản"
        * "Hiểu JavaScript ES6"
      - Thêm/xóa tương tự mục trên

✅ Nhấn "Next: Add Modules" để tiếp tục
```

#### Bước 2: Tạo Module (Chương)

```
📚 Module là gì?
   - Cách tổ chức nội dung khóa học
   - Mỗi module chứa nhiều bài học
   - Ví dụ:
     * Module 1: Giới thiệu
     * Module 2: Cơ bản
     * Module 3: Nâng cao

➕ Thêm Module mới:

   1. Click "Add Module"
   
   2. Điền thông tin:
      - Tiêu đề *: "Module 1: Introduction to React"
      - Mô tả: "Learn the basics of React"
   
   3. Click "Add Module" (trong form)
   
   4. Module hiển thị trong danh sách

✏️ Chỉnh sửa Module:
   - Click biểu tượng bút chì
   - Sửa tiêu đề/mô tả
   - Click "Save"

🗑️ Xóa Module:
   - Click biểu tượng thùng rác
   - Xác nhận xóa
   - ⚠️ Chỉ xóa được module chưa có bài học

📊 Sắp xếp lại Module:
   - Số thứ tự hiển thị bên cạnh
   - Sử dụng để sắp xếp thứ tự học

⚠️ Yêu cầu: Phải có ít nhất 1 module

✅ Nhấn "Next: Add Lessons" để tiếp tục
```

#### Bước 3: Tạo Bài học (Lesson)

```
📖 Lesson là gì?
   - Nội dung chi tiết của khóa học
   - 3 loại: Video, Text, Quiz
   - Mỗi lesson thuộc 1 module

➕ Thêm Lesson mới:

   1. Chọn Module (tab ở trên)
   
   2. Click "Add Lesson to this Module"
   
   3. Modal form hiển thị
   
   4. Điền thông tin chung:
      - Tiêu đề *: "Introduction to Components"
      - Mô tả: Tùy chọn
   
   5. Chọn loại Lesson:

   🎥 VIDEO LESSON:
      
      Upload video:
      - Kéo thả file video
      - Hoặc click để chọn
      - Định dạng: MP4, WebM, OGG, MOV
      - Dung lượng tối đa: 500MB
      - Thanh tiến trình hiển thị
      - Xem trước sau khi upload
      
      Thời lượng (phút):
      - Nhập số phút
      - Ví dụ: 15
      - Giúp tính tổng thời lượng khóa học
   
   📝 TEXT LESSON:
      
      Rich Text Editor hiển thị với toolbar:
      
      Công cụ định dạng:
      - [B] Bold (Đậm)
      - [I] Italic (Nghiêng)
      - [</>] Inline Code
      - [H1] [H2] [H3] Tiêu đề
      - [•] Danh sách gạch đầu dòng
      - [1.] Danh sách đánh số
      - ["] Trích dẫn (Quote)
      - [🔗] Thêm link
      - [🖼️] Chèn hình ảnh (URL)
      - [↶] [↷] Undo/Redo
      
      Cách sử dụng:
      1. Gõ nội dung vào editor
      2. Chọn text muốn định dạng
      3. Click nút tương ứng trên toolbar
      4. Hoặc dùng phím tắt:
         - Ctrl+B: Bold
         - Ctrl+I: Italic
         - Ctrl+Z: Undo
         - Ctrl+Shift+Z: Redo
      
      Thêm link:
      1. Chọn text
      2. Click nút Link
      3. Nhập URL trong popup
      4. Click OK
      
      Thêm hình ảnh:
      1. Click nút Image
      2. Nhập URL hình ảnh
      3. Click OK
      4. Hình hiển thị trong editor
   
   ❓ QUIZ LESSON:
      
      Nhập Quiz ID:
      - ID của quiz đã tạo trước
      - Ví dụ: "quiz_123"
      - Quiz phải tồn tại trong hệ thống
   
   6. Click "Add Lesson"
   
   7. Lesson xuất hiện trong danh sách module

✏️ Chỉnh sửa Lesson:
   - Click biểu tượng bút chì
   - Form mở với dữ liệu hiện tại
   - Sửa đổi và click "Update"

🗑️ Xóa Lesson:
   - Click biểu tượng thùng rác
   - Xác nhận xóa

📊 Thông tin hiển thị:
   - Icon theo loại (▶️ Video, 📄 Text, ❓ Quiz)
   - Tiêu đề
   - Thời lượng (nếu có)
   - Số thứ tự

⚠️ Yêu cầu: 
   - Mỗi module phải có ít nhất 1 lesson
   - Tổng khóa học phải có ít nhất 1 lesson

✅ Nhấn "Next: Publish Course" để tiếp tục
```

#### Bước 4: Xuất bản Khóa học

```
📋 Kiểm tra Validation:

   Checklist tự động:
   ✅ Có tiêu đề và mô tả
   ✅ Đã chọn danh mục
   ✅ Có ít nhất 1 module
   ✅ Có ít nhất 1 lesson
   ✅ Có mục tiêu học tập (whatYouWillLearn)
   ⭕ Đã upload thumbnail (tùy chọn)

📊 Tóm tắt Khóa học:

   Hiển thị:
   - Tổng số module
   - Tổng số lesson
   - Tổng thời lượng
   - Cấp độ
   - Giá tiền
   - Danh mục

🌳 Cây nội dung:

   Hiển thị toàn bộ cấu trúc:
   📚 Module 1: Introduction
      ├─ 🎥 Lesson 1: Welcome (5 phút)
      ├─ 📝 Lesson 2: Course Overview
      └─ ❓ Quiz 1: Introduction Test
   
   📚 Module 2: React Basics
      ├─ 🎥 Lesson 1: Components (15 phút)
      └─ 🎥 Lesson 2: Props & State (20 phút)

🔍 Hành động:

   1. "Preview Course":
      - Mở khóa học trong tab mới
      - Xem giao diện như học viên
      - Kiểm tra nội dung
   
   2. "Back" (Quay lại):
      - Sửa đổi bài học
      - Thêm nội dung
   
   3. "Publish Course":
      - Xuất bản khóa học
      - Trạng thái: DRAFT → PUBLISHED
      - Khóa học hiển thị công khai
      - Học viên có thể ghi danh

⚠️ Lưu ý:
   - Nếu validation chưa đạt, nút Publish bị vô hiệu hóa
   - Phải hoàn thành tất cả mục bắt buộc
   - Có thể lưu draft và quay lại sau

✅ Sau khi Publish:
   - Chuyển đến trang instructor dashboard
   - Khóa học hiển thị trong danh sách
   - Có thể chỉnh sửa bất kỳ lúc nào
```

### 3. Quản lý Khóa học

#### Dashboard giảng viên:
```
Truy cập: /instructor/dashboard

Hiển thị:
📊 Thống kê tổng quan:
   - Tổng số khóa học
   - Tổng số học viên
   - Tổng doanh thu
   - Đánh giá trung bình

📚 Danh sách khóa học:
   - Tên khóa học
   - Số học viên
   - Doanh thu
   - Đánh giá
   - Trạng thái (Published/Draft)
   - Hành động: Edit, Delete, View

📈 Biểu đồ:
   - Học viên theo thời gian
   - Doanh thu theo tháng
   - Khóa học phổ biến nhất
```

#### Chỉnh sửa khóa học:
```
1. Vào dashboard
2. Click "Edit" ở khóa học cần sửa
3. Wizard mở với dữ liệu hiện tại
4. Sửa đổi bất kỳ bước nào:
   - Thông tin cơ bản
   - Module
   - Lesson
5. Click "Save Changes"
6. Thay đổi áp dụng ngay lập tức
```

#### Xóa khóa học:
```
⚠️ Cẩn thận: Không thể hoàn tác!

1. Click "Delete"
2. Popup xác nhận
3. Nhập tên khóa học để xác nhận
4. Click "Confirm Delete"
5. Khóa học bị xóa vĩnh viễn
   - Bao gồm: Module, Lesson, Enrollment, Review
```

### 4. Tạo Quiz

```
Truy cập: /instructor/quizzes/new

📝 Thông tin Quiz:
   
   Tiêu đề *:
      - "Introduction to React Quiz"
   
   Mô tả:
      - "Test your knowledge about React basics"
   
   Thời gian giới hạn (phút):
      - 30 (tùy chọn)
      - Để trống = không giới hạn
   
   Điểm yêu cầu để đạt (%):
      - 70 (mặc định)
      - Học viên phải đạt ít nhất 70% để pass
   
   Số lần làm tối đa:
      - 3 (tùy chọn)
      - Để trống = không giới hạn

➕ Thêm câu hỏi:

   1. Click "Add Question"
   
   2. Điền thông tin câu hỏi:
      
      Câu hỏi *:
      - "What is a React component?"
      
      Giải thích:
      - "Components are the building blocks of React"
      - Hiển thị sau khi nộp bài
      
      Điểm:
      - 10 (mặc định)
      - Có thể tùy chỉnh theo độ khó
   
   3. Thêm đáp án (tối thiểu 2):
      
      Click "Add Answer"
      
      Mỗi đáp án:
      - Nội dung đáp án
      - ☑️ Checkbox "Đúng/Sai"
      - Có thể có nhiều đáp án đúng
      
      Ví dụ:
      ✅ "A reusable piece of UI" (Đúng)
      ❌ "A CSS framework" (Sai)
      ❌ "A database" (Sai)
      ✅ "A JavaScript function or class" (Đúng)
   
   4. Click "Save Question"
   
   5. Câu hỏi thêm vào danh sách

✏️ Chỉnh sửa câu hỏi:
   - Click Edit trên câu hỏi
   - Sửa đổi và Save

🗑️ Xóa câu hỏi:
   - Click Delete
   - Xác nhận

📊 Thông tin hiển thị:
   - Số thứ tự câu hỏi
   - Nội dung câu hỏi
   - Số đáp án
   - Điểm

💾 Lưu Quiz:
   - Click "Create Quiz"
   - Quiz có thể sử dụng trong lesson

🔗 Gắn Quiz vào Lesson:
   - Copy Quiz ID
   - Trong LessonsStep, chọn type QUIZ
   - Paste Quiz ID
```

### 5. Xem & Trả lời Đánh giá

#### Xem đánh giá của khóa học:
```
1. Vào trang chi tiết khóa học
2. Cuộn xuống phần Reviews
3. Xem tất cả đánh giá:
   - Điểm trung bình
   - Phân bổ sao
   - Nhận xét từng học viên
   - Số lượng helpful
```

#### Trả lời đánh giá (tính năng tương lai):
```
- Click "Reply" dưới đánh giá
- Viết phản hồi
- Cảm ơn học viên
- Giải đáp thắc mắc
- Click "Send Reply"
```

---

## 🛠️ C. HƯỚNG DẪN CHO ADMIN

### 1. Quản lý Người dùng

#### Xem danh sách user:
```
Truy cập: /admin/users

Hiển thị:
- ID
- Email
- Tên
- Vai trò (ADMIN/INSTRUCTOR/USER)
- Trạng thái (Active/Banned)
- Ngày đăng ký

Hành động:
- View: Xem chi tiết
- Edit: Sửa thông tin
- Ban: Cấm tài khoản
- Delete: Xóa vĩnh viễn
```

#### Cấp quyền Instructor:
```
1. Tìm user cần cấp quyền
2. Click Edit
3. Chọn Role: INSTRUCTOR
4. Save
5. User có thể tạo khóa học
```

### 2. Quản lý Khóa học

#### Duyệt khóa học mới:
```
Truy cập: /admin/courses?status=pending

1. Xem danh sách khóa học chờ duyệt
2. Click vào khóa học để xem chi tiết
3. Kiểm tra:
   - Nội dung phù hợp
   - Chất lượng video/text
   - Thông tin đầy đủ
4. Hành động:
   - Approve: Phê duyệt xuất bản
   - Reject: Từ chối (ghi rõ lý do)
   - Request Changes: Yêu cầu chỉnh sửa
```

#### Quản lý tất cả khóa học:
```
Truy cập: /admin/courses

Lọc theo:
- Trạng thái: Published/Draft/Pending
- Danh mục
- Giảng viên
- Ngày tạo

Hành động hàng loạt:
- Approve nhiều khóa học
- Delete nhiều khóa học
- Export dữ liệu
```

### 3. Quản lý Danh mục

#### Thêm danh mục mới:
```
Truy cập: /admin/categories

1. Click "Add Category"
2. Điền thông tin:
   - Tên danh mục
   - Slug (tự động từ tên)
   - Mô tả
   - Icon (tùy chọn)
3. Click "Create"
```

#### Sửa/Xóa danh mục:
```
- Edit: Sửa tên, mô tả
- Delete: Xóa danh mục
  ⚠️ Chỉ xóa được nếu không có khóa học nào
```

### 4. Quản lý Đánh giá

#### Kiểm duyệt đánh giá:
```
Truy cập: /admin/reviews

Xem:
- Tất cả đánh giá
- Đánh giá bị báo cáo
- Đánh giá spam

Hành động:
- Approve: Chấp nhận
- Hide: Ẩn đánh giá
- Delete: Xóa vĩnh viễn
- Ban User: Cấm user spam
```

### 5. Thống kê Hệ thống

```
Truy cập: /admin/dashboard

Dashboard admin hiển thị:

📊 Tổng quan:
   - Tổng số user
   - Tổng số khóa học
   - Tổng số ghi danh
   - Doanh thu tổng

📈 Biểu đồ:
   - User mới theo thời gian
   - Khóa học mới theo tháng
   - Doanh thu theo tháng
   - Ghi danh theo tuần

🏆 Top:
   - Khóa học phổ biến nhất
   - Giảng viên hàng đầu
   - Danh mục hot nhất
   - Đánh giá cao nhất

⚠️ Cảnh báo:
   - Khóa học chờ duyệt
   - Đánh giá bị báo cáo
   - Giao dịch thất bại
   - Lỗi hệ thống
```

---

## 🔧 D. CÁC TÍNH NĂNG KỸ THUẬT

### 1. Video Player

```
Tính năng:
✅ Phát video mượt mà
✅ Điều khiển đầy đủ:
   - Play/Pause
   - Seek (tua)
   - Volume (âm lượng)
   - Speed (tốc độ: 0.5x - 2x)
   - Fullscreen
   - Picture-in-Picture

✅ Phím tắt:
   - Space: Play/Pause
   - ←/→: Tua -/+ 10s
   - ↑/↓: Tăng/giảm âm lượng
   - F: Fullscreen
   - M: Mute

✅ Lưu tiến độ:
   - Tự động lưu mỗi 5s
   - Resume từ vị trí cũ
   - Đánh dấu hoàn thành khi xem 90%

✅ Chuyển bài tự động:
   - Khi xem xong tự động next
   - Có thể tắt trong settings
```

### 2. Quiz System

```
Tính năng:
✅ Tạo quiz trắc nghiệm
✅ Nhiều đáp án đúng
✅ Giới hạn thời gian
✅ Chấm điểm tự động
✅ Giải thích từng câu
✅ Lưu lịch sử làm bài
✅ Cho phép làm lại
✅ Thống kê kết quả

Cơ chế chấm điểm:
- Mỗi câu có điểm riêng
- Tổng điểm = Σ (điểm câu đúng)
- % = (điểm đạt / tổng điểm) × 100
- Pass nếu % ≥ điểm yêu cầu
```

### 3. Review System

```
Tính năng:
✅ Đánh giá 5 sao
✅ Viết nhận xét (max 1000 ký tự)
✅ Edit/Delete đánh giá của mình
✅ Vote "Helpful"
✅ Tính điểm trung bình tự động
✅ Phân bổ đánh giá
✅ Sắp xếp: Recent/Helpful/Rating
✅ Lọc theo số sao

Cơ chế tính điểm:
- avgRating = Σ(rating) / totalReviews
- Cập nhật real-time khi có đánh giá mới
- Hiển thị trên card khóa học
```

### 4. File Upload

```
Tính năng:
✅ Drag & Drop
✅ Click to browse
✅ Upload progress (0-100%)
✅ Preview sau upload
✅ Validation:
   - File type
   - File size
   - Ownership

Loại file hỗ trợ:
📷 Image:
   - JPEG, PNG, GIF, WebP
   - Max: 5MB

🎥 Video:
   - MP4, WebM, OGG, MOV
   - Max: 500MB

📄 Document:
   - PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
   - Max: 10MB

Storage:
- MinIO (S3-compatible)
- Bucket: uploads
- Public read access
- URL format: http://localhost:9000/uploads/{filename}
```

### 5. Rich Text Editor

```
Tính năng:
✅ WYSIWYG editor (TipTap)
✅ Toolbar đầy đủ
✅ Định dạng text
✅ Headings (H1-H3)
✅ Lists (bullet, numbered)
✅ Blockquote
✅ Links
✅ Images (URL)
✅ Undo/Redo
✅ Keyboard shortcuts

Output:
- HTML sạch
- Styling với TailwindCSS
- Responsive
- SEO-friendly
```

---

## 📱 E. RESPONSIVE & MOBILE

```
Hỗ trợ thiết bị:
✅ Desktop (1920×1080+)
✅ Laptop (1366×768+)
✅ Tablet (768×1024)
✅ Mobile (375×667+)

Tối ưu mobile:
- Navigation collapsible
- Touch-friendly buttons
- Swipe gestures
- Adaptive layouts
- Image optimization
- Lazy loading
```

---

## 🔒 F. BẢO MẬT & QUYỀN HẠN

### Phân quyền:

```
👤 USER (Học viên):
   ✅ Xem khóa học
   ✅ Ghi danh
   ✅ Học bài
   ✅ Làm quiz
   ✅ Viết đánh giá
   ❌ Tạo khóa học
   ❌ Quản lý user

👨‍🏫 INSTRUCTOR (Giảng viên):
   ✅ Tất cả quyền USER
   ✅ Tạo khóa học
   ✅ Quản lý khóa học của mình
   ✅ Tạo quiz
   ✅ Xem thống kê
   ❌ Sửa khóa học người khác
   ❌ Quản lý user

🔧 ADMIN (Quản trị):
   ✅ Tất cả quyền
   ✅ Quản lý user
   ✅ Quản lý tất cả khóa học
   ✅ Quản lý danh mục
   ✅ Duyệt nội dung
   ✅ Xem thống kê toàn bộ
```

### Bảo mật:

```
✅ JWT Authentication
✅ Password hashing (bcrypt)
✅ HTTPS (production)
✅ Input validation
✅ SQL injection prevention
✅ XSS protection
✅ CSRF protection
✅ Rate limiting
✅ File upload validation
```

---

## ⚡ G. HIỆU SUẤT

```
Tối ưu:
✅ Database indexing
✅ Redis caching
✅ GraphQL DataLoader
✅ Image lazy loading
✅ Code splitting
✅ Compression
✅ CDN (MinIO)

Metric:
- Page load: < 2s
- Video start: < 1s
- Quiz submit: < 500ms
- Search: < 300ms
```

---

## 🐛 H. TROUBLESHOOTING

### Vấn đề thường gặp:

#### 1. Không đăng nhập được:
```
✓ Kiểm tra email/password
✓ Xóa cache trình duyệt
✓ Thử trình duyệt khác
✓ Kiểm tra backend đang chạy
```

#### 2. Upload file thất bại:
```
✓ Kiểm tra dung lượng file
✓ Kiểm tra định dạng file
✓ Kiểm tra kết nối mạng
✓ Thử file khác
✓ Kiểm tra MinIO đang chạy
```

#### 3. Video không phát:
```
✓ Kiểm tra định dạng video (MP4 recommended)
✓ Thử trình duyệt khác
✓ Kiểm tra kết nối mạng
✓ Xóa cache
```

#### 4. Quiz không submit:
```
✓ Kiểm tra đã trả lời đủ câu
✓ Kiểm tra kết nối mạng
✓ Refresh trang và thử lại
```

#### 5. Đánh giá không hiển thị:
```
✓ Kiểm tra đã ghi danh khóa học
✓ Refresh trang
✓ Kiểm tra backend logs
```

---

## 📞 I. HỖ TRỢ

### Liên hệ:
```
📧 Email: support@rausachcore.com
💬 Chat: http://localhost:13000/support
📱 Hotline: 1900-xxxx
🌐 Website: https://rausachcore.com
```

### Tài liệu:
```
📚 Tài liệu API: /docs/api
🎓 Video hướng dẫn: /docs/videos
❓ FAQ: /docs/faq
🐛 Report bug: /docs/bug-report
```

---

## 🚀 J. ROADMAP TƯƠNG LAI

### Phase 3 (Coming soon):

```
📊 Student Dashboard:
   - Tiến độ chi tiết
   - Lịch sử học tập
   - Chứng chỉ

📈 Instructor Analytics:
   - Doanh thu chi tiết
   - Biểu đồ engagement
   - Export reports

💬 Discussion Forum:
   - Q&A cho mỗi khóa học
   - Tương tác cộng đồng
   - Upvote/downvote

🎥 Live Classes:
   - Video conferencing
   - Screen sharing
   - Chat real-time

🏆 Gamification:
   - Badges
   - Leaderboard
   - Achievements

🎁 Marketing:
   - Coupons
   - Discounts
   - Affiliate program

📱 Mobile App:
   - iOS & Android
   - Offline learning
   - Push notifications
```

---

## 📋 K. CHECKLIST SỬ DỤNG

### Cho Học viên:
```
☐ Đăng ký tài khoản
☐ Hoàn thiện profile
☐ Duyệt khóa học
☐ Ghi danh khóa học đầu tiên
☐ Xem video lesson
☐ Đọc text lesson
☐ Làm quiz
☐ Viết đánh giá
☐ Hoàn thành khóa học
```

### Cho Giảng viên:
```
☐ Đăng ký vai trò Instructor
☐ Hoàn thiện profile giảng viên
☐ Tạo khóa học đầu tiên
☐ Upload thumbnail
☐ Tạo ít nhất 3 modules
☐ Thêm video lessons
☐ Thêm text lessons
☐ Tạo quiz
☐ Preview khóa học
☐ Publish khóa học
☐ Theo dõi đánh giá
☐ Cập nhật nội dung định kỳ
```

---

## 🎉 KẾT LUẬN

**rausachcore LMS** là một hệ thống học tập trực tuyến hoàn chỉnh với đầy đủ tính năng:

✅ **Cho Học viên**: Trải nghiệm học tập chuyên nghiệp
✅ **Cho Giảng viên**: Công cụ tạo khóa học mạnh mẽ  
✅ **Cho Admin**: Quản lý hệ thống hiệu quả

**Tính năng nổi bật:**
- 🎥 Video player chuyên nghiệp
- 📝 Quiz tự động chấm điểm
- ⭐ Đánh giá & nhận xét
- 🎓 Wizard tạo khóa học
- 📤 Upload file trực tiếp
- ✏️ Rich text editor

**Sẵn sàng sử dụng ngay!** 🚀

---

*Tài liệu được cập nhật: 21/10/2025*  
*Phiên bản: 2.5.0*  
*© 2025 rausachcore LMS - All rights reserved*
