# 🎓 Cập Nhật Hệ Thống LMS - Đào Tạo Nhân Viên Công Ty

## 📋 Tổng Quan

Đã cập nhật hệ thống LMS với focus vào đào tạo nhân viên công ty, bao gồm:
- 2 categories chính: Kỹ năng cơ bản & Kỹ năng nâng cao
- 8 khóa học (4 cơ bản + 4 nâng cao)
- Role GIANGVIEN mới cho hệ thống LMS

## ✅ Thay Đổi Hoàn Thành

### 1. Database Schema - Role GIANGVIEN

**File:** `/backend/prisma/schema.prisma`

```prisma
enum UserRoleType {
  ADMIN       // Quản trị viên hệ thống
  GIANGVIEN   // Giảng viên LMS - Toàn quyền LMS ✨ MỚI
  USER        // Người dùng thường
  GUEST       // Khách
}
```

**Migration:** `20251102185558_add_giangvien_role`

**Quyền hạn GIANGVIEN:**
- ✅ Toàn quyền quản lý hệ thống LMS
- ✅ Tạo và quản lý khóa học
- ✅ Quản lý modules, lessons, quizzes
- ✅ Xem danh sách học viên và tiến độ
- ✅ Xem analytics và báo cáo
- ✅ Quản lý thảo luận và Q&A
- ❌ Không có quyền admin hệ thống chính

### 2. Categories Mới - Đào Tạo Nhân Viên

**File:** `/backend/scripts/seed-course-categories.ts`

**2 Categories chính:**

| Icon | Tên | Slug | Mô tả |
|------|-----|------|-------|
| 🎓 | Kỹ năng cơ bản | `basic-skills` | Kỹ năng nền tảng cho nhân viên mới |
| 🏆 | Kỹ năng nâng cao | `advanced-skills` | Kỹ năng chuyên môn và lãnh đạo |

**8 Sub-categories:**

**Kỹ năng cơ bản (4):**
1. 💬 **Giao tiếp & Làm việc nhóm** - `communication-teamwork`
2. ⏰ **Quản lý thời gian** - `time-management`
3. 🧠 **Tư duy & Giải quyết vấn đề** - `problem-solving`
4. 💻 **Tin học văn phòng** - `office-skills`

**Kỹ năng nâng cao (4):**
1. 👔 **Lãnh đạo & Quản lý** - `leadership-management`
2. 🤝 **Đàm phán & Thuyết phục** - `negotiation-persuasion`
3. 📊 **Tư duy chiến lược** - `strategic-thinking`
4. 💡 **Đổi mới & Sáng tạo** - `innovation-creativity`

### 3. Courses Mới - 8 Khóa Học

**File:** `/backend/scripts/seed-sample-courses.ts`

#### KỸ NĂNG CƠ BẢN (4 courses - FREE)

**1. Kỹ năng giao tiếp hiệu quả trong công việc**
- **Giá:** MIỄN PHÍ
- **Level:** Beginner
- **Thời lượng:** 360 phút (6 giờ)
- **Nội dung:**
  - Nguyên tắc giao tiếp hiệu quả trong môi trường công sở
  - Kỹ thuật lắng nghe tích cực và phản hồi xây dựng
  - Giao tiếp qua email và tin nhắn chuyên nghiệp
  - Xử lý xung đột và đưa ra phản hồi khó khăn

**2. Quản lý thời gian và năng suất làm việc**
- **Giá:** MIỄN PHÍ
- **Level:** Beginner
- **Thời lượng:** 300 phút (5 giờ)
- **Nội dung:**
  - Các phương pháp quản lý thời gian hiệu quả (Pomodoro, Time Blocking)
  - Sắp xếp ưu tiên công việc theo ma trận Eisenhower
  - Sử dụng công cụ quản lý công việc (Trello, Asana, Notion)
  - Xử lý nhiệm vụ và deadline hiệu quả

**3. Tư duy logic và giải quyết vấn đề**
- **Giá:** MIỄN PHÍ
- **Level:** Beginner
- **Thời lượng:** 420 phút (7 giờ)
- **Nội dung:**
  - Quy trình phân tích và giải quyết vấn đề có hệ thống
  - Kỹ thuật tư duy phê phán (Critical Thinking)
  - Sử dụng công cụ phân tích: 5 Why, Fishbone, SWOT
  - Ra quyết định dựa trên dữ liệu và logic

**4. Tin học văn phòng nâng cao**
- **Giá:** 500,000đ
- **Level:** Beginner
- **Thời lượng:** 480 phút (8 giờ)
- **Nội dung:**
  - Excel nâng cao: Pivot Table, VLOOKUP, Macro
  - PowerPoint: Thiết kế slide chuyên nghiệp
  - Word: Quản lý tài liệu dài, Mail merge
  - Google Workspace: Drive, Docs, Sheets, Meet

#### KỸ NĂNG NÂNG CAO (4 courses - PAID)

**1. Kỹ năng lãnh đạo và quản lý nhóm**
- **Giá:** 2,500,000đ
- **Level:** Advanced
- **Thời lượng:** 720 phút (12 giờ)
- **Đối tượng:** Team Leader, Quản lý cấp trung, Supervisor
- **Nội dung:**
  - Các phong cách lãnh đạo và khi nào áp dụng
  - Xây dựng và phát triển đội nhóm hiệu suất cao
  - Coaching và mentoring nhân viên
  - Quản lý xung đột và ra quyết định chiến lược

**2. Đàm phán và thuyết phục chuyên nghiệp**
- **Giá:** 2,200,000đ
- **Level:** Advanced
- **Thời lượng:** 600 phút (10 giờ)
- **Đối tượng:** Sales Manager, Business Development, Giám đốc kinh doanh
- **Nội dung:**
  - Nguyên tắc và chiến lược đàm phán hiệu quả
  - Kỹ thuật thuyết phục và gây ảnh hưởng
  - Đọc ngôn ngữ cơ thể và tâm lý đối phương
  - Xử lý phản đối và đạt được thỏa thuận Win-Win

**3. Tư duy chiến lược và lập kế hoạch kinh doanh**
- **Giá:** 2,800,000đ (đắt nhất)
- **Level:** Advanced
- **Thời lượng:** 780 phút (13 giờ)
- **Đối tượng:** Giám đốc, Quản lý cấp cao, Strategic Planner
- **Nội dung:**
  - Phân tích SWOT, PESTLE và Porter 5 Forces
  - Xây dựng chiến lược kinh doanh dài hạn
  - Lập kế hoạch và phân bổ nguồn lực hiệu quả
  - Quản trị rủi ro và kế hoạch dự phòng

**4. Đổi mới sáng tạo và quản lý thay đổi**
- **Giá:** 2,400,000đ
- **Level:** Advanced
- **Thời lượng:** 660 phút (11 giờ)
- **Đối tượng:** Innovation Manager, Change Agent, Lãnh đạo cấp cao
- **Nội dung:**
  - Quy trình Design Thinking và Innovation
  - Kỹ thuật tạo ý tưởng sáng tạo (Brainstorming, SCAMPER)
  - Quản lý thay đổi theo mô hình Kotter 8 bước
  - Xây dựng văn hóa đổi mới trong doanh nghiệp

### 4. UI Updates - Icons

**File:** `/frontend/src/app/lms/courses/page.tsx`

```typescript
import { GraduationCap, Award } from 'lucide-react';

const categoryIcons = {
  'basic-skills': GraduationCap,    // 🎓
  'advanced-skills': Award,          // 🏆
  'default': BookOpen,
};
```

### 5. Utility Scripts

**List users và roles:**
```bash
bun run scripts/list-users-roles.ts
```

**Add GIANGVIEN role:**
```bash
bun run scripts/add-giangvien-role.ts <email>
```

**Example:**
```bash
bun run scripts/add-giangvien-role.ts foxmelanie77@gmail.com
```

## 📊 Kết Quả Seed

### Categories
```
✅ Total categories: 29 (12 parent + 17 sub)
   - Kỹ năng cơ bản: 1 parent + 4 sub
   - Kỹ năng nâng cao: 1 parent + 4 sub
   - (+ 10 categories cũ)
```

### Courses
```
✅ Total courses: 28
   - Kỹ năng cơ bản: 4 courses (3 free + 1 paid)
   - Kỹ năng nâng cao: 4 courses (all paid)
   - (+ 20 courses cũ)
```

### Users
```
📊 Total users: 21
   🔴 ADMIN: 5
   🎓 GIANGVIEN: 0 (chưa assign)
   👤 USER: 16
   👻 GUEST: 0
```

## 🎨 UI Preview

### Sidebar Categories

```
┌─────────────────────────────┐
│ 📚 Tất cả danh mục    [28]  │
│                             │
│ 🎓 Kỹ năng cơ bản     [4]   │ ← Icon MỚI
│ 🏆 Kỹ năng nâng cao   [4]   │ ← Icon MỚI
│                             │
│ ... (categories cũ) ...     │
└─────────────────────────────┘
```

## 📁 Files Created/Modified

### Database
1. ✅ `schema.prisma` - Added GIANGVIEN role
2. ✅ Migration `20251102185558_add_giangvien_role`

### Backend Scripts
1. ✅ `seed-course-categories.ts` - Updated với 2 categories mới
2. ✅ `seed-sample-courses.ts` - Updated với 8 courses mới
3. ✅ `add-giangvien-role.ts` - Script thêm role GIANGVIEN ✨ NEW
4. ✅ `list-users-roles.ts` - Script list users theo role ✨ NEW

### Frontend
1. ✅ `/app/lms/courses/page.tsx` - Updated icons mapping

### Documentation
1. ✅ `CAP_NHAT_LMS_DAO_TAO_NHAN_VIEN.md` - File này

## 🚀 Hướng Dẫn Sử Dụng

### 1. Migrate Database

```bash
cd backend
bun prisma migrate dev
```

### 2. Seed Categories và Courses

```bash
# Seed categories (2 categories + 8 sub-categories)
bun run scripts/seed-course-categories.ts

# Seed courses (8 courses)
bun run scripts/seed-sample-courses.ts
```

### 3. Assign Role GIANGVIEN

**Xem danh sách users:**
```bash
bun run scripts/list-users-roles.ts
```

**Thêm role GIANGVIEN:**
```bash
bun run scripts/add-giangvien-role.ts foxmelanie77@gmail.com
```

**Output:**
```
🎓 Adding GIANGVIEN role to user...

✅ Found user: foxmelanie77@gmail.com
   Current role: ADMIN

✅ Updated successfully!
   New role: GIANGVIEN

🎉 User "foxmelanie77@gmail.com" is now a GIANGVIEN
   - Full access to LMS system
   - Can create and manage courses
   - Can view all students and analytics
```

### 4. Kiểm Tra Frontend

Truy cập: http://localhost:3000/lms/courses

**Kiểm tra:**
- ✅ Sidebar hiển thị 2 categories mới với icons
- ✅ Badge count: Kỹ năng cơ bản [4], Kỹ năng nâng cao [4]
- ✅ Click filter hoạt động
- ✅ 8 courses mới hiển thị đúng

## 📊 Thống Kê

| Metric | Số lượng |
|--------|----------|
| **Categories** | |
| Main Categories | 12 (2 new + 10 old) |
| Sub-categories | 17 (8 new + 9 old) |
| Total Categories | 29 |
| **Courses** | |
| Kỹ năng cơ bản | 4 (3 free + 1 paid) |
| Kỹ năng nâng cao | 4 (all paid) |
| Old Courses | 20 |
| Total Courses | 28 |
| **Giá** | |
| Free Courses | 5 (3 new + 2 old) |
| Paid Courses | 23 |
| Min Price | 0đ (free) |
| Max Price | 3,200,000đ |
| **Level** | |
| Beginner | 4 new courses |
| Advanced | 4 new courses |
| **Users** | |
| Total Users | 21 |
| ADMIN | 5 |
| GIANGVIEN | 0 (need assign) |
| USER | 16 |

## 💡 Use Cases

### Đào Tạo Nhân Viên Mới
1. Nhân viên mới enroll 3 khóa FREE cơ bản:
   - Giao tiếp hiệu quả
   - Quản lý thời gian
   - Tư duy logic

2. Sau 3 tháng, enroll thêm:
   - Tin học văn phòng nâng cao (500k)

### Phát Triển Quản Lý
1. Nhân viên thăng tiến lên Team Lead enroll:
   - Kỹ năng lãnh đạo và quản lý nhóm (2.5M)

2. Quản lý cấp cao enroll:
   - Tư duy chiến lược (2.8M)
   - Đổi mới sáng tạo (2.4M)

### Sales Team
1. Sales Manager enroll:
   - Đàm phán và thuyết phục (2.2M)

## 🎯 Tuân Thủ Rules

1. ✅ **Code Like Senior** - Clean TypeScript, proper structure
2. ✅ **Dynamic GraphQL** - Query courses, categories
3. ✅ **Shadcn UI** - GraduationCap, Award icons
4. ✅ **Mobile First** - Responsive design
5. ✅ **Tiếng Việt** - UI và docs
6. ✅ **Single MD** - File báo cáo này

## 🔗 Related Files

- `HUONG_DAN_SU_DUNG_LMS_CHI_TIET.md` - User guide
- `HUONG_DAN_SEED_DU_LIEU_LMS.md` - Seed guide
- `TAO_DU_LIEU_DANH_MUC_KHOA_HOC.md` - Previous update

## 📞 Next Steps (Optional)

1. **Thêm Modules & Lessons** cho 8 courses mới
2. **Thêm Quizzes** kiểm tra kỹ năng
3. **Certificates** cho hoàn thành khóa học
4. **Learning Paths** - Roadmap học tập theo vị trí
5. **Analytics** - Báo cáo tiến độ nhân viên

---

**Status:** ✅ Hoàn thành  
**Ngày:** 3/11/2025  
**Categories:** 2 new (basic-skills, advanced-skills)  
**Courses:** 8 new (4 basic + 4 advanced)  
**Role:** GIANGVIEN added ✨
