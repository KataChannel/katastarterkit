# Tính năng Quản lý Công việc (Todos) - rausachcore

## Tổng quan

Tính năng Todos trong rausachcore cung cấp một hệ thống quản lý công việc đầy đủ với các tính năng hiện đại như:

- ✅ Tạo, sửa, xóa task
- 📊 Theo dõi tiến độ và thống kê
- 🔄 Cập nhật trạng thái real-time
- 🏷️ Phân loại theo category và priority
- 📅 Quản lý deadline
- 👥 Chia sẻ task với team members
- 💬 Bình luận và discussion
- 📎 Đính kèm file
- 🔍 Tìm kiếm và lọc nâng cao

## Cấu trúc File

```
frontend/src/
├── app/(dashboard)/todos/
│   ├── page.tsx                 # Trang chính todos với stats
│   ├── [id]/page.tsx           # Chi tiết task
│   └── shared/page.tsx         # Task được chia sẻ
├── components/todos/
│   ├── TaskList.tsx            # Danh sách task với filters
│   ├── TaskCard.tsx            # Card hiển thị thông tin task
│   ├── TaskFilters.tsx         # Bộ lọc nâng cao
│   ├── CreateTaskModal.tsx     # Modal tạo task mới
│   ├── TodoStatsWidget.tsx     # Widget thống kê cho dashboard
│   └── RecentTasksWidget.tsx   # Widget task gần đây
├── hooks/
│   └── useTodos.ts             # Custom hooks cho todos
├── types/
│   └── todo.ts                 # TypeScript types
└── lib/graphql/
    └── todo-queries.ts         # GraphQL queries & mutations
```

## Tính năng chính

### 1. Dashboard Overview
- **TodoStatsWidget**: Hiển thị tổng quan (tổng số, hoàn thành, đang làm, quá hạn)
- **RecentTasksWidget**: Task gần đây với trạng thái và deadline
- **Progress Bar**: Tỷ lệ hoàn thành công việc

### 2. Task Management
```typescript
// Task Properties
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;           // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  priority: TaskPriority;       // HIGH, MEDIUM, LOW
  category: TaskCategory;       // WORK, PERSONAL, STUDY
  dueDate?: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}
```

### 3. Advanced Filtering
- **Status**: Lọc theo trạng thái
- **Priority**: Lọc theo độ ưu tiên
- **Category**: Lọc theo phân loại
- **Search**: Tìm kiếm theo tên
- **Date Range**: Lọc theo khoảng thời gian

### 4. Real-time Updates
- Sử dụng GraphQL Subscriptions
- Cập nhật ngay lập tức khi có thay đổi
- Notifications cho task mới

## API GraphQL

### Queries
```graphql
# Lấy danh sách task của user
query GetTasks($filters: TaskFilterInput) {
  getTasks(filters: $filters) {
    id
    title
    description
    status
    priority
    category
    dueDate
    author { username }
    createdAt
  }
}

# Lấy task shared
query GetSharedTasks($filters: TaskFilterInput) {
  getSharedTasks(filters: $filters) {
    # ... same fields
  }
}

# Lấy chi tiết task
query GetTaskById($id: ID!) {
  getTaskById(id: $id) {
    # ... full task details with comments, media, shares
  }
}
```

### Mutations
```graphql
# Tạo task mới
mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    title
    status
  }
}

# Cập nhật task
mutation UpdateTask($input: UpdateTaskInput!) {
  updateTask(input: $input) {
    id
    title
    status
  }
}

# Xóa task
mutation DeleteTask($id: ID!) {
  deleteTask(id: $id)
}

# Chia sẻ task
mutation ShareTask($input: ShareTaskInput!) {
  shareTask(input: $input) {
    id
    permission
  }
}
```

### Subscriptions
```graphql
# Subscribe task mới
subscription TaskCreated {
  taskCreated {
    id
    title
    author { username }
  }
}

# Subscribe cập nhật task
subscription TaskUpdated {
  taskUpdated {
    id
    title
    status
  }
}
```

## Hook Usage

### useTasks
```typescript
const { tasks, loading, error, refetch } = useTasks(filters);
```

### useTaskMutations
```typescript
const { createTask, updateTask, deleteTask, loading } = useTaskMutations();

// Tạo task
await createTask({
  title: "Hoàn thành báo cáo",
  description: "Báo cáo tháng 12",
  category: TaskCategory.WORK,
  priority: TaskPriority.HIGH,
  dueDate: "2025-01-01"
});

// Cập nhật status
await updateTask({
  id: "task-id",
  status: TaskStatus.COMPLETED
});
```

### useTaskFilters
```typescript
const { filters, updateFilter, clearFilters, hasActiveFilters } = useTaskFilters();

// Set filter
updateFilter('status', TaskStatus.PENDING);
updateFilter('search', 'báo cáo');
```

## Routing

- `/todos` - Trang chính với dashboard và list
- `/todos/[id]` - Chi tiết task
- `/todos/shared` - Task được chia sẻ

## Styling & UI

### Task Card States
- **Pending**: Border trắng
- **In Progress**: Border xanh dương
- **Completed**: Border xanh lá, text gạch ngang
- **Cancelled**: Border đỏ
- **Overdue**: Background đỏ nhạt

### Priority Colors
- **High**: Đỏ (red-600)
- **Medium**: Vàng (yellow-600)  
- **Low**: Xám (gray-600)

### Category Colors
- **Work**: Xanh dương (blue-600)
- **Personal**: Xanh lá (green-600)
- **Study**: Tím (purple-600)

## Performance Optimizations

1. **Apollo Cache**: Cache task data để tránh refetch
2. **Debounced Search**: Search với delay 300ms
3. **Lazy Loading**: Load components khi cần
4. **Optimistic Updates**: UI update ngay, server update sau

## Error Handling

```typescript
// Component level error handling
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-800">Lỗi: {error.message}</p>
      <button onClick={() => refetch()}>Thử lại</button>
    </div>
  );
}
```

## Testing Scenarios

1. **CRUD Operations**: Tạo/sửa/xóa task
2. **Status Changes**: Chuyển đổi trạng thái
3. **Filtering**: Test các bộ lọc
4. **Real-time**: Test subscriptions
5. **Error States**: Test khi API fail
6. **Loading States**: Test skeleton loading

## Future Enhancements

- [ ] Drag & drop reordering
- [ ] Gantt chart view
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Mobile app
- [ ] Offline support
- [ ] Team workspaces
- [ ] Time tracking
- [ ] Templates
- [ ] Automation rules

## Development Commands

```bash
# Start development
bun run dev

# Build for production
bun run build

# Run tests
bun run test

# GraphQL codegen
bun run graphql:codegen
```

## Dependencies

- **Frontend**: Next.js 15, Apollo Client, TypeScript, TailwindCSS
- **Backend**: NestJS, GraphQL, Prisma, PostgreSQL
- **Real-time**: GraphQL Subscriptions với Redis
- **File Upload**: MinIO S3-compatible storage
