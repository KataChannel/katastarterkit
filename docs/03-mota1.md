# Phân tích Cấu trúc Hệ thống Todos - rausachcore

## 🔍 Tổng quan Kiến trúc

Hệ thống Todos của rausachcore được xây dựng theo kiến trúc **Fullstack GraphQL** với **Dynamic CRUD Operations** và **Real-time capabilities**. Đây là một hệ thống quản lý công việc hiện đại với nhiều tính năng nâng cao.

### 🏆 Điểm mạnh kiến trúc hiện tại:
- ✅ **Hybrid GraphQL Strategy**: Kết hợp traditional + dynamic GraphQL
- ✅ **Component-based Architecture**: Modular và tái sử dụng cao
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Real-time Features**: Comments, media, live updates
- ✅ **Progressive Enhancement**: Fallback mechanisms
- ✅ **Modern Stack**: Next.js 15, Apollo Client, NestJS

---

## 🏗️ Frontend Architecture

### 📁 Cấu trúc Thư mục Frontend

```
frontend/src/
├── app/
│   └── admin/todos/                 # Admin routes
│       ├── page.tsx                 # ✅ Main todos page với Dynamic GraphQL
│       ├── [id]/page.tsx           # ✅ Task detail page
│       └── shared/page.tsx         # ✅ Shared todos management
├── components/todos/                # React Components
│   ├── TaskDashboardView.tsx       # ✅ Dashboard overview
│   ├── TaskList.tsx                # ✅ Task listing với filters
│   ├── TaskCard.tsx                # ✅ Individual task card
│   ├── TaskFilters.tsx             # ✅ Advanced filtering
│   ├── CreateTaskModal.tsx         # ✅ Task creation modal
│   ├── TaskComments.tsx            # ✅ Comments system
│   ├── TaskMedia.tsx               # ✅ Media attachments
│   ├── TaskModal.tsx               # ✅ Comprehensive task modal
│   ├── ViewModeSelector.tsx        # ✅ View mode switching
│   ├── TodoStatsWidget.tsx         # ✅ Statistics widget
│   ├── RecentTasksWidget.tsx       # ✅ Recent tasks widget
│   └── DynamicTaskDemo.tsx         # ✅ Dynamic GraphQL demo
├── hooks/                          # Custom React Hooks
│   ├── useTodos.ts                 # ✅ Traditional todo hooks
│   └── useDynamicTasks.ts          # ✅ Dynamic GraphQL hooks
├── types/                          # TypeScript Definitions
│   ├── todo.ts                     # ✅ Core todo types
│   └── todo-views.ts               # ✅ View mode types
├── graphql/                        # GraphQL Operations
│   ├── queries/todos.ts            # ✅ GraphQL queries/mutations
│   └── dynamic-queries.ts          # ✅ Dynamic GraphQL operations
└── contexts/                       # React Context
    └── AuthContext.tsx             # ✅ Authentication context
```

### 🔧 Frontend Components Chi tiết

#### 1. **Pages Layer** 
- **Main Page** (`/admin/todos/page.tsx`): 
  - ✅ Sử dụng Dynamic GraphQL hooks
  - ✅ Fallback mechanism đến traditional hooks
  - ✅ Quick action templates (urgent, meeting, personal, work)
  - ✅ Bulk operations support
  - ✅ Real-time statistics display
  - ✅ Interactive demo component

- **Task Detail** (`/admin/todos/[id]/page.tsx`):
  - ✅ Comprehensive task information
  - ✅ Comments và media integration
  - ✅ Edit capabilities

- **Shared Todos** (`/admin/todos/shared/page.tsx`):
  - ✅ Shared task management
  - ✅ Permission-based access control

#### 2. **Components Layer**
- **Core Components**:
  - `TaskDashboardView`: Tổng quan dashboard với widgets
  - `TaskList`: Danh sách task với pagination và filtering
  - `TaskCard`: Individual task display với quick actions
  - `CreateTaskModal`: Task creation với validation

- **Advanced Features**:
  - `TaskComments`: Nested comments system với real-time updates
  - `TaskMedia`: File attachments với preview capabilities
  - `TaskModal`: Comprehensive modal với tabs (Details, Comments, Media)
  - `DynamicTaskDemo`: Interactive demo cho Dynamic GraphQL

#### 3. **Hooks Layer**
- **Traditional Hooks** (`useTodos.ts`):
  - Basic CRUD operations
  - Task filtering và sorting
  - Loading states management

- **Dynamic Hooks** (`useDynamicTasks.ts`):
  - ✅ Universal CRUD operations
  - ✅ Quick actions (markAsCompleted, setPriority, etc.)
  - ✅ Bulk operations với progress tracking
  - ✅ Statistics calculation
  - ✅ Caching và optimization

#### 4. **Types Layer**
```typescript
// Core Task Interface
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;           // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  priority: TaskPriority;       // HIGH, MEDIUM, LOW
  category: TaskCategory;       // WORK, PERSONAL, STUDY
  dueDate?: string;
  authorId: string;
  author: User;
  comments?: TaskComment[];
  media?: TaskMedia[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 🖥️ Backend Architecture

### 📁 Cấu trúc Backend (Suy luận từ Frontend)

```
backend/src/
├── services/
│   ├── task.service.ts             # Core business logic
│   ├── task-comment.service.ts     # Comments management
│   ├── task-media.service.ts       # Media/attachments
│   └── dynamic-crud.service.ts     # ✅ Dynamic GraphQL service
├── graphql/
│   ├── resolvers/
│   │   ├── task.resolver.ts        # Task GraphQL resolvers
│   │   └── dynamic.resolver.ts     # ✅ Dynamic resolvers
│   ├── models/
│   │   └── task.model.ts          # GraphQL type definitions
│   └── inputs/
│       └── task.inputs.ts         # Input type definitions
├── database/
│   └── models/
│       ├── Task.ts                # Prisma model
│       ├── TaskComment.ts         # Comments model
│       └── TaskMedia.ts           # Media model
└── auth/
    └── guards/
        └── task-auth.guard.ts     # Authorization logic
```

### 🔧 Backend Services Chi tiết

#### 1. **Task Service Layer**
- **Core Operations**: CRUD với business logic
- **Validation**: Input validation và data integrity
- **Authorization**: Permission checks
- **Caching**: Redis-based caching for performance

#### 2. **Dynamic CRUD Service** 
- **Universal Operations**: One service handles all models
- **Type Safety**: Generic typing with validation
- **Bulk Operations**: Optimized batch processing
- **Statistics**: Real-time calculations

#### 3. **GraphQL Layer**
- **Resolvers**: Type-safe field resolvers
- **Subscriptions**: Real-time updates
- **Error Handling**: Comprehensive error management
- **Security**: Authentication & authorization

---

## 📊 Đánh giá Cấu trúc Hiện tại

### ✅ **Điểm Mạnh**

#### **1. Architecture Pattern**
- **🏆 Excellent**: Hybrid GraphQL strategy (traditional + dynamic)
- **🏆 Excellent**: Component-based modular design
- **🏆 Excellent**: Type-safe với TypeScript
- **🏆 Excellent**: Separation of concerns tốt

#### **2. Code Quality**
- **✅ Good**: Consistent naming conventions
- **✅ Good**: Proper error handling
- **✅ Good**: Comprehensive TypeScript types
- **✅ Good**: Reusable component design

#### **3. Performance**
- **✅ Good**: GraphQL với selective fetching
- **✅ Good**: Caching mechanisms
- **✅ Good**: Bulk operations support
- **✅ Good**: Lazy loading components

#### **4. User Experience**
- **🏆 Excellent**: Real-time features (comments, media)
- **🏆 Excellent**: Quick actions và shortcuts
- **🏆 Excellent**: Interactive statistics
- **✅ Good**: Responsive design

#### **5. Developer Experience**
- **🏆 Excellent**: Hot reload và fast refresh
- **🏆 Excellent**: TypeScript intellisense
- **✅ Good**: Clear file organization
- **✅ Good**: Consistent code style

### ⚠️ **Điểm Cần Cải thiện**

#### **1. Performance Issues**
- **🔴 Critical**: Potential N+1 queries without DataLoader
- **🟡 Medium**: No query complexity limiting
- **🟡 Medium**: Missing request deduplication
- **🟡 Medium**: No pagination optimization

#### **2. Security Concerns**
- **🔴 Critical**: Input sanitization cần strengthen
- **🟡 Medium**: Rate limiting không đầy đủ
- **🟡 Medium**: GraphQL introspection enabled in prod
- **🟡 Medium**: Missing CSRF protection

#### **3. Code Organization**
- **🟡 Medium**: Một số components quá lớn (TaskModal)
- **🟡 Medium**: Business logic trong components
- **🟡 Medium**: Không có service layer pattern ở frontend
- **🔵 Low**: Missing unit tests

#### **4. Scalability Issues**
- **🟡 Medium**: Không có horizontal scaling strategy
- **🟡 Medium**: Database query optimization needed
- **🟡 Medium**: No caching strategy cho static content
- **🟡 Medium**: Missing CDN integration

---

## 🚀 Kế hoạch Đề xuất Tối ưu hóa Chi tiết

Dựa trên phân tích **Đánh giá Cấu trúc Hiện tại**, tôi đề xuất lộ trình tối ưu hóa theo 4 giai đoạn với mức độ ưu tiên rõ ràng:

### 🎯 **GIAI ĐOẠN 1: Critical Fixes (Tuần 1-2) - 🔴 Ưu tiên Cực Cao**

#### **1.1 Performance Optimization - Giải quyết N+1 Query Problem**
```typescript
// Implement DataLoader for N+1 query prevention
@Injectable()
export class TaskDataLoader {
  private readonly commentLoader = new DataLoader<string, TaskComment[]>(
    async (taskIds) => this.batchLoadComments(taskIds)
  );
  
  private readonly mediaLoader = new DataLoader<string, TaskMedia[]>(
    async (taskIds) => this.batchLoadMedia(taskIds)
  );
  
  private readonly authorLoader = new DataLoader<string, User>(
    async (userIds) => this.batchLoadUsers(userIds)
  );

  async batchLoadComments(taskIds: string[]): Promise<TaskComment[][]> {
    const comments = await this.prisma.taskComment.findMany({
      where: { taskId: { in: taskIds } },
      include: { author: true, replies: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return taskIds.map(taskId => 
      comments.filter(comment => comment.taskId === taskId)
    );
  }

  async batchLoadMedia(taskIds: string[]): Promise<TaskMedia[][]> {
    const media = await this.prisma.taskMedia.findMany({
      where: { taskId: { in: taskIds } },
      include: { uploader: true }
    });
    
    return taskIds.map(taskId => 
      media.filter(m => m.taskId === taskId)
    );
  }

  async batchLoadUsers(userIds: string[]): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true, firstName: true, lastName: true, avatar: true }
    });
    
    return userIds.map(userId => 
      users.find(user => user.id === userId) || null
    );
  }
}

// Integration vào TaskResolver
@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly dataLoader: TaskDataLoader // Inject DataLoader
  ) {}

  @ResolveField(() => [TaskComment])
  async comments(@Parent() task: Task): Promise<TaskComment[]> {
    return this.dataLoader.commentLoader.load(task.id);
  }

  @ResolveField(() => [TaskMedia])
  async media(@Parent() task: Task): Promise<TaskMedia[]> {
    return this.dataLoader.mediaLoader.load(task.id);
  }

  @ResolveField(() => User)
  async author(@Parent() task: Task): Promise<User> {
    return this.dataLoader.authorLoader.load(task.authorId);
  }
}
```

#### **1.2 Security Enhancement - Input Sanitization & Rate Limiting**
```typescript
// Input sanitization middleware
@Injectable()
export class InputSanitizationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    if (request.body) {
      this.sanitizeInput(request.body);
    }
    
    return next.handle();
  }

  private sanitizeInput(obj: any): void {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
      obj.forEach(item => this.sanitizeInput(item));
      return;
    }
    
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
          obj[key] = this.sanitizeString(obj[key]);
        } else {
          this.sanitizeInput(obj[key]);
        }
      });
    }
  }

  private sanitizeString(str: string): string {
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }
}

// Rate limiting với tinh chỉnh theo endpoint
@Controller('graphql')
@UseInterceptors(InputSanitizationInterceptor)
export class GraphQLController {
  @Post()
  @Throttle(200, 60) // 200 requests per minute for general queries
  async graphql(@Body() body: any) {
    // GraphQL endpoint logic
  }
}

// Riêng cho Task mutations cần rate limit ketat hơn
@Resolver(() => Task)
@UseGuards(JwtAuthGuard)
export class TaskResolver {
  @Mutation(() => Task)
  @Throttle(30, 60) // 30 task creations per minute
  async createTask(@Args('input') input: CreateTaskInput): Promise<Task> {
    return this.taskService.create(input);
  }

  @Mutation(() => Boolean)
  @Throttle(10, 60) // 10 bulk operations per minute
  async bulkUpdateTasks(@Args('inputs') inputs: UpdateTaskInput[]): Promise<boolean> {
    return this.taskService.bulkUpdate(inputs);
  }
}
```

#### **1.3 Database Query Optimization**
```typescript
// Add database indexes for performance
// In Prisma schema
model Task {
  id          String   @id @default(cuid())
  title       String
  status      TaskStatus @default(PENDING)
  priority    TaskPriority @default(MEDIUM)
  category    TaskCategory @default(PERSONAL)
  dueDate     DateTime?
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Add composite indexes for common queries
  @@index([authorId, status]) // For filtering user tasks by status
  @@index([authorId, createdAt(sort: Desc)]) // For recent tasks
  @@index([dueDate, status]) // For overdue tasks
  @@index([status, priority]) // For task dashboard stats
  @@index([authorId, category, status]) // For filtered task lists
}

// Optimized service methods
@Injectable()
export class TaskService {
  async findByUserId(userId: string, filters?: TaskFilterInput): Promise<Task[]> {
    const where: any = { authorId: userId };
    
    // Build optimized where clause
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.category) where.category = filters.category;
    if (filters?.dueDateBefore) where.dueDate = { lte: filters.dueDateBefore };
    
    return this.prisma.task.findMany({
      where,
      include: {
        // Only include what's needed, use DataLoader for relations
        _count: {
          select: {
            comments: true,
            media: true,
            subtasks: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' }, // High priority first
        { dueDate: 'asc' },   // Then by due date
        { createdAt: 'desc' }  // Finally by creation date
      ],
      take: filters?.limit || 50, // Default pagination
      skip: filters?.offset || 0
    });
  }

  async getStatistics(userId: string): Promise<TaskStatistics> {
    // Use raw query for better performance
    const stats = await this.prisma.$queryRaw`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as inProgress,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending,
        COUNT(CASE WHEN due_date < NOW() AND status != 'COMPLETED' THEN 1 END) as overdue
      FROM "Task" 
      WHERE author_id = ${userId}
    `;
    
    return stats[0];
  }
}
```

### 🎯 **GIAI ĐOẠN 2: Code Architecture Improvements (Tuần 3-4) - 🟡 Ưu tiên Cao**

#### **2.1 Frontend Service Layer Pattern**
```typescript
// Create service layer for frontend business logic
@Injectable()
export class TaskFrontendService {
  constructor(private apolloClient: ApolloClient<any>) {}

  async createTask(input: CreateTaskInput): Promise<Task> {
    const { data } = await this.apolloClient.mutate({
      mutation: CREATE_TASK,
      variables: { input },
      update: (cache, { data: { createTask } }) => {
        this.updateTasksCache(cache, createTask);
      }
    });
    return data.createTask;
  }

  async bulkUpdateTasks(updates: UpdateTaskInput[]): Promise<Task[]> {
    const promises = updates.map(update => 
      this.apolloClient.mutate({
        mutation: UPDATE_TASK,
        variables: { input: update },
        optimisticResponse: {
          updateTask: { ...update, __typename: 'Task' }
        }
      })
    );
    
    const results = await Promise.allSettled(promises);
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value.data.updateTask);
  }

  private updateTasksCache(cache: ApolloCache<any>, newTask: Task) {
    try {
      const { tasks } = cache.readQuery({ query: GET_TASKS });
      cache.writeQuery({
        query: GET_TASKS,
        data: { tasks: [newTask, ...tasks] }
      });
    } catch (error) {
      // Cache miss is acceptable
      console.warn('Cache miss when updating tasks cache:', error);
    }
  }
}

// Hook integration
export const useTaskService = () => {
  const apolloClient = useApolloClient();
  return useMemo(() => new TaskFrontendService(apolloClient), [apolloClient]);
};
```

#### **2.2 Component Refactoring - Break Down Large Components**
```typescript
// Break down TaskModal into smaller components
const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'media'>('details');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <TaskModalHeader task={task} onClose={onClose} />
      
      <TaskModalTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        commentsCount={task.comments?.length || 0}
        mediaCount={task.media?.length || 0}
      />
      
      <div className="modal-body">
        {activeTab === 'details' && <TaskDetailsTab task={task} />}
        {activeTab === 'comments' && <TaskCommentsTab task={task} />}
        {activeTab === 'media' && <TaskMediaTab task={task} />}
      </div>
      
      <TaskModalFooter task={task} onClose={onClose} />
    </Modal>
  );
};

// Separate components for better maintainability
const TaskModalHeader: React.FC<{ task: Task; onClose: () => void }> = ({ task, onClose }) => (
  <div className="modal-header">
    <h2 className="text-xl font-semibold">{task.title}</h2>
    <TaskStatusBadge status={task.status} />
    <TaskPriorityBadge priority={task.priority} />
    <button onClick={onClose} className="ml-auto">
      <XMarkIcon className="w-5 h-5" />
    </button>
  </div>
);

const TaskModalTabs: React.FC<TaskModalTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  commentsCount, 
  mediaCount 
}) => (
  <div className="border-b border-gray-200">
    <nav className="flex space-x-8">
      <TabButton 
        active={activeTab === 'details'} 
        onClick={() => onTabChange('details')}
      >
        Chi tiết
      </TabButton>
      <TabButton 
        active={activeTab === 'comments'} 
        onClick={() => onTabChange('comments')}
      >
        Bình luận ({commentsCount})
      </TabButton>
      <TabButton 
        active={activeTab === 'media'} 
        onClick={() => onTabChange('media')}
      >
        Tệp đính kèm ({mediaCount})
      </TabButton>
    </nav>
  </div>
);
```

#### **2.3 Advanced Caching Strategy**
```typescript
// Multi-level caching implementation
@Injectable()
export class TaskCacheService {
  constructor(
    @InjectRedis() private redis: Redis,
    private memoryCache: MemoryCache
  ) {}
  
  async get<T>(key: string): Promise<T | null> {
    // L1: Memory cache (fastest)
    let result = this.memoryCache.get<T>(key);
    if (result) {
      this.recordCacheHit('memory', key);
      return result;
    }
    
    // L2: Redis cache (fast)
    const cached = await this.redis.get(key);
    if (cached) {
      result = JSON.parse(cached);
      // Populate L1 cache for next time
      this.memoryCache.set(key, result, 300); // 5 min TTL
      this.recordCacheHit('redis', key);
      return result;
    }
    
    this.recordCacheMiss(key);
    return null;
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    // Set in both caches
    this.memoryCache.set(key, value, Math.min(ttl, 300)); // Max 5 min in memory
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    // Invalidate both levels
    this.memoryCache.del(pattern);
    
    // Redis pattern invalidation
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
    
    this.recordCacheInvalidation(pattern);
  }

  async invalidateUserTasks(userId: string): Promise<void> {
    await Promise.all([
      this.invalidate(`tasks:user:${userId}:*`),
      this.invalidate(`tasks:stats:${userId}`),
      this.invalidate(`tasks:recent:${userId}`),
    ]);
  }

  private recordCacheHit(level: 'memory' | 'redis', key: string): void {
    // Metrics collection for monitoring
    this.metricsService.incrementCounter(`cache.hit.${level}`, { key });
  }

  private recordCacheMiss(key: string): void {
    this.metricsService.incrementCounter('cache.miss', { key });
  }

  private recordCacheInvalidation(pattern: string): void {
    this.metricsService.incrementCounter('cache.invalidation', { pattern });
  }
}

// Usage in TaskService
@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: TaskCacheService
  ) {}

  async findByUserId(userId: string, filters?: TaskFilterInput): Promise<Task[]> {
    const cacheKey = `tasks:user:${userId}:${JSON.stringify(filters || {})}`;
    
    // Try cache first
    const cached = await this.cacheService.get<Task[]>(cacheKey);
    if (cached) return cached;
    
    // Database query
    const tasks = await this.prisma.task.findMany({
      where: { authorId: userId, ...this.buildFilters(filters) },
      include: { _count: { select: { comments: true, media: true } } },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ],
      take: filters?.limit || 50,
      skip: filters?.offset || 0
    });
    
    // Cache the result
    await this.cacheService.set(cacheKey, tasks, 600); // 10 min cache
    
    return tasks;
  }

  async create(input: CreateTaskInput, userId: string): Promise<Task> {
    const task = await this.prisma.task.create({
      data: { ...input, authorId: userId },
      include: { author: true, _count: { select: { comments: true, media: true } } }
    });
    
    // Invalidate related caches
    await this.cacheService.invalidateUserTasks(userId);
    
    return task;
  }
}
```

### 🎯 **GIAI ĐOẠN 3: Advanced Features & Real-time Optimization (Tuần 5-6) - 🟢 Ưu tiên Trung Bình**

#### **3.1 Real-time Enhancements với WebSocket**
```typescript
// WebSocket Gateway for real-time updates
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  namespace: '/tasks'
})
export class TaskGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly taskService: TaskService) {}

  @SubscribeMessage('joinTaskRoom')
  handleJoinRoom(
    @MessageBody() data: { taskId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`task:${data.taskId}`);
    client.emit('joinedRoom', { taskId: data.taskId });
  }

  @SubscribeMessage('joinUserRoom')
  handleJoinUserRoom(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`user:${data.userId}`);
    client.emit('joinedUserRoom', { userId: data.userId });
  }

  @SubscribeMessage('taskComment')
  async handleTaskComment(
    @MessageBody() data: CreateTaskCommentInput,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const comment = await this.taskService.addComment(data);
      
      // Broadcast to all users in task room
      this.server.to(`task:${data.taskId}`).emit('newComment', {
        taskId: data.taskId,
        comment,
        timestamp: new Date().toISOString()
      });

      // Also broadcast to task owner
      const task = await this.taskService.findById(data.taskId);
      this.server.to(`user:${task.authorId}`).emit('taskActivity', {
        type: 'NEW_COMMENT',
        taskId: data.taskId,
        taskTitle: task.title,
        comment
      });

      client.emit('commentCreated', { success: true, comment });
    } catch (error) {
      client.emit('commentError', { error: error.message });
    }
  }

  @SubscribeMessage('taskStatusChange')
  async handleTaskStatusChange(
    @MessageBody() data: { taskId: string; newStatus: TaskStatus },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const updatedTask = await this.taskService.updateStatus(data.taskId, data.newStatus);
      
      // Broadcast to task room
      this.server.to(`task:${data.taskId}`).emit('taskStatusChanged', {
        taskId: data.taskId,
        oldStatus: updatedTask.previousStatus,
        newStatus: data.newStatus,
        updatedBy: client.handshake.auth.userId,
        timestamp: new Date().toISOString()
      });

      // Broadcast to user's dashboard for real-time stats
      this.server.to(`user:${updatedTask.authorId}`).emit('taskStatsUpdate', {
        userId: updatedTask.authorId
      });

    } catch (error) {
      client.emit('statusChangeError', { error: error.message });
    }
  }
}

// Optimized GraphQL subscriptions with filtering
@Resolver(() => Task)
export class TaskResolver {
  @Subscription(() => Task, {
    name: 'taskUpdated',
    filter: (payload, variables, context) => {
      const task = payload.taskUpdated;
      const userId = context.req.user?.id;
      
      // Only send updates for tasks user has access to
      return task.authorId === userId || 
             task.assigneeId === userId ||
             task.collaborators?.some(c => c.userId === userId);
    }
  })
  taskUpdated(@Context() context: any) {
    return this.pubSubService.asyncIterator('taskUpdated');
  }

  @Subscription(() => TaskComment, {
    name: 'taskCommentCreated',
    filter: (payload, variables, context) => {
      return variables.taskId === payload.taskCommentCreated.taskId;
    }
  })
  taskCommentCreated(
    @Args('taskId') taskId: string,
    @Context() context: any
  ) {
    return this.pubSubService.asyncIterator(`taskCommentCreated.${taskId}`);
  }
}
```

#### **3.2 Advanced UI Components với Virtual Scrolling**
```typescript
// Virtual scrolling implementation for large task lists
import { FixedSizeList as List } from 'react-window';
import { AutoSizer } from 'react-virtualized-auto-sizer';

interface VirtualTaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

const VirtualTaskList: React.FC<VirtualTaskListProps> = ({ 
  tasks, 
  onTaskClick, 
  onTaskUpdate 
}) => {
  const TaskRow = React.memo(({ index, style, data }) => {
    const task = data.tasks[index];
    
    return (
      <div style={style} className="px-4">
        <TaskCard
          task={task}
          onClick={() => data.onTaskClick(task)}
          onUpdate={(updates) => data.onTaskUpdate(task.id, updates)}
          className="mb-2"
        />
      </div>
    );
  });

  return (
    <div className="h-full">
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={tasks.length}
            itemSize={140} // Height of TaskCard + margin
            itemData={{ tasks, onTaskClick, onTaskUpdate }}
            overscanCount={5} // Render 5 extra items for smooth scrolling
          >
            {TaskRow}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

// Infinite scroll hook for large datasets
export const useInfiniteTaskScroll = (filters: TaskFilterInput = {}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const loadMoreTasks = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newTasks = await taskService.getTasks({
        ...filters,
        limit: 20,
        offset: page * 20
      });

      if (newTasks.length === 0) {
        setHasMore(false);
      } else {
        setTasks(prev => [...prev, ...newTasks]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page, loading, hasMore]);

  useEffect(() => {
    setTasks([]);
    setPage(0);
    setHasMore(true);
    loadMoreTasks();
  }, [filters]);

  return { tasks, loading, hasMore, loadMoreTasks };
};
```

#### **3.3 Advanced Search & Filtering**
```typescript
// Full-text search implementation
@Injectable()
export class TaskSearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: TaskCacheService
  ) {}

  async searchTasks(
    userId: string, 
    query: string, 
    filters: TaskSearchFilters = {}
  ): Promise<TaskSearchResult> {
    const cacheKey = `search:${userId}:${query}:${JSON.stringify(filters)}`;
    
    // Check cache first
    const cached = await this.cacheService.get<TaskSearchResult>(cacheKey);
    if (cached) return cached;

    // Build search query
    const searchConditions = [];
    
    if (query.trim()) {
      searchConditions.push({
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { comments: { some: { content: { contains: query, mode: 'insensitive' } } } }
        ]
      });
    }

    // Add filters
    if (filters.status) searchConditions.push({ status: { in: filters.status } });
    if (filters.priority) searchConditions.push({ priority: { in: filters.priority } });
    if (filters.category) searchConditions.push({ category: { in: filters.category } });
    if (filters.dateRange) {
      searchConditions.push({
        createdAt: {
          gte: filters.dateRange.start,
          lte: filters.dateRange.end
        }
      });
    }

    const tasks = await this.prisma.task.findMany({
      where: {
        authorId: userId,
        AND: searchConditions
      },
      include: {
        author: true,
        comments: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        },
        media: {
          take: 3
        },
        _count: {
          select: { comments: true, media: true, subtasks: true }
        }
      },
      orderBy: [
        { _relevance: { fields: ['title', 'description'], search: query } },
        { updatedAt: 'desc' }
      ],
      take: filters.limit || 50
    });

    const result = {
      tasks,
      totalCount: await this.prisma.task.count({
        where: { authorId: userId, AND: searchConditions }
      }),
      query,
      filters,
      searchTime: Date.now()
    };

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, result, 300);
    
    return result;
  }

  async getSuggestions(userId: string, query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];

    const suggestions = await this.prisma.task.findMany({
      where: {
        authorId: userId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: { title: true },
      take: 10,
      distinct: ['title']
    });

    return suggestions.map(task => task.title);
  }
}
```

### 🎯 **GIAI ĐOẠN 4: Advanced Features & Developer Experience (Tuần 7-8) - 🔵 Ưu tiên Thấp**

#### **4.1 Offline Support với PWA**
```typescript
// Service Worker for offline functionality
// sw.js
const CACHE_NAME = 'rausachcore-tasks-v1';
const urlsToCache = [
  '/',
  '/admin/todos',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Handle GraphQL requests
  if (event.request.url.includes('/graphql')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(event.request);
        })
    );
  } else {
    // Handle other requests
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'task-sync') {
    event.waitUntil(syncTasks());
  }
});

async function syncTasks() {
  const offlineActions = await getOfflineActions();
  for (const action of offlineActions) {
    try {
      await executeAction(action);
      await removeOfflineAction(action.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

// React PWA integration
export const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncPending, setSyncPending] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('task-sync');
          setSyncPending(false);
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncPending(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, syncPending };
};

// Offline task operations
export const useOfflineTasks = () => {
  const { isOnline } = usePWA();

  const createTaskOffline = useCallback(async (taskData: CreateTaskInput) => {
    if (isOnline) {
      return createTask(taskData);
    } else {
      // Store for later sync
      const offlineTask = {
        id: generateTempId(),
        ...taskData,
        _offline: true,
        _action: 'CREATE',
        _timestamp: Date.now()
      };
      
      await storeOfflineAction(offlineTask);
      return offlineTask;
    }
  }, [isOnline]);

  const updateTaskOffline = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (isOnline) {
      return updateTask(taskId, updates);
    } else {
      const offlineUpdate = {
        id: generateTempId(),
        taskId,
        updates,
        _action: 'UPDATE',
        _timestamp: Date.now()
      };
      
      await storeOfflineAction(offlineUpdate);
      return offlineUpdate;
    }
  }, [isOnline]);

  return { createTaskOffline, updateTaskOffline };
};
```

#### **4.2 Testing Strategy Implementation**
```typescript
// Unit Tests - TaskCard Component
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { TaskCard } from '../TaskCard';
import { UPDATE_TASK_STATUS } from '../graphql/mutations';

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    status: 'PENDING' as TaskStatus,
    priority: 'HIGH' as TaskPriority,
    dueDate: '2025-12-31',
    author: { id: '1', username: 'testuser' }
  };

  const mocks = [
    {
      request: {
        query: UPDATE_TASK_STATUS,
        variables: { id: '1', status: 'COMPLETED' }
      },
      result: {
        data: {
          updateTaskStatus: { ...mockTask, status: 'COMPLETED' }
        }
      }
    }
  ];

  it('renders task information correctly', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TaskCard task={mockTask} />
      </MockedProvider>
    );
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toHaveClass('priority-high');
    expect(screen.getByText('PENDING')).toHaveClass('status-pending');
  });

  it('handles status change correctly', async () => {
    const mockOnStatusChange = jest.fn();
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TaskCard task={mockTask} onStatusChange={mockOnStatusChange} />
      </MockedProvider>
    );
    
    const completeButton = screen.getByRole('button', { name: /complete/i });
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledWith('1', 'COMPLETED');
    });
  });

  it('shows loading state during status update', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TaskCard task={mockTask} />
      </MockedProvider>
    );
    
    const completeButton = screen.getByRole('button', { name: /complete/i });
    fireEvent.click(completeButton);
    
    expect(screen.getByText('Updating...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Updating...')).not.toBeInTheDocument();
    });
  });
});

// Integration Tests - TaskService
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskCacheService } from './task-cache.service';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;
  let cache: TaskCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: TaskCacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            invalidateUserTasks: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);
    cache = module.get<TaskCacheService>(TaskCacheService);
  });

  describe('create', () => {
    it('should create task successfully', async () => {
      const taskData = { title: 'Test Task', priority: 'HIGH' };
      const mockTask = { id: '1', ...taskData, authorId: 'user1' };
      
      jest.spyOn(prisma.task, 'create').mockResolvedValue(mockTask);
      jest.spyOn(cache, 'invalidateUserTasks').mockResolvedValue();

      const result = await service.create(taskData, 'user1');
      
      expect(result).toEqual(mockTask);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { ...taskData, authorId: 'user1' },
        include: expect.any(Object)
      });
      expect(cache.invalidateUserTasks).toHaveBeenCalledWith('user1');
    });

    it('should throw error for invalid input', async () => {
      const invalidTaskData = { title: '' }; // Empty title
      
      await expect(service.create(invalidTaskData, 'user1'))
        .rejects.toThrow('Title cannot be empty');
    });
  });

  describe('findByUserId', () => {
    it('should return cached tasks if available', async () => {
      const userId = 'user1';
      const cachedTasks = [{ id: '1', title: 'Cached Task' }];
      
      jest.spyOn(cache, 'get').mockResolvedValue(cachedTasks);
      
      const result = await service.findByUserId(userId);
      
      expect(result).toEqual(cachedTasks);
      expect(cache.get).toHaveBeenCalled();
      expect(prisma.task.findMany).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache if no cache', async () => {
      const userId = 'user1';
      const dbTasks = [{ id: '1', title: 'DB Task' }];
      
      jest.spyOn(cache, 'get').mockResolvedValue(null);
      jest.spyOn(prisma.task, 'findMany').mockResolvedValue(dbTasks);
      jest.spyOn(cache, 'set').mockResolvedValue();
      
      const result = await service.findByUserId(userId);
      
      expect(result).toEqual(dbTasks);
      expect(cache.set).toHaveBeenCalledWith(
        expect.stringContaining(userId),
        dbTasks,
        600
      );
    });
  });
});

// E2E Tests using Cypress
// cypress/e2e/task-management.cy.ts
describe('Task Management', () => {
  beforeEach(() => {
    cy.login('testuser@example.com', 'password');
    cy.visit('/admin/todos');
  });

  it('should create a new task', () => {
    cy.get('[data-testid="create-task-btn"]').click();
    
    cy.get('[data-testid="task-title-input"]').type('E2E Test Task');
    cy.get('[data-testid="task-description-input"]').type('This is a test task for E2E testing');
    cy.get('[data-testid="task-priority-select"]').select('HIGH');
    cy.get('[data-testid="task-category-select"]').select('WORK');
    
    cy.get('[data-testid="create-task-submit"]').click();
    
    cy.get('[data-testid="task-list"]').should('contain', 'E2E Test Task');
    cy.get('[data-testid="task-stats"]').should('contain', '1'); // Total tasks updated
  });

  it('should update task status via drag and drop', () => {
    // Create a test task first
    cy.createTask({ title: 'Drag Test Task', status: 'PENDING' });
    
    // Drag from pending to in-progress column
    cy.get('[data-testid="task-pending-column"] [data-testid="task-card"]:first')
      .drag('[data-testid="task-inprogress-column"]');
    
    // Verify task moved
    cy.get('[data-testid="task-inprogress-column"]')
      .should('contain', 'Drag Test Task');
    
    cy.get('[data-testid="task-pending-column"]')
      .should('not.contain', 'Drag Test Task');
  });

  it('should filter tasks by status', () => {
    cy.createTask({ title: 'Completed Task', status: 'COMPLETED' });
    cy.createTask({ title: 'Pending Task', status: 'PENDING' });
    
    cy.get('[data-testid="status-filter"]').select('COMPLETED');
    
    cy.get('[data-testid="task-list"]').should('contain', 'Completed Task');
    cy.get('[data-testid="task-list"]').should('not.contain', 'Pending Task');
  });

  it('should add comments to tasks', () => {
    cy.createTask({ title: 'Comment Test Task' });
    
    cy.get('[data-testid="task-card"]:first').click();
    cy.get('[data-testid="comments-tab"]').click();
    
    cy.get('[data-testid="comment-input"]').type('This is a test comment');
    cy.get('[data-testid="add-comment-btn"]').click();
    
    cy.get('[data-testid="comments-list"]').should('contain', 'This is a test comment');
  });
});
``` và testing
- **Testing Suite**: Unit tests với Jest + React Testing Library
- **CI/CD Pipeline**: Automated testing và deployment
- **Code Quality**: ESLint, Prettier, Husky hooks

```typescript
// Storybook configuration cho TaskCard
export default {
  title: 'Todos/TaskCard',
  component: TaskCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    priority: {
      control: { type: 'select' },
      options: ['HIGH', 'MEDIUM', 'LOW'],
    },
    status: {
      control: { type: 'select' },
      options: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    },
  },
} satisfies Meta<typeof TaskCard>;

// Unit test example
describe('TaskCard', () => {
  it('should display task title correctly', () => {
    const mockTask = createMockTask({ title: 'Test Task' });
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

---

## 🔄 Migration Strategy

### **Phần 1: Immediate Fixes (Week 1-2)**
1. **Security Patches**
   - Implement input sanitization
   - Add rate limiting
   - Enable CORS properly
   - Add CSRF protection

2. **Performance Quick Wins**
   - Add DataLoader implementation
   - Implement query complexity limiting
   - Add request deduplication
   - Optimize database queries

### **Phần 2: Architecture Improvements (Week 3-6)**
1. **Frontend Service Layer**
```typescript
// Create frontend service layer
export class TaskService {
  constructor(private apolloClient: ApolloClient<any>) {}

  async createTask(input: CreateTaskInput): Promise<Task> {
    const { data } = await this.apolloClient.mutate({
      mutation: CREATE_TASK,
      variables: { input },
      update: (cache, { data: { createTask } }) => {
        this.updateTasksCache(cache, createTask);
      }
    });
    return data.createTask;
  }

  private updateTasksCache(cache: ApolloCache<any>, newTask: Task) {
    try {
      const { tasks } = cache.readQuery({ query: GET_TASKS });
      cache.writeQuery({
        query: GET_TASKS,
        data: { tasks: [newTask, ...tasks] }
      });
    } catch (error) {
      // Cache miss is acceptable
    }
  }
}
```

2. **Component Refactoring**
```typescript
// Break down large components
const TaskModal = () => {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <Modal>
      <TaskModalHeader />
      <TaskModalTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'details' && <TaskDetailsTab />}
      {activeTab === 'comments' && <TaskCommentsTab />}
      {activeTab === 'media' && <TaskMediaTab />}
      <TaskModalFooter />
    </Modal>
  );
};
```

### **Phần 3: Advanced Features (Week 7-12)**
1. **Real-time Enhancements**
```typescript
// WebSocket integration for real-time updates
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class TaskGateway {
  @SubscribeMessage('joinTaskRoom')
  handleJoinRoom(
    @MessageBody() data: { taskId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`task:${data.taskId}`);
  }

  @SubscribeMessage('taskComment')
  async handleTaskComment(
    @MessageBody() data: CreateCommentInput,
    @ConnectedSocket() client: Socket,
  ) {
    const comment = await this.taskService.addComment(data);
    this.server.to(`task:${data.taskId}`).emit('newComment', comment);
  }
}
```

2. **Advanced Caching**
```typescript
// Multi-layer caching với invalidation strategy
export class TaskCacheManager {
  private readonly layers = ['memory', 'redis', 'database'] as const;
  
  async get<T>(key: string): Promise<T | null> {
    for (const layer of this.layers) {
      const result = await this.getFromLayer<T>(layer, key);
      if (result) {
        // Populate upper layers
        await this.populateUpperLayers(key, result, layer);
        return result;
      }
    }
    return null;
  }

  async invalidate(pattern: string): Promise<void> {
    await Promise.all([
      this.memoryCache.del(pattern),
      this.redisCache.del(pattern),
      // Database cache tables if any
    ]);
  }
}
```

---

## 📈 Metrics & Monitoring

### **Performance Metrics**
```typescript
// Performance monitoring setup
export class TaskPerformanceMonitor {
  private metrics = new Map<string, PerformanceMetric>();

  @TrackPerformance('task_creation')
  async createTask(input: CreateTaskInput): Promise<Task> {
    const startTime = performance.now();
    try {
      const task = await this.taskService.create(input);
      this.recordSuccess('task_creation', performance.now() - startTime);
      return task;
    } catch (error) {
      this.recordError('task_creation', error);
      throw error;
    }
  }

  private recordSuccess(operation: string, duration: number): void {
    this.metrics.set(`${operation}_duration`, { 
      value: duration, 
      timestamp: Date.now(),
      status: 'success'
    });
  }
}
```

### **Health Checks**
```typescript
// Health check endpoints
@Controller('health')
export class HealthController {
  @Get()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.pingCheck('redis'),
      () => this.graphql.check('graphql'),
    ]);
  }

  @Get('todos')
  async checkTodos(): Promise<{ status: string; tasks: number }> {
    const taskCount = await this.taskService.count();
    return {
      status: 'healthy',
      tasks: taskCount,
    };
  }
}
```