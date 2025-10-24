import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { CategoryType } from './category.type';

// Enums
export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum BlogSortBy {
  LATEST = 'LATEST',
  OLDEST = 'OLDEST',
  POPULAR = 'POPULAR',
  FEATURED = 'FEATURED',
}

registerEnumType(BlogStatus, {
  name: 'BlogStatus',
  description: 'Trạng thái bài viết',
});

registerEnumType(BlogSortBy, {
  name: 'BlogSortBy',
  description: 'Sắp xếp bài viết',
});

// BlogTag Type
@ObjectType()
export class BlogTagType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

// BlogCategory Type (reuse from category if exists, or create a new one)
@ObjectType()
export class BlogCategoryType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field(() => Int)
  postCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

// Blog Type
@ObjectType()
export class BlogType {
  @Field(() => ID)
  id: string;

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

  @Field(() => Int)
  viewCount: number;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  category?: BlogCategoryType;

  @Field(() => [BlogTagType], { nullable: true })
  tags?: BlogTagType[];

  @Field()
  isFeatured: boolean;

  @Field()
  isPublished: boolean;

  @Field({ nullable: true })
  metaTitle?: string;

  @Field({ nullable: true })
  metaDescription?: string;

  @Field({ nullable: true })
  metaKeywords?: string;

  @Field()
  createdAt: Date;
}

// Paginated Blogs Response
@ObjectType()
export class PaginatedBlogs {
  @Field(() => [BlogType])
  items: BlogType[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  totalPages: number;

  @Field()
  hasMore: boolean;
}
