# 🎓 Hệ Thống LMS Hoàn Chỉnh - Hướng Dẫn Tổng Hợp

## 📋 Tổng Quan

Hệ thống LMS (Learning Management System) cho phép instructor tạo và quản lý khóa học online hoàn chỉnh với Module, Lessons, và Quiz.

---

## 🎯 Workflow Tạo Khóa Học

### 1️⃣ Tạo Khóa Học
**URL**: `/lms/instructor/dashboard` → Click "Tạo khóa học"

**Thông tin cần điền**:
- Tiêu đề, mô tả
- Category, Level
- Giá, thời lượng
- Thumbnail, trailer video
- Tags, What you'll learn

**Kết quả**: Khóa học ở trạng thái DRAFT

---

### 2️⃣ Thêm Module (Chương Trình Học)
**URL**: Dashboard → Icon **📋 List** (màu tím)

**Các bước**:
1. Click icon List trên khóa học
2. Click "Add Module"
3. Điền:
   - Tiêu đề (VD: "Module 1: Giới thiệu")
   - Mô tả (tùy chọn)
4. Lưu

**Quản lý**:
- ✏️ Edit: Sửa tên, mô tả
- 🗑️ Delete: Xóa module
- ≡ Drag: Sắp xếp thứ tự

---

### 3️⃣ Thêm Bài Học (Lessons)
**URL**: Dashboard → Icon **▶️ PlayCircle** (màu xanh lá)

**3 Loại Lesson**:

#### A. 🎥 VIDEO Lesson
```yaml
Type: VIDEO
Title: "Bài 1: Giới thiệu React"
Description: "Học cơ bản về React"
Video URL: "https://youtube.com/watch?v=abc"
Duration: 15 phút
Free Preview: ☑️ (tùy chọn)
```

#### B. 📄 TEXT Lesson
```yaml
Type: TEXT
Title: "Tài liệu: Cú pháp JSX"
Content: |
  # JSX Basics
  JSX là JavaScript XML...
  
  ## Examples
  ```jsx
  const element = <h1>Hello</h1>;
  ```
Duration: 10 phút
```

#### C. ❓ QUIZ Lesson
```yaml
Type: QUIZ
Title: "Quiz: Kiểm tra Module 1"
Description: "Bài kiểm tra kiến thức"
Duration: 30 phút
Note: Sau khi tạo, vào trang Quiz để thêm câu hỏi
```

**Quản lý**:
- ✏️ Edit: Sửa thông tin
- 🗑️ Delete: Xóa lesson
- 👁️ Preview: Xem trước

---

### 4️⃣ Tạo Quiz & Câu Hỏi
**URL**: Dashboard → Icon **❓ HelpCircle** (màu vàng)

#### Bước 1: Tạo Quiz
```yaml
Quiz Title: "Quiz: Kiểm tra Module 1"
Description: "Bài kiểm tra sau khi học xong module 1"
Passing Score: 70%
Time Limit: 30 phút
```

#### Bước 2: Thêm Câu Hỏi

**Multiple Choice (Nhiều đáp án)**:
```yaml
Question: "React là gì?"
Type: MULTIPLE_CHOICE
Points: 10
Answers:
  - ✓ Library JavaScript để build UI
  - ✗ Framework Python
  - ✗ Database system
  - ✗ Operating system
Explanation: "React là thư viện JavaScript do Facebook phát triển"
```

**True/False**:
```yaml
Question: "React được tạo bởi Facebook?"
Type: TRUE_FALSE
Points: 5
Answers:
  - ✓ True
  - ✗ False
```

**Short Answer**:
```yaml
Question: "JSX là viết tắt của gì?"
Type: SHORT_ANSWER
Points: 10
Answer: "JavaScript XML"
```

**Quản lý Quiz**:
- Xem danh sách câu hỏi
- Xóa câu hỏi
- Xem điểm số, giải thích

---

### 5️⃣ Xuất Bản Khóa Học
**URL**: Dashboard → Icon **✏️ Edit**

**Điều kiện**:
- ✅ Có ít nhất 1 Module
- ✅ Có ít nhất 1 Lesson

**Thay đổi**:
```yaml
Status: DRAFT → PUBLISHED
```

**Kết quả**: Khóa học công khai, học viên có thể enroll

---

## 🎨 Icons Dashboard Giải Thích

| Icon | Màu | Chức năng | URL |
|------|-----|-----------|-----|
| 👁️ Eye | Xanh dương | Xem khóa học (public view) | `/lms/courses/[slug]` |
| 📋 List | Tím | **Quản lý Module** | `/lms/instructor/courses/[id]/manage` |
| ▶️ PlayCircle | Xanh lá | **Quản lý Bài học** | `/lms/instructor/courses/[id]/lessons` |
| ❓ HelpCircle | Vàng | **Quản lý Quiz** | `/lms/instructor/courses/[id]/quizzes` |
| ✏️ Edit | Xám | Sửa thông tin cơ bản | `/lms/instructor/courses/[id]/edit` |
| 📦 Archive | Cam | Lưu trữ khóa học | - |

---

## 📊 Cấu Trúc Khóa Học

```
Khóa Học: "Học React từ A-Z"
│
├── Module 1: Giới Thiệu
│   ├── Lesson 1.1: Video - Giới thiệu React (15 phút)
│   ├── Lesson 1.2: Text - Cài đặt môi trường (10 phút)
│   ├── Lesson 1.3: Video - Component đầu tiên (20 phút)
│   └── Lesson 1.4: Quiz - Kiểm tra Module 1 (30 phút)
│       ├── Câu 1: React là gì? (10 điểm)
│       ├── Câu 2: JSX viết tắt? (5 điểm)
│       └── Câu 3: Component là? (10 điểm)
│
├── Module 2: React Hooks
│   ├── Lesson 2.1: Video - useState Hook (25 phút)
│   ├── Lesson 2.2: Video - useEffect Hook (30 phút)
│   ├── Lesson 2.3: Text - Custom Hooks (15 phút)
│   └── Lesson 2.4: Quiz - Kiểm tra Hooks (45 phút)
│
└── Module 3: Dự Án Thực Tế
    ├── Lesson 3.1: Video - Xây dựng Todo App (60 phút)
    ├── Lesson 3.2: Text - Best Practices (20 phút)
    └── Lesson 3.3: Quiz - Final Test (60 phút)
```

---

## 🔧 Backend - Đã Fix

### Role Guards
Tất cả mutations đã loại bỏ `@Roles(ADMIN)`, chỉ yêu cầu login:

```typescript
// ✅ Module
@UseGuards(JwtAuthGuard)
createModule(...) { }

// ✅ Lesson
@UseGuards(JwtAuthGuard)
createLesson(...) { }

// ✅ Quiz
@UseGuards(JwtAuthGuard)
createQuiz(...) { }

// ✅ Question
@UseGuards(JwtAuthGuard)
createQuestion(...) { }
```

### Authorization
- **Resolver**: Chỉ cần login (JwtAuthGuard)
- **Service**: Kiểm tra ownership (instructor owns course)
- **Database**: Foreign key constraints

---

## 📱 Responsive Design

Tất cả trang đều responsive:
- **Mobile**: Stack layout, full width buttons
- **Tablet**: 2-column grid
- **Desktop**: Full table/grid view

---

## 🗂️ Files Đã Tạo

### Backend
1. ✅ `backend/src/lms/courses/courses.resolver.ts` - Fix module & lesson mutations
2. ✅ `backend/src/lms/quizzes/quizzes.resolver.ts` - Fix quiz mutations

### Frontend
1. ✅ `frontend/src/app/lms/instructor/courses/[id]/manage/page.tsx` - Quản lý Module
2. ✅ `frontend/src/app/lms/instructor/courses/[id]/lessons/page.tsx` - Quản lý Lessons
3. ✅ `frontend/src/app/lms/instructor/courses/[id]/quizzes/page.tsx` - **Quản lý Quiz**
4. ✅ `frontend/src/app/lms/instructor/dashboard/page.tsx` - Dashboard với 6 icons

### Documentation
1. ✅ `docs/LMS_MODULE_MANAGEMENT_FIX.md` - Hướng dẫn Module
2. ✅ `docs/HUONG_DAN_TAO_MODULE_LMS.md` - Chi tiết Module
3. ✅ `docs/HUONG_DAN_LESSONS_QUIZ_LMS.md` - Chi tiết Lessons & Quiz
4. ✅ `docs/LMS_COMPLETE_GUIDE.md` - **Tổng hợp toàn bộ**

---

## 🎓 Best Practices

### 1. Cấu Trúc Khóa Học
```
✅ DO:
- 3-5 modules mỗi khóa
- 5-10 lessons mỗi module
- Quiz sau mỗi module
- Video 10-20 phút
- 1-2 free preview lessons

❌ DON'T:
- Quá nhiều modules (>10)
- Video quá dài (>30 phút)
- Module không có quiz
- Tất cả lessons đều trả phí
```

### 2. Quiz Design
```
✅ DO:
- 10-20 câu hỏi mỗi quiz
- Mix question types
- Có explanation
- Passing score 70-80%
- Time limit hợp lý

❌ DON'T:
- Quá nhiều câu (>30)
- Chỉ 1 loại câu hỏi
- Không có giải thích
- Passing score quá cao (>90%)
```

### 3. Content Quality
```
✅ DO:
- Video HD (720p+)
- Audio rõ ràng
- Có subtitles
- Code examples
- Thực hành

❌ DON'T:
- Video mờ, audio tệ
- Chỉ lý thuyết
- Không có ví dụ
- Thiếu thực hành
```

---

## 🚀 Tính Năng Đầy Đủ

### ✅ Đã Có
- [x] Tạo khóa học
- [x] Quản lý Module
- [x] Quản lý Lessons (VIDEO, TEXT, QUIZ)
- [x] Quản lý Quiz với câu hỏi
- [x] Multiple Choice questions
- [x] True/False questions
- [x] Short Answer questions
- [x] Drag & drop reorder
- [x] Preview lessons
- [x] Publish course
- [x] Dynamic GraphQL
- [x] Authorization checks

### 🔜 Sắp Có
- [ ] Video upload lên MinIO
- [ ] Rich text editor cho TEXT lessons
- [ ] Image upload trong questions
- [ ] Quiz analytics & reports
- [ ] Student progress tracking
- [ ] Certificate generation
- [ ] Course reviews
- [ ] Discussion forum

---

## 🐛 Troubleshooting

### Không tạo được Module/Lesson/Quiz?
```bash
# 1. Kiểm tra backend đã restart chưa
cd backend && bun run start:dev

# 2. Kiểm tra frontend
cd frontend && bun run dev

# 3. Clear cache
Ctrl + Shift + R (hard reload)

# 4. Check console log
F12 → Console → Xem errors
```

### Lỗi 403 Forbidden?
```
✅ Đảm bảo:
- Đã login
- Role phù hợp
- Là owner của course
- Backend đã fix role guards
```

### Quiz không hiển thị?
```
✅ Kiểm tra:
- Đã tạo Lesson type QUIZ chưa?
- Đã tạo Quiz cho lesson chưa?
- Đã thêm câu hỏi chưa?
- Refresh lại trang
```

---

## 📚 Quick Reference

### API Endpoints
```graphql
# Module
mutation CreateModule($input: CreateModuleInput!) {
  createModule(input: $input) { id title }
}

# Lesson
mutation CreateLesson($input: CreateLessonInput!) {
  createLesson(input: $input) { id title type }
}

# Quiz
mutation CreateQuiz($input: CreateQuizInput!) {
  createQuiz(input: $input) { id title }
}

# Question
mutation CreateQuestion($input: CreateQuestionInput!) {
  createQuestion(input: $input) { 
    id 
    question 
    answers { id text isCorrect }
  }
}
```

### Database Models
```prisma
Course → Module → Lesson → Quiz → Question → Answer
                    ↓
                 (VIDEO, TEXT, QUIZ)
```

---

## 🎯 Kết Luận

Hệ thống LMS đã hoàn chỉnh với đầy đủ chức năng:
1. ✅ Tạo và quản lý khóa học
2. ✅ Quản lý Module (chương trình học)
3. ✅ Quản lý Lessons (video, text, quiz)
4. ✅ Tạo Quiz với câu hỏi đa dạng
5. ✅ Authorization đúng (instructor owns course)
6. ✅ UI/UX responsive, dễ sử dụng

**Bắt đầu ngay**: Vào Dashboard → Tạo khóa học → Add Module → Add Lessons → Create Quiz! 🚀

---

**Cập nhật**: 30/10/2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
