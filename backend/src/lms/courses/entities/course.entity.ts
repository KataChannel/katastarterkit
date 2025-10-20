import { ObjectType, Field, ID, Float, Int, registerEnumType } from '@nestjs/graphql';
import { CourseLevel, CourseStatus } from '@prisma/client';

// Register enums for GraphQL
registerEnumType(CourseLevel, {
  name: 'CourseLevel',
  description: 'Course difficulty level',
});

registerEnumType(CourseStatus, {
  name: 'CourseStatus',
  description: 'Course publication status',
});

@ObjectType()
export class Course {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field({ nullable: true })
  trailer?: string;

  @Field(() => Float)
  price: number;

  @Field(() => CourseLevel)
  level: CourseLevel;

  @Field(() => CourseStatus)
  status: CourseStatus;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field({ nullable: true })
  metaTitle?: string;

  @Field({ nullable: true })
  metaDescription?: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => Int)
  enrollmentCount: number;

  @Field(() => Float)
  rating: number;

  @Field(() => Float)
  avgRating: number;

  @Field(() => Int)
  reviewCount: number;

  @Field(() => String)
  instructorId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  publishedAt?: Date;

  // Relations (lazy loaded)
  // instructor?: User;
  // category?: CourseCategory;
  // modules?: CourseModule[];
  // enrollments?: Enrollment[];
  // reviews?: CourseReview[];
}
