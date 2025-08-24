import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskCategory, TaskPriority, TaskStatus } from '@prisma/client';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => TaskCategory)
  @IsEnum(TaskCategory)
  category: TaskCategory;

  @Field(() => TaskPriority)
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

@InputType()
export class UpdateTaskInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => TaskCategory, { nullable: true })
  @IsOptional()
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @Field(() => TaskPriority, { nullable: true })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

@InputType()
export class TaskFilterInput {
  @Field(() => TaskCategory, { nullable: true })
  @IsOptional()
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @Field(() => TaskPriority, { nullable: true })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueBefore?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueAfter?: string;
}
