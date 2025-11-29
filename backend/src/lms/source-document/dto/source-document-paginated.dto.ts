import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SourceDocument } from '../entities/source-document.entity';

@ObjectType()
export class SourceDocumentPaginatedResult {
  @Field(() => [SourceDocument])
  items: SourceDocument[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}
