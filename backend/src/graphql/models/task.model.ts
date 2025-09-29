import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from './user.model';
import { TaskMedia } from './task-media.model';
import { TaskShare } from './task-share.model';
import { TaskComment } from './task-comment.model';
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
  author: User;

  @Field()
  userId: string;

  @Field({ nullable: true })
  parentId?: string;

  @Field(() => Task, { nullable: true })
  parent?: Task;

  @Field(() => [Task], { nullable: true })
  subtasks?: Task[];

  @Field(() => Number, { nullable: true })
  progress?: number;

  @Field(() => [TaskMedia], { nullable: true })
  media?: TaskMedia[];

  @Field(() => [TaskShare], { nullable: true })
  shares?: TaskShare[];

  @Field(() => [TaskComment], { nullable: true })
  comments?: TaskComment[];
}
