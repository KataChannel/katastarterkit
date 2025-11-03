import { PrismaClient, CourseLevel, CourseStatus, UserRoleType, LessonType, QuestionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting LMS seeding with 8 COMPLETE Courses...\n');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Users
  console.log('👥 Creating users...');
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

  console.log(`✅ Created users: ${instructor.username}, ${student.username}\n`);

  // 2. Create Categories
  console.log('📚 Creating categories...');
  const programmingCat = await prisma.courseCategory.upsert({
    where: { slug: 'programming' },
    update: {},
    create: { name: 'Programming', slug: 'programming', description: 'Lập trình', icon: '💻' },
  });

  const webDevCat = await prisma.courseCategory.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: { name: 'Web Development', slug: 'web-development', description: 'Phát triển Web', parentId: programmingCat.id, icon: '🌐' },
  });

  const mobileCat = await prisma.courseCategory.upsert({
    where: { slug: 'mobile-development' },
    update: {},
    create: { name: 'Mobile Development', slug: 'mobile-development', description: 'Phát triển Mobile', parentId: programmingCat.id, icon: '📱' },
  });

  const dataScienceCat = await prisma.courseCategory.upsert({
    where: { slug: 'data-science' },
    update: {},
    create: { name: 'Data Science', slug: 'data-science', description: 'Khoa học dữ liệu', icon: '📊' },
  });

  console.log(`✅ Created 4 categories\n`);

  // =============================================================================
  // COURSE 1: React Fundamentals
  // =============================================================================
  console.log('🎯 Creating COURSE 1: React Fundamentals...');
  const reactCourse = await prisma.course.create({
    data: {
      title: 'React Fundamentals - Từ Zero Đến Hero 2025',
      slug: 'react-fundamentals-2025',
      description: 'Khóa học React toàn diện từ cơ bản đến nâng cao. Học cách xây dựng ứng dụng web hiện đại với React hooks, state management, và best practices mới nhất năm 2025.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      price: 499000,
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      duration: 480,
      instructorId: instructor.id,
      categoryId: webDevCat.id,
      whatYouWillLearn: ['React Components & Props', 'React Hooks (useState, useEffect, useContext)', 'State Management với Redux Toolkit', 'React Router v6', 'API Integration với Axios', 'Performance Optimization', 'Testing với Jest & React Testing Library', 'Deploy lên Vercel'],
      requirements: ['JavaScript ES6+ thành thạo', 'HTML & CSS cơ bản', 'Node.js đã cài đặt', 'Hiểu biết về npm/yarn'],
      targetAudience: ['Người mới bắt đầu học React', 'Frontend developers muốn nâng cấp skill', 'Sinh viên ngành IT', 'Freelancer muốn mở rộng skillset'],
    },
  });

  const reactModule1 = await prisma.courseModule.create({
    data: {
      title: 'Module 1: Giới thiệu React & Setup',
      description: 'Tìm hiểu React là gì và chuẩn bị môi trường phát triển',
      order: 0,
      courseId: reactCourse.id,
    },
  });

  const reactLesson1_1 = await prisma.lesson.create({
    data: {
      title: 'React là gì? Tại sao nên học React?',
      description: 'Giới thiệu React, lịch sử và lý do phổ biến',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
      duration: 15,
      order: 0,
      isFree: true,
      moduleId: reactModule1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Cài đặt môi trường phát triển',
      type: LessonType.TEXT,
      content: `# Cài đặt môi trường React

## Yêu cầu
- Node.js 18+ (khuyến nghị 20+)
- npm hoặc yarn
- VS Code + Extensions

## Tạo project với Vite
\`\`\`bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
\`\`\`

## Extensions khuyến nghị cho VS Code
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
`,
      duration: 20,
      order: 1,
      moduleId: reactModule1.id,
    },
  });

  const reactQuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Kiểm tra Module 1',
      type: LessonType.QUIZ,
      duration: 10,
      order: 2,
      moduleId: reactModule1.id,
    },
  });

  const reactQuiz1 = await prisma.quiz.create({
    data: {
      title: 'Quiz: React Basics',
      description: 'Kiểm tra kiến thức cơ bản về React',
      lessonId: reactQuizLesson.id,
      passingScore: 70,
      timeLimit: 10,
    },
  });

  await prisma.question.create({
    data: {
      quizId: reactQuiz1.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'React là gì?',
      points: 10,
      order: 0,
      explanation: 'React là thư viện JavaScript do Facebook phát triển để xây dựng UI.',
      answers: {
        create: [
          { text: 'Thư viện JavaScript để xây dựng UI', isCorrect: true, order: 0 },
          { text: 'Framework PHP', isCorrect: false, order: 1 },
          { text: 'Ngôn ngữ lập trình', isCorrect: false, order: 2 },
          { text: 'Database', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      quizId: reactQuiz1.id,
      type: QuestionType.TRUE_FALSE,
      question: 'React sử dụng Virtual DOM?',
      points: 10,
      order: 1,
      explanation: 'Đúng! React sử dụng Virtual DOM để tối ưu performance.',
      answers: {
        create: [
          { text: 'True', isCorrect: true, order: 0 },
          { text: 'False', isCorrect: false, order: 1 },
        ],
      },
    },
  });

  console.log('✅ Course 1 created\n');

  // =============================================================================
  // COURSE 2: Node.js Backend Development
  // =============================================================================
  console.log('🎯 Creating COURSE 2: Node.js Backend Development...');
  const nodeCourse = await prisma.course.create({
    data: {
      title: 'Node.js Backend Development - REST API & Database',
      slug: 'nodejs-backend-2025',
      description: 'Xây dựng RESTful API chuyên nghiệp với Node.js, Express, MongoDB. Học authentication, authorization, security và deploy lên production.',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
      price: 599000,
      level: CourseLevel.INTERMEDIATE,
      status: CourseStatus.PUBLISHED,
      duration: 540,
      instructorId: instructor.id,
      categoryId: webDevCat.id,
      whatYouWillLearn: ['Node.js & Express Framework', 'RESTful API Design Patterns', 'MongoDB & Mongoose ODM', 'JWT Authentication & Authorization', 'Error Handling & Validation', 'API Testing với Postman & Jest', 'Security Best Practices', 'Deploy lên Railway/Render'],
      requirements: ['JavaScript cơ bản', 'Hiểu về HTTP protocol', 'Đã học React (khuyến nghị)', 'SQL/NoSQL cơ bản'],
      targetAudience: ['Backend developers', 'Full-stack developers', 'Người muốn làm API chuyên nghiệp', 'Startup founders cần build MVP'],
    },
  });

  const nodeModule1 = await prisma.courseModule.create({
    data: {
      title: 'Module 1: Node.js & Express Basics',
      description: 'Làm quen với Node.js và Express framework',
      order: 0,
      courseId: nodeCourse.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Giới thiệu Node.js runtime',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
      duration: 18,
      order: 0,
      isFree: true,
      moduleId: nodeModule1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Tạo HTTP Server đầu tiên',
      type: LessonType.TEXT,
      content: `# Tạo HTTP Server với Node.js

## Native HTTP Module
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello Node.js!' }));
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Express Framework
\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello Express!' });
});

app.listen(3000);
\`\`\`
`,
      duration: 25,
      order: 1,
      moduleId: nodeModule1.id,
    },
  });

  const nodeQuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Node.js Fundamentals',
      type: LessonType.QUIZ,
      duration: 12,
      order: 2,
      moduleId: nodeModule1.id,
    },
  });

  const nodeQuiz1 = await prisma.quiz.create({
    data: {
      title: 'Quiz: Node.js Basics',
      lessonId: nodeQuizLesson.id,
      passingScore: 70,
      timeLimit: 12,
    },
  });

  await prisma.question.create({
    data: {
      quizId: nodeQuiz1.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'Node.js chạy trên engine nào?',
      points: 10,
      order: 0,
      explanation: 'Node.js được xây dựng trên V8 JavaScript Engine của Chrome.',
      answers: {
        create: [
          { text: 'V8 Engine', isCorrect: true, order: 0 },
          { text: 'SpiderMonkey', isCorrect: false, order: 1 },
          { text: 'Chakra', isCorrect: false, order: 2 },
          { text: 'JVM', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  console.log('✅ Course 2 created\n');

  // =============================================================================
  // COURSE 3: Flutter Mobile Development
  // =============================================================================
  console.log('🎯 Creating COURSE 3: Flutter Mobile Development...');
  const flutterCourse = await prisma.course.create({
    data: {
      title: 'Flutter - Xây Dựng App Mobile Đa Nền Tảng',
      slug: 'flutter-mobile-2025',
      description: 'Học Flutter để tạo ứng dụng iOS và Android từ một mã nguồn duy nhất. Master Widgets, State Management, Firebase và publish lên Store.',
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
      price: 699000,
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      duration: 600,
      instructorId: instructor.id,
      categoryId: mobileCat.id,
      whatYouWillLearn: ['Flutter Widgets System', 'Dart Programming Language', 'State Management (Provider, Bloc, Riverpod)', 'Firebase Integration (Auth, Firestore, Storage)', 'Navigation & Routing', 'Local Database (SQLite, Hive)', 'Push Notifications', 'Publish lên App Store & Google Play'],
      requirements: ['Lập trình cơ bản (bất kỳ ngôn ngữ)', 'Flutter SDK cài đặt', 'Android Studio hoặc VS Code', 'Device/Emulator để test'],
      targetAudience: ['Mobile developers', 'Người muốn học cross-platform', 'Startup founders', 'Freelancers'],
    },
  });

  const flutterModule1 = await prisma.courseModule.create({
    data: {
      title: 'Module 1: Flutter & Dart Basics',
      description: 'Làm quen với Flutter và ngôn ngữ Dart',
      order: 0,
      courseId: flutterCourse.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Flutter là gì? Tại sao chọn Flutter?',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=1xipg02Wu8s',
      duration: 20,
      order: 0,
      isFree: true,
      moduleId: flutterModule1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Dart Programming Essentials',
      type: LessonType.TEXT,
      content: `# Dart Programming Basics

## Variables & Data Types
\`\`\`dart
void main() {
  // Type inference
  var name = 'Flutter';
  final city = 'Hanoi'; // Runtime constant
  const pi = 3.14; // Compile-time constant
  
  // Explicit types
  String language = 'Dart';
  int version = 3;
  double rating = 4.8;
  bool isAwesome = true;
}
\`\`\`

## Functions
\`\`\`dart
// Named parameters
String greet({required String name, String title = 'Mr'}) {
  return 'Hello $title $name';
}

// Arrow function
int add(int a, int b) => a + b;
\`\`\`

## Classes
\`\`\`dart
class Person {
  final String name;
  final int age;
  
  Person(this.name, this.age);
  
  void introduce() {
    print('I am $name, $age years old');
  }
}
\`\`\`
`,
      duration: 30,
      order: 1,
      moduleId: flutterModule1.id,
    },
  });

  const flutterQuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Flutter & Dart',
      type: LessonType.QUIZ,
      duration: 15,
      order: 2,
      moduleId: flutterModule1.id,
    },
  });

  const flutterQuiz1 = await prisma.quiz.create({
    data: {
      title: 'Quiz: Flutter Basics',
      lessonId: flutterQuizLesson.id,
      passingScore: 70,
      timeLimit: 15,
    },
  });

  await prisma.question.create({
    data: {
      quizId: flutterQuiz1.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'Flutter được phát triển bởi công ty nào?',
      points: 10,
      order: 0,
      explanation: 'Flutter là UI framework mã nguồn mở của Google.',
      answers: {
        create: [
          { text: 'Google', isCorrect: true, order: 0 },
          { text: 'Facebook', isCorrect: false, order: 1 },
          { text: 'Microsoft', isCorrect: false, order: 2 },
          { text: 'Apple', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  console.log('✅ Course 3 created\n');

  // =============================================================================
  // COURSE 4: Python for Data Science
  // =============================================================================
  console.log('🎯 Creating COURSE 4: Python for Data Science...');
  const pythonDSCourse = await prisma.course.create({
    data: {
      title: 'Python cho Data Science - Pandas, NumPy, ML',
      slug: 'python-data-science-2025',
      description: 'Làm chủ Python trong phân tích dữ liệu. Học Pandas, NumPy, Matplotlib, Seaborn và Machine Learning cơ bản với Scikit-learn.',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
      price: 799000,
      level: CourseLevel.INTERMEDIATE,
      status: CourseStatus.PUBLISHED,
      duration: 720,
      instructorId: instructor.id,
      categoryId: dataScienceCat.id,
      whatYouWillLearn: ['Python Fundamentals', 'Pandas DataFrames & Series', 'NumPy Arrays & Operations', 'Data Visualization (Matplotlib, Seaborn, Plotly)', 'Statistical Analysis', 'Machine Learning với Scikit-learn', 'Real-world Projects', 'Jupyter Notebooks mastery'],
      requirements: ['Toán cơ bản (đại số, thống kê)', 'Laptop cấu hình tốt', 'Python 3.10+ cài đặt', 'Jupyter Notebook/Lab'],
      targetAudience: ['Data Analysts', 'Data Scientists', 'Researchers', 'Business Analysts', 'Sinh viên ngành Data'],
    },
  });

  const pythonModule1 = await prisma.courseModule.create({
    data: {
      title: 'Module 1: Python & Pandas Basics',
      description: 'Cơ bản về Python và thư viện Pandas',
      order: 0,
      courseId: pythonDSCourse.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Python cho Data Science',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
      duration: 22,
      order: 0,
      isFree: true,
      moduleId: pythonModule1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Pandas DataFrame Operations',
      type: LessonType.TEXT,
      content: `# Pandas DataFrame Mastery

## Creating DataFrames
\`\`\`python
import pandas as pd
import numpy as np

# From dictionary
data = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [25, 30, 35],
    'Salary': [50000, 60000, 70000]
}
df = pd.DataFrame(data)

# From CSV
df = pd.read_csv('data.csv')
\`\`\`

## Essential Operations
\`\`\`python
# Viewing data
print(df.head())
print(df.info())
print(df.describe())

# Filtering
high_salary = df[df['Salary'] > 55000]

# Grouping
avg_by_department = df.groupby('Department')['Salary'].mean()

# Handling missing data
df.fillna(0, inplace=True)
df.dropna()
\`\`\`

## Advanced Techniques
\`\`\`python
# Merging DataFrames
result = pd.merge(df1, df2, on='id', how='inner')

# Pivot tables
pivot = df.pivot_table(values='Salary', index='Department', aggfunc='mean')
\`\`\`
`,
      duration: 35,
      order: 1,
      moduleId: pythonModule1.id,
    },
  });

  const pythonQuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Python & Pandas',
      type: LessonType.QUIZ,
      duration: 15,
      order: 2,
      moduleId: pythonModule1.id,
    },
  });

  const pythonQuiz1 = await prisma.quiz.create({
    data: {
      title: 'Quiz: Python Data Science',
      lessonId: pythonQuizLesson.id,
      passingScore: 70,
      timeLimit: 15,
    },
  });

  await prisma.question.create({
    data: {
      quizId: pythonQuiz1.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'Thư viện nào dùng để làm việc với DataFrame?',
      points: 10,
      order: 0,
      explanation: 'Pandas cung cấp cấu trúc DataFrame mạnh mẽ cho phân tích dữ liệu.',
      answers: {
        create: [
          { text: 'Pandas', isCorrect: true, order: 0 },
          { text: 'NumPy', isCorrect: false, order: 1 },
          { text: 'Matplotlib', isCorrect: false, order: 2 },
          { text: 'Scikit-learn', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  console.log('✅ Course 4 created\n');

  // =============================================================================
  // COURSE 5: Vue.js 3 Complete Guide
  // =============================================================================
  console.log('🎯 Creating COURSE 5: Vue.js 3 Complete Guide...');
  const vueCourse = await prisma.course.create({
    data: {
      title: 'Vue.js 3 - The Complete Guide (Composition API)',
      slug: 'vuejs-complete-2025',
      description: 'Học Vue.js 3 với Composition API, Pinia state management, Vue Router, TypeScript và xây dựng ứng dụng production-ready.',
      thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
      price: 549000,
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      duration: 480,
      instructorId: instructor.id,
      categoryId: webDevCat.id,
      whatYouWillLearn: ['Vue 3 Composition API', 'Reactivity System (ref, reactive, computed)', 'Pinia State Management', 'Vue Router v4', 'Component Design Patterns', 'TypeScript with Vue', 'Vite Build Tool', 'Testing với Vitest'],
      requirements: ['JavaScript ES6+ thành thạo', 'HTML/CSS', 'Node.js & npm', 'TypeScript cơ bản (khuyến nghị)'],
      targetAudience: ['Frontend developers', 'React/Angular developers muốn học Vue', 'Người mới bắt đầu frontend', 'Full-stack developers'],
    },
  });

  const vueModule1 = await prisma.courseModule.create({
    data: {
      title: 'Module 1: Vue.js 3 Essentials',
      description: 'Cơ bản Vue.js 3 và Composition API',
      order: 0,
      courseId: vueCourse.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Giới thiệu Vue.js 3',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=nhBVL41-_Cw',
      duration: 18,
      order: 0,
      isFree: true,
      moduleId: vueModule1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Composition API: ref vs reactive',
      type: LessonType.TEXT,
      content: `# Vue 3 Composition API

## Setup Function
\`\`\`javascript
import { ref, reactive, computed } from 'vue';

export default {
  setup() {
    // ref for primitives
    const count = ref(0);
    const increment = () => count.value++;
    
    // reactive for objects
    const state = reactive({
      user: 'John',
      age: 25
    });
    
    // computed
    const doubleCount = computed(() => count.value * 2);
    
    return { count, increment, state, doubleCount };
  }
};
\`\`\`

## Script Setup (Recommended)
\`\`\`vue
<script setup>
import { ref, reactive } from 'vue';

const count = ref(0);
const state = reactive({ name: 'Vue 3' });
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Name: {{ state.name }}</p>
    <button @click="count++">Increment</button>
  </div>
</template>
\`\`\`
`,
      duration: 28,
      order: 1,
      moduleId: vueModule1.id,
    },
  });

  const vueQuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Vue.js 3 Basics',
      type: LessonType.QUIZ,
      duration: 12,
      order: 2,
      moduleId: vueModule1.id,
    },
  });

  const vueQuiz1 = await prisma.quiz.create({
    data: {
      title: 'Quiz: Vue Fundamentals',
      lessonId: vueQuizLesson.id,
      passingScore: 70,
      timeLimit: 12,
    },
  });

  await prisma.question.create({
    data: {
      quizId: vueQuiz1.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'API nào là mới trong Vue 3?',
      points: 10,
      order: 0,
      explanation: 'Composition API là tính năng chính của Vue 3.',
      answers: {
        create: [
          { text: 'Composition API', isCorrect: true, order: 0 },
          { text: 'Options API', isCorrect: false, order: 1 },
          { text: 'Class API', isCorrect: false, order: 2 },
          { text: 'Mixins', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  console.log('✅ Course 5 created\n');

  // =============================================================================
  // COURSE 6: Next.js 15 Full-Stack
  // =============================================================================
  console.log('🎯 Creating COURSE 6: Next.js 15 Full-Stack...');
  const nextCourse = await prisma.course.create({
    data: {
      title: 'Next.js 15 - Full-Stack React Framework',
      slug: 'nextjs-fullstack-2025',
      description: 'Xây dựng ứng dụng full-stack production với Next.js 15, App Router, Server Components, Server Actions, Prisma và deploy lên Vercel.',
      thumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800',
      price: 899000,
      level: CourseLevel.ADVANCED,
      status: CourseStatus.PUBLISHED,
      duration: 720,
      instructorId: instructor.id,
      categoryId: webDevCat.id,
      whatYouWillLearn: ['Next.js 15 App Router', 'Server & Client Components', 'Server Actions & Mutations', 'API Routes', 'Database với Prisma', 'NextAuth.js Authentication', 'SEO & Metadata Optimization', 'Image Optimization', 'Caching Strategies', 'Vercel Deployment'],
      requirements: ['React hooks thành thạo', 'TypeScript', 'Node.js & npm', 'Database basics (SQL)', 'Git & GitHub'],
      targetAudience: ['React developers nâng cao', 'Full-stack developers', 'Người muốn build production apps', 'Tech leads'],
    },
  });

  const nextModule1 = await prisma.courseModule.create({
    data: {
      title: 'Module 1: Next.js 15 App Router',
      description: 'Làm quen với App Router và Server Components',
      order: 0,
      courseId: nextCourse.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Next.js 15 New Features',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=Sklc_fQBmcs',
      duration: 25,
      order: 0,
      isFree: true,
      moduleId: nextModule1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Server vs Client Components',
      type: LessonType.TEXT,
      content: `# Next.js Server & Client Components

## Server Component (Default)
\`\`\`tsx
// app/page.tsx
// Server Component by default
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store' // Dynamic
  });
  
  return <div>{data.title}</div>;
}
\`\`\`

**Benefits:**
- Zero JavaScript to client
- Direct database access
- Better security
- SEO friendly

## Client Component
\`\`\`tsx
// app/components/Counter.tsx
"use client"

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

**When to use:**
- Event listeners (onClick, onChange)
- State & Effects (useState, useEffect)
- Browser APIs
- Custom hooks

## Server Actions
\`\`\`tsx
// app/actions.ts
"use server"

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.post.create({ data: { title } });
  revalidatePath('/posts');
}
\`\`\`
`,
      duration: 30,
      order: 1,
      moduleId: nextModule1.id,
    },
  });

  const nextQuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Next.js Fundamentals',
      type: LessonType.QUIZ,
      duration: 15,
      order: 2,
      moduleId: nextModule1.id,
    },
  });

  const nextQuiz1 = await prisma.quiz.create({
    data: {
      title: 'Quiz: Next.js App Router',
      lessonId: nextQuizLesson.id,
      passingScore: 70,
      timeLimit: 15,
    },
  });

  await prisma.question.create({
    data: {
      quizId: nextQuiz1.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'Component mặc định trong App Router là gì?',
      points: 10,
      order: 0,
      explanation: 'Next.js 13+ mặc định sử dụng Server Components.',
      answers: {
        create: [
          { text: 'Server Component', isCorrect: true, order: 0 },
          { text: 'Client Component', isCorrect: false, order: 1 },
          { text: 'Static Component', isCorrect: false, order: 2 },
          { text: 'Hybrid Component', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  console.log('✅ Course 6 created\n');

  // =============================================================================
  // COURSE 7: TypeScript Complete Guide
  // =============================================================================
  console.log('🎯 Creating COURSE 7: TypeScript Complete Guide...');
  const tsCourse = await prisma.course.create({
    data: {
      title: 'TypeScript - From Beginner to Expert',
      slug: 'typescript-master-2025',
      description: 'Làm chủ TypeScript từ cơ bản đến nâng cao. Types, Interfaces, Generics, Advanced Types, Decorators và áp dụng vào React/Node.js.',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      price: 449000,
      level: CourseLevel.INTERMEDIATE,
      status: CourseStatus.PUBLISHED,
      duration: 420,
      instructorId: instructor.id,
      categoryId: programmingCat.id,
      whatYouWillLearn: ['TypeScript Types System', 'Interfaces & Type Aliases', 'Generics & Constraints', 'Advanced Types (Union, Intersection, Conditional)', 'Decorators', 'TypeScript với React', 'TypeScript với Node.js', 'tsconfig.json Configuration'],
      requirements: ['JavaScript thành thạo', 'ES6+ features', 'OOP concepts', 'Node.js basics'],
      targetAudience: ['JavaScript developers', 'Người muốn code type-safe', 'Team leads', 'Senior developers'],
    },
  });

  const tsModule1 = await prisma.courseModule.create({
    data: {
      title: 'Module 1: TypeScript Fundamentals',
      description: 'Cơ bản TypeScript và Type System',
      order: 0,
      courseId: tsCourse.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Tại sao TypeScript?',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=zQnBQ4tB3ZA',
      duration: 16,
      order: 0,
      isFree: true,
      moduleId: tsModule1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Types, Interfaces & Generics',
      type: LessonType.TEXT,
      content: `# TypeScript Type System

## Basic Types
\`\`\`typescript
let name: string = 'TypeScript';
let age: number = 5;
let isAwesome: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// Arrays
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ['a', 'b'];

// Tuple
let tuple: [string, number] = ['age', 25];

// Enum
enum Color { Red, Green, Blue }
let color: Color = Color.Red;

// Any (avoid if possible)
let anything: any = 'can be anything';
\`\`\`

## Interfaces
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string; // Optional
  readonly createdAt: Date; // Readonly
}

const user: User = {
  id: 1,
  name: 'John',
  createdAt: new Date()
};
\`\`\`

## Type Aliases
\`\`\`typescript
type ID = string | number;
type Status = 'active' | 'inactive';

type UserRole = 'admin' | 'user' | 'guest';

interface Admin extends User {
  role: UserRole;
  permissions: string[];
}
\`\`\`

## Generics
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity<string>('hello');

// Generic Interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const response: ApiResponse<User[]> = {
  data: [user],
  status: 200,
  message: 'Success'
};
\`\`\`
`,
      duration: 35,
      order: 1,
      moduleId: tsModule1.id,
    },
  });

  const tsQuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: TypeScript Basics',
      type: LessonType.QUIZ,
      duration: 12,
      order: 2,
      moduleId: tsModule1.id,
    },
  });

  const tsQuiz1 = await prisma.quiz.create({
    data: {
      title: 'Quiz: TypeScript Fundamentals',
      lessonId: tsQuizLesson.id,
      passingScore: 70,
      timeLimit: 12,
    },
  });

  await prisma.question.create({
    data: {
      quizId: tsQuiz1.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'TypeScript là gì?',
      points: 10,
      order: 0,
      explanation: 'TypeScript là superset của JavaScript với static typing.',
      answers: {
        create: [
          { text: 'Superset của JavaScript', isCorrect: true, order: 0 },
          { text: 'Framework', isCorrect: false, order: 1 },
          { text: 'Library', isCorrect: false, order: 2 },
          { text: 'Database', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  console.log('✅ Course 7 created\n');

  // =============================================================================
  // COURSE 8: Docker & Kubernetes
  // =============================================================================
  console.log('🎯 Creating COURSE 8: Docker & Kubernetes...');
  const dockerCourse = await prisma.course.create({
    data: {
      title: 'Docker & Kubernetes - DevOps Container Orchestration',
      slug: 'docker-kubernetes-2025',
      description: 'Master Docker containerization và Kubernetes orchestration. Deploy, scale, và manage microservices trong production environment.',
      thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
      price: 999000,
      level: CourseLevel.ADVANCED,
      status: CourseStatus.PUBLISHED,
      duration: 840,
      instructorId: instructor.id,
      categoryId: programmingCat.id,
      whatYouWillLearn: ['Docker Fundamentals & Images', 'Docker Compose Multi-container', 'Kubernetes Architecture', 'Pods, Services & Deployments', 'ConfigMaps & Secrets', 'Helm Charts', 'CI/CD với Docker & K8s', 'Monitoring & Logging', 'Production Best Practices'],
      requirements: ['Linux command line', 'Networking basics', 'Application deployment experience', 'Git', 'Cloud basics (AWS/GCP/Azure)'],
      targetAudience: ['DevOps Engineers', 'Backend Developers', 'System Administrators', 'Cloud Engineers', 'Tech Leads'],
    },
  });

  const dockerModule1 = await prisma.courseModule.create({
    data: {
      title: 'Module 1: Docker Fundamentals',
      description: 'Cơ bản về Docker và Containerization',
      order: 0,
      courseId: dockerCourse.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Docker & Containerization',
      type: LessonType.VIDEO,
      content: 'https://www.youtube.com/watch?v=Gjnup-PuquQ',
      duration: 22,
      order: 0,
      isFree: true,
      moduleId: dockerModule1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Dockerfile & Docker Compose',
      type: LessonType.TEXT,
      content: `# Docker Complete Guide

## Dockerfile
\`\`\`dockerfile
# Multi-stage build for Node.js
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

## Docker Commands
\`\`\`bash
# Build image
docker build -t myapp:1.0 .

# Run container
docker run -d -p 3000:3000 --name myapp myapp:1.0

# View logs
docker logs -f myapp

# Execute commands in container
docker exec -it myapp sh

# Stop & remove
docker stop myapp
docker rm myapp
\`\`\`

## Docker Compose
\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
      - redis
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
\`\`\`

## Docker Compose Commands
\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v
\`\`\`
`,
      duration: 40,
      order: 1,
      moduleId: dockerModule1.id,
    },
  });

  const dockerQuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Docker Basics',
      type: LessonType.QUIZ,
      duration: 15,
      order: 2,
      moduleId: dockerModule1.id,
    },
  });

  const dockerQuiz1 = await prisma.quiz.create({
    data: {
      title: 'Quiz: Docker Fundamentals',
      lessonId: dockerQuizLesson.id,
      passingScore: 70,
      timeLimit: 15,
    },
  });

  await prisma.question.create({
    data: {
      quizId: dockerQuiz1.id,
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'Docker Image là gì?',
      points: 10,
      order: 0,
      explanation: 'Docker Image là template chứa application code và dependencies.',
      answers: {
        create: [
          { text: 'Template để tạo container', isCorrect: true, order: 0 },
          { text: 'Running container', isCorrect: false, order: 1 },
          { text: 'Network configuration', isCorrect: false, order: 2 },
          { text: 'Storage volume', isCorrect: false, order: 3 },
        ],
      },
    },
  });

  console.log('✅ Course 8 created\n');

  // =============================================================================
  // CREATE ENROLLMENTS
  // =============================================================================
  console.log('📝 Creating enrollments...');
  
  const allCourses = [
    reactCourse,
    nodeCourse,
    flutterCourse,
    pythonDSCourse,
    vueCourse,
    nextCourse,
    tsCourse,
    dockerCourse,
  ];

  for (const course of allCourses) {
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id,
        progress: Math.floor(Math.random() * 100),
      },
    });

    await prisma.course.update({
      where: { id: course.id },
      data: { enrollmentCount: 1 },
    });
  }

  console.log(`✅ Created ${allCourses.length} enrollments\n`);

  // =============================================================================
  // SUMMARY
  // =============================================================================
  console.log('🎉 LMS SEEDING COMPLETED!\n');
  console.log('📊 Summary:');
  console.log('   ✅ Users: 2 (instructor + student)');
  console.log('   ✅ Categories: 4');
  console.log('   ✅ Courses: 8 (ALL PUBLISHED)');
  console.log('   ✅ Modules: 8');
  console.log('   ✅ Lessons: 24 (Video + Text + Quiz)');
  console.log('   ✅ Quizzes: 8');
  console.log('   ✅ Questions: 8');
  console.log('   ✅ Enrollments: 8\n');
  
  console.log('👤 Login Credentials:');
  console.log('   Instructor: instructor@lms.com / password123');
  console.log('   Student: student@lms.com / password123\n');
  
  console.log('📚 8 Courses Created:');
  console.log('   1. React Fundamentals - 499k VND (BEGINNER)');
  console.log('   2. Node.js Backend - 599k VND (INTERMEDIATE)');
  console.log('   3. Flutter Mobile - 699k VND (BEGINNER)');
  console.log('   4. Python Data Science - 799k VND (INTERMEDIATE)');
  console.log('   5. Vue.js 3 Complete - 549k VND (BEGINNER)');
  console.log('   6. Next.js 15 Full-Stack - 899k VND (ADVANCED)');
  console.log('   7. TypeScript Master - 449k VND (INTERMEDIATE)');
  console.log('   8. Docker & Kubernetes - 999k VND (ADVANCED)\n');
  
  console.log('🚀 Ready to use!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
