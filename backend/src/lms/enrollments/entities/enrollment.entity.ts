import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { EnrollmentStatus } from '@prisma/client';

registerEnumType(EnrollmentStatus, {
  name: 'EnrollmentStatus',
  description: 'Status of course enrollment',
});

@ObjectType()
export class Enrollment {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  courseId: string;

  @Field(() => EnrollmentStatus)
  status: EnrollmentStatus;

  @Field(() => Int)
  progress: number;

  @Field()
  enrolledAt: Date;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field({ nullable: true })
  lastAccessedAt?: Date;

  // Relations (lazy loaded)
  // user?: User;
  // course?: Course;
  // lessonProgress?: LessonProgress[];
  // certificates?: Certificate[];
}
