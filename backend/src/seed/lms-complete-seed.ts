import { PrismaClient, CourseLevel, CourseStatus, UserRoleType, LessonType, QuestionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting COMPLETE LMS seeding with Quiz...');

  // 1. Create instructor
  console.log('👨‍🏫 Creating instructor...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@lms.com' },
    update: {},
    create: {
      email: 'instructor@lms.com',
      username: 'instructor_demo',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Instructor',
      roleType: UserRoleType.ADMIN,
      isActive: true,
      isVerified: true,
    },
  });

  console.log(`✅ Created instructor: ${instructor.username}`);

  // 2. Create categories
  console.log('📚 Creating categories...');

  const programmingCategory = await prisma.courseCategory.upsert({
    where: { slug: 'programming' },
    update: {},
    create: {
      name: 'Programming',
      slug: 'programming',
      description: 'Learn programming languages',
      icon: '💻',
    },
  });

  const webDevCategory = await prisma.courseCategory.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Master web technologies',
      parentId: programmingCategory.id,
      icon: '🌐',
    },
  });

  console.log(`✅ Created categories`);

  // 3. COURSE 1: React Fundamentals (Complete with Quiz)
  console.log('🎯 Creating Course 1: React Fundamentals...');

  const reactCourse = await prisma.course.upsert({
    where: { slug: 'react-fundamentals-2025' },
    update: {},
    create: {
      title: 'React Fundamentals - Từ Zero Đến Hero',
      slug: 'react-fundamentals-2025',
      description: 'Khóa học React toàn diện từ cơ bản đến nâng cao. Học cách xây dựng ứng dụng web hiện đại với React hooks, state management, và best practices.',
      thumbnail: 'https://placehold.co/800x450/3b82f6/ffffff?text=React+Fundamentals',
      trailer: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
      price: 499000,
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      duration: 480,
      instructorId: instructor.id,
      categoryId: webDevCategory.id,
      metaTitle: 'Học React 2025 - Khóa học React đầy đủ nhất',
      metaDescription: 'Khóa học React từ cơ bản đến nâng cao với dự án thực tế',
      tags: ['react', 'javascript', 'frontend', 'web-development'],
      whatYouWillLearn: [
        'Hiểu rõ về React components, props, và state',
        'Làm chủ React Hooks (useState, useEffect, useContext...)',
        'Xây dựng ứng dụng Single Page Application (SPA)',
        'Quản lý state với Context API và Redux',
        'Làm việc với React Router cho navigation',
        'Tối ưu performance với React.memo và useMemo',
        'Testing với Jest và React Testing Library',
        'Deploy ứng dụng React lên production',
      ],
      requirements: [
        'Kiến thức JavaScript ES6+ cơ bản',
        'HTML và CSS',
        'Node.js và npm đã cài đặt',
        'Code editor (VS Code khuyến nghị)',
      ],
      targetAudience: [
        'Người mới bắt đầu học React',
        'Developer muốn nâng cao kỹ năng frontend',
        'Học sinh, sinh viên IT',
        'Freelancer muốn mở rộng skillset',
      ],
    },
  });

  // Module 1: Giới thiệu React
  const reactModule1 = await prisma.courseModule.create({
    data: {
      title: 'Module 1: Giới Thiệu React',
      description: 'Tìm hiểu React là gì, tại sao nên học React, và chuẩn bị môi trường phát triển',
      order: 0,
      courseId: reactCourse.id,
    },
  });

  const reactLesson1_1 = await prisma.lesson.create({
    data: {
      title: 'Bài 1: React là gì? Tại sao nên học React?',
      description: 'Giới thiệu về React, lịch sử phát triển, và lý do React trở nên phổ biến',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
      duration: 15,
      order: 0,
      isFree: true,
      moduleId: reactModule1.id,
    },
  });

  const reactLesson1_2 = await prisma.lesson.create({
    data: {
      title: 'Bài 2: Cài đặt môi trường phát triển',
      description: 'Hướng dẫn cài đặt Node.js, npm, và create-react-app',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
      duration: 20,
      order: 1,
      isFree: true,
      moduleId: reactModule1.id,
    },
  });

  const reactLesson1_3 = await prisma.lesson.create({
    data: {
      title: 'Bài 3: Tạo ứng dụng React đầu tiên',
      description: 'Tạo project React đầu tiên với create-react-app và hiểu cấu trúc thư mục',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
      duration: 25,
      order: 2,
      moduleId: reactModule1.id,
    },
  });

  const reactLesson1_4 = await prisma.lesson.create({
    data: {
      title: 'Tài liệu: JSX Syntax',
      description: 'Hướng dẫn chi tiết về cú pháp JSX trong React',
      type: LessonType.TEXT,
      content: `# JSX - JavaScript XML

## JSX là gì?

JSX là một phần mở rộng cú pháp cho JavaScript, cho phép bạn viết HTML-like code trong JavaScript.

## Ví dụ cơ bản

\`\`\`jsx
const element = <h1>Hello, World!</h1>;
\`\`\`

## Nhúng biểu thức

\`\`\`jsx
const name = 'John';
const element = <h1>Hello, {name}!</h1>;
\`\`\`

## Attributes

\`\`\`jsx
const element = <img src={user.avatarUrl} alt={user.name} />;
\`\`\`

## Children

\`\`\`jsx
const element = (
  <div>
    <h1>Welcome</h1>
    <p>This is JSX</p>
  </div>
);
\`\`\``,
      duration: 10,
      order: 3,
      moduleId: reactModule1.id,
    },
  });

  const reactLesson1_5 = await prisma.lesson.create({
    data: {
      title: 'Quiz: Kiểm tra Module 1',
      description: 'Bài kiểm tra kiến thức về React cơ bản',
      type: LessonType.QUIZ,
      duration: 15,
      order: 4,
      moduleId: reactModule1.id,
    },
  });

  // Create Quiz for Lesson 1.5
  const reactQuiz1 = await prisma.quiz.create({
    data: {
      title: 'Quiz: Kiểm tra Module 1 - React Basics',
      description: 'Kiểm tra kiến thức của bạn về React cơ bản, JSX, và components',
      lessonId: reactLesson1_5.id,
      passingScore: 70,
      timeLimit: 15,
    },
  });

  // Question 1
  await prisma.question.create({
    data: {
      quizId: reactQuiz1.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'React là gì?',
      points: 10,
      order: 0,
      explanation: 'React là một thư viện JavaScript được Facebook phát triển để xây dựng giao diện người dùng (UI).',
      answers: {
        create: [
          { text: 'Một thư viện JavaScript để xây dựng UI', isCorrect: true, order: 0 },
          { text: 'Một framework Python', isCorrect: false, order: 1 },
          { text: 'Một hệ quản trị cơ sở dữ liệu', isCorrect: false, order: 2 },
          { text: 'Một ngôn ngữ lập trình mới', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  // Question 2
  await prisma.question.create({
    data: {
      quizId: reactQuiz1.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'JSX là viết tắt của gì?',
      points: 10,
      order: 1,
      explanation: 'JSX stands for JavaScript XML - một phần mở rộng cú pháp cho JavaScript.',
      answers: {
        create: [
          { text: 'JavaScript XML', isCorrect: true, order: 0 },
          { text: 'Java Syntax Extension', isCorrect: false, order: 1 },
          { text: 'JSON Syntax Extension', isCorrect: false, order: 2 },
          { text: 'JavaScript Extra', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  // Question 3
  await prisma.question.create({
    data: {
      quizId: reactQuiz1.id,
      type: QuestionType.TRUE_FALSE,
      question: 'React được phát triển bởi Facebook?',
      points: 5,
      order: 2,
      explanation: 'Đúng! React được Jordan Walke tại Facebook tạo ra và phát hành vào năm 2013.',
      answers: {
        create: [
          { text: 'True', isCorrect: true, order: 0 },
          { text: 'False', isCorrect: false, order: 1 },
        ],
      },
    },
  });

  // Module 2: Components & Props
  const reactModule2 = await prisma.courseModule.create({
    data: {
      title: 'Module 2: Components và Props',
      description: 'Học cách tạo và sử dụng components trong React',
      order: 1,
      courseId: reactCourse.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Bài 1: Function Components',
      description: 'Tạo components với function trong React',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
      duration: 30,
      order: 0,
      moduleId: reactModule2.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Bài 2: Props và Component Communication',
      description: 'Truyền dữ liệu giữa các components với props',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
      duration: 35,
      order: 1,
      moduleId: reactModule2.id,
    },
  });

  const reactLesson2_3 = await prisma.lesson.create({
    data: {
      title: 'Quiz: Components & Props',
      description: 'Kiểm tra hiểu biết về components và props',
      type: LessonType.QUIZ,
      duration: 20,
      order: 2,
      moduleId: reactModule2.id,
    },
  });

  // Create Quiz for Module 2
  const reactQuiz2 = await prisma.quiz.create({
    data: {
      title: 'Quiz: Components & Props',
      description: 'Kiểm tra kiến thức về React Components và Props',
      lessonId: reactLesson2_3.id,
      passingScore: 75,
      timeLimit: 20,
    },
  });

  await prisma.question.create({
    data: {
      quizId: reactQuiz2.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'Cách nào để tạo một function component trong React?',
      points: 10,
      order: 0,
      explanation: 'Function component là một JavaScript function trả về JSX.',
      answers: {
        create: [
          { text: 'function MyComponent() { return <div>Hello</div>; }', isCorrect: true, order: 0 },
          { text: 'class MyComponent { render() { } }', isCorrect: false, order: 1 },
          { text: 'component MyComponent = () => { }', isCorrect: false, order: 2 },
          { text: 'const MyComponent = <div>Hello</div>', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  console.log(`✅ Created React Course with 2 modules, 6 lessons, 2 quizzes`);

  // 4. COURSE 2: Node.js Backend Development
  console.log('🎯 Creating Course 2: Node.js Backend...');

  const nodeCourse = await prisma.course.upsert({
    where: { slug: 'nodejs-backend-2025' },
    update: {},
    create: {
      title: 'Node.js Backend Development - API Master',
      slug: 'nodejs-backend-2025',
      description: 'Xây dựng RESTful API và GraphQL API với Node.js, Express, và NestJS. Học database, authentication, testing, và deployment.',
      thumbnail: 'https://placehold.co/800x450/10b981/ffffff?text=Node.js+Backend',
      trailer: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
      price: 699000,
      level: CourseLevel.INTERMEDIATE,
      status: CourseStatus.PUBLISHED,
      duration: 600,
      instructorId: instructor.id,
      categoryId: programmingCategory.id,
      metaTitle: 'Học Node.js Backend 2025 - Build API chuyên nghiệp',
      metaDescription: 'Khóa học Node.js backend từ cơ bản đến nâng cao',
      tags: ['nodejs', 'backend', 'api', 'express', 'nestjs', 'graphql'],
      whatYouWillLearn: [
        'Xây dựng RESTful API với Express.js',
        'Tạo GraphQL API với Apollo Server',
        'Làm việc với MongoDB và PostgreSQL',
        'Implement JWT Authentication & Authorization',
        'File upload với Multer',
        'Testing với Jest và Supertest',
        'Deploy API lên AWS và Heroku',
        'Best practices và design patterns',
      ],
      requirements: [
        'JavaScript cơ bản',
        'Hiểu về HTTP và REST API',
        'Node.js và npm',
        'Biết SQL cơ bản',
      ],
      targetAudience: [
        'Backend developers',
        'Fullstack developers',
        'Sinh viên IT muốn học backend',
        'Developer chuyển từ frontend sang backend',
      ],
    },
  });

  // Module 1: Node.js Basics
  const nodeModule1 = await prisma.courseModule.create({
    data: {
      title: 'Module 1: Node.js Cơ Bản',
      description: 'Giới thiệu Node.js, npm, và modules system',
      order: 0,
      courseId: nodeCourse.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Bài 1: Node.js là gì?',
      description: 'Giới thiệu về Node.js runtime environment',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
      duration: 20,
      order: 0,
      isFree: true,
      moduleId: nodeModule1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Bài 2: NPM và Package Management',
      description: 'Quản lý packages với npm và package.json',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=jHDhaSSKmB0',
      duration: 25,
      order: 1,
      isFree: true,
      moduleId: nodeModule1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Tài liệu: CommonJS vs ES Modules',
      description: 'So sánh 2 hệ thống module trong Node.js',
      type: LessonType.TEXT,
      content: `# Module Systems trong Node.js

## CommonJS (require/module.exports)

\`\`\`javascript
// math.js
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// app.js
const math = require('./math');
console.log(math.add(5, 3)); // 8
\`\`\`

## ES Modules (import/export)

\`\`\`javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// app.js
import { add, subtract } from './math.js';
console.log(add(5, 3)); // 8
\`\`\`

## Sử dụng ES Modules trong Node.js

Thêm vào package.json:
\`\`\`json
{
  "type": "module"
}
\`\`\``,
      duration: 15,
      order: 2,
      moduleId: nodeModule1.id,
    },
  });

  const nodeLesson1_4 = await prisma.lesson.create({
    data: {
      title: 'Quiz: Node.js Fundamentals',
      description: 'Kiểm tra kiến thức Node.js cơ bản',
      type: LessonType.QUIZ,
      duration: 20,
      order: 3,
      moduleId: nodeModule1.id,
    },
  });

  // Create Quiz for Node Module 1
  const nodeQuiz1 = await prisma.quiz.create({
    data: {
      title: 'Quiz: Node.js Fundamentals',
      description: 'Kiểm tra hiểu biết về Node.js, npm, và modules',
      lessonId: nodeLesson1_4.id,
      passingScore: 70,
      timeLimit: 20,
    },
  });

  await prisma.question.create({
    data: {
      quizId: nodeQuiz1.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'Node.js được xây dựng trên JavaScript engine nào?',
      points: 10,
      order: 0,
      explanation: 'Node.js được xây dựng trên V8 JavaScript engine của Google Chrome.',
      answers: {
        create: [
          { text: 'V8 Engine', isCorrect: true, order: 0 },
          { text: 'SpiderMonkey', isCorrect: false, order: 1 },
          { text: 'Chakra', isCorrect: false, order: 2 },
          { text: 'JavaScriptCore', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      quizId: nodeQuiz1.id,
      type: QuestionType.TRUE_FALSE,
      question: 'Node.js là single-threaded?',
      points: 10,
      order: 1,
      explanation: 'Đúng! Node.js chạy trên single thread nhưng sử dụng event loop để xử lý async operations.',
      answers: {
        create: [
          { text: 'True', isCorrect: true, order: 0 },
          { text: 'False', isCorrect: false, order: 1 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      quizId: nodeQuiz1.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'NPM là viết tắt của gì?',
      points: 5,
      order: 2,
      explanation: 'NPM = Node Package Manager',
      answers: {
        create: [
          { text: 'Node Package Manager', isCorrect: true, order: 0 },
          { text: 'New Programming Module', isCorrect: false, order: 1 },
          { text: 'Node Project Manager', isCorrect: false, order: 2 },
          { text: 'Network Package Manager', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  // Module 2: Express.js API
  const nodeModule2 = await prisma.courseModule.create({
    data: {
      title: 'Module 2: Xây Dựng REST API với Express',
      description: 'Tạo RESTful API với Express.js framework',
      order: 1,
      courseId: nodeCourse.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Bài 1: Giới thiệu Express.js',
      description: 'Setup Express server và routing cơ bản',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
      duration: 30,
      order: 0,
      moduleId: nodeModule2.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Bài 2: Middleware và Request Handling',
      description: 'Sử dụng middleware trong Express',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=lY6icfhap2o',
      duration: 35,
      order: 1,
      moduleId: nodeModule2.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Bài 3: CRUD Operations với MongoDB',
      description: 'Kết nối MongoDB và thực hiện CRUD',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=0oXYLzuucwE',
      duration: 45,
      order: 2,
      moduleId: nodeModule2.id,
    },
  });

  const nodeLesson2_4 = await prisma.lesson.create({
    data: {
      title: 'Quiz: Express.js & REST API',
      description: 'Kiểm tra kiến thức về Express và REST API',
      type: LessonType.QUIZ,
      duration: 25,
      order: 3,
      moduleId: nodeModule2.id,
    },
  });

  // Create Quiz for Node Module 2
  const nodeQuiz2 = await prisma.quiz.create({
    data: {
      title: 'Quiz: Express.js & REST API',
      description: 'Kiểm tra hiểu biết về Express.js và RESTful API',
      lessonId: nodeLesson2_4.id,
      passingScore: 75,
      timeLimit: 25,
    },
  });

  await prisma.question.create({
    data: {
      quizId: nodeQuiz2.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'HTTP method nào dùng để tạo mới resource?',
      points: 10,
      order: 0,
      explanation: 'POST method được sử dụng để tạo mới resource trong RESTful API.',
      answers: {
        create: [
          { text: 'POST', isCorrect: true, order: 0 },
          { text: 'GET', isCorrect: false, order: 1 },
          { text: 'PUT', isCorrect: false, order: 2 },
          { text: 'DELETE', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      quizId: nodeQuiz2.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'Middleware trong Express được thực thi như thế nào?',
      points: 10,
      order: 1,
      explanation: 'Middleware được thực thi theo thứ tự (sequentially) từ trên xuống dưới.',
      answers: {
        create: [
          { text: 'Theo thứ tự từ trên xuống', isCorrect: true, order: 0 },
          { text: 'Ngẫu nhiên', isCorrect: false, order: 1 },
          { text: 'Song song (parallel)', isCorrect: false, order: 2 },
          { text: 'Từ dưới lên trên', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  console.log(`✅ Created Node.js Course with 2 modules, 7 lessons, 2 quizzes`);

  // 5. Create a student for testing
  console.log('👨‍🎓 Creating student...');

  const student = await prisma.user.upsert({
    where: { email: 'student@lms.com' },
    update: {},
    create: {
      email: 'student@lms.com',
      username: 'student_demo',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Student',
      roleType: UserRoleType.USER,
      isActive: true,
      isVerified: true,
    },
  });

  // Create enrollments
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: reactCourse.id,
      progress: 25,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: nodeCourse.id,
      progress: 10,
    },
  });

  // Update enrollment counts
  await prisma.course.update({
    where: { id: reactCourse.id },
    data: { enrollmentCount: 1 },
  });

  await prisma.course.update({
    where: { id: nodeCourse.id },
    data: { enrollmentCount: 1 },
  });

  console.log('');
  console.log('🎉 COMPLETE LMS seeding finished!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   ✅ Instructor: instructor@lms.com / password123');
  console.log('   ✅ Student: student@lms.com / password123');
  console.log('   ✅ Categories: 2');
  console.log('   ✅ Courses: 2 (PUBLISHED)');
  console.log('   ✅ Modules: 4 total');
  console.log('   ✅ Lessons: 13 total (VIDEO, TEXT, QUIZ)');
  console.log('   ✅ Quizzes: 4 with questions');
  console.log('   ✅ Questions: 9 total');
  console.log('   ✅ Enrollments: 2');
  console.log('');
  console.log('📚 Course 1: React Fundamentals');
  console.log('   - 2 modules, 6 lessons, 2 quizzes');
  console.log('   - Price: 499,000 VND');
  console.log('');
  console.log('📚 Course 2: Node.js Backend');
  console.log('   - 2 modules, 7 lessons, 2 quizzes');
  console.log('   - Price: 699,000 VND');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
