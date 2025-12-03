import { PrismaClient, ProjectMethodology, ProjectViewType, SprintStatus, RoadmapStatus, RoadmapPriority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Project Management Views Demo Data...');

  // Find demo user (admin or first user)
  let demoUser = await prisma.user.findFirst({
    where: { 
      OR: [
        { email: 'admin@rausach.vn' },
        { username: 'admin' },
      ]
    }
  });

  if (!demoUser) {
    // If no admin, use first user
    demoUser = await prisma.user.findFirst();
  }

  if (!demoUser) {
    throw new Error('❌ No user found in database. Please create a user first.');
  }

  console.log('✅ Demo user ready:', demoUser.email || demoUser.username);

  // 1. SCRUM PROJECT - E-commerce Platform
  const scrumProject = await prisma.project.upsert({
    where: { id: 'demo-scrum-project' },
    update: {},
    create: {
      id: 'demo-scrum-project',
      name: 'E-commerce Platform',
      description: 'Dự án xây dựng nền tảng thương mại điện tử với Scrum methodology',
      methodology: ProjectMethodology.SCRUM,
      enabledViews: ['LIST', 'KANBAN', 'BACKLOG', 'SPRINT', 'CALENDAR', 'DASHBOARD'],
      ownerId: demoUser.id,
      avatar: '🛒',
    }
  });

  console.log('✅ Created Scrum project:', scrumProject.name);

  // Create Sprints for Scrum project
  const sprint1 = await prisma.sprint.create({
    data: {
      name: 'Sprint 1 - User Authentication',
      goal: 'Hoàn thành hệ thống đăng nhập, đăng ký và quản lý người dùng',
      status: SprintStatus.COMPLETED,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-14'),
      capacity: 40,
      committed: 38,
      completed: 38,
      projectId: scrumProject.id,
    }
  });

  const sprint2 = await prisma.sprint.create({
    data: {
      name: 'Sprint 2 - Product Catalog',
      goal: 'Xây dựng hệ thống quản lý sản phẩm và danh mục',
      status: SprintStatus.ACTIVE,
      startDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-28'),
      capacity: 45,
      committed: 42,
      completed: 25,
      projectId: scrumProject.id,
    }
  });

  const sprint3 = await prisma.sprint.create({
    data: {
      name: 'Sprint 3 - Shopping Cart & Checkout',
      goal: 'Hoàn thiện giỏ hàng và quy trình thanh toán',
      status: SprintStatus.PLANNED,
      startDate: new Date('2024-12-29'),
      endDate: new Date('2025-01-11'),
      capacity: 50,
      committed: 0,
      completed: 0,
      projectId: scrumProject.id,
    }
  });

  console.log('✅ Created 3 sprints for Scrum project');

  // Create tasks for Scrum project
  const scrumTasks = [
    // Backlog
    {
      title: 'Thiết kế database schema cho sản phẩm',
      description: 'Tạo ERD và implement Prisma schema cho products, categories, variants',
      priority: 'HIGH',
      status: 'PENDING',
      storyPoints: 5,
      sprintId: null, // Backlog
      kanbanColumn: 'backlog',
      projectId: scrumProject.id,
      userId: demoUser.id,
    },
    {
      title: 'API tìm kiếm và filter sản phẩm',
      description: 'GraphQL API với full-text search và advanced filters',
      priority: 'MEDIUM',
      status: 'PENDING',
      storyPoints: 8,
      sprintId: null,
      kanbanColumn: 'backlog',
      projectId: scrumProject.id,
      userId: demoUser.id,
    },
    // Sprint 2 - Active
    {
      title: 'UI danh sách sản phẩm',
      description: 'Grid view với lazy loading và infinite scroll',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      storyPoints: 5,
      sprintId: sprint2.id,
      kanbanColumn: 'in_progress',
      projectId: scrumProject.id,
      userId: demoUser.id,
    },
    {
      title: 'Chi tiết sản phẩm với variant selector',
      description: 'Product detail page với size, color, quantity picker',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      storyPoints: 8,
      sprintId: sprint2.id,
      kanbanColumn: 'in_progress',
      projectId: scrumProject.id,
      userId: demoUser.id,
    },
    {
      title: 'Quản lý inventory và stock',
      description: 'Real-time inventory tracking và low stock alerts',
      priority: 'MEDIUM',
      status: 'PENDING',
      storyPoints: 5,
      sprintId: sprint2.id,
      kanbanColumn: 'todo',
      projectId: scrumProject.id,
      userId: demoUser.id,
    },
    // Sprint 1 - Completed
    {
      title: 'Login với email/password',
      description: 'Form validation, error handling, JWT tokens',
      priority: 'HIGH',
      status: 'COMPLETED',
      storyPoints: 5,
      sprintId: sprint1.id,
      kanbanColumn: 'done',
      projectId: scrumProject.id,
      userId: demoUser.id,
      completedAt: new Date('2024-12-05'),
    },
    {
      title: 'Social login (Google, Facebook)',
      description: 'OAuth integration với Google và Facebook',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      storyPoints: 8,
      sprintId: sprint1.id,
      kanbanColumn: 'done',
      projectId: scrumProject.id,
      userId: demoUser.id,
      completedAt: new Date('2024-12-08'),
    },
  ];

  for (const taskData of scrumTasks) {
    await prisma.task.create({ data: taskData as any });
  }

  console.log('✅ Created tasks for Scrum project');

  // 2. KANBAN PROJECT - Marketing Campaign
  const kanbanProject = await prisma.project.upsert({
    where: { id: 'demo-kanban-project' },
    update: {},
    create: {
      id: 'demo-kanban-project',
      name: 'Marketing Campaign Q1 2025',
      description: 'Chiến dịch marketing cho quý 1 năm 2025 với Kanban workflow',
      methodology: ProjectMethodology.KANBAN,
      enabledViews: ['LIST', 'KANBAN', 'CALENDAR', 'DASHBOARD'],
      ownerId: demoUser.id,
      avatar: '📢',
    }
  });

  console.log('✅ Created Kanban project:', kanbanProject.name);

  // Kanban tasks
  const kanbanTasks = [
    {
      title: 'Nghiên cứu đối tượng khách hàng mục tiêu',
      description: 'Phân tích demographics, behaviors, pain points',
      priority: 'HIGH',
      status: 'COMPLETED',
      kanbanColumn: 'done',
      projectId: kanbanProject.id,
      userId: demoUser.id,
      completedAt: new Date('2024-11-20'),
    },
    {
      title: 'Thiết kế landing page',
      description: 'Mockup và prototype cho landing page campaign',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      kanbanColumn: 'in_progress',
      projectId: kanbanProject.id,
      userId: demoUser.id,
    },
    {
      title: 'Viết content cho blog posts',
      description: '5 bài blog về chủ đề sản phẩm mới',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      kanbanColumn: 'in_progress',
      projectId: kanbanProject.id,
      userId: demoUser.id,
    },
    {
      title: 'Setup Google Ads campaign',
      description: 'Tạo ads, keywords, targeting',
      priority: 'HIGH',
      status: 'PENDING',
      kanbanColumn: 'todo',
      projectId: kanbanProject.id,
      userId: demoUser.id,
      dueDate: new Date('2025-01-05'),
    },
    {
      title: 'Chuẩn bị email marketing templates',
      description: 'Design và code responsive email templates',
      priority: 'MEDIUM',
      status: 'PENDING',
      kanbanColumn: 'todo',
      projectId: kanbanProject.id,
      userId: demoUser.id,
      dueDate: new Date('2025-01-10'),
    },
  ];

  for (const taskData of kanbanTasks) {
    await prisma.task.create({ data: taskData as any });
  }

  console.log('✅ Created tasks for Kanban project');

  // 3. WATERFALL PROJECT - Enterprise System
  const waterfallProject = await prisma.project.upsert({
    where: { id: 'demo-waterfall-project' },
    update: {},
    create: {
      id: 'demo-waterfall-project',
      name: 'Enterprise Resource Planning System',
      description: 'Hệ thống ERP cho doanh nghiệp lớn với Waterfall methodology',
      methodology: ProjectMethodology.WATERFALL,
      enabledViews: ['LIST', 'TIMELINE', 'CALENDAR', 'DASHBOARD'],
      ownerId: demoUser.id,
      avatar: '🏢',
    }
  });

  console.log('✅ Created Waterfall project:', waterfallProject.name);

  // Waterfall phases as tasks
  const waterfallTasks = [
    {
      title: 'Requirements Gathering',
      description: 'Thu thập và phân tích yêu cầu từ stakeholders',
      priority: 'URGENT',
      status: 'COMPLETED',
      projectId: waterfallProject.id,
      userId: demoUser.id,
      dueDate: new Date('2024-10-31'),
      completedAt: new Date('2024-10-28'),
    },
    {
      title: 'System Design',
      description: 'Thiết kế kiến trúc hệ thống, database, APIs',
      priority: 'URGENT',
      status: 'COMPLETED',
      projectId: waterfallProject.id,
      userId: demoUser.id,
      dueDate: new Date('2024-11-30'),
      completedAt: new Date('2024-11-25'),
    },
    {
      title: 'Implementation - Phase 1',
      description: 'Develop core modules: Authentication, User Management',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      projectId: waterfallProject.id,
      userId: demoUser.id,
      dueDate: new Date('2024-12-31'),
    },
    {
      title: 'Implementation - Phase 2',
      description: 'Develop business modules: Inventory, Sales, Purchase',
      priority: 'HIGH',
      status: 'PENDING',
      projectId: waterfallProject.id,
      userId: demoUser.id,
      dueDate: new Date('2025-02-28'),
    },
    {
      title: 'Integration Testing',
      description: 'Test tích hợp giữa các modules',
      priority: 'HIGH',
      status: 'PENDING',
      projectId: waterfallProject.id,
      userId: demoUser.id,
      dueDate: new Date('2025-03-31'),
    },
    {
      title: 'User Acceptance Testing',
      description: 'UAT với end users',
      priority: 'MEDIUM',
      status: 'PENDING',
      projectId: waterfallProject.id,
      userId: demoUser.id,
      dueDate: new Date('2025-04-15'),
    },
    {
      title: 'Deployment & Go-live',
      description: 'Deploy to production và training users',
      priority: 'URGENT',
      status: 'PENDING',
      projectId: waterfallProject.id,
      userId: demoUser.id,
      dueDate: new Date('2025-04-30'),
    },
  ];

  for (const taskData of waterfallTasks) {
    await prisma.task.create({ data: taskData as any });
  }

  console.log('✅ Created tasks for Waterfall project');

  // 4. Create Roadmap Items
  const roadmapItems = [
    {
      title: 'Mobile App Launch',
      description: 'iOS và Android native apps cho E-commerce platform',
      status: RoadmapStatus.IN_PROGRESS,
      priority: RoadmapPriority.HIGH,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      quarter: 'Q1 2025',
      progress: 35,
      estimatedValue: 'High - Tăng 40% mobile users',
      projectId: scrumProject.id,
      ownerId: demoUser.id,
    },
    {
      title: 'AI Product Recommendations',
      description: 'Machine learning engine cho personalized recommendations',
      status: RoadmapStatus.PLANNED,
      priority: RoadmapPriority.MEDIUM,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-06-30'),
      quarter: 'Q2 2025',
      progress: 0,
      estimatedValue: 'Medium - Tăng 15% conversion rate',
      projectId: scrumProject.id,
      ownerId: demoUser.id,
    },
    {
      title: 'International Expansion',
      description: 'Multi-currency, multi-language, international shipping',
      status: RoadmapStatus.IDEA,
      priority: RoadmapPriority.LOW,
      quarter: 'Q3 2025',
      progress: 0,
      estimatedValue: 'High - Mở rộng thị trường châu Á',
      projectId: scrumProject.id,
      ownerId: demoUser.id,
    },
    {
      title: 'Advanced Analytics Dashboard',
      description: 'Real-time analytics và business intelligence',
      status: RoadmapStatus.IN_PROGRESS,
      priority: RoadmapPriority.CRITICAL,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-02-28'),
      quarter: 'Q1 2025',
      progress: 60,
      estimatedValue: 'Critical - Data-driven decisions',
      projectId: waterfallProject.id,
      ownerId: demoUser.id,
    },
  ];

  for (const roadmapData of roadmapItems) {
    await prisma.roadmapItem.create({ data: roadmapData as any });
  }

  console.log('✅ Created roadmap items');

  // 5. Create View Configs
  const viewConfigs = [
    // Scrum project - Sprint view is default
    {
      viewType: ProjectViewType.SPRINT,
      isDefault: true,
      order: 0,
      projectId: scrumProject.id,
      config: {
        showVelocityChart: true,
        showBurndownChart: true,
        groupBy: 'status',
      },
    },
    {
      viewType: ProjectViewType.BACKLOG,
      order: 1,
      projectId: scrumProject.id,
      config: {
        sortBy: 'priority',
        showStoryPoints: true,
      },
    },
    // Kanban project - Kanban view is default
    {
      viewType: ProjectViewType.KANBAN,
      isDefault: true,
      order: 0,
      projectId: kanbanProject.id,
      config: {
        columns: ['backlog', 'todo', 'in_progress', 'review', 'done'],
        swimLanes: 'priority',
        showWIPLimits: true,
      },
    },
    // Waterfall project - Timeline view is default
    {
      viewType: ProjectViewType.TIMELINE,
      isDefault: true,
      order: 0,
      projectId: waterfallProject.id,
      config: {
        viewMode: 'gantt',
        showDependencies: true,
        showCriticalPath: true,
      },
    },
  ];

  for (const configData of viewConfigs) {
    await prisma.projectViewConfig.create({ data: configData as any });
  }

  console.log('✅ Created view configurations');

  console.log('');
  console.log('🎉 Seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('  - 3 Projects (Scrum, Kanban, Waterfall)');
  console.log('  - 3 Sprints (1 completed, 1 active, 1 planned)');
  console.log('  - 19 Tasks across all projects');
  console.log('  - 4 Roadmap items');
  console.log('  - 4 View configurations');
  console.log('');
  console.log('🔗 Projects:');
  console.log(`  - Scrum: ${scrumProject.id} - "${scrumProject.name}"`);
  console.log(`  - Kanban: ${kanbanProject.id} - "${kanbanProject.name}"`);
  console.log(`  - Waterfall: ${waterfallProject.id} - "${waterfallProject.name}"`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
