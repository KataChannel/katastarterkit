import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateDiscussionInput {
  @Field(() => ID)
  courseId: string;

  @Field(() => ID, { nullable: true })
  lessonId?: string;

  @Field()
  title: string;

  @Field()
  content: string;
}

@InputType()
export class CreateReplyInput {
  @Field(() => ID)
  discussionId: string;

  @Field()
  content: string;

  @Field(() => ID, { nullable: true })
  parentId?: string;
}

@InputType()
export class UpdateDiscussionInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;
}
