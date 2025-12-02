import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { AcademyRegistrationStatus } from '../models/registration.model';

@InputType()
export class CreateAcademyRegistrationInput {
  @Field()
  @IsString()
  fullName: string;

  @Field()
  @IsString()
  phone: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  gender?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  occupation?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  education?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  note?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  source?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  referralCode?: string;

  @Field()
  @IsString()
  courseId: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  branchId?: string;
}

@InputType()
export class UpdateAcademyRegistrationInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  fullName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  gender?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  occupation?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  education?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  note?: string;

  @Field(() => AcademyRegistrationStatus, { nullable: true })
  @IsEnum(AcademyRegistrationStatus)
  @IsOptional()
  status?: AcademyRegistrationStatus;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  statusNote?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  assignedTo?: string;
}

@InputType()
export class AcademyRegistrationFilterInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field(() => AcademyRegistrationStatus, { nullable: true })
  @IsEnum(AcademyRegistrationStatus)
  @IsOptional()
  status?: AcademyRegistrationStatus;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  courseId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  branchId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  source?: string;
}
