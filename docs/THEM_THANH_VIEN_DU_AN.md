# Tính Năng Thêm Thành Viên Vào Dự Án

## Tổng Quan
Tính năng cho phép thêm thành viên vào dự án từ Dashboard với các chức năng:
- Tìm người dùng theo email
- Chọn dự án để thêm thành viên
- Phân quyền vai trò (Owner, Admin, Member)
- Kiểm tra trùng lặp và quyền hạn

## Cấu Trúc Code

### 1. Backend API
**GraphQL Mutation:** `addProjectMember`

```graphql
mutation AddProjectMember($projectId: ID!, $input: AddMemberInput!) {
  addProjectMember(projectId: $projectId, input: $input) {
    id
    userId
    role
    user {
      id
      firstName
      lastName
      email
      avatar
    }
    joinedAt
  }
}
```

**Input:**
```typescript
AddMemberInput {
  userId: string      // Required - ID người dùng
  role?: 'owner' | 'admin' | 'member'  // Optional, mặc định 'member'
}
```

**Backend Logic (project.service.ts):**
- Kiểm tra quyền: Chỉ Owner/Admin mới được thêm thành viên
- Kiểm tra trùng lặp: Unique constraint `projectId_userId`
- Tự động include thông tin user khi trả về

### 2. Frontend Hook
**File:** `/frontend/src/hooks/useProjects.ts`

```typescript
export const useAddMember = () => {
  return useMutation(ADD_PROJECT_MEMBER, {
    refetchQueries: [GET_PROJECT, GET_PROJECT_MEMBERS]
  });
};
```

**Tính năng:**
- Tự động refetch data sau khi thêm thành công
- Sử dụng Apollo Client mutation
- Error handling tự động

### 3. Dashboard Implementation
**File:** `/frontend/src/app/(projects)/projects/dashboard/page.tsx`

**Flow xử lý:**

1. **Validate dự án:**
   ```typescript
   const targetProjectId = projectId || selectedProjectId;
   if (!targetProjectId) {
     toast({ title: 'Lỗi', description: 'Vui lòng chọn dự án' });
     return;
   }
   ```

2. **Tìm user theo email (Dynamic GraphQL):**
   ```typescript
   const response = await fetch('/graphql', {
     body: JSON.stringify({
       query: `query FindUserByEmail(...)`,
       variables: {
         modelName: 'user',
         input: { where: { email: { equals: email } } }
       }
     })
   });
   ```

3. **Thêm thành viên (Custom Mutation):**
   ```typescript
   await addMember({
     variables: {
       projectId: targetProjectId,
       input: {
         userId: user.id,
         role: role.toLowerCase()
       }
     }
   });
   ```

4. **Feedback & Refetch:**
   ```typescript
   toast({ title: 'Thành công', description: `Đã thêm ${userName}...` });
   refetchProjects();
   ```

**Error Handling:**
- User không tồn tại → Toast "Không tìm thấy người dùng"
- Đã là thành viên → Toast "Người dùng đã là thành viên"
- Không có quyền → Toast "Bạn không có quyền..."
- Lỗi khác → Toast với error message

### 4. InviteMemberDialog Component
**File:** `/frontend/src/components/team/InviteMemberDialog.tsx`

**Props:**
```typescript
interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string, role: string, projectId?: string) => Promise<void>;
  loading?: boolean;
  projects?: Array<{ id: string; name: string }>;
  selectedProjectId?: string | null;
  onProjectChange?: (projectId: string) => void;
}
```

**Tính năng:**
1. **Dropdown chọn dự án** (chỉ hiển thị khi có `projects` prop)
2. **Input email** với validation regex
3. **Select vai trò:**
   - OWNER: Toàn quyền
   - ADMIN: Quản lý dự án
   - MEMBER: Thành viên
4. **Scrollable content** (theo rule 8)
5. **Loading states** khi submit

**Validation:**
- Email hợp lệ (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Dự án đã chọn (nếu có projects list)
- Vai trò đã chọn

## Giao Diện

### Dashboard Button
```tsx
<Button onClick={() => setIsInviteDialogOpen(true)}>
  <UserPlus className="mr-2 h-4 w-4" />
  Thêm thành viên
</Button>
```

### Dialog Layout
```
┌─────────────────────────────┐
│ [Icon] Mời thành viên       │ ← Header
├─────────────────────────────┤
│ Dự án: [Dropdown]           │ ← Content
│ Email: [Input]              │   (scrollable)
│ Vai trò: [Select]           │
│ 💡 Người dùng phải đã có    │
│    tài khoản trong hệ thống │
├─────────────────────────────┤
│ [Hủy] [Thêm thành viên]    │ ← Footer
└─────────────────────────────┘
```

## Compliance với Rules

✅ **Rule 1:** Code Like Senior
- Separation of concerns (service/hook/component)
- Error handling đầy đủ
- Type safety với TypeScript

✅ **Rule 2:** Dynamic GraphQL
- Sử dụng dynamic GraphQL cho tìm user
- Custom mutation cho business logic phức tạp

✅ **Rule 3:** Bỏ qua testing
- Không có test files

✅ **Rule 4:** Không git
- Không có git operations

✅ **Rule 5:** 1 file .md tiếng việt
- File này

✅ **Rule 6:** shadcn UI Mobile First + Responsive + PWA
- Sử dụng Dialog, Button, Input, Select từ shadcn
- Responsive với grid classes
- Mobile-friendly với proper spacing

✅ **Rule 7:** Giao diện tiếng việt
- Tất cả labels và messages bằng tiếng việt

✅ **Rule 8:** Dialog layout
- Header: Title + Description
- Content: Scrollable (`max-h-[60vh] overflow-y-auto`)
- Footer: Action buttons

## Test Cases

### Happy Path
1. Click "Thêm thành viên"
2. Chọn dự án từ dropdown
3. Nhập email hợp lệ
4. Chọn vai trò
5. Click "Thêm thành viên"
6. ✅ Toast success + Dialog đóng + Data refresh

### Edge Cases
1. **Không chọn dự án** → Toast "Vui lòng chọn dự án"
2. **Email không hợp lệ** → Toast "Email không hợp lệ"
3. **User không tồn tại** → Toast "Không tìm thấy người dùng"
4. **Đã là thành viên** → Toast "Người dùng đã là thành viên"
5. **Không có quyền** → Toast "Bạn không có quyền thêm thành viên"

## Files Modified

1. `/frontend/src/app/(projects)/projects/dashboard/page.tsx`
   - Import `useAddMember` hook
   - Import `useToast` hook
   - Thêm state `selectedProjectId`
   - Implement `handleInviteMember` với full logic
   - Pass props đầy đủ cho InviteMemberDialog

2. `/frontend/src/components/team/InviteMemberDialog.tsx`
   - Update interface với project props
   - Thêm state `localProjectId`
   - Thêm dropdown chọn dự án
   - Update validation logic
   - Fix toast calls với `type` property
   - Scrollable content layout

## API Examples

### Tìm user theo email
```graphql
query FindUserByEmail {
  findMany(
    modelName: "user"
    input: {
      where: { email: { equals: "user@example.com" } }
    }
  ) {
    data
  }
}
```

### Thêm thành viên
```graphql
mutation AddProjectMember {
  addProjectMember(
    projectId: "clx123..."
    input: {
      userId: "clx456..."
      role: "member"
    }
  ) {
    id
    userId
    role
    user {
      firstName
      lastName
      email
    }
  }
}
```

## Notes

- Backend xử lý permission check và duplicate check
- Frontend chỉ cần validate input và gọi API
- Toast notifications sử dụng custom hook với `type` property
- Dialog component có thể reuse cho Views page (với context projectId)
- Auto refetch data sau khi thêm thành công
- User phải tồn tại trong hệ thống (không có tính năng invite mới)
