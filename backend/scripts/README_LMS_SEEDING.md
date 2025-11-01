# LMS Course Seeding Scripts

## 📚 Overview

Scripts để tạo dữ liệu mẫu cho hệ thống LMS (Learning Management System).

## 🎯 Scripts Available

### 1. `create-users.ts`
Tạo 2 users mẫu:
- foxmelanie77@gmail.com (password: 123456)
- phanngocdanthanh94@gmail.com (password: 123456)

```bash
bun run scripts/create-users.ts
```

### 2. `seed-courses.ts`
Tạo 4 khóa học đầy đủ với modules và lessons:

1. **Chăm sóc da cơ bản** - Enrolled: foxmelanie77@gmail.com
   - Price: 1,500,000 VNĐ
   - Level: BEGINNER
   - 3 modules, 9 lessons
   - Duration: 480 minutes

2. **Phun xăm thẩm mỹ chuyên sâu** - Enrolled: foxmelanie77@gmail.com
   - Price: 8,500,000 VNĐ
   - Level: ADVANCED
   - 4 modules, 16 lessons
   - Duration: 1200 minutes

3. **Chăm sóc da nâng cao** - Enrolled: phanngocdanthanh94@gmail.com
   - Price: 3,500,000 VNĐ
   - Level: INTERMEDIATE
   - 4 modules, 14 lessons
   - Duration: 720 minutes

4. **Nối mi chuyên nghiệp** - Enrolled: phanngocdanthanh94@gmail.com
   - Price: 4,500,000 VNĐ
   - Level: INTERMEDIATE
   - 5 modules, 20 lessons
   - Duration: 900 minutes

```bash
bun run scripts/seed-courses.ts
```

### 3. `check-users.ts`
Kiểm tra users trong database

```bash
bun run scripts/check-users.ts
```

### 4. `course-report.ts`
Xem báo cáo chi tiết về courses đã tạo

```bash
bun run scripts/course-report.ts
```

## 📊 Statistics

**Total Created:**
- 4 Courses
- 16 Modules
- 59 Lessons
- 4 Enrollments
- 1 Category (Làm đẹp)

## 🚀 Quick Start

```bash
# 1. Create users first
cd /mnt/chikiet/kataoffical/shoprausach/backend
bun run scripts/create-users.ts

# 2. Seed courses with modules and lessons
bun run scripts/seed-courses.ts

# 3. View detailed report
bun run scripts/course-report.ts
```

## 📝 Features

### Course Features:
- ✅ Full course information (title, description, price, level, etc.)
- ✅ Multiple modules per course
- ✅ Multiple lessons per module
- ✅ Preview lessons (isPreview: true, isFree: true)
- ✅ Learning objectives (whatYouWillLearn)
- ✅ Requirements
- ✅ Target audience
- ✅ Tags for SEO
- ✅ Category assignment
- ✅ Published status
- ✅ Enrollment with payment info

### Lesson Features:
- Video content URLs
- Duration tracking
- Order management
- Preview/Free flags
- Type: VIDEO, TEXT, QUIZ, etc.

## 🔧 Customization

### To modify courses:
Edit `scripts/seed-courses.ts` and change:
- Course details (title, price, description, etc.)
- Module structure
- Lesson content
- Enrollment assignments

### To add more users:
Edit `scripts/create-users.ts` and add more user objects.

## ⚠️ Notes

- Scripts use `upsert` operations to avoid duplicates
- Default instructor is taken from existing ADMIN users
- All courses are set to PUBLISHED status
- Enrollments have ACTIVE status with 0% progress
- Default payment method is TRANSFER

## 🎓 Login Credentials

**Student Accounts:**
- Email: foxmelanie77@gmail.com
- Password: 123456
- Enrolled in: Chăm sóc da cơ bản, Phun xăm thẩm mỹ chuyên sâu

---

- Email: phanngocdanthanh94@gmail.com  
- Password: 123456
- Enrolled in: Chăm sóc da nâng cao, Nối mi chuyên nghiệp

**Instructor Account:**
- Email: instructor@lms.com
- (Use existing password)

## 📸 Sample Data Structure

```
Course
├── Modules (ordered)
│   ├── Module 1
│   │   ├── Lesson 1 (Preview + Free)
│   │   ├── Lesson 2
│   │   └── Lesson 3
│   ├── Module 2
│   │   └── ...
│   └── ...
└── Enrollments
    ├── User 1
    └── User 2
```

## 🔄 Re-running Scripts

Scripts are safe to re-run:
- `create-users.ts`: Uses upsert, won't create duplicates
- `seed-courses.ts`: Will create new courses each time (check before re-running)

## 🧹 Cleanup

To remove seeded data, use Prisma Studio or custom cleanup scripts.

## 📧 Support

For issues or questions, contact the development team.

---

**Last Updated:** November 1, 2025
