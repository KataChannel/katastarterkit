import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, IsBoolean, Min, Max, IsDateString } from 'class-validator';

@InputType()
export class CreateAcademyTestimonialInput {
  @Field()
  @IsString()
  studentName: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  studentAvatar?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  studentTitle?: string;

  @Field()
  @IsString()
  content: string;

  @Field(() => Int, { nullable: true, defaultValue: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  courseName?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  completedDate?: string;

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
export class UpdateAcademyTestimonialInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  studentName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  studentAvatar?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  studentTitle?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  courseName?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  completedDate?: string;

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

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}

@InputType()
export class AcademyTestimonialFilterInput {
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

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
