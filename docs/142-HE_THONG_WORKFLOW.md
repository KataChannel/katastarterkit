# HỆ THỐNG WORKFLOW VÀ QUY TRÌNH CHECKIN NHÂN SỰ

## 📋 Tổng quan

Hệ thống Workflow cung cấp framework linh hoạt để quản lý các quy trình nghiệp vụ trong doanh nghiệp. Được thiết kế theo Clean Architecture với NestJS, GraphQL API, và Prisma ORM.

**Use case chính**: Quy trình Checkin Nhân Sự với 5 bước tự động hóa việc nhập thông tin, tạo tài khoản, và phê duyệt nhân viên mới.

---

## 🏗️ Kiến trúc Database

### Models chính (9 models):

1. **WorkflowTemplate** - Mẫu quy trình
   - Quản lý các quy trình (code, name, category, icon, color, isActive)
   - Ví dụ: `CHECKIN_NHANSU` - Quy trình Checkin Nhân Sự

2. **WorkflowStep** - Bước trong quy trình
   - Các loại: FORM, APPROVAL, NOTIFICATION, AUTOMATION, CONDITION
   - Config JSON linh hoạt cho từng loại step

3. **WorkflowInstance** - Instance đang chạy
   - Trạng thái: PENDING → IN_PROGRESS → WAITING_APPROVAL → COMPLETED
   - Lưu formData, metadata, currentStepNumber

4. **StepExecution** - Thực thi từng bước
   - Track tiến độ từng step (startedAt, completedAt, inputData, outputData)

5. **WorkflowApproval** - Phê duyệt
   - Status: PENDING, APPROVED, REJECTED, DELEGATED, CANCELLED
   - Link với User (approver)

6. **WorkflowComment** - Bình luận
   - Hỗ trợ thảo luận trong workflow

7. **WorkflowActivityLog** - Lịch sử hoạt động
   - Audit trail đầy đủ (action, description, details JSON, actor)

8. **EmployeeThirdPartyAccount** - Tài khoản bên thứ 3
   - Quản lý Gmail, Facebook, Zalo, CRM, Slack, Teams, Zoom...
   - Link với EmployeeProfile

9. **Enums**: WorkflowStatus, WorkflowInstanceStatus, StepType, ApprovalStatus, AccountType

---

## 🔧 Backend Architecture

### Services

**1. WorkflowService** (`backend/src/workflow/workflow.service.ts`)
- `createWorkflowTemplate()` - Tạo mẫu quy trình
- `getWorkflowTemplates()` - Lấy danh sách templates
- `createWorkflowInstance()` - Khởi tạo instance mới
- `completeStep()` - Hoàn thành 1 bước
- `respondToApproval()` - Phê duyệt/từ chối
- `createWorkflowComment()` - Thêm bình luận
- `logActivity()` - Ghi log tự động

**2. EmployeeOnboardingService** (`backend/src/workflow/employee-onboarding.service.ts`)
- `setupEmployeeOnboardingWorkflow()` - Setup template lần đầu (5 steps)
- `startEmployeeOnboarding()` - Bắt đầu quy trình checkin
- `completeStep1CreateEmployee()` - Tạo EmployeeProfile + User
- `completeStep3AddThirdPartyAccounts()` - Thêm tài khoản bên thứ 3
- `getEmployeeOnboardingStatus()` - Xem trạng thái
- `assignApprover()` - Phân công người phê duyệt

### GraphQL API

**Resolver**: `backend/src/workflow/workflow.resolver.ts`

**Queries**:
```graphql
workflowTemplate(id: ID!): WorkflowTemplate
workflowTemplates(category: String, isActive: Boolean): [WorkflowTemplate!]!
workflowInstance(id: ID!): WorkflowInstance
workflowInstances(status: String, initiatedBy: ID): [WorkflowInstance!]!
myWorkflowInstances: [WorkflowInstance!]!
myPendingApprovals: [WorkflowApproval!]!
getEmployeeOnboardingStatus(employeeId: ID!): EmployeeOnboardingStatus
```

**Mutations**:
```graphql
createWorkflowTemplate(input: CreateWorkflowTemplateInput!): WorkflowTemplate!
updateWorkflowTemplate(id: ID!, input: UpdateWorkflowTemplateInput!): WorkflowTemplate!
createWorkflowInstance(input: CreateWorkflowInstanceInput!): WorkflowInstance!
completeStep(input: CompleteStepInput!): Boolean!
respondToApproval(input: RespondToApprovalInput!): Boolean!
createWorkflowComment(input: CreateWorkflowCommentInput!): WorkflowComment!
cancelWorkflowInstance(id: ID!, reason: String!): Boolean!
startEmployeeOnboarding(input: StartEmployeeOnboardingInput!): WorkflowInstance!
setupEmployeeOnboardingWorkflow: Boolean!
```

---

## 💻 Frontend Components

### 1. WorkflowTemplateList
**File**: `frontend/src/components/workflow/WorkflowTemplateList.tsx`

**Chức năng**:
- Hiển thị danh sách các mẫu quy trình (grid layout)
- Filter theo category, status
- Search theo tên/code
- Click "Bắt đầu quy trình" để tạo instance mới
- Mobile-first responsive design

**UI Elements**:
- Card với icon màu sắc category
- Badge status (Hoạt động/Ngừng)
- Button "Tạo quy trình mới"
- Search bar + 2 Select filters

### 2. WorkflowInstanceView
**File**: `frontend/src/components/workflow/WorkflowInstanceView.tsx`

**Chức năng**:
- Xem chi tiết instance đang chạy
- Progress bar tiến độ
- Timeline các bước (completed/current/pending)
- Approve/Reject interface cho approvers
- Bình luận real-time (poll every 10s)
- Activity log sidebar

**Layout**:
- 2 cột: Main content (steps, approvals, comments) + Sidebar (info, activity log)
- Dialog phê duyệt với textarea nhập lý do
- Mobile responsive với stacking layout

### 3. EmployeeOnboardingForm
**File**: `frontend/src/components/workflow/EmployeeOnboardingForm.tsx`

**Chức năng**:
- Form wizard 5 bước với progress bar
- **Bước 1**: Nhập thông tin cơ bản (họ tên, email, SĐT, vị trí, phòng ban, ngày bắt đầu, địa chỉ)
- **Bước 2**: Thông báo tự động tạo user (read-only)
- **Bước 3**: Thêm tài khoản bên thứ 3 (Gmail, Slack, CRM...) - có thể thêm nhiều
- **Bước 4-5**: Chờ phê duyệt (auto redirect sau submit)

**Validation**:
- Email format check
- Phone number 10-11 số
- Required fields với dấu * đỏ
- Error messages real-time

**UI Features**:
- Step indicator với icons
- Combobox cho Select (theo rule)
- Icons cho từng input field
- Button "Thêm tài khoản" động
- Mobile-first layout

---

## 🚀 Quy trình Employee Checkin (5 bước)

### Bước 1: Nhập thông tin nhân sự
**Step Type**: FORM
**Thực hiện**: HR Manager
- Form nhập: fullName, email, phone, position, department, startDate, address
- Validation đầy đủ
- Click "Tiếp tục"

### Bước 2: Tạo tài khoản User
**Step Type**: AUTOMATION
**Thực hiện**: Hệ thống tự động
- Tạo User với email/username
- Tạo EmployeeProfile link với User
- Generate employeeCode (e.g. EMP20240001)
- Set isActive = true, isVerified = false

### Bước 3: Thêm tài khoản bên thứ 3
**Step Type**: FORM
**Thực hiện**: HR Manager
- Thêm Gmail, Slack, Zoom, CRM...
- Mỗi account có: accountType, username, email, accountName
- Có thể skip nếu không có

### Bước 4: Phê duyệt
**Step Type**: APPROVAL
**Thực hiện**: Quản lý phê duyệt
- HR Director review thông tin
- APPROVED → tiếp bước 5
- REJECTED → dừng workflow

### Bước 5: Xác nhận cuối
**Step Type**: NOTIFICATION
**Thực hiện**: Nhân viên xác nhận
- Gửi email thông báo
- Nhân viên xác nhận thông tin
- Hoàn thành workflow → status = COMPLETED

---

## 📊 Flow Data

### FormData Example:
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@company.com",
  "phone": "0901234567",
  "position": "Nhân viên kinh doanh",
  "department": "Phòng kinh doanh",
  "startDate": "2024-12-01",
  "address": "123 Đường ABC, Quận 1, TP.HCM",
  "thirdPartyAccounts": [
    {
      "accountType": "GMAIL",
      "username": "nguyenvana",
      "email": "nguyenvana@gmail.com"
    },
    {
      "accountType": "SLACK",
      "username": "nguyenvana",
      "email": "nguyenvana@company.slack.com"
    }
  ]
}
```

### Metadata Example:
```json
{
  "employeeId": "clx...",
  "userId": "cly..."
}
```

---

## 🔐 Security & Permissions

- **Authentication**: JwtAuthGuard cho tất cả GraphQL operations
- **Authorization**: RolesGuard (sẽ tích hợp)
- **Audit Trail**: Mọi action đều ghi log với actorId
- **Input Sanitization**: GraphQL validation + DTO validation

---

## 📦 Installation & Setup

### Backend Setup:
```bash
cd backend

# Database push (đã hoàn thành)
bunx prisma db push
bunx prisma generate

# WorkflowModule đã register trong AppModule
# Start backend
bun run dev:backend
```

### Frontend Setup:
```bash
cd frontend

# Components đã tạo sẵn trong:
# - src/components/workflow/WorkflowTemplateList.tsx
# - src/components/workflow/WorkflowInstanceView.tsx  
# - src/components/workflow/EmployeeOnboardingForm.tsx

# GraphQL queries trong:
# - src/graphql/workflow.ts

# Start frontend
bun run dev:frontend
```

### First Time Setup:
```graphql
mutation {
  setupEmployeeOnboardingWorkflow
}
```
→ Tạo workflow template "CHECKIN_NHANSU" với 5 steps

---

## 🎯 Usage Example

### 1. Khởi tạo quy trình checkin:
```graphql
mutation {
  startEmployeeOnboarding(
    input: {
      formData: {
        fullName: "Nguyễn Văn B"
        email: "nguyenvanb@company.com"
        phone: "0909999999"
        position: "Developer"
        department: "IT"
        startDate: "2024-12-01"
      }
    }
  ) {
    id
    instanceCode
    status
    currentStepNumber
  }
}
```

### 2. Xem danh sách quy trình của tôi:
```graphql
query {
  myWorkflowInstances {
    id
    instanceCode
    title
    status
    currentStepNumber
    workflowTemplate {
      name
      category
    }
  }
}
```

### 3. Phê duyệt:
```graphql
mutation {
  respondToApproval(
    input: {
      approvalId: "clx..."
      decision: "APPROVED"
      comment: "Đã kiểm tra, phê duyệt!"
    }
  )
}
```

### 4. Xem approval đang chờ:
```graphql
query {
  myPendingApprovals {
    id
    stepNumber
    workflowInstance {
      title
      description
    }
  }
}
```

---

## 🛠️ Customization

### Thêm workflow template mới:

1. **Backend**: Tạo service method tương tự `setupEmployeeOnboardingWorkflow()`
2. **Define steps**: Với stepType, config JSON phù hợp
3. **Frontend**: Tạo form component tùy chỉnh theo steps
4. **GraphQL**: Expose mutation `startYourWorkflow()`

### Step Types hỗ trợ:

- **FORM**: Hiển thị form nhập liệu
  - Config: `{ fields: [{ name, label, type, required }] }`
  
- **APPROVAL**: Chờ phê duyệt
  - Config: `{ approvers: [userId], approvalType: "SINGLE" | "ALL" }`
  
- **NOTIFICATION**: Gửi thông báo
  - Config: `{ notificationType: "EMAIL" | "SMS", template: "template-name" }`
  
- **AUTOMATION**: Tự động thực thi
  - Config: `{ action: "CREATE_USER", params: { ... } }`
  
- **CONDITION**: Điều kiện rẽ nhánh
  - Config: `{ condition: "expression", trueStep: 5, falseStep: 6 }`

---

## 📝 Notes

- **Prisma**: Schema có 5,900+ lines, cân nhắc split theo module
- **Mobile-first**: Tất cả components đều responsive
- **Vietnamese**: Toàn bộ UI và messages tiếng Việt
- **Real-time**: WorkflowInstanceView poll every 10s để update
- **Shadcn UI**: Sử dụng components từ shadcn/ui
- **No Testing**: Theo quy tắc project, không tạo test files
- **No Git**: Không có git commands trong code

---

## 🎨 UI Rules Tuân thủ

✅ Tất cả Select đều dùng **Combobox** (Select component của shadcn)
✅ Dialog có cấu trúc: **DialogHeader + DialogContent (scrollable) + DialogFooter**
✅ Mobile-first với breakpoints: sm, md, lg, xl
✅ Icons từ **lucide-react**
✅ Dark mode support
✅ Toast notifications với **sonner**
✅ Form validation real-time

---

## 🚀 Next Steps

1. **Testing**: Chạy workflow checkin nhân sự end-to-end
2. **Permissions**: Tích hợp RBAC cho approve actions
3. **Notifications**: Email/SMS khi có approval pending
4. **Dashboard**: Trang tổng quan workflow statistics
5. **Reports**: Export workflow history to Excel/PDF
6. **Mobile App**: PWA support đã có sẵn

---

**Tóm lại**: Hệ thống Workflow hoàn chỉnh với backend NestJS + GraphQL, frontend Next.js + Shadcn UI, database Prisma + PostgreSQL. Use case Employee Onboarding đã implement đầy đủ 5 bước với automation và approval flow.

**Status**: ✅ Backend hoàn thành | ✅ Frontend hoàn thành | ✅ Database đã push | 📝 Documentation hoàn thành
