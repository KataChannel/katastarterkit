import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsInt, IsEnum, IsArray, IsJSON } from 'class-validator';
import { StepType, WorkflowInstanceStatus, ApprovalStatus, AccountType } from '@prisma/client';
import GraphQLJSON from 'graphql-type-json';

// ============================================
// Workflow Template DTOs
// ============================================

@InputType()
export class CreateWorkflowTemplateInput {
  @Field()
  @IsString()
  code: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  icon?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  color?: string;
}

@InputType()
export class UpdateWorkflowTemplateInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  icon?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ============================================
// Workflow Step DTOs
// ============================================

@InputType()
export class CreateWorkflowStepInput {
  @Field()
  @IsString()
  workflowTemplateId: string;

  @Field(() => Int)
  @IsInt()
  stepNumber: number;

  @Field(() => StepType)
  @IsEnum(StepType)
  stepType: StepType;

  @Field()
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  config?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  nextStepCondition?: any;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  assigneeType?: string;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  assigneeIds: string[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  estimatedDuration?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  dueDateOffset?: number;

  @Field(() => Boolean, { defaultValue: true })
  @IsBoolean()
  isRequired: boolean;
}

@InputType()
export class UpdateWorkflowStepInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  config?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  nextStepCondition?: any;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  assigneeType?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  assigneeIds?: string[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  estimatedDuration?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  dueDateOffset?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ============================================
// Workflow Instance DTOs
// ============================================

@InputType()
export class CreateWorkflowInstanceInput {
  @Field()
  @IsString()
  workflowTemplateId: string;

  @Field()
  @IsString()
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => GraphQLJSON)
  formData: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  metadata?: any;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  relatedEntityId?: string;
}

@InputType()
export class UpdateWorkflowInstanceInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => WorkflowInstanceStatus, { nullable: true })
  @IsOptional()
  @IsEnum(WorkflowInstanceStatus)
  status?: WorkflowInstanceStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  currentStepNumber?: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  formData?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  metadata?: any;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  assignedTo?: string;
}

@InputType()
export class CompleteStepInput {
  @Field()
  @IsString()
  workflowInstanceId: string;

  @Field(() => Int)
  @IsInt()
  stepNumber: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  outputData?: any;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}

// ============================================
// Workflow Approval DTOs
// ============================================

@InputType()
export class CreateWorkflowApprovalInput {
  @Field()
  @IsString()
  workflowInstanceId: string;

  @Field(() => Int)
  @IsInt()
  stepNumber: number;

  @Field()
  @IsString()
  approverId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  delegatedFrom?: string;
}

@InputType()
export class RespondToApprovalInput {
  @Field()
  @IsString()
  approvalId: string;

  @Field()
  @IsString()
  decision: string; // "APPROVED" | "REJECTED"

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  attachmentIds: string[];
}

// ============================================
// Workflow Comment DTOs
// ============================================

@InputType()
export class CreateWorkflowCommentInput {
  @Field()
  @IsString()
  workflowInstanceId: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  stepNumber?: number;

  @Field()
  @IsString()
  content: string;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  attachmentIds: string[];

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  mentionedUserIds: string[];
}

// ============================================
// Employee Third Party Account DTOs
// ============================================

@InputType()
export class CreateEmployeeThirdPartyAccountInput {
  @Field()
  @IsString()
  employeeProfileId: string;

  @Field(() => AccountType)
  @IsEnum(AccountType)
  accountType: AccountType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  accountName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  accountId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  profileUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  department?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  role?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  metadata?: any;
}

@InputType()
export class UpdateEmployeeThirdPartyAccountInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  accountName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  accountId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  profileUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  department?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  role?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  metadata?: any;
}

// ============================================
// Employee Onboarding (Checkin Nhân Sự) DTOs
// ============================================

@InputType()
export class EmployeeOnboardingFormData {
  // Thông tin cơ bản
  @Field()
  @IsString()
  fullName: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  phone: string;

  @Field()
  @IsString()
  position: string;

  @Field()
  @IsString()
  department: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  startDate?: string;

  // Thông tin bổ sung
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  citizenId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  bankAccountNumber?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  bankName?: string;

  // Tài khoản bên thứ 3
  @Field(() => [ThirdPartyAccountData], { defaultValue: [] })
  @IsOptional()
  @IsArray()
  thirdPartyAccounts?: ThirdPartyAccountData[];
}

@InputType()
export class ThirdPartyAccountData {
  @Field(() => AccountType)
  @IsEnum(AccountType)
  accountType: AccountType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}

@InputType()
export class StartEmployeeOnboardingInput {
  @Field(() => EmployeeOnboardingFormData)
  formData: EmployeeOnboardingFormData;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
