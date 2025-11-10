# 🐛 FIX: Project created successfully nhưng không hiển thị + User không phải member

**Ngày**: 10/11/2025  
**Status**: ✅ **FIXED**

---

## 📋 Vấn đề

Sau khi tạo project mới:
1. ❌ Toast "Project created successfully" hiện
2. ❌ Nhưng project KHÔNG hiển thị trong danh sách
3. ❌ Phải F5 reload mới thấy
4. ❌ User tạo không phải member → không vào chat được

---

## 🔍 Root Cause

### Vấn đề 1: Frontend dùng sai hook

**Frontend đang dùng:**
```typescript
// useProjects.dynamic.ts
export const useCreateProject = () => {
  const [createOne] = useCreateOne<Project>('project', ...);
  // ❌ Dynamic GraphQL CRUD - Không có logic add owner
}
```

**Backend có custom logic:**
```typescript
// project.service.ts
async createProject(ownerId: string, input: CreateProjectInput) {
  return prisma.project.create({
    data: {
      ownerId,
      members: {
        create: {
          userId: ownerId,   // ✅ Custom logic add owner
          role: 'owner',
        },
      },
    },
  });
}
```

**Kết quả:**
- Dynamic GraphQL bypass custom service
- Owner KHÔNG được add vào members
- Query filter không tìm thấy project
- Chat join fail

### Vấn đề 2: Không refetch queries

```typescript
// OLD - Missing refetch
const [createOne] = useCreateOne<Project>('project');
// ❌ Không auto-refresh sau create
```

---

## ✅ Giải pháp

### Fix 1: Dùng Custom Mutation

**File:** `/frontend/src/hooks/useProjects.dynamic.ts`

```typescript
/**
 * Hook: Create new project
 * IMPORTANT: Uses custom mutation (not Dynamic GraphQL) because backend
 * has special logic to auto-add owner to members
 */
export const useCreateProject = () => {
  const [mutate, { data, loading, error }] = useMutation(
    gql`
      mutation CreateProject($input: CreateProjectInput!) {
        createProject(input: $input) {
          id
          name
          description
          avatar
          isArchived
          createdAt
          updatedAt
          userId
          members {
            id
            role
            user {
              id
              firstName
              lastName
              email
              avatar
            }
          }
          _count {
            tasks
            chatMessages
            members
          }
        }
      }
    `,
    {
      refetchQueries: ['FindManyProject'],      // ✅ Auto refresh list
      awaitRefetchQueries: true,                // ✅ Wait for data
    }
  );

  const createProject = async (options: { variables: { input: CreateProjectInput } }) => {
    const result = await mutate(options);
    return result;
  };

  return [createProject, { loading, error }] as const;
};
```

### Fix 2: Import đúng

**File:** `/frontend/src/hooks/useProjects.dynamic.ts`

```typescript
import { gql, useMutation } from '@apollo/client';
```

### Flow mới:

```
Frontend: useCreateProject()
    ↓
Custom Mutation: createProject(input)
    ↓
Backend Resolver: @Mutation createProject
    ↓
Service: projectService.createProject()
    ↓
Prisma: Create project WITH members
    ↓
Response: Project + Members included
    ↓
RefetchQueries: ['FindManyProject']
    ↓
✅ UI auto-refresh với project mới
```

---

## 🧪 Verification

### Test 1: Backend Logic
```bash
bun scripts/test-create-project-graphql.ts
```

**Result:**
```
✅ Owner added to members
✅ Project visible in list
✅ Can join chat
```

### Test 2: Frontend Integration

**Before Fix:**
```
1. Create project
2. Toast shows "Success"
3. ❌ Project list unchanged
4. F5 reload
5. ✅ Project appears
```

**After Fix:**
```
1. Create project
2. Toast shows "Success"
3. ✅ Project appears immediately (no F5)
4. ✅ User is member
5. ✅ Can access chat
```

---

## 📊 Technical Details

### Query Flow

#### useMyProjects Query
```typescript
const where = {
  isArchived: { equals: false },
  OR: [
    { ownerId: { equals: userId } },              // ← Owner check
    { members: { some: { userId: { equals: userId } } } }  // ← Member check
  ]
};
```

**Before Fix:**
- User creates project
- Owner NOT in members
- Query doesn't find project (fails both OR conditions)
- List empty

**After Fix:**
- User creates project
- Owner IN members (via custom mutation)
- Query finds project (passes member check)
- List shows project immediately

#### Socket.IO Join Check
```typescript
// Backend: project-chat.gateway.ts
const member = await prisma.projectMember.findUnique({
  where: {
    projectId_userId: { projectId, userId }
  }
});

if (!member) {
  return { success: false, error: 'Not a project member' };
}
```

**Before Fix:**
- No member record → Join fails

**After Fix:**
- Member record exists → Join succeeds

---

## 🔧 Files Changed

### Frontend
```
✅ src/hooks/useProjects.dynamic.ts
   - Changed useCreateProject() to use custom mutation
   - Added gql, useMutation imports
   - Added refetchQueries + awaitRefetchQueries
   - Deprecated old useCreateProjectDynamic()
```

### Testing
```
✅ scripts/test-create-project-graphql.ts (NEW)
   - Verify backend logic
   - Simulate query filters
   - Check chat membership
```

### Documentation
```
✅ FIX_CREATE_PROJECT_NOT_SHOWING.md (this file)
```

---

## 💡 Best Practices

### ✅ DO:
- Use custom mutations when backend has special logic
- Include `refetchQueries` for list updates
- Use `awaitRefetchQueries: true` for immediate feedback
- Test with both backend logic + frontend integration

### ❌ DON'T:
- Use Dynamic GraphQL CRUD for operations with custom logic
- Forget to refetch queries after mutations
- Bypass service layer (always go through resolvers)
- Assume Dynamic GraphQL handles all cases

---

## 🎯 Related Issues

### Issue 1: Chat Error "Not a project member"
**Cause:** Same root - owner not in members  
**Fix:** Already fixed by this PR  
**Doc:** `FIX_CHAT_NOT_PROJECT_MEMBER_ERROR.md`

### Issue 2: ProjectSidebar showing all projects
**Cause:** Query filter issue  
**Fix:** Already fixed  
**Doc:** `FIX_BUG_PROJECTSIDEBAR_HIEN_THI_SAI.md`

---

## 📝 Testing Checklist

- [x] Backend: Owner added to members
- [x] Backend: Query finds project
- [x] Backend: Can join chat
- [x] Frontend: Custom mutation called
- [x] Frontend: RefetchQueries works
- [x] Frontend: No F5 needed
- [x] Integration: Create → See immediately
- [x] Integration: Create → Can chat

---

## 🚀 Deployment

### Backend
No changes needed - logic already correct

### Frontend
```bash
# 1. Install dependencies (if needed)
cd frontend
bun install

# 2. Restart dev server
bun run dev

# 3. Test create project
# Should see project immediately without F5
```

### Verification
```bash
# Run all tests
bun scripts/test-create-project-graphql.ts
bun scripts/audit-all-projects.ts
bun scripts/test-chat-membership.ts
```

---

## 📖 References

- Backend Service: `backend/src/project/project.service.ts`
- Backend Resolver: `backend/src/project/project.resolver.ts`
- Frontend Hook: `frontend/src/hooks/useProjects.dynamic.ts`
- Frontend Component: `frontend/src/components/project-management/CreateProjectModal.tsx`

---

**Before:**
```
Create → ❌ Not showing → F5 → ✅ Shows
```

**After:**
```
Create → ✅ Shows immediately
```

**Status**: ✅ **FIXED & VERIFIED**
