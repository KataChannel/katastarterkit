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
  @IsString()
  @IsNotEmpty({ message: 'Blog post ID is required' })
  id: string;

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
  content?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  author?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  tagIds?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  publishedAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
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
