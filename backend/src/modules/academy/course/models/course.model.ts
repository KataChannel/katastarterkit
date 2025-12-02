import { ObjectType, Field, ID, Int, Float, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { Decimal } from '@prisma/client/runtime/library';
import { AcademyCourseCategoryModel } from '../../course-category/models/course-category.model';

// Re-export for convenience
export { AcademyCourseCategoryModel };

@ObjectType()
export class AcademyCourseModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  shortDescription?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  featuredImage?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  gallery?: any;

  @Field({ nullable: true })
  videoUrl?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => Float, { nullable: true })
  discountPrice?: number;

  @Field(() => Int, { nullable: true })
  discountPercent?: number;

  @Field({ defaultValue: 'VND' })
  currency: string;

  @Field({ nullable: true })
  duration?: string;

  @Field(() => Int, { nullable: true })
  durationHours?: number;

  @Field({ nullable: true })
  schedule?: string;

  @Field(() => Int, { nullable: true })
  maxStudents?: number;

  @Field(() => Int)
  currentStudents: number;

  @Field(() => GraphQLJSON, { nullable: true })
  benefits?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  curriculum?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  requirements?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  targetAudience?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  instructors?: any;

  @Field()
  isActive: boolean;

  @Field()
  isFeatured: boolean;

  @Field()
  isPopular: boolean;

  @Field()
  isNew: boolean;

  @Field(() => Int)
  displayOrder: number;

  @Field({ nullable: true })
  metaTitle?: string;

  @Field({ nullable: true })
  metaDescription?: string;

  @Field({ nullable: true })
  focusKeyword?: string;

  @Field(() => Int)
  views: number;

  @Field(() => Int)
  enrollments: number;

  @Field(() => Float, { nullable: true })
  rating?: number;

  @Field(() => Int)
  reviewCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field({ nullable: true })
  categoryId?: string;

  @Field(() => AcademyCourseCategoryModel, { nullable: true })
  category?: AcademyCourseCategoryModel;
}
