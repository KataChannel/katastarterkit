# ✅ CẬP NHẬT: Chức năng xóa dự án

**Ngày**: 10/11/2025  
**Tính năng**: Xóa dự án (Archive + Permanent Delete + Restore)

---

## 🎯 Tổng quan

Đã nâng cấp chức năng xóa dự án với 3 options:

1. **🗂️ Lưu trữ (Archive)** - Soft delete, có thể khôi phục
2. **♻️ Khôi phục (Restore)** - Restore dự án đã archive
3. **🗑️ Xóa vĩnh viễn (Permanent Delete)** - Hard delete, KHÔNG thể khôi phục

---

## 📋 Tính năng

### 1. Lưu trữ dự án (Archive)
**Đặc điểm:**
- ✅ Dữ liệu được giữ nguyên
- ✅ Có thể khôi phục bất kỳ lúc nào
- ⚠️ Dự án bị ẩn khỏi danh sách
- 🔐 Chỉ owner mới có quyền

**Dữ liệu giữ lại:**
- Tasks
- Chat messages
- Members
- Files

**UI Flow:**
```
Click ⋮ → Lưu trữ dự án
→ Confirm dialog
→ Success toast
→ Project hidden from list
```

### 2. Khôi phục dự án (Restore)
**Đặc điểm:**
- ✅ Restore dự án đã archive
- ✅ Hiển thị lại trong danh sách
- ✅ Tất cả dữ liệu nguyên vẹn
- 🔐 Chỉ owner mới có quyền

**UI Flow:**
```
View archived projects
→ Click ⋮ → Khôi phục dự án
→ Confirm dialog
→ Success toast
→ Project visible again
```

### 3. Xóa vĩnh viễn (Permanent Delete)
**Đặc điểm:**
- ❌ XÓA VĨNH VIỄN
- ❌ KHÔNG THỂ KHÔI PHỤC
- ❌ Xóa TẤT CẢ data liên quan
- 🔐 Chỉ owner mới có quyền

**Dữ liệu bị xóa:**
- ❌ Project record
- ❌ Tất cả tasks
- ❌ Tất cả chat messages
- ❌ Tất cả members
- ❌ Tất cả files đính kèm

**Security:**
- Yêu cầu nhập chính xác tên dự án
- Cảnh báo rõ ràng "KHÔNG THỂ KHÔI PHỤC"
- Confirm dialog với warning colors

**UI Flow:**
```
Click ⋮ → Xóa vĩnh viễn
→ Warning dialog
→ Input project name để confirm
→ Click Xóa vĩnh viễn
→ Success toast
→ Project deleted permanently
```

---

## 🔧 Implementation

### Backend

#### Service Methods
**File:** `/backend/src/project/project.service.ts`

```typescript
// Soft delete (Archive)
async deleteProject(projectId: string, userId: string): Promise<Project>

// Hard delete (Permanent)
async permanentlyDeleteProject(
  projectId: string, 
  userId: string
): Promise<{ success: boolean; message: string }>

// Restore
async restoreProject(projectId: string, userId: string): Promise<Project>
```

#### GraphQL Resolvers
**File:** `/backend/src/project/project.resolver.ts`

```graphql
# Soft delete
mutation DeleteProject($id: ID!) {
  deleteProject(id: $id) {
    id
    name
    isArchived
  }
}

# Hard delete
mutation PermanentlyDeleteProject($id: ID!) {
  permanentlyDeleteProject(id: $id)  # Returns message string
}

# Restore
mutation RestoreProject($id: ID!) {
  restoreProject(id: $id) {
    id
    name
    isArchived
  }
}
```

#### Authorization
```typescript
// Check owner permission
if (project.ownerId !== userId) {
  throw new ForbiddenException('Only project owner can delete');
}
```

### Frontend

#### Hooks
**File:** `/frontend/src/hooks/useProjects.dynamic.ts`

```typescript
// Archive (soft delete)
const [deleteProject, { loading }] = useDeleteProject();
await deleteProject({ variables: { id: projectId } });

// Permanent delete
const [permanentlyDelete, { loading }] = usePermanentlyDeleteProject();
await permanentlyDelete({ variables: { id: projectId } });

// Restore
const [restoreProject, { loading }] = useRestoreProject();
await restoreProject({ variables: { id: projectId } });
```

#### UI Component
**File:** `/frontend/src/components/project-management/DeleteProjectMenu.tsx`

**Features:**
- Dropdown menu với 3 options
- Confirm dialogs cho mỗi action
- Loading states
- Error handling
- Toast notifications
- Mobile responsive

**Props:**
```typescript
interface DeleteProjectMenuProps {
  project: {
    id: string;
    name: string;
    isArchived?: boolean;
  };
  onDelete?: () => void;
  className?: string;
}
```

---

## 🎨 UI/UX

### Desktop
```
Project Card
├── Avatar
├── Name & Description
└── Actions (on hover)
    ├── UserPlus (Invite)
    └── ⋮ (Delete Menu)
        ├── 🗂️ Lưu trữ dự án
        ├── ── Separator ──
        └── 🗑️ Xóa vĩnh viễn
```

### Mobile
```
Project Card
├── Avatar
├── Name & Description
└── Actions (always visible)
    ├── UserPlus (Invite)
    └── ⋮ (Delete Menu)
```

### Dialogs

#### Archive Dialog
```
Title: 🗂️ Lưu trữ dự án?
Content:
  - Dự án "X" sẽ được lưu trữ
  - ✅ Dữ liệu được giữ nguyên
  - ✅ Có thể khôi phục bất kỳ lúc nào
  - ⚠️ Dự án sẽ bị ẩn khỏi danh sách
Buttons:
  - [Hủy]
  - [Lưu trữ] (orange)
```

#### Restore Dialog
```
Title: ♻️ Khôi phục dự án?
Content:
  - Dự án "X" sẽ được khôi phục
  - Hiển thị trở lại trong danh sách
Buttons:
  - [Hủy]
  - [Khôi phục] (green)
```

#### Permanent Delete Dialog
```
Title: ⚠️ Xóa vĩnh viễn dự án? (red)
Content:
  - CẢNH BÁO: KHÔNG THỂ KHÔI PHỤC!
  - Dự án "X" cùng tất cả data sẽ bị xóa:
    ❌ Tất cả tasks
    ❌ Tất cả chat messages
    ❌ Tất cả members
    ❌ Tất cả files
  
  Nhập "[project name]" để xác nhận:
  [________________]
  
Buttons:
  - [Hủy]
  - [Xóa vĩnh viễn] (red, disabled until correct name)
```

---

## 🧪 Testing

### Test Cases

#### 1. Archive Project
```bash
# Steps:
1. Click ⋮ on project card
2. Select "Lưu trữ dự án"
3. Confirm in dialog
4. ✅ Project archived
5. ✅ Project hidden from list
6. ✅ Toast notification shown
```

#### 2. Restore Project
```bash
# Steps:
1. View archived projects
2. Click ⋮ on archived project
3. Select "Khôi phục dự án"
4. Confirm in dialog
5. ✅ Project restored
6. ✅ Project visible in list
7. ✅ Toast notification shown
```

#### 3. Permanent Delete
```bash
# Steps:
1. Click ⋮ on project card
2. Select "Xóa vĩnh viễn"
3. Warning dialog appears
4. Type project name (wrong) → Button disabled
5. Type project name (correct) → Button enabled
6. Click "Xóa vĩnh viễn"
7. ✅ Project deleted permanently
8. ✅ All related data deleted
9. ✅ Toast notification shown
```

#### 4. Authorization
```bash
# Test as non-owner:
1. Try to delete project → ❌ Error 403
2. Toast: "Only project owner can delete"
```

#### 5. Database Cascade
```bash
# After permanent delete:
SELECT COUNT(*) FROM project_members WHERE projectId = '...';  # 0
SELECT COUNT(*) FROM tasks WHERE projectId = '...';             # 0
SELECT COUNT(*) FROM chat_messages WHERE projectId = '...';     # 0
```

---

## 📊 Database Schema

### Cascade Delete
```prisma
model Project {
  id        String   @id @default(uuid())
  name      String
  isArchived Boolean @default(false)
  
  members      ProjectMember[]   @relation(onDelete: Cascade)
  tasks        Task[]            @relation(onDelete: Cascade)
  chatMessages ChatMessagePM[]  @relation(onDelete: Cascade)
}
```

**Cascade behavior:**
- Delete project → Auto delete all members
- Delete project → Auto delete all tasks
- Delete project → Auto delete all chat messages

---

## 🔐 Security

### Authorization Checks
```typescript
// 1. Check project exists
const project = await prisma.project.findUnique({ where: { id } });
if (!project) throw new NotFoundException();

// 2. Check owner permission
if (project.ownerId !== userId) {
  throw new ForbiddenException('Only owner can delete');
}

// 3. For restore: Check if archived
if (!project.isArchived) {
  throw new BadRequestException('Project is not archived');
}
```

### Frontend Validation
```typescript
// Permanent delete: Require exact name match
if (confirmText !== project.name) {
  toast({ description: 'Vui lòng nhập chính xác tên dự án' });
  return;
}
```

---

## 📝 Files Changed

### Backend
```
✅ backend/src/project/project.service.ts
   - async deleteProject() - Soft delete
   - async permanentlyDeleteProject() - Hard delete
   - async restoreProject() - Restore

✅ backend/src/project/project.resolver.ts
   - @Mutation deleteProject
   - @Mutation permanentlyDeleteProject
   - @Mutation restoreProject
```

### Frontend
```
✅ frontend/src/hooks/useProjects.dynamic.ts
   - useDeleteProject() - Archive hook
   - usePermanentlyDeleteProject() - Permanent delete hook
   - useRestoreProject() - Restore hook

✅ frontend/src/components/project-management/DeleteProjectMenu.tsx (NEW)
   - Dropdown menu component
   - 3 confirm dialogs
   - Loading states
   - Error handling

✅ frontend/src/components/project-management/ProjectSidebar.tsx
   - Import DeleteProjectMenu
   - Add menu button to project cards
```

---

## 💡 Best Practices

### UX
- ✅ Clear visual hierarchy (Archive → Restore → Delete)
- ✅ Cảnh báo rõ ràng cho permanent delete
- ✅ Require confirmation for destructive actions
- ✅ Loading states during operations
- ✅ Success/error feedback

### Security
- ✅ Owner-only permission
- ✅ Double confirmation for permanent delete
- ✅ Name matching validation
- ✅ Server-side authorization checks

### Performance
- ✅ Refetch queries after mutations
- ✅ Optimistic updates where appropriate
- ✅ Cascade deletes on database level
- ✅ Efficient query with select

---

## 🚀 Usage Example

```tsx
import { DeleteProjectMenu } from '@/components/project-management/DeleteProjectMenu';

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h3>{project.name}</h3>
      <DeleteProjectMenu 
        project={project}
        onDelete={() => {
          // Callback after successful delete
          console.log('Project deleted');
        }}
      />
    </div>
  );
}
```

---

## 🎯 Next Steps

- ⏳ Test với real data
- ⏳ Add undo functionality for archive (30s window)
- ⏳ Add bulk delete for multiple projects
- ⏳ Add export data before delete
- ⏳ Add activity log for delete actions

---

**Status**: ✅ **HOÀN THÀNH**  
**Ready**: Backend ✅ | Frontend ✅ | UI ✅ | Tests ⏳
