import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateWorkflowTemplateInput,
  UpdateWorkflowTemplateInput,
  CreateWorkflowStepInput,
  UpdateWorkflowStepInput,
  CreateWorkflowInstanceInput,
  UpdateWorkflowInstanceInput,
  CompleteStepInput,
  CreateWorkflowApprovalInput,
  RespondToApprovalInput,
  CreateWorkflowCommentInput,
  StartEmployeeOnboardingInput,
} from './dto/workflow.dto';
import { WorkflowInstanceStatus, ApprovalStatus, StepType } from '@prisma/client';

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // WORKFLOW TEMPLATE OPERATIONS
  // ============================================

  async createWorkflowTemplate(input: CreateWorkflowTemplateInput, userId: string) {
    const exists = await this.prisma.workflowTemplate.findUnique({
      where: { code: input.code },
    });

    if (exists) {
      throw new BadRequestException(`Workflow template với code '${input.code}' đã tồn tại`);
    }

    return this.prisma.workflowTemplate.create({
      data: {
        ...input,
        createdBy: userId,
        updatedBy: userId,
      },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });
  }

  async updateWorkflowTemplate(id: string, input: UpdateWorkflowTemplateInput, userId: string) {
    const template = await this.prisma.workflowTemplate.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Không tìm thấy workflow template`);
    }

    return this.prisma.workflowTemplate.update({
      where: { id },
      data: {
        ...input,
        updatedBy: userId,
      },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });
  }

  async getWorkflowTemplate(id: string) {
    const template = await this.prisma.workflowTemplate.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
        creator: {
          select: { id: true, username: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Không tìm thấy workflow template`);
    }

    return template;
  }

  async getWorkflowTemplates(where?: any) {
    return this.prisma.workflowTemplate.findMany({
      where,
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
        _count: {
          select: { instances: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteWorkflowTemplate(id: string) {
    const template = await this.prisma.workflowTemplate.findUnique({
      where: { id },
      include: {
        _count: { select: { instances: true } },
      },
    });

    if (!template) {
      throw new NotFoundException(`Không tìm thấy workflow template`);
    }

    if (template._count.instances > 0) {
      throw new BadRequestException(
        `Không thể xóa workflow template đang có ${template._count.instances} instances đang chạy`
      );
    }

    return this.prisma.workflowTemplate.delete({ where: { id } });
  }

  // ============================================
  // WORKFLOW STEP OPERATIONS
  // ============================================

  async createWorkflowStep(input: CreateWorkflowStepInput) {
    // Check template exists
    const template = await this.prisma.workflowTemplate.findUnique({
      where: { id: input.workflowTemplateId },
    });

    if (!template) {
      throw new NotFoundException(`Không tìm thấy workflow template`);
    }

    // Check step number unique
    const existingStep = await this.prisma.workflowStep.findUnique({
      where: {
        workflowTemplateId_stepNumber: {
          workflowTemplateId: input.workflowTemplateId,
          stepNumber: input.stepNumber,
        },
      },
    });

    if (existingStep) {
      throw new BadRequestException(`Bước ${input.stepNumber} đã tồn tại trong workflow này`);
    }

    return this.prisma.workflowStep.create({
      data: input,
    });
  }

  async updateWorkflowStep(id: string, input: UpdateWorkflowStepInput) {
    const step = await this.prisma.workflowStep.findUnique({ where: { id } });
    if (!step) {
      throw new NotFoundException(`Không tìm thấy workflow step`);
    }

    return this.prisma.workflowStep.update({
      where: { id },
      data: input,
    });
  }

  async deleteWorkflowStep(id: string) {
    return this.prisma.workflowStep.delete({ where: { id } });
  }

  // ============================================
  // WORKFLOW INSTANCE OPERATIONS
  // ============================================

  async createWorkflowInstance(input: CreateWorkflowInstanceInput, userId: string) {
    const template = await this.prisma.workflowTemplate.findUnique({
      where: { id: input.workflowTemplateId },
      include: {
        steps: {
          where: { isActive: true },
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Không tìm thấy workflow template`);
    }

    if (!template.isActive) {
      throw new BadRequestException(`Workflow template đang bị tạm ngưng`);
    }

    if (template.steps.length === 0) {
      throw new BadRequestException(`Workflow template chưa có bước nào`);
    }

    // Generate instance code
    const count = await this.prisma.workflowInstance.count({
      where: { workflowTemplateId: template.id },
    });
    const instanceCode = `${template.code}-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // Create instance
    const instance = await this.prisma.workflowInstance.create({
      data: {
        workflowTemplateId: template.id,
        instanceCode,
        title: input.title,
        description: input.description,
        formData: input.formData,
        metadata: input.metadata,
        relatedEntityType: input.relatedEntityType,
        relatedEntityId: input.relatedEntityId,
        initiatedBy: userId,
        status: WorkflowInstanceStatus.PENDING,
        currentStepNumber: 1,
      },
      include: {
        workflowTemplate: true,
      },
    });

    // Create first step execution
    const firstStep = template.steps[0];
    await this.createStepExecution(instance.id, firstStep, userId);

    // Log activity
    await this.logActivity(instance.id, 'CREATED', userId, `Workflow được khởi tạo`, {
      templateName: template.name,
    });

    return this.getWorkflowInstance(instance.id);
  }

  async getWorkflowInstance(id: string) {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id },
      include: {
        workflowTemplate: {
          include: {
            steps: {
              where: { isActive: true },
              orderBy: { stepNumber: 'asc' },
            },
          },
        },
        initiator: {
          select: { id: true, username: true, email: true, firstName: true, lastName: true },
        },
        assignee: {
          select: { id: true, username: true, email: true, firstName: true, lastName: true },
        },
        stepExecutions: {
          include: {
            workflowStep: true,
            assignee: {
              select: { id: true, username: true, email: true },
            },
            completedUser: {
              select: { id: true, username: true, email: true },
            },
          },
          orderBy: { stepNumber: 'asc' },
        },
        approvals: {
          include: {
            approver: {
              select: { id: true, username: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        comments: {
          include: {
            author: {
              select: { id: true, username: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        activityLogs: {
          include: {
            actor: {
              select: { id: true, username: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!instance) {
      throw new NotFoundException(`Không tìm thấy workflow instance`);
    }

    return instance;
  }

  async getWorkflowInstances(where?: any) {
    return this.prisma.workflowInstance.findMany({
      where,
      include: {
        workflowTemplate: {
          select: { id: true, name: true, code: true, category: true, icon: true, color: true },
        },
        initiator: {
          select: { id: true, username: true, email: true },
        },
        assignee: {
          select: { id: true, username: true, email: true },
        },
        _count: {
          select: {
            stepExecutions: true,
            approvals: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateWorkflowInstance(id: string, input: UpdateWorkflowInstanceInput, userId: string) {
    const instance = await this.prisma.workflowInstance.findUnique({ where: { id } });
    if (!instance) {
      throw new NotFoundException(`Không tìm thấy workflow instance`);
    }

    const updated = await this.prisma.workflowInstance.update({
      where: { id },
      data: input,
    });

    if (input.status) {
      await this.logActivity(id, 'STATUS_CHANGED', userId, `Trạng thái đổi thành ${input.status}`, {
        oldStatus: instance.status,
        newStatus: input.status,
      });
    }

    return this.getWorkflowInstance(id);
  }

  async cancelWorkflowInstance(id: string, reason: string, userId: string) {
    const instance = await this.prisma.workflowInstance.findUnique({ where: { id } });
    if (!instance) {
      throw new NotFoundException(`Không tìm thấy workflow instance`);
    }

    if (instance.status === WorkflowInstanceStatus.COMPLETED) {
      throw new BadRequestException(`Không thể hủy workflow đã hoàn thành`);
    }

    await this.prisma.workflowInstance.update({
      where: { id },
      data: {
        status: WorkflowInstanceStatus.CANCELLED,
      },
    });

    await this.logActivity(id, 'CANCELLED', userId, `Workflow bị hủy: ${reason}`);

    return { success: true, message: 'Workflow đã được hủy' };
  }

  // ============================================
  // STEP EXECUTION OPERATIONS
  // ============================================

  private async createStepExecution(instanceId: string, step: any, assignedToUserId?: string) {
    return this.prisma.stepExecution.create({
      data: {
        workflowInstanceId: instanceId,
        workflowStepId: step.id,
        stepNumber: step.stepNumber,
        status: WorkflowInstanceStatus.PENDING,
        assignedTo: assignedToUserId,
      },
    });
  }

  async completeStep(input: CompleteStepInput, userId: string) {
    const instance = await this.getWorkflowInstance(input.workflowInstanceId);

    if (instance.status !== WorkflowInstanceStatus.IN_PROGRESS && instance.status !== WorkflowInstanceStatus.PENDING) {
      throw new BadRequestException(`Workflow không trong trạng thái có thể xử lý`);
    }

    if (instance.currentStepNumber !== input.stepNumber) {
      throw new BadRequestException(`Không thể hoàn thành bước ${input.stepNumber}, bước hiện tại là ${instance.currentStepNumber}`);
    }

    const currentStep = instance.workflowTemplate.steps.find(s => s.stepNumber === input.stepNumber);
    if (!currentStep) {
      throw new NotFoundException(`Không tìm thấy step ${input.stepNumber}`);
    }

    const stepExecution = instance.stepExecutions.find(se => se.stepNumber === input.stepNumber);
    if (!stepExecution) {
      throw new NotFoundException(`Không tìm thấy step execution`);
    }

    // Update step execution
    await this.prisma.stepExecution.update({
      where: { id: stepExecution.id },
      data: {
        status: WorkflowInstanceStatus.COMPLETED,
        outputData: input.outputData,
        completedBy: userId,
        completedAt: new Date(),
      },
    });

    // Check if this is approval step
    if (currentStep.stepType === StepType.APPROVAL) {
      // Check all approvals completed
      const approvals = instance.approvals.filter(a => a.stepNumber === input.stepNumber);
      const allApproved = approvals.every(a => a.status === ApprovalStatus.APPROVED);
      const hasRejected = approvals.some(a => a.status === ApprovalStatus.REJECTED);

      if (hasRejected) {
        await this.prisma.workflowInstance.update({
          where: { id: instance.id },
          data: { status: WorkflowInstanceStatus.REJECTED },
        });
        await this.logActivity(instance.id, 'REJECTED', userId, `Bước ${input.stepNumber} bị từ chối phê duyệt`);
        return { success: true, message: 'Workflow bị từ chối' };
      }

      if (!allApproved) {
        await this.logActivity(instance.id, 'STEP_COMPLETED', userId, `Hoàn thành bước ${input.stepNumber}: ${currentStep.name}`);
        return { success: true, message: 'Bước hoàn thành, đang chờ phê duyệt còn lại' };
      }
    }

    // Execute automation if needed
    if (currentStep.stepType === StepType.AUTOMATION) {
      await this.executeAutomation(instance, currentStep, userId);
    }

    // Move to next step or complete workflow
    const nextStep = instance.workflowTemplate.steps.find(s => s.stepNumber === input.stepNumber + 1);

    if (nextStep) {
      // Move to next step
      await this.prisma.workflowInstance.update({
        where: { id: instance.id },
        data: {
          currentStepNumber: nextStep.stepNumber,
          status: WorkflowInstanceStatus.IN_PROGRESS,
        },
      });

      await this.createStepExecution(instance.id, nextStep, userId);
      await this.logActivity(instance.id, 'STEP_STARTED', userId, `Bắt đầu bước ${nextStep.stepNumber}: ${nextStep.name}`);

      // Create approvals if needed
      if (nextStep.stepType === StepType.APPROVAL) {
        await this.createApprovalsForStep(instance.id, nextStep);
      }
    } else {
      // Complete workflow
      await this.prisma.workflowInstance.update({
        where: { id: instance.id },
        data: {
          status: WorkflowInstanceStatus.COMPLETED,
          completedAt: new Date(),
        },
      });
      await this.logActivity(instance.id, 'COMPLETED', userId, `Workflow hoàn thành`);
    }

    return { success: true, message: 'Bước đã được hoàn thành' };
  }

  private async executeAutomation(instance: any, step: any, userId: string) {
    const config = step.config;
    const action = config?.action;

    try {
      if (action === 'CREATE_USER') {
        // Tạo user từ form data
        const email = instance.formData[config.params?.emailField || 'email'];
        const username = instance.formData[config.params?.usernameField || 'username'] || email;

        // Check if user exists
        const existingUser = await this.prisma.user.findFirst({
          where: {
            OR: [
              { email },
              { username },
            ],
          },
        });

        if (!existingUser) {
          const newUser = await this.prisma.user.create({
            data: {
              email,
              username,
              isActive: true,
              isVerified: false,
            },
          });

          await this.logActivity(instance.id, 'AUTOMATION_EXECUTED', userId, `Tạo tài khoản user thành công: ${newUser.email}`, {
            userId: newUser.id,
          });
        }
      }

      // Add more automation actions here...
    } catch (error) {
      await this.logActivity(instance.id, 'AUTOMATION_FAILED', userId, `Automation thất bại: ${error.message}`, {
        error: error.message,
      });
      throw error;
    }
  }

  private async createApprovalsForStep(instanceId: string, step: any) {
    const config = step.config;
    const approverIds = config?.approvers || [];

    for (const approverId of approverIds) {
      await this.prisma.workflowApproval.create({
        data: {
          workflowInstanceId: instanceId,
          stepNumber: step.stepNumber,
          approverId,
          status: ApprovalStatus.PENDING,
        },
      });
    }
  }

  // ============================================
  // APPROVAL OPERATIONS
  // ============================================

  async respondToApproval(input: RespondToApprovalInput, userId: string) {
    const approval = await this.prisma.workflowApproval.findUnique({
      where: { id: input.approvalId },
      include: {
        workflowInstance: {
          include: {
            workflowTemplate: {
              include: {
                steps: true,
              },
            },
          },
        },
      },
    });

    if (!approval) {
      throw new NotFoundException(`Không tìm thấy approval`);
    }

    if (approval.approverId !== userId) {
      throw new BadRequestException(`Bạn không có quyền phê duyệt yêu cầu này`);
    }

    if (approval.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException(`Approval đã được xử lý`);
    }

    const newStatus = input.decision === 'APPROVED' ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED;

    await this.prisma.workflowApproval.update({
      where: { id: input.approvalId },
      data: {
        status: newStatus,
        decision: input.decision,
        comment: input.comment,
        attachmentIds: input.attachmentIds,
        respondedAt: new Date(),
      },
    });

    await this.logActivity(
      approval.workflowInstanceId,
      newStatus === ApprovalStatus.APPROVED ? 'APPROVED' : 'REJECTED',
      userId,
      `${newStatus === ApprovalStatus.APPROVED ? 'Phê duyệt' : 'Từ chối'} bước ${approval.stepNumber}${input.comment ? `: ${input.comment}` : ''}`,
    );

    // Check if step can be completed
    const stepApprovals = await this.prisma.workflowApproval.findMany({
      where: {
        workflowInstanceId: approval.workflowInstanceId,
        stepNumber: approval.stepNumber,
      },
    });

    const allApproved = stepApprovals.every(a => a.status === ApprovalStatus.APPROVED);
    const hasRejected = stepApprovals.some(a => a.status === ApprovalStatus.REJECTED);

    if (hasRejected) {
      await this.prisma.workflowInstance.update({
        where: { id: approval.workflowInstanceId },
        data: { status: WorkflowInstanceStatus.REJECTED },
      });
    } else if (allApproved) {
      // Auto-complete approval step
      await this.completeStep(
        {
          workflowInstanceId: approval.workflowInstanceId,
          stepNumber: approval.stepNumber,
          outputData: { approvedBy: userId },
        },
        userId,
      );
    }

    return { success: true, message: 'Phê duyệt đã được ghi nhận' };
  }

  // ============================================
  // COMMENT OPERATIONS
  // ============================================

  async createWorkflowComment(input: CreateWorkflowCommentInput, userId: string) {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id: input.workflowInstanceId },
    });

    if (!instance) {
      throw new NotFoundException(`Không tìm thấy workflow instance`);
    }

    const comment = await this.prisma.workflowComment.create({
      data: {
        ...input,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    await this.logActivity(input.workflowInstanceId, 'COMMENT_ADDED', userId, `Đã thêm bình luận`, {
      commentId: comment.id,
    });

    return comment;
  }

  // ============================================
  // ACTIVITY LOG
  // ============================================

  private async logActivity(instanceId: string, action: string, userId: string, description: string, details?: any) {
    return this.prisma.workflowActivityLog.create({
      data: {
        workflowInstanceId: instanceId,
        action,
        description,
        details,
        actorId: userId,
      },
    });
  }
}
