import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class TaskComment {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  taskId: string;

  @Field(() => User)
  user: User;

  @Field()
  userId: string;

  @Field({ nullable: true })
  parentId?: string;

  @Field(() => TaskComment, { nullable: true })
  parent?: TaskComment;

  @Field(() => [TaskComment], { nullable: true })
  replies?: TaskComment[];
}
