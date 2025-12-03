# Đồng bộ Query Projects giữa Dashboard và Views

## Vấn đề phát hiện

User báo cáo số lượng dự án khác nhau giữa 2 trang:
- `/projects/dashboard`: 3 dự án
- `/projects/views`: 2 dự án

## Nguyên nhân

### Trước khi fix:

| Trang | Method | Logic |
|-------|--------|-------|
| Dashboard | `useFindMany('project', { where: { OR: [ownerId, members] } })` | Lấy từ localStorage userId |
| Views | `myProjects` GraphQL query | Lấy userId từ JWT token server |

**Conflict tiềm ẩn:**
- Nếu localStorage user khác với JWT user → kết quả khác nhau
- `myProjects` chỉ filter theo `members`, trong khi Dashboard filter thêm `ownerId`

### Sau khi fix:

Cả hai trang đều dùng **cùng một logic**:

```typescript
useFindMany('project', {
  where: userId ? {
    OR: [
      { ownerId: { equals: userId } },
      { members: { some: { userId: { equals: userId } } } }
    ]
  } : undefined,
  include: {
    members: { include: { user: {...} } },
    _count: { select: { tasks: true, chatMessages: true } }
  },
  orderBy: { updatedAt: 'desc' }
}, { 
  skip: !userId,
  requireAuth: true 
});
```

## Files Changed

1. `frontend/src/app/(projects)/projects/views/page.tsx`
   - Thay `useQuery(GET_USER_PROJECTS)` bằng `useFindMany('project', ...)`
   - Thêm `userId` state từ localStorage
   - Đồng bộ logic filter với Dashboard

2. `frontend/src/app/(projects)/projects/dashboard/page.tsx`
   - Thêm debug log để trace projects

## Debug Logs

Cả hai trang đều log ra console:
```
[Dashboard] Projects loaded: 3 ["Check In Check out Nhân Sự", "Test Hệ Thống LMS", "LMS"]
[Views] Projects loaded: 3 ["Check In Check out Nhân Sự", "Test Hệ Thống LMS", "LMS"]
```

## Kiểm tra Data Integrity

Backend đã đảm bảo khi tạo project, owner được tự động thêm làm member:

```typescript
// project.service.ts - createProject()
const project = await this.prisma.project.create({
  data: {
    ...input,
    ownerId,
    members: {
      create: {
        userId: ownerId,
        role: 'owner',
      },
    },
  },
});
```

## Verify

Sau khi fix, cả hai trang phải hiển thị **cùng số lượng dự án**.
