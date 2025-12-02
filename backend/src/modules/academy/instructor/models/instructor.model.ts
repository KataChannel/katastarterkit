import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class AcademyInstructorModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  specialization?: string;

  @Field({ nullable: true })
  experience?: string;

  @Field({ nullable: true })
  education?: string;

  @Field({ nullable: true })
  certifications?: string;

  @Field({ nullable: true })
  linkedIn?: string;

  @Field({ nullable: true })
  facebook?: string;

  @Field({ nullable: true })
  website?: string;

  @Field(() => Int)
  displayOrder: number;

  @Field()
  isActive: boolean;

  @Field()
  isFeatured: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
