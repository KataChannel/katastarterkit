# 📊 Hướng Dẫn Theo Dõi AI Course Generation

## 🎯 Làm Sao Để Biết Đang Tạo Và Khi Nào Hoàn Thành?

### 1. 🖥️ Theo Dõi Backend Terminal

Khi chạy `generateCourseFromPrompt`, backend sẽ log chi tiết từng bước:

```bash
cd /mnt/chikiet/kataoffical/shoprausach/backend
npm run start:dev

# Hoặc xem log realtime
tail -f /tmp/backend.log
```

### 2. 📝 Log Messages Chi Tiết

#### A. Khi Bắt Đầu
```
🤖 [AI Course Generator] Starting...
📝 Prompt: Tạo khóa học về Kỹ năng giao tiếp...
👤 Instructor ID: abc-123-xyz
📁 Category ID: cat-456 (hoặc None)
```

#### B. Step 1: Gọi AI (30-60 giây)
```
⏳ Step 1/3: Calling Google Gemini AI...
   🔄 Sending request to Gemini API...
   📥 Received response from Gemini
   📏 Response length: 12543 characters
   🔍 Parsing JSON response...
   ✅ JSON parsed successfully
   📚 Title: Kỹ Năng Giao Tiếp Hiệu Quả
   📦 Modules: 6

✅ AI Response received in 45.23s
📚 Generated: 6 modules
```

#### C. Step 2: Lưu Database (2-5 giây)
```
⏳ Step 2/3: Creating course in database...
   🔄 Generating unique slug...
   ✅ Slug: ky-nang-giao-tiep-hieu-qua
   🔄 Creating course with modules and lessons...
   ✅ Course created with 6 modules
   🔄 Creating quizzes for modules...
   ✓ Quiz 1/6 created for module: Cơ Bản Về Giao Tiếp
   ✓ Quiz 2/6 created for module: Giao Tiếp 1-1
   ✓ Quiz 3/6 created for module: Giao Tiếp Nhóm
   ✓ Quiz 4/6 created for module: Thuyết Trình
   ✓ Quiz 5/6 created for module: Email và Chat
   ✓ Quiz 6/6 created for module: Xử Lý Xung Đột
   ✅ Created 6 quizzes
   🔄 Fetching complete course data...

✅ Course created in 3.45s
📖 Course ID: abc-xyz-123
📖 Course Title: Kỹ Năng Giao Tiếp Hiệu Quả
```

#### D. Hoàn Thành
```
🎉 Course generation completed!
⏱️  Total time: 48.68s
📊 Stats:
   - Modules: 6
   - Lessons: 36
   - Quizzes: 6
✨ Ready for editing at: /lms/admin/courses/abc-xyz-123/edit
```

### 3. 🌐 Frontend UI Indicators

#### Loading State
```tsx
{loading && (
  <div className="p-4 bg-blue-50">
    <Loader2 className="animate-spin" />
    <p>AI đang xử lý...</p>
    <p>Tạo cấu trúc khóa học, modules, lessons và quiz.</p>
    <p>Quá trình này có thể mất 30-60 giây.</p>
  </div>
)}
```

#### Success Redirect
Sau khi hoàn thành:
- Toast notification: "Đã tạo khóa học với X modules"
- Auto-redirect: `/lms/admin/courses/{courseId}/edit`

### 4. ⏱️ Thời Gian Ước Tính

| Bước | Thời gian | Mô tả |
|------|-----------|-------|
| **Step 1: AI** | 30-60s | Google Gemini tạo cấu trúc JSON |
| **Step 2: DB** | 2-5s | Lưu course, modules, lessons, quizzes |
| **Step 3: Fetch** | <1s | Lấy dữ liệu đầy đủ |
| **TOTAL** | 35-65s | Tổng thời gian |

### 5. ❌ Xử Lý Lỗi

#### Lỗi AI Generation
```
❌ AI Generation Error: Rate limit exceeded
   Error details: {...}
```

**Nguyên nhân:**
- API key không hợp lệ
- Vượt quá quota
- Network timeout

**Giải pháp:**
- Kiểm tra API key
- Đợi 1 phút và thử lại
- Kiểm tra quota tại: https://aistudio.google.com

#### Lỗi Database
```
❌ Error creating course: Unique constraint violation
```

**Nguyên nhân:**
- Slug đã tồn tại (hiếm)
- Database connection issue

**Giải pháp:**
- Thử lại (slug sẽ tự động tăng counter)
- Kiểm tra database connection

### 6. 🔍 Debug Commands

#### Xem Backend Log Realtime
```bash
# Terminal 1: Run backend
cd backend
npm run start:dev

# Terminal 2: Watch logs
tail -f /tmp/backend.log | grep "AI Course"
```

#### Test GraphQL Trực Tiếp
```bash
# GraphQL Playground: http://localhost:13001/graphql

mutation {
  generateCourseFromPrompt(
    prompt: "Tạo khóa học test ngắn"
  ) {
    id
    title
  }
}
```

#### Kiểm Tra Database
```bash
cd backend
npx prisma studio

# Mở browser: http://localhost:5555
# Xem table: Course, CourseModule, Lesson, Quiz
```

### 7. 📊 Monitoring Checklist

- [ ] Backend đang chạy (port 13001)
- [ ] API key đã set trong `.env`
- [ ] Terminal hiển thị logs
- [ ] Frontend loading spinner hiển thị
- [ ] Sau 30-60s thấy "🎉 Course generation completed!"
- [ ] Auto-redirect sang trang edit
- [ ] Có thể xem khóa học trong admin

### 8. 💡 Tips

**Để biết nhanh nhất:**
1. Mở terminal backend
2. Click "Tạo với AI" trên frontend
3. Xem logs xuất hiện ngay lập tức
4. Đợi message "🎉 Course generation completed!"

**Nếu không thấy logs:**
- Backend chưa chạy hoặc crashed
- Check: `lsof -i:13001` (phải có process)
- Restart: `npm run start:dev`

**Nếu quá 2 phút vẫn chưa xong:**
- Có thể AI bị timeout
- Check logs xem bị stuck ở đâu
- Ctrl+C và thử lại

---

## 🎯 TL;DR - Quick Check

```bash
# 1. Check backend running
lsof -i:13001

# 2. Watch logs realtime
tail -f /tmp/backend.log

# 3. Trigger from frontend
# → Click "Tạo với AI"

# 4. Watch for completion message
# 🎉 Course generation completed!

# 5. Verify in database
npx prisma studio
```

**Expected flow:** Frontend click → Backend logs → 30-60s → Completion → Redirect

---
**Ready to track!** 🚀
