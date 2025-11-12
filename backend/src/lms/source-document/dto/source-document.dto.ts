import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { SourceDocumentType, SourceDocumentStatus } from '@prisma/client';
import GraphQLJSON from 'graphql-type-json';

// ============== Category DTOs ==============

@InputType()
export class CreateSourceDocumentCategoryInput {
  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => ID, { nullable: true })
  parentId?: string;
}

@InputType()
export class UpdateSourceDocumentCategoryInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => ID, { nullable: true })
  parentId?: string;
}

// ============== Source Document DTOs ==============

@InputType()
export class CreateSourceDocumentInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => SourceDocumentType)
  type: SourceDocumentType;

  @Field(() => SourceDocumentStatus, { defaultValue: SourceDocumentStatus.DRAFT })
  status: SourceDocumentStatus;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  fileName?: string;

  @Field(() => Int, { nullable: true })
  fileSize?: number;

  @Field({ nullable: true })
  mimeType?: string;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field(() => ID, { nullable: true })
  categoryId?: string;

  @Field(() => [String], { defaultValue: [] })
  tags: string[];

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: any;
}

@InputType()
export class UpdateSourceDocumentInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => SourceDocumentType, { nullable: true })
  type?: SourceDocumentType;

  @Field(() => SourceDocumentStatus, { nullable: true })
  status?: SourceDocumentStatus;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  fileName?: string;

  @Field(() => Int, { nullable: true })
  fileSize?: number;

  @Field({ nullable: true })
  mimeType?: string;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field(() => ID, { nullable: true })
  categoryId?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: any;
}

@InputType()
export class SourceDocumentFilterInput {
  @Field(() => [SourceDocumentType], { nullable: true })
  types?: SourceDocumentType[];

  @Field(() => [SourceDocumentStatus], { nullable: true })
  statuses?: SourceDocumentStatus[];

  @Field(() => ID, { nullable: true })
  categoryId?: string;

  @Field(() => ID, { nullable: true })
  userId?: string;

  @Field({ nullable: true })
  search?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  isAiAnalyzed?: boolean;
}

// ============== Course Link DTOs ==============

@InputType()
export class LinkDocumentToCourseInput {
  @Field(() => ID)
  courseId: string;

  @Field(() => ID)
  documentId: string;

  @Field(() => Int, { nullable: true })
  order?: number;

  @Field({ defaultValue: false })
  isRequired: boolean;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateCourseDocumentLinkInput {
  @Field(() => Int, { nullable: true })
  order?: number;

  @Field({ nullable: true })
  isRequired?: boolean;

  @Field({ nullable: true })
  description?: string;
}
