import { PrismaClient, CourseLevel, CourseStatus, UserRoleType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting LMS seeding...');

  // 1. Create instructor users
  console.log('👨‍🏫 Creating instructors...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const instructor1 = await prisma.user.upsert({
    where: { email: 'john.instructor@tazagroupcore.com' },
    update: {},
    create: {
      email: 'john.instructor@tazagroupcore.com',
      username: 'john_instructor',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      roleType: UserRoleType.ADMIN, // Use ADMIN instead of INSTRUCTOR
      isActive: true,
      isVerified: true,
    },
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: 'jane.instructor@tazagroupcore.com' },
    update: {},
    create: {
      email: 'jane.instructor@tazagroupcore.com',
      username: 'jane_instructor',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      roleType: UserRoleType.ADMIN,
      isActive: true,
      isVerified: true,
    },
  });

  console.log(`✅ Created instructors: ${instructor1.username}, ${instructor2.username}`);

  // 2. Create student user
  console.log('👨‍🎓 Creating student...');

  const student = await prisma.user.upsert({
    where: { email: 'alice.student@tazagroupcore.com' },
    update: {},
    create: {
      email: 'alice.student@tazagroupcore.com',
      username: 'alice_student',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Johnson',
      roleType: UserRoleType.USER,
      isActive: true,
      isVerified: true,
    },
  });

  console.log(`✅ Created student: ${student.username}`);

  // 3. Create course categories
  console.log('📚 Creating course categories...');

  const programmingCategory = await prisma.courseCategory.upsert({
    where: { slug: 'programming' },
    update: {},
    create: {
      name: 'Programming',
      slug: 'programming',
      description: 'Learn programming languages and concepts',
    },
  });

  const webDevCategory = await prisma.courseCategory.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Master web development technologies',
      parentId: programmingCategory.id,
    },
  });

  const businessCategory = await prisma.courseCategory.upsert({
    where: { slug: 'business' },
    update: {},
    create: {
      name: 'Business',
      slug: 'business',
      description: 'Business and entrepreneurship courses',
    },
  });

  console.log(`✅ Created ${3} categories`);

  // 4. Create courses
  console.log('🎯 Creating courses...');

  const course1 = await prisma.course.upsert({
    where: { slug: 'nestjs-fundamentals' },
    update: {},
    create: {
      title: 'NestJS Fundamentals',
      slug: 'nestjs-fundamentals',
      description: 'Master NestJS framework from basics to advanced concepts. Build scalable server-side applications.',
      thumbnail: 'https://placehold.co/800x450/ef4444/ffffff?text=NestJS+Fundamentals',
      trailer: 'https://www.youtube.com/watch?v=GHTA143_b-s',
      price: 99.99,
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      duration: 180,
      instructorId: instructor1.id,
      categoryId: webDevCategory.id,
      whatYouWillLearn: [
        'Build REST APIs with NestJS',
        'Understand dependency injection',
        'Work with TypeORM and databases',
        'Implement authentication and authorization',
      ],
      requirements: [
        'Basic JavaScript knowledge',
        'Node.js installed on your machine',
      ],
    },
  });

  const course2 = await prisma.course.upsert({
    where: { slug: 'react-nextjs-mastery' },
    update: {},
    create: {
      title: 'React & Next.js Mastery',
      slug: 'react-nextjs-mastery',
      description: 'Build modern web applications with React and Next.js',
      thumbnail: 'https://placehold.co/800x450/3b82f6/ffffff?text=React+%26+Next.js',
      price: 149.99,
      level: CourseLevel.INTERMEDIATE,
      status: CourseStatus.PUBLISHED,
      duration: 240,
      instructorId: instructor1.id,
      categoryId: webDevCategory.id,
      whatYouWillLearn: [
        'Master React hooks and components',
        'Build SSR applications with Next.js',
        'Implement routing and navigation',
        'Optimize performance',
      ],
      requirements: [
        'JavaScript ES6+ knowledge',
        'Basic React experience',
      ],
    },
  });

  const course3 = await prisma.course.upsert({
    where: { slug: 'business-strategy-101' },
    update: {},
    create: {
      title: 'Business Strategy 101',
      slug: 'business-strategy-101',
      description: 'Learn essential business strategy concepts and frameworks',
      thumbnail: 'https://placehold.co/800x450/f59e0b/ffffff?text=Business+Strategy',
      price: 79.99,
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      duration: 150,
      instructorId: instructor2.id,
      categoryId: businessCategory.id,
      whatYouWillLearn: [
        'Understand business models',
        'Analyze competition',
        'Create strategic plans',
      ],
      requirements: [],
    },
  });

  const course4 = await prisma.course.upsert({
    where: { slug: 'graphql-api-development' },
    update: {},
    create: {
      title: 'GraphQL API Development',
      slug: 'graphql-api-development',
      description: 'Master GraphQL API development with Apollo Server',
      thumbnail: 'https://placehold.co/800x450/ec4899/ffffff?text=GraphQL+API',
      price: 0, // Free course
      level: CourseLevel.INTERMEDIATE,
      status: CourseStatus.DRAFT,
      duration: 200,
      instructorId: instructor2.id,
      categoryId: webDevCategory.id,
      whatYouWillLearn: [
        'Build GraphQL schemas',
        'Implement resolvers',
        'Handle authentication',
      ],
      requirements: [
        'Basic API knowledge',
      ],
    },
  });

  console.log(`✅ Created ${4} courses`);

  // 5. Create modules and lessons
  console.log('📖 Creating modules and lessons...');

  const course1Module1 = await prisma.courseModule.create({
    data: {
      title: 'Getting Started',
      description: 'Introduction to NestJS',
      order: 1,
      courseId: course1.id,
    },
  });

  const course1Module2 = await prisma.courseModule.create({
    data: {
      title: 'Building APIs',
      description: 'Learn to build REST APIs',
      order: 2,
      courseId: course1.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'What is NestJS?',
        description: 'Introduction to NestJS framework',
        type: 'VIDEO',
        content: 'https://example.com/video1.mp4',
        duration: 15,
        order: 1,
        moduleId: course1Module1.id,
      },
      {
        title: 'Setting Up Your Environment',
        description: 'Install and configure NestJS',
        type: 'VIDEO',
        content: 'https://example.com/video2.mp4',
        duration: 20,
        order: 2,
        moduleId: course1Module1.id,
      },
      {
        title: 'Creating Your First Controller',
        description: 'Build your first NestJS controller',
        type: 'VIDEO',
        content: 'https://example.com/video3.mp4',
        duration: 25,
        order: 1,
        moduleId: course1Module2.id,
      },
    ],
  });

  const course2Module1 = await prisma.courseModule.create({
    data: {
      title: 'React Basics',
      description: 'Learn React fundamentals',
      order: 1,
      courseId: course2.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'Components and Props',
        description: 'Understanding React components',
        type: 'VIDEO',
        content: 'https://example.com/video4.mp4',
        duration: 30,
        order: 1,
        moduleId: course2Module1.id,
      },
      {
        title: 'State and Hooks',
        description: 'Working with React state',
        type: 'VIDEO',
        content: 'https://example.com/video5.mp4',
        duration: 35,
        order: 2,
        moduleId: course2Module1.id,
      },
      {
        title: 'React Quiz',
        description: 'Test your React knowledge',
        type: 'QUIZ',
        content: JSON.stringify({
          questions: [
            { q: 'What is JSX?', a: ['A syntax extension'] },
          ],
        }),
        order: 3,
        moduleId: course2Module1.id,
      },
    ],
  });

  console.log(`✅ Created ${3} modules with ${6} lessons`);

  // 6. Create enrollments
  console.log('🎓 Creating enrollments...');

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      progress: 33.33,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course2.id,
      progress: 0,
    },
  });

  // Update enrollment counts
  await prisma.course.update({
    where: { id: course1.id },
    data: { enrollmentCount: 1 },
  });

  await prisma.course.update({
    where: { id: course2.id },
    data: { enrollmentCount: 1 },
  });

  console.log(`✅ Created ${2} enrollments`);

  console.log('');
  console.log('🎉 LMS seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Instructors: 2`);
  console.log(`   - Students: 1`);
  console.log(`   - Categories: 3`);
  console.log(`   - Courses: 4 (3 published, 1 draft)`);
  console.log(`   - Modules: 3`);
  console.log(`   - Lessons: 6`);
  console.log(`   - Enrollments: 2`);
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
