import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsNotEmpty, IsInt, IsBoolean } from 'class-validator';

@InputType()
export class CreateBlogInput {
  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  shortDescription?: string;

  @Field({ nullable: true })
  excerpt?: string;

  @Field()
  author: string;

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field({ nullable: true })
  bannerUrl?: string;

  @Field({ nullable: true })
  categoryId?: string;

  @Field(() => [String], { nullable: true })
  tagIds?: string[];

  @Field({ nullable: true, defaultValue: false })
  isFeatured?: boolean;

  @Field({ nullable: true, defaultValue: true })
  isPublished?: boolean;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field({ nullable: true })
  metaTitle?: string;

  @Field({ nullable: true })
  metaDescription?: string;

  @Field(() => [String], { nullable: true })
  metaKeywords?: string[];
}

@InputType()
export class UpdateBlogInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  shortDescription?: string;

  @Field({ nullable: true })
  excerpt?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field({ nullable: true })
  bannerUrl?: string;

  @Field({ nullable: true })
  categoryId?: string;

  @Field(() => [String], { nullable: true })
  tagIds?: string[];

  @Field({ nullable: true })
  isFeatured?: boolean;

  @Field({ nullable: true })
  isPublished?: boolean;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field({ nullable: true })
  metaTitle?: string;

  @Field({ nullable: true })
  metaDescription?: string;

  @Field(() => [String], { nullable: true })
  metaKeywords?: string[];
}

@InputType()
export class GetBlogsInput {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 12 })
  limit?: number;

  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true, defaultValue: 'latest' })
  sort?: string;
}

@InputType()
export class CreateBlogCategoryInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsInt()
  @IsOptional()
  order?: number;

  @Field({ nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

@InputType()
export class UpdateBlogCategoryInput {
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
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  order?: number;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

@InputType()
export class CreateBlogTagInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Tag name is required' })
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;
}

@InputType()
export class UpdateBlogTagInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;
}
