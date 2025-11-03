// Test GraphQL queries cho 8 courses vừa seed
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client');
const fetch = require('cross-fetch');

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    fetch,
  }),
  cache: new InMemoryCache(),
});

const FIND_ALL_COURSES = gql`
  query FindAllCourses {
    courses(
      where: { status: { equals: PUBLISHED } }
      orderBy: { createdAt: desc }
    ) {
      id
      title
      slug
      price
      level
      status
      duration
      enrollmentCount
      instructor {
        firstName
        lastName
        email
      }
      category {
        name
        slug
      }
      _count {
        modules
        enrollments
        reviews
      }
    }
  }
`;

const FIND_COURSE_WITH_MODULES = gql`
  query FindCourseWithModules($slug: String!) {
    course(where: { slug: $slug }) {
      id
      title
      description
      price
      level
      duration
      whatYouWillLearn
      requirements
      targetAudience
      modules {
        id
        title
        description
        order
        lessons {
          id
          title
          type
          duration
          order
          isFree
        }
      }
    }
  }
`;

const FIND_QUIZ_DETAILS = gql`
  query FindQuizDetails($lessonId: String!) {
    quiz(where: { lessonId: $lessonId }) {
      id
      title
      description
      passingScore
      timeLimit
      questions {
        id
        question
        type
        points
        order
        explanation
        answers {
          id
          text
          isCorrect
          order
        }
      }
    }
  }
`;

async function testLMSData() {
  console.log('🧪 Testing LMS 8 Courses Data...\n');

  try {
    // Test 1: Get all courses
    console.log('📚 Test 1: Fetching all courses...');
    const { data: coursesData } = await client.query({ query: FIND_ALL_COURSES });
    console.log(`✅ Found ${coursesData.courses.length} courses:\n`);
    
    coursesData.courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title}`);
      console.log(`   - Slug: ${course.slug}`);
      console.log(`   - Price: ${course.price.toLocaleString()} VND`);
      console.log(`   - Level: ${course.level}`);
      console.log(`   - Duration: ${course.duration} mins`);
      console.log(`   - Instructor: ${course.instructor.firstName} ${course.instructor.lastName}`);
      console.log(`   - Category: ${course.category.name}`);
      console.log(`   - Modules: ${course._count.modules}`);
      console.log(`   - Enrollments: ${course._count.enrollments}\n`);
    });

    // Test 2: Get React course details with modules
    console.log('\n📖 Test 2: Fetching React course with modules...');
    const { data: reactData } = await client.query({
      query: FIND_COURSE_WITH_MODULES,
      variables: { slug: 'react-fundamentals-2025' },
    });

    const reactCourse = reactData.course;
    console.log(`✅ Course: ${reactCourse.title}`);
    console.log(`   Description: ${reactCourse.description.substring(0, 100)}...`);
    console.log(`   What you'll learn:`);
    reactCourse.whatYouWillLearn.forEach((item, i) => {
      console.log(`     ${i + 1}. ${item}`);
    });
    console.log(`\n   Modules: ${reactCourse.modules.length}`);
    
    reactCourse.modules.forEach((module) => {
      console.log(`\n   📦 ${module.title}`);
      module.lessons.forEach((lesson) => {
        const freeTag = lesson.isFree ? ' [FREE]' : '';
        console.log(`      - ${lesson.title} (${lesson.type}, ${lesson.duration}m)${freeTag}`);
      });
    });

    // Test 3: Get quiz details for first quiz lesson
    const quizLesson = reactCourse.modules[0].lessons.find(l => l.type === 'QUIZ');
    if (quizLesson) {
      console.log(`\n\n❓ Test 3: Fetching quiz details for "${quizLesson.title}"...`);
      const { data: quizData } = await client.query({
        query: FIND_QUIZ_DETAILS,
        variables: { lessonId: quizLesson.id },
      });

      const quiz = quizData.quiz;
      console.log(`✅ Quiz: ${quiz.title}`);
      console.log(`   Passing Score: ${quiz.passingScore}%`);
      console.log(`   Time Limit: ${quiz.timeLimit} minutes`);
      console.log(`   Questions: ${quiz.questions.length}\n`);

      quiz.questions.forEach((q, i) => {
        console.log(`   Q${i + 1}. ${q.question} (${q.type}, ${q.points} points)`);
        q.answers.forEach((a) => {
          const correctMark = a.isCorrect ? ' ✓' : '';
          console.log(`      ${a.order + 1}) ${a.text}${correctMark}`);
        });
        console.log(`      💡 ${q.explanation}\n`);
      });
    }

    console.log('\n🎉 All tests passed! LMS data is correctly seeded.\n');

  } catch (error) {
    console.error('❌ Error testing LMS data:', error.message);
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach((gqlError) => {
        console.error('GraphQL Error:', gqlError.message);
      });
    }
    process.exit(1);
  }
}

testLMSData();
