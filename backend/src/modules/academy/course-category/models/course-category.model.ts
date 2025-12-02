import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class AcademyCourseCategoryModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Int)
  displayOrder: number;

  @Field()
  isActive: boolean;

  @Field(() => Int)
  courseCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
