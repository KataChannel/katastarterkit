/**
 * Seed Script: Timona Academy Data
 * 
 * This script seeds sample data for Timona Academy including:
 * - Course Categories
 * - Courses
 * - Instructors
 * - FAQs
 * - Testimonials
 * - Branches
 * 
 * Run with: cd backend && npx ts-node scripts/seed-timona-academy.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  console.log('\n📚 Seeding Course Categories...');
  
  const categories = [
    {
      name: 'Chăm sóc da - Spa',
      slug: 'cham-soc-da-spa',
      description: 'Các khóa học về chăm sóc da mặt, body, điều trị mụn, nám, tàn nhang',
      featuredImage: '/images/categories/spa.jpg',
      displayOrder: 0,
      isActive: true,
    },
    {
      name: 'Phun xăm thẩm mỹ',
      slug: 'phun-xam-tham-my',
      description: 'Phun môi, phun mày, điêu khắc lông mày, nhũ hoa',
      featuredImage: '/images/categories/phun-xam.jpg',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Nối mi - Làm đẹp mắt',
      slug: 'noi-mi-lam-dep-mat',
      description: 'Nối mi cổ điển, nối mi volume, uốn mi, nhuộm mi',
      featuredImage: '/images/categories/noi-mi.jpg',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Gội đầu dưỡng sinh',
      slug: 'goi-dau-duong-sinh',
      description: 'Massage đầu vai gáy, dưỡng sinh, thư giãn',
      featuredImage: '/images/categories/goi-dau.jpg',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Nail - Làm móng',
      slug: 'nail-lam-mong',
      description: 'Làm móng cơ bản, nail art, đắp móng, vẽ gel',
      featuredImage: '/images/categories/nail.jpg',
      displayOrder: 4,
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
  
  const courses = [
    {
      title: 'Khóa học Kỹ thuật viên Chăm sóc da cơ bản',
      slug: 'ky-thuat-vien-cham-soc-da-co-ban',
      shortDescription: 'Học các kỹ năng chăm sóc da cơ bản, phân tích da, chăm sóc da mặt chuẩn quy trình',
      description: `
        <h2>Giới thiệu khóa học</h2>
        <p>Khóa học dành cho người mới bắt đầu muốn theo đuổi nghề Spa, Thẩm mỹ. Sau khóa học, học viên có thể tự tin làm việc tại các Spa, Thẩm mỹ viện.</p>
        
        <h2>Đối tượng phù hợp</h2>
        <ul>
          <li>Người mới bắt đầu, chưa có kinh nghiệm</li>
          <li>Muốn chuyển nghề sang lĩnh vực làm đẹp</li>
          <li>Muốn có kỹ năng chăm sóc da cho bản thân và gia đình</li>
        </ul>
      `,
      duration: '2 tháng',
      price: 15000000,
      discountPrice: 12000000,
      curriculum: [
        'Tổng quan về da và các loại da',
        'Phân tích da khách hàng',
        'Quy trình chăm sóc da mặt cơ bản',
        'Sử dụng mỹ phẩm và máy móc',
        'Massage mặt - vai gáy',
        'Thực hành trên model',
      ],
      benefits: [
        'Nhận bằng tốt nghiệp',
        'Được giới thiệu việc làm',
        'Học lại miễn phí nếu chưa đạt',
        'Tặng bộ dụng cụ thực hành',
      ],
      requirements: [
        'Không yêu cầu kinh nghiệm',
        'Đam mê ngành làm đẹp',
        'Có tinh thần học hỏi',
      ],
      featuredImage: '/images/courses/cham-soc-da-co-ban.jpg',
      isFeatured: true,
      displayOrder: 0,
      categorySlug: 'cham-soc-da-spa',
    },
    {
      title: 'Khóa học Chuyên gia Điều trị Mụn - Nám',
      slug: 'chuyen-gia-dieu-tri-mun-nam',
      shortDescription: 'Chuyên sâu về điều trị các vấn đề da: mụn, nám, tàn nhang, thâm sẹo',
      description: `
        <h2>Giới thiệu khóa học</h2>
        <p>Khóa học chuyên sâu dành cho người đã có kiến thức cơ bản về chăm sóc da, muốn nâng cao kỹ năng điều trị các vấn đề da phức tạp.</p>
      `,
      duration: '3 tháng',
      price: 25000000,
      discountPrice: 20000000,
      curriculum: [
        'Cơ chế hình thành mụn, nám',
        'Phân loại và đánh giá mức độ',
        'Các phương pháp điều trị hiện đại',
        'Sử dụng máy điện di, RF, laser',
        'Peel da, mesotherapy',
        'Xây dựng liệu trình điều trị',
      ],
      benefits: [
        'Chứng chỉ chuyên gia',
        'Thực hành trên khách hàng thực',
        'Hỗ trợ mở Spa',
        'Cập nhật công nghệ mới miễn phí',
      ],
      requirements: [
        'Đã học qua khóa chăm sóc da cơ bản',
        'Hoặc có ít nhất 6 tháng kinh nghiệm',
      ],
      featuredImage: '/images/courses/dieu-tri-mun-nam.jpg',
      isFeatured: true,
      displayOrder: 1,
      categorySlug: 'cham-soc-da-spa',
    },
    {
      title: 'Khóa học Phun môi Collagen',
      slug: 'phun-moi-collagen',
      shortDescription: 'Kỹ thuật phun môi căng bóng, không sưng, không đau, lên màu chuẩn',
      description: `
        <h2>Giới thiệu khóa học</h2>
        <p>Học kỹ thuật phun môi hiện đại nhất, tạo màu tự nhiên, môi căng mọng không đau.</p>
      `,
      duration: '1.5 tháng',
      price: 18000000,
      discountPrice: 15000000,
      curriculum: [
        'Lý thuyết về màu sắc',
        'Kỹ thuật phun môi Crystal Lips',
        'Phun môi Collagen baby lips',
        'Xử lý các trường hợp khó',
        'Thực hành trên model',
      ],
      benefits: [
        'Tặng máy phun hiện đại',
        'Mực phun chính hãng',
        'Cam kết ra nghề',
      ],
      requirements: [
        'Không yêu cầu kinh nghiệm',
      ],
      featuredImage: '/images/courses/phun-moi.jpg',
      isFeatured: true,
      displayOrder: 0,
      categorySlug: 'phun-xam-tham-my',
    },
    {
      title: 'Khóa học Điêu khắc lông mày',
      slug: 'dieu-khac-long-may',
      shortDescription: 'Điêu khắc sợi 6D, 9D tạo dáng mày phù hợp khuôn mặt',
      description: `
        <h2>Giới thiệu khóa học</h2>
        <p>Học kỹ thuật điêu khắc lông mày hiện đại, tạo sợi chân thật như mày thật.</p>
      `,
      duration: '1.5 tháng',
      price: 20000000,
      discountPrice: 16000000,
      curriculum: [
        'Thiết kế dáng mày theo khuôn mặt',
        'Kỹ thuật khắc sợi 6D, 9D',
        'Phối màu và pha mực',
        'Thực hành trên mặt giả',
        'Thực hành trên model thật',
      ],
      benefits: [
        'Tặng bộ dụng cụ đầy đủ',
        'Hỗ trợ khách hàng thực hành',
      ],
      requirements: [],
      featuredImage: '/images/courses/dieu-khac-may.jpg',
      isFeatured: false,
      displayOrder: 1,
      categorySlug: 'phun-xam-tham-my',
    },
    {
      title: 'Khóa học Nối mi Classic',
      slug: 'noi-mi-classic',
      shortDescription: 'Kỹ thuật nối mi 1:1 cổ điển, tạo hàng mi tự nhiên',
      description: `
        <h2>Giới thiệu khóa học</h2>
        <p>Học kỹ thuật nối mi cổ điển, phù hợp người mới bắt đầu.</p>
      `,
      duration: '1 tháng',
      price: 8000000,
      discountPrice: 6000000,
      curriculum: [
        'Kiến thức về mi tự nhiên',
        'Chọn size và độ cong mi',
        'Kỹ thuật cách ly mi',
        'Nối mi 1:1',
        'Thực hành trên model',
      ],
      benefits: [
        'Tặng bộ mi và keo',
        'Cam kết ra nghề',
      ],
      requirements: [],
      featuredImage: '/images/courses/noi-mi-classic.jpg',
      isFeatured: true,
      displayOrder: 0,
      categorySlug: 'noi-mi-lam-dep-mat',
    },
    {
      title: 'Khóa học Gội đầu dưỡng sinh',
      slug: 'goi-dau-duong-sinh',
      shortDescription: 'Massage đầu vai gáy kết hợp gội đầu thư giãn',
      description: `
        <h2>Giới thiệu khóa học</h2>
        <p>Học kỹ thuật massage đầu kết hợp gội đầu thư giãn, giảm stress hiệu quả.</p>
      `,
      duration: '2 tuần',
      price: 5000000,
      discountPrice: 4000000,
      curriculum: [
        'Các huyệt đạo trên đầu',
        'Kỹ thuật massage đầu',
        'Massage vai gáy',
        'Quy trình gội đầu dưỡng sinh',
      ],
      benefits: [
        'Hoàn thành nhanh',
        'Ứng dụng ngay',
      ],
      requirements: [],
      featuredImage: '/images/courses/goi-dau.jpg',
      isFeatured: false,
      displayOrder: 0,
      categorySlug: 'goi-dau-duong-sinh',
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
      title: 'Chuyên gia Chăm sóc da',
      position: 'Giảng viên chính',
      bio: 'Hơn 15 năm kinh nghiệm trong ngành Spa & Thẩm mỹ. Từng làm việc tại các thương hiệu lớn như Oriflame, The Face Shop. Đã đào tạo hơn 2000 học viên thành công.',
      shortBio: '15+ năm kinh nghiệm - Thạc sĩ Da liễu',
      experience: ['15+ năm kinh nghiệm Spa & Thẩm mỹ', 'Đào tạo hơn 2000 học viên'],
      certifications: ['Thạc sĩ Da liễu - ĐH Y Hà Nội', 'Chứng chỉ quốc tế CIDESCO'],
      specialties: ['Điều trị mụn', 'Điều trị nám', 'Chăm sóc da cao cấp'],
      avatar: '/images/instructors/huong.jpg',
      displayOrder: 0,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'CN. Trần Văn Minh',
      slug: 'cn-tran-van-minh',
      title: 'Master Phun xăm thẩm mỹ',
      position: 'Giảng viên',
      bio: 'Chứng chỉ quốc tế từ Hàn Quốc, Nhật Bản. Top 10 Master Phun xăm Việt Nam 2023. Đã phun hơn 10.000 khách hàng.',
      shortBio: '10+ năm kinh nghiệm - Top 10 Master Phun xăm VN',
      experience: ['10+ năm kinh nghiệm phun xăm thẩm mỹ', 'Phun hơn 10.000 khách hàng'],
      certifications: ['Master Microblading - Korea', 'PMU Certificate - Japan'],
      specialties: ['Phun mày 6D', 'Phun môi Collagen', 'Điêu khắc chân mày'],
      avatar: '/images/instructors/minh.jpg',
      displayOrder: 1,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'CN. Phạm Thu Thảo',
      slug: 'cn-pham-thu-thao',
      title: 'Chuyên gia Nối mi',
      position: 'Giảng viên',
      bio: 'Giải nhất cuộc thi Nối mi toàn quốc 2022. Chuyên gia đào tạo cho các thương hiệu mi lớn.',
      shortBio: '8+ năm kinh nghiệm - Giải nhất Nối mi toàn quốc',
      experience: ['8+ năm kinh nghiệm nối mi', 'Giải nhất cuộc thi Nối mi toàn quốc 2022'],
      certifications: ['Lash Artist Certificate', 'Volume Lash Master'],
      specialties: ['Nối mi Volume', 'Nối mi Mega Volume', 'Lash Lift'],
      avatar: '/images/instructors/thao.jpg',
      displayOrder: 2,
      isActive: true,
      isFeatured: true,
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
  
  const branches = [
    {
      name: 'Timona Academy - Hà Nội (Trụ sở chính)',
      slug: 'timona-ha-noi',
      address: '123 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      phone: '024 1234 5678',
      email: 'hanoi@timona.edu.vn',
      hotline: '19002109',
      workingHours: '8:00 - 21:00 (T2-CN)',
      description: 'Cơ sở chính của Timona Academy tại Hà Nội',
      shortDescription: 'Trụ sở chính - Hà Nội',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096949193941!2d105.8191932!3d21.0277644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAxJzQwLjAiTiAxMDXCsDQ5JzEwLjMiRQ!5e0!3m2!1svi!2svn!4v1234567890',
      isActive: true,
      isFeatured: true,
      displayOrder: 0,
    },
    {
      name: 'Timona Academy - Hồ Chí Minh',
      slug: 'timona-ho-chi-minh',
      address: '456 Điện Biên Phủ, Quận 3, TP. Hồ Chí Minh',
      phone: '028 1234 5678',
      email: 'hcm@timona.edu.vn',
      hotline: '19002109',
      workingHours: '8:00 - 21:00 (T2-CN)',
      description: 'Cơ sở Timona Academy tại TP. Hồ Chí Minh',
      shortDescription: 'Chi nhánh TP.HCM',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177580558583!2d106.6878859!3d10.7731271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzIzLjMiTiAxMDbCsDQxJzE2LjQiRQ!5e0!3m2!1svi!2svn!4v1234567890',
      isActive: true,
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: 'Timona Academy - Đà Nẵng',
      slug: 'timona-da-nang',
      address: '789 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
      phone: '0236 1234 5678',
      email: 'danang@timona.edu.vn',
      hotline: '19002109',
      workingHours: '8:00 - 21:00 (T2-CN)',
      description: 'Cơ sở Timona Academy tại Đà Nẵng',
      shortDescription: 'Chi nhánh Đà Nẵng',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.9370377506576!2d108.2207534!3d16.0678086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDA0JzA0LjEiTiAxMDjCsDEzJzE0LjciRQ!5e0!3m2!1svi!2svn!4v1234567890',
      isActive: true,
      isFeatured: false,
      displayOrder: 2,
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
