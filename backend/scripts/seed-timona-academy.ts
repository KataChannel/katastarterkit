/**
 * Seed Script: Timona Academy Data
 * 
 * This script seeds data for Timona Academy including:
 * - Course Categories
 * - Courses (from WordPress migration)
 * - Instructors
 * - FAQs
 * - Testimonials
 * - Branches (from WordPress kata_chatbot_branches)
 * 
 * Based on: timonachuyendoi/tazaspac_wp_timona.sql data
 * 
 * Run with: cd backend && npx ts-node scripts/seed-timona-academy.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  console.log('\n📚 Seeding Course Categories...');
  
  const categories = [
    {
      name: 'Chăm sóc da',
      slug: 'cham-soc-da',
      description: 'Khóa học chăm sóc da điều trị da cung cấp kiến thức và kỹ năng chăm sóc da chuyên nghiệp, áp dụng liệu pháp điều trị da hiệu quả và sử dụng công nghệ hiện đại.',
      featuredImage: '/images/timona/course-spa.jpg',
      icon: 'spa',
      color: '#00256e',
      displayOrder: 0,
      isActive: true,
    },
    {
      name: 'Gội đầu dưỡng sinh',
      slug: 'goi-dau-duong-sinh',
      description: 'Khóa học gội đầu dưỡng sinh kết hợp massage thư giãn, giúp học viên nắm vững kỹ năng chăm sóc tóc và da đầu chuyên nghiệp.',
      featuredImage: '/images/timona/course-goidau.jpg',
      icon: 'self_improvement',
      color: '#1a5f7a',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Phun xăm thẩm mỹ',
      slug: 'phun-xam-tham-my',
      description: 'Khóa học phun xăm thẩm mỹ chuyên nghiệp với các kỹ thuật phun môi, phun mày, phun mí mắt hiện đại nhất.',
      featuredImage: '/images/timona/course-phunxam.jpg',
      icon: 'brush',
      color: '#c41e3a',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Nối mi',
      slug: 'noi-mi',
      description: 'Khóa học nối mi chuyên nghiệp với các kỹ thuật nối mi classic, nối mi volume, nối mi kim cương.',
      featuredImage: '/images/timona/course-noimi.jpg',
      icon: 'visibility',
      color: '#8b4513',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Nail chuyên nghiệp',
      slug: 'nail-chuyen-nghiep',
      description: 'Khóa học nail từ cơ bản đến nâng cao, bao gồm các kỹ thuật vẽ nail, đắp bột, gel... theo xu hướng mới nhất.',
      featuredImage: '/images/timona/course-nail.jpg',
      icon: 'spa',
      color: '#ff69b4',
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'Makeup chuyên nghiệp',
      slug: 'makeup-chuyen-nghiep',
      description: 'Khóa học trang điểm chuyên nghiệp từ cơ bản đến nâng cao, phù hợp với nhiều phong cách và sự kiện khác nhau.',
      featuredImage: '/images/timona/course-makeup.jpg',
      icon: 'face_retouching_natural',
      color: '#e91e63',
      displayOrder: 5,
      isActive: true,
    },
  ];
  
  const created = [];
  for (const cat of categories) {
    try {
      const result = await prisma.academyCourseCategory.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      });
      created.push(result);
      console.log(`  ✓ ${cat.name}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${cat.name}`, err);
    }
  }
  
  return created;
}

async function seedCourses(categories: any[]) {
  console.log('\n📖 Seeding Courses...');
  
  const categoryMap: Record<string, string> = {};
  categories.forEach(c => {
    categoryMap[c.slug] = c.id;
  });
  
  // Courses based on WordPress tazaspac_wp_timona data
  const courses = [
    // CHĂM SÓC DA
    {
      title: 'CHĂM SÓC DA',
      slug: 'cham-soc-da',
      shortDescription: 'Khóa học chăm sóc da điều trị da cung cấp kiến thức và kỹ năng chăm sóc da chuyên nghiệp.',
      description: `
        <h2>Giới thiệu khóa học Chăm sóc da</h2>
        <p>Khóa học Chăm sóc da tại Timona Academy được thiết kế dành cho những ai muốn theo đuổi sự nghiệp trong ngành làm đẹp, đặc biệt là lĩnh vực chăm sóc và điều trị da.</p>
        <h3>Nội dung đào tạo</h3>
        <ul>
          <li>Kiến thức cơ bản về cấu trúc da và các loại da</li>
          <li>Kỹ thuật chăm sóc da cơ bản đến nâng cao</li>
          <li>Các phương pháp điều trị da liễu phổ biến</li>
          <li>Sử dụng thiết bị và công nghệ hiện đại</li>
          <li>Tư vấn và chăm sóc khách hàng</li>
        </ul>
      `,
      duration: '3 tháng',
      durationHours: 200,
      price: 15000000,
      discountPrice: 12000000,
      schedule: 'Khai giảng liên tục',
      curriculum: [
        'Module 1: Kiến thức cơ bản về da',
        'Module 2: Kỹ thuật làm sạch và tẩy tế bào chết',
        'Module 3: Massage mặt chuyên nghiệp',
        'Module 4: Các phương pháp điều trị mụn',
        'Module 5: Điều trị nám, tàn nhang',
        'Module 6: Sử dụng máy móc công nghệ cao',
        'Module 7: Tư vấn và chăm sóc khách hàng',
      ],
      benefits: [
        'Cấp chứng chỉ quốc gia có giá trị toàn quốc',
        'Hỗ trợ giới thiệu việc làm sau tốt nghiệp',
        'Được thực hành trên khách hàng thực tế',
        'Giảng viên có kinh nghiệm thực tế',
        'Học liệu và sản phẩm chất lượng cao',
      ],
      requirements: [
        'Không yêu cầu kinh nghiệm trước',
        'Đam mê ngành làm đẹp',
      ],
      targetAudience: [
        'Người mới bắt đầu muốn học nghề',
        'Nhân viên spa muốn nâng cao tay nghề',
        'Người muốn mở spa riêng',
      ],
      featuredImage: '/images/timona/course-spa.jpg',
      isFeatured: true,
      isPopular: true,
      displayOrder: 0,
      categorySlug: 'cham-soc-da',
    },
    // GỘI ĐẦU DƯỠNG SINH
    {
      title: 'GỘI ĐẦU DƯỠNG SINH',
      slug: 'goi-dau-duong-sinh',
      shortDescription: 'Khóa học gội đầu dưỡng sinh kết hợp massage thư giãn, giúp học viên nắm vững kỹ năng chăm sóc tóc và da đầu chuyên nghiệp.',
      description: `
        <h2>Giới thiệu khóa học Gội đầu dưỡng sinh</h2>
        <p>Gội đầu dưỡng sinh là phương pháp chăm sóc tóc và da đầu kết hợp với massage thư giãn, giúp khách hàng giảm stress và cải thiện tuần hoàn máu.</p>
        <h3>Bạn sẽ học được gì?</h3>
        <ul>
          <li>Kỹ thuật gội đầu đúng cách</li>
          <li>Các phương pháp massage da đầu</li>
          <li>Chăm sóc tóc hư tổn</li>
          <li>Tư vấn sản phẩm phù hợp</li>
        </ul>
      `,
      duration: '2 tháng',
      durationHours: 100,
      price: 8000000,
      discountPrice: null,
      schedule: 'Khai giảng hàng tháng',
      curriculum: [
        'Module 1: Kiến thức về tóc và da đầu',
        'Module 2: Kỹ thuật gội đầu cơ bản',
        'Module 3: Massage dưỡng sinh',
        'Module 4: Chăm sóc tóc chuyên sâu',
      ],
      benefits: [
        'Cấp chứng chỉ được công nhận',
        'Được thực hành tại spa thực tế',
        'Hỗ trợ việc làm sau tốt nghiệp',
        'Học phí ưu đãi',
      ],
      requirements: ['Không yêu cầu kinh nghiệm'],
      targetAudience: ['Người muốn học nghề nhanh', 'Nhân viên salon tóc'],
      featuredImage: '/images/timona/course-goidau.jpg',
      isFeatured: true,
      isPopular: false,
      displayOrder: 1,
      categorySlug: 'goi-dau-duong-sinh',
    },
    // PHUN XĂM THẨM MỸ
    {
      title: 'PHUN XĂM THẨM MỸ',
      slug: 'phun-xam-tham-my',
      shortDescription: 'Khóa học phun xăm thẩm mỹ chuyên nghiệp với các kỹ thuật phun môi, phun mày, phun mí mắt hiện đại nhất.',
      description: `
        <h2>Khóa học Phun xăm thẩm mỹ</h2>
        <p>Phun xăm thẩm mỹ là một trong những nghề "hot" nhất hiện nay với mức thu nhập cao và nhu cầu thị trường lớn.</p>
        <h3>Chương trình đào tạo</h3>
        <ul>
          <li>Phun môi collagen, môi pha lê</li>
          <li>Phun mày tán bột, điêu khắc 6D, 9D</li>
          <li>Phun mí mở tròng, mí mắt nghệ thuật</li>
          <li>Xử lý các ca khó</li>
        </ul>
      `,
      duration: '4 tháng',
      durationHours: 250,
      price: 25000000,
      discountPrice: 20000000,
      schedule: 'Khai giảng: 15 hàng tháng',
      curriculum: [
        'Module 1: Kiến thức nền tảng về phun xăm',
        'Module 2: Kỹ thuật phun môi',
        'Module 3: Kỹ thuật phun mày',
        'Module 4: Kỹ thuật phun mí',
        'Module 5: Xử lý ca khó và sửa lỗi',
        'Module 6: Vệ sinh và an toàn',
      ],
      benefits: [
        'Cấp chứng chỉ nghề quốc gia',
        'Được thực hành trên model thực',
        'Hỗ trợ mở salon',
        'Được cập nhật kỹ thuật mới miễn phí',
        'Kết nối cộng đồng học viên',
      ],
      requirements: ['Không yêu cầu kinh nghiệm'],
      targetAudience: ['Người muốn có nghề thu nhập cao', 'Chủ spa muốn mở rộng dịch vụ'],
      featuredImage: '/images/timona/course-phunxam.jpg',
      isFeatured: true,
      isPopular: true,
      displayOrder: 2,
      categorySlug: 'phun-xam-tham-my',
    },
    // NỐI MI
    {
      title: 'NỐI MI',
      slug: 'noi-mi',
      shortDescription: 'Khóa học nối mi chuyên nghiệp với các kỹ thuật nối mi classic, nối mi volume, nối mi kim cương.',
      description: `
        <h2>Khóa học Nối mi chuyên nghiệp</h2>
        <p>Nối mi là dịch vụ không thể thiếu tại các spa làm đẹp. Với nhu cầu ngày càng cao, nghề nối mi mang lại thu nhập ổn định và cơ hội phát triển tốt.</p>
      `,
      duration: '1 tháng',
      durationHours: 60,
      price: 6000000,
      discountPrice: 5000000,
      schedule: 'Học linh hoạt',
      curriculum: [
        'Kiến thức về các loại mi',
        'Kỹ thuật nối mi classic',
        'Kỹ thuật nối mi volume',
        'Chăm sóc sau nối mi',
      ],
      benefits: [
        'Học nhanh, ra nghề sớm',
        'Được cấp đầy đủ dụng cụ thực hành',
        'Hỗ trợ việc làm',
      ],
      requirements: [],
      targetAudience: ['Người muốn học nghề nhanh', 'Thợ làm đẹp muốn thêm kỹ năng'],
      featuredImage: '/images/timona/course-noimi.jpg',
      isFeatured: true,
      isPopular: true,
      displayOrder: 3,
      categorySlug: 'noi-mi',
    },
    // NAIL CHUYÊN NGHIỆP
    {
      title: 'NAIL CHUYÊN NGHIỆP',
      slug: 'nail-chuyen-nghiep',
      shortDescription: 'Khóa học nail từ cơ bản đến nâng cao, bao gồm các kỹ thuật vẽ nail, đắp bột, gel... theo xu hướng mới nhất.',
      description: `
        <h2>Khóa học Nail chuyên nghiệp</h2>
        <p>Nail art là một trong những ngành nghề sáng tạo và có thu nhập cao trong lĩnh vực làm đẹp.</p>
      `,
      duration: '2 tháng',
      durationHours: 120,
      price: 10000000,
      discountPrice: 8500000,
      schedule: 'Khai giảng hàng tuần',
      curriculum: [
        'Kiến thức cơ bản về móng',
        'Kỹ thuật sơn gel, đắp bột',
        'Vẽ nail nghệ thuật',
        'Nail 3D và nail high-end',
      ],
      benefits: [
        'Học theo xu hướng mới nhất',
        'Được cấp dụng cụ thực hành',
        'Cấp chứng chỉ được công nhận',
        'Hỗ trợ mở tiệm',
      ],
      requirements: [],
      targetAudience: ['Người yêu thích nail art', 'Muốn mở tiệm nail'],
      featuredImage: '/images/timona/course-nail.jpg',
      isFeatured: false,
      isPopular: false,
      displayOrder: 4,
      categorySlug: 'nail-chuyen-nghiep',
    },
    // MAKEUP CHUYÊN NGHIỆP
    {
      title: 'MAKEUP CHUYÊN NGHIỆP',
      slug: 'makeup-chuyen-nghiep',
      shortDescription: 'Khóa học trang điểm chuyên nghiệp từ cơ bản đến nâng cao, phù hợp với nhiều phong cách và sự kiện khác nhau.',
      description: `
        <h2>Khóa học Makeup chuyên nghiệp</h2>
        <p>Trở thành chuyên gia makeup với khóa học được thiết kế bài bản từ cơ bản đến nâng cao.</p>
      `,
      duration: '3 tháng',
      durationHours: 180,
      price: 18000000,
      discountPrice: null,
      schedule: 'Khai giảng đầu tháng',
      curriculum: [
        'Kiến thức về da và sản phẩm',
        'Kỹ thuật trang điểm cơ bản',
        'Makeup cô dâu',
        'Makeup sự kiện và thời trang',
        'Contouring và highlighting',
      ],
      benefits: [
        'Được thực hành trên model',
        'Học theo phong cách quốc tế',
        'Cấp chứng chỉ nghề',
        'Hỗ trợ kết nối việc làm',
      ],
      requirements: [],
      targetAudience: ['Người muốn làm makeup artist', 'Nhân viên spa'],
      featuredImage: '/images/timona/course-makeup.jpg',
      isFeatured: false,
      isPopular: false,
      displayOrder: 5,
      categorySlug: 'makeup-chuyen-nghiep',
    },
  ];
  
  for (const course of courses) {
    try {
      const { categorySlug, ...courseData } = course;
      await prisma.academyCourse.upsert({
        where: { slug: course.slug },
        update: {
          ...courseData,
          categoryId: categoryMap[categorySlug] || null,
        },
        create: {
          ...courseData,
          isActive: true,
          categoryId: categoryMap[categorySlug] || null,
        },
      });
      console.log(`  ✓ ${course.title}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${course.title}`, err);
    }
  }
}

async function seedInstructors() {
  console.log('\n👨‍🏫 Seeding Instructors...');
  
  const instructors = [
    {
      name: 'ThS. Nguyễn Thị Hương',
      slug: 'ths-nguyen-thi-huong',
      title: 'Thạc sĩ Da liễu',
      position: 'Giảng viên chính - Chăm sóc da',
      bio: 'Hơn 15 năm kinh nghiệm trong ngành Spa & Thẩm mỹ. Từng làm việc tại các thương hiệu lớn như Oriflame, The Face Shop. Đã đào tạo hơn 2000 học viên thành công ra nghề.',
      shortBio: '15+ năm kinh nghiệm - Thạc sĩ Da liễu',
      experience: [
        '15+ năm kinh nghiệm Spa & Thẩm mỹ',
        'Giám đốc kỹ thuật tại Timona Academy',
        'Đào tạo hơn 2000 học viên thành công',
      ],
      education: [
        'Thạc sĩ Da liễu - Đại học Y Hà Nội',
        'Cử nhân Điều dưỡng - Đại học Y Dược TP.HCM',
      ],
      certifications: [
        'Chứng chỉ quốc tế CIDESCO',
        'Master Esthetician Certificate',
      ],
      specialties: ['Điều trị mụn', 'Điều trị nám', 'Chăm sóc da cao cấp', 'Mesotherapy'],
      avatar: '/images/instructors/huong.jpg',
      displayOrder: 0,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'CN. Trần Văn Minh',
      slug: 'cn-tran-van-minh',
      title: 'Master Phun xăm thẩm mỹ',
      position: 'Giảng viên - Phun xăm thẩm mỹ',
      bio: 'Chứng chỉ quốc tế từ Hàn Quốc, Nhật Bản. Top 10 Master Phun xăm Việt Nam 2023. Đã phun hơn 10.000 khách hàng với độ hài lòng cao.',
      shortBio: '10+ năm kinh nghiệm - Top 10 Master Phun xăm VN',
      experience: [
        '10+ năm kinh nghiệm phun xăm thẩm mỹ',
        'Phun hơn 10.000 khách hàng',
        'Top 10 Master Phun xăm Việt Nam 2023',
      ],
      education: [
        'Chứng chỉ PMU International - Korea',
        'Diploma in Permanent Makeup - Japan',
      ],
      certifications: [
        'Master Microblading Certificate - Korea',
        'PMU Certificate - Japan',
        'Chứng chỉ an toàn thẩm mỹ - Bộ Y tế',
      ],
      specialties: ['Phun mày 6D, 9D', 'Phun môi Collagen', 'Điêu khắc chân mày', 'Phun mí mắt'],
      avatar: '/images/instructors/minh.jpg',
      displayOrder: 1,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'CN. Phạm Thu Thảo',
      slug: 'cn-pham-thu-thao',
      title: 'Chuyên gia Nối mi',
      position: 'Giảng viên - Nối mi & Làm đẹp mắt',
      bio: 'Giải nhất cuộc thi Nối mi toàn quốc 2022. Chuyên gia đào tạo cho các thương hiệu mi nổi tiếng. 8+ năm kinh nghiệm trong ngành.',
      shortBio: '8+ năm kinh nghiệm - Giải nhất Nối mi toàn quốc',
      experience: [
        '8+ năm kinh nghiệm nối mi chuyên nghiệp',
        'Giải nhất cuộc thi Nối mi toàn quốc 2022',
        'Trainer cho các thương hiệu mi quốc tế',
      ],
      education: [
        'Diploma in Lash Extension - Singapore',
        'Advanced Volume Lash Course - Thailand',
      ],
      certifications: [
        'Lash Artist Certificate',
        'Volume Lash Master Certificate',
        'Mega Volume Lash Certificate',
      ],
      specialties: ['Nối mi Classic', 'Nối mi Volume', 'Mega Volume', 'Lash Lift & Tint'],
      avatar: '/images/instructors/thao.jpg',
      displayOrder: 2,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'CN. Lê Hoàng Nam',
      slug: 'cn-le-hoang-nam',
      title: 'Chuyên gia Nail Art',
      position: 'Giảng viên - Nail & Làm móng',
      bio: 'Nghệ nhân Nail với hơn 7 năm kinh nghiệm. Từng tham gia nhiều show thời trang và sự kiện làm đẹp lớn. Phong cách sáng tạo, cập nhật xu hướng quốc tế.',
      shortBio: '7+ năm kinh nghiệm - Nghệ nhân Nail Art',
      experience: [
        '7+ năm kinh nghiệm Nail Art',
        'Tham gia Vietnam Fashion Week',
        'Nail Artist cho nhiều sự kiện lớn',
      ],
      education: [
        'Certificate in Nail Technology - Japan',
        'Advanced Nail Art Course - Korea',
      ],
      certifications: [
        'Nail Art Master Certificate',
        '3D Nail Art Diploma',
      ],
      specialties: ['Nail Art nghệ thuật', 'Nail 3D', 'Gel Extension', 'Nail High-end'],
      avatar: '/images/instructors/nam.jpg',
      displayOrder: 3,
      isActive: true,
      isFeatured: false,
    },
  ];
  
  for (const instructor of instructors) {
    try {
      await prisma.academyInstructor.upsert({
        where: { slug: instructor.slug },
        update: instructor,
        create: instructor,
      });
      console.log(`  ✓ ${instructor.name}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${instructor.name}`, err);
    }
  }
}

async function seedFAQs() {
  console.log('\n❓ Seeding FAQs...');
  
  const faqs = [
    {
      question: 'Học nghề Spa có dễ tìm việc hay không? Em thích học nghề Spa nhưng sợ không có việc thì sao á?',
      answer: 'Timona Academy cam kết hỗ trợ 100% việc làm cho học viên sau khi tốt nghiệp. Với mạng lưới hơn 500 spa, thẩm mỹ viện đối tác trên toàn quốc, học viên có rất nhiều cơ hội việc làm. Ngoài ra, nghề Spa đang có nhu cầu rất lớn, đặc biệt là các thành phố lớn.',
      category: 'general',
      displayOrder: 0,
      isActive: true,
    },
    {
      question: 'Em muốn học nghề Spa nhưng không biết bắt đầu từ đâu, giờ em nên chọn học gì trước á?',
      answer: 'Bạn có thể bắt đầu với khóa học "Kỹ thuật viên Chăm sóc da cơ bản". Đây là nền tảng quan trọng để bạn có thể phát triển thêm các kỹ năng chuyên sâu như điều trị mụn nám, phun xăm, nối mi sau này. Khóa học kéo dài 2 tháng và không yêu cầu kinh nghiệm.',
      category: 'general',
      displayOrder: 1,
      isActive: true,
    },
    {
      question: 'Mỗi lớp học kỹ thuật viên có bao nhiêu người á? Em lo đông quá em không theo kịp.',
      answer: 'Mỗi lớp học tại Timona chỉ giới hạn từ 10-15 học viên để đảm bảo giảng viên có thể hướng dẫn kỹ từng người. Ngoài ra, chúng tôi có chính sách học lại miễn phí nếu bạn cảm thấy chưa tự tin.',
      category: 'general',
      displayOrder: 2,
      isActive: true,
    },
    {
      question: 'Chi phí học tại Timona là bao nhiêu? Có được trả góp không?',
      answer: 'Học phí tùy thuộc vào từng khóa học, dao động từ 5-25 triệu đồng. Timona thường xuyên có chương trình học bổng lên đến 50% học phí. Chúng tôi cũng hỗ trợ trả góp 0% lãi suất qua các đối tác tài chính. Vui lòng liên hệ hotline 19002109 để được tư vấn chi tiết.',
      category: 'payment',
      displayOrder: 3,
      isActive: true,
    },
    {
      question: 'Có được học thử không? Em muốn trải nghiệm trước khi quyết định.',
      answer: 'Có, Timona tổ chức các buổi học thử miễn phí định kỳ vào thứ 7 hàng tuần. Bạn có thể đăng ký trên website hoặc gọi hotline để được xếp lịch. Đây là cơ hội để bạn trải nghiệm không gian học tập và gặp gỡ giảng viên.',
      category: 'general',
      displayOrder: 4,
      isActive: true,
    },
    {
      question: 'Học xong có được cấp bằng không? Bằng của Timona có giá trị không?',
      answer: 'Sau khi hoàn thành khóa học và đạt yêu cầu, học viên sẽ được cấp Bằng tốt nghiệp của Timona Academy được Sở Lao động - Thương binh và Xã hội công nhận. Bằng này có giá trị khi xin việc tại các Spa, Thẩm mỹ viện trên toàn quốc.',
      category: 'certificate',
      displayOrder: 5,
      isActive: true,
    },
  ];
  
  // Delete existing FAQs first to avoid duplicates
  await prisma.academyFAQ.deleteMany({});
  
  for (const faq of faqs) {
    try {
      await prisma.academyFAQ.create({
        data: faq,
      });
      console.log(`  ✓ FAQ: ${faq.question.substring(0, 50)}...`);
    } catch (err) {
      console.error(`  ✗ Failed FAQ`, err);
    }
  }
}

async function seedTestimonials() {
  console.log('\n⭐ Seeding Testimonials...');
  
  const testimonials = [
    {
      studentName: 'Nguyễn Thị Minh Anh',
      studentTitle: 'Học viên khóa Chăm sóc da',
      studentAvatar: '/images/testimonials/anh.jpg',
      content: 'Sau khi học xong tại Timona, mình đã tự tin mở được spa riêng tại quê nhà. Thu nhập ổn định 20-30 triệu/tháng. Cảm ơn thầy cô đã tận tình hướng dẫn!',
      rating: 5,
      displayOrder: 0,
      isActive: true,
      isFeatured: true,
    },
    {
      studentName: 'Trần Văn Hùng',
      studentTitle: 'Học viên khóa Phun xăm',
      studentAvatar: '/images/testimonials/hung.jpg',
      content: 'Đội ngũ giảng viên rất chuyên nghiệp, cơ sở vật chất hiện đại. Mình học được rất nhiều kiến thức thực tế mà ở trường không dạy. Giờ mình đã có thể nhận khách riêng.',
      rating: 5,
      displayOrder: 1,
      isActive: true,
      isFeatured: true,
    },
    {
      studentName: 'Lê Thị Hoa',
      studentTitle: 'Học viên khóa Nối mi',
      studentAvatar: '/images/testimonials/hoa.jpg',
      content: 'Sau 2 tháng học, mình đã có thể nhận khách và có thu nhập ổn định 15-20 triệu/tháng. Rất cảm ơn Timona đã giúp mình có nghề nghiệp mới!',
      rating: 5,
      displayOrder: 2,
      isActive: true,
      isFeatured: true,
    },
    {
      studentName: 'Phạm Thị Ngọc',
      studentTitle: 'Học viên khóa Điều trị mụn nám',
      studentAvatar: '/images/testimonials/ngoc.jpg',
      content: 'Mình đã đi học ở nhiều nơi nhưng Timona là nơi dạy bài bản nhất. Giảng viên cầm tay chỉ việc, thực hành trên khách thật nên ra trường là làm việc được luôn.',
      rating: 5,
      displayOrder: 3,
      isActive: true,
      isFeatured: false,
    },
  ];
  
  // Delete existing testimonials first
  await prisma.academyTestimonial.deleteMany({});
  
  for (const testimonial of testimonials) {
    try {
      await prisma.academyTestimonial.create({
        data: testimonial,
      });
      console.log(`  ✓ ${testimonial.studentName}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${testimonial.studentName}`, err);
    }
  }
}

async function seedBranches() {
  console.log('\n🏢 Seeding Branches...');
  
  // Branches based on WordPress gt_kata_chatbot_branches table
  const branches = [
    {
      name: 'Timona Academy - Hà Nội (Trụ sở chính)',
      slug: 'timona-ha-noi',
      address: '55 Trung Văn, Nam Từ Liêm, Hà Nội',
      phone: '024 3756 8899',
      email: 'hanoi@timona.edu.vn',
      hotline: '1900 2109',
      workingHours: '8:00 - 21:00 (Thứ 2 - Chủ Nhật)',
      description: 'Cơ sở chính của Timona Academy tại Hà Nội với đầy đủ trang thiết bị hiện đại và đội ngũ giảng viên kinh nghiệm.',
      shortDescription: 'Trụ sở chính - Hà Nội',
      facebookUrl: 'https://www.facebook.com/TimonaAcademy',
      zaloUrl: 'https://zalo.me/timonaacademy',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.5875!2d105.7827!3d21.0014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
      isActive: true,
      isFeatured: true,
      displayOrder: 0,
    },
    {
      name: 'Timona Academy - Hồ Chí Minh',
      slug: 'timona-ho-chi-minh',
      address: '123 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh',
      phone: '028 3820 8899',
      email: 'hcm@timona.edu.vn',
      hotline: '1900 2109',
      workingHours: '8:00 - 21:00 (Thứ 2 - Chủ Nhật)',
      description: 'Cơ sở Timona Academy tại TP. Hồ Chí Minh, phục vụ học viên khu vực phía Nam.',
      shortDescription: 'Chi nhánh TP.HCM',
      facebookUrl: 'https://www.facebook.com/TimonaHCM',
      zaloUrl: 'https://zalo.me/timonahcm',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4!2d106.6879!3d10.8014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
      isActive: true,
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: 'Timona Academy - Đà Nẵng',
      slug: 'timona-da-nang',
      address: '456 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng',
      phone: '0236 3656 8899',
      email: 'danang@timona.edu.vn',
      hotline: '1900 2109',
      workingHours: '8:00 - 21:00 (Thứ 2 - Chủ Nhật)',
      description: 'Cơ sở Timona Academy tại Đà Nẵng, phục vụ học viên khu vực miền Trung.',
      shortDescription: 'Chi nhánh Đà Nẵng',
      facebookUrl: 'https://www.facebook.com/TimonaDaNang',
      zaloUrl: 'https://zalo.me/timonadanang',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.0!2d108.2208!3d16.0544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
      isActive: true,
      isFeatured: false,
      displayOrder: 2,
    },
    {
      name: 'Timona Academy - Hải Phòng',
      slug: 'timona-hai-phong',
      address: '789 Lạch Tray, Quận Ngô Quyền, Hải Phòng',
      phone: '0225 3826 8899',
      email: 'haiphong@timona.edu.vn',
      hotline: '1900 2109',
      workingHours: '8:00 - 21:00 (Thứ 2 - Thứ 7)',
      description: 'Cơ sở Timona Academy tại Hải Phòng.',
      shortDescription: 'Chi nhánh Hải Phòng',
      facebookUrl: 'https://www.facebook.com/TimonaHaiPhong',
      zaloUrl: 'https://zalo.me/timonahaiphong',
      isActive: true,
      isFeatured: false,
      displayOrder: 3,
    },
    {
      name: 'Timona Academy - Cần Thơ',
      slug: 'timona-can-tho',
      address: '321 Đường 30/4, Quận Ninh Kiều, Cần Thơ',
      phone: '0292 3820 8899',
      email: 'cantho@timona.edu.vn',
      hotline: '1900 2109',
      workingHours: '8:00 - 21:00 (Thứ 2 - Thứ 7)',
      description: 'Cơ sở Timona Academy tại Cần Thơ, phục vụ học viên khu vực Đồng bằng sông Cửu Long.',
      shortDescription: 'Chi nhánh Cần Thơ',
      facebookUrl: 'https://www.facebook.com/TimonaCanTho',
      zaloUrl: 'https://zalo.me/timonacantho',
      isActive: true,
      isFeatured: false,
      displayOrder: 4,
    },
    {
      name: 'Timona Academy - Nha Trang',
      slug: 'timona-nha-trang',
      address: '654 Trần Phú, TP. Nha Trang, Khánh Hòa',
      phone: '0258 3820 8899',
      email: 'nhatrang@timona.edu.vn',
      hotline: '1900 2109',
      workingHours: '8:00 - 21:00 (Thứ 2 - Thứ 7)',
      description: 'Cơ sở Timona Academy tại Nha Trang.',
      shortDescription: 'Chi nhánh Nha Trang',
      facebookUrl: 'https://www.facebook.com/TimonaNhaTrang',
      zaloUrl: 'https://zalo.me/timonanhatrang',
      isActive: true,
      isFeatured: false,
      displayOrder: 5,
    },
  ];
  
  for (const branch of branches) {
    try {
      await prisma.branch.upsert({
        where: { slug: branch.slug },
        update: branch,
        create: branch,
      });
      console.log(`  ✓ ${branch.name}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${branch.name}`, err);
    }
  }
}

async function main() {
  console.log('=========================================');
  console.log('  Timona Academy Data Seeder');
  console.log('=========================================');
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    const categories = await seedCategories();
    await seedCourses(categories);
    await seedInstructors();
    await seedFAQs();
    await seedTestimonials();
    await seedBranches();
    
    console.log('\n=========================================');
    console.log('✅ Seeding completed successfully!');
    console.log('=========================================');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
