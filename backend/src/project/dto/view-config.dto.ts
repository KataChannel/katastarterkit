import { ObjectType, Field, ID, Int, InputType, registerEnumType } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsBoolean, IsInt, Min } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

// ==================== Enums ====================

export enum ProjectViewType {
  LIST = 'LIST',
  KANBAN = 'KANBAN',
  TIMELINE = 'TIMELINE',
  CALENDAR = 'CALENDAR',
  BACKLOG = 'BACKLOG',
  SPRINT = 'SPRINT',
  DASHBOARD = 'DASHBOARD',
  ROADMAP = 'ROADMAP',
}

registerEnumType(ProjectViewType, {
  name: 'ProjectViewType',
  description: 'Loại view cho project',
});

// ==================== GraphQL Types ====================

@ObjectType('ProjectViewConfig')
export class ProjectViewConfigType {
  @Field(() => ID)
  id: string;

  @Field(() => ProjectViewType)
  viewType: ProjectViewType;

  @Field(() => Boolean, { defaultValue: false })
  isDefault: boolean;

  @Field(() => Int, { defaultValue: 0 })
  order: number;

  @Field(() => GraphQLJSON, { nullable: true })
  config?: any; // JSON config per view type

  @Field(() => ID)
  projectId: string;

  @Field(() => ID, { nullable: true })
  userId?: string; // Null = project default, not null = user override

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

// ==================== Input Types ====================

@InputType('SaveProjectViewConfigInput')
export class SaveProjectViewConfigInput {
  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  id?: string; // If provided, update existing; otherwise create new

  @Field(() => ProjectViewType)
  @IsEnum(ProjectViewType)
  viewType: ProjectViewType;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  isDefault: boolean;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  order: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  config?: any;

  @Field(() => ID)
  @IsString()
  projectId: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  userId?: string; // If null, save as project default
}

@InputType('GetProjectViewConfigsInput')
export class GetProjectViewConfigsInput {
  @Field(() => ID)
  @IsString()
  projectId: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  userId?: string; // If provided, get user-specific configs; otherwise project defaults
}
