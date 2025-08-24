import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from './user.model';
import { TaskCategory, TaskPriority, TaskStatus } from '@prisma/client';

registerEnumType(TaskCategory, {
  name: 'TaskCategory',
  description: 'The category of a task',
});

registerEnumType(TaskPriority, {
  name: 'TaskPriority',
  description: 'The priority level of a task',
});

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'The status of a task',
});

@ObjectType()
export class Task {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TaskCategory)
  category: TaskCategory;

  @Field(() => TaskPriority)
  priority: TaskPriority;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  user: User;

  @Field()
  userId: string;

  @Field(() => [String], { nullable: true })
  mediaIds?: string[];

  @Field(() => [String], { nullable: true })
  shareIds?: string[];

  @Field(() => [String], { nullable: true })
  commentIds?: string[];
}
