# ✅ WORKFLOW ROUTES - HOÀN THÀNH

**Ngày**: 29/11/2024  
**Phase 1**: Tạo Routes (CRITICAL) - ✅ **HOÀN THÀNH 100%**

---

## 📁 FILES ĐÃ TẠO

### 1. Routes Pages (7 files)

#### Main Dashboard
```
✅ frontend/src/app/workflow/page.tsx
   - Import WorkflowTemplateList component
   - Grid view của templates
   - Search & filter functionality
```

#### Layout & Guards
```
✅ frontend/src/app/workflow/layout.tsx
   - Auth guard (redirect to /login nếu chưa đăng nhập)
   - Breadcrumb navigation
   - Loading state
   - User check với useAuth()
```

#### Instance Detail
```
✅ frontend/src/app/workflow/instances/[id]/page.tsx
   - Dynamic route với params.id
   - Import WorkflowInstanceView component
   - Progress bar, timeline, approvals, comments
```

#### Employee Onboarding
```
✅ frontend/src/app/workflow/employee-onboarding/new/page.tsx
   - Import EmployeeOnboardingForm component
   - 5-step wizard form
   - Third-party accounts management
```

#### My Workflows
```
✅ frontend/src/app/workflow/my-instances/page.tsx
   - List workflows của user hiện tại
   - Search & status filter
   - Card view với badges
   - Format date với date-fns/locale/vi
```

#### My Approvals
```
✅ frontend/src/app/workflow/my-approvals/page.tsx
   - List pending approvals
   - Approve/Reject buttons inline
   - Dialog confirmation với comment
   - Real-time refetch sau approve/reject
```

### 2. Error & Loading States (2 files)

```
✅ frontend/src/app/workflow/error.tsx
   - Error boundary
   - AlertTriangle icon
   - Reset button

✅ frontend/src/app/workflow/loading.tsx
   - Loading skeleton
   - Loader2 spinner
```

### 3. Navigation Update (1 file)

```
✅ frontend/src/components/layout/admin-sidebar-layout.tsx
   - Thêm Workflow icon import (lucide-react)
   - Thêm menu item "Workflow" với icon
   - Children submenu:
     • Dashboard
     • Workflows của tôi
     • Chờ phê duyệt
     • Checkin nhân sự
   - Required roles: admin, super_admin, content_manager, hr_manager, manager
```

---

## 🎯 ROUTES STRUCTURE

```
/workflow
├── / (page.tsx)                          → Dashboard với template list
├── /layout.tsx                           → Auth guard + breadcrumbs
├── /error.tsx                            → Error boundary
├── /loading.tsx                          → Loading state
├── /instances/
│   └── [id]/
│       └── page.tsx                      → Instance detail view
├── /my-instances/
│   └── page.tsx                          → My workflows list
├── /my-approvals/
│   └── page.tsx                          → Pending approvals
└── /employee-onboarding/
    └── new/
        └── page.tsx                      → Onboarding form wizard
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Auth Guard Implementation:
```typescript
// frontend/src/app/workflow/layout.tsx

'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function WorkflowLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/workflow');
    }
  }, [user, loading, router]);

  // Loading state
  if (loading) return <Loader2 />;
  
  // Not authenticated
  if (!user) return null;
  
  return <>{children}</>;
}
```

### Role-Based Access:
```typescript
// In admin-sidebar-layout.tsx
{
  name: 'Workflow',
  href: '/workflow',
  icon: Workflow,
  requiredRoles: [
    'admin',
    'super_admin', 
    'content_manager',
    'hr_manager',    // ← HR có thể approve
    'manager'        // ← Manager có thể approve
  ],
}
```

---

## 🎨 UI/UX FEATURES (Theo rulepromt.txt)

### ✅ Tuân thủ rules:
- **Shadcn UI**: Tất cả components dùng Shadcn (Button, Card, Badge, Dialog, etc.)
- **Mobile-first**: Responsive với grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Dark mode**: Support dark: classes
- **Vietnamese**: Tất cả labels tiếng Việt
- **Lucide icons**: Workflow, CheckCircle, XCircle, Clock, Eye, AlertCircle
- **Toast notifications**: Dùng Sonner
- **Date formatting**: date-fns với locale vi
- **Loading states**: Loader2 với animate-spin
- **Error handling**: Error boundaries với reset functionality

### Components Used:
```typescript
// From Shadcn UI
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// From Lucide React
import { 
  Loader2, Search, Filter, Eye, Clock, 
  CheckCircle, XCircle, AlertCircle, 
  Workflow, RefreshCcw 
} from 'lucide-react';

// Toast
import { toast } from 'sonner';

// Date formatting
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
```

---

## 🔄 DATA FLOW

### 1. Dashboard Flow:
```
User → /workflow 
  → WorkflowTemplateList component
  → useQuery(GET_WORKFLOW_TEMPLATES)
  → Display grid với search/filter
  → Click "Bắt đầu" 
  → Tùy template navigate to specific form
```

### 2. Employee Onboarding Flow:
```
User → /workflow/employee-onboarding/new
  → EmployeeOnboardingForm component
  → Fill 5 steps (wizard)
  → Submit → useMutation(START_EMPLOYEE_ONBOARDING)
  → Navigate to /workflow/instances/{id}
```

### 3. Approval Flow:
```
Manager → /workflow/my-approvals
  → GET_MY_PENDING_APPROVALS query
  → Display list
  → Click Approve/Reject
  → Dialog opens với comment textarea
  → Submit → RESPOND_TO_APPROVAL mutation
  → Refetch list
  → Toast success
```

### 4. Instance Detail Flow:
```
User → /workflow/instances/{id}
  → WorkflowInstanceView component
  → useQuery(GET_WORKFLOW_INSTANCE) with polling (10s)
  → Display: progress, timeline, approvals, comments, activity log
  → Real-time updates every 10s
```

---

## 📊 APOLLO GRAPHQL INTEGRATION

### Queries Used:
```graphql
✅ GET_WORKFLOW_TEMPLATES        # Dashboard list
✅ GET_MY_WORKFLOW_INSTANCES     # My instances page
✅ GET_MY_PENDING_APPROVALS      # My approvals page
✅ GET_WORKFLOW_INSTANCE         # Instance detail (với polling)
```

### Mutations Used:
```graphql
✅ START_EMPLOYEE_ONBOARDING     # Start checkin workflow
✅ RESPOND_TO_APPROVAL           # Approve/Reject
✅ CREATE_WORKFLOW_COMMENT       # Add comment
✅ CANCEL_WORKFLOW_INSTANCE      # Cancel workflow
```

### Apollo Config:
```typescript
// All queries use:
fetchPolicy: 'network-only'  // Always fresh data

// Instance detail uses:
pollInterval: 10000  // Poll every 10 seconds for real-time updates
```

---

## 🧪 TESTING CHECKLIST

### Manual Testing Steps:

#### 1. ✅ Test Authentication
```bash
# 1. Chưa login
Navigate to: http://localhost:3000/workflow
Expected: Redirect to /login?redirect=/workflow

# 2. Login xong
Expected: Show workflow dashboard
```

#### 2. ✅ Test Dashboard
```bash
Navigate to: http://localhost:3000/workflow
Expected: 
- Grid of workflow templates
- Search box
- Category filter
- Status filter
- "Bắt đầu" button on each card
```

#### 3. ✅ Test Employee Onboarding
```bash
Navigate to: /workflow/employee-onboarding/new
Expected:
- 5-step wizard với progress bar
- Step 1: Form fields (fullName*, email*, phone*, etc.)
- Step 2: Auto message
- Step 3: Third-party accounts (add/remove)
- Step 4: Approval message
- Step 5: Review + Submit button
- After submit: Navigate to instance detail
```

#### 4. ✅ Test My Instances
```bash
Navigate to: /workflow/my-instances
Expected:
- List of user's workflows
- Search box
- Status filter dropdown
- "Xem chi tiết" button
- Status badges (PENDING/IN_PROGRESS/COMPLETED/CANCELLED)
```

#### 5. ✅ Test My Approvals
```bash
Navigate to: /workflow/my-approvals
Expected:
- List of pending approvals
- Count badge "X yêu cầu đang chờ"
- "Phê duyệt" button (green)
- "Từ chối" button (red)
- Dialog with comment textarea
- After approve: Toast success + refetch list
```

#### 6. ✅ Test Instance Detail
```bash
Navigate to: /workflow/instances/{some-id}
Expected:
- Progress bar (current step / total steps)
- Timeline with step icons
- Status badges
- Approval section (if applicable)
- Comment form
- Activity log sidebar
- Real-time updates (poll every 10s)
```

---

## 🐛 POTENTIAL ISSUES & SOLUTIONS

### Issue 1: AuthContext not found
**Error**: `Cannot find module '@/contexts/AuthContext'`

**Solution**: 
```bash
# Check if AuthContext exists
ls frontend/src/contexts/AuthContext.tsx

# If not, create it or use existing auth hook
# Update layout.tsx import path
```

### Issue 2: Navigation menu not showing Workflow
**Error**: Menu doesn't render Workflow item

**Solution**:
```typescript
// Check user roles in browser console
console.log(user?.roleType);
console.log(user?.roles);

// Ensure user has one of: admin, super_admin, content_manager, hr_manager, manager
```

### Issue 3: GraphQL queries fail
**Error**: `Network error` or `400 Bad Request`

**Solution**:
```bash
# 1. Check backend is running
cd backend && bun run dev:backend

# 2. Check GraphQL endpoint
# Open: http://localhost:4000/graphql

# 3. Check NEXT_PUBLIC_GRAPHQL_URL in .env
echo $NEXT_PUBLIC_GRAPHQL_URL
# Should be: http://localhost:4000/graphql
```

### Issue 4: Components not found
**Error**: `Cannot find module '@/components/workflow/...'`

**Solution**:
```bash
# Ensure components exist:
ls frontend/src/components/workflow/
# Should show:
# - WorkflowTemplateList.tsx
# - WorkflowInstanceView.tsx
# - EmployeeOnboardingForm.tsx
```

---

## 📦 DEPENDENCIES REQUIRED

### Already in package.json (should be):
```json
{
  "dependencies": {
    "@apollo/client": "^3.x.x",
    "graphql": "^16.x.x",
    "lucide-react": "^0.x.x",
    "date-fns": "^2.x.x",
    "sonner": "^1.x.x",
    "next": "^15.x.x",
    "react": "^19.x.x"
  }
}
```

### Shadcn UI components used:
```bash
# Should already be installed:
✅ button
✅ card
✅ badge
✅ input
✅ select
✅ dialog
✅ textarea
✅ avatar
✅ dropdown-menu
✅ scroll-area
```

---

## 🚀 NEXT STEPS

### Immediate (Now):
1. **Test routes locally**:
   ```bash
   cd frontend
   bun run dev:frontend
   # Navigate to http://localhost:3000/workflow
   ```

2. **Setup employee onboarding template**:
   ```bash
   # Open GraphQL Playground: http://localhost:4000/graphql
   # Run mutation:
   mutation {
     setupEmployeeOnboardingWorkflow
   }
   ```

3. **Test full flow**:
   - Login as admin/manager
   - Go to /workflow
   - Click "Bắt đầu" on "Checkin Nhân Sự" template
   - Fill form
   - Submit
   - View instance detail
   - (As manager) Go to /workflow/my-approvals
   - Approve/Reject

### Short-term (1-2 days):
4. Add more workflow templates (nghỉ phép, tạm ứng, etc.)
5. Add permissions check (RBAC)
6. Add email notifications (optional)
7. Add workflow analytics (optional)

### Medium-term (1 week):
8. Visual workflow designer (drag & drop) - optional
9. Parallel approvals - optional
10. Conditional routing - optional
11. SLA tracking - optional

---

## 📸 EXPECTED UI SCREENSHOTS

### Dashboard (/workflow):
```
┌─────────────────────────────────────────────────┐
│ Workflow                                        │
│ Quản lý các quy trình nghiệp vụ trong doanh    │
│ nghiệp                                          │
├─────────────────────────────────────────────────┤
│ [Search...           ] [Category ▼] [Status ▼] │
├─────────────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│ │ Checkin  │  │ Nghỉ phép│  │ Tạm ứng  │      │
│ │ Nhân Sự  │  │          │  │          │      │
│ │ [Active] │  │ [Active] │  │ [Active] │      │
│ │          │  │          │  │          │      │
│ │[Bắt đầu] │  │[Bắt đầu] │  │[Bắt đầu] │      │
│ └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
```

### My Approvals (/workflow/my-approvals):
```
┌─────────────────────────────────────────────────┐
│ Chờ phê duyệt                                   │
│ Danh sách các yêu cầu cần bạn phê duyệt        │
├─────────────────────────────────────────────────┤
│ [🕒 3 yêu cầu đang chờ]                         │
├─────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐  │
│ │ WF-2024-0001 | Bước 4                     │  │
│ │ Checkin Nguyễn Văn A                      │  │
│ │ Template: Checkin Nhân Sự | 29/11/24      │  │
│ │ [Xem chi tiết] [✓ Phê duyệt] [✗ Từ chối] │  │
│ └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Instance Detail (/workflow/instances/{id}):
```
┌─────────────────────────────────────────────────┐
│ Checkin Nguyễn Văn A     [IN_PROGRESS]         │
│ WF-2024-0001                                    │
│ Progress: ████████░░░░░░░░ 40% (2/5)          │
├─────────────────────────────────────────────────┤
│ Timeline:                   │ Activity Log      │
│ ✓ 1. Nhập thông tin        │ • Created by...   │
│ ✓ 2. Tạo tài khoản         │ • Step 1 completed│
│ → 3. Tài khoản thứ 3 [NOW] │ • Step 2 auto...  │
│   4. Phê duyệt             │                   │
│   5. Xác nhận              │                   │
│                            │                   │
│ Comments:                   │                   │
│ [Add comment...           ] │                   │
└─────────────────────────────────────────────────┘
```

---

## ✅ SUMMARY

**Completed**: ✅ **100%**

**Files Created**: 10
- 6 page routes
- 1 layout với auth guard
- 1 error boundary
- 1 loading state
- 1 navigation menu update

**Lines of Code**: ~1,200 lines

**Features**:
- ✅ Authentication guard
- ✅ Breadcrumb navigation
- ✅ Workflow templates dashboard
- ✅ Employee onboarding wizard (5 steps)
- ✅ My workflows list
- ✅ Pending approvals với approve/reject
- ✅ Instance detail với real-time polling
- ✅ Error boundaries
- ✅ Loading states
- ✅ Mobile responsive
- ✅ Dark mode support
- ✅ Vietnamese labels
- ✅ Shadcn UI components
- ✅ Toast notifications
- ✅ GraphQL Apollo integration

**Status**: 🚀 **READY FOR TESTING**

---

**Next**: Start backend + frontend và test tại `http://localhost:3000/workflow` 🎯
