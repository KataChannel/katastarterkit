# 🤖 Tạo Khóa Học Với AI - Hướng Dẫn Nhanh

## 📋 Tổng Quan
Tính năng tạo khóa học tự động sử dụng **Google Gemini AI**. Chỉ cần mô tả, AI sẽ tạo khóa học hoàn chỉnh với modules, lessons, và quiz.

## ⚡ Bắt Đầu Nhanh

### 1. Cấu Hình (1 lần)
```bash
# Lấy API key: https://aistudio.google.com/app/apikey
# Thêm vào .env
GOOGLE_GEMINI_API_KEY=your-api-key-here
```

### 2. Sử Dụng
```
1. Vào /lms/admin/courses
2. Click "Tạo với AI" (button màu tím)
3. Nhập mô tả hoặc chọn 1 trong 4 mẫu
4. Click "Tạo Khóa Học Với AI"
5. Đợi ~60 giây
6. Tự động mở trang edit để chỉnh sửa
```

## 🎯 4 Mẫu Kỹ Năng Mềm

1. **Kỹ năng giao tiếp** - 6 modules (giao tiếp cá nhân, nhóm, thuyết trình...)
2. **Quản lý thời gian** - 6 modules (lập kế hoạch, ưu tiên, time blocking...)
3. **Tư duy phản biện** - 6 modules (logic, phân tích, ra quyết định...)
4. **Lãnh đạo nhóm** - 6 modules (leadership, team building, coaching...)

## 📝 Ví Dụ Prompt Tốt

```
Tạo khóa học "Kỹ năng giao tiếp" cho beginners.

Nội dung:
- Giao tiếp cá nhân
- Giao tiếp nhóm  
- Thuyết trình
- Email/Chat
- Xử lý xung đột

Có bài tập và quiz mỗi module.
```

## ✅ Kết Quả
- ✅ Khóa học status DRAFT
- ✅ 4-6 Modules
- ✅ 20-40 Lessons (nội dung Markdown)
- ✅ 4-6 Quizzes (10 câu/quiz)
- ✅ 40-60 Câu hỏi trắc nghiệm

## 🔧 API GraphQL

```graphql
mutation {
  generateCourseFromPrompt(
    prompt: "Mô tả khóa học..."
  ) {
    id
    title
    modules {
      lessons {
        quizzes {
          questions {
            answers {
              isCorrect
            }
          }
        }
      }
    }
  }
}
```

## 📚 Files Code

### Backend
- `backend/src/lms/courses/ai-course-generator.service.ts` - AI logic
- `backend/src/lms/courses/courses.resolver.ts` - GraphQL mutations
- `backend/src/lms/courses/courses.module.ts` - Module config

### Frontend
- `frontend/src/app/lms/admin/courses/create-with-ai/page.tsx` - UI
- `frontend/src/app/lms/admin/courses/create/page.tsx` - Button AI
- `frontend/src/app/lms/admin/courses/page.tsx` - List buttons

## 💡 Tips
1. Càng chi tiết prompt càng tốt
2. Nêu rõ số modules (4-6)
3. Đề cập đối tượng học viên
4. Sau khi tạo nên review và chỉnh sửa

---
**Ready to use!** 🚀
