import { ObjectType, Field, Int, Float, InputType, registerEnumType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

// Search result hit
@ObjectType()
export class OramaSearchHit {
  @Field()
  id: string;

  @Field(() => Float)
  score: number;

  @Field(() => GraphQLJSON)
  document: any;
}

// Elapsed time
@ObjectType()
export class OramaElapsed {
  @Field()
  formatted: string;
}

// Generic search result
@ObjectType()
export class OramaSearchResult {
  @Field(() => [OramaSearchHit])
  hits: OramaSearchHit[];

  @Field(() => Int)
  count: number;

  @Field(() => OramaElapsed)
  elapsed: OramaElapsed;

  @Field(() => GraphQLJSON, { nullable: true })
  facets?: any;
}

// Universal search result containing all entity types
@ObjectType()
export class UniversalSearchResult {
  @Field(() => OramaSearchResult)
  tasks: OramaSearchResult;

  @Field(() => OramaSearchResult)
  users: OramaSearchResult;

  @Field(() => OramaSearchResult)
  projects: OramaSearchResult;

  @Field(() => OramaSearchResult)
  affiliateCampaigns: OramaSearchResult;

  @Field(() => OramaSearchResult)
  affiliateLinks: OramaSearchResult;
}

// Sort order enum
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
  description: 'Sort order for search results',
});

// Sort input
@InputType()
export class OramaSortInput {
  @Field()
  property: string;

  @Field(() => SortOrder)
  order: SortOrder;
}

// Search query input
@InputType()
export class OramaSearchInput {
  @Field({ nullable: true })
  term?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  where?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  facets?: any;

  @Field(() => OramaSortInput, { nullable: true })
  sortBy?: OramaSortInput;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  limit?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number;
}

// Health check result
@ObjectType()
export class OramaHealthCheck {
  @Field()
  status: string;

  @Field(() => [String])
  indexes: string[];
}

// Reindex result
@ObjectType()
export class ReindexResult {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => Int, { nullable: true })
  totalIndexed?: number;
}
