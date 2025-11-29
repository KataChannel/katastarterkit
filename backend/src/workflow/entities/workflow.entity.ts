import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { WorkflowStatus, StepType, WorkflowInstanceStatus, ApprovalStatus, AccountType } from '@prisma/client';
import GraphQLJSON from 'graphql-type-json';

// Register enums
registerEnumType(WorkflowStatus, { name: 'WorkflowStatus' });
registerEnumType(StepType, { name: 'StepType' });
registerEnumType(WorkflowInstanceStatus, { name: 'WorkflowInstanceStatus' });
registerEnumType(ApprovalStatus, { name: 'ApprovalStatus' });
registerEnumType(AccountType, { name: 'AccountType' });

@ObjectType()
export class WorkflowTemplate {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  icon?: string;

  @Field(() => String, { nullable: true })
  color?: string;

  @Field()
  isActive: boolean;

  @Field(() => Int)
  version: number;

  @Field()
  createdBy: string;

  @Field()
  createdAt: Date;

  @Field(() => String, { nullable: true })
  updatedBy?: string;

  @Field()
  updatedAt: Date;

  @Field(() => [WorkflowStep], { nullable: 'itemsAndList' })
  steps?: WorkflowStep[];

  @Field(() => [WorkflowInstance], { nullable: 'itemsAndList' })
  instances?: WorkflowInstance[];
}

@ObjectType()
export class WorkflowStep {
  @Field(() => ID)
  id: string;

  @Field()
  workflowTemplateId: string;

  @Field(() => Int)
  stepNumber: number;

  @Field(() => StepType)
  stepType: StepType;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  config?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  nextStepCondition?: any;

  @Field(() => String, { nullable: true })
  assigneeType?: string;

  @Field(() => [String])
  assigneeIds: string[];

  @Field(() => Int, { nullable: true })
  estimatedDuration?: number;

  @Field(() => Int, { nullable: true })
  dueDateOffset?: number;

  @Field()
  isRequired: boolean;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class WorkflowInstance {
  @Field(() => ID)
  id: string;

  @Field()
  workflowTemplateId: string;

  @Field()
  instanceCode: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => WorkflowInstanceStatus)
  status: WorkflowInstanceStatus;

  @Field(() => Int)
  currentStepNumber: number;

  @Field(() => GraphQLJSON)
  formData: any;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: any;

  @Field(() => String, { nullable: true })
  relatedEntityType?: string;

  @Field(() => String, { nullable: true })
  relatedEntityId?: string;

  @Field()
  initiatedBy: string;

  @Field(() => String, { nullable: true })
  assignedTo?: string;

  @Field()
  startedAt: Date;

  @Field(() => Date, { nullable: true })
  completedAt?: Date;

  @Field(() => Date, { nullable: true })
  dueDate?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [StepExecution], { nullable: 'itemsAndList' })
  stepExecutions?: StepExecution[];

  @Field(() => [WorkflowApproval], { nullable: 'itemsAndList' })
  approvals?: WorkflowApproval[];

  @Field(() => [WorkflowComment], { nullable: 'itemsAndList' })
  comments?: WorkflowComment[];

  @Field(() => [WorkflowActivityLog], { nullable: 'itemsAndList' })
  activityLogs?: WorkflowActivityLog[];

  @Field(() => WorkflowTemplate, { nullable: true })
  workflowTemplate?: WorkflowTemplate;
}

@ObjectType()
export class StepExecution {
  @Field(() => ID)
  id: string;

  @Field()
  workflowInstanceId: string;

  @Field()
  workflowStepId: string;

  @Field(() => WorkflowInstanceStatus)
  status: WorkflowInstanceStatus;

  @Field(() => Int)
  stepNumber: number;

  @Field(() => GraphQLJSON, { nullable: true })
  inputData?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  outputData?: any;

  @Field(() => String, { nullable: true })
  assignedTo?: string;

  @Field(() => String, { nullable: true })
  completedBy?: string;

  @Field(() => Date, { nullable: true })
  startedAt?: Date;

  @Field(() => Date, { nullable: true })
  completedAt?: Date;

  @Field(() => Date, { nullable: true })
  dueDate?: Date;

  @Field(() => String, { nullable: true })
  result?: string;

  @Field(() => String, { nullable: true })
  errorMessage?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => WorkflowStep, { nullable: true })
  workflowStep?: WorkflowStep;
}

@ObjectType()
export class WorkflowApproval {
  @Field(() => ID)
  id: string;

  @Field()
  workflowInstanceId: string;

  @Field(() => Int)
  stepNumber: number;

  @Field()
  approverId: string;

  @Field(() => String, { nullable: true })
  delegatedFrom?: string;

  @Field(() => ApprovalStatus)
  status: ApprovalStatus;

  @Field(() => String, { nullable: true })
  decision?: string;

  @Field(() => String, { nullable: true })
  comment?: string;

  @Field(() => [String])
  attachmentIds: string[];

  @Field()
  requestedAt: Date;

  @Field(() => Date, { nullable: true })
  respondedAt?: Date;

  @Field(() => Date, { nullable: true })
  dueDate?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class WorkflowComment {
  @Field(() => ID)
  id: string;

  @Field()
  workflowInstanceId: string;

  @Field(() => Int, { nullable: true })
  stepNumber?: number;

  @Field()
  content: string;

  @Field(() => [String])
  attachmentIds: string[];

  @Field()
  authorId: string;

  @Field(() => [String])
  mentionedUserIds: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class WorkflowActivityLog {
  @Field(() => ID)
  id: string;

  @Field()
  workflowInstanceId: string;

  @Field()
  action: string;

  @Field(() => Int, { nullable: true })
  stepNumber?: number;

  @Field()
  description: string;

  @Field(() => GraphQLJSON, { nullable: true })
  details?: any;

  @Field(() => String, { nullable: true })
  actorId?: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class EmployeeThirdPartyAccount {
  @Field(() => ID)
  id: string;

  @Field()
  employeeProfileId: string;

  @Field(() => AccountType)
  accountType: AccountType;

  @Field(() => String, { nullable: true })
  accountName?: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  accountId?: string;

  @Field(() => String, { nullable: true })
  profileUrl?: string;

  @Field(() => String, { nullable: true })
  department?: string;

  @Field(() => String, { nullable: true })
  role?: string;

  @Field()
  isActive: boolean;

  @Field()
  isVerified: boolean;

  @Field(() => Date, { nullable: true })
  verifiedAt?: Date;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: any;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  createdBy?: string;

  @Field(() => String, { nullable: true })
  updatedBy?: string;
}
