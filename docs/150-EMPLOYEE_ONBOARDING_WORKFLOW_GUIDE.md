# 🚀 HƯỚNG DẪN SỬ DỤNG EMPLOYEE ONBOARDING WORKFLOW

## 📋 Tổng Quan

**Employee Onboarding Workflow** là quy trình checkin nhân sự mới bao gồm 5 bước:

| Bước | Loại | Mô tả | Bắt buộc |
|------|------|-------|----------|
| 1 | 📝 FORM | Nhập thông tin nhân sự | ✅ Có |
| 2 | ⚡ AUTOMATION | Tạo tài khoản User tự động | ✅ Có |
| 3 | 📝 FORM | Thêm tài khoản bên thứ 3 | ⚪ Không |
| 4 | ✅ APPROVAL | Phê duyệt từ quản lý HR | ✅ Có |
| 5 | 📧 NOTIFICATION | Xác nhận từ nhân sự | ✅ Có |

---

## 🛠️ Cài Đặt & Chạy Seed

### Cách 1: Sử dụng npm/bun script

```bash
cd backend
bun run seed:workflow-onboarding
```

### Cách 2: Chạy trực tiếp

```bash
cd backend
npx ts-node prisma/seeds/seed-employee-onboarding-workflow.ts
# hoặc
bun run ts-node prisma/seeds/seed-employee-onboarding-workflow.ts
```

### Output mong đợi

```
🌱 Starting Employee Onboarding Workflow Seed...
📧 Admin email: katachanneloffical@gmail.com

✅ Tìm thấy user: katachanneloffical@gmail.com (ID: xxx)

📋 Đang tạo Workflow Template...
✅ Đã tạo template: Quy trình Checkin Nhân Sự (ID: xxx)

📝 Đang tạo các bước workflow...
   ✅ Step 1: Nhập thông tin nhân sự
   ✅ Step 2: Tạo tài khoản User
   ✅ Step 3: Thêm tài khoản bên thứ 3
   ✅ Step 4: Phê duyệt từ quản lý
   ✅ Step 5: Xác nhận từ nhân sự

============================================================
✅ SEED COMPLETED SUCCESSFULLY!
============================================================
```

---

## 🔐 Đăng Nhập

Sử dụng tài khoản admin:
- **Email**: `katachanneloffical@gmail.com`
- **URL**: http://localhost:12000/login

---

## 📍 Truy Cập Workflow

### Frontend Routes

| Route | Mô tả |
|-------|-------|
| `/workflow` | Danh sách workflow templates |
| `/workflow/templates` | Quản lý templates |
| `/workflow/instances` | Danh sách instances đang chạy |
| `/workflow/instances/:id` | Chi tiết 1 instance |
| `/workflow/employee-onboarding` | Form checkin nhân sự |
| `/workflow/my-approvals` | Các phê duyệt đang chờ |

---

## 🚀 Bắt Đầu Quy Trình Mới

### Cách 1: Từ giao diện Web

1. Truy cập `/workflow`
2. Tìm card **"Quy trình Checkin Nhân Sự"**
3. Click **"Bắt đầu quy trình"**
4. Điền form thông tin nhân sự
5. Submit và theo dõi tiến trình

### Cách 2: Sử dụng GraphQL

```graphql
# Truy cập: http://localhost:12001/graphql

# 1. Setup template (chỉ cần chạy 1 lần nếu seed chưa có)
mutation SetupTemplate {
  setupEmployeeOnboardingWorkflow
}

# 2. Bắt đầu quy trình onboarding
mutation StartOnboarding {
  startEmployeeOnboarding(input: {
    formData: {
      fullName: "Nguyễn Văn A"
      email: "nguyenvana@company.com"
      phone: "0901234567"
      position: "Developer"
      department: "IT"
      startDate: "2025-01-15"
      address: "123 Đường ABC, Quận 1, TP.HCM"
    }
  }) {
    id
    instanceCode
    title
    status
    currentStepNumber
    createdAt
  }
}
```

---

## 📝 Chi Tiết Các Bước

### Step 1: Nhập Thông Tin Nhân Sự

**Form fields:**

| Field | Label | Type | Required |
|-------|-------|------|----------|
| fullName | Họ và tên | text | ✅ |
| email | Email | email | ✅ |
| phone | Số điện thoại | text | ✅ |
| position | Vị trí | text | ✅ |
| department | Phòng ban | select | ✅ |
| startDate | Ngày bắt đầu | date | ✅ |
| address | Địa chỉ | text | ⚪ |
| dateOfBirth | Ngày sinh | date | ⚪ |
| gender | Giới tính | select | ⚪ |

**Department options:** IT, HR, Finance, Marketing, Sales, Operations, Admin, Other

---

### Step 2: Tạo Tài Khoản (Tự Động)

Hệ thống tự động:
- ✅ Tạo User từ email đã nhập
- ✅ Tạo EmployeeProfile với mã nhân viên (VD: `EMP202500001`)
- ✅ Liên kết User với EmployeeProfile

---

### Step 3: Thêm Tài Khoản Bên Thứ 3 (Optional)

**Account types hỗ trợ:**
- 📧 Gmail công ty
- 💬 Slack
- 👥 Microsoft Teams
- 📊 CRM
- 🎥 Zoom
- 📱 Zalo
- 👤 Facebook
- 🔧 Khác

**GraphQL Mutation:**

```graphql
mutation AddThirdPartyAccounts {
  completeStep(input: {
    workflowInstanceId: "<instance-id>"
    stepNumber: 3
    outputData: {
      thirdPartyAccounts: [
        {
          accountType: "GMAIL"
          username: "nguyenvana@company.com"
          accountName: "Nguyễn Văn A - Gmail công ty"
        },
        {
          accountType: "SLACK"
          username: "nguyenvana"
          accountName: "Van A Nguyen"
        }
      ]
    }
  })
}
```

---

### Step 4: Phê Duyệt

**Ai cần phê duyệt?**
- HR Manager
- Trưởng phòng
- Admin (nếu escalate)

**GraphQL Mutations:**

```graphql
# Xem danh sách chờ phê duyệt
query MyPendingApprovals {
  myPendingApprovals {
    id
    workflowInstance {
      instanceCode
      title
    }
    status
    requestedAt
  }
}

# Phê duyệt
mutation ApproveOnboarding {
  respondToApproval(input: {
    approvalId: "<approval-id>"
    decision: "APPROVED"
    comment: "Đã kiểm tra đầy đủ thông tin. Chấp thuận."
  })
}

# Từ chối
mutation RejectOnboarding {
  respondToApproval(input: {
    approvalId: "<approval-id>"
    decision: "REJECTED"
    comment: "Thiếu thông tin liên hệ khẩn cấp."
  })
}
```

---

### Step 5: Xác Nhận Từ Nhân Sự

- 📧 Email được gửi đến nhân sự
- ✅ Nhân sự click xác nhận thông tin đúng
- ⚠️ Hoặc yêu cầu chỉnh sửa nếu có sai sót

---

## 📊 Theo Dõi Trạng Thái

```graphql
# Xem chi tiết workflow instance
query GetWorkflowInstance {
  workflowInstance(id: "<instance-id>") {
    id
    instanceCode
    title
    status
    currentStepNumber
    formData
    stepExecutions {
      stepNumber
      status
      completedAt
    }
    approvals {
      status
      approver {
        email
      }
      decision
    }
    activityLogs {
      action
      description
      createdAt
    }
  }
}

# Xem trạng thái onboarding của 1 nhân sự
query GetOnboardingStatus {
  getEmployeeOnboardingStatus(employeeId: "<employee-id>") {
    employee {
      fullName
      position
      department
    }
    workflowInstance {
      status
      currentStepNumber
    }
    completionPercentage
  }
}
```

---

## 🔧 Troubleshooting

### Lỗi: "Workflow template not found"

```bash
# Chạy seed lại
cd backend
bun run seed:workflow-onboarding
```

### Lỗi: "User already exists"

Email đã tồn tại trong hệ thống. Kiểm tra:
```graphql
query CheckUser {
  users(filter: { email: "nguyenvana@company.com" }) {
    items {
      id
      email
    }
  }
}
```

### Lỗi: "Permission denied"

Đảm bảo user có quyền:
- `workflow:create`
- `workflow:read`
- `workflow:approve` (cho step 4)

---

## 📁 Files Liên Quan

```
backend/
├── prisma/
│   └── seeds/
│       └── seed-employee-onboarding-workflow.ts  # 👈 Seed file
├── src/
│   └── workflow/
│       ├── workflow.module.ts
│       ├── workflow.service.ts
│       ├── workflow.resolver.ts
│       └── employee-onboarding.service.ts        # 👈 Business logic
frontend/
└── src/
    ├── components/
    │   └── workflow/
    │       ├── WorkflowTemplateList.tsx
    │       ├── WorkflowInstanceView.tsx
    │       └── EmployeeOnboardingForm.tsx        # 👈 Form component
    ├── graphql/
    │   └── workflow.ts                           # 👈 GraphQL queries/mutations
    └── app/
        └── workflow/
            ├── page.tsx
            ├── employee-onboarding/
            │   └── page.tsx
            └── instances/
                └── [id]/
                    └── page.tsx
```

---

## 📞 Hỗ Trợ

- 📧 Email: katachanneloffical@gmail.com
- 💻 GraphQL Playground: http://localhost:12001/graphql
- 📚 Docs: `/docs/142-HE_THONG_WORKFLOW.md`

---

*Created: 30/11/2025*
*Version: 1.0*
*Author: KataChannel Team*
