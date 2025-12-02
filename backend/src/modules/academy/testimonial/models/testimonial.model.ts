import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class AcademyTestimonialModel {
  @Field(() => ID)
  id: string;

  @Field()
  studentName: string;

  @Field({ nullable: true })
  studentAvatar?: string;

  @Field({ nullable: true })
  studentTitle?: string;

  @Field()
  content: string;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  videoUrl?: string;

  @Field({ nullable: true })
  courseName?: string;

  @Field({ nullable: true })
  completedDate?: Date;

  @Field(() => Int)
  displayOrder: number;

  @Field()
  isActive: boolean;

  @Field()
  isFeatured: boolean;

  @Field()
  isVerified: boolean;

  @Field({ nullable: true })
  verifiedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
