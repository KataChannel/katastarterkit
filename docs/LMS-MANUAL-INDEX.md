# 🎓 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG LMS

## 📚 Mục lục tài liệu hướng dẫn

### Dành cho người dùng
1. [**Hướng dẫn cho Học viên**](./LMS-MANUAL-STUDENT.md) - Cách đăng ký, học tập và nhận chứng chỉ
2. [**Hướng dẫn cho Giảng viên**](./LMS-MANUAL-INSTRUCTOR.md) - Tạo và quản lý khóa học
3. [**Hướng dẫn cho Quản trị viên**](./LMS-MANUAL-ADMIN.md) - Quản lý toàn bộ hệ thống

### Tính năng chi tiết
4. [**Tạo khóa học với AI**](./LMS-MANUAL-AI-COURSE.md) - Hướng dẫn sử dụng AI tạo khóa học
5. [**Quản lý tài liệu nguồn**](./LMS-MANUAL-SOURCE-DOCS.md) - Quản lý thư viện tài liệu
6. [**Hệ thống Quiz và đánh giá**](./LMS-MANUAL-QUIZ.md) - Tạo và làm bài kiểm tra

---

## 🎯 Giới thiệu tổng quan

Hệ thống LMS (Learning Management System) là nền tảng học tập trực tuyến toàn diện với các tính năng:

### ✨ Tính năng chính

#### 🎓 Cho học viên
- Đăng ký và theo dõi khóa học
- Xem video bài giảng với tracking tiến độ
- Làm quiz và bài kiểm tra
- Thảo luận với giảng viên và học viên khác
- Nhận chứng chỉ khi hoàn thành

#### 👨‍🏫 Cho giảng viên
- Tạo khóa học thủ công hoặc bằng AI
- Quản lý modules và lessons
- Tạo quiz tự động
- Theo dõi tiến độ học viên
- Xem báo cáo và thống kê

#### 👨‍💼 Cho quản trị viên
- Duyệt và quản lý tất cả khóa học
- Quản lý giảng viên và học viên
- Xem báo cáo tổng quan
- Cấu hình hệ thống

---

## 🚀 Bắt đầu nhanh

### Đăng nhập hệ thống
1. Truy cập: `http://your-domain.com/lms`
2. Đăng nhập bằng tài khoản của bạn
3. Hệ thống tự động chuyển đến dashboard phù hợp với vai trò

### Vai trò trong hệ thống

| Vai trò | Quyền hạn | Dashboard |
|---------|-----------|-----------|
| **Student** (USER) | Xem và học khóa học | `/lms/my-learning` |
| **Instructor** (GIANGVIEN) | Tạo và quản lý khóa học riêng | `/lms/instructor` |
| **Admin** (ADMIN) | Quản lý toàn bộ hệ thống | `/lms/admin` |

---

## 📱 Giao diện chính

### Trang chủ LMS (`/lms`)
- Giới thiệu hệ thống
- Thống kê tổng quan
- Liên kết nhanh đến các tính năng

### Danh sách khóa học (`/lms/courses`)
- Xem tất cả khóa học công khai
- Lọc theo danh mục, cấp độ, giá
- Tìm kiếm khóa học
- Xem chi tiết và đăng ký

### Học tập (`/lms/learn/[slug]`)
- Xem video/nội dung bài giảng
- Theo dõi tiến độ học tập
- Làm quiz
- Thảo luận

---

## 🔗 Liên kết nhanh

- 📖 [Hướng dẫn Học viên](./LMS-MANUAL-STUDENT.md)
- 👨‍🏫 [Hướng dẫn Giảng viên](./LMS-MANUAL-INSTRUCTOR.md)
- 👨‍💼 [Hướng dẫn Quản trị viên](./LMS-MANUAL-ADMIN.md)
- 🤖 [Tạo khóa học với AI](./LMS-MANUAL-AI-COURSE.md)

---

**Cập nhật lần cuối**: 28/11/2025
