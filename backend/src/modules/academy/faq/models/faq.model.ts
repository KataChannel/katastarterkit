import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class AcademyFAQModel {
  @Field(() => ID)
  id: string;

  @Field()
  question: string;

  @Field()
  answer: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => Int)
  displayOrder: number;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
