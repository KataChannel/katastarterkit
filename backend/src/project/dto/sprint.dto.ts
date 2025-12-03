import { ObjectType, Field, ID, Int, InputType, registerEnumType } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsInt, Min, IsDate } from 'class-validator';

// ==================== Enums ====================

export enum SprintStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(SprintStatus, {
  name: 'SprintStatus',
  description: 'Trạng thái của sprint',
});

// ==================== GraphQL Types ====================

// NOTE: TaskType MUST be defined BEFORE SprintType to avoid initialization error
@ObjectType('SprintTask')
export class TaskType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  status: string;

  @Field()
  priority: string;

  @Field(() => Int, { nullable: true })
  storyPoints?: number;

  @Field({ nullable: true })
  completedAt?: Date;
}

@ObjectType('Sprint')
export class SprintType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  goal?: string;

  @Field(() => SprintStatus)
  status: SprintStatus;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => Int, { defaultValue: 0 })
  capacity: number;

  @Field(() => Int, { defaultValue: 0 })
  committed: number;

  @Field(() => Int, { defaultValue: 0 })
  completed: number;

  @Field(() => Int, { nullable: true })
  velocity?: number;

  @Field(() => ID)
  projectId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => [TaskType], { nullable: true })
  tasks?: TaskType[];
}

// ==================== Input Types ====================

@InputType('CreateSprintInput')
export class CreateSprintInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  goal?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  capacity: number;

  @Field(() => ID)
  @IsString()
  projectId: string;
}

@InputType('UpdateSprintInput')
export class UpdateSprintInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  goal?: string;

  @Field(() => SprintStatus, { nullable: true })
  @IsEnum(SprintStatus)
  @IsOptional()
  status?: SprintStatus;

  @Field({ nullable: true })
  @IsOptional()
  startDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  endDate?: Date;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  capacity?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  committed?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  completed?: number;
}

@InputType('CloseSprintInput')
export class CloseSprintInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  moveUnfinishedToSprintId?: string; // Move unfinished tasks to another sprint
}
