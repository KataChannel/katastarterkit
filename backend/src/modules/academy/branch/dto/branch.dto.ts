import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsNumber, IsEmail } from 'class-validator';

@InputType()
export class CreateBranchInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  slug?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  facebookPageId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  zaloUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  zaloOaId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  hotline?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  workingHours?: string;

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
  featuredImage?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mapEmbedUrl?: string;

  @Field({ nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

@InputType()
export class UpdateBranchInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  slug?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  facebookPageId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  zaloUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  zaloOaId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  hotline?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  workingHours?: string;

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
  featuredImage?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mapEmbedUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

@InputType()
export class BranchFilterInput {
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
  @IsString()
  search?: string;
}
