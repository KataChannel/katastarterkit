import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateTaskCommentInput {
  @Field(() => ID)
  @IsString()
  taskId: string;

  @Field()
  @IsString()
  content: string;
}

@InputType()
export class UpdateTaskCommentInput {
  @Field(() => ID)
  @IsString()
  commentId: string;

  @Field()
  @IsString()
  content: string;
}
