/**
 * RAG Chatbot DTOs - GraphQL Input/Output Types
 */

import { Field, InputType, ObjectType, Float, Int, registerEnumType } from '@nestjs/graphql';

// Enums
export enum ContextTypeEnum {
  SANPHAM = 'sanpham',
  DONHANG = 'donhang',
  KHACHHANG = 'khachhang',
  NHACUNGCAP = 'nhacungcap',
  TONKHO = 'tonkho',
  BANGGIA = 'banggia',
  KHO = 'kho',
  ALL = 'all',
}

registerEnumType(ContextTypeEnum, {
  name: 'ContextTypeEnum',
  description: 'Loại context để truy vấn RAG',
});

// Input Types
@InputType()
export class RAGQueryInput {
  @Field(() => String)
  message: string;

  @Field(() => String, { nullable: true })
  conversationId?: string;

  @Field(() => [ContextTypeEnum], { nullable: true })
  contextTypes?: ContextTypeEnum[];
}

@InputType()
export class SearchProductsInput {
  @Field(() => String)
  keyword: string;
}

// Output Types
@ObjectType()
export class RAGSourceOutput {
  @Field(() => String)
  type: string;

  @Field(() => String)
  entity: string;

  @Field(() => Float)
  relevance: number;
}

@ObjectType()
export class RAGResponseOutput {
  @Field(() => String)
  answer: string;

  @Field(() => [RAGSourceOutput])
  sources: RAGSourceOutput[];

  @Field(() => [String])
  contextUsed: string[];

  @Field(() => Float)
  confidence: number;

  @Field(() => [String], { nullable: true })
  suggestedQueries?: string[];
}

@ObjectType()
export class ConversationMessageOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  role: string;

  @Field(() => String)
  content: string;

  @Field(() => Date)
  timestamp: Date;
}

@ObjectType()
export class RAGMetricsOutput {
  @Field(() => Int)
  totalQueries: number;

  @Field(() => Float)
  avgResponseTime: number;

  @Field(() => Float)
  successRate: number;

  @Field(() => [IntentCountOutput])
  topIntents: IntentCountOutput[];

  @Field(() => [ContextTypeCountOutput])
  topContextTypes: ContextTypeCountOutput[];
}

@ObjectType()
export class IntentCountOutput {
  @Field(() => String)
  intent: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class ContextTypeCountOutput {
  @Field(() => String)
  type: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class RAGStatusOutput {
  @Field(() => Boolean)
  isReady: boolean;

  @Field(() => String)
  message: string;

  @Field(() => String, { nullable: true })
  model?: string;
}

@ObjectType()
export class ClearHistoryOutput {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}

@ObjectType()
export class ClearCacheOutput {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}
