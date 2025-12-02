import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, IsInt, IsBoolean, Min, IsUrl } from 'class-validator';

@InputType()
export class CreateAcademyInstructorInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  bio?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  specialization?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  experience?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  education?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  certifications?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  linkedIn?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  website?: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;

  @Field({ nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

@InputType()
export class UpdateAcademyInstructorInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  bio?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  specialization?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  experience?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  education?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  certifications?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  linkedIn?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  website?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

@InputType()
export class AcademyInstructorFilterInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
