# LMS 8 Courses Complete Seed

## 📚 Tổng quan

File seed này tạo **8 khóa học đầy đủ** với nội dung chuyên nghiệp cho hệ thống LMS RauSachCore.

## 🎯 8 Khóa học

### 1. **React Fundamentals - Từ Zero Đến Hero 2025** 
- **Giá**: 499,000 VND
- **Level**: BEGINNER
- **Thời lượng**: 480 phút (8 giờ)
- **Nội dung**: React Components, Hooks, State Management, Router, API Integration
- **Module**: 1 module với 3 lessons + 1 quiz

### 2. **Node.js Backend Development - REST API & Database**
- **Giá**: 599,000 VND  
- **Level**: INTERMEDIATE
- **Thời lượng**: 540 phút (9 giờ)
- **Nội dung**: Node.js, Express, MongoDB, JWT, Security, Testing
- **Module**: 1 module với 3 lessons + 1 quiz

### 3. **Flutter - Xây Dựng App Mobile Đa Nền Tảng**
- **Giá**: 699,000 VND
- **Level**: BEGINNER  
- **Thời lượng**: 600 phút (10 giờ)
- **Nội dung**: Flutter Widgets, Dart, State Management, Firebase, Publishing
- **Module**: 1 module với 3 lessons + 1 quiz

### 4. **Python cho Data Science - Pandas, NumPy, ML**
- **Giá**: 799,000 VND
- **Level**: INTERMEDIATE
- **Thời lượng**: 720 phút (12 giờ)  
- **Nội dung**: Python, Pandas, NumPy, Visualization, Machine Learning
- **Module**: 1 module với 3 lessons + 1 quiz

### 5. **Vue.js 3 - The Complete Guide (Composition API)**
- **Giá**: 549,000 VND
- **Level**: BEGINNER
- **Thời lượng**: 480 phút (8 giờ)
- **Nội dung**: Vue 3, Composition API, Pinia, Router, TypeScript
- **Module**: 1 module với 3 lessons + 1 quiz

### 6. **Next.js 15 - Full-Stack React Framework**  
- **Giá**: 899,000 VND
- **Level**: ADVANCED
- **Thời lượng**: 720 phút (12 giờ)
- **Nội dung**: App Router, Server Components, Server Actions, Prisma, NextAuth
- **Module**: 1 module với 3 lessons + 1 quiz

### 7. **TypeScript - From Beginner to Expert**
- **Giá**: 449,000 VND
- **Level**: INTERMEDIATE  
- **Thời lượng**: 420 phút (7 giờ)
- **Nội dung**: Types, Interfaces, Generics, Advanced Types, Decorators
- **Module**: 1 module với 3 lessons + 1 quiz

### 8. **Docker & Kubernetes - DevOps Container Orchestration**
- **Giá**: 999,000 VND
- **Level**: ADVANCED
- **Thời lượng**: 840 phút (14 giờ)  
- **Nội dung**: Docker, Docker Compose, Kubernetes, Helm, CI/CD, Production
- **Module**: 1 module với 3 lessons + 1 quiz

## 🎓 Cấu trúc mỗi khóa học

Mỗi khóa học bao gồm:

### Module 1 (Intro Module)
1. **Lesson 1**: Video bài giới thiệu (FREE - có thể xem trước khi mua)
2. **Lesson 2**: Text/Document với code examples và best practices
3. **Lesson 3**: Quiz lesson (LessonType.QUIZ)

### Quiz
- **2 câu hỏi** kiểm tra kiến thức cơ bản
- **Passing score**: 70%
- **Time limit**: 10-15 phút
- **Question types**: MULTIPLE_CHOICE, TRUE_FALSE

## 👥 Users được tạo

### Instructor
- **Email**: instructor@lms.com
- **Password**: password123
- **Role**: ADMIN
- **Name**: John Instructor

### Student  
- **Email**: student@lms.com
- **Password**: password123
- **Role**: USER
- **Name**: Alice Student
- **Enrollments**: Đã đăng ký cả 8 khóa học với progress ngẫu nhiên (0-100%)

## 📂 Categories

1. **Programming** (💻) - Parent category
   - **Web Development** (🌐) - Child
   - **Mobile Development** (📱) - Child
2. **Data Science** (📊) - Standalone category

## 🚀 Cách sử dụng

### Chạy seed

```bash
# Option 1: Chạy trực tiếp
cd backend
bun run src/seed/lms-8-courses-complete.ts

# Option 2: Thêm vào package.json
npm run seed:lms-8courses
```

### Reset và seed lại

```bash
# Reset database
bun prisma migrate reset

# Seed lại
bun run src/seed/lms-8-courses-complete.ts
```

## 📊 Database Statistics

Sau khi seed:

- **Users**: 2 (1 instructor, 1 student)
- **Categories**: 4 (1 parent, 2 children, 1 standalone)
- **Courses**: 8 (tất cả PUBLISHED)  
- **Modules**: 8 (1 per course)
- **Lessons**: 24 total
  - Video lessons: 8 (1 FREE per course)
  - Text lessons: 8
  - Quiz lessons: 8
- **Quizzes**: 8 (1 per course)
- **Questions**: 8 (1-2 per quiz)
- **Answers**: ~24 (3-4 options per question)
- **Enrollments**: 8 (student enrolled in all courses)

## 🎯 Features

### Course Features
- ✅ Rich metadata (whatYouWillLearn, requirements, targetAudience)
- ✅ Professional thumbnails (Unsplash images)
- ✅ Realistic pricing (449k - 999k VND)
- ✅ Mix of difficulty levels (BEGINNER, INTERMEDIATE, ADVANCED)
- ✅ Comprehensive descriptions in Vietnamese

### Lesson Features  
- ✅ Video lessons với YouTube URLs
- ✅ Text lessons với Markdown formatting
- ✅ Code examples với syntax highlighting
- ✅ Quiz lessons linked to actual quizzes
- ✅ FREE preview lessons

### Quiz Features
- ✅ Multiple choice questions
- ✅ True/False questions
- ✅ Explanations cho mỗi câu hỏi
- ✅ Points system
- ✅ Passing score requirement
- ✅ Time limits

## 🔥 Nội dung chất lượng cao

Mỗi course đều có:

1. **Detailed Description**: Mô tả đầy đủ về khóa học
2. **Learning Outcomes**: 6-10 điều học được sau khóa học
3. **Requirements**: Kiến thức cần có trước khi học
4. **Target Audience**: Đối tượng phù hợp

Mỗi Text Lesson bao gồm:

- **Markdown formatting**: Headers, code blocks, lists
- **Code examples**: Với syntax highlighting
- **Best practices**: Tips và tricks thực tế
- **Vietnamese content**: Giải thích bằng tiếng Việt

## 🎨 UI/UX Considerations

### Thumbnails
- Sử dụng Unsplash stock images chất lượng cao
- Mỗi course có thumbnail riêng biệt
- Hình ảnh professional và relevant

### Pricing Strategy
- **Entry level**: 449k (TypeScript)
- **Standard**: 499k-699k (React, Node.js, Flutter, Vue)  
- **Premium**: 799k-899k (Python DS, Next.js)
- **Advanced**: 999k (Docker & Kubernetes)

### Progressive Disclosure
- FREE lessons để preview
- Logical lesson ordering
- Quiz at end of module

## 🛠️ Customization

### Thêm modules cho courses

```typescript
const module2 = await prisma.courseModule.create({
  data: {
    title: 'Module 2: Advanced Topics',
    description: 'Deep dive into advanced concepts',
    order: 1, // Next order
    courseId: reactCourse.id,
  },
});
```

### Thêm lessons vào module

```typescript
await prisma.lesson.create({
  data: {
    title: 'Advanced Hooks',
    type: LessonType.VIDEO,
    content: 'https://youtube.com/...',
    duration: 30,
    order: 0,
    moduleId: module2.id,
  },
});
```

### Thêm câu hỏi vào quiz

```typescript
await prisma.question.create({
  data: {
    quizId: quiz.id,
    type: QuestionType.MULTIPLE_CHOICE,
    question: 'What is useMemo used for?',
    points: 10,
    order: 2,
    explanation: 'useMemo memoizes expensive calculations',
    answers: {
      create: [
        { text: 'Memoization', isCorrect: true, order: 0 },
        { text: 'Side effects', isCorrect: false, order: 1 },
      ],
    },
  },
});
```

## 📝 Next Steps

Để mở rộng hệ thống:

1. **Thêm modules cho mỗi course** - Hiện tại mỗi course chỉ có 1 module
2. **Thêm lessons** - Tăng số lượng video/text lessons
3. **Tăng số câu hỏi quiz** - Mỗi quiz nên có 5-10 câu
4. **Thêm attachments** - PDF, source code downloads
5. **Thêm reviews & ratings** - Student feedback
6. **Thêm certificates** - Khi complete course
7. **Thêm discussions** - Forum cho mỗi lesson

## 🏆 Best Practices được áp dụng

- ✅ **Idempotent seeding**: Sử dụng `upsert` cho users/categories
- ✅ **Realistic data**: Nội dung thực tế, không phải lorem ipsum
- ✅ **Vietnamese localization**: Descriptions và explanations bằng tiếng Việt
- ✅ **Professional quality**: Code examples thực tế, best practices
- ✅ **Type safety**: Full TypeScript với Prisma types
- ✅ **Error handling**: Try-catch trong main function
- ✅ **Logging**: Console logs cho progress tracking

## 📧 Contact

Nếu cần thêm courses hoặc customize nội dung, hãy liên hệ team development.

---

**Created**: January 2025  
**Version**: 1.0.0  
**Author**: RauSachCore LMS Team
