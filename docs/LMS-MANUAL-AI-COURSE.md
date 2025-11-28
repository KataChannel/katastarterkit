# 🤖 TẠO KHÓA HỌC VỚI AI - HƯỚNG DẪN CHI TIẾT

## 📚 Mục lục
1. [Tổng quan AI Course Generator](#tổng-quan)
2. [Phương thức 1: AI Generate từ Topic](#ai-generate-từ-topic)
3. [Phương thức 2: AI từ Tài liệu](#ai-từ-tài-liệu)
4. [Phương thức 3: AI Analyze Media](#ai-analyze-media)
5. [Tạo Quiz tự động](#tạo-quiz-tự-động)
6. [Tips và Best Practices](#tips-và-best-practices)

---

## 🎯 Tổng quan

### AI có thể làm gì?
- ✅ Tạo outline khóa học từ chủ đề
- ✅ Tạo nội dung chi tiết cho lessons
- ✅ Phân tích tài liệu PDF, DOC, PPT
- ✅ Transcribe video/audio thành text
- ✅ Tạo quiz tự động từ nội dung
- ✅ Gợi ý cấu trúc modules hợp lý

### AI Providers
Hệ thống hỗ trợ:
- **Google Gemini** (Mặc định) - Miễn phí, hiệu quả
- **OpenAI GPT-4** - Chất lượng cao
- **Claude** (Coming soon)

### Điều kiện
- ✅ Có API key (Admin cấu hình)
- ✅ Vai trò: Instructor hoặc Admin
- ✅ Internet connection

---

## 🚀 Phương thức 1: AI Generate từ Topic

### Khi nào dùng?
- Bạn có ý tưởng chủ đề rõ ràng
- Muốn tạo khóa học từ đầu
- Chưa có tài liệu sẵn

### Quy trình

#### Bước 1: Truy cập
**Đường dẫn**: 
- Instructor: `/lms/instructor/courses/create-ai-generate`
- Admin: `/lms/admin/courses/create-ai-generate`

#### Bước 2: Nhập thông tin khóa học

**2.1. Course Information**
```
Tiêu đề: "Lập trình Python cho người mới bắt đầu"
Mô tả ngắn: "Học Python từ cơ bản đến nâng cao"
```

**2.2. Target Audience**
```
Đối tượng: 
- Người chưa biết lập trình
- Muốn chuyển ngành
- Sinh viên IT
```

**2.3. Learning Goals**
```
Mục tiêu học:
- Nắm vững syntax Python
- Viết được chương trình cơ bản
- Hiểu OOP trong Python
```

#### Bước 3: Cấu hình AI

**3.1. Course Structure**
- **Số modules**: 5-10 (khuyến nghị 6-8)
- **Số lessons/module**: 3-8 (khuyến nghị 5)
- **Cấp độ**: Beginner/Intermediate/Advanced

**3.2. Content Preferences**
- **Độ dài lesson**: Short (5-10 min) / Medium (10-20 min) / Long (20-30 min)
- **Style**: Academic / Practical / Conversational
- **Include examples**: Yes/No
- **Include exercises**: Yes/No

**3.3. Language**
- Ngôn ngữ nội dung: Vietnamese / English

#### Bước 4: Generate

1. Click **"Generate Course with AI"**
2. Chờ AI xử lý (30 giây - 2 phút)
3. Progress bar hiển thị:
   - ⏳ Generating outline...
   - ⏳ Creating modules...
   - ⏳ Writing lesson content...
   - ⏳ Creating quizzes...
   - ✅ Done!

#### Bước 5: Review và Edit

**5.1. Course Outline**
AI tạo cấu trúc:
```
Module 1: Giới thiệu Python
├── Lesson 1.1: Python là gì?
├── Lesson 1.2: Cài đặt môi trường
├── Lesson 1.3: Hello World
└── Quiz 1: Kiểm tra Module 1

Module 2: Biến và kiểu dữ liệu
├── Lesson 2.1: Biến trong Python
├── Lesson 2.2: Kiểu dữ liệu cơ bản
...
```

**5.2. Chỉnh sửa**
- ✏️ **Edit title**: Click để đổi tên
- 🔄 **Reorder**: Drag & drop để sắp xếp
- ➕ **Add**: Thêm lesson mới
- ➖ **Remove**: Xóa lesson không cần
- 🔄 **Regenerate**: Tạo lại nội dung lesson

**5.3. Lesson Content Preview**
Click vào lesson để xem nội dung AI đã tạo:
- Text content với formatting
- Code examples
- Exercises
- Summary

#### Bước 6: Customize

**6.1. Thêm video**
- AI tạo text script
- Bạn có thể:
  - Record video theo script
  - Upload video có sẵn
  - Giữ text lesson

**6.2. Thêm tài liệu**
- Upload slides
- Add PDF, DOC
- Link tài liệu tham khảo

**6.3. Customize Quiz**
- Edit câu hỏi AI tạo
- Thêm câu hỏi mới
- Điều chỉnh độ khó

#### Bước 7: Finalize

1. Click **"Review Course"**
2. Check tổng thể:
   - ✅ Outline hợp lý
   - ✅ Nội dung đầy đủ
   - ✅ Quiz phù hợp
3. Chọn action:
   - **Save as Draft**: Lưu nháp, chỉnh sửa sau
   - **Publish**: Xuất bản (cần approval nếu là Instructor)

---

## 📄 Phương thức 2: AI từ Tài liệu

### Khi nào dùng?
- Bạn có sẵn PDF, DOC, PPT
- Muốn chuyển đổi tài liệu thành khóa học
- Có content nhưng chưa cấu trúc

### Supported Files
- **PDF**: Sách, slides, notes
- **DOCX**: Documents, handouts
- **PPTX**: Presentations
- **TXT**: Plain text notes
- **MD**: Markdown files

### Quy trình

#### Bước 1: Truy cập
**Đường dẫn**:
- Instructor: `/lms/instructor/courses/create-from-documents`
- Admin: `/lms/admin/courses/create-from-documents`

#### Bước 2: Upload Documents

**2.1. Chọn từ thư viện**
- Browse source documents đã upload
- Select multiple files
- Click **"Use Selected"**

**2.2. Upload mới**
1. Click **"Upload New"**
2. Drag & drop files hoặc browse
3. Hỗ trợ upload nhiều files cùng lúc
4. Max size: 50MB/file

**2.3. Organize documents**
- Sắp xếp thứ tự files
- Files sẽ được xử lý theo thứ tự này
- Document đầu → Module đầu

#### Bước 3: Configure AI Processing

**3.1. Analysis Options**
- **Extract structure**: Tự động phát hiện chapters/sections
- **Create modules from**: 
  - Each document = 1 module
  - Each chapter = 1 module (nếu PDF có bookmarks)
  - Auto-detect structure

**3.2. Content Extraction**
- **Extract text**: Full text
- **Extract images**: Diagrams, charts
- **Extract code**: Code snippets
- **Extract tables**: Data tables

**3.3. Language Detection**
- Auto-detect document language
- Hoặc chọn manual: Vietnamese/English

#### Bước 4: AI Analysis

Click **"Analyze Documents"**

**Processing steps**:
1. ⏳ Extracting text from PDFs...
2. ⏳ Analyzing structure...
3. ⏳ Identifying main topics...
4. ⏳ Creating outline...
5. ⏳ Generating lessons...
6. ⏳ Creating summaries...
7. ✅ Done!

#### Bước 5: Review AI Output

**5.1. Course Structure**
AI gợi ý:
```
Tiêu đề: [Auto-detected từ document title]
Mô tả: [Auto-generated summary]

Modules detected:
- Module 1: [Chapter 1 title]
- Module 2: [Chapter 2 title]
...
```

**5.2. Content Mapping**
- Xem AI đã map nội dung như thế nào
- Each section → 1 lesson
- Key points → Quiz questions

**5.3. Edit Structure**
- Merge modules
- Split long lessons
- Rename titles
- Reorder

#### Bước 6: Enhance Content

**6.1. Add Context**
AI đã extract text, bạn có thể:
- Thêm giới thiệu
- Thêm ví dụ thực tế
- Thêm exercise
- Thêm video giải thích

**6.2. Quiz Generation**
- AI tự động tạo quiz từ content
- Review và adjust
- Add more questions

#### Bước 7: Finalize
- Review full course
- Save draft hoặc Publish

---

## 🎥 Phương thức 3: AI Analyze Media

### Khi nào dùng?
- Bạn có video lectures dài
- Có audio recordings (podcast, webinar)
- Muốn transcribe thành text lessons

### Supported Formats
- **Video**: MP4, MOV, AVI, YouTube URL
- **Audio**: MP3, WAV, M4A

### Quy trình

#### Bước 1: Truy cập
**Đường dẫn**:
- Instructor: `/lms/instructor/courses/create-ai-analyze`
- Admin: `/lms/admin/courses/create-ai-analyze`

#### Bước 2: Upload Media

**2.1. Local File**
- Upload từ máy tính
- Max size: 500MB
- Hoặc link YouTube/Vimeo

**2.2. Multiple Videos**
- Upload nhiều videos
- Each video → 1 lesson hoặc 1 module

#### Bước 3: AI Processing

**3.1. Transcription**
- AI chuyển speech → text
- Support Vietnamese & English
- Auto-detect language

**3.2. Content Analysis**
- Identify main topics
- Detect chapter breaks
- Extract key points
- Generate timeline

**3.3. Generate Structure**
- Split long video thành chunks
- Create lesson titles
- Generate summaries

#### Bước 4: Review Transcript

**4.1. Edit Transcript**
- AI transcript có thể có lỗi
- Edit để sửa lỗi
- Add punctuation

**4.2. Add Timestamps**
- Mark important sections
- Create chapters
- Link to video position

#### Bước 5: Create Lessons

**Options**:
1. **Keep as video lesson**: Giữ video + transcript
2. **Convert to text lesson**: Chỉ lấy text, bỏ video
3. **Hybrid**: Video + text dưới dạng notes

#### Bước 6: Generate Quizzes
- AI tạo quiz từ transcript
- Questions về key concepts
- Review và adjust

---

## ✅ Tạo Quiz tự động

### AI Quiz Generator

#### Từ Lesson Content
1. Vào lesson bất kỳ
2. Click **"Generate Quiz from Content"**
3. AI phân tích lesson text
4. Tạo 5-10 câu hỏi

#### Từ Module
1. Vào module
2. Click **"Generate Module Quiz"**
3. AI lấy content từ tất cả lessons trong module
4. Tạo comprehensive quiz

#### Config Quiz Generation
```yaml
Number of questions: 5-20
Difficulty: Easy / Medium / Hard / Mixed
Question types:
  - Multiple choice (default)
  - True/False
  - Fill in blank (if enabled)
Include:
  - Code questions (for programming courses)
  - Scenario-based questions
  - Definition questions
```

### Review Generated Quiz

#### Check câu hỏi
- ✅ Đúng nội dung lesson
- ✅ Đáp án đúng
- ✅ Distractor hợp lý (đáp án sai)
- ✅ Explanation rõ ràng

#### Edit nếu cần
- Paraphrase câu hỏi
- Adjust đáp án
- Add thêm distractor
- Improve explanation

---

## 💡 Tips và Best Practices

### Khi dùng AI Generate

#### ✅ DO
- **Specific prompts**: Càng cụ thể càng tốt
  - ❌ "Tạo khóa học Python"
  - ✅ "Tạo khóa học Python cho người mới, tập trung vào web development với Flask"

- **Review carefully**: AI không hoàn hảo 100%
  - Check facts
  - Check code examples work
  - Verify information accuracy

- **Add personal touch**: 
  - Thêm kinh nghiệm cá nhân
  - Thêm ví dụ thực tế từ công việc
  - Thêm tips từ bạn

- **Test content**:
  - Đọc qua như học viên
  - Check logic flow
  - Test code examples

#### ❌ DON'T
- **Publish trực tiếp**: Luôn review trước
- **Copy 100% AI**: Thêm cá nhân hóa
- **Skip quiz review**: AI quiz có thể sai
- **Ignore structure**: Adjust outline cho hợp lý

### Khi dùng Document Analysis

#### ✅ DO
- **Clean documents**: 
  - Remove watermarks
  - Good quality scan
  - Clear text

- **Logical structure**:
  - Use headings (H1, H2, H3)
  - Use bookmarks trong PDF
  - Clear chapter breaks

- **Combine multiple sources**:
  - PDF + slides + notes
  - Rich content

#### ❌ DON'T
- **Low quality scans**: AI không đọc được
- **Too many files at once**: < 10 files
- **Copyrighted content**: Đảm bảo bạn có quyền

### Khi dùng Media Analysis

#### ✅ DO
- **Clear audio**: 
  - Good microphone
  - Low background noise
  - Clear speech

- **Segment long videos**:
  - Split 2-hour lecture thành chunks
  - Easier to process

- **Add manual timestamps**:
  - Help AI split better
  - Mark important parts

#### ❌ DON'T
- **Poor audio quality**: AI transcript sẽ tệ
- **Multiple speakers overlap**: Khó transcribe
- **Too fast speaking**: AI miss words

---

## 🔧 Troubleshooting

### AI không generate được

**Nguyên nhân**:
- ❌ Hết API credits
- ❌ Network timeout
- ❌ API key invalid
- ❌ Rate limit exceeded

**Giải pháp**:
1. Check API key settings
2. Try again sau vài phút
3. Reduce content size
4. Contact Admin

### AI generate nội dung sai

**Nguyên nhân**:
- Prompt không rõ ràng
- AI "hallucinate" (bịa ra)
- Thiếu context

**Giải pháp**:
1. Review và fact-check
2. Edit manually
3. Regenerate với prompt tốt hơn
4. Add more context

### Document analysis thất bại

**Nguyên nhân**:
- File corrupt
- Format không support
- File quá lớn
- OCR quality poor

**Giải pháp**:
1. Try different file format
2. Compress file size
3. Improve scan quality
4. Convert to PDF

---

## 📊 So sánh các phương thức

| Phương thức | Thời gian | Độ chính xác | Độ khó | Phù hợp khi |
|-------------|-----------|--------------|--------|-------------|
| **AI Generate** | Nhanh (2-5 min) | 70-80% | Dễ | Bạn có ý tưởng rõ |
| **From Documents** | Trung bình (5-15 min) | 80-90% | Trung bình | Có tài liệu sẵn |
| **Media Analysis** | Lâu (10-30 min) | 60-70% | Khó | Có video/audio dài |
| **Manual** | Lâu nhất | 100% | Dễ | Muốn control hoàn toàn |

---

## ❓ FAQ

**Q: AI có tạo được video không?**
A: Không. AI chỉ tạo text content và quiz. Video phải tự record hoặc upload.

**Q: Tôi có thể edit nội dung AI tạo không?**
A: Có. Full quyền edit, thêm, xóa nội dung.

**Q: AI có hiểu tiếng Việt không?**
A: Có. Support cả tiếng Việt và tiếng Anh.

**Q: Chi phí AI bao nhiêu?**
A: Tùy platform. Admin cấu hình API. Có thể miễn phí (Gemini) hoặc trả phí (GPT-4).

**Q: AI có thay thế giảng viên không?**
A: Không. AI chỉ là công cụ hỗ trợ. Giảng viên cần review và cá nhân hóa.

---

**🔗 Liên kết hữu ích**:
- [Trang chủ LMS](../LMS-MANUAL-INDEX.md)
- [Hướng dẫn Instructor](./LMS-MANUAL-INSTRUCTOR.md)
- [Source Documents Guide](./LMS-MANUAL-SOURCE-DOCS.md)

**Cập nhật**: 28/11/2025
