# 📚 Hướng Dẫn Sử Dụng Hệ Thống LMS

## 🎯 Tổng Quan

Hệ thống LMS (Learning Management System) cho phép tạo, quản lý và học các khóa học trực tuyến với đầy đủ tính năng từ video bài học, quiz, chứng chỉ đến diễn đàn thảo luận.

---

## 👥 Vai Trò Người Dùng

### 1. **Học Viên (Student)**
- Đăng ký khóa học
- Học bài, làm quiz
- Nhận chứng chỉ
- Tham gia thảo luận

### 2. **Giảng Viên (Instructor)**
- Tạo và quản lý khóa học
- Tạo nội dung bài học
- Tạo quiz và đánh giá
- Quản lý thảo luận

### 3. **Quản trị viên (Admin)**
- Quản lý người dùng
- Quản lý danh mục
- Giám sát hệ thống

---

## 🚀 Hướng Dẫn Cho Giảng Viên

### Bước 1: Tạo Khóa Học Mới

1. **Truy cập Dashboard Giảng Viên**
   ```
   URL: /lms/instructor/dashboard
   ```

2. **Nhấn "Create Course"**
   - Nhập thông tin cơ bản:
     - **Tên khóa học**: Tên rõ ràng, hấp dẫn
     - **Mô tả**: Giới thiệu ngắn gọn
     - **Danh mục**: Chọn từ danh sách có sẵn
     - **Cấp độ**: Beginner/Intermediate/Advanced
     - **Giá**: Nhập 0 cho khóa miễn phí

3. **Upload Thumbnail**
   - Kích thước khuyến nghị: 1280x720px
   - Format: JPG, PNG
   - Dung lượng tối đa: 5MB

4. **Điền Thông Tin Chi Tiết**
   - **What you'll learn**: Danh sách các kỹ năng học được (mỗi dòng 1 mục)
   - **Requirements**: Yêu cầu đầu vào (tùy chọn)
   - **Target audience**: Đối tượng học viên

5. **Nhấn "Create Course"** → Khóa học được tạo với trạng thái DRAFT

### Bước 2: Tạo Chương Trình Học (Modules)

1. **Vào trang quản lý khóa học**
   ```
   Dashboard → My Courses → Chọn khóa học
   ```

2. **Thêm Module**
   - Nhấn "Add Module"
   - Nhập tên module (VD: "Module 1: Giới thiệu")
   - Nhập mô tả module
   - Chọn thứ tự hiển thị

3. **Lặp lại** cho các module khác

### Bước 3: Thêm Bài Học (Lessons)

1. **Chọn Module** → Nhấn "Add Lesson"

2. **Điền thông tin bài học:**
   - **Tên bài học**: Rõ ràng, cụ thể
   - **Loại bài học**:
     - `VIDEO`: Bài học video
     - `TEXT`: Bài học văn bản
     - `QUIZ`: Bài kiểm tra
   - **Thời lượng**: Phút (VD: 15)

3. **Nội dung bài học:**

   **Với VIDEO:**
   ```
   - Upload video lên Minio/CDN
   - Copy URL video
   - Paste vào field "Video URL"
   ```

   **Với TEXT:**
   ```
   - Viết nội dung trong Rich Text Editor
   - Hỗ trợ Markdown
   - Có thể embed hình ảnh, code
   ```

4. **Tài liệu đính kèm** (tùy chọn):
   - Upload PDF, DOCX, slides
   - Link tài liệu tham khảo

### Bước 4: Tạo Quiz

1. **Tạo Quiz Mới**
   ```
   Course → Quizzes → Add Quiz
   ```

2. **Cấu hình Quiz:**
   - **Tên quiz**: Tên bài kiểm tra
   - **Mô tả**: Hướng dẫn làm bài
   - **Thời gian**: Phút (0 = không giới hạn)
   - **Số lần làm tối đa**: Số lần được làm lại
   - **Điểm đạt**: % điểm tối thiểu để pass (VD: 70)
   - **Hiển thị kết quả**: Có/Không

3. **Thêm Câu Hỏi:**

   **Nhấn "Add Question":**
   ```
   - Câu hỏi: Nội dung câu hỏi
   - Loại: Multiple Choice / True-False / Short Answer
   - Điểm: Số điểm cho câu này
   ```

4. **Thêm Đáp Án:**
   - Nhập các lựa chọn
   - **Đánh dấu đáp án đúng** ✓
   - Có thể thêm giải thích cho từng đáp án

5. **Lưu Quiz**

### Bước 5: Xuất Bản Khóa Học

1. **Kiểm tra đầy đủ:**
   - ✅ Có ít nhất 1 module
   - ✅ Mỗi module có ít nhất 1 lesson
   - ✅ Thông tin khóa học đầy đủ
   - ✅ Đã upload thumbnail

2. **Thay đổi trạng thái:**
   ```
   Course Settings → Status → PUBLISHED
   ```

3. **Khóa học xuất hiện trên trang `/lms/courses`**

---

## 📖 Hướng Dẫn Cho Học Viên

### Bước 1: Đăng Ký Khóa Học

1. **Tìm khóa học**
   ```
   URL: /lms/courses
   ```

2. **Lọc khóa học:**
   - Theo danh mục
   - Theo cấp độ
   - Theo giá (Free/Paid)
   - Tìm kiếm theo tên

3. **Xem chi tiết khóa học**
   - Nhấn vào khóa học
   - Đọc thông tin, nội dung, đánh giá

4. **Đăng ký:**
   - Nhấn "Enroll Now"
   - **Khóa miễn phí**: Đăng ký ngay
   - **Khóa có phí**: Chuyển đến thanh toán

### Bước 2: Học Bài

1. **Vào "My Learning"**
   ```
   URL: /lms/my-learning
   ```

2. **Chọn khóa học** → Nhấn "Continue Learning"

3. **Giao diện học:**
   ```
   ┌────────────────────────────────────┐
   │        Video Player / Content       │
   ├────────────────────────────────────┤
   │  Lesson Title | Progress: 45%      │
   ├────────────────┬───────────────────┤
   │  Curriculum    │  Discussion       │
   │  - Module 1    │  Q&A về bài này   │
   │    ✓ Lesson 1  │                   │
   │    → Lesson 2  │                   │
   │    ○ Lesson 3  │                   │
   └────────────────┴───────────────────┘
   ```

4. **Đánh dấu hoàn thành:**
   - Xem video đến cuối
   - Hoặc nhấn "Mark as Complete"

5. **Tiếp tục bài tiếp theo** → Tự động chuyển bài

### Bước 3: Làm Quiz

1. **Khi đến bài Quiz:**
   - Đọc hướng dẫn
   - Xem thời gian làm bài
   - Nhấn "Start Quiz"

2. **Làm bài:**
   - Chọn đáp án cho từng câu
   - Có thể skip câu và quay lại sau
   - Timer đếm ngược (nếu có)

3. **Nộp bài:**
   - Nhấn "Submit Quiz"
   - Xem kết quả ngay (nếu được phép)
   - Điểm và phản hồi từng câu

4. **Làm lại:** (nếu được phép)
   - Nhấn "Retake Quiz"
   - Lưu ý số lần làm tối đa

### Bước 4: Nhận Chứng Chỉ

1. **Điều kiện nhận chứng chỉ:**
   - ✅ Hoàn thành 100% bài học
   - ✅ Đạt điểm quiz (nếu có)
   - ✅ Trạng thái khóa học: COMPLETED

2. **Tự động tạo chứng chỉ:**
   ```
   Khi đạt 100% → Hệ thống tự động tạo
   ```

3. **Xem chứng chỉ:**
   ```
   URL: /lms/my-certificates
   ```

4. **Chức năng chứng chỉ:**
   - **Download PDF**: Tải về máy
   - **Verify**: Xác thực chứng chỉ qua mã số
   - **Share**: Chia sẻ lên mạng xã hội

### Bước 5: Tham Gia Thảo Luận

1. **Vào tab "Discussions"** trong trang khóa học

2. **Tạo chủ đề mới:**
   - Nhấn "Start New Discussion"
   - Nhập tiêu đề
   - Viết nội dung câu hỏi/thảo luận
   - Nhấn "Post Discussion"

3. **Trả lời thảo luận:**
   - Chọn chủ đề
   - Nhấn "Reply"
   - Nhập câu trả lời
   - Nhấn "Post Reply"

4. **Trả lời trả lời:** (nested)
   - Nhấn "Reply" dưới comment cụ thể
   - Tạo chuỗi thảo luận phân cấp

5. **Chức năng khác:**
   - **Pin**: Giảng viên ghim thảo luận quan trọng
   - **Delete**: Xóa thảo luận của mình
   - **Edit**: Sửa nội dung

### Bước 6: Đánh Giá Khóa Học

1. **Sau khi hoàn thành khóa học:**
   ```
   Course Page → Reviews → Write Review
   ```

2. **Đánh giá:**
   - Chọn số sao (1-5)
   - Viết nhận xét chi tiết
   - Nhấn "Submit Review"

3. **Sửa đánh giá:**
   - Quay lại Review section
   - Nhấn "Edit" trên review của mình

---

## 🔍 Tính Năng Nâng Cao

### 1. Theo Dõi Tiến Độ

**Học viên:**
```
My Learning → Chọn khóa → Xem Progress Bar
- % hoàn thành tổng thể
- Số bài đã học / tổng số bài
- Thời gian học
- Quiz scores
```

**Giảng viên:**
```
Instructor Dashboard → Course Analytics
- Số học viên đăng ký
- Tỷ lệ hoàn thành
- Điểm trung bình quiz
- Top performers
```

### 2. Tìm Kiếm Khóa Học

```
/lms/courses → Search bar
```

**Tìm theo:**
- Tên khóa học
- Giảng viên
- Nội dung mô tả
- Tags

**Lọc theo:**
- Category
- Level
- Price
- Rating

### 3. Xác Thực Chứng Chỉ

**Công khai (không cần đăng nhập):**
```
URL: /lms/certificates/verify
Nhập mã chứng chỉ: LMS-1730280000000-abc123
→ Hiển thị thông tin chứng chỉ hợp lệ
```

### 4. Thống Kê Cá Nhân

**Học viên:**
```
My Certificates → Certificate Stats
- Tổng chứng chỉ
- Chứng chỉ tháng này
- Chứng chỉ năm nay
```

**Giảng viên:**
```
Instructor Dashboard → Overview
- Total courses
- Total students
- Total revenue
- Average rating
```

---

## ⚙️ GraphQL API

### Các Thao Tác Chính

#### 1. Lấy Danh Sách Khóa Học

```graphql
query GetCourses($filters: CourseFiltersInput) {
  courses(filters: $filters) {
    data {
      id
      title
      description
      thumbnail
      price
      avgRating
      enrollmentCount
      reviewCount
      instructor {
        id
        firstName
        lastName
        username
      }
    }
    total
    page
    limit
    totalPages
  }
}

# Ví dụ variables:
{
  "filters": {
    "status": "PUBLISHED",
    "page": 1,
    "limit": 10,
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }
}
```

#### 2. Đăng Ký Khóa Học

```graphql
mutation EnrollCourse($enrollCourseInput: EnrollCourseInput!) {
  enrollCourse(enrollCourseInput: $enrollCourseInput) {
    id
    status
    progress
    completedAt
    course {
      id
      title
    }
  }
}

# Variables:
{
  "enrollCourseInput": {
    "courseId": "course-uuid-here"
  }
}
```

#### 3. Tạo Chứng Chỉ

```graphql
mutation GenerateCertificate {
  generateCertificate(enrollmentId: "enrollment-uuid") {
    id
    certificateNumber
    issuedDate
    verificationUrl
  }
}
```

#### 4. Tạo Thảo Luận

```graphql
mutation CreateDiscussion($input: CreateDiscussionInput!) {
  createDiscussion(input: $input) {
    id
    title
    content
    isPinned
    user {
      id
      username
      firstName
      lastName
    }
    createdAt
  }
}

# Variables:
{
  "input": {
    "courseId": "course-uuid-here",
    "title": "Câu hỏi về bài 5",
    "content": "Em chưa hiểu phần này..."
  }
}
```

#### 5. Trả Lời Thảo Luận

```graphql
mutation CreateReply($input: CreateReplyInput!) {
  createReply(input: $input) {
    id
    content
    parentId
    user {
      id
      username
      firstName
      lastName
    }
    createdAt
  }
}

# Variables cho reply chính:
{
  "input": {
    "discussionId": "discussion-uuid-here",
    "content": "Đây là câu trả lời...",
    "parentId": null
  }
}

# Variables cho nested reply:
{
  "input": {
    "discussionId": "discussion-uuid-here",
    "content": "Trả lời comment trên...",
    "parentId": "parent-reply-uuid-here"
  }
}
```

---

## 🛠️ Xử Lý Sự Cố

### Lỗi Thường Gặp

#### 1. Không thể đăng ký khóa học

**Nguyên nhân:**
- Chưa đăng nhập
- Đã đăng ký khóa học này rồi
- Khóa học chưa PUBLISHED

**Giải pháp:**
```bash
1. Kiểm tra trạng thái đăng nhập
2. Vào My Learning xem đã đăng ký chưa
3. Liên hệ admin nếu khóa học không hiển thị
```

#### 2. Video không phát

**Nguyên nhân:**
- URL video không hợp lệ
- Minio/CDN không hoạt động
- Định dạng video không được hỗ trợ

**Giải pháp:**
```bash
1. Refresh trang
2. Thử trình duyệt khác
3. Kiểm tra kết nối mạng
4. Báo lỗi cho giảng viên
```

#### 3. Không nhận được chứng chỉ

**Nguyên nhân:**
- Chưa hoàn thành 100% khóa học
- Quiz chưa đạt điểm
- Lỗi hệ thống

**Giải pháp:**
```bash
1. Kiểm tra % hoàn thành trong My Learning
2. Kiểm tra điểm quiz
3. Liên hệ hỗ trợ với mã enrollment
```

#### 4. Không thể tạo thảo luận

**Nguyên nhân:**
- Chưa đăng ký khóa học
- Khóa học đã đóng

**Giải pháp:**
```bash
1. Đảm bảo đã enroll khóa học
2. Đăng nhập với tài khoản đúng
```

---

## 📊 Best Practices

### Cho Giảng Viên

1. **Tổ chức nội dung:**
   - Chia thành modules logic (5-7 modules/course)
   - Mỗi module 3-5 lessons
   - Lesson ngắn (10-15 phút)

2. **Video chất lượng:**
   - Resolution: 1080p
   - Audio rõ ràng
   - Có phụ đề (nếu có thể)

3. **Quiz hiệu quả:**
   - Sau mỗi module
   - 5-10 câu hỏi
   - Mix nhiều loại câu hỏi

4. **Tương tác:**
   - Trả lời discussion nhanh chóng
   - Pin FAQ
   - Cập nhật nội dung định kỳ

### Cho Học Viên

1. **Học hiệu quả:**
   - Xem video không skip
   - Làm quiz nghiêm túc
   - Ghi chép trong khi học

2. **Tham gia tích cực:**
   - Đặt câu hỏi rõ ràng
   - Chia sẻ kiến thức
   - Giúp đỡ bạn học

3. **Quản lý thời gian:**
   - Đặt mục tiêu học hàng ngày
   - Hoàn thành khóa học đúng hạn
   - Ôn tập định kỳ

---

## 🎓 Workflow Hoàn Chỉnh

### Quy Trình Tạo Và Học Khóa

```
GIẢNG VIÊN                     HỆ THỐNG                    HỌC VIÊN
    │                              │                            │
    ├─ Create Course ───────────→  │                            │
    ├─ Add Modules & Lessons ───→  │                            │
    ├─ Create Quizzes ──────────→  │                            │
    ├─ Publish Course ──────────→  │                            │
    │                              ├─ Show in /courses ────────→│
    │                              │                            ├─ Enroll
    │                              │←─── Enrollment ────────────┤
    │                              │                            │
    │                              │                            ├─ Watch Lessons
    │                              │                            ├─ Take Quizzes
    │                              │                            ├─ Join Discussions
    │                              │                            │
    │←─── Get Notification ────────┤                            │
    ├─ Reply Discussion ─────────→ │                            │
    │                              ├─ Notify Student ──────────→│
    │                              │                            │
    │                              │                            ├─ Complete 100%
    │                              ├─ Auto Generate Cert ──────→│
    │                              │                            ├─ Download Certificate
    │                              │                            │
    │←─── Course Analytics ────────┤                            │
    │                              │                            ├─ Write Review
    ├─ Update Content ───────────→ │                            │
```

---

## 📞 Hỗ Trợ

### Thông Tin Liên Hệ

- **Email**: support@rausachcore.com
- **Documentation**: `/docs/LMS_SYSTEM_COMPLETE.md`
- **GraphQL Playground**: `http://localhost:12001/graphql`
- **API Reference**: Xem trong GraphQL Schema

### Báo Lỗi

```
Vui lòng cung cấp:
1. URL trang gặp lỗi
2. Thao tác đang thực hiện
3. Screenshot (nếu có)
4. Browser và phiên bản
5. Thông tin tài khoản (username)
```

---

## ✅ Checklist Bắt Đầu

### Giảng Viên Mới

- [ ] Đăng ký tài khoản
- [ ] Cập nhật profile (avatar, bio)
- [ ] Tạo khóa học đầu tiên
- [ ] Upload ít nhất 3 lessons
- [ ] Tạo 1 quiz
- [ ] Publish khóa học
- [ ] Giới thiệu khóa học trên social media

### Học Viên Mới

- [ ] Đăng ký tài khoản
- [ ] Browse khóa học
- [ ] Enroll khóa học miễn phí
- [ ] Hoàn thành lesson đầu tiên
- [ ] Tham gia thảo luận
- [ ] Làm quiz
- [ ] Nhận chứng chỉ đầu tiên

---

**Phiên bản:** 1.0  
**Cập nhật:** 30/10/2024  
**Tác giả:** LMS Development Team
