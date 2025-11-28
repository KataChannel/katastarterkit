# 👨‍💼 HƯỚNG DẪN QUẢN TRỊ VIÊN - LMS

## 📚 Mục lục
1. [Dashboard Admin](#dashboard-admin)
2. [Quản lý khóa học](#quản-lý-khóa-học)
3. [Phê duyệt khóa học](#phê-duyệt-khóa-học)
4. [Quản lý giảng viên](#quản-lý-giảng-viên)
5. [Quản lý học viên](#quản-lý-học-viên)
6. [Quản lý danh mục](#quản-lý-danh-mục)
7. [Quản lý tài liệu nguồn](#quản-lý-tài-liệu-nguồn)
8. [Báo cáo và thống kê](#báo-cáo-và-thống-kê)
9. [Cài đặt hệ thống](#cài-đặt-hệ-thống)

---

## 📊 Dashboard Admin

### Truy cập
**Đường dẫn**: `/lms/admin`

### Tổng quan hệ thống

#### Thống kê chính
- 📚 **Tổng khóa học**: Published + Draft
- 👥 **Tổng học viên**: Đang hoạt động
- 👨‍🏫 **Tổng giảng viên**: Số instructor
- 💰 **Doanh thu**: Tổng revenue (nếu có)
- ⭐ **Rating trung bình**: Across all courses

#### Biểu đồ và xu hướng
- **Enrollment Trends**: Đăng ký theo thời gian
- **Revenue Chart**: Doanh thu theo tháng
- **Top Courses**: 10 khóa học hot nhất
- **Top Instructors**: Giảng viên xuất sắc

#### Recent Activities
- Khóa học mới đăng ký
- Khóa học cần phê duyệt
- Báo cáo vi phạm
- Câu hỏi cần hỗ trợ

---

## 📚 Quản lý khóa học

### Danh sách khóa học
**Đường dẫn**: `/lms/admin/courses`

### Xem và lọc khóa học

#### Bộ lọc
- **Status**: 
  - Draft (Nháp)
  - Published (Đã xuất bản)
  - Archived (Đã lưu trữ)
  - Pending Approval (Chờ duyệt)

- **Category**: Theo danh mục
- **Instructor**: Theo giảng viên
- **Price**: Miễn phí / Có phí
- **Rating**: Xếp hạng sao

#### Tìm kiếm
- Tìm theo tên khóa học
- Tìm theo slug
- Tìm theo ID

### Thông tin hiển thị
- Thumbnail
- Tiêu đề
- Giảng viên
- Số học viên
- Rating
- Giá
- Trạng thái
- Ngày tạo

### Actions
- 👁️ **View**: Xem chi tiết
- ✏️ **Edit**: Chỉnh sửa
- ✅ **Approve**: Phê duyệt (nếu pending)
- ❌ **Reject**: Từ chối
- 📦 **Archive**: Lưu trữ
- 🗑️ **Delete**: Xóa (cẩn thận!)

### Tạo khóa học mới (Admin)
**Đường dẫn**: `/lms/admin/courses/create`

Tương tự Instructor, nhưng:
- Có thể gán cho giảng viên khác
- Tự động approve
- Full quyền chỉnh sửa

---

## ✅ Phê duyệt khóa học

### Danh sách chờ duyệt
**Đường dẫn**: `/lms/admin/approvals`

### Quy trình phê duyệt

#### Xem chi tiết khóa học
1. Click vào khóa học pending
2. Review:
   - ✅ Nội dung đầy đủ?
   - ✅ Chất lượng video/text tốt?
   - ✅ Quiz hợp lý?
   - ✅ Không vi phạm quy định?
   - ✅ Mô tả chính xác?

#### Approve (Chấp thuận)
1. Click **"Approve"**
2. Khóa học chuyển sang Published
3. Hiển thị công khai
4. Giảng viên nhận thông báo

#### Reject (Từ chối)
1. Click **"Reject"**
2. **Bắt buộc** nhập lý do từ chối:
   - Nội dung không đầy đủ
   - Chất lượng kém
   - Vi phạm quy định
   - Mô tả sai lệch
   - Giá không hợp lý
3. Giảng viên nhận email kèm lý do
4. Giảng viên có thể chỉnh sửa và request lại

#### Pending Review
- Mark khóa học cần review kỹ hơn
- Assign cho admin khác review

---

## 👨‍🏫 Quản lý giảng viên

### Danh sách giảng viên
**Đường dẫn**: `/lms/admin/instructors`

### Thông tin giảng viên
- Tên, email, avatar
- Số khóa học đã tạo
- Tổng học viên
- Rating trung bình
- Doanh thu (nếu có)
- Ngày tham gia

### Actions

#### Xem chi tiết
1. Click vào giảng viên
2. Xem:
   - Profile đầy đủ
   - Danh sách khóa học
   - Reviews từ học viên
   - Earnings history
   - Activity log

#### Thăng cấp/Hạ cấp
- **Promote to Featured**: Giảng viên nổi bật
- **Verify Instructor**: Badge xác thực
- **Suspend**: Tạm khóa tài khoản
- **Ban**: Cấm vĩnh viễn

#### Gửi thông báo
- Gửi email thông báo
- Announce cập nhật chính sách
- Yêu cầu chỉnh sửa khóa học

### Tạo giảng viên mới
1. Click **"+ New Instructor"**
2. Nhập thông tin:
   - Email
   - Tên
   - Password (temporary)
3. Gửi email welcome
4. Giảng viên đăng nhập và đổi password

---

## 👥 Quản lý học viên

### Danh sách học viên
**Đường dẫn**: `/lms/admin/students`

### Thông tin học viên
- Tên, email, avatar
- Số khóa học đã đăng ký
- Khóa học đã hoàn thành
- Chứng chỉ đã nhận
- Tổng chi tiêu (nếu có)
- Ngày đăng ký

### Xem chi tiết học viên
1. Click vào học viên
2. **Đường dẫn**: `/lms/admin/students/[id]`
3. Xem:
   - **Enrollments**: Khóa học đang học
   - **Progress**: Tiến độ chi tiết
   - **Certificates**: Chứng chỉ đã nhận
   - **Payments**: Lịch sử thanh toán
   - **Activity**: Hoạt động gần đây

### Actions
- **View Profile**: Xem hồ sơ
- **Enroll in Course**: Ghi danh thủ công
- **Issue Certificate**: Cấp chứng chỉ
- **Reset Progress**: Reset tiến độ
- **Refund**: Hoàn tiền (nếu có)
- **Suspend**: Tạm khóa
- **Delete**: Xóa tài khoản

### Quản lý Enrollments
**Đường dẫn**: `/lms/admin/enrollments`

- Xem tất cả enrollments
- Lọc theo:
  - Status: Active/Completed/Dropped
  - Course
  - Date range
- Actions:
  - Approve manual enrollment
  - Cancel enrollment
  - Extend access

---

## 📂 Quản lý danh mục

### Danh sách danh mục
**Đường dẫn**: `/lms/admin/categories`

### Cấu trúc danh mục
- Danh mục cấp 1 (Parent)
- Danh mục con (Child)
- Có thể nested nhiều cấp

### Tạo danh mục mới
1. Click **"+ New Category"**
2. Nhập:
   - Tên danh mục
   - Slug (auto-generate)
   - Mô tả
   - Icon (Lucide icon name)
   - Color (hex code)
   - Parent category (nếu là con)
3. Click **"Create"**

### Chỉnh sửa danh mục
- Click **"Edit"**
- Thay đổi thông tin
- Save

### Xóa danh mục
- Click **"Delete"**
- **Lưu ý**: Nếu danh mục có khóa học:
  - Option 1: Move courses sang danh mục khác
  - Option 2: Set courses về "Uncategorized"

### Sắp xếp danh mục
- Drag & Drop để sắp xếp thứ tự hiển thị
- Hoặc dùng nút ⬆️⬇️

---

## 📄 Quản lý tài liệu nguồn

### Thư viện tài liệu Admin
**Đường dẫn**: `/lms/admin/source-documents`

### Tất cả tài liệu
- Xem tài liệu của tất cả giảng viên
- Lọc theo:
  - Type: File/Video/Audio/Text/Link/Image
  - Category
  - Status: Draft/Published/Archived
  - Instructor
  - AI Analyzed: Yes/No

### Phê duyệt tài liệu
Tương tự phê duyệt khóa học:
1. Review tài liệu
2. Approve/Reject
3. Thêm ghi chú nếu reject

### Quản lý danh mục tài liệu
**Đường dẫn**: `/lms/admin/source-documents/categories`

- Tạo/Edit/Delete categories
- Tổ chức thư viện tài liệu
- Set icon và màu sắc

### AI Analysis (Bulk)
- Chọn nhiều tài liệu
- Click **"Analyze with AI"**
- Hệ thống batch process:
  - Generate summary
  - Extract keywords
  - Identify topics

---

## 📊 Báo cáo và thống kê

### Dashboard báo cáo
**Đường dẫn**: `/lms/admin/reports`

### Báo cáo có sẵn

#### 1. Course Analytics
- Top performing courses
- Courses với completion rate cao nhất
- Courses cần cải thiện
- New courses published

#### 2. Instructor Analytics
- Top instructors by revenue
- Top instructors by rating
- Instructors cần support
- New instructors joined

#### 3. Student Analytics
- Total enrollments (trend)
- Active students
- Completion rate tổng thể
- Certificate issued
- Drop-out rate

#### 4. Revenue Reports (Nếu có)
- Total revenue
- Revenue by course
- Revenue by instructor
- Monthly/Quarterly/Yearly comparison

#### 5. Engagement Metrics
- Daily active users
- Average session duration
- Most watched lessons
- Most discussed topics
- Quiz performance

### Custom Reports
1. Click **"Create Custom Report"**
2. Chọn:
   - Metrics muốn xem
   - Time range
   - Filters
   - Group by
3. Generate report
4. Save template để dùng lại

### Export Reports
- **PDF**: Báo cáo đẹp, print-friendly
- **Excel**: Data để phân tích thêm
- **CSV**: Raw data

### Schedule Reports
- Setup auto-send email reports:
  - Daily summary
  - Weekly overview
  - Monthly detailed report
- Chọn recipients

---

## ⚙️ Cài đặt hệ thống

### LMS Settings
**Đường dẫn**: `/lms/admin/settings`

### General Settings

#### Platform Information
- Site name
- Site logo
- Support email
- Contact info

#### Course Settings
- **Default course duration**: Số ngày access mặc định
- **Auto-approve courses**: Tự động duyệt (không khuyến khích)
- **Require approval**: Bật/tắt approval workflow
- **Allow instructor to publish**: Cho phép giảng viên publish trực tiếp

#### Enrollment Settings
- **Allow free enrollment**: Cho phép enroll khóa miễn phí
- **Manual enrollment**: Admin phải approve enrollment
- **Max enrollments per user**: Giới hạn số khóa/user

#### Certificate Settings
- **Auto-issue certificates**: Tự động cấp khi hoàn thành
- **Certificate template**: Chọn template PDF
- **Certificate numbering**: Format mã chứng chỉ

#### Quiz Settings
- **Default passing score**: 70%
- **Default max attempts**: 3
- **Default time limit**: 30 minutes
- **Show correct answers**: Sau khi nộp bài
- **Allow retake**: Cho phép làm lại

### Email Notifications

#### Email Templates
- Welcome email
- Course enrollment confirmation
- Certificate issued
- Course approval/rejection
- Payment confirmation

#### Notification Triggers
- New student enrolled
- Course completed
- Quiz passed/failed
- Discussion reply
- Certificate issued

### Payment Settings (Nếu có)

#### Payment Gateways
- Stripe
- PayPal
- VNPay
- Momo

#### Revenue Share
- Platform fee: X%
- Instructor earning: Y%
- Payment threshold
- Payout schedule

### AI Settings

#### AI Provider
- OpenAI (GPT-4)
- Google Gemini
- Anthropic Claude

#### AI Features
- **Course generation**: Enable/Disable
- **Quiz generation**: Enable/Disable
- **Content analysis**: Enable/Disable
- **Recommendation**: Enable/Disable

#### API Keys
- Nhập API keys
- Test connection
- Monitor usage

---

## 🛡️ Bảo mật và quyền hạn

### Role Management
Xem: Security RBAC System

#### Default Roles
- **ADMIN**: Full access
- **GIANGVIEN**: Instructor permissions
- **USER**: Student permissions

### Permissions
Xem chi tiết trong `backend/src/security/services/rbac-seeder.service.ts`

#### LMS Permissions Categories
1. **Course Management**: Create, Read, Update, Delete, Publish
2. **Lesson Management**: Create, Read, Update, Delete
3. **Module Management**: Create, Read, Update, Delete
4. **Quiz Management**: Create, Read, Update, Delete, Grade
5. **Student Management**: View, Manage, Grade
6. **Enrollment Management**: Create, Read, Update, Delete, Approve
7. **Certificate Management**: Issue, Revoke, View

### Audit Logs
- Track all admin actions
- Who did what, when
- Changes history
- User activities

---

## 🔧 Bảo trì hệ thống

### Database Maintenance

#### Backup
```bash
bun run db:backup
```

#### Restore
```bash
bun run db:restore
```

### Clear Cache
- Clear Redis cache
- Regenerate thumbnails
- Rebuild search index

### System Health
- Database connections
- Redis status
- MinIO status
- API response time
- Error rate

---

## ❓ Xử lý sự cố

### Khóa học không hiển thị
1. Check status = Published
2. Check approved = true
3. Check có ít nhất 1 module + 1 lesson
4. Clear cache

### Học viên không thể enroll
1. Check khóa học published
2. Check giá và payment gateway
3. Check enrollment limit
4. Check user account status

### Certificate không được cấp
1. Check completion = 100%
2. Check quiz passed all required
3. Check certificate settings enabled
4. Manual issue nếu cần

### Video không play
1. Check video URL valid
2. Check MinIO storage
3. Check video format support
4. Check CORS settings

---

## 📞 Hỗ trợ

### Hỗ trợ giảng viên
- Email: instructor-support@domain.com
- Live chat trong giờ hành chính
- Help center: /help

### Hỗ trợ học viên
- Email: student-support@domain.com
- FAQ: /faq
- Community forum: /community

---

**🔗 Liên kết hữu ích**:
- [Trang chủ LMS](../LMS-MANUAL-INDEX.md)
- [RBAC System](./RBAC-SYSTEM.md)
- [API Documentation](./06-API-REFERENCE.md)

**Cập nhật**: 28/11/2025
