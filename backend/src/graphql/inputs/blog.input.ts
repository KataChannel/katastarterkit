import { InputType, Field, ID, Int } from '@nestjs/graphql';

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
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  order?: number;

  @Field({ nullable: true, defaultValue: true })
  isActive?: boolean;
}

@InputType()
export class UpdateBlogCategoryInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field(() => Int, { nullable: true })
  order?: number;

  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class CreateBlogTagInput {
  @Field()
  name: string;

  @Field()
  slug: string;
}

@InputType()
export class UpdateBlogTagInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;
}
