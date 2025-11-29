# HƯỚNG DẪN TẠO VÀ SỬ DỤNG WORKFLOW MỚI

## 📚 MỤC LỤC
1. [Sử dụng Workflow có sẵn](#1-sử-dụng-workflow-có-sẵn)
2. [Tạo Workflow mới đơn giản](#2-tạo-workflow-mới-đơn-giản)
3. [Tạo Workflow phức tạp với Service](#3-tạo-workflow-phức-tạp-với-service)
4. [Các loại Step Type](#4-các-loại-step-type)
5. [Examples thực tế](#5-examples-thực-tế)

---

## 1. SỬ DỤNG WORKFLOW CÓ SẴN

### 1.1. Quy trình Employee Checkin (Đã có sẵn)

#### Bước 1: Setup workflow lần đầu (Admin)
```graphql
mutation {
  setupEmployeeOnboardingWorkflow
}
```
→ Tạo workflow template "CHECKIN_NHANSU" với 5 steps

#### Bước 2: Bắt đầu quy trình checkin nhân sự mới
```graphql
mutation {
  startEmployeeOnboarding(
    input: {
      formData: {
        fullName: "Nguyễn Văn A"
        email: "nguyenvana@company.com"
        phone: "0901234567"
        position: "Developer"
        department: "IT"
        startDate: "2024-12-01"
        address: "123 Đường ABC, TP.HCM"
      }
    }
  ) {
    id
    instanceCode
    title
    status
    currentStepNumber
  }
}
```

#### Bước 3: Xem danh sách workflows đang chạy
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
      icon
      color
    }
    createdAt
  }
}
```

#### Bước 4: Xem chi tiết 1 workflow instance
```graphql
query {
  workflowInstance(id: "clx...") {
    id
    instanceCode
    title
    description
    status
    currentStepNumber
    formData
    stepExecutions {
      stepNumber
      status
      workflowStep {
        name
        description
        stepType
      }
    }
    approvals {
      id
      status
      approver {
        id
        username
        email
      }
    }
    comments {
      content
      createdAt
      author {
        username
      }
    }
  }
}
```

#### Bước 5: Phê duyệt (nếu bạn là approver)
```graphql
mutation {
  respondToApproval(
    input: {
      approvalId: "approval-id-here"
      decision: "APPROVED"  # hoặc "REJECTED"
      comment: "Thông tin đầy đủ, phê duyệt!"
    }
  )
}
```

#### Bước 6: Xem approvals đang chờ của mình
```graphql
query {
  myPendingApprovals {
    id
    stepNumber
    createdAt
    workflowInstance {
      id
      instanceCode
      title
      description
      formData
      workflowTemplate {
        name
      }
    }
  }
}
```

#### Bước 7: Thêm comment
```graphql
mutation {
  createWorkflowComment(
    input: {
      workflowInstanceId: "instance-id-here"
      content: "Cần bổ sung thêm thông tin về bằng cấp"
    }
  ) {
    id
    content
    createdAt
    author {
      username
    }
  }
}
```

---

## 2. TẠO WORKFLOW MỚI ĐỠN GIẢN (Không cần Service)

### Example: Workflow "Yêu cầu nghỉ phép"

#### Bước 1: Tạo Workflow Template qua GraphQL
```graphql
mutation {
  createWorkflowTemplate(
    input: {
      code: "NGHI_PHEP"
      name: "Yêu cầu nghỉ phép"
      description: "Quy trình xin nghỉ phép của nhân viên"
      category: "HR"
      icon: "Calendar"
      color: "#3b82f6"
      isActive: true
    }
  ) {
    id
    code
    name
  }
}
```

#### Bước 2: Thêm các Steps
```graphql
# Step 1: Nhập form yêu cầu nghỉ phép
mutation {
  createWorkflowStep(
    input: {
      workflowTemplateId: "template-id-from-step-1"
      stepNumber: 1
      name: "Nhập thông tin nghỉ phép"
      description: "Nhân viên điền form yêu cầu nghỉ phép"
      stepType: FORM
      isRequired: true
      isActive: true
      config: {
        fields: [
          { name: "startDate", label: "Từ ngày", type: "date", required: true }
          { name: "endDate", label: "Đến ngày", type: "date", required: true }
          { name: "leaveType", label: "Loại nghỉ phép", type: "select", required: true, options: ["Nghỉ phép năm", "Nghỉ ốm", "Nghỉ không lương"] }
          { name: "reason", label: "Lý do", type: "textarea", required: true }
        ]
      }
    }
  ) {
    id
    stepNumber
    name
  }
}

# Step 2: Phê duyệt từ quản lý trực tiếp
mutation {
  createWorkflowStep(
    input: {
      workflowTemplateId: "template-id-from-step-1"
      stepNumber: 2
      name: "Phê duyệt từ quản lý trực tiếp"
      description: "Manager phê duyệt yêu cầu nghỉ phép"
      stepType: APPROVAL
      isRequired: true
      isActive: true
      config: {
        approvalType: "SINGLE"
        approvers: []  # Sẽ assign động khi start
      }
    }
  ) {
    id
    stepNumber
    name
  }
}

# Step 3: Thông báo HR
mutation {
  createWorkflowStep(
    input: {
      workflowTemplateId: "template-id-from-step-1"
      stepNumber: 3
      name: "Thông báo HR"
      description: "Gửi email thông báo cho HR"
      stepType: NOTIFICATION
      isRequired: true
      isActive: true
      config: {
        notificationType: "EMAIL"
        template: "leave-request-approved"
        recipients: ["hr@company.com"]
      }
    }
  ) {
    id
    stepNumber
    name
  }
}
```

#### Bước 3: Sử dụng Workflow
```graphql
mutation {
  createWorkflowInstance(
    input: {
      workflowTemplateId: "template-id-nghiphep"
      title: "Nghỉ phép - Nguyễn Văn A"
      description: "Xin nghỉ phép từ 01/12 - 03/12"
      formData: {
        startDate: "2024-12-01"
        endDate: "2024-12-03"
        leaveType: "Nghỉ phép năm"
        reason: "Về quê thăm gia đình"
      }
      relatedEntityType: "LEAVE_REQUEST"
    }
  ) {
    id
    instanceCode
    status
  }
}
```

#### Bước 4: Complete Step sau khi điền form
```graphql
mutation {
  completeStep(
    input: {
      workflowInstanceId: "instance-id-here"
      stepNumber: 1
      outputData: {
        totalDays: 3
      }
    }
  )
}
```

---

## 3. TẠO WORKFLOW PHỨC TẠP VỚI SERVICE

### Example: Workflow "Phê duyệt đơn hàng lớn"

#### File 1: Backend Service (`backend/src/workflow/order-approval.service.ts`)

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from './workflow.service';
import { StepType, WorkflowStatus } from '@prisma/client';

interface OrderApprovalFormData {
  orderId: string;
  orderValue: number;
  customerName: string;
  items: Array<{ productName: string; quantity: number; price: number }>;
  notes?: string;
}

@Injectable()
export class OrderApprovalService {
  constructor(
    private prisma: PrismaService,
    private workflowService: WorkflowService,
  ) {}

  /**
   * Setup workflow template cho Order Approval (chỉ chạy 1 lần)
   */
  async setupOrderApprovalWorkflow(creatorUserId: string) {
    const existingTemplate = await this.prisma.workflowTemplate.findUnique({
      where: { code: 'APPROVAL_ORDER' },
    });

    if (existingTemplate) {
      return existingTemplate;
    }

    const template = await this.prisma.workflowTemplate.create({
      data: {
        code: 'APPROVAL_ORDER',
        name: 'Phê duyệt đơn hàng lớn',
        description: 'Quy trình phê duyệt đơn hàng có giá trị > 50 triệu',
        category: 'Sales',
        icon: 'ShoppingCart',
        color: '#f59e0b',
        status: WorkflowStatus.ACTIVE,
        isActive: true,
        createdBy: creatorUserId,
        updatedBy: creatorUserId,
      },
    });

    // Step 1: Form nhập thông tin đơn hàng
    await this.prisma.workflowStep.create({
      data: {
        workflowTemplateId: template.id,
        stepNumber: 1,
        name: 'Nhập thông tin đơn hàng',
        description: 'Sales điền thông tin đơn hàng cần phê duyệt',
        stepType: StepType.FORM,
        isRequired: true,
        isActive: true,
        config: {
          fields: [
            { name: 'orderId', label: 'Mã đơn hàng', type: 'text', required: true },
            { name: 'orderValue', label: 'Giá trị đơn hàng', type: 'number', required: true },
            { name: 'customerName', label: 'Tên khách hàng', type: 'text', required: true },
            { name: 'items', label: 'Danh sách sản phẩm', type: 'array', required: true },
          ],
        },
      },
    });

    // Step 2: Condition - Check giá trị đơn hàng
    await this.prisma.workflowStep.create({
      data: {
        workflowTemplateId: template.id,
        stepNumber: 2,
        name: 'Kiểm tra giá trị',
        description: 'Xác định cấp phê duyệt dựa vào giá trị',
        stepType: StepType.CONDITION,
        isRequired: true,
        isActive: true,
        config: {
          condition: 'orderValue > 100000000', // > 100 triệu
          trueStep: 3, // Sales Director
          falseStep: 4, // Sales Manager
        },
      },
    });

    // Step 3: Approval - Sales Director (cho đơn > 100M)
    await this.prisma.workflowStep.create({
      data: {
        workflowTemplateId: template.id,
        stepNumber: 3,
        name: 'Phê duyệt Sales Director',
        description: 'Đơn hàng > 100M cần Sales Director phê duyệt',
        stepType: StepType.APPROVAL,
        isRequired: true,
        isActive: true,
        config: {
          approvalType: 'SINGLE',
          approvers: [], // Assign động
        },
      },
    });

    // Step 4: Approval - Sales Manager (cho đơn 50-100M)
    await this.prisma.workflowStep.create({
      data: {
        workflowTemplateId: template.id,
        stepNumber: 4,
        name: 'Phê duyệt Sales Manager',
        description: 'Đơn hàng 50-100M cần Sales Manager phê duyệt',
        stepType: StepType.APPROVAL,
        isRequired: true,
        isActive: true,
        config: {
          approvalType: 'SINGLE',
          approvers: [],
        },
      },
    });

    // Step 5: Automation - Cập nhật trạng thái đơn hàng
    await this.prisma.workflowStep.create({
      data: {
        workflowTemplateId: template.id,
        stepNumber: 5,
        name: 'Cập nhật đơn hàng',
        description: 'Hệ thống tự động cập nhật trạng thái đơn hàng',
        stepType: StepType.AUTOMATION,
        isRequired: true,
        isActive: true,
        config: {
          action: 'UPDATE_ORDER_STATUS',
          params: {
            status: 'APPROVED',
          },
        },
      },
    });

    // Step 6: Notification - Thông báo khách hàng
    await this.prisma.workflowStep.create({
      data: {
        workflowTemplateId: template.id,
        stepNumber: 6,
        name: 'Thông báo khách hàng',
        description: 'Gửi email xác nhận cho khách hàng',
        stepType: StepType.NOTIFICATION,
        isRequired: true,
        isActive: true,
        config: {
          notificationType: 'EMAIL',
          template: 'order-approved',
        },
      },
    });

    return template;
  }

  /**
   * Bắt đầu quy trình phê duyệt đơn hàng
   */
  async startOrderApproval(formData: OrderApprovalFormData, initiatorUserId: string) {
    // Validate order value
    if (formData.orderValue < 50000000) {
      throw new BadRequestException('Chỉ áp dụng cho đơn hàng > 50 triệu');
    }

    // Get workflow template
    let template = await this.prisma.workflowTemplate.findUnique({
      where: { code: 'APPROVAL_ORDER' },
      include: {
        steps: {
          where: { isActive: true },
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    if (!template) {
      template = await this.setupOrderApprovalWorkflow(initiatorUserId);
    }

    // Create workflow instance
    const workflowInstance = await this.workflowService.createWorkflowInstance(
      {
        workflowTemplateId: template.id,
        title: `Phê duyệt đơn hàng #${formData.orderId}`,
        description: `Khách hàng: ${formData.customerName} - Giá trị: ${formData.orderValue.toLocaleString('vi-VN')} VNĐ`,
        formData: formData as any,
        relatedEntityType: 'ORDER',
        relatedEntityId: formData.orderId,
      },
      initiatorUserId,
    );

    return {
      workflowInstance,
      message: 'Đã khởi tạo quy trình phê duyệt đơn hàng',
    };
  }

  /**
   * Complete Step 1: Validation đơn hàng
   */
  async completeStep1ValidateOrder(workflowInstanceId: string, userId: string) {
    const instance = await this.workflowService.getWorkflowInstance(workflowInstanceId);
    const formData = instance.formData as any;

    // Business logic validation
    const totalValue = formData.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.price,
      0,
    );

    if (Math.abs(totalValue - formData.orderValue) > 1000) {
      throw new BadRequestException('Tổng giá trị sản phẩm không khớp với giá trị đơn hàng');
    }

    // Complete step
    await this.workflowService.completeStep(
      {
        workflowInstanceId,
        stepNumber: 1,
        outputData: {
          totalValue,
          validated: true,
        },
      },
      userId,
    );

    return {
      message: 'Đã xác thực đơn hàng thành công',
      totalValue,
    };
  }
}
```

#### File 2: Update Resolver (`backend/src/workflow/workflow.resolver.ts`)

```typescript
// Thêm vào WorkflowResolver

@Mutation(() => WorkflowInstance)
async startOrderApproval(
  @Args('input') input: StartOrderApprovalInput,
  @Context() context: any,
) {
  const result = await this.orderApprovalService.startOrderApproval(
    input.formData,
    context.req.user.userId,
  );
  return result.workflowInstance;
}

@Mutation(() => Boolean)
async setupOrderApprovalWorkflow(@Context() context: any) {
  await this.orderApprovalService.setupOrderApprovalWorkflow(context.req.user.userId);
  return true;
}
```

#### File 3: Update DTO (`backend/src/workflow/dto/workflow.dto.ts`)

```typescript
// Thêm vào file DTO

@InputType()
export class OrderItemData {
  @Field()
  productName: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

@InputType()
export class OrderApprovalFormData {
  @Field()
  orderId: string;

  @Field(() => Float)
  orderValue: number;

  @Field()
  customerName: string;

  @Field(() => [OrderItemData])
  items: OrderItemData[];

  @Field({ nullable: true })
  notes?: string;
}

@InputType()
export class StartOrderApprovalInput {
  @Field(() => OrderApprovalFormData)
  formData: OrderApprovalFormData;
}
```

#### File 4: Update Module (`backend/src/workflow/workflow.module.ts`)

```typescript
import { OrderApprovalService } from './order-approval.service';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  providers: [
    WorkflowService,
    EmployeeOnboardingService,
    OrderApprovalService, // Thêm dòng này
    WorkflowResolver,
  ],
  exports: [
    WorkflowService,
    EmployeeOnboardingService,
    OrderApprovalService, // Thêm dòng này
  ],
})
export class WorkflowModule {}
```

#### File 5: Frontend Component (`frontend/src/components/workflow/OrderApprovalForm.tsx`)

```typescript
'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { gql } from '@apollo/client';

const START_ORDER_APPROVAL = gql`
  mutation StartOrderApproval($input: StartOrderApprovalInput!) {
    startOrderApproval(input: $input) {
      id
      instanceCode
      title
      status
    }
  }
`;

export default function OrderApprovalForm() {
  const [formData, setFormData] = useState({
    orderId: '',
    orderValue: 0,
    customerName: '',
    items: [{ productName: '', quantity: 1, price: 0 }],
  });

  const [startApproval, { loading }] = useMutation(START_ORDER_APPROVAL);

  const handleSubmit = () => {
    startApproval({
      variables: {
        input: { formData },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Mã đơn hàng</Label>
        <Input
          value={formData.orderId}
          onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
        />
      </div>
      <div>
        <Label>Giá trị đơn hàng</Label>
        <Input
          type="number"
          value={formData.orderValue}
          onChange={(e) => setFormData({ ...formData, orderValue: Number(e.target.value) })}
        />
      </div>
      <div>
        <Label>Tên khách hàng</Label>
        <Input
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
        />
      </div>
      <Button onClick={handleSubmit} disabled={loading}>
        Gửi phê duyệt
      </Button>
    </div>
  );
}
```

---

## 4. CÁC LOẠI STEP TYPE

### 4.1. FORM Step
**Mục đích**: Hiển thị form nhập liệu

**Config JSON**:
```json
{
  "fields": [
    {
      "name": "fieldName",
      "label": "Nhãn hiển thị",
      "type": "text|email|number|date|select|textarea|array",
      "required": true,
      "options": ["option1", "option2"],  // Cho type=select
      "placeholder": "Nhập giá trị...",
      "validation": "regex pattern"
    }
  ]
}
```

**Sử dụng**:
- Form đăng ký
- Form yêu cầu
- Form nhập dữ liệu

### 4.2. APPROVAL Step
**Mục đích**: Chờ phê duyệt từ 1 hoặc nhiều người

**Config JSON**:
```json
{
  "approvalType": "SINGLE|ALL|MAJORITY",
  "approvers": ["userId1", "userId2"],
  "allowDelegate": true,
  "timeout": 86400  // seconds
}
```

**Approval Type**:
- `SINGLE`: Chỉ cần 1 người approve
- `ALL`: Cần tất cả approve
- `MAJORITY`: Cần > 50% approve

### 4.3. NOTIFICATION Step
**Mục đích**: Gửi thông báo tự động

**Config JSON**:
```json
{
  "notificationType": "EMAIL|SMS|PUSH|SLACK",
  "template": "template-name",
  "recipients": ["email@example.com"],
  "dynamicRecipients": "{{formData.managerEmail}}",
  "subject": "Tiêu đề",
  "body": "Nội dung với {{variable}}"
}
```

### 4.4. AUTOMATION Step
**Mục đích**: Thực thi logic tự động

**Config JSON**:
```json
{
  "action": "CREATE_USER|UPDATE_STATUS|SEND_API|RUN_SCRIPT",
  "params": {
    "key": "value"
  }
}
```

**Built-in Actions**:
- `CREATE_USER`: Tạo user từ formData
- `UPDATE_STATUS`: Cập nhật status của entity
- `SEND_API`: Call external API
- `RUN_SCRIPT`: Chạy custom script

### 4.5. CONDITION Step
**Mục đích**: Rẽ nhánh workflow dựa vào điều kiện

**Config JSON**:
```json
{
  "condition": "formData.orderValue > 100000000",
  "trueStep": 3,
  "falseStep": 4,
  "operator": ">|<|==|>=|<=|!=",
  "leftValue": "{{formData.orderValue}}",
  "rightValue": 100000000
}
```

---

## 5. EXAMPLES THỰC TẾ

### Example 1: Workflow "Xin tạm ứng"

```typescript
// 1. Setup Template
const template = {
  code: 'TAM_UNG',
  name: 'Xin tạm ứng',
  category: 'Finance',
  steps: [
    {
      stepNumber: 1,
      name: 'Nhập form tạm ứng',
      stepType: 'FORM',
      config: {
        fields: [
          { name: 'amount', label: 'Số tiền', type: 'number', required: true },
          { name: 'purpose', label: 'Mục đích', type: 'textarea', required: true },
          { name: 'expectedDate', label: 'Ngày cần', type: 'date', required: true },
        ],
      },
    },
    {
      stepNumber: 2,
      name: 'Phê duyệt Manager',
      stepType: 'APPROVAL',
      config: { approvalType: 'SINGLE' },
    },
    {
      stepNumber: 3,
      name: 'Phê duyệt Finance',
      stepType: 'APPROVAL',
      config: { approvalType: 'SINGLE' },
    },
    {
      stepNumber: 4,
      name: 'Chuyển khoản',
      stepType: 'AUTOMATION',
      config: { action: 'TRANSFER_MONEY' },
    },
  ],
};
```

### Example 2: Workflow "Phê duyệt tài liệu"

```typescript
const template = {
  code: 'PHEDUYET_TAILIEU',
  name: 'Phê duyệt tài liệu',
  category: 'IT',
  steps: [
    {
      stepNumber: 1,
      name: 'Upload tài liệu',
      stepType: 'FORM',
      config: {
        fields: [
          { name: 'title', label: 'Tiêu đề', type: 'text', required: true },
          { name: 'documentType', label: 'Loại tài liệu', type: 'select', required: true },
          { name: 'fileUrl', label: 'File đính kèm', type: 'file', required: true },
        ],
      },
    },
    {
      stepNumber: 2,
      name: 'Review kỹ thuật',
      stepType: 'APPROVAL',
      config: { approvalType: 'ALL', approvers: ['tech-lead-id'] },
    },
    {
      stepNumber: 3,
      name: 'Phê duyệt cuối',
      stepType: 'APPROVAL',
      config: { approvalType: 'SINGLE', approvers: ['director-id'] },
    },
    {
      stepNumber: 4,
      name: 'Publish tài liệu',
      stepType: 'AUTOMATION',
      config: { action: 'PUBLISH_DOCUMENT' },
    },
    {
      stepNumber: 5,
      name: 'Thông báo team',
      stepType: 'NOTIFICATION',
      config: { notificationType: 'EMAIL', template: 'document-published' },
    },
  ],
};
```

### Example 3: Workflow "Onboarding thiết bị"

```typescript
const template = {
  code: 'THIETBI_ONBOARDING',
  name: 'Cấp phát thiết bị nhân viên mới',
  category: 'IT',
  steps: [
    {
      stepNumber: 1,
      name: 'Chọn thiết bị',
      stepType: 'FORM',
      config: {
        fields: [
          { name: 'laptop', label: 'Laptop', type: 'select', required: true },
          { name: 'mouse', label: 'Chuột', type: 'select', required: false },
          { name: 'keyboard', label: 'Bàn phím', type: 'select', required: false },
        ],
      },
    },
    {
      stepNumber: 2,
      name: 'Kiểm tra tồn kho',
      stepType: 'AUTOMATION',
      config: { action: 'CHECK_INVENTORY' },
    },
    {
      stepNumber: 3,
      name: 'Phê duyệt IT Manager',
      stepType: 'APPROVAL',
      config: { approvalType: 'SINGLE' },
    },
    {
      stepNumber: 4,
      name: 'Chuẩn bị thiết bị',
      stepType: 'FORM',
      config: {
        fields: [
          { name: 'serialNumbers', label: 'Số serial', type: 'array', required: true },
        ],
      },
    },
    {
      stepNumber: 5,
      name: 'Nhân viên xác nhận nhận',
      stepType: 'APPROVAL',
      config: { approvalType: 'SINGLE' },
    },
  ],
};
```

---

## 6. BEST PRACTICES

### ✅ DO:
- Đặt tên workflow code VIẾT_HOA_SNAKE_CASE
- Mỗi workflow nên có 3-7 steps (không quá phức tạp)
- Sử dụng CONDITION step để rẽ nhánh thay vì tạo nhiều workflows
- Log activity đầy đủ cho audit trail
- Validate formData trước khi complete step
- Sử dụng metadata để lưu thông tin bổ sung
- Test workflow trên staging trước khi deploy

### ❌ DON'T:
- Không hardcode approver IDs trong config (dùng dynamic assignment)
- Không tạo workflow quá dài (> 10 steps)
- Không skip validation
- Không lưu sensitive data trong formData (dùng encryption)
- Không quên handle error cases

---

## 7. TESTING

### Test workflow trên GraphQL Playground:

```graphql
# 1. Setup workflow
mutation { setupYourWorkflow }

# 2. Start instance
mutation {
  createWorkflowInstance(input: { ... }) {
    id
  }
}

# 3. Check status
query {
  workflowInstance(id: "...") {
    status
    currentStepNumber
  }
}

# 4. Complete step
mutation {
  completeStep(input: { ... })
}

# 5. Approve
mutation {
  respondToApproval(input: { ... })
}
```

---

## 8. TROUBLESHOOTING

### Problem: Workflow stuck ở 1 bước
**Solution**: Check `myPendingApprovals` để xem có approval nào đang pending

### Problem: Không thể complete step
**Solution**: Check `currentStepNumber` có khớp với step đang complete không

### Problem: Approval không hiện
**Solution**: Check approver IDs đã được assign chưa trong config

---

## 📞 Support

Nếu gặp vấn đề, check:
1. Activity logs trong workflow instance
2. Backend logs (NestJS console)
3. GraphQL errors trong response
4. Database records (Prisma Studio)

---

**Tóm tắt**: 
- Workflow đơn giản → Dùng GraphQL mutations tạo trực tiếp
- Workflow phức tạp → Tạo Service riêng với business logic
- Luôn test trước khi deploy production
- Document workflow flow cho team members
