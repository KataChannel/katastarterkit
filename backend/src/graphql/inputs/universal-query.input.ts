import { InputType, Field, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

/**
 * Universal Dynamic Query Input
 * Supports all Prisma query operations
 */
@InputType()
export class UniversalQueryInput {
  @Field(() => String)
  model: string;

  @Field(() => String)
  operation: string; // findMany, findUnique, findFirst, create, update, delete, count, aggregate

  @Field(() => GraphQLJSONObject, { nullable: true })
  where?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  data?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  select?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  include?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  orderBy?: Record<string, any>;

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => GraphQLJSONObject, { nullable: true })
  cursor?: Record<string, any>;

  @Field(() => [String], { nullable: true })
  distinct?: string[];
}

/**
 * Pagination Input
 */
@InputType()
export class PaginationQueryInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 20 })
  limit: number;

  @Field(() => String, { nullable: true })
  sortBy?: string;

  @Field(() => String, { defaultValue: 'desc' })
  sortOrder: string;
}

/**
 * Find Many Input with Pagination
 */
@InputType()
export class FindManyInput {
  @Field(() => String)
  model: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  where?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  select?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  include?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  orderBy?: Record<string, any>;

  @Field(() => PaginationQueryInput, { nullable: true })
  pagination?: PaginationQueryInput;
}

/**
 * Find Unique Input
 */
@InputType()
export class FindUniqueInput {
  @Field(() => String)
  model: string;

  @Field(() => GraphQLJSONObject)
  where: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  select?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  include?: Record<string, any>;
}

/**
 * Create Input
 */
@InputType()
export class CreateInput {
  @Field(() => String)
  model: string;

  @Field(() => GraphQLJSONObject)
  data: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  select?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  include?: Record<string, any>;
}

/**
 * Create Many Input
 */
@InputType()
export class CreateManyInput {
  @Field(() => String)
  model: string;

  @Field(() => [GraphQLJSONObject])
  data: Array<Record<string, any>>;

  @Field(() => Boolean, { defaultValue: false })
  skipDuplicates: boolean;
}

/**
 * Update Input
 */
@InputType()
export class UpdateInput {
  @Field(() => String)
  model: string;

  @Field(() => GraphQLJSONObject)
  where: Record<string, any>;

  @Field(() => GraphQLJSONObject)
  data: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  select?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  include?: Record<string, any>;
}

/**
 * Update Many Input
 */
@InputType()
export class UpdateManyInput {
  @Field(() => String)
  model: string;

  @Field(() => GraphQLJSONObject)
  where: Record<string, any>;

  @Field(() => GraphQLJSONObject)
  data: Record<string, any>;
}

/**
 * Upsert Input
 */
@InputType()
export class UpsertInput {
  @Field(() => String)
  model: string;

  @Field(() => GraphQLJSONObject)
  where: Record<string, any>;

  @Field(() => GraphQLJSONObject)
  create: Record<string, any>;

  @Field(() => GraphQLJSONObject)
  update: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  select?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  include?: Record<string, any>;
}

/**
 * Delete Input
 */
@InputType()
export class DeleteInput {
  @Field(() => String)
  model: string;

  @Field(() => GraphQLJSONObject)
  where: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  select?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  include?: Record<string, any>;
}

/**
 * Delete Many Input
 */
@InputType()
export class DeleteManyInput {
  @Field(() => String)
  model: string;

  @Field(() => GraphQLJSONObject)
  where: Record<string, any>;
}

/**
 * Count Input
 */
@InputType()
export class CountInput {
  @Field(() => String)
  model: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  where?: Record<string, any>;
}

/**
 * Aggregate Input
 */
@InputType()
export class AggregateInput {
  @Field(() => String)
  model: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  where?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  _count?: Record<string, boolean> | boolean;

  @Field(() => GraphQLJSONObject, { nullable: true })
  _sum?: Record<string, boolean>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  _avg?: Record<string, boolean>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  _min?: Record<string, boolean>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  _max?: Record<string, boolean>;
}

/**
 * Group By Input
 */
@InputType()
export class GroupByInput {
  @Field(() => String)
  model: string;

  @Field(() => [String])
  by: string[];

  @Field(() => GraphQLJSONObject, { nullable: true })
  where?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  having?: Record<string, any>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  orderBy?: Record<string, any>;

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => GraphQLJSONObject, { nullable: true })
  _count?: Record<string, boolean> | boolean;

  @Field(() => GraphQLJSONObject, { nullable: true })
  _sum?: Record<string, boolean>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  _avg?: Record<string, boolean>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  _min?: Record<string, boolean>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  _max?: Record<string, boolean>;
}

/**
 * Raw Query Input
 */
@InputType()
export class RawQueryInput {
  @Field(() => String)
  query: string;

  @Field(() => [GraphQLJSONObject], { nullable: true })
  params?: any[];
}
