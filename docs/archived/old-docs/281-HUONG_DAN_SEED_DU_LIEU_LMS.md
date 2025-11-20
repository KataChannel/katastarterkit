# 📚 Hướng Dẫn Seed Dữ Liệu LMS

## 🎯 Tổng Quan

Hệ thống LMS cần 2 loại dữ liệu chính:
1. **Course Categories** (Danh mục khóa học)
2. **Courses** (Khóa học mẫu)

## 📋 Yêu Cầu

- Backend đã chạy
- Database đã migrate
- Có ít nhất 1 user với role ADMIN

## 🚀 Các Bước Thực Hiện

### Bước 1: Seed Categories

Script này tạo các danh mục khóa học chính và danh mục con.

```bash
cd backend
bun run scripts/seed-course-categories.ts
```

**Categories được tạo:**

| Icon | Tên | Slug | Mô tả |
|------|-----|------|-------|
| 💻 | Lập trình | `programming` | Web, Mobile, Backend Development |
| 💼 | Kinh doanh | `business` | Startup, Quản trị, Tài chính |
| 🎨 | Thiết kế | `design` | UI/UX, Graphic Design, Web Design |
| 📊 | Dữ liệu & Phân tích | `data` | Data Science, ML, AI, Analytics |
| 🌐 | Marketing | `marketing` | Digital Marketing, SEO, Content |
| ⚙️ | Công nghệ | `technology` | DevOps, Cloud, Cybersecurity |
| ✨ | Làm đẹp | `lam-dep` | Skincare, Makeup, Hair, Spa |
| 🗣️ | Ngoại ngữ | `language` | English, Japanese, Korean, Chinese |

**Sub-categories:**

**Programming:**
- Web Development
- Mobile Development  
- Backend Development
- Database

**Design:**
- UI/UX Design
- Graphic Design
- Web Design

**Business:**
- Khởi nghiệp
- Quản trị
- Tài chính

**Kết quả mong đợi:**
```
✅ Course categories seeding completed!

📊 Summary:
   Total categories: 19
   Parent categories: 8
   Sub-categories: 11
```

### Bước 2: Seed Sample Courses

Script này tạo 15+ khóa học mẫu cho các danh mục.

```bash
cd backend
bun run scripts/seed-sample-courses.ts
```

**Courses được tạo:**

**1. Lập trình (3 courses)**
- ✅ Lập trình Web với React & Next.js - 2,500,000đ - Intermediate
- ✅ Node.js & Express - Backend Development - 2,200,000đ - Intermediate  
- ✅ Python cho người mới bắt đầu - MIỄN PHÍ - Beginner

**2. Kinh doanh (2 courses)**
- ✅ Khởi nghiệp từ ý tưởng đến thực tế - 1,800,000đ - Beginner
- ✅ Quản trị dự án với Agile & Scrum - 1,500,000đ - Intermediate

**3. Thiết kế (2 courses)**
- ✅ UI/UX Design từ cơ bản đến chuyên nghiệp - 2,800,000đ - Beginner
- ✅ Graphic Design với Adobe Photoshop - 1,900,000đ - Beginner

**4. Dữ liệu & Phân tích (1 course)**
- ✅ Data Science với Python - 3,200,000đ - Intermediate

**5. Marketing (2 courses)**
- ✅ Digital Marketing toàn diện - 2,100,000đ - Beginner
- ✅ Content Marketing & Copywriting - 1,600,000đ - Beginner

**6. Công nghệ (1 course)**
- ✅ AWS Cloud Computing cho người mới - 2,400,000đ - Intermediate

**7. Làm đẹp (2 courses)**
- ✅ Chăm sóc da cơ bản - MIỄN PHÍ - Beginner
- ✅ Makeup cơ bản cho người mới - 1,200,000đ - Beginner

**8. Ngoại ngữ (1 course)**
- ✅ Tiếng Anh giao tiếp cơ bản - 1,800,000đ - Beginner

**Kết quả mong đợi:**
```
✅ Sample courses seeding completed!

📊 Summary:
   Created: 15
   Skipped: 0
   Total: 15

📚 Courses by category:
   Lập trình: 3 courses
   Kinh doanh: 2 courses
   Thiết kế: 2 courses
   Dữ liệu & Phân tích: 1 courses
   Marketing: 2 courses
   Công nghệ: 1 courses
   Làm đẹp: 2 courses
   Ngoại ngữ: 1 courses
```

## 🔍 Kiểm Tra Dữ Liệu

### Kiểm tra trong Database

```sql
-- Kiểm tra categories
SELECT id, name, slug, "parentId" FROM course_categories ORDER BY "createdAt";

-- Kiểm tra courses  
SELECT title, slug, price, level, status FROM courses ORDER BY "createdAt";

-- Kiểm tra courses theo category
SELECT 
  cc.name as category,
  COUNT(c.id) as course_count
FROM course_categories cc
LEFT JOIN courses c ON c."categoryId" = cc.id
WHERE cc."parentId" IS NULL
GROUP BY cc.id, cc.name
ORDER BY course_count DESC;
```

### Kiểm tra trên Frontend

1. Mở trang danh sách khóa học:
   ```
   http://localhost:3000/lms/courses
   ```

2. Kiểm tra các mục sau:
   - ✅ Sidebar hiển thị 8 categories với icons
   - ✅ Mỗi category có badge count
   - ✅ Grid hiển thị courses với thumbnail
   - ✅ Filter theo category hoạt động
   - ✅ Filter theo level hoạt động
   - ✅ Search hoạt động

## 🔧 Xử Lý Lỗi

### Lỗi: "Users not found"

**Nguyên nhân:** Chưa có user ADMIN trong database

**Giải pháp:**
```bash
cd backend
bun run check-admin-user.ts
```

Nếu không có admin, tạo admin mới hoặc update user hiện tại:
```sql
UPDATE users SET "roleType" = 'ADMIN' WHERE email = 'your-email@example.com';
```

### Lỗi: "Category not found"

**Nguyên nhân:** Chưa chạy seed categories

**Giải pháp:**
```bash
bun run scripts/seed-course-categories.ts
```

### Lỗi: "Duplicate key value violates unique constraint"

**Nguyên nhân:** Dữ liệu đã tồn tại

**Giải pháp:** Script tự động skip dữ liệu đã tồn tại, an toàn chạy lại nhiều lần.

## 🗑️ Reset Dữ Liệu (Nếu cần)

**Cảnh báo:** Lệnh này xóa TẤT CẢ dữ liệu courses và categories!

```sql
-- Xóa tất cả courses
DELETE FROM courses;

-- Xóa tất cả categories
DELETE FROM course_categories;
```

Sau đó chạy lại seed:
```bash
bun run scripts/seed-course-categories.ts
bun run scripts/seed-sample-courses.ts
```

## 📊 Dữ Liệu Thống Kê

Sau khi seed xong, bạn sẽ có:

| Loại | Số lượng |
|------|----------|
| Parent Categories | 8 |
| Sub-categories | 11 |
| Total Categories | 19 |
| Sample Courses | 15 |
| Free Courses | 2 |
| Paid Courses | 13 |

**Phân bố theo Level:**
- Beginner: 9 courses
- Intermediate: 6 courses  
- Advanced: 0 courses
- Expert: 0 courses

**Phân bố theo Price:**
- Miễn phí (0đ): 2 courses
- 1,000,000 - 2,000,000đ: 7 courses
- 2,000,000 - 3,000,000đ: 5 courses
- > 3,000,000đ: 1 course

## 🎯 Next Steps

Sau khi có dữ liệu mẫu, bạn có thể:

1. **Thêm Modules & Lessons:**
   ```bash
   bun run scripts/seed-lms-videos.ts
   ```

2. **Thêm Quizzes:**
   ```bash
   bun run scripts/seed-quizzes.ts
   ```

3. **Thêm Reviews:**
   ```bash
   bun run scripts/seed-reviews.ts
   ```

4. **Test Enrollment:**
   - Truy cập `/lms/courses/[slug]`
   - Click "Enroll Now"
   - Kiểm tra enrollment tạo thành công

5. **Test Learning:**
   - Truy cập `/lms/learn/[slug]`
   - Kiểm tra lessons hiển thị
   - Test video player, progress tracking

## 📝 Tùy Chỉnh Dữ Liệu

### Thêm Category Mới

Edit file `seed-course-categories.ts`:

```typescript
{
  name: 'Tên danh mục',
  slug: 'ten-danh-muc',
  description: 'Mô tả',
  icon: 'IconName'
}
```

### Thêm Course Mới

Edit file `seed-sample-courses.ts`:

```typescript
{
  categorySlug: 'programming',
  title: 'Tên khóa học',
  slug: 'ten-khoa-hoc',
  description: 'Mô tả chi tiết',
  thumbnail: 'https://...',
  price: 2000000,
  level: CourseLevel.INTERMEDIATE,
  duration: 600,
  whatYouWillLearn: [...],
  requirements: [...],
  targetAudience: [...],
  tags: [...]
}
```

### Update Icon Mapping

File `frontend/src/app/lms/courses/page.tsx`:

```typescript
const categoryIcons: Record<string, any> = {
  'programming': Code,
  'business': Briefcase,
  // Thêm mapping mới
  'ten-danh-muc': YourIcon,
};
```

## 🔗 Scripts Liên Quan

- `seed-course-categories.ts` - Tạo categories
- `seed-sample-courses.ts` - Tạo sample courses
- `seed-courses.ts` - Tạo courses chi tiết với modules/lessons (legacy)
- `seed-lms-videos.ts` - Thêm video lessons
- `seed-quizzes.ts` - Thêm quizzes
- `seed-reviews.ts` - Thêm reviews

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Kiểm tra database connection
3. Xem file log: `backend/logs/`
4. Check Prisma schema

---

**Cập nhật:** 3/11/2025  
**Version:** 1.0
