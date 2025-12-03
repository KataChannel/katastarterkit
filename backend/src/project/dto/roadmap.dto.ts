import { ObjectType, Field, ID, Int, InputType, registerEnumType } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';

// ==================== Enums ====================

export enum RoadmapStatus {
  IDEA = 'IDEA',
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum RoadmapPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

registerEnumType(RoadmapStatus, {
  name: 'RoadmapStatus',
  description: 'Trạng thái của roadmap item',
});

registerEnumType(RoadmapPriority, {
  name: 'RoadmapPriority',
  description: 'Độ ưu tiên của roadmap item',
});

// ==================== GraphQL Types ====================

// NOTE: RoadmapOwnerType MUST be defined BEFORE RoadmapItemType to avoid initialization error
@ObjectType('RoadmapOwner')
export class RoadmapOwnerType {
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

@ObjectType('RoadmapItem')
export class RoadmapItemType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => RoadmapStatus)
  status: RoadmapStatus;

  @Field(() => RoadmapPriority)
  priority: RoadmapPriority;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  quarter?: string; // e.g., "Q1 2025"

  @Field(() => Int, { defaultValue: 0 })
  progress: number; // 0-100

  @Field({ nullable: true })
  estimatedValue?: string; // Business value description

  @Field(() => ID)
  projectId: string;

  @Field(() => ID, { nullable: true })
  ownerId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => RoadmapOwnerType, { nullable: true })
  owner?: RoadmapOwnerType;
}

// ==================== Input Types ====================

@InputType('CreateRoadmapItemInput')
export class CreateRoadmapItemInput {
  @Field()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => RoadmapStatus, { defaultValue: RoadmapStatus.IDEA })
  @IsEnum(RoadmapStatus)
  status: RoadmapStatus;

  @Field(() => RoadmapPriority, { defaultValue: RoadmapPriority.MEDIUM })
  @IsEnum(RoadmapPriority)
  priority: RoadmapPriority;

  @Field({ nullable: true })
  @IsOptional()
  startDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  endDate?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  quarter?: string;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  @Max(100)
  progress: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  estimatedValue?: string;

  @Field(() => ID)
  @IsString()
  projectId: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  ownerId?: string;
}

@InputType('UpdateRoadmapItemInput')
export class UpdateRoadmapItemInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => RoadmapStatus, { nullable: true })
  @IsEnum(RoadmapStatus)
  @IsOptional()
  status?: RoadmapStatus;

  @Field(() => RoadmapPriority, { nullable: true })
  @IsEnum(RoadmapPriority)
  @IsOptional()
  priority?: RoadmapPriority;

  @Field({ nullable: true })
  @IsOptional()
  startDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  endDate?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  quarter?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  estimatedValue?: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  ownerId?: string;
}
