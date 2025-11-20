# 📚 Hướng Dẫn Quản Lý Bài Học & Quiz - LMS

## 🎯 Tổng Quan

Sau khi tạo **Module** (Chương trình học), bạn cần thêm **Lessons** (Bài học) và **Quiz** (Bài kiểm tra) vào các module đó.

---

## 📋 Bước 3: Thêm Bài Học (Lessons)

### Truy Cập
1. Dashboard → Chọn khóa học
2. Click icon **PlayCircle** (màu xanh lá) - "Quản lý Bài học"
3. URL: `/lms/instructor/courses/[id]/lessons`

### Các Loại Bài Học

#### 1. 🎥 VIDEO
- **Mục đích**: Bài giảng video
- **Cần**: Video URL (YouTube, Vimeo, hoặc link trực tiếp)
- **Thông tin**: Tiêu đề, mô tả, thời lượng
- **VD**: "Bài 1: Giới thiệu React Hooks"

#### 2. 📄 TEXT
- **Mục đích**: Tài liệu văn bản, hướng dẫn
- **Cần**: Nội dung text (hỗ trợ Markdown)
- **Thông tin**: Tiêu đề, nội dung
- **VD**: "Tài liệu: Cú pháp JSX"

#### 3. ❓ QUIZ
- **Mục đích**: Bài kiểm tra kiến thức
- **Cần**: Tạo lesson type QUIZ trước, sau đó thêm câu hỏi
- **Thông tin**: Tiêu đề, thời gian làm bài
- **VD**: "Quiz: Kiểm tra Module 1"

### Cách Thêm Lesson

#### Bước 1: Chọn Module
- Xem danh sách các module đã tạo
- Click **"Thêm bài học vào module này"**

#### Bước 2: Điền Form
```
Tiêu đề bài học *
[VD: Bài 1: Giới thiệu về React]

Mô tả (tùy chọn)
[Học cách sử dụng React hooks cơ bản]

Loại bài học *
[○ Video  ○ Text  ○ Quiz]

--- Nếu chọn VIDEO ---
Video URL *
[https://youtube.com/watch?v=abc123]

--- Nếu chọn TEXT ---
Nội dung *
[Nhập nội dung markdown hoặc HTML...]

--- Nếu chọn QUIZ ---
⚠️ Lưu ý: Sau khi tạo, vào trang Quiz để thêm câu hỏi

Thời lượng (phút)
[15]

☑ Bài học miễn phí (preview)
```

#### Bước 3: Lưu
- Click **"Thêm bài học"**
- Lesson sẽ xuất hiện trong module

### Quản Lý Lesson

#### Edit (Icon bút chì)
- Sửa tiêu đề, nội dung, URL
- Thay đổi loại lesson
- Cập nhật thời lượng

#### Delete (Icon thùng rác)
- Xóa lesson
- ⚠️ **Cảnh báo**: Nếu là QUIZ, sẽ xóa luôn câu hỏi!

---

## ❓ Bước 4: Tạo Quiz

### Workflow Tạo Quiz

#### Bước 1: Tạo Lesson Type QUIZ
1. Vào trang Quản lý Bài học
2. Chọn module
3. Chọn loại **"Quiz/Bài kiểm tra"**
4. Điền thông tin cơ bản
5. Lưu lesson

#### Bước 2: Thêm Câu Hỏi (Sắp có)
**Chức năng đang phát triển:**
- Trang quản lý Quiz riêng
- Thêm câu hỏi multiple choice
- Thêm câu hỏi true/false
- Thiết lập điểm số
- Thiết lập thời gian làm bài

### Cấu Trúc Quiz

```
Quiz: Kiểm tra Module 1
├── Câu 1: React là gì? (Multiple Choice)
│   ├── A. Library JavaScript ✓
│   ├── B. Framework Python
│   ├── C. Database
│   └── D. Operating System
│
├── Câu 2: JSX là viết tắt của? (Text Input)
│   └── Đáp án: JavaScript XML
│
└── Câu 3: React được tạo bởi? (True/False)
    └── True: Facebook ✓
```

### Quiz Settings

```yaml
title: "Quiz: Kiểm tra Module 1"
passingScore: 70  # Điểm đạt (%)
timeLimit: 30     # Thời gian (phút)
attempts: 3       # Số lần làm
questions:
  - type: MULTIPLE_CHOICE
    question: "React là gì?"
    points: 10
    answers:
      - text: "Library JavaScript"
        isCorrect: true
      - text: "Framework Python"
        isCorrect: false
```

---

## 🎨 Icons Trong Dashboard

| Icon | Màu | Chức năng |
|------|-----|-----------|
| 👁️ Eye | Xanh dương | Xem khóa học (public) |
| 📋 List | Tím | Quản lý Module |
| ▶️ PlayCircle | Xanh lá | **Quản lý Bài học** |
| ✏️ Edit | Xám | Sửa thông tin khóa học |
| 📦 Archive | Cam | Lưu trữ |

---

## ✅ Workflow Hoàn Chỉnh

### 1. Tạo Khóa Học
```
Dashboard → Tạo khóa học → Điền thông tin → Lưu
```

### 2. Thêm Module
```
Dashboard → [List icon] → Add Module → Lưu
```

### 3. Thêm Lessons
```
Dashboard → [PlayCircle icon] → Chọn module → Add Lesson
```

#### 3a. Video Lesson
```
Type: VIDEO → Video URL → Duration → Lưu
```

#### 3b. Text Lesson
```
Type: TEXT → Content → Lưu
```

#### 3c. Quiz Lesson
```
Type: QUIZ → Lưu → (Đợi trang Quiz management)
```

### 4. Publish Khóa Học
```
Dashboard → Edit → Status: PUBLISHED → Lưu
```

---

## 🔧 Backend Fixes

### Đã Fix

#### 1. Module Mutations
```typescript
// ✅ Loại bỏ @Roles(ADMIN)
@Mutation(() => CourseModule)
@UseGuards(JwtAuthGuard)  // Chỉ cần login
createModule(...)
```

#### 2. Lesson Mutations
```typescript
// ✅ Loại bỏ @Roles(ADMIN)
@Mutation(() => Lesson)
@UseGuards(JwtAuthGuard)
createLesson(...)
```

#### 3. Quiz Mutations
```typescript
// ✅ Loại bỏ @Roles(ADMIN)
@Mutation(() => Quiz)
@UseGuards(JwtAuthGuard)
createQuiz(...)
```

### Authorization
- **Resolver**: Chỉ yêu cầu login
- **Service**: Kiểm tra ownership (instructor owns course)

---

## 🐛 Troubleshooting

### Không thấy nút "Add Lesson"?
- ✅ Kiểm tra đã tạo module chưa
- ✅ Đảm bảo bạn là owner của khóa học

### Lỗi khi upload video?
- ✅ Kiểm tra URL hợp lệ
- ✅ Hỗ trợ: YouTube, Vimeo
- ✅ Format: `https://...`

### Quiz không hoạt động?
- ✅ Đợi trang quản lý Quiz (đang phát triển)
- ✅ Tạm thời chỉ tạo được lesson type QUIZ

---

## 📊 Database Schema

### Lesson
```prisma
model Lesson {
  id          String      @id @default(cuid())
  moduleId    String
  title       String
  description String?
  type        LessonType  // VIDEO, TEXT, QUIZ
  content     String?     // Video URL hoặc Text content
  duration    Int?        // Phút
  isFree      Boolean     @default(false)
  order       Int         @default(0)
  
  module      CourseModule @relation(...)
  quizzes     Quiz[]
}

enum LessonType {
  VIDEO
  TEXT
  QUIZ
}
```

### Quiz
```prisma
model Quiz {
  id           String     @id @default(cuid())
  lessonId     String
  title        String
  description  String?
  passingScore Int        @default(70)
  timeLimit    Int?       // Phút
  
  lesson       Lesson     @relation(...)
  questions    Question[]
  attempts     QuizAttempt[]
}
```

---

## 📱 Mobile Responsive

- **Mobile**: Stack layout, full width forms
- **Tablet**: Grid 2 columns
- **Desktop**: Full table view

---

## 🎓 Best Practices

### 1. Cấu Trúc Lesson
- Video ngắn (10-15 phút)
- Text rõ ràng, có ví dụ
- Quiz sau mỗi module

### 2. Thứ Tự
- Lý thuyết → Thực hành → Quiz
- Dễ → Khó
- Concept → Example → Exercise

### 3. Preview Lessons
- Đánh dấu 1-2 lessons "Miễn phí"
- Giúp học viên xem trước
- Tăng conversion

### 4. Video Tips
- Quality: 720p trở lên
- Âm thanh rõ ràng
- Có subtitle nếu được

---

## 📄 Files Đã Tạo/Sửa

### Backend
1. ✅ `backend/src/lms/courses/courses.resolver.ts` - Fix lesson mutations
2. ✅ `backend/src/lms/quizzes/quizzes.resolver.ts` - Fix quiz mutations

### Frontend
1. ✅ `frontend/src/app/lms/instructor/courses/[id]/lessons/page.tsx` - Trang quản lý lessons
2. ✅ `frontend/src/app/lms/instructor/dashboard/page.tsx` - Thêm nút Lessons
3. ✅ `frontend/src/components/lms/wizard/LessonsStep.tsx` - Component sẵn có

---

## 🚀 Tính Năng Sắp Có

### Quiz Management (Coming Soon)
- Trang quản lý Quiz riêng
- Thêm/sửa/xóa câu hỏi
- Question types:
  - Multiple Choice
  - True/False
  - Fill in the blank
  - Code challenge
- Quiz analytics
- Student attempts history

### Video Upload
- Upload video lên MinIO
- Video processing
- Adaptive streaming
- Subtitles support

### Advanced Features
- Drag & drop reorder lessons
- Bulk import lessons
- Lesson templates
- Progress tracking
- Certificate generation

---

**Cập nhật**: 30/10/2025  
**Status**: ✅ Lessons Ready | ⏳ Quiz Questions Coming Soon
