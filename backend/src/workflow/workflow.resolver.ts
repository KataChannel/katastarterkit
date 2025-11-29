import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { EmployeeOnboardingService } from './employee-onboarding.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  WorkflowTemplate,
  WorkflowStep,
  WorkflowInstance,
  WorkflowApproval,
  WorkflowComment,
} from './entities/workflow.entity';
import {
  CreateWorkflowTemplateInput,
  UpdateWorkflowTemplateInput,
  CreateWorkflowStepInput,
  UpdateWorkflowStepInput,
  CreateWorkflowInstanceInput,
  UpdateWorkflowInstanceInput,
  CompleteStepInput,
  RespondToApprovalInput,
  CreateWorkflowCommentInput,
  StartEmployeeOnboardingInput,
} from './dto/workflow.dto';

@Resolver()
@UseGuards(JwtAuthGuard)
export class WorkflowResolver {
  constructor(
    private workflowService: WorkflowService,
    private employeeOnboardingService: EmployeeOnboardingService,
  ) {}

  // ============================================
  // WORKFLOW TEMPLATE QUERIES
  // ============================================

  @Query(() => WorkflowTemplate)
  async workflowTemplate(@Args('id', { type: () => ID }) id: string) {
    return this.workflowService.getWorkflowTemplate(id);
  }

  @Query(() => [WorkflowTemplate])
  async workflowTemplates(
    @Args('category', { nullable: true }) category?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
  ) {
    const where: any = {};
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive;
    return this.workflowService.getWorkflowTemplates(where);
  }

  // ============================================
  // WORKFLOW TEMPLATE MUTATIONS
  // ============================================

  @Mutation(() => WorkflowTemplate)
  async createWorkflowTemplate(
    @Args('input') input: CreateWorkflowTemplateInput,
    @Context() context: any,
  ) {
    return this.workflowService.createWorkflowTemplate(input, context.req.user.userId);
  }

  @Mutation(() => WorkflowTemplate)
  async updateWorkflowTemplate(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateWorkflowTemplateInput,
    @Context() context: any,
  ) {
    return this.workflowService.updateWorkflowTemplate(id, input, context.req.user.userId);
  }

  @Mutation(() => Boolean)
  async deleteWorkflowTemplate(@Args('id', { type: () => ID }) id: string) {
    await this.workflowService.deleteWorkflowTemplate(id);
    return true;
  }

  // ============================================
  // WORKFLOW STEP MUTATIONS
  // ============================================

  @Mutation(() => WorkflowStep)
  async createWorkflowStep(@Args('input') input: CreateWorkflowStepInput) {
    return this.workflowService.createWorkflowStep(input);
  }

  @Mutation(() => WorkflowStep)
  async updateWorkflowStep(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateWorkflowStepInput,
  ) {
    return this.workflowService.updateWorkflowStep(id, input);
  }

  @Mutation(() => Boolean)
  async deleteWorkflowStep(@Args('id', { type: () => ID }) id: string) {
    await this.workflowService.deleteWorkflowStep(id);
    return true;
  }

  // ============================================
  // WORKFLOW INSTANCE QUERIES
  // ============================================

  @Query(() => WorkflowInstance)
  async workflowInstance(@Args('id', { type: () => ID }) id: string) {
    return this.workflowService.getWorkflowInstance(id);
  }

  @Query(() => [WorkflowInstance])
  async workflowInstances(
    @Args('status', { nullable: true }) status?: string,
    @Args('initiatedBy', { type: () => ID, nullable: true }) initiatedBy?: string,
  ) {
    const where: any = {};
    if (status) where.status = status;
    if (initiatedBy) where.initiatedBy = initiatedBy;
    return this.workflowService.getWorkflowInstances(where);
  }

  @Query(() => [WorkflowInstance])
  async myWorkflowInstances(@Context() context: any) {
    const userId = context.req.user.userId;
    return this.workflowService.getWorkflowInstances({
      OR: [
        { initiatedBy: userId },
        { assignedTo: userId },
        { approvals: { some: { approverId: userId } } },
      ],
    });
  }

  // ============================================
  // WORKFLOW INSTANCE MUTATIONS
  // ============================================

  @Mutation(() => WorkflowInstance)
  async createWorkflowInstance(
    @Args('input') input: CreateWorkflowInstanceInput,
    @Context() context: any,
  ) {
    return this.workflowService.createWorkflowInstance(input, context.req.user.userId);
  }

  @Mutation(() => WorkflowInstance)
  async updateWorkflowInstance(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateWorkflowInstanceInput,
    @Context() context: any,
  ) {
    return this.workflowService.updateWorkflowInstance(id, input, context.req.user.userId);
  }

  @Mutation(() => Boolean)
  async cancelWorkflowInstance(
    @Args('id', { type: () => ID }) id: string,
    @Args('reason') reason: string,
    @Context() context: any,
  ) {
    const result = await this.workflowService.cancelWorkflowInstance(
      id,
      reason,
      context.req.user.userId,
    );
    return result.success;
  }

  @Mutation(() => Boolean)
  async completeStep(@Args('input') input: CompleteStepInput, @Context() context: any) {
    const result = await this.workflowService.completeStep(input, context.req.user.userId);
    return result.success;
  }

  // ============================================
  // APPROVAL MUTATIONS
  // ============================================

  @Mutation(() => Boolean)
  async respondToApproval(@Args('input') input: RespondToApprovalInput, @Context() context: any) {
    const result = await this.workflowService.respondToApproval(input, context.req.user.userId);
    return result.success;
  }

  @Query(() => [WorkflowApproval])
  async myPendingApprovals(@Context() context: any) {
    const userId = context.req.user.userId;
    const instances = await this.workflowService.getWorkflowInstances({
      approvals: {
        some: {
          approverId: userId,
          status: 'PENDING',
        },
      },
    });

    // Extract all pending approvals
    const pendingApprovals = [];
    for (const instance of instances) {
      const approvals = await this.workflowService.getWorkflowInstance(instance.id);
      pendingApprovals.push(
        ...approvals.approvals.filter(a => a.approverId === userId && a.status === 'PENDING'),
      );
    }

    return pendingApprovals;
  }

  // ============================================
  // COMMENT MUTATIONS
  // ============================================

  @Mutation(() => WorkflowComment)
  async createWorkflowComment(
    @Args('input') input: CreateWorkflowCommentInput,
    @Context() context: any,
  ) {
    return this.workflowService.createWorkflowComment(input, context.req.user.userId);
  }

  // ============================================
  // EMPLOYEE ONBOARDING
  // ============================================

  @Mutation(() => WorkflowInstance)
  async startEmployeeOnboarding(
    @Args('input') input: StartEmployeeOnboardingInput,
    @Context() context: any,
  ) {
    const result = await this.employeeOnboardingService.startEmployeeOnboarding(
      input,
      context.req.user.userId,
    );
    return result.workflowInstance;
  }

  @Mutation(() => Boolean)
  async setupEmployeeOnboardingWorkflow(@Context() context: any) {
    await this.employeeOnboardingService.setupEmployeeOnboardingWorkflow(context.req.user.userId);
    return true;
  }

  @Query(() => WorkflowInstance)
  async getEmployeeOnboardingStatus(@Args('employeeId', { type: () => ID }) employeeId: string) {
    return this.employeeOnboardingService.getEmployeeOnboardingStatus(employeeId);
  }
}
