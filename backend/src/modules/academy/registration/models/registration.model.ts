import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

// Define enum locally instead of importing from Prisma
export enum AcademyRegistrationStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  CONFIRMED = 'CONFIRMED',
  ENROLLED = 'ENROLLED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

registerEnumType(AcademyRegistrationStatus, {
  name: 'AcademyRegistrationStatus',
  description: 'Status of academy course registration',
});

@ObjectType()
export class AcademyCourseRegistrationModel {
  @Field(() => ID)
  id: string;

  @Field()
  fullName: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  occupation?: string;

  @Field({ nullable: true })
  education?: string;

  @Field({ nullable: true })
  note?: string;

  @Field({ nullable: true })
  source?: string;

  @Field({ nullable: true })
  referralCode?: string;

  @Field(() => AcademyRegistrationStatus)
  status: AcademyRegistrationStatus;

  @Field({ nullable: true })
  statusNote?: string;

  @Field({ nullable: true })
  contactedAt?: Date;

  @Field({ nullable: true })
  confirmedAt?: Date;

  @Field({ nullable: true })
  enrolledAt?: Date;

  @Field()
  courseId: string;

  @Field({ nullable: true })
  branchId?: string;

  @Field({ nullable: true })
  assignedTo?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
