/**
 * SEED DATA: Dự án Chuyển đổi hosting và fix website Timona
 * 
 * Dự án chuyển đổi công nghệ và hosting cho website timona.vn
 * User: katachanneloffical@gmail.com
 * 
 * 2 Giai đoạn:
 * 1. Quá trình chuyển đổi công nghệ mới (8/12 - 15/12/2025) - 1 tuần
 * 2. Fix giao diện + khai báo Google SEO (15/12 - 22/12/2025) - 1 tuần
 */

import { PrismaClient, ProjectMethodology, TaskStatus, TaskPriority, TaskCategory } from '@prisma/client';

const prisma = new PrismaClient();

// Project ID cố định để dễ tìm kiếm
const TIMONA_PROJECT_ID = 'timona-migration-project';
const ADMIN_EMAIL = 'katachanneloffical@gmail.com';

async function main() {
  console.log('🚀 Seeding Timona Migration Project...');

  // 1. Tìm user katachanneloffical@gmail.com (chính xác email)
  const adminUser = await prisma.user.findFirst({
    where: { email: ADMIN_EMAIL }
  });

  if (!adminUser) {
    throw new Error(`❌ Không tìm thấy user với email: ${ADMIN_EMAIL}`);
  }

  console.log(`✅ Tìm thấy user: ${adminUser.email} (ID: ${adminUser.id})`);

  // 2. Tạo dự án với methodology HYBRID (kết hợp Timeline/Gantt + Kanban)
  const project = await prisma.project.upsert({
    where: { id: TIMONA_PROJECT_ID },
    update: {
      name: 'Chuyển đổi hosting và fix website timona',
      description: `Dự án chuyển đổi hosting và cập nhật website timona.vn lên công nghệ mới.

📅 Timeline:
- Giai đoạn 1 (8/12 - 15/12/2025): Chuyển đổi công nghệ mới
- Giai đoạn 2 (15/12 - 22/12/2025): Fix giao diện + SEO

🎯 Mục tiêu:
- Website chạy trên công nghệ mới ổn định
- Giao diện responsive, tối ưu mobile
- Khôi phục chỉ số SEO trên Google`,
      methodology: ProjectMethodology.HYBRID,
      enabledViews: ['LIST', 'KANBAN', 'TIMELINE', 'CALENDAR', 'DASHBOARD'],
      ownerId: adminUser.id, // Cập nhật owner
    },
    create: {
      id: TIMONA_PROJECT_ID,
      name: 'Chuyển đổi hosting và fix website timona',
      description: `Dự án chuyển đổi hosting và cập nhật website timona.vn lên công nghệ mới.

📅 Timeline:
- Giai đoạn 1 (8/12 - 15/12/2025): Chuyển đổi công nghệ mới
- Giai đoạn 2 (15/12 - 22/12/2025): Fix giao diện + SEO

🎯 Mục tiêu:
- Website chạy trên công nghệ mới ổn định
- Giao diện responsive, tối ưu mobile
- Khôi phục chỉ số SEO trên Google`,
      avatar: '🔄',
      methodology: ProjectMethodology.HYBRID,
      enabledViews: ['LIST', 'KANBAN', 'TIMELINE', 'CALENDAR', 'DASHBOARD'],
      ownerId: adminUser.id,
    }
  });

  console.log(`✅ Tạo/cập nhật dự án: ${project.name}`);

  // 2.5. Thêm owner vào members (để có quyền truy cập)
  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: TIMONA_PROJECT_ID,
        userId: adminUser.id,
      }
    },
    update: {
      role: 'owner',
    },
    create: {
      projectId: TIMONA_PROJECT_ID,
      userId: adminUser.id,
      role: 'owner',
    }
  });

  console.log(`✅ Đã thêm owner vào members`);

  // 3. Xóa tasks cũ của project (nếu có)
  await prisma.task.deleteMany({
    where: { projectId: TIMONA_PROJECT_ID }
  });

  console.log('🗑️ Đã xóa tasks cũ');

  // ========================================
  // GIAI ĐOẠN 1: Chuyển đổi công nghệ mới
  // 8/12/2025 - 15/12/2025
  // ========================================
  const phase1Tasks = [
    {
      title: 'Backup toàn bộ dữ liệu website cũ',
      description: `- Backup database MySQL/PostgreSQL
- Backup files (images, uploads)
- Backup cấu hình nginx/apache
- Lưu trữ vào Google Drive/S3`,
      priority: TaskPriority.URGENT,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-08'),
      kanbanColumn: 'todo',
      storyPoints: 3,
      tags: ['backup', 'database', 'giai-doan-1'],
    },
    {
      title: 'Setup môi trường server mới',
      description: `- Cài đặt Docker/Docker Compose
- Setup Nginx Proxy Manager
- Cấu hình SSL/HTTPS với Let's Encrypt
- Setup firewall và bảo mật cơ bản`,
      priority: TaskPriority.URGENT,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-09'),
      kanbanColumn: 'todo',
      storyPoints: 5,
      tags: ['server', 'docker', 'giai-doan-1'],
    },
    {
      title: 'Deploy ứng dụng mới lên server',
      description: `- Pull source code từ Git
- Build Docker images
- Chạy docker-compose up
- Verify các services hoạt động`,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-10'),
      kanbanColumn: 'todo',
      storyPoints: 5,
      tags: ['deploy', 'docker', 'giai-doan-1'],
    },
    {
      title: 'Migrate dữ liệu từ database cũ',
      description: `- Chạy migration scripts
- Import data từ backup
- Verify data integrity
- Test các API endpoints`,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-11'),
      kanbanColumn: 'todo',
      storyPoints: 8,
      tags: ['migration', 'database', 'giai-doan-1'],
    },
    {
      title: 'Test toàn bộ chức năng trên môi trường staging',
      description: `- Test login/register
- Test các trang chính
- Test form liên hệ, đăng ký
- Test trên mobile/tablet
- Fix các bugs phát sinh`,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-12'),
      kanbanColumn: 'todo',
      storyPoints: 5,
      tags: ['testing', 'qa', 'giai-doan-1'],
    },
    {
      title: 'Cấu hình DNS trỏ về server mới',
      description: `- Cập nhật A record trên Cloudflare/DNS provider
- Verify DNS propagation
- Test truy cập với domain thật
- Monitor traffic trong 24h`,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-14'),
      kanbanColumn: 'todo',
      storyPoints: 3,
      tags: ['dns', 'domain', 'giai-doan-1'],
    },
    {
      title: 'Tắt server cũ và bật server mới chính thức',
      description: `📅 Deadline: 15/12/2025

Công việc:
- Verify website mới hoạt động ổn định
- Tắt các services trên server cũ
- Cập nhật Cloudflare settings
- Monitor performance 24/7 trong 3 ngày đầu
- Backup lại 1 lần cuối trước khi xóa server cũ`,
      priority: TaskPriority.URGENT,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-15'),
      kanbanColumn: 'todo',
      storyPoints: 5,
      tags: ['production', 'go-live', 'giai-doan-1'],
    },
  ];

  // ========================================
  // GIAI ĐOẠN 2: Fix giao diện + SEO
  // 15/12/2025 - 22/12/2025
  // ========================================
  const phase2Tasks = [
    {
      title: 'Khai báo website với Google Search Console',
      description: `- Verify ownership domain trên Google Search Console
- Submit sitemap.xml
- Request indexing cho các trang quan trọng
- Setup email notifications cho issues`,
      priority: TaskPriority.URGENT,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-15'),
      kanbanColumn: 'todo',
      storyPoints: 3,
      tags: ['seo', 'google', 'giai-doan-2'],
    },
    {
      title: 'Cấu hình Google Analytics 4',
      description: `- Tạo property GA4 mới
- Cài đặt tracking code
- Setup goals/events quan trọng
- Verify data collection hoạt động`,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-16'),
      kanbanColumn: 'todo',
      storyPoints: 3,
      tags: ['analytics', 'google', 'giai-doan-2'],
    },
    {
      title: 'Tối ưu SEO on-page cho trang chủ',
      description: `- Cập nhật meta title, description
- Optimize heading structure (H1, H2, H3)
- Add schema markup (Organization, LocalBusiness)
- Optimize images với alt tags
- Add Open Graph & Twitter Cards`,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-17'),
      kanbanColumn: 'todo',
      storyPoints: 5,
      tags: ['seo', 'on-page', 'giai-doan-2'],
    },
    {
      title: 'Fix giao diện responsive trên mobile',
      description: `- Fix layout bị vỡ trên iPhone/Android
- Optimize touch targets
- Test trên các breakpoints: 320px, 375px, 414px, 768px
- Fix font size và spacing`,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-18'),
      kanbanColumn: 'todo',
      storyPoints: 8,
      tags: ['ui', 'mobile', 'responsive', 'giai-doan-2'],
    },
    {
      title: 'Tối ưu tốc độ tải trang (Core Web Vitals)',
      description: `Mục tiêu: Đạt điểm xanh trên PageSpeed Insights

- Optimize LCP (Largest Contentful Paint) < 2.5s
- Optimize FID (First Input Delay) < 100ms
- Optimize CLS (Cumulative Layout Shift) < 0.1
- Compress images với WebP format
- Enable lazy loading
- Minify CSS/JS`,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-19'),
      kanbanColumn: 'todo',
      storyPoints: 8,
      tags: ['performance', 'seo', 'core-web-vitals', 'giai-doan-2'],
    },
    {
      title: 'Setup redirect 301 cho URLs cũ',
      description: `- Liệt kê tất cả URLs từ sitemap cũ
- Tạo mapping old URLs -> new URLs
- Cấu hình redirect 301 trong nginx/code
- Test tất cả redirects hoạt động đúng
- Submit URL removal nếu cần`,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-20'),
      kanbanColumn: 'todo',
      storyPoints: 5,
      tags: ['seo', 'redirect', 'giai-doan-2'],
    },
    {
      title: 'Fix các lỗi giao diện còn lại',
      description: `- Review toàn bộ các trang
- Fix bugs UI/UX
- Test cross-browser (Chrome, Firefox, Safari, Edge)
- Fix dark mode issues (nếu có)`,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-21'),
      kanbanColumn: 'todo',
      storyPoints: 5,
      tags: ['ui', 'bug-fix', 'giai-doan-2'],
    },
    {
      title: 'Review và đánh giá kết quả chuyển đổi',
      description: `📅 Deadline: 22/12/2025

Checklist cuối cùng:
✅ Website hoạt động ổn định 24/7
✅ Không có lỗi 404, 500
✅ Mobile responsive hoàn hảo
✅ Google đã index các trang chính
✅ Analytics tracking đúng
✅ Tốc độ tải trang < 3s
✅ SSL/HTTPS hoạt động
✅ Forms hoạt động đúng
✅ Email notifications hoạt động`,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      dueDate: new Date('2025-12-22'),
      kanbanColumn: 'todo',
      storyPoints: 3,
      tags: ['review', 'qa', 'giai-doan-2'],
    },
  ];

  // 4. Tạo tất cả tasks
  const allTasks = [...phase1Tasks, ...phase2Tasks];
  let order = 0;

  for (const taskData of allTasks) {
    await prisma.task.create({
      data: {
        ...taskData,
        projectId: TIMONA_PROJECT_ID,
        userId: adminUser.id,
        order: order++,
        assignedTo: [adminUser.id],
      } as any
    });
  }

  console.log(`✅ Tạo ${allTasks.length} tasks`);
  console.log(`   - Giai đoạn 1: ${phase1Tasks.length} tasks`);
  console.log(`   - Giai đoạn 2: ${phase2Tasks.length} tasks`);

  // 5. Tạo View Config cho Timeline
  await prisma.projectViewConfig.upsert({
    where: {
      projectId_viewType_userId: {
        projectId: TIMONA_PROJECT_ID,
        viewType: 'TIMELINE',
        userId: adminUser.id,
      }
    },
    update: {
      isDefault: true,
      config: {
        viewMode: 'gantt',
        showDependencies: true,
        showCriticalPath: true,
        colorBy: 'priority',
      },
    },
    create: {
      projectId: TIMONA_PROJECT_ID,
      viewType: 'TIMELINE',
      userId: adminUser.id,
      isDefault: true,
      order: 0,
      config: {
        viewMode: 'gantt',
        showDependencies: true,
        showCriticalPath: true,
        colorBy: 'priority',
      },
    },
  });

  await prisma.projectViewConfig.upsert({
    where: {
      projectId_viewType_userId: {
        projectId: TIMONA_PROJECT_ID,
        viewType: 'KANBAN',
        userId: adminUser.id,
      }
    },
    update: {
      order: 1,
      config: {
        columns: ['todo', 'in_progress', 'review', 'done'],
        swimLanes: 'priority',
      },
    },
    create: {
      projectId: TIMONA_PROJECT_ID,
      viewType: 'KANBAN',
      userId: adminUser.id,
      isDefault: false,
      order: 1,
      config: {
        columns: ['todo', 'in_progress', 'review', 'done'],
        swimLanes: 'priority',
      },
    },
  });

  console.log('✅ Tạo view configurations');

  // Summary
  console.log('');
  console.log('🎉 Seeding hoàn thành!');
  console.log('');
  console.log('📊 Tổng kết:');
  console.log(`  - Dự án: ${project.name}`);
  console.log(`  - Owner: ${adminUser.email || adminUser.username}`);
  console.log(`  - Methodology: ${project.methodology}`);
  console.log(`  - Tổng tasks: ${allTasks.length}`);
  console.log('');
  console.log('📅 Timeline:');
  console.log('  - Giai đoạn 1 (8/12 - 15/12/2025): Chuyển đổi công nghệ');
  console.log('  - Giai đoạn 2 (15/12 - 22/12/2025): Fix UI + SEO');
  console.log('');
  console.log(`🔗 Project ID: ${TIMONA_PROJECT_ID}`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
