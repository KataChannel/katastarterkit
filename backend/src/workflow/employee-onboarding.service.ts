import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from './workflow.service';
import { StartEmployeeOnboardingInput } from './dto/workflow.dto';
import { StepType, WorkflowStatus, AccountType } from '@prisma/client';

/**
 * Employee Onboarding Service
 * Xử lý quy trình checkin nhân sự:
 * 1. Tạo EmployeeProfile
 * 2. Tạo User account
 * 3. Thêm third-party accounts (Gmail, Slack, CRM...)
 * 4. Quy trình phê duyệt
 * 5. Xác nhận cuối từ nhân sự
 */
@Injectable()
export class EmployeeOnboardingService {
  constructor(
    private prisma: PrismaService,
    private workflowService: WorkflowService,
  ) {}

  /**
   * Khởi tạo workflow template cho Employee Onboarding (chỉ chạy 1 lần lúc setup)
   */
  async setupEmployeeOnboardingWorkflow(creatorUserId: string) {
    const existingTemplate = await this.prisma.workflowTemplate.findUnique({
      where: { code: 'CHECKIN_NHANSU' },
    });

    if (existingTemplate) {
      return existingTemplate;
    }

    // Create template
    const template = await this.prisma.workflowTemplate.create({
      data: {
        code: 'CHECKIN_NHANSU',
        name: 'Quy trình Checkin Nhân Sự',
        description: 'Quy trình nhập thông tin nhân sự mới, tạo tài khoản và đợi phê duyệt',
        category: 'HR',
        icon: 'UserPlus',
        color: '#10b981',
        status: WorkflowStatus.ACTIVE,
        isActive: true,
        createdBy: creatorUserId,
        updatedBy: creatorUserId,
      },
    });

    // Step 1: Form nhập thông tin nhân sự
    await this.prisma.workflowStep.create({
      data: {
        workflowTemplateId: template.id,
        stepNumber: 1,
        name: 'Nhập thông tin nhân sự',
        description: 'Điền form thông tin cơ bản của nhân sự',
        stepType: StepType.FORM,
        isRequired: true,
        isActive: true,
        config: {
          fields: [
            { name: 'fullName', label: 'Họ và tên', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Số điện thoại', type: 'text', required: true },
            { name: 'position', label: 'Vị trí', type: 'text', required: true },
            { name: 'department', label: 'Phòng ban', type: 'text', required: true },
            { name: 'startDate', label: 'Ngày bắt đầu', type: 'date', required: true },
            { name: 'address', label: 'Địa chỉ', type: 'text', required: false },
          ],
        },
      },
    });

    // Step 2: Automation - Tạo User account
    await this.prisma.workflowStep.create({
      data: {
        workflowTemplateId: template.id,
        stepNumber: 2,
        name: 'Tạo tài khoản User',
        description: 'Hệ thống tự động tạo tài khoản user từ email/SĐT',
        stepType: StepType.AUTOMATION,
        isRequired: true,
        isActive: true,
        config: {
          action: 'CREATE_USER',
          params: {
            emailField: 'email',
            usernameField: 'email',
          },
        },
      },
    });

    // Step 3: Form thêm tài khoản bên thứ 3
    await this.prisma.workflowStep.create({
      data: {
        workflowTemplateId: template.id,
        stepNumber: 3,
        name: 'Thêm tài khoản bên thứ 3',
        description: 'Thêm Gmail, Facebook, Zalo, CRM, Slack, Teams, Zoom...',
        stepType: StepType.FORM,
        isRequired: false,
        isActive: true,
        config: {
          fields: [
            { name: 'thirdPartyAccounts', label: 'Tài khoản bên thứ 3', type: 'array', required: false },
          ],
        },
      },
    });

    // Step 4: Approval - Phê duyệt từ quản lý
    await this.prisma.workflowStep.create({
      data: {
        workflowTemplateId: template.id,
        stepNumber: 4,
        name: 'Phê duyệt từ quản lý',
        description: 'Quản lý HR phê duyệt thông tin nhân sự',
        stepType: StepType.APPROVAL,
        isRequired: true,
        isActive: true,
        config: {
          approvalType: 'SINGLE', // Chỉ cần 1 người approve
          approvers: [], // Sẽ assign động khi start workflow
        },
      },
    });

    // Step 5: Notification - Xác nhận cuối từ nhân sự
    await this.prisma.workflowStep.create({
      data: {
        workflowTemplateId: template.id,
        stepNumber: 5,
        name: 'Xác nhận từ nhân sự',
        description: 'Nhân sự xác nhận thông tin và hoàn tất checkin',
        stepType: StepType.NOTIFICATION,
        isRequired: true,
        isActive: true,
        config: {
          notificationType: 'EMAIL',
          template: 'employee-confirmation',
        },
      },
    });

    return template;
  }

  /**
   * Bắt đầu quy trình onboarding cho nhân sự mới
   */
  async startEmployeeOnboarding(input: StartEmployeeOnboardingInput, initiatorUserId: string) {
    const { formData } = input;

    // Validate email unique
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: formData.email as string },
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException(`User với email này đã tồn tại`);
    }

    // Get workflow template
    let template = await this.prisma.workflowTemplate.findUnique({
      where: { code: 'CHECKIN_NHANSU' },
      include: {
        steps: {
          where: { isActive: true },
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    // Setup template if not exists
    if (!template) {
      const newTemplate = await this.setupEmployeeOnboardingWorkflow(initiatorUserId);
      template = await this.prisma.workflowTemplate.findUnique({
        where: { id: newTemplate.id },
        include: {
          steps: {
            where: { isActive: true },
            orderBy: { stepNumber: 'asc' },
          },
        },
      });
    }

    // Create workflow instance
    const workflowInstance = await this.workflowService.createWorkflowInstance(
      {
        workflowTemplateId: template.id,
        title: `Checkin nhân sự: ${formData.fullName}`,
        description: `Email: ${formData.email} - Vị trí: ${formData.position}`,
        formData,
        relatedEntityType: 'EMPLOYEE',
      },
      initiatorUserId,
    );

    return {
      workflowInstance,
      message: 'Đã khởi tạo quy trình checkin nhân sự thành công',
    };
  }

  /**
   * Complete Step 1: Tạo EmployeeProfile sau khi nhập form
   */
  async completeStep1CreateEmployee(workflowInstanceId: string, userId: string) {
    const instance = await this.workflowService.getWorkflowInstance(workflowInstanceId);

    if (instance.currentStepNumber !== 1) {
      throw new BadRequestException('Không phải bước 1');
    }

    const formData = instance.formData as any;

    // Generate employee code
    const count = await this.prisma.employeeProfile.count();
    const employeeCode = `EMP${new Date().getFullYear()}${String(count + 1).padStart(4, '0')}`;

    // Create User first
    const user = await this.prisma.user.create({
      data: {
        email: formData.email,
        username: formData.email,
        isActive: true,
        isVerified: false,
      },
    });

    // Create EmployeeProfile
    const employee = await this.prisma.employeeProfile.create({
      data: {
        userId: user.id,
        employeeCode,
        fullName: formData.fullName,
        personalEmail: formData.email,
        personalPhone: formData.phone,
        position: formData.position,
        department: formData.department,
        startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
        currentAddress: formData.address,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    // Update workflow instance with employee ID
    await this.prisma.workflowInstance.update({
      where: { id: workflowInstanceId },
      data: {
        relatedEntityId: employee.id,
        metadata: {
          employeeId: employee.id,
          userId: user.id,
        },
      },
    });

    // Complete step
    await this.workflowService.completeStep(
      {
        workflowInstanceId,
        stepNumber: 1,
        outputData: {
          employeeId: employee.id,
          userId: user.id,
        },
      },
      userId,
    );

    return {
      employee,
      user,
      message: 'Đã tạo hồ sơ nhân sự và tài khoản thành công',
    };
  }

  /**
   * Complete Step 3: Thêm third-party accounts
   */
  async completeStep3AddThirdPartyAccounts(
    workflowInstanceId: string,
    thirdPartyAccounts: Array<{
      accountType: AccountType;
      username: string;
      email?: string;
      phone?: string;
      accountName?: string;
      metadata?: any;
    }>,
    userId: string,
  ) {
    const instance = await this.workflowService.getWorkflowInstance(workflowInstanceId);

    if (instance.currentStepNumber !== 3) {
      throw new BadRequestException('Không phải bước 3');
    }

    const metadata = instance.metadata as any;
    const employeeId = metadata?.employeeId || instance.relatedEntityId;
    if (!employeeId) {
      throw new BadRequestException('Không tìm thấy employee ID');
    }

    // Create third-party accounts
    const createdAccounts = [];
    for (const accountData of thirdPartyAccounts) {
      const account = await this.prisma.employeeThirdPartyAccount.create({
        data: {
          employeeProfileId: employeeId,
          accountType: accountData.accountType,
          username: accountData.username,
          email: accountData.email,
          phone: accountData.phone,
          accountName: accountData.accountName,
          isActive: true,
          metadata: accountData.metadata,
          createdBy: userId,
          updatedBy: userId,
        },
      });
      createdAccounts.push(account);
    }

    // Complete step
    await this.workflowService.completeStep(
      {
        workflowInstanceId,
        stepNumber: 3,
        outputData: {
          thirdPartyAccountIds: createdAccounts.map(a => a.id),
        },
      },
      userId,
    );

    return {
      accounts: createdAccounts,
      message: `Đã thêm ${createdAccounts.length} tài khoản bên thứ 3`,
    };
  }

  /**
   * Get employee onboarding status
   */
  async getEmployeeOnboardingStatus(employeeId: string) {
    const employee = await this.prisma.employeeProfile.findUnique({
      where: { id: employeeId },
      include: {
        user: {
          select: { id: true, email: true, username: true, isActive: true },
        },
        thirdPartyAccounts: true,
      },
    });

    if (!employee) {
      throw new BadRequestException('Không tìm thấy nhân sự');
    }

    const workflowInstance = await this.prisma.workflowInstance.findFirst({
      where: {
        relatedEntityType: 'EMPLOYEE',
        relatedEntityId: employee.id,
      },
      include: {
        workflowTemplate: true,
        stepExecutions: {
          include: {
            workflowStep: true,
          },
          orderBy: { stepNumber: 'asc' },
        },
        approvals: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      employee,
      workflowInstance,
      completionPercentage: workflowInstance
        ? Math.round((workflowInstance.currentStepNumber / 5) * 100)
        : 0,
    };
  }

  /**
   * Assign approver cho step 4
   */
  async assignApprover(workflowInstanceId: string, approverId: string, assignedBy: string) {
    const instance = await this.workflowService.getWorkflowInstance(workflowInstanceId);

    // Find step 4 (approval step)
    const approvalStep = instance.workflowTemplate.steps.find(s => s.stepNumber === 4);
    if (!approvalStep) {
      throw new BadRequestException('Không tìm thấy bước phê duyệt');
    }

    // Create approval
    await this.prisma.workflowApproval.create({
      data: {
        workflowInstanceId,
        stepNumber: 4,
        approverId,
        status: 'PENDING',
      },
    });

    return {
      message: 'Đã phân công người phê duyệt',
    };
  }
}
