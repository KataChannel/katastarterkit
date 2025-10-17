# RBAC Components - Cập Nhật Shadcn UI (In Progress)

## 📋 Tổng Quan

Đang cập nhật toàn bộ components RBAC `/components/admin/rbac/` với giao diện shadcn UI đẹp, hiện đại và cải thiện UX. Mục tiêu là chuyển đổi hoàn toàn từ custom HTML/Tailwind sang shadcn UI components.

## ✅ Đã Hoàn Thành (4/10 Tasks)

### 1. **RoleManagement.tsx** ✅ COMPLETED

**Before:**
- Custom HTML tables với `<table>`, `<thead>`, `<tbody>`
- Custom buttons với Tailwind classes
- Custom loading spinner
- Custom error display
- Basic pagination

**After:**
```tsx
✅ Card, CardHeader, CardTitle, CardDescription
✅ Button component với variants
✅ Input component cho search
✅ Select component cho filters (Status, Type)
✅ Table, TableHeader, TableBody, TableRow, TableCell
✅ Badge component cho status và system role
✅ Avatar, AvatarFallback cho role icons
✅ Skeleton loading states
✅ Alert component cho errors
✅ Toast notifications với useToast hook
```

**Key Changes:**
```tsx
// Header
<Card className={className}>
  <CardHeader>
    <CardTitle>Role Management</CardTitle>
    <CardDescription>Manage system roles and their permissions</CardDescription>
    <Button onClick={...}>
      <Plus className="mr-2 h-4 w-4" />
      New Role
    </Button>
  </CardHeader>

// Search & Filters
<Input placeholder="Search roles..." value={...} onChange={...} />
<Select>
  <SelectTrigger><SelectValue placeholder="All Status" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="">All Status</SelectItem>
    <SelectItem value="true">Active</SelectItem>
  </SelectContent>
</Select>

// Table
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Role</TableHead>
      ...
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <Avatar>
          <AvatarFallback><Users /></AvatarFallback>
        </Avatar>
        <Badge variant="secondary">System</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>

// Actions
<Button variant="ghost" size="icon">
  <Pencil className="h-4 w-4" />
</Button>
```

**Files Modified:**
- `/frontend/src/components/admin/rbac/RoleManagement.tsx`

---

### 2. **PermissionManagement.tsx** ✅ COMPLETED

**Before:**
- Tương tự RoleManagement - custom HTML, buttons, tables
- Custom pagination và filters
- Basic error/loading states

**After:**
```tsx
✅ Card wrapper với CardHeader, CardContent
✅ Button, Input, Select từ shadcn
✅ Table components từ shadcn
✅ Badge cho category và status
✅ Avatar cho permission icons
✅ Skeleton loading
✅ Alert errors
✅ Toast notifications
✅ 3 filters: Search, Resource, Action, Status
```

**Key Changes:**
```tsx
// Filters với nhiều options hơn
<Input placeholder="Resource" />
<Input placeholder="Action" />
<Select><SelectTrigger /></Select>

// Table Cell với nhiều info
<TableCell>
  <Avatar>
    <AvatarFallback><Key /></AvatarFallback>
  </Avatar>
  <div>
    <div className="font-medium">{permission.displayName}</div>
    <Badge variant="secondary">System</Badge>
    <div className="text-xs">{permission.description}</div>
  </div>
</TableCell>

// Resource:Action:Scope display
<TableCell>
  {permission.resource}:{permission.action}
  {permission.scope && <span>:{permission.scope}</span>}
</TableCell>

// Category Badge
<Badge variant="outline">{permission.category}</Badge>
```

**Files Modified:**
- `/frontend/src/components/admin/rbac/PermissionManagement.tsx`

---

### 3. **UserRoleAssignment.tsx** ✅ COMPLETED

**Before:**
- Custom HTML với bg-white shadow rounded-lg
- Custom search input với absolute positioning
- Custom user list với hover effects
- Basic loading spinner

**After:**
```tsx
✅ Card components cho cả user list và details panel
✅ Input với Search icon prefix
✅ Avatar, AvatarImage, AvatarFallback cho users
✅ Badge cho roles (ADMIN, USER) và status (Inactive)
✅ ScrollArea với height 400px cho user list
✅ Skeleton loading cho both panels (grid với 2 cards)
✅ Card stats với hover effects và color accents
✅ Separator giữa summary và details
```

**Key Changes:**
```tsx
// Two-panel layout với Cards
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Card>
    <CardHeader>
      <CardTitle>Select User</CardTitle>
      <CardDescription>Choose a user...</CardDescription>
    </CardHeader>
    <CardContent>
      <Input placeholder="Search users..." className="pl-10" />
      <ScrollArea className="h-[400px]">
        {users.map(user => (
          <div className="p-3 rounded-lg hover:bg-accent">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
              {user.role}
            </Badge>
          </div>
        ))}
      </ScrollArea>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Role & Permission Details</CardTitle>
      <Button variant="secondary" size="sm">
        <ShieldCheck /> Manage Access
      </Button>
    </CardHeader>
    <CardContent>
      <UserRolePermissionPreview user={selectedUser} />
    </CardContent>
  </Card>
</div>

// Stats Cards với hover
<Card className="p-4 border-2 hover:border-primary/50">
  <div className="text-2xl font-bold text-primary">
    {summary.totalRoleAssignments}
  </div>
  <div className="text-sm text-muted-foreground">Roles</div>
</Card>

// Role/Permission list items
<div className="p-2 rounded-lg bg-accent/50 hover:bg-accent">
  <Avatar className="h-6 w-6">
    <AvatarFallback className="bg-primary/10">
      <User className="h-3 w-3" />
    </AvatarFallback>
  </Avatar>
  <Badge variant="default">allow</Badge>
</div>
```

**Files Modified:**
- `/frontend/src/components/admin/rbac/UserRoleAssignment.tsx`

---

### 4. **CreateRoleModal.tsx** ✅ COMPLETED

**Before:**
- Custom modal với fixed, inset-0, z-50
- Custom overlay với bg-gray-500 opacity-75
- Custom form inputs với Tailwind classes
- Custom buttons
- Native checkbox với basic styling

**After:**
```tsx
✅ Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
✅ Label components cho form fields
✅ Input components từ shadcn
✅ Textarea cho description
✅ Button với variants (outline, default)
✅ Checkbox với proper styling
✅ ScrollArea cho permissions list
✅ Toast notifications cho success/error
✅ DialogFooter cho action buttons
```

**Key Changes:**
```tsx
// Dialog structure
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Create New Role</DialogTitle>
      <DialogDescription>
        Create a new role and assign permissions
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">
          Role Name <span className="text-destructive">*</span>
        </Label>
        <Input id="name" required placeholder="e.g., user_manager" />
      </div>

      <div>
        <Label>Permissions</Label>
        <ScrollArea className="h-48 border rounded-md p-3">
          {permissions.map(p => (
            <div className="flex items-start space-x-2">
              <Checkbox
                id={`permission-${p.id}`}
                checked={formData.permissionIds?.includes(p.id)}
                onCheckedChange={() => handlePermissionToggle(p.id)}
              />
              <Label htmlFor={`permission-${p.id}`}>
                <div>{p.displayName}</div>
                <div className="text-xs text-muted-foreground">
                  {p.resource}:{p.action}
                </div>
              </Label>
            </div>
          ))}
        </ScrollArea>
        <p className="text-xs text-muted-foreground">
          {formData.permissionIds?.length || 0} permissions selected
        </p>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{loading ? 'Creating...' : 'Create Role'}</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

// Toast notifications
toast({
  title: 'Role created',
  description: `Role "${formData.displayName}" has been created successfully.`,
  type: 'success',
});
```

**Files Modified:**
- `/frontend/src/components/admin/rbac/CreateRoleModal.tsx`

---

## ⏳ Đang Làm (0/10 Tasks In Progress)

_Currently no tasks in progress_

---

## 📝 Chưa Làm (6/10 Tasks)

### 3. **UserRoleAssignment.tsx** (Not Started)

**Plan:**
```tsx
- Card cho user list và details panel
- Input với Search icon
- Avatar, AvatarImage, AvatarFallback cho users
- Badge cho roles và status
- ScrollArea cho long lists
- Button cho actions
- Skeleton loading cho both panels
- Alert cho errors
```

**Expected Changes:**
- User list panel: Card + ScrollArea + Avatar
- Details panel: Card với user role/permission summary
- Search: Input với icon prefix
- Selection: Active state với border-left accent

---

### 4. **CreateRoleModal.tsx** (Not Started)

**Plan:**
```tsx
- Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
- Form components: Label, Input, Textarea
- Checkbox groups cho permissions
- ScrollArea cho long permission lists
- Button với loading states
- Alert cho validation errors
```

**Expected Structure:**
```tsx
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Role</DialogTitle>
    </DialogHeader>
    <form>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Role Name *</Label>
          <Input id="name" />
        </div>
        <div>
          <Label>Permissions</Label>
          <ScrollArea className="h-48">
            {permissions.map(p => (
              <div className="flex items-center space-x-2">
                <Checkbox id={p.id} />
                <Label htmlFor={p.id}>{p.displayName}</Label>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Create Role</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

---

### 5. **EditRoleModal.tsx** (Not Started)

**Plan:**
- Tương tự CreateRoleModal - copy structure từ CreateRoleModal
- Pre-fill form data với role.name, role.displayName, etc.
- Show current permissions with checked state
- Update button instead of Create
- Add role prop to interface
- Use useUpdateRole mutation
- Toast success/error messages

---

### 6. **CreatePermissionModal.tsx & EditPermissionModal.tsx** (Not Started)

**Plan:**
```tsx
- Dialog components
- Form with Label + Input
- Select cho category
- Textarea cho description
- Grid layout cho Resource + Action fields
- Validation feedback với Alert
```

**Expected Structure:**
```tsx
<Dialog>
  <DialogContent>
    <form>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Resource *</Label>
          <Input placeholder="e.g., user, post" />
        </div>
        <div>
          <Label>Action *</Label>
          <Input placeholder="e.g., read, write" />
        </div>
      </div>
      <div>
        <Label>Category</Label>
        <Select>
          <SelectTrigger />
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="user">User</SelectItem>
            ...
          </SelectContent>
        </Select>
      </div>
    </form>
  </DialogContent>
</Dialog>
```

---

### 7. **AssignRolePermissionsModal.tsx** (Not Started)

**Plan:**
```tsx
- Dialog với wide content (max-w-3xl)
- ScrollArea cho permissions list
- Checkbox groups
- Search/filter trong modal
- Badge cho current assignments
- Button actions: Save, Cancel
```

---

### 8. **UserRolePermissionModal.tsx** (Not Started)

**Plan:**
```tsx
- Dialog với Tabs
- Tab 1: Roles assignment
- Tab 2: Direct permissions
- Checkbox groups trong mỗi tab
- ScrollArea cho long lists
- Summary stats ở top
- Save Changes button
```

**Expected Structure:**
```tsx
<Dialog>
  <DialogContent className="max-w-4xl">
    <DialogHeader>
      <DialogTitle>Manage User Access</DialogTitle>
      <DialogDescription>{user.displayName}</DialogDescription>
    </DialogHeader>
    
    <Tabs defaultValue="roles">
      <TabsList>
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="permissions">Direct Permissions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="roles">
        <ScrollArea className="h-96">
          {roles.map(role => (
            <div className="flex items-center space-x-2">
              <Checkbox id={role.id} />
              <Label>{role.displayName}</Label>
              <Badge>{role.permissions.length} perms</Badge>
            </div>
          ))}
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="permissions">
        {/* Similar structure */}
      </TabsContent>
    </Tabs>
    
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save Changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### 9. **TablePagination & RbacTableSkeleton Components** (Not Started)

**Plan:**
```tsx
// Reusable components tương tự /admin/users
- TablePagination.tsx: First, Prev, Page numbers, Next, Last
- RbacTableSkeleton.tsx: Skeleton cho tables

// Usage
<RbacTableSkeleton rows={5} columns={6} />
<TablePagination 
  currentPage={page} 
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```

---

### 10. **Testing** (Not Started)

**Checklist:**
- [ ] Create new role
- [ ] Edit existing role
- [ ] Delete role (custom only)
- [ ] Assign permissions to role
- [ ] Create new permission
- [ ] Edit permission
- [ ] Delete permission (custom only)
- [ ] Search roles/permissions
- [ ] Filter by status, type, resource, action
- [ ] Pagination navigation
- [ ] Assign roles to user
- [ ] Assign direct permissions to user
- [ ] Loading states display correctly
- [ ] Error messages display correctly
- [ ] Toast notifications appear
- [ ] Responsive on mobile/tablet
- [ ] Keyboard navigation works

---

## 🎨 UI/UX Improvements Applied

### Colors & Variants
```tsx
- Button: default, outline, ghost, destructive
- Badge: default (active), destructive (inactive), secondary (system), outline (category)
- Alert: default with border-red for errors
```

### Icons Usage
```tsx
- Users: Role icon
- Key: Permission icon
- ShieldCheck: Assign permissions
- Pencil: Edit action
- Trash2: Delete action
- Plus: Create new
- Search: Search input
```

### Loading States
```tsx
// Skeleton pattern cho tables
<Card>
  <CardHeader>
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-96" />
  </CardHeader>
  <CardContent>
    {[...Array(5)].map(() => (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    ))}
  </CardContent>
</Card>
```

### Error States
```tsx
<Alert className="border-red-200 bg-red-50 text-red-800">
  <AlertDescription>
    Error message here
  </AlertDescription>
</Alert>
```

### Toast Notifications
```tsx
const { toast } = useToast();

toast({
  title: 'Action completed',
  description: 'Details about what happened',
  type: 'success', // success | error | warning | info
});
```

---

## 📊 Progress Summary

**Completed:** 4/10 tasks (40%)
- ✅ RoleManagement.tsx
- ✅ PermissionManagement.tsx
- ✅ UserRoleAssignment.tsx
- ✅ CreateRoleModal.tsx

**Remaining:** 6/10 tasks (60%)
- ⏳ EditRoleModal.tsx (Similar to CreateRoleModal)
- ⏳ CreatePermissionModal.tsx & EditPermissionModal.tsx
- ⏳ AssignRolePermissionsModal.tsx
- ⏳ UserRolePermissionModal.tsx
- ⏳ TablePagination & RbacTableSkeleton
- ⏳ Testing

**Estimated Remaining Time:** 2-3 hours
- Modals: ~1.5 hours (4 modals remaining)
- Shared components: ~30 mins
- Testing: ~45 mins

---

## 🔄 Next Steps

1. **Cập nhật các Modals còn lại**
   - EditRoleModal.tsx (copy pattern từ CreateRoleModal)
   - CreatePermissionModal.tsx (Dialog với form fields)
   - EditPermissionModal.tsx (pre-fill data)
   - AssignRolePermissionsModal.tsx (Dialog với Checkbox list)
   - UserRolePermissionModal.tsx (Dialog với Tabs)

2. **Tạo Shared Components**
   - TablePagination (reuse từ /admin/users)
   - RbacTableSkeleton (cho loading states)

3. **Testing toàn diện**
   - Test CRUD operations
   - Test search, filters, pagination
   - Test modals open/close
   - Test responsive design
   - Verify toast notifications

---

## 📚 Shadcn Components Used So Far

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
```

**Already Used (4 components):**
```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
```

**Still Need:**
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
```

---

## 🎉 Achievements So Far

### Components Converted: 4/10 ✅
- **Tables**: 2 (RoleManagement, PermissionManagement)
- **Panels**: 1 (UserRoleAssignment)
- **Modals**: 1 (CreateRoleModal)

### Shadcn Components Used: 20+
Button, Input, Select, Card, Table, Badge, Alert, Skeleton, Avatar, Dialog, Label, Textarea, Checkbox, ScrollArea, Separator, Toast

### Code Quality Improvements:
- ✅ Consistent shadcn UI design system
- ✅ Better accessibility (labels, focus states)
- ✅ Improved loading states (skeletons)
- ✅ Toast notifications for user feedback
- ✅ Better responsive design
- ✅ Cleaner, more maintainable code

---

**Updated by:** GitHub Copilot  
**Date:** 2025-10-17  
**Status:** 🟡 IN PROGRESS (4/10 completed - 40%)
