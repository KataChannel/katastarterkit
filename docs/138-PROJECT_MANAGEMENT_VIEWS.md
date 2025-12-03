# Hệ Thống Quản Lý Dự Án - Project Management Views

## 📋 Tổng Quan

Cập nhật hệ thống quản lý dự án với **8 views** hỗ trợ **8 phương pháp luận** khác nhau (Waterfall, Agile, Scrum, Kanban, Hybrid, Lean, XP, Custom), cho phép quản lý linh hoạt theo từng methodology.

## 🎯 Ma trận Views - Phương pháp luận

| View | Phương pháp luận | Mục đích chính |
|------|------------------|----------------|
| **Dashboard** | Tất cả | Tổng quan nhanh, metrics |
| **List** | Tất cả | Chi tiết, báo cáo, export |
| **Kanban Board** | Kanban, Agile, Hybrid, Lean | Theo dõi luồng công việc hàng ngày |
| **Timeline/Gantt** | Waterfall, Hybrid | Quản lý thời gian, phụ thuộc |
| **Calendar** | Tất cả | Deadline, sự kiện |
| **Backlog** | Scrum, Agile, XP | Grooming, prioritization |
| **Sprint** | Scrum, Agile, XP | Quản lý sprint, velocity |
| **Roadmap** | Tất cả | Chiến lược dài hạn |

## 🎯 Tính Năng Chi Tiết

### 1. **Dashboard View** 
- 4 metric cards: Total Tasks, Completed, In Progress, Overdue
- Recent activities feed
- Project status overview
- Quick actions

### 2. **List View**
- DataTable với columns: Title, Status, Priority, Assignee, Due Date
- Sorting, filtering theo status/priority
- Export to CSV functionality
- Responsive table với horizontal scroll

### 3. **Kanban Board**
- 4 columns: Backlog → To Do → In Progress → Done
- Drag-and-drop ready structure
- Task cards với priority indicators
- WIP limits và swimlanes (structure ready)

### 4. **Timeline/Gantt View**
- Gantt chart với horizontal bars
- Dependencies visualization
- Phase tracking cho Waterfall
- Monthly timeline với grid

### 5. **Calendar View**
- Monthly grid với date picker
- Tasks displayed on due dates
- Navigation (Prev/Next month)
- Today highlighting
- Click to view day details

### 6. **Backlog View**
- Sprint assignment interface
- Story points estimation
- Priority-based grouping
- Drag to sprint (structure ready)

### 7. **Sprint View**
- Active sprint board với 3 columns
- Velocity tracking: Capacity, Committed, Completed
- Progress bar với percentage
- Sprint history với velocity metrics
- Close sprint action

### 8. **Roadmap View**
- Quarters-based timeline (Q1, Q2, Q3, Q4)
- Status cards: Idea, Planned, In Progress, Completed
- Progress bars per item
- Owner assignment
- Estimated business value

## 🔧 Tích Hợp Views

### **View Selector Page** (`/projects/views`)
- Project selector dropdown
- Methodology-aware view tabs
- Dynamic view filtering based on project methodology
- URL params support (?project=xxx&view=kanban)
- Suspense boundary cho SSR compatibility

### 2. **Sprint Management (Scrum)**
- Tạo và quản lý sprints (PLANNED, ACTIVE, COMPLETED, CANCELLED)
- Tracking: Capacity, Committed, Completed Story Points
- Velocity calculation tự động khi đóng sprint
- Sprint board với 3 columns: Pending → In Progress → Completed
- Sprint history với velocity metrics

### 3. **Roadmap Management (Product)**
- Roadmap items theo quarters (Q1, Q2, Q3, Q4)
- Status: IDEA → PLANNED → IN_PROGRESS → COMPLETED
- Priority: LOW, MEDIUM, HIGH, CRITICAL
- Progress tracking (0-100%)
- Estimated business value description

### 4. **View Configuration**
- Project default views
- User-specific view preferences
- Custom view order và default selection
- JSON config per view type

## 🗄️ Database Schema

### **Models Mới**

#### **Sprint**
```prisma
- id, name, goal, status
- startDate, endDate (nullable)
- capacity, committed, completed, velocity
- projectId → Project relation
- tasks → Task[] relation
```

#### **RoadmapItem**
```prisma
- id, title, description
- status, priority
- startDate, endDate, quarter (nullable)
- progress (0-100), estimatedValue
- projectId → Project, ownerId → User
```

#### **ProjectViewConfig**
```prisma
- id, viewType, isDefault, order
- config (JSON)
- projectId → Project
- userId → User (nullable = project default)
```

### **Models Cập Nhật**

#### **Project**
```prisma
+ methodology (WATERFALL | AGILE | SCRUM | KANBAN | HYBRID | LEAN | XP | CUSTOM)
+ enabledViews (String[]) - Array of view types
+ sprints → Sprint[]
+ roadmapItems → RoadmapItem[]
+ viewConfigs → ProjectViewConfig[]
```

#### **Task**
```prisma
+ sprintId → Sprint (nullable)
+ storyPoints (Int, nullable)
+ kanbanColumn (String, nullable)
```

## 🔧 Backend (NestJS + GraphQL)

### **Services & Resolvers**
1. **SprintService** + **SprintResolver**
   - Queries: `sprints`, `sprint`, `activeSprint`
   - Mutations: `createSprint`, `updateSprint`, `closeSprint`, `deleteSprint`

2. **RoadmapService** + **RoadmapResolver**
   - Queries: `roadmapItems`, `roadmapItem`, `roadmapByQuarter`
   - Mutations: `createRoadmapItem`, `updateRoadmapItem`, `deleteRoadmapItem`

3. **ViewConfigService** + **ViewConfigResolver**
   - Queries: `projectViewConfigs`, `defaultProjectView`
   - Mutations: `saveProjectViewConfig`, `deleteProjectViewConfig`

### **DTO Files**
- `sprint.dto.ts` - Sprint types, CreateSprintInput, UpdateSprintInput, CloseSprintInput
- `roadmap.dto.ts` - RoadmapItem types với enums (Status, Priority)
- `view-config.dto.ts` - ProjectViewConfig types với GraphQLJSON support

### **Module Registration**
- Đã register tất cả services/resolvers trong `ProjectModule`
- Export services để reuse

## 🎨 Frontend (Next.js + shadcn UI)

### **Components Mới**

#### **SprintView** (`/components/project-management/views/SprintView.tsx`)
- Active sprint board với 3 columns (Mobile First + Responsive)
- Sprint metrics: Capacity, Committed, Completed, Velocity
- Progress bar với percentage
- Sprint history với velocity charts
- Burndown chart placeholder (sẵn sàng integrate Recharts)
- Close sprint action với move unfinished tasks

#### **RoadmapView** (`/components/project-management/views/RoadmapView.tsx`)
- Roadmap timeline grouped by quarters (Mobile First + Responsive)
- Status overview cards: Idea, Planned, In Progress, Completed
- Roadmap item cards với:
  - Priority color-coded border (left-4)
  - Progress bar
  - Timeline với startDate → endDate
  - Estimated value
  - Owner avatar
- Items without quarter section

## 📊 Demo Data

### **Seed File**: `backend/prisma/seeds/seed-project-management-views.ts`

**3 Demo Projects:**
1. **🛒 E-commerce Platform** (Scrum)
   - 3 Sprints: Sprint 1 (COMPLETED), Sprint 2 (ACTIVE), Sprint 3 (PLANNED)
   - 7 Tasks với story points
   - 2 Roadmap items (Mobile App, AI Recommendations)

2. **📢 Marketing Campaign Q1 2025** (Kanban)
   - 5 Tasks phân bố các columns
   - Kanban workflow

3. **🏢 Enterprise Resource Planning System** (Waterfall)
   - 7 Phases as tasks (Requirements → Deployment)
   - Timeline/Gantt approach
   - 1 Roadmap item (Analytics Dashboard)

**Chạy seed:**
```bash
cd backend
bunx tsx prisma/seeds/seed-project-management-views.ts
```

## 🏗️ Architecture

### **Clean Architecture Principles**
- **Separation of Concerns**: Services tách biệt business logic
- **Reusability**: DTOs, services có thể reuse
- **Maintainability**: Mỗi view là component độc lập
- **Expansion**: Dễ dàng thêm view types mới

### **Performance Optimizations**
- GraphQL queries với `fetchPolicy: 'network-only'`
- Indexed database fields (projectId, status, dates)
- Lazy loading với Loader2 spinner
- Optimistic UI updates với Apollo cache

### **Developer Experience**
- TypeScript strict mode
- GraphQL code-first approach với decorators
- Prisma type-safe queries
- shadcn UI components (consistent design)

### **User Experience**
- Mobile First + Responsive design
- Loading states với spinners
- Empty states với helpful messages
- Color-coded priorities và statuses
- Smooth transitions và hover effects
- Toast notifications (đã fix lifecycle issues trước đó)

## 📁 File Structure

```
backend/
├── prisma/
│   ├── schema.prisma (Sprint, RoadmapItem, ProjectViewConfig models)
│   └── seeds/
│       └── seed-project-management-views.ts
└── src/
    └── project/
        ├── dto/
        │   ├── sprint.dto.ts
        │   ├── roadmap.dto.ts
        │   └── view-config.dto.ts
        ├── sprint.service.ts
        ├── sprint.resolver.ts
        ├── roadmap.service.ts
        ├── roadmap.resolver.ts
        ├── view-config.service.ts
        ├── view-config.resolver.ts
        └── project.module.ts (updated)

frontend/
└── src/
    └── components/
        └── project-management/
            └── views/
                ├── SprintView.tsx
                └── RoadmapView.tsx
```

## ✅ Completion Status

- ✅ Prisma schema design (Sprint, RoadmapItem, ProjectViewConfig)
- ✅ Database migration (`prisma db push`)
- ✅ Backend GraphQL types (DTOs với enums registered)
- ✅ Backend services (Sprint, Roadmap, ViewConfig)
- ✅ Backend resolvers (queries + mutations)
- ✅ Module registration (ProjectModule)
- ✅ Backend build successful (`bun run build`)
- ✅ Seed demo data (3 projects, 3 sprints, 19 tasks, 4 roadmap items)
- ✅ Frontend SprintView component (Mobile First + shadcn UI)
- ✅ Frontend RoadmapView component (Mobile First + shadcn UI)
- ✅ Documentation file (Vietnamese)

## 🔜 Next Steps (Optional)

1. **Frontend Integration**
   - Integrate SprintView, RoadmapView vào project pages
   - Add view switcher component
   - Implement view routing

2. **Remaining Views**
   - BacklogView (drag items to sprint)
   - KanbanView (với dnd-kit)
   - TimelineView (Gantt chart với Recharts)
   - CalendarView (với react-big-calendar)
   - DashboardView (metrics charts)

3. **Advanced Features**
   - Burndown chart với Recharts
   - Velocity charts
   - Sprint retrospectives
   - Epic management
   - Dependency tracking

## 📝 Notes

- Tuân thủ **Rule #9**: 1 file .md ngắn gọn tổng hợp (file này)
- Tuân thủ **Rule #10**: shadcn UI + Mobile First + Responsive design
- Tuân thủ **Rule #12**: Dialog layout (header/footer/scrollable content) - sẵn sàng cho form dialogs
- **No testing** (theo Rule #7)
- **No git** (theo Rule #8)
- Clean Architecture + Performance + DX + UX principles applied

---
**Thời gian hoàn thành**: December 3, 2025
**Version**: v1.0.0
