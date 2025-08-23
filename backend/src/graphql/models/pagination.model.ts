import { ObjectType, Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  limit: number = 10;

  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  sortOrder?: string;
}

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPrevPage: boolean;
}

export function createPaginatedType<T>(classRef: any) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef])
    items: T[];

    @Field(() => PaginationMeta)
    meta: PaginationMeta;
  }
  return PaginatedType;
}
