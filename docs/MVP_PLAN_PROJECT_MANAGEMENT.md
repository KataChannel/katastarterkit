# 🎯 MVP Plan - Project Management System (Like Facebook Groups)

**Dựa trên**: `docs/159-quanlyduanlikefacebook.md`  
**Database**: Schema hiện tại (Prisma) + Mở rộng  
**Mục tiêu**: Hoạt động cơ bản sớm nhất - 8 tuần  
**Date**: October 29, 2025

---

## 📊 Phân Tích Hiện Trạng Database

### ✅ ĐÃ CÓ SẴN (Có thể dùng ngay)

| Model | Status | Cần Sửa | Ghi Chú |
|-------|--------|---------|---------|
| `User` | ✅ Hoàn chỉnh | - | Đã có auth, roles, avatar |
| `AuthMethod` | ✅ OK | - | Hỗ trợ Google OAuth |
| `Task` | ⚠️ Thiếu | Thêm `projectId`, `assignedTo`, `order`, `mentions` | Hiện tại chỉ cho cá nhân |
| `TaskComment` | ✅ OK | Thêm `mentions` | Dùng được cho comments |
| `TaskMedia` | ✅ OK | - | Upload files/images |
| `Notification` | ✅ OK | - | Push notifications |

### ❌ THIẾU (Cần tạo mới)

| Model | Cần Tạo | Ưu Tiên |
|-------|---------|---------|
| `Project` | ✅ Bắt buộc | P0 - MVP 1 |
| `ProjectMember` | ✅ Bắt buộc | P0 - MVP 1 |
| `ChatMessage` | ✅ Bắt buộc | P1 - MVP 2 |
| `ChatChannel` | ⚠️ Sau này | P2 - MVP 3 |
| `TaskAssignment` | ⚠️ Có thể dùng field | P1 - MVP 2 |
| `TaskChecklist` | ⚠️ Dùng JSON | P1 - MVP 2 |

---

## 🏗️ Chiến Lược MVP

### Nguyên Tắc

1. **Tái sử dụng tối đa** database hiện có
2. **Mở rộng dần** thay vì rebuild
3. **Chức năng core trước**, UX sau
4. **Test nhanh**, deploy sớm

### Phân Chia MVP

```
MVP 1 (Tuần 1-3): Project + Task CRUD
  ↓
MVP 2 (Tuần 4-5): Task Feed + Assignment + Mentions
  ↓
MVP 3 (Tuần 6-7): Chat Realtime
  ↓
MVP 4 (Tuần 8): Polish + Deploy
```

---

## 🎯 MVP 1: Foundation (Tuần 1-3)

### Mục Tiêu
- ✅ Tạo/xóa Project
- ✅ CRUD Task trong Project
- ✅ UI 3 cột cơ bản
- ✅ Deploy & Test

### Database Changes

#### 1. Tạo Model `Project`

```prisma
model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  avatar      String?  // Project icon/color
  isArchived  Boolean  @default(false)
  
  // Owner
  ownerId     String
  owner       User     @relation("ProjectOwner", fields: [ownerId], references: [id])
  
  // Relations
  members     ProjectMember[]
  tasks       Task[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([ownerId])
  @@index([isArchived])
  @@map("projects")
}

model ProjectMember {
  id        String   @id @default(uuid())
  projectId String
  userId    String
  role      String   @default("member") // "owner", "admin", "member"
  
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user      User     @relation("ProjectMembers", fields: [userId], references: [id], onDelete: Cascade)
  
  joinedAt  DateTime @default(now())
  
  @@unique([projectId, userId])
  @@index([projectId])
  @@index([userId])
  @@map("project_members")
}
```

#### 2. Mở Rộng Model `Task`

```prisma
model Task {
  // ... existing fields ...
  
  // 🆕 Thêm fields cho Project Management
  projectId   String?   // Null = personal task
  assignedTo  String[]  // Array user IDs được assign
  mentions    String[]  // Array user IDs được mention
  order       Int       @default(0)  // Drag & drop ordering
  tags        String[]  // Quick tags ["urgent", "bug"]
  
  // Relations
  project     Project?  @relation(fields: [projectId], references: [id])
  
  // ... existing relations ...
  
  @@index([projectId])
  @@index([projectId, status])
  @@index([projectId, priority])
  @@index([projectId, order])
}
```

### Backend APIs (MVP 1)

#### Project APIs

```typescript
// POST /api/projects
createProject(input: CreateProjectInput): Project

// GET /api/projects
getMyProjects(userId: string): Project[]

// GET /api/projects/:id
getProject(id: string): Project

// PATCH /api/projects/:id
updateProject(id: string, input: UpdateProjectInput): Project

// DELETE /api/projects/:id
deleteProject(id: string): boolean

// POST /api/projects/:id/members
addMember(projectId: string, userId: string, role: string): ProjectMember

// DELETE /api/projects/:id/members/:userId
removeMember(projectId: string, userId: string): boolean
```

#### Task APIs (Mở rộng)

```typescript
// POST /api/tasks
createTask(input: CreateTaskInput): Task
// Input: { title, description, projectId, priority, dueDate, assignedTo[] }

// GET /api/tasks
getTasks(filters: TaskFilters): Task[]
// Filters: { projectId?, status?, priority?, assignedTo?, sort? }

// PATCH /api/tasks/:id
updateTask(id: string, input: UpdateTaskInput): Task

// PATCH /api/tasks/:id/order
updateTaskOrder(id: string, newOrder: number): Task

// DELETE /api/tasks/:id
deleteTask(id: string): boolean
```

### Frontend Components (MVP 1)

#### 1. Layout: 3 Columns

```
┌─────────────────────────────────────────────────────┐
│ Header: [Logo] [Search] [@User]                    │
├──────────┬──────────────────────┬───────────────────┤
│ LEFT     │ CENTER               │ RIGHT             │
│ (25%)    │ (50%)                │ (25%)             │
│          │                      │                   │
│ Projects │ Task Feed            │ Project Info      │
│ Sidebar  │                      │ (MVP 1: Empty)    │
│          │                      │                   │
└──────────┴──────────────────────┴───────────────────┘
```

**Files:**
```
frontend/src/app/(project-management)/
  layout.tsx                 # 3-column layout
  projects/
    page.tsx                 # Project list
    [id]/
      page.tsx               # Task feed
      
frontend/src/components/project-management/
  ProjectSidebar.tsx         # Left panel
  TaskFeed.tsx               # Center panel
  CreateTaskModal.tsx        # Modal tạo task
  TaskCard.tsx               # Task item
  ProjectInfo.tsx            # Right panel (empty MVP 1)
```

#### 2. ProjectSidebar.tsx

```typescript
interface ProjectSidebarProps {
  projects: Project[];
  activeProjectId?: string;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
}

// Features:
// - List projects với avatar/icon
// - Show progress % (tasks completed / total)
// - Active state highlight
// - "+ Tạo dự án mới" button
```

#### 3. TaskFeed.tsx

```typescript
interface TaskFeedProps {
  projectId: string;
  tasks: Task[];
  onCreateTask: () => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

// Features:
// - Header: "Tạo việc mới" button
// - Sort by priority + due date
// - Task cards với:
//   - Title
//   - Description (truncated)
//   - Priority badge
//   - Due date
//   - Assigned users (avatars)
//   - Status checkbox
// - Empty state
```

#### 4. CreateTaskModal.tsx

```typescript
interface CreateTaskModalProps {
  projectId: string;
  members: ProjectMember[];
  onSubmit: (task: CreateTaskInput) => void;
  onClose: () => void;
}

// Form fields:
// - Title (required)
// - Description (rich text - later, plain text MVP 1)
// - Priority: [Low] [Medium] [High]
// - Due date: DatePicker
// - Assign to: Multi-select dropdown (project members)
// - Tags: Input with chips
```

### Migration Script (MVP 1)

```bash
# File: backend/prisma/migrations/XXX_add_project_management/migration.sql

-- Create projects table
CREATE TABLE "projects" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "avatar" TEXT,
  "isArchived" BOOLEAN NOT NULL DEFAULT false,
  "ownerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  
  CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") 
    REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create project_members table
CREATE TABLE "project_members" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member',
  "joinedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "project_members_projectId_fkey" FOREIGN KEY ("projectId")
    REFERENCES "projects"("id") ON DELETE CASCADE,
  CONSTRAINT "project_members_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "users"("id") ON DELETE CASCADE,
  UNIQUE ("projectId", "userId")
);

-- Extend tasks table
ALTER TABLE "tasks" 
  ADD COLUMN "projectId" TEXT,
  ADD COLUMN "assignedTo" TEXT[],
  ADD COLUMN "mentions" TEXT[],
  ADD COLUMN "order" INTEGER DEFAULT 0,
  ADD COLUMN "tags" TEXT[];

-- Add foreign key
ALTER TABLE "tasks"
  ADD CONSTRAINT "tasks_projectId_fkey" 
  FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL;

-- Indexes
CREATE INDEX "projects_ownerId_idx" ON "projects"("ownerId");
CREATE INDEX "projects_isArchived_idx" ON "projects"("isArchived");
CREATE INDEX "project_members_projectId_idx" ON "project_members"("projectId");
CREATE INDEX "project_members_userId_idx" ON "project_members"("userId");
CREATE INDEX "tasks_projectId_idx" ON "tasks"("projectId");
CREATE INDEX "tasks_projectId_status_idx" ON "tasks"("projectId", "status");
CREATE INDEX "tasks_projectId_order_idx" ON "tasks"("projectId", "order");
```

### Testing Checklist (MVP 1)

- [ ] Đăng nhập với Google OAuth
- [ ] Tạo project mới
- [ ] Thêm member vào project
- [ ] Tạo task trong project
- [ ] Edit task (title, description, priority)
- [ ] Assign task cho member
- [ ] Mark task completed
- [ ] Delete task
- [ ] List projects trong sidebar
- [ ] Switch giữa các projects
- [ ] Empty states hiển thị đúng

### Deploy (MVP 1)

```bash
# Backend
cd backend
npx prisma migrate dev --name add_project_management
npx prisma generate
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run start
```

**Target**: Deploy lên staging sau tuần 3

---

## 🚀 MVP 2: Task Feed Advanced (Tuần 4-5)

### Mục Tiêu
- ✅ @Mention users
- ✅ Push notifications
- ✅ Task sorting algorithm
- ✅ Drag & drop reorder
- ✅ Task checklist (JSON)

### Database Changes

#### Mở Rộng `Notification`

```prisma
model Notification {
  // ... existing fields ...
  
  // 🆕 Link to task
  taskId     String?
  task       Task?   @relation(fields: [taskId], references: [id])
  
  // 🆕 Mention metadata
  mentionedBy String?
  mentioner   User?   @relation("NotificationMentioner", fields: [mentionedBy], references: [id])
  
  @@index([taskId])
  @@index([mentionedBy])
}
```

### Backend APIs (MVP 2)

```typescript
// POST /api/tasks/:id/mention
mentionUser(taskId: string, userId: string, mentionedBy: string): Notification
// Trigger: Tạo notification + gửi email

// GET /api/tasks/feed
getTaskFeed(projectId: string, sort: SortOptions): Task[]
// Sort algorithm: priority + due date + order

// PATCH /api/tasks/reorder
reorderTasks(projectId: string, updates: TaskOrderUpdate[]): Task[]
// Drag & drop cập nhật order field
```

### Frontend Features (MVP 2)

#### 1. Mention System

```typescript
// components/MentionInput.tsx
// Rich text editor với @mention dropdown
// Khi gõ "@" → show member list
// Select → insert @username tag
// On submit → extract mentioned user IDs
```

#### 2. Notification Panel

```typescript
// components/NotificationDropdown.tsx
// Header icon với badge count
// Click → dropdown list notifications
// "Bạn được mention trong task X"
// Click notification → navigate to task
```

#### 3. Task Sorting

```typescript
// Thuật toán (từ file 159)
const sortScore = (task: Task) => {
  let score = 0;
  
  // Priority weight
  if (task.priority === 'HIGH') score += 300;
  else if (task.priority === 'MEDIUM') score += 200;
  else score += 100;
  
  // Overdue weight (highest priority)
  if (task.dueDate && task.dueDate < new Date()) {
    score += 500;
  }
  
  // Manual order
  score += (1000 - task.order);
  
  return score;
};

tasks.sort((a, b) => sortScore(b) - sortScore(a));
```

#### 4. Drag & Drop Reorder

```typescript
// Using react-beautiful-dnd or dnd-kit
// Drag task → update order field
// API call: PATCH /api/tasks/reorder

const handleDragEnd = (result) => {
  const { source, destination } = result;
  
  const reorderedTasks = reorderArray(
    tasks,
    source.index,
    destination.index
  );
  
  const updates = reorderedTasks.map((task, index) => ({
    id: task.id,
    order: index
  }));
  
  await updateTaskOrder(updates);
};
```

#### 5. Task Checklist (JSON Field)

```typescript
// Task model already has description (String)
// Store checklist in JSON format:

interface TaskData {
  description: string;
  checklist?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

// UI: Checkbox list inside TaskCard
// Toggle → update task.description JSON
```

### Testing Checklist (MVP 2)

- [ ] @Mention user trong task description
- [ ] Notification xuất hiện cho user được mention
- [ ] Click notification → jump to task
- [ ] Task feed sort đúng (overdue lên top)
- [ ] Drag & drop task → order thay đổi
- [ ] Checklist: add/edit/delete items
- [ ] Checklist: toggle completed

---

## 💬 MVP 3: Chat Realtime (Tuần 6-7)

### Mục Tiêu
- ✅ Chat panel bên phải
- ✅ Realtime với WebSocket
- ✅ Chat theo project
- ✅ Send/receive messages

### Database Changes

#### Tạo Model `ChatMessage`

```prisma
model ChatMessage {
  id          String   @id @default(uuid())
  content     String
  projectId   String
  senderId    String
  
  // Mentions
  mentions    String[] // User IDs mentioned
  
  // Reply thread
  replyToId   String?
  replyTo     ChatMessage?  @relation("MessageReplies", fields: [replyToId], references: [id])
  replies     ChatMessage[] @relation("MessageReplies")
  
  // Reactions (JSON)
  reactions   Json?    // { "👍": ["userId1", "userId2"], "❤️": ["userId3"] }
  
  // Edit history
  isEdited    Boolean  @default(false)
  editedAt    DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  sender      User     @relation("ChatSender", fields: [senderId], references: [id])
  
  @@index([projectId])
  @@index([senderId])
  @@index([createdAt])
  @@index([projectId, createdAt])
  @@map("chat_messages")
}
```

### Backend APIs (MVP 3)

#### REST APIs

```typescript
// GET /api/projects/:id/messages
getMessages(projectId: string, pagination: Pagination): ChatMessage[]

// POST /api/projects/:id/messages
sendMessage(projectId: string, input: SendMessageInput): ChatMessage

// PATCH /api/messages/:id
editMessage(id: string, content: string): ChatMessage

// DELETE /api/messages/:id
deleteMessage(id: string): boolean
```

#### WebSocket Events

```typescript
// Server-side (Socket.io)
io.on('connection', (socket) => {
  // Join project room
  socket.on('join-project', (projectId) => {
    socket.join(`project:${projectId}`);
  });
  
  // Send message
  socket.on('send-message', async (data) => {
    const message = await createMessage(data);
    
    // Broadcast to project room
    io.to(`project:${data.projectId}`).emit('new-message', message);
    
    // Send mention notifications
    if (data.mentions?.length) {
      data.mentions.forEach(userId => {
        io.to(`user:${userId}`).emit('mention-notification', {
          message,
          mentionedBy: socket.userId
        });
      });
    }
  });
  
  // Typing indicator
  socket.on('typing', (projectId) => {
    socket.to(`project:${projectId}`).emit('user-typing', {
      userId: socket.userId,
      username: socket.username
    });
  });
});
```

### Frontend Components (MVP 3)

#### ChatPanel.tsx (Right Column)

```typescript
interface ChatPanelProps {
  projectId: string;
  members: ProjectMember[];
}

// Features:
// - Message list (scrollable)
// - Input box with @mention
// - Send button
// - Typing indicator
// - Real-time updates (Socket.io client)
// - Unread badge
```

#### MessageItem.tsx

```typescript
// Single message component
// - Avatar + username
// - Message content
// - Timestamp
// - Mention highlights (@username in blue)
// - Reply thread (collapsed)
// - Reactions bar
// - Edit/Delete buttons (if own message)
```

#### Implementation (Socket.io Client)

```typescript
// frontend/src/lib/socket.ts
import io from 'socket.io-client';

export const socket = io('http://localhost:14000', {
  auth: {
    token: getAuthToken()
  }
});

// ChatPanel.tsx
useEffect(() => {
  // Join project room
  socket.emit('join-project', projectId);
  
  // Listen for new messages
  socket.on('new-message', (message) => {
    setMessages(prev => [...prev, message]);
  });
  
  // Typing indicator
  socket.on('user-typing', (data) => {
    showTypingIndicator(data.username);
  });
  
  return () => {
    socket.off('new-message');
    socket.off('user-typing');
  };
}, [projectId]);

const handleSendMessage = async (content: string) => {
  // Extract mentions
  const mentions = extractMentions(content); // @username → userIds
  
  socket.emit('send-message', {
    projectId,
    content,
    mentions
  });
};
```

### Testing Checklist (MVP 3)

- [ ] Open 2 browsers → same project
- [ ] Send message from browser 1 → appears in browser 2
- [ ] @Mention user → notification sent
- [ ] Typing indicator works
- [ ] Message timestamps correct
- [ ] Scroll to bottom on new message
- [ ] Unread count updates
- [ ] Edit message works
- [ ] Delete message works

---

## 🎨 MVP 4: Polish & Deploy (Tuần 8)

### Mục Tiêu
- ✅ Mobile responsive
- ✅ Dark mode (optional)
- ✅ Loading states
- ✅ Error handling
- ✅ Performance optimization
- ✅ Production deploy

### Frontend Polish

#### 1. Responsive Design

```css
/* Mobile: Stack columns vertically */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
  
  .sidebar, .chat-panel {
    position: fixed;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}

/* Mobile bottom nav */
<BottomNav>
  <Tab icon="list" label="Projects" />
  <Tab icon="check" label="Tasks" />
  <Tab icon="chat" label="Chat" />
</BottomNav>
```

#### 2. Loading States

```typescript
// Skeleton loaders
<TaskFeedSkeleton />
<ChatSkeleton />

// Optimistic updates
const handleCreateTask = async (input) => {
  // Immediately add to UI
  const tempTask = { id: 'temp', ...input, status: 'PENDING' };
  setTasks(prev => [tempTask, ...prev]);
  
  try {
    const newTask = await createTask(input);
    setTasks(prev => prev.map(t => t.id === 'temp' ? newTask : t));
  } catch (error) {
    // Rollback on error
    setTasks(prev => prev.filter(t => t.id !== 'temp'));
    showError('Failed to create task');
  }
};
```

#### 3. Error Handling

```typescript
// Global error boundary
<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onError={logErrorToService}
>
  <App />
</ErrorBoundary>

// Network error handling
const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
    } else if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

### Performance Optimization

#### 1. Database Queries

```typescript
// Use indexes (đã có trong schema)
// Pagination
const getTasks = async (projectId: string, page = 1, limit = 20) => {
  return prisma.task.findMany({
    where: { projectId },
    include: {
      user: { select: { id: true, username: true, avatar: true } }
    },
    orderBy: { order: 'asc' },
    skip: (page - 1) * limit,
    take: limit
  });
};

// N+1 query prevention
const getProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: {
      members: { some: { userId } }
    },
    include: {
      _count: {
        select: {
          tasks: true,
          tasks: { where: { status: 'COMPLETED' } } // Count completed
        }
      }
    }
  });
};
```

#### 2. Frontend Caching

```typescript
// React Query for caching
const { data: projects } = useQuery({
  queryKey: ['projects', userId],
  queryFn: () => fetchProjects(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000 // 10 minutes
});

// Optimistic updates
const mutation = useMutation({
  mutationFn: createTask,
  onMutate: async (newTask) => {
    await queryClient.cancelQueries({ queryKey: ['tasks'] });
    const previousTasks = queryClient.getQueryData(['tasks']);
    
    queryClient.setQueryData(['tasks'], old => [...old, newTask]);
    
    return { previousTasks };
  },
  onError: (err, newTask, context) => {
    queryClient.setQueryData(['tasks'], context.previousTasks);
  }
});
```

#### 3. Code Splitting

```typescript
// Lazy load components
const ChatPanel = lazy(() => import('@/components/ChatPanel'));
const CreateTaskModal = lazy(() => import('@/components/CreateTaskModal'));

<Suspense fallback={<Spinner />}>
  <ChatPanel projectId={projectId} />
</Suspense>
```

### Deployment

#### Backend

```bash
# Production build
cd backend
npm run build

# Run migrations
npx prisma migrate deploy

# Start PM2
pm2 start dist/main.js --name project-api

# Nginx reverse proxy
server {
  listen 80;
  server_name api.yourapp.com;
  
  location / {
    proxy_pass http://localhost:14000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }
  
  location /socket.io/ {
    proxy_pass http://localhost:14000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

#### Frontend

```bash
# Production build
cd frontend
npm run build

# Deploy to Vercel/Netlify
vercel deploy --prod

# Or nginx static
server {
  listen 80;
  server_name app.yourapp.com;
  root /var/www/frontend/out;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Testing Checklist (MVP 4)

- [ ] Mobile: Sidebar toggle works
- [ ] Mobile: Chat panel toggle works
- [ ] Tablet: 2-column layout
- [ ] Desktop: 3-column layout
- [ ] Loading spinners show correctly
- [ ] Error messages user-friendly
- [ ] Network offline → show offline banner
- [ ] Page refresh → restore state
- [ ] Production build works
- [ ] SSL certificates installed
- [ ] Database backup scheduled
- [ ] Monitoring setup (Sentry/DataDog)

---

## 📅 Gantt Chart (8 Weeks)

```
Week │ Task
─────┼────────────────────────────────────────────────────
  1  │ ██████ Setup project structure + Auth
  2  │ ██████ Project CRUD + Sidebar UI
  3  │ ██████ Task CRUD + Task Feed UI + Deploy MVP 1
  4  │ ██████ @Mention + Notifications
  5  │ ██████ Task sorting + Drag & drop + Checklist
  6  │ ██████ Chat backend + Socket.io setup
  7  │ ██████ Chat frontend + Realtime testing
  8  │ ██████ Polish + Mobile + Production deploy
```

---

## 📊 Resource Allocation

| Role | Tuần 1-3 | Tuần 4-5 | Tuần 6-7 | Tuần 8 |
|------|----------|----------|----------|--------|
| Backend Dev | Project/Task API | Mention/Sort API | Chat/Socket.io | Optimization |
| Frontend Dev | 3-col layout + UI | Feed advanced | Chat UI | Mobile/Polish |
| Designer | Wireframes | Icons/Assets | - | QA/UX |
| DevOps | Setup infra | - | Socket server | Deploy prod |

---

## 🎯 Success Metrics

### MVP 1 (Week 3)
- [ ] 5 test users tạo được projects
- [ ] 20+ tasks created across projects
- [ ] Zero critical bugs
- [ ] Page load < 2s

### MVP 2 (Week 5)
- [ ] @Mention works 100% time
- [ ] Notifications delivered < 1s
- [ ] Drag & drop smooth (60fps)
- [ ] Task feed sort accurate

### MVP 3 (Week 7)
- [ ] Chat latency < 500ms
- [ ] 10 concurrent users no lag
- [ ] Messages delivered 99.9% time
- [ ] Typing indicator works

### MVP 4 (Week 8)
- [ ] Mobile usable (90% features work)
- [ ] Production uptime > 99%
- [ ] Error rate < 0.1%
- [ ] 10+ real users onboarded

---

## 🚨 Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| WebSocket connection drops | High | Medium | Auto-reconnect + message queue |
| Database migration fails | Low | High | Backup before migrate + rollback script |
| Real-time lag | Medium | High | Use Redis for message queue |
| Mobile performance | Medium | Medium | Code splitting + lazy loading |
| Google OAuth breaks | Low | High | Fallback to email/password |

---

## 📚 Tech Stack Summary

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (Prisma ORM)
- **Realtime**: Socket.io
- **Auth**: JWT + Google OAuth (existing)
- **Queue**: Redis (optional for chat)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **State**: React Query + Zustand
- **UI**: TailwindCSS + shadcn/ui (existing)
- **Realtime**: Socket.io-client
- **Drag & Drop**: dnd-kit

### DevOps
- **Hosting**: Vercel (frontend) + VPS (backend)
- **Database**: PostgreSQL (managed)
- **Storage**: AWS S3 / MinIO (file uploads)
- **Monitoring**: Sentry + Vercel Analytics

---

## 🎓 Next Steps

### Immediate (This Week)
1. ✅ Review this plan với team
2. ✅ Setup project structure
3. ✅ Create database migration script
4. ✅ Design wireframes (3-column layout)

### Week 1 Actions
```bash
# 1. Create feature branch
git checkout -b feature/project-management

# 2. Create migration
cd backend
npx prisma migrate dev --name add_project_management

# 3. Generate Prisma client
npx prisma generate

# 4. Create backend modules
nest g module project
nest g service project
nest g resolver project

# 5. Create frontend routes
mkdir -p frontend/src/app/(project-management)

# 6. Start coding!
```

---

## 📞 Support & Questions

**Documentation**: `docs/159-quanlyduanlikefacebook.md`  
**This Plan**: `docs/MVP_PLAN_PROJECT_MANAGEMENT.md`  
**Database Schema**: `backend/prisma/schema.prisma`

**Questions?**
- Design/UX → Check wireframe section
- Backend API → See API endpoints section
- Frontend components → See component list
- Database → See migration scripts

---

**Status**: 📝 **READY TO START**  
**Next Milestone**: MVP 1 (Week 3)  
**Target Launch**: Week 8

🚀 **Let's build it!**
