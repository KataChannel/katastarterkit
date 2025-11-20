# Tính Năng Tạo Khóa Học Nhanh Với AI

## ✨ Tổng Quan

Đã thêm tính năng **Tạo Khóa Học Tự Động** sử dụng **Google Gemini AI** vào hệ thống LMS. Người dùng chỉ cần nhập mô tả khóa học, AI sẽ tự động tạo:

- Cấu trúc khóa học chi tiết
- 4-6 modules với nội dung
- 4-7 lessons mỗi module
- Quiz kiểm tra cuối mỗi module (5-10 câu hỏi)
- Nội dung bài học dạng Markdown

## 🎯 Files Đã Tạo/Cập Nhật

### Backend

1. **`backend/src/lms/courses/ai-course-generator.service.ts`** ✨ MỚI
   - Service xử lý AI generation với Google Gemini
   - Tạo cấu trúc khóa học từ prompt
   - Lưu vào database với modules, lessons, quizzes
   - 4 mẫu prompt về kỹ năng mềm

2. **`backend/src/lms/courses/courses.resolver.ts`** 🔄 CẬP NHẬT
   - Thêm mutation `generateCourseFromPrompt`
   - Thêm query `sampleCoursePrompts`
   - Thêm query `coursePromptTemplates`

3. **`backend/src/lms/courses/courses.module.ts`** 🔄 CẬP NHẬT
   - Import và provide `AICourseGeneratorService`

### Frontend

4. **`frontend/src/app/lms/admin/courses/create-with-ai/page.tsx`** ✨ MỚI
   - Giao diện tạo khóa học với AI
   - Responsive + Mobile First
   - Hiển thị 4 mẫu prompt kỹ năng mềm
   - Loading state khi AI đang xử lý

5. **`frontend/src/app/lms/admin/courses/create/page.tsx`** 🔄 CẬP NHẬT
   - Thêm button "Tạo Với AI" ở header

6. **`frontend/src/app/lms/admin/courses/page.tsx`** 🔄 CẬP NHẬT
   - Header có 2 buttons: "Tạo thủ công" và "Tạo với AI"

7. **`frontend/.env`** 🔄 CẬP NHẬT
   - Thêm biến `GOOGLE_GEMINI_API_KEY`

## 📚 4 Khóa Học Mẫu Về Kỹ Năng Mềm

### 1. Kỹ Năng Giao Tiếp Hiệu Quả
- 6 modules: Cơ bản, 1-1, Nhóm, Thuyết trình, Email, Xử lý xung đột
- Mỗi module: 4-7 lessons + quiz

### 2. Quản Lý Thời Gian và Năng Suất
- 6 modules: Nhận thức, Lập kế hoạch, Ưu tiên, Time blocking, Loại bỏ phân tâm, Công cụ
- Bao gồm templates và exercises

### 3. Tư Duy Phản Biện và Giải Quyết Vấn Đề
- 6 modules: Logic, Phân tích, Sáng tạo, Ra quyết định, Tư duy phản biện, Thực hành
- Có case studies và quiz tình huống

### 4. Lãnh Đạo và Làm Việc Nhóm
- 6 modules: Leadership, Team building, Giao việc, Động viên, Xung đột, Thay đổi
- Role-play scenarios và action plans

## 🚀 Cách Sử Dụng

### 1. Cấu Hình API Key

```bash
# Lấy API key từ Google AI Studio
# https://aistudio.google.com/app/apikey

# Thêm vào file .env
GOOGLE_GEMINI_API_KEY=your-api-key-here
```

### 2. Truy Cập Tính Năng

```
/lms/admin/courses
→ Click "Tạo với AI"
→ Nhập mô tả hoặc chọn mẫu
→ Click "Tạo Khóa Học Với AI"
→ Đợi 30-60 giây
→ Tự động chuyển sang trang edit
```

### 3. GraphQL Queries/Mutations

```graphql
# Tạo khóa học từ prompt
mutation {
  generateCourseFromPrompt(
    prompt: "Tạo khóa học về Kỹ năng giao tiếp..."
    categoryId: "category-id-optional"
  ) {
    id
    title
    modules {
      id
      title
      lessons {
        id
        title
        quizzes {
          id
          title
          questions {
            id
            question
            answers {
              text
              isCorrect
            }
          }
        }
      }
    }
  }
}

# Lấy gợi ý prompt
query {
  sampleCoursePrompts
  coursePromptTemplates
}
```

## 🎨 Giao Diện

### Trang Create With AI
- **Header**: Title + Back button
- **Main Area**: 
  - Textarea nhập prompt (lớn, focus state)
  - Select category (optional)
  - Button "Tạo Khóa Học Với AI" (gradient purple-blue)
  - Loading indicator khi đang xử lý
- **Gợi Ý Nhanh**: 4 prompts click để copy
- **Sidebar**: 4 template chi tiết với tags

### Màu Sắc
- Primary: Purple (#9333EA) - Blue (#2563EB)
- Success: Green
- Warning: Amber/Yellow
- Error: Red

## ⚙️ Cấu Trúc Dữ Liệu AI Trả Về

```json
{
  "title": "Tên khóa học",
  "description": "Mô tả (500-1000 ký tự)",
  "level": "BEGINNER|INTERMEDIATE|ADVANCED",
  "duration": 180,
  "price": 0,
  "whatYouWillLearn": ["..."],
  "requirements": ["..."],
  "targetAudience": ["..."],
  "tags": ["..."],
  "modules": [
    {
      "title": "Module 1",
      "description": "...",
      "order": 0,
      "lessons": [
        {
          "title": "Lesson 1",
          "type": "VIDEO|TEXT|DOCUMENT",
          "content": "Markdown content",
          "duration": 15,
          "order": 0
        }
      ],
      "quiz": {
        "title": "Kiểm tra",
        "passingScore": 70,
        "timeLimit": 20,
        "questions": [
          {
            "type": "MULTIPLE_CHOICE",
            "question": "...",
            "points": 10,
            "answers": [
              { "text": "A", "isCorrect": false },
              { "text": "B", "isCorrect": true },
              { "text": "C", "isCorrect": false },
              { "text": "D", "isCorrect": false }
            ]
          }
        ]
      }
    }
  ]
}
```

## 🔧 Technical Details

### AI Model
- **Google Gemini Pro** (`gemini-pro`)
- Timeout: 60 seconds
- Temperature: 0.7 (creative but consistent)
- Response format: JSON

### Error Handling
- Kiểm tra API key có tồn tại
- Parse JSON response an toàn
- Validate course structure
- Hiển thị lỗi user-friendly

### Performance
- AI generation: 30-60 giây
- Database creation: 2-5 giây
- Total: ~1 phút

## 📊 Kết Quả

Sau khi tạo thành công:
- ✅ Course với status DRAFT
- ✅ 4-6 Modules (order 0-5)
- ✅ 20-40 Lessons (order trong module)
- ✅ 4-6 Quizzes (gắn vào lesson cuối module)
- ✅ 20-60 Questions (10 points mỗi câu)
- ✅ 80-240 Answers (4 đáp án mỗi câu)

## 🎓 Best Practices

### Viết Prompt Tốt:
1. Nêu rõ đối tượng (beginners, intermediate, advanced)
2. Liệt kê chủ đề cụ thể
3. Mô tả mục tiêu học tập
4. Đề cập số modules (4-6)
5. Yêu cầu bài tập/quiz

### Ví Dụ Prompt Tốt:
```
Tạo khóa học "Kỹ năng giao tiếp hiệu quả" cho người mới bắt đầu.

Bao gồm:
- Module 1: Cơ bản về giao tiếp
- Module 2: Giao tiếp 1-1
- Module 3: Giao tiếp nhóm
- Module 4: Thuyết trình
- Module 5: Email/Chat
- Module 6: Xử lý xung đột

Mỗi module có bài tập thực hành và quiz.
```

## 🔒 Quyền Hạn

- User đăng nhập có thể tạo khóa học
- Course được gán cho user hiện tại làm instructor
- Status mặc định: DRAFT (cần publish thủ công)

## ✅ Hoàn Thành

- [x] Backend Service với Google Gemini
- [x] GraphQL Resolver + Mutations
- [x] Frontend UI responsive
- [x] 4 mẫu prompt kỹ năng mềm
- [x] Sample prompts API
- [x] Templates API  
- [x] Loading states
- [x] Error handling
- [x] Auto-redirect sau khi tạo
- [x] Documentation

---

**Phát triển bởi**: KataCore Team  
**Ngày hoàn thành**: 2025-11-04  
**Version**: 1.0.0
