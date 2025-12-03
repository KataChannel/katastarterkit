# Fix Project Management Views

## Ngày: 03/12/2025

## Vấn đề đã fix

### 1. GraphQL Query Bugs
- **`tasks` → `projectTasks`**: Sửa tất cả views sử dụng query sai
- **`storyPoints` không tồn tại**: Thêm field vào GraphQL Task model
- **`kanbanColumn` không tồn tại**: Thêm field vào GraphQL Task model  
- **`sprintId` không tồn tại**: Thêm field vào GraphQL Task model
- **Variable type `ID!` vs `String!`**: Fix project resolver

### 2. ListView Updates
- ✅ Thêm nút **"Thêm Task"** với Dialog
- ✅ Form tạo task: title, description, priority, category
- ✅ Mutation `createProjectTask`
- ✅ Mutation `deleteTask` với confirm
- ✅ Quick status change từ dropdown menu
- ✅ Error handling với toast notifications
- ✅ Refetch data sau mỗi thao tác

### 3. Files đã sửa

#### Backend
- `backend/src/graphql/models/task.model.ts` - Thêm fields: storyPoints, kanbanColumn, sprintId
- `backend/src/project/project.resolver.ts` - Fix `@Args('id')` type
- `backend/prisma/schema.prisma` - Thêm ProjectStatus enum và status field

#### Frontend Views
- `frontend/src/components/project-management/views/ListView.tsx`
- `frontend/src/components/project-management/views/DashboardView.tsx`
- `frontend/src/components/project-management/views/TimelineView.tsx`
- `frontend/src/components/project-management/views/KanbanView.tsx`
- `frontend/src/components/project-management/views/CalendarView.tsx`
- `frontend/src/components/project-management/views/BacklogView.tsx`

## Lưu ý

### Query `projectTasks`
Yêu cầu user phải là **member của project** để xem tasks. Nếu không có quyền sẽ trả về lỗi `ForbiddenException`.

### Tạo Task trong Project
Sử dụng mutation `createProjectTask` với:
```graphql
mutation CreateProjectTask($projectId: ID!, $input: CreateTaskInput!) {
  createProjectTask(projectId: $projectId, input: $input) {
    id
    title
    status
  }
}
```

## Cách test
1. Chọn project từ dropdown
2. Click vào tab "Danh sách"
3. Click nút "Thêm Task" để tạo task mới
4. Kiểm tra task hiển thị trong danh sách
