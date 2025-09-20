import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

// Define enums directly for GraphQL
export enum PageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum BlockType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  HERO = 'HERO',
  GALLERY = 'GALLERY',
  VIDEO = 'VIDEO',
  BUTTON = 'BUTTON',
  DIVIDER = 'DIVIDER',
  SPACER = 'SPACER',
  COLUMN = 'COLUMN',
  ROW = 'ROW',
  CARD = 'CARD',
  TESTIMONIAL = 'TESTIMONIAL',
  FAQ = 'FAQ',
  CONTACT_FORM = 'CONTACT_FORM',
}

// Register enums for GraphQL
registerEnumType(PageStatus, {
  name: 'PageStatus',
  description: 'The status of a page',
});

registerEnumType(BlockType, {
  name: 'BlockType',
  description: 'The type of a page block',
});

@ObjectType()
export class PageBlock {
  @Field(() => ID)
  id: string;

  @Field(() => BlockType)
  type: BlockType;

  @Field(() => GraphQLJSONObject)
  content: any;

  @Field(() => GraphQLJSONObject, { nullable: true })
  style?: any;

  @Field(() => Int)
  order: number;

  @Field(() => Boolean)
  isVisible: boolean;

  @Field(() => String)
  pageId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class Page {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  slug: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  content?: any;

  @Field(() => PageStatus)
  status: PageStatus;

  @Field(() => String, { nullable: true })
  seoTitle?: string;

  @Field(() => String, { nullable: true })
  seoDescription?: string;

  @Field(() => String, { nullable: true })
  ogImage?: string;

  @Field(() => [PageBlock])
  blocks: PageBlock[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  publishedAt?: Date;

  @Field(() => String)
  createdBy: string;

  @Field(() => String, { nullable: true })
  updatedBy?: string;
}

@ObjectType()
export class PaginatedPages {
  @Field(() => [Page])
  data: Page[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}