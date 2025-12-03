import { ObjectType, Field, ID, Int, InputType, registerEnumType } from '@nestjs/graphql';
import { IsString, IsOptional, MinLength, MaxLength, IsUrl, IsEnum } from 'class-validator';

// ==================== Enums ====================

export enum ProjectMethodology {
  WATERFALL = 'WATERFALL',
  AGILE = 'AGILE',
  SCRUM = 'SCRUM',
  KANBAN = 'KANBAN',
  HYBRID = 'HYBRID',
  LEAN = 'LEAN',
  XP = 'XP',
  CUSTOM = 'CUSTOM',
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(ProjectMethodology, {
  name: 'ProjectMethodology',
  description: 'Phương pháp luận quản lý dự án',
});

registerEnumType(ProjectStatus, {
  name: 'ProjectStatus',
  description: 'Trạng thái dự án',
});

// ==================== User Type (Simple) ====================

@ObjectType('ProjectUser')
export class ProjectUserType {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  avatar?: string;
}

// ==================== Stats Type (Must be before ProjectType) ====================

@ObjectType('ProjectStats')
export class ProjectStats {
  @Field(() => Int)
  tasks: number;

  @Field(() => Int)
  chatMessages: number;

  @Field(() => Int)
  members: number;
}

// ==================== GraphQL Types ====================

@ObjectType('Project')
export class ProjectType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => ProjectMethodology, { defaultValue: ProjectMethodology.CUSTOM })
  methodology: ProjectMethodology;

  @Field(() => ProjectStatus, { defaultValue: ProjectStatus.ACTIVE })
  status: ProjectStatus;

  @Field(() => [String], { nullable: true })
  enabledViews?: string[];

  @Field()
  isArchived: boolean;

  @Field(() => ID)
  ownerId: string;

  @Field(() => ProjectUserType)
  owner: ProjectUserType;

  @Field(() => [ProjectMemberType])
  members: ProjectMemberType[];

  @Field(() => ProjectStats, { nullable: true })
  _count?: ProjectStats;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType('ProjectMember')
export class ProjectMemberType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  projectId: string;

  @Field(() => ID)
  userId: string;

  @Field()
  role: string; // 'owner' | 'admin' | 'member'

  @Field(() => ProjectUserType)
  user: ProjectUserType;

  @Field()
  joinedAt: Date;
}

// ==================== Input Types ====================

@InputType('CreateProjectInput')
export class CreateProjectInput {
  @Field()
  @IsString()
  @MinLength(1, { message: 'Project name cannot be empty' })
  @MaxLength(200, { message: 'Project name is too long' })
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar?: string;

  @Field(() => ProjectMethodology, { nullable: true, defaultValue: ProjectMethodology.CUSTOM })
  @IsOptional()
  @IsEnum(ProjectMethodology)
  methodology?: ProjectMethodology;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  enabledViews?: string[];
}

@InputType('UpdateProjectInput')
export class UpdateProjectInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  isArchived?: boolean;

  @Field(() => ProjectMethodology, { nullable: true })
  @IsOptional()
  @IsEnum(ProjectMethodology)
  methodology?: ProjectMethodology;

  @Field(() => ProjectStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  enabledViews?: string[];
}

@InputType('AddMemberInput')
export class AddMemberInput {
  @Field(() => ID)
  @IsString()
  userId: string;

  @Field({ nullable: true, defaultValue: 'member' })
  @IsString()
  @IsOptional()
  role?: 'owner' | 'admin' | 'member';
}

@InputType('UpdateMemberRoleInput')
export class UpdateMemberRoleInput {
  @Field(() => ID)
  userId: string;

  @Field()
  role: 'owner' | 'admin' | 'member';
}
