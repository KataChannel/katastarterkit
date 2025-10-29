import { ObjectType, Field, ID, Int, InputType } from '@nestjs/graphql';

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
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  avatar?: string;
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
}

@InputType('AddMemberInput')
export class AddMemberInput {
  @Field(() => ID)
  userId: string;

  @Field({ nullable: true, defaultValue: 'member' })
  role?: 'owner' | 'admin' | 'member';
}

@InputType('UpdateMemberRoleInput')
export class UpdateMemberRoleInput {
  @Field(() => ID)
  userId: string;

  @Field()
  role: 'owner' | 'admin' | 'member';
}
