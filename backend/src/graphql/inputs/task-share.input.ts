import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsEnum } from 'class-validator';
import { SharePermission } from '@prisma/client';

@InputType()
export class ShareTaskInput {
  @Field(() => ID)
  @IsString()
  taskId: string;

  @Field()
  @IsString()
  sharedWithId: string;

  @Field(() => SharePermission)
  @IsEnum(SharePermission)
  permission: SharePermission;
}

@InputType()
export class UpdateTaskShareInput {
  @Field(() => ID)
  @IsString()
  shareId: string;

  @Field(() => SharePermission)
  @IsEnum(SharePermission)
  permission: SharePermission;
}
