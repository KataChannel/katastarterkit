/**
 * Migration Script: SQLite (timonachuyendoi) → PostgreSQL (shoprausach)
 * 
 * This script migrates data from the old timonachuyendoi SQLite database
 * to the new shoprausach PostgreSQL database.
 * 
 * Run with: cd backend && npx ts-node scripts/migrate-timona-data.ts
 */

import { PrismaClient as SourceClient } from '@prisma/client';
import { PrismaClient as DestClient } from '@prisma/client';
import * as path from 'path';

// Source: SQLite database from timonachuyendoi
const sourceDbPath = path.join(__dirname, '../../timonachuyendoi/prisma/dev.db');
console.log('Source database path:', sourceDbPath);

const sourcePrisma = new SourceClient({
  datasources: {
    db: {
      url: `file:${sourceDbPath}`,
    },
  },
});

// Destination: PostgreSQL database (uses .env configuration)
const destPrisma = new DestClient();

interface MigrationStats {
  categories: number;
  courses: number;
  branches: number;
  registrations: number;
  settings: number;
}

async function migrateCategories(): Promise<Map<string, string>> {
  console.log('\n📚 Migrating Course Categories...');
  
  const idMapping = new Map<string, string>();
  
  try {
    // Read from source SQLite
    const categories = await sourcePrisma.$queryRaw<any[]>`
      SELECT * FROM nx_course_categories ORDER BY displayOrder
    `;
    
    console.log(`Found ${categories.length} categories to migrate`);
    
    for (const cat of categories) {
      try {
        const created = await destPrisma.academyCourseCategory.upsert({
          where: { slug: cat.slug },
          update: {
            name: cat.name,
            description: cat.description || null,
            sortOrder: cat.displayOrder || 0,
            isActive: true,
          },
          create: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description || null,
            sortOrder: cat.displayOrder || 0,
            isActive: true,
          },
        });
        
        idMapping.set(cat.id, created.id);
        console.log(`  ✓ Category: ${cat.name}`);
      } catch (err) {
        console.error(`  ✗ Failed to migrate category ${cat.name}:`, err);
      }
    }
    
    console.log(`✅ Migrated ${idMapping.size} categories`);
  } catch (err) {
    console.error('Error reading source categories:', err);
  }
  
  return idMapping;
}

async function migrateCourses(categoryMapping: Map<string, string>): Promise<number> {
  console.log('\n📖 Migrating Courses...');
  
  let count = 0;
  
  try {
    const courses = await sourcePrisma.$queryRaw<any[]>`
      SELECT * FROM nx_courses WHERE isActive = 1 ORDER BY displayOrder
    `;
    
    console.log(`Found ${courses.length} courses to migrate`);
    
    for (const course of courses) {
      try {
        // Parse JSON fields
        let curriculum: string[] = [];
        let benefits: string[] = [];
        
        try {
          curriculum = course.curriculum ? JSON.parse(course.curriculum) : [];
        } catch {
          curriculum = course.curriculum ? [course.curriculum] : [];
        }
        
        try {
          benefits = course.benefits ? JSON.parse(course.benefits) : [];
        } catch {
          benefits = course.benefits ? [course.benefits] : [];
        }
        
        const newCategoryId = course.categoryId ? categoryMapping.get(course.categoryId) : null;
        
        await destPrisma.academyCourse.upsert({
          where: { slug: course.slug },
          update: {
            name: course.title,
            shortDescription: course.description?.substring(0, 500) || null,
            description: course.content || null,
            duration: course.duration || null,
            price: course.price ? parseFloat(course.price) : null,
            discountPrice: course.discountPrice ? parseFloat(course.discountPrice) : null,
            thumbnail: course.featuredImage || null,
            curriculum: curriculum,
            benefits: benefits,
            isActive: true,
            isFeatured: course.isFeatured === 1,
            sortOrder: course.displayOrder || 0,
            categoryId: newCategoryId,
          },
          create: {
            name: course.title,
            slug: course.slug,
            shortDescription: course.description?.substring(0, 500) || null,
            description: course.content || null,
            duration: course.duration || null,
            price: course.price ? parseFloat(course.price) : null,
            discountPrice: course.discountPrice ? parseFloat(course.discountPrice) : null,
            thumbnail: course.featuredImage || null,
            curriculum: curriculum,
            benefits: benefits,
            isActive: true,
            isFeatured: course.isFeatured === 1,
            sortOrder: course.displayOrder || 0,
            categoryId: newCategoryId,
          },
        });
        
        count++;
        console.log(`  ✓ Course: ${course.title}`);
      } catch (err) {
        console.error(`  ✗ Failed to migrate course ${course.title}:`, err);
      }
    }
    
    console.log(`✅ Migrated ${count} courses`);
  } catch (err) {
    console.error('Error reading source courses:', err);
  }
  
  return count;
}

async function migrateBranches(): Promise<number> {
  console.log('\n🏢 Migrating Branches...');
  
  let count = 0;
  
  try {
    const branches = await sourcePrisma.$queryRaw<any[]>`
      SELECT * FROM nx_branches WHERE isActive = 1 ORDER BY displayOrder
    `;
    
    console.log(`Found ${branches.length} branches to migrate`);
    
    for (const branch of branches) {
      try {
        // Generate a slug from name
        const slug = branch.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        
        await destPrisma.branch.upsert({
          where: { slug: slug },
          update: {
            name: branch.name,
            address: branch.address || null,
            phone: branch.phone || branch.hotline || null,
            email: branch.email || null,
            workingHours: branch.workingHours || null,
            isActive: true,
            isMain: branch.displayOrder === 0,
            sortOrder: branch.displayOrder || 0,
          },
          create: {
            name: branch.name,
            slug: slug,
            address: branch.address || null,
            phone: branch.phone || branch.hotline || null,
            email: branch.email || null,
            workingHours: branch.workingHours || null,
            isActive: true,
            isMain: branch.displayOrder === 0,
            sortOrder: branch.displayOrder || 0,
          },
        });
        
        count++;
        console.log(`  ✓ Branch: ${branch.name}`);
      } catch (err) {
        console.error(`  ✗ Failed to migrate branch ${branch.name}:`, err);
      }
    }
    
    console.log(`✅ Migrated ${count} branches`);
  } catch (err) {
    console.error('Error reading source branches:', err);
  }
  
  return count;
}

async function migrateRegistrations(): Promise<number> {
  console.log('\n📝 Migrating Course Registrations...');
  
  let count = 0;
  
  try {
    const registrations = await sourcePrisma.$queryRaw<any[]>`
      SELECT r.*, c.slug as courseSlug
      FROM nx_course_registrations r
      LEFT JOIN nx_courses c ON r.courseId = c.id
      ORDER BY r.createdAt DESC
    `;
    
    console.log(`Found ${registrations.length} registrations to migrate`);
    
    for (const reg of registrations) {
      try {
        // Find the corresponding course in destination
        let courseId = null;
        if (reg.courseSlug) {
          const course = await destPrisma.academyCourse.findUnique({
            where: { slug: reg.courseSlug },
            select: { id: true },
          });
          courseId = course?.id || null;
        }
        
        // Map status
        let status: 'NEW' | 'CONTACTED' | 'ENROLLED' | 'CANCELLED' | 'COMPLETED' = 'NEW';
        switch (reg.status) {
          case 'CONTACTED':
            status = 'CONTACTED';
            break;
          case 'CONFIRMED':
          case 'COMPLETED':
            status = 'COMPLETED';
            break;
          case 'CANCELLED':
            status = 'CANCELLED';
            break;
        }
        
        await destPrisma.academyCourseRegistration.create({
          data: {
            studentName: reg.fullName,
            phone: reg.phone,
            email: reg.email || null,
            courseId: courseId,
            branchId: null, // Will need to map if branches have different IDs
            notes: reg.note || null,
            source: reg.source || 'website',
            status: status,
            createdAt: new Date(reg.createdAt),
          },
        });
        
        count++;
      } catch (err) {
        console.error(`  ✗ Failed to migrate registration for ${reg.fullName}:`, err);
      }
    }
    
    console.log(`✅ Migrated ${count} registrations`);
  } catch (err) {
    console.error('Error reading source registrations:', err);
  }
  
  return count;
}

async function seedDefaultData() {
  console.log('\n🌱 Seeding default Academy data...');
  
  // Seed FAQ
  const faqs = [
    {
      question: 'Học nghề Spa có dễ tìm việc hay không?',
      answer: 'Timona Academy cam kết hỗ trợ 100% việc làm cho học viên sau khi tốt nghiệp. Với mạng lưới hơn 500 spa, thẩm mỹ viện đối tác trên toàn quốc, học viên có rất nhiều cơ hội việc làm.',
      category: 'general',
      sortOrder: 0,
    },
    {
      question: 'Mỗi lớp học có bao nhiêu người?',
      answer: 'Mỗi lớp học tại Timona chỉ giới hạn từ 10-15 học viên để đảm bảo giảng viên có thể hướng dẫn kỹ từng người.',
      category: 'general',
      sortOrder: 1,
    },
    {
      question: 'Chi phí học tại Timona là bao nhiêu?',
      answer: 'Học phí tùy thuộc vào từng khóa học. Timona thường xuyên có chương trình học bổng lên đến 50% học phí. Vui lòng liên hệ hotline 19002109 để được tư vấn chi tiết.',
      category: 'payment',
      sortOrder: 2,
    },
    {
      question: 'Có được học thử không?',
      answer: 'Có, Timona tổ chức các buổi học thử miễn phí định kỳ. Bạn có thể đăng ký trên website hoặc gọi hotline để được xếp lịch.',
      category: 'general',
      sortOrder: 3,
    },
  ];
  
  for (const faq of faqs) {
    try {
      await destPrisma.academyFAQ.upsert({
        where: { 
          id: `faq-${faq.sortOrder}`, // Temporary unique key
        },
        update: faq,
        create: {
          ...faq,
          isActive: true,
        },
      });
    } catch {
      // Create new if upsert fails
      await destPrisma.academyFAQ.create({
        data: {
          ...faq,
          isActive: true,
        },
      });
    }
  }
  console.log(`  ✓ Created ${faqs.length} FAQs`);
  
  // Seed Testimonials
  const testimonials = [
    {
      studentName: 'Nguyễn Thị Minh Anh',
      studentTitle: 'Học viên khóa Chăm sóc da',
      content: 'Sau khi học xong tại Timona, mình đã tự tin mở được spa riêng. Cảm ơn thầy cô đã tận tình hướng dẫn!',
      rating: 5,
      sortOrder: 0,
    },
    {
      studentName: 'Trần Văn Hùng',
      studentTitle: 'Học viên khóa Phun xăm',
      content: 'Đội ngũ giảng viên rất chuyên nghiệp, cơ sở vật chất hiện đại. Mình học được rất nhiều kiến thức thực tế.',
      rating: 5,
      sortOrder: 1,
    },
    {
      studentName: 'Lê Thị Hoa',
      studentTitle: 'Học viên khóa Nối mi',
      content: 'Sau 2 tháng học, mình đã có thể nhận khách và có thu nhập ổn định. Rất cảm ơn Timona!',
      rating: 5,
      sortOrder: 2,
    },
  ];
  
  for (const testimonial of testimonials) {
    await destPrisma.academyTestimonial.create({
      data: {
        ...testimonial,
        isActive: true,
        isFeatured: true,
      },
    });
  }
  console.log(`  ✓ Created ${testimonials.length} testimonials`);
  
  // Seed Instructors
  const instructors = [
    {
      name: 'ThS. Nguyễn Văn A',
      slug: 'ths-nguyen-van-a',
      title: 'Giảng viên Chăm sóc da',
      bio: 'Hơn 15 năm kinh nghiệm trong ngành thẩm mỹ, đã đào tạo hơn 1000 học viên.',
      experience: '15+ năm kinh nghiệm',
      sortOrder: 0,
    },
    {
      name: 'CN. Trần Thị B',
      slug: 'cn-tran-thi-b',
      title: 'Chuyên gia Phun xăm',
      bio: 'Chứng chỉ quốc tế về Phun xăm thẩm mỹ, từng làm việc tại các spa 5 sao.',
      experience: '10+ năm kinh nghiệm',
      sortOrder: 1,
    },
  ];
  
  for (const instructor of instructors) {
    await destPrisma.academyInstructor.upsert({
      where: { slug: instructor.slug },
      update: instructor,
      create: {
        ...instructor,
        isActive: true,
      },
    });
  }
  console.log(`  ✓ Created ${instructors.length} instructors`);
  
  console.log('✅ Default data seeding completed');
}

async function main() {
  console.log('=========================================');
  console.log('  Timona Data Migration Script');
  console.log('  SQLite → PostgreSQL');
  console.log('=========================================');
  
  const stats: MigrationStats = {
    categories: 0,
    courses: 0,
    branches: 0,
    registrations: 0,
    settings: 0,
  };
  
  try {
    // Connect to both databases
    await sourcePrisma.$connect();
    await destPrisma.$connect();
    
    console.log('✅ Connected to both databases');
    
    // Run migrations
    const categoryMapping = await migrateCategories();
    stats.categories = categoryMapping.size;
    
    stats.courses = await migrateCourses(categoryMapping);
    stats.branches = await migrateBranches();
    stats.registrations = await migrateRegistrations();
    
    // Seed additional data
    await seedDefaultData();
    
    // Summary
    console.log('\n=========================================');
    console.log('  Migration Summary');
    console.log('=========================================');
    console.log(`  Categories:    ${stats.categories}`);
    console.log(`  Courses:       ${stats.courses}`);
    console.log(`  Branches:      ${stats.branches}`);
    console.log(`  Registrations: ${stats.registrations}`);
    console.log('=========================================');
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sourcePrisma.$disconnect();
    await destPrisma.$disconnect();
  }
}

main();
