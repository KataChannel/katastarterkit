import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script để:
 * 1. Xóa TẤT CẢ courses cũ
 * 2. Xóa categories cũ 
 * 3. Xóa users cũ (trừ admin chính)
 * 4. Giữ lại ONLY 8 courses mới vừa seed
 */

async function cleanupOldData() {
  console.log('🧹 Starting cleanup of old LMS data...\n');

  try {
    // Slugs của 8 courses mới cần GIỮ LẠI
    const keepCourseSlugs = [
      'react-fundamentals-2025',
      'nodejs-backend-2025',
      'flutter-mobile-2025',
      'python-data-science-2025',
      'vuejs-complete-2025',
      'nextjs-fullstack-2025',
      'typescript-master-2025',
      'docker-kubernetes-2025',
    ];

    console.log('📋 Courses to keep:');
    keepCourseSlugs.forEach((slug, i) => console.log(`  ${i + 1}. ${slug}`));
    console.log('');

    // 1. Get courses to DELETE (all except the 8 new ones)
    const coursesToDelete = await prisma.course.findMany({
      where: {
        slug: {
          notIn: keepCourseSlugs,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    console.log(`🗑️  Found ${coursesToDelete.length} old courses to delete:`);
    coursesToDelete.forEach((course, i) => {
      console.log(`  ${i + 1}. ${course.title} (${course.slug})`);
    });

    if (coursesToDelete.length > 0) {
      console.log('\n⚠️  Deleting old courses...');
      
      // Delete all related data (cascading will handle most)
      for (const course of coursesToDelete) {
        await prisma.course.delete({
          where: { id: course.id },
        });
      }
      
      console.log(`✅ Deleted ${coursesToDelete.length} old courses`);
    } else {
      console.log('✅ No old courses to delete');
    }

    // 2. Delete old categories (keep only Programming, Web Dev, Mobile Dev, Data Science)
    const keepCategorySlugs = [
      'programming',
      'web-development', 
      'mobile-development',
      'data-science',
    ];

    const categoriesToDelete = await prisma.courseCategory.findMany({
      where: {
        slug: {
          notIn: keepCategorySlugs,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    console.log(`\n🗑️  Found ${categoriesToDelete.length} old categories to delete:`);
    categoriesToDelete.forEach((cat, i) => {
      console.log(`  ${i + 1}. ${cat.name} (${cat.slug})`);
    });

    if (categoriesToDelete.length > 0) {
      console.log('\n⚠️  Deleting old categories...');
      
      for (const cat of categoriesToDelete) {
        try {
          await prisma.courseCategory.delete({
            where: { id: cat.id },
          });
        } catch (error: any) {
          if (error.code === 'P2025') {
            console.log(`  ⚠️  Category already deleted: ${cat.name}`);
          } else {
            console.error(`  ❌ Error deleting category ${cat.name}:`, error.message);
          }
        }
      }
      
      console.log(`✅ Deleted old categories`);
    } else {
      console.log('✅ No old categories to delete');
    }

    // 3. Delete old users (keep instructor@lms.com and student@lms.com)
    const keepUserEmails = [
      'instructor@lms.com',
      'student@lms.com',
      'admin@example.com', // Keep main admin if exists
    ];

    const usersToDelete = await prisma.user.findMany({
      where: {
        email: {
          notIn: keepUserEmails,
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        roleType: true,
      },
    });

    console.log(`\n🗑️  Found ${usersToDelete.length} old users to delete:`);
    usersToDelete.forEach((user, i) => {
      console.log(`  ${i + 1}. ${user.email} (${user.username}) - ${user.roleType}`);
    });

    if (usersToDelete.length > 0) {
      console.log('\n⚠️  Deleting old users...');
      
      for (const user of usersToDelete) {
        // Skip ADMIN users to be safe
        if (user.roleType === 'ADMIN') {
          console.log(`  ⚠️  Skipping ADMIN user: ${user.email}`);
          continue;
        }
        
        await prisma.user.delete({
          where: { id: user.id },
        });
      }
      
      console.log(`✅ Deleted ${usersToDelete.length} old users`);
    } else {
      console.log('✅ No old users to delete');
    }

    // 4. Verify final state
    console.log('\n\n📊 Final Database State:');
    console.log('========================');

    const finalCounts = {
      users: await prisma.user.count(),
      categories: await prisma.courseCategory.count(),
      courses: await prisma.course.count(),
      modules: await prisma.courseModule.count(),
      lessons: await prisma.lesson.count(),
      quizzes: await prisma.quiz.count(),
      questions: await prisma.question.count(),
      enrollments: await prisma.enrollment.count(),
    };

    Object.entries(finalCounts).forEach(([key, value]) => {
      console.log(`${key.padEnd(15)}: ${value}`);
    });

    // List final courses
    console.log('\n\n📚 Final Courses (should be exactly 8):');
    console.log('==========================================');

    const finalCourses = await prisma.course.findMany({
      select: {
        title: true,
        slug: true,
        price: true,
        level: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    finalCourses.forEach((course, i) => {
      console.log(`${i + 1}. ${course.title}`);
      console.log(`   Slug: ${course.slug}`);
      console.log(`   Price: ${course.price.toLocaleString()} VND`);
      console.log(`   Level: ${course.level}`);
      console.log(`   Status: ${course.status}\n`);
    });

    console.log(`\n✅ Cleanup complete! Database now has exactly ${finalCourses.length} courses.`);

    if (finalCourses.length !== 8) {
      console.warn(`\n⚠️  WARNING: Expected 8 courses but found ${finalCourses.length}!`);
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Confirm before running
console.log('⚠️  WARNING: This will DELETE all courses except the 8 new ones!');
console.log('⚠️  This action CANNOT be undone!\n');

cleanupOldData()
  .then(() => {
    console.log('\n🎉 Cleanup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  });
