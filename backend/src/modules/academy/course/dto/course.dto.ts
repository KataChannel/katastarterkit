import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateAcademyCourseInput {
  @Field()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  slug?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  content?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  gallery?: any;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @Field({ nullable: true, defaultValue: 'VND' })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  duration?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  durationHours?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  schedule?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxStudents?: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  benefits?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  curriculum?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  requirements?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  targetAudience?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  instructors?: any;

  @Field({ nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  focusKeyword?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @Field({ nullable: true })
  @IsOptional()
  publishedAt?: Date;
}

@InputType()
export class UpdateAcademyCourseInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  slug?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  content?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  gallery?: any;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  duration?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  durationHours?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  schedule?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxStudents?: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  benefits?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  curriculum?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  requirements?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  targetAudience?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  instructors?: any;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  focusKeyword?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @Field({ nullable: true })
  @IsOptional()
  publishedAt?: Date;
}

@InputType()
export class AcademyCourseFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  offset?: number;
}
