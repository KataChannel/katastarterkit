# 📚 Hướng Dẫn Sử Dụng Hệ Thống LMS - Quick Guide

## 🎯 Tổng Quan Nhanh

Hệ thống LMS (Learning Management System) quản lý khóa học trực tuyến với đầy đủ tính năng: courses, modules, lessons, quizzes, enrollments, certificates.

---

## 👥 Vai Trò Người Dùng

### 1. ADMIN
- Quản lý toàn bộ hệ thống
- Tạo/sửa/xóa courses, modules, lessons
- Tạo quiz và câu hỏi
- Xem báo cáo, thống kê
- Quản lý users, enrollments

### 2. USER (Học viên)
- Đăng ký khóa học
- Học lessons (video, text, quiz)
- Làm quiz, xem điểm
- Theo dõi tiến độ học
- Nhận certificate khi hoàn thành

### 3. GUEST
- Xem danh sách khóa học
- Xem preview lessons (miễn phí)
- Đăng ký tài khoản

---

## 🚀 Bắt Đầu Nhanh

### A. Với Học Viên

#### 1. Đăng ký tài khoản
```
Truy cập: /register
→ Điền: username, email, password
→ Click "Đăng ký"
→ Xác thực email (nếu có)
```

#### 2. Đăng nhập
```
Truy cập: /login
→ Nhập: username/email + password
→ Click "Đăng nhập"
```

#### 3. Tìm khóa học
```
Trang chủ: /lms/courses
→ Browse danh sách courses
→ Filter theo: category, level, price
→ Search: tìm kiếm theo tên
```

#### 4. Xem chi tiết khóa học
```
Click vào course card
→ Xem: description, modules, lessons
→ Xem preview lessons (free)
→ Check: price, duration, instructor
```

#### 5. Enroll khóa học
```
Trong trang course detail
→ Click "Enroll Now" / "Đăng ký học"
→ Chọn phương thức thanh toán (nếu có phí)
→ Confirm enrollment
```

#### 6. Học bài
```
My Courses: /lms/my-courses
→ Click vào enrolled course
→ Học theo thứ tự: Module → Lesson
→ Xem video/đọc text
→ Làm quiz khi kết thúc lesson
```

#### 7. Làm Quiz
```
Trong lesson có quiz
→ Click "Start Quiz"
→ Đọc câu hỏi, chọn đáp án
→ Time limit: 15 phút
→ Submit khi xong
→ Xem kết quả + giải thích
→ Pass >= 70% để tiếp tục
→ Max 3 lần làm lại
```

#### 8. Theo dõi tiến độ
```
My Courses page
→ Xem progress bar (%)
→ Check lessons completed
→ Xem quiz scores
```

#### 9. Nhận Certificate
```
Khi hoàn thành 100% course
→ Certificate tự động tạo
→ Download PDF
→ Share trên social media
```

---

### B. Với Admin

#### 1. Đăng nhập Admin
```
URL: /admin
Username: admin (hoặc tài khoản ADMIN role)
Password: [admin password]
```

#### 2. Tạo Course mới
```
Admin Dashboard → Courses → Create New
→ Điền thông tin:
   - Title, Slug
   - Description
   - Thumbnail image
   - Price, Category, Level
   - Tags
→ Status: DRAFT (để chỉnh sửa) hoặc PUBLISHED
→ Save
```

#### 3. Tạo Module
```
Trong Course → Modules → Add Module
→ Điền:
   - Title
   - Description
   - Order (thứ tự)
→ Save
```

#### 4. Tạo Lesson
```
Trong Module → Lessons → Add Lesson
→ Chọn type:
   - VIDEO: nhập video URL
   - TEXT: nhập HTML content
   - QUIZ: tạo quiz riêng
→ Điền:
   - Title, Description
   - Duration (phút)
   - Order
   - isPreview (cho phép xem trước)
   - isFree (miễn phí)
→ Save
```

#### 5. Tạo Quiz cho Lesson
```
Cách 1: Chạy script seeding
cd backend
bun run scripts/seed-all-course-quizzes.ts

Cách 2: Tạo manual qua Admin UI
Lesson → Add Quiz
→ Điền:
   - Title, Description
   - Passing Score (70%)
   - Time Limit (15 min)
   - Max Attempts (3)
→ Add Questions:
   - Type: MULTIPLE_CHOICE / TRUE_FALSE
   - Question text
   - Points (10-15)
   - Answers (đánh dấu đáp án đúng)
   - Explanation
→ Save
```

#### 6. Quản lý Enrollments
```
Admin → Enrollments
→ Xem danh sách học viên enrolled
→ Filter: by course, status, date
→ Actions:
   - Approve/Reject
   - Refund
   - Extend access
```

#### 7. Xem Reports
```
Admin → Reports
→ Thống kê:
   - Total enrollments
   - Revenue by course
   - Completion rates
   - Quiz scores
   - Popular courses
```

---

## 📊 Database Schema Chính

### Course
```
- id, title, slug, description
- thumbnail, price, level
- status: DRAFT | PUBLISHED | ARCHIVED
- modules[] (1-to-many)
```

### Module
```
- id, title, description, order
- courseId
- lessons[] (1-to-many)
```

### Lesson
```
- id, title, description
- type: VIDEO | TEXT | QUIZ
- content (URL hoặc HTML)
- duration, order
- moduleId
- quizzes[] (1-to-many)
```

### Quiz
```
- id, title, description
- lessonId
- passingScore (70%)
- timeLimit (15 min)
- maxAttempts (3)
- isRequired (true)
- questions[] (1-to-many)
```

### Question
```
- id, question (text)
- type: MULTIPLE_CHOICE | TRUE_FALSE
- points (10-15)
- order, explanation
- quizId
- answers[] (1-to-many)
```

### Answer
```
- id, text
- isCorrect (boolean)
- order
- questionId
```

### Enrollment
```
- id, userId, courseId
- status: ACTIVE | COMPLETED | CANCELLED
- progress (0-100%)
- enrolledAt, completedAt
- lessonProgress[]
- quizAttempts[]
```

---

## 🔧 API Endpoints Chính

### Courses
```graphql
# Lấy danh sách courses
query GetCourses($filter: CourseFilterInput) {
  courses(filter: $filter) {
    id, title, slug, thumbnail
    price, level, status
    enrollmentCount
  }
}

# Chi tiết 1 course
query GetCourse($slug: String!) {
  course(slug: $slug) {
    id, title, description
    modules {
      id, title
      lessons {
        id, title, type, duration
        isPreview
      }
    }
  }
}

# Tạo course (ADMIN)
mutation CreateCourse($input: CreateCourseInput!) {
  createCourse(input: $input) {
    id, title, slug
  }
}
```

### Enrollments
```graphql
# Enroll vào course
mutation EnrollCourse($courseId: String!) {
  enrollCourse(courseId: $courseId) {
    id, status, progress
  }
}

# Lấy courses đã enroll
query GetMyEnrollments {
  myEnrollments {
    id, progress, status
    course {
      id, title, thumbnail
    }
    lessonProgress {
      lessonId, completed
    }
  }
}
```

### Quizzes
```graphql
# Lấy quiz của lesson
query GetQuiz($lessonId: String!) {
  quizByLesson(lessonId: $lessonId) {
    id, title, timeLimit, passingScore
    questions {
      id, question, type, points
      answers {
        id, text
      }
    }
  }
}

# Submit quiz
mutation SubmitQuiz($input: SubmitQuizInput!) {
  submitQuiz(input: $input) {
    id, score, passed
    attemptNumber
  }
}
```

### Progress Tracking
```graphql
# Đánh dấu lesson completed
mutation CompleteLesson($lessonId: String!, $enrollmentId: String!) {
  completeLesson(lessonId: $lessonId, enrollmentId: $enrollmentId) {
    id, completed, completedAt
  }
}

# Lấy progress
query GetEnrollmentProgress($enrollmentId: String!) {
  enrollmentProgress(enrollmentId: $enrollmentId) {
    id, progress
    lessonProgress {
      lessonId, completed, watchTime
    }
    quizAttempts {
      quizId, score, passed, attemptNumber
    }
  }
}
```

---

## 📱 Frontend Routes

### Public Routes
```
/lms/courses              → Danh sách khóa học
/lms/courses/[slug]       → Chi tiết khóa học
/lms/courses/[slug]/preview → Preview lessons
/register                 → Đăng ký
/login                    → Đăng nhập
```

### User Routes (Cần login)
```
/lms/my-courses           → Khóa học đã enroll
/lms/my-courses/[slug]    → Học bài
/lms/my-courses/[slug]/lesson/[lessonId] → Chi tiết lesson
/lms/certificates         → Chứng chỉ của tôi
/profile                  → Thông tin cá nhân
```

### Admin Routes (Cần ADMIN role)
```
/admin/courses            → Quản lý courses
/admin/courses/create     → Tạo course mới
/admin/courses/[id]/edit  → Sửa course
/admin/enrollments        → Quản lý enrollments
/admin/users              → Quản lý users
/admin/reports            → Báo cáo, thống kê
```

---

## 🎓 Workflow Học Tập

### Luồng chuẩn của học viên:
```
1. Đăng ký tài khoản → Xác thực email
   ↓
2. Browse courses → Tìm khóa học phù hợp
   ↓
3. Xem preview lessons → Đánh giá nội dung
   ↓
4. Enroll course → Thanh toán (nếu có)
   ↓
5. Học Module 1 → Lesson 1
   ↓
6. Xem video/đọc text → Ghi chú
   ↓
7. Làm Quiz → Pass >= 70%
   ↓
8. Lesson completed → Tự động mark progress
   ↓
9. Lặp lại cho các lessons tiếp theo
   ↓
10. Hoàn thành tất cả modules
   ↓
11. Certificate tự động tạo → Download PDF
   ↓
12. Review course → Rate & Comment
```

---

## 🏆 Tính Năng Nổi Bật

### 1. Quiz System
- ✅ 2 loại câu hỏi: Multiple Choice, True/False
- ✅ Time limit: 15 phút
- ✅ Max 3 attempts
- ✅ Passing score: 70%
- ✅ Explanation sau mỗi câu
- ✅ Auto grading

### 2. Progress Tracking
- ✅ Real-time progress bar
- ✅ Lesson completion status
- ✅ Quiz scores history
- ✅ Watch time tracking (video)
- ✅ Auto-save progress

### 3. Certificate System
- ✅ Auto generate khi 100% complete
- ✅ PDF download
- ✅ Unique certificate ID
- ✅ Verification URL
- ✅ Share to social media

### 4. Enrollment Management
- ✅ Multiple payment methods
- ✅ Course access control
- ✅ Expiration date (nếu có)
- ✅ Refund policy
- ✅ Course transfer

---

## 🔐 Bảo Mật & Phân Quyền

### Authentication
```
- JWT token (access + refresh)
- Session timeout: 24h
- Password hashing: bcrypt
- 2FA support (optional)
```

### Authorization
```
- Role-based: ADMIN, USER, GUEST
- Course access: enrolled users only
- Quiz submit: enrolled + active
- Certificate: 100% complete only
```

---

## 📊 Dữ Liệu Mẫu Hiện Có

### Courses (4 khóa đầy đủ)
1. **Nối mi chuyên nghiệp** (20 lessons, 20 quizzes)
2. **Chăm sóc da nâng cao** (14 lessons, 14 quizzes)
3. **Phun xăm thẩm mỹ** (16 lessons, 16 quizzes)
4. **Chăm sóc da cơ bản** (9 lessons, 9 quizzes)

**Tổng:** 59 lessons, 59 quizzes, 413 questions

---

## 🚀 Commands Hữu Ích

### Development
```bash
# Start backend
cd backend
bun run dev

# Start frontend
cd frontend
bun run dev

# Access
Frontend: http://localhost:3000
Backend: http://localhost:4000
GraphQL Playground: http://localhost:4000/graphql
```

### Database
```bash
# Migrate database
cd backend
bunx prisma migrate dev

# Seed courses data
bun run scripts/seed-lms-courses.ts

# Seed quizzes
bun run scripts/seed-all-course-quizzes.ts

# Open Prisma Studio
bunx prisma studio
```

### Testing
```bash
# Test GraphQL query
bun run scripts/test-lms-queries.ts

# Check enrollments
bun run scripts/check-enrollments.ts
```

---

## 🆘 Troubleshooting

### Issue 1: Không enroll được course
**Giải pháp:**
- Check user đã login chưa
- Check course status = PUBLISHED
- Check payment (nếu có)
- Check enrollment limit

### Issue 2: Quiz không submit được
**Giải pháp:**
- Check enrollment status = ACTIVE
- Check quiz attempts < maxAttempts
- Check time limit chưa hết
- Check network connection

### Issue 3: Progress không cập nhật
**Giải pháp:**
- Refresh page
- Check lesson completed correctly
- Check quiz passed (>= 70%)
- Clear cache

### Issue 4: Certificate không tạo
**Giải pháp:**
- Check progress = 100%
- Check tất cả quizzes passed
- Check enrollment status = COMPLETED
- Re-calculate progress

---

## 📞 Support

**Documentation:** `/docs`  
**API Reference:** `/graphql` (playground)  
**Admin Support:** admin@lms.com  
**Bug Report:** GitHub Issues  

---

**Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** ✅ Production Ready
