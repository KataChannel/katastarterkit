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

// ==========================================
// NEW DTOs - Admin & Config
// ==========================================

@ObjectType()
export class RAGConfigOutput {
  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;

  @Field(() => String)
  valueType: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => Boolean)
  isSystem: boolean;

  @Field(() => Date)
  updatedAt: Date;
}

@InputType()
export class RAGConfigInput {
  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;

  @Field(() => String, { defaultValue: 'string' })
  valueType: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@ObjectType()
export class RAGUsageStatsOutput {
  @Field(() => Int)
  totalMessages: number;

  @Field(() => Int)
  totalConversations: number;

  @Field(() => String)
  intentBreakdown: string; // JSON string

  @Field(() => Float, { nullable: true })
  avgResponseTime?: number;

  @Field(() => Float, { nullable: true })
  avgConfidence?: number;
}

@ObjectType()
export class RAGConversationsOutput {
  @Field(() => String)
  conversationId: string;

  @Field(() => Date)
  lastMessage: Date;

  @Field(() => Int)
  messageCount: number;
}

@InputType()
export class AdminClearHistoryInput {
  @Field(() => Int, { nullable: true, description: 'Xóa tin nhắn cũ hơn số ngày này' })
  olderThanDays?: number;
}

@ObjectType()
export class AdminClearHistoryOutput {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => Int)
  deletedCount: number;
}
