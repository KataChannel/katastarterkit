# 🎉 Project Management Database Setup - HOÀN THÀNH

> **Status**: ✅ Database migration hoàn tất thành công  
> **Date**: 2024-10-29  
> **Migration**: `20251029011841_add_project_management`

---

## 📊 Tổng Quan

### Database Schema Đã Cập Nhật

#### 🆕 3 Bảng Mới
1. **`projects`** - Quản lý dự án (như Facebook Groups)
2. **`project_members`** - Thành viên dự án
3. **`project_chat_messages`** - Chat trong dự án

#### 🔄 2 Bảng Mở Rộng
1. **`tasks`** - Thêm 5 cột mới cho project management
2. **`notifications`** - Thêm 2 cột cho @mention tracking

---

## 🗂️ Chi Tiết Schema

### 1. Projects Table (Bảng Dự Án)

```sql
CREATE TABLE "projects" (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,           -- Tên dự án
    description TEXT,                     -- Mô tả
    avatar      TEXT,                     -- Ảnh đại diện
    isArchived  BOOLEAN DEFAULT false,    -- Trạng thái lưu trữ
    ownerId     TEXT NOT NULL,            -- Chủ dự án
    createdAt   TIMESTAMP DEFAULT NOW(),
    updatedAt   TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX "projects_ownerId_idx" ON "projects"("ownerId");
CREATE INDEX "projects_isArchived_idx" ON "projects"("isArchived");
CREATE INDEX "projects_createdAt_idx" ON "projects"("createdAt");
```

**Relations**:
- `owner` → User (1-to-1)
- `members` → ProjectMember[] (1-to-many)
- `tasks` → Task[] (1-to-many)
- `chatMessages` → ChatMessagePM[] (1-to-many)

**Use Cases**:
- Tạo dự án mới
- Quản lý thành viên
- Danh sách dự án trong sidebar (25% bên trái)
- Archive dự án đã hoàn thành

---

### 2. Project Members Table (Thành Viên Dự Án)

```sql
CREATE TABLE "project_members" (
    id        TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    userId    TEXT NOT NULL,
    role      TEXT DEFAULT 'member',    -- owner | admin | member
    joinedAt  TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(projectId, userId)           -- Mỗi user chỉ 1 lần/project
);

-- Indexes
CREATE INDEX "project_members_projectId_idx" ON "project_members"("projectId");
CREATE INDEX "project_members_userId_idx" ON "project_members"("userId");
CREATE INDEX "project_members_joinedAt_idx" ON "project_members"("joinedAt");
CREATE UNIQUE INDEX "project_members_projectId_userId_key" ON "project_members"("projectId", "userId");
```

**Relations**:
- `project` → Project
- `user` → User

**Roles**:
- `owner` - Chủ dự án (full quyền)
- `admin` - Quản trị viên (hầu hết quyền)
- `member` - Thành viên (quyền cơ bản)

**Use Cases**:
- Thêm/xóa thành viên
- Kiểm tra quyền truy cập
- Hiển thị danh sách members
- @mention autocomplete

---

### 3. Project Chat Messages (Chat Trong Dự Án)

```sql
CREATE TABLE "project_chat_messages" (
    id        TEXT PRIMARY KEY,
    content   TEXT NOT NULL,
    projectId TEXT NOT NULL,
    senderId  TEXT NOT NULL,
    mentions  TEXT[],                    -- Array user IDs được @mention
    replyToId TEXT,                      -- Thread reply
    reactions JSONB,                     -- {userId: emoji}
    isEdited  BOOLEAN DEFAULT false,
    editedAt  TIMESTAMP,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL
);

-- Indexes (optimized for real-time chat)
CREATE INDEX "project_chat_messages_projectId_idx" ON "project_chat_messages"("projectId");
CREATE INDEX "project_chat_messages_senderId_idx" ON "project_chat_messages"("senderId");
CREATE INDEX "project_chat_messages_createdAt_idx" ON "project_chat_messages"("createdAt");
CREATE INDEX "project_chat_messages_projectId_createdAt_idx" ON "project_chat_messages"("projectId", "createdAt");
CREATE INDEX "project_chat_messages_replyToId_idx" ON "project_chat_messages"("replyToId");
```

**Relations**:
- `project` → Project
- `sender` → User
- `replyTo` → ChatMessagePM (self-relation)
- `replies` → ChatMessagePM[] (thread)

**Features**:
- Real-time messaging (Socket.io)
- @Mention notifications
- Thread replies
- Reactions (emoji)
- Edit history

**Use Cases**:
- Chat panel (25% bên phải)
- @mention → trigger notification
- Thread conversations
- Quick reactions

---

### 4. Tasks Table - Extended (Mở Rộng)

**🆕 Cột Mới**:
```sql
ALTER TABLE "tasks" ADD COLUMN:
    projectId   TEXT,        -- Link to project (NULL = personal task)
    assignedTo  TEXT[],      -- Array of user IDs
    mentions    TEXT[],      -- Array of user IDs mentioned
    order       INT DEFAULT 0,  -- Drag & drop ordering
    tags        TEXT[]       -- Quick tags ['urgent', 'backend', ...]
```

**🆕 Indexes**:
```sql
CREATE INDEX "tasks_projectId_idx" ON "tasks"("projectId");
CREATE INDEX "tasks_projectId_status_idx" ON "tasks"("projectId", "status");
CREATE INDEX "tasks_projectId_priority_idx" ON "tasks"("projectId", "priority");
CREATE INDEX "tasks_projectId_order_idx" ON "tasks"("projectId", "order");
CREATE INDEX "tasks_projectId_dueDate_idx" ON "tasks"("projectId", "dueDate");
```

**Relations Updated**:
- `project` → Project (nullable - personal tasks still work)
- `notifications` → Notification[] (@mentions)

**Migration Strategy**:
- ✅ Existing personal tasks: `projectId = NULL`
- ✅ New project tasks: `projectId = <project_id>`
- ✅ Backward compatible

**Use Cases**:
- Tạo task trong project (như Facebook post)
- Assign cho nhiều người
- @Mention trong task description
- Drag & drop reorder
- Filter by tags

---

### 5. Notifications Table - Extended

**🆕 Cột Mới**:
```sql
ALTER TABLE "notifications" ADD COLUMN:
    taskId      TEXT,      -- Link to task (for @mention in task)
    mentionedBy TEXT       -- User who did the @mention
```

**🆕 Indexes**:
```sql
CREATE INDEX "notifications_taskId_idx" ON "notifications"("taskId");
CREATE INDEX "notifications_mentionedBy_idx" ON "notifications"("mentionedBy");
```

**Relations Updated**:
- `task` → Task
- `mentioner` → User

**Use Cases**:
- Notify khi được @mention trong task
- Notify khi được @mention trong chat
- Click notification → jump to task/message
- Display: "@John mentioned you in 'Fix bug ABC'"

---

## 🚀 MVP Implementation Roadmap

### MVP 1: Foundation (Week 1-3) ⏳ NEXT
**Backend**:
- [ ] `ProjectModule` (NestJS)
- [ ] `ProjectService` (CRUD + Members)
- [ ] `ProjectResolver` (GraphQL)
- [ ] `TaskService` update (projectId support)

**Frontend**:
- [ ] 3-column layout component
- [ ] ProjectSidebar (25% left)
- [ ] TaskFeed (50% center)
- [ ] CreateTaskModal
- [ ] ProjectInfo panel (25% right - empty)

**Database**: ✅ DONE

**Features**:
- [x] Database schema ready
- [ ] Create/Edit/Delete projects
- [ ] Add/Remove members
- [ ] Create tasks in project
- [ ] Assign tasks
- [ ] Switch between projects

---

### MVP 2: Task Management (Week 4-5)
**Features**:
- [ ] @Mention system
- [ ] Task sorting algorithm (priority + dueDate + order)
- [ ] Drag & drop reorder
- [ ] Task checklist (JSON field)
- [ ] Quick filters (status, priority, assignee)

---

### MVP 3: Real-time Chat (Week 6-7)
**Backend**:
- [ ] Socket.io Gateway
- [ ] ChatMessageService
- [ ] Typing indicators
- [ ] Online status

**Frontend**:
- [ ] ChatPanel component
- [ ] Message composer
- [ ] Thread replies
- [ ] Reactions

---

### MVP 4: Polish & Deploy (Week 8)
**Tasks**:
- [ ] Mobile responsive
- [ ] Performance optimization (pagination)
- [ ] Error boundaries
- [ ] Loading states
- [ ] Production deploy

---

## 📝 Migration Files

### Auto-Generated Migration
```bash
backend/prisma/migrations/20251029011841_add_project_management/migration.sql
```
- ✅ 3 tables created
- ✅ 2 tables altered
- ✅ 20+ indexes created
- ✅ Foreign keys setup
- ✅ Prisma Client regenerated

### Manual SQL Script (Reference)
```bash
backend/prisma/migrations_manual/add_project_management.sql
```
- Documentation reference
- Rollback script included
- Can be used for production deploy

---

## 🔍 Verification Commands

### Check Tables Created
```bash
# Connect to database
psql -h 116.118.48.208 -p 12003 -U <user> -d rausachcore

# List new tables
\dt projects
\dt project_members
\dt project_chat_messages

# Check columns added
\d tasks
\d notifications
```

### Test Queries
```sql
-- Create test project
INSERT INTO projects (id, name, ownerId) 
VALUES ('test-1', 'MVP Development', '<your-user-id>');

-- Add member
INSERT INTO project_members (id, projectId, userId, role)
VALUES ('mem-1', 'test-1', '<user-id>', 'owner');

-- Create project task
INSERT INTO tasks (id, title, userId, projectId, "order")
VALUES ('task-1', 'Setup database', '<user-id>', 'test-1', 1);

-- Check data
SELECT p.name, pm.role, t.title 
FROM projects p
JOIN project_members pm ON p.id = pm.projectId
JOIN tasks t ON p.id = t.projectId;
```

---

## 📚 Documentation References

### Main Spec
- `docs/159-quanlyduanlikefacebook.md` - Original requirements

### MVP Plan
- `docs/MVP_PLAN_PROJECT_MANAGEMENT.md` - 8-week roadmap
  - Database analysis
  - API specifications
  - Component architecture
  - Testing checklists
  - Gantt chart

### Migration Scripts
- `backend/prisma/schema.prisma` - Updated schema
- `backend/prisma/migrations/20251029011841_add_project_management/` - Auto migration
- `backend/prisma/migrations_manual/add_project_management.sql` - Manual script

---

## ⚠️ Important Notes

### Backward Compatibility
✅ **Existing features still work**:
- Personal tasks (`projectId = NULL`)
- Current notifications
- User authentication
- All existing relations

### Performance Considerations
✅ **Indexes optimized for**:
- Project sidebar queries (owner, isArchived)
- Task feed sorting (projectId + status + order)
- Chat real-time (projectId + createdAt)
- @Mention autocomplete (userId)

### Data Migration
✅ **No data loss**:
- All existing tasks preserved
- New columns nullable or have defaults
- Foreign keys allow NULL for flexibility

---

## 🎯 Next Steps

### Immediate (This Week)
1. ✅ Database schema - DONE
2. ⏳ Create NestJS modules (ProjectModule, ChatModule)
3. ⏳ GraphQL types & resolvers
4. ⏳ Frontend 3-column layout
5. ⏳ Test project CRUD

### Week 1-2
- Complete MVP 1 foundation
- Basic UI working
- Can create projects & tasks

### Week 3-4
- @Mention system
- Task sorting & reorder
- Advanced filters

### Week 5-7
- Real-time chat
- Socket.io integration
- Notifications

### Week 8
- Polish & deploy
- Performance tuning
- Production ready

---

## ✅ Checklist

### Database Setup
- [x] Prisma schema updated
- [x] Migration created
- [x] Migration applied
- [x] Prisma Client generated
- [x] Foreign keys setup
- [x] Indexes created

### Documentation
- [x] Migration SQL documented
- [x] MVP plan created
- [x] API specs defined
- [x] Component architecture planned

### Testing
- [ ] Create test project
- [ ] Add test members
- [ ] Create test tasks
- [ ] Test @mentions
- [ ] Test chat messages

### Backend Implementation
- [ ] ProjectModule created
- [ ] ProjectService created
- [ ] ProjectResolver created
- [ ] ChatModule created
- [ ] ChatGateway (Socket.io)

### Frontend Implementation
- [ ] 3-column layout
- [ ] ProjectSidebar component
- [ ] TaskFeed component
- [ ] ChatPanel component
- [ ] CreateTaskModal

---

## 🔗 Related Files

```
docs/
├── 159-quanlyduanlikefacebook.md          # Original spec
├── MVP_PLAN_PROJECT_MANAGEMENT.md          # 8-week plan
└── PROJECT_MANAGEMENT_DATABASE_SETUP_COMPLETE.md  # This file

backend/
├── prisma/
│   ├── schema.prisma                       # Updated schema
│   ├── migrations/
│   │   └── 20251029011841_add_project_management/
│   │       └── migration.sql               # Auto migration
│   └── migrations_manual/
│       └── add_project_management.sql      # Manual script
└── src/
    └── project/                            # 🆕 TO CREATE
        ├── project.module.ts
        ├── project.service.ts
        ├── project.resolver.ts
        └── dto/

frontend/
└── src/
    ├── app/
    │   └── (project-management)/          # 🆕 TO CREATE
    │       └── projects/
    └── components/
        └── project-management/            # 🆕 TO CREATE
            ├── ProjectSidebar.tsx
            ├── TaskFeed.tsx
            ├── ChatPanel.tsx
            └── CreateTaskModal.tsx
```

---

## 📞 Support

**Status**: Database ready for MVP 1 implementation  
**Next**: Create backend NestJS modules  
**Timeline**: 8 weeks to production

**Questions?** Check `docs/MVP_PLAN_PROJECT_MANAGEMENT.md` for detailed specs.

---

**Generated**: 2024-10-29  
**Migration ID**: `20251029011841_add_project_management`  
**Schema Version**: Latest (after migration)
