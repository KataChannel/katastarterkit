/**
 * Seed Employee Onboarding Workflow
 * 
 * Tạo workflow template "Quy trình Checkin Nhân Sự" với 5 bước:
 * 1. Nhập thông tin nhân sự (FORM)
 * 2. Tạo tài khoản User (AUTOMATION)
 * 3. Thêm tài khoản bên thứ 3 (FORM)
 * 4. Phê duyệt từ quản lý (APPROVAL)
 * 5. Xác nhận từ nhân sự (NOTIFICATION)
 * 
 * Email admin: katachanneloffical@gmail.com
 * 
 * Usage:
 *   cd backend
 *   bun run ts-node prisma/seeds/seed-employee-onboarding-workflow.ts
 *   # hoặc
 *   npx ts-node prisma/seeds/seed-employee-onboarding-workflow.ts
 */

import { PrismaClient, StepType } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'katachanneloffical@gmail.com';
const WORKFLOW_CODE = 'CHECKIN_NHANSU';

async function seedEmployeeOnboardingWorkflow() {
  console.log('🌱 Starting Employee Onboarding Workflow Seed...');
  console.log(`📧 Admin email: ${ADMIN_EMAIL}`);
  console.log('');

  // 1. Find or create admin user
  let adminUser = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!adminUser) {
    console.log(`⚠️ User ${ADMIN_EMAIL} không tồn tại. Đang tạo...`);
    adminUser = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        username: 'admin_kataofficial',
        firstName: 'Admin',
        lastName: 'KataOfficial',
        roleType: 'ADMIN',
        isActive: true,
        isVerified: true,
      },
    });
    console.log(`✅ Đã tạo user: ${adminUser.email}`);
  } else {
    console.log(`✅ Tìm thấy user: ${adminUser.email} (ID: ${adminUser.id})`);
  }

  // 2. Check if workflow template already exists
  const existingTemplate = await prisma.workflowTemplate.findUnique({
    where: { code: WORKFLOW_CODE },
    include: {
      steps: {
        orderBy: { stepNumber: 'asc' },
      },
    },
  });

  if (existingTemplate) {
    console.log(`\n⚠️ Workflow template "${existingTemplate.name}" đã tồn tại!`);
    console.log(`   ID: ${existingTemplate.id}`);
    console.log(`   Code: ${existingTemplate.code}`);
    console.log(`   Steps: ${existingTemplate.steps.length}`);
    console.log('\n🔄 Đang cập nhật template...');

    // Update template if needed
    await prisma.workflowTemplate.update({
      where: { id: existingTemplate.id },
      data: {
        name: 'Quy trình Checkin Nhân Sự',
        description: 'Quy trình nhập thông tin nhân sự mới, tạo tài khoản và đợi phê duyệt',
        category: 'HR',
        icon: 'UserPlus',
        color: '#10b981',
        isActive: true,
        updatedBy: adminUser.id,
      },
    });

    console.log('✅ Đã cập nhật workflow template');
    await printSummary(existingTemplate.id);
    return;
  }

  // 3. Create workflow template
  console.log('\n📋 Đang tạo Workflow Template...');
  const template = await prisma.workflowTemplate.create({
    data: {
      code: WORKFLOW_CODE,
      name: 'Quy trình Checkin Nhân Sự',
      description: 'Quy trình nhập thông tin nhân sự mới, tạo tài khoản và đợi phê duyệt',
      category: 'HR',
      icon: 'UserPlus',
      color: '#10b981',
      isActive: true,
      version: 1,
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  });
  console.log(`✅ Đã tạo template: ${template.name} (ID: ${template.id})`);

  // 4. Create workflow steps
  console.log('\n📝 Đang tạo các bước workflow...');

  // Step 1: Form nhập thông tin nhân sự
  const step1 = await prisma.workflowStep.create({
    data: {
      workflowTemplateId: template.id,
      stepNumber: 1,
      name: 'Nhập thông tin nhân sự',
      description: 'Điền form thông tin cơ bản của nhân sự mới',
      stepType: StepType.FORM,
      isRequired: true,
      isActive: true,
      estimatedDuration: 15, // 15 phút
      config: {
        fields: [
          { name: 'fullName', label: 'Họ và tên', type: 'text', required: true, placeholder: 'Nguyễn Văn A' },
          { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'example@company.com' },
          { name: 'phone', label: 'Số điện thoại', type: 'text', required: true, placeholder: '0901234567' },
          { name: 'position', label: 'Vị trí', type: 'text', required: true, placeholder: 'Developer' },
          { name: 'department', label: 'Phòng ban', type: 'select', required: true, options: [
            'IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Admin', 'Other'
          ]},
          { name: 'startDate', label: 'Ngày bắt đầu', type: 'date', required: true },
          { name: 'address', label: 'Địa chỉ', type: 'text', required: false },
          { name: 'dateOfBirth', label: 'Ngày sinh', type: 'date', required: false },
          { name: 'gender', label: 'Giới tính', type: 'select', required: false, options: ['Nam', 'Nữ', 'Khác'] },
        ],
        validation: {
          email: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
          phone: { pattern: '^[0-9]{10,11}$' },
        },
      },
    },
  });
  console.log(`   ✅ Step 1: ${step1.name}`);

  // Step 2: Automation - Tạo User account
  const step2 = await prisma.workflowStep.create({
    data: {
      workflowTemplateId: template.id,
      stepNumber: 2,
      name: 'Tạo tài khoản User',
      description: 'Hệ thống tự động tạo tài khoản user từ email đã nhập',
      stepType: StepType.AUTOMATION,
      isRequired: true,
      isActive: true,
      estimatedDuration: 1, // 1 phút (tự động)
      config: {
        action: 'CREATE_USER',
        params: {
          emailField: 'email',
          usernameField: 'email',
          generatePassword: true,
          sendWelcomeEmail: false, // Sẽ gửi ở bước cuối
        },
        autoExecute: true, // Tự động thực hiện khi bước trước hoàn thành
      },
    },
  });
  console.log(`   ✅ Step 2: ${step2.name}`);

  // Step 3: Form thêm tài khoản bên thứ 3
  const step3 = await prisma.workflowStep.create({
    data: {
      workflowTemplateId: template.id,
      stepNumber: 3,
      name: 'Thêm tài khoản bên thứ 3',
      description: 'Thêm các tài khoản công ty: Gmail, Slack, CRM, Teams, Zoom...',
      stepType: StepType.FORM,
      isRequired: false, // Không bắt buộc
      isActive: true,
      estimatedDuration: 10, // 10 phút
      config: {
        fields: [
          {
            name: 'thirdPartyAccounts',
            label: 'Tài khoản bên thứ 3',
            type: 'array',
            required: false,
            itemFields: [
              { name: 'accountType', label: 'Loại tài khoản', type: 'select', required: true, options: [
                { value: 'GMAIL', label: 'Gmail công ty' },
                { value: 'SLACK', label: 'Slack' },
                { value: 'TEAMS', label: 'Microsoft Teams' },
                { value: 'CRM', label: 'CRM' },
                { value: 'ZOOM', label: 'Zoom' },
                { value: 'ZALO', label: 'Zalo' },
                { value: 'FACEBOOK', label: 'Facebook' },
                { value: 'OTHER', label: 'Khác' },
              ]},
              { name: 'username', label: 'Username/Email', type: 'text', required: true },
              { name: 'accountName', label: 'Tên hiển thị', type: 'text', required: false },
              { name: 'notes', label: 'Ghi chú', type: 'text', required: false },
            ],
          },
        ],
        canSkip: true, // Có thể bỏ qua bước này
      },
    },
  });
  console.log(`   ✅ Step 3: ${step3.name}`);

  // Step 4: Approval - Phê duyệt từ quản lý
  const step4 = await prisma.workflowStep.create({
    data: {
      workflowTemplateId: template.id,
      stepNumber: 4,
      name: 'Phê duyệt từ quản lý',
      description: 'Quản lý HR hoặc trưởng phòng phê duyệt thông tin nhân sự',
      stepType: StepType.APPROVAL,
      isRequired: true,
      isActive: true,
      estimatedDuration: 1440, // 24 giờ = 1440 phút
      dueDateOffset: 3, // Deadline 3 ngày
      config: {
        approvalType: 'SINGLE', // Chỉ cần 1 người phê duyệt
        approvers: [], // Sẽ được assign động khi khởi tạo workflow
        autoAssignTo: 'HR_MANAGER', // Tự động assign cho HR Manager
        escalation: {
          enabled: true,
          afterDays: 2, // Escalate sau 2 ngày không phê duyệt
          escalateTo: 'ADMIN', // Escalate lên Admin
        },
        reminder: {
          enabled: true,
          beforeDeadline: 1, // Nhắc nhở trước deadline 1 ngày
        },
      },
    },
  });
  console.log(`   ✅ Step 4: ${step4.name}`);

  // Step 5: Notification - Xác nhận cuối từ nhân sự
  const step5 = await prisma.workflowStep.create({
    data: {
      workflowTemplateId: template.id,
      stepNumber: 5,
      name: 'Xác nhận từ nhân sự',
      description: 'Nhân sự xác nhận thông tin và hoàn tất quy trình checkin',
      stepType: StepType.NOTIFICATION,
      isRequired: true,
      isActive: true,
      estimatedDuration: 30, // 30 phút
      config: {
        notificationType: 'EMAIL',
        template: 'employee-onboarding-confirmation',
        subject: 'Chào mừng bạn đến với công ty - Xác nhận thông tin',
        actions: [
          { label: 'Xác nhận thông tin đúng', action: 'CONFIRM', color: 'green' },
          { label: 'Yêu cầu chỉnh sửa', action: 'REQUEST_EDIT', color: 'yellow' },
        ],
        sendToFields: ['email'], // Gửi đến email nhân sự
        ccTo: ['HR'], // CC cho HR
      },
    },
  });
  console.log(`   ✅ Step 5: ${step5.name}`);

  await printSummary(template.id);
}

async function printSummary(templateId: string) {
  const template = await prisma.workflowTemplate.findUnique({
    where: { id: templateId },
    include: {
      steps: {
        orderBy: { stepNumber: 'asc' },
      },
      creator: {
        select: { email: true, username: true },
      },
    },
  });

  if (!template) return;

  console.log('\n' + '='.repeat(60));
  console.log('📊 SEED HOÀN TẤT - THÔNG TIN WORKFLOW');
  console.log('='.repeat(60));
  console.log(`\n📋 Template: ${template.name}`);
  console.log(`   Code: ${template.code}`);
  console.log(`   ID: ${template.id}`);
  console.log(`   Category: ${template.category}`);
  console.log(`   Status: ${template.isActive ? '✅ Active' : '❌ Inactive'}`);
  console.log(`   Created by: ${template.creator?.email}`);
  console.log(`\n📝 Các bước trong quy trình:`);
  
  for (const step of template.steps) {
    const typeEmoji = getStepTypeEmoji(step.stepType);
    const requiredBadge = step.isRequired ? '🔴' : '⚪';
    console.log(`   ${requiredBadge} ${step.stepNumber}. ${typeEmoji} ${step.name}`);
    console.log(`      Type: ${step.stepType} | Duration: ${step.estimatedDuration || '-'} phút`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📖 HƯỚNG DẪN SỬ DỤNG');
  console.log('='.repeat(60));
  
  console.log(`
1. 🔐 Đăng nhập với tài khoản admin: ${ADMIN_EMAIL}

2. 📍 Truy cập trang Workflow:
   http://localhost:12000/workflow (hoặc port tương ứng)

3. 🚀 Bắt đầu quy trình mới:
   - Click "Tạo quy trình mới" hoặc tìm template "${template.name}"
   - Click "Bắt đầu quy trình"

4. 📝 Điền thông tin nhân sự (Step 1):
   - Họ tên, Email, SĐT, Vị trí, Phòng ban, Ngày bắt đầu...

5. ⚡ Hệ thống tự động tạo User (Step 2):
   - User account được tạo tự động từ email nhập ở Step 1

6. 🔗 Thêm tài khoản bên thứ 3 (Step 3 - Optional):
   - Gmail công ty, Slack, CRM, Teams, Zoom...

7. ✅ Phê duyệt (Step 4):
   - Quản lý HR hoặc Admin phê duyệt thông tin

8. 📧 Xác nhận từ nhân sự (Step 5):
   - Nhân sự nhận email và xác nhận thông tin

9. 🎉 Hoàn tất:
   - Workflow chuyển sang trạng thái COMPLETED
`);

  console.log('💡 GraphQL Mutations hữu ích:');
  console.log(`
# Setup template (nếu chưa có):
mutation {
  setupEmployeeOnboardingWorkflow
}

# Bắt đầu onboarding:
mutation StartOnboarding {
  startEmployeeOnboarding(input: {
    formData: {
      fullName: "Nguyễn Văn A"
      email: "nguyenvana@company.com"
      phone: "0901234567"
      position: "Developer"
      department: "IT"
      startDate: "2025-01-15"
    }
  }) {
    id
    instanceCode
    title
    status
    currentStepNumber
  }
}

# Hoàn thành 1 bước:
mutation CompleteStep {
  completeStep(input: {
    workflowInstanceId: "<instance-id>"
    stepNumber: 1
    outputData: {}
  })
}
`);

  console.log('='.repeat(60));
  console.log('✅ SEED COMPLETED SUCCESSFULLY!');
  console.log('='.repeat(60));
}

function getStepTypeEmoji(stepType: StepType): string {
  switch (stepType) {
    case StepType.FORM:
      return '📝';
    case StepType.APPROVAL:
      return '✅';
    case StepType.AUTOMATION:
      return '⚡';
    case StepType.NOTIFICATION:
      return '📧';
    case StepType.CONDITION:
      return '🔀';
    default:
      return '📌';
  }
}

// Run seed
seedEmployeeOnboardingWorkflow()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
