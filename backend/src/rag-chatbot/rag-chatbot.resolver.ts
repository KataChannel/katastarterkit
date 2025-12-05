/**
 * RAG Chatbot Resolver - GraphQL API
 */

import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RagChatbotService } from './services/rag-chatbot.service';
import {
  RAGQueryInput,
  RAGResponseOutput,
  RAGSourceOutput,
  ConversationMessageOutput,
  RAGMetricsOutput,
  RAGStatusOutput,
  ClearHistoryOutput,
  ClearCacheOutput,
  SearchProductsInput,
  ContextTypeEnum,
} from './dto';
import { ContextType } from './interfaces';

@Resolver()
export class RagChatbotResolver {
  constructor(private readonly ragService: RagChatbotService) {}

  /**
   * Query RAG chatbot - Public access for chat widget
   */
  @Query(() => RAGResponseOutput, { 
    name: 'ragChat',
    description: 'Gửi câu hỏi đến RAG Chatbot và nhận câu trả lời' 
  })
  async ragChat(
    @Args('input') input: RAGQueryInput,
    @Context() context: any,
  ): Promise<RAGResponseOutput> {
    const userId = context.req?.user?.id || 'anonymous';
    
    const contextTypes: ContextType[] = input.contextTypes?.map(
      ct => ct as unknown as ContextType
    ) || undefined;

    const response = await this.ragService.processQuery({
      message: input.message,
      userId,
      conversationId: input.conversationId,
      contextTypes,
    });

    return {
      answer: response.answer,
      sources: response.sources.map(s => ({
        type: s.type,
        entity: s.entity,
        relevance: s.relevance,
      })),
      contextUsed: response.contextUsed as string[],
      confidence: response.confidence,
      suggestedQueries: response.suggestedQueries,
    };
  }

  /**
   * Tìm kiếm sản phẩm
   */
  @Query(() => RAGResponseOutput, {
    name: 'ragSearchProducts',
    description: 'Tìm kiếm sản phẩm bằng từ khóa'
  })
  async ragSearchProducts(
    @Args('input') input: SearchProductsInput,
  ): Promise<RAGResponseOutput> {
    const response = await this.ragService.searchProducts(input.keyword);
    
    return {
      answer: response.answer,
      sources: response.sources.map(s => ({
        type: s.type,
        entity: s.entity,
        relevance: s.relevance,
      })),
      contextUsed: response.contextUsed as string[],
      confidence: response.confidence,
      suggestedQueries: response.suggestedQueries,
    };
  }

  /**
   * Lấy thống kê nhanh
   */
  @Query(() => RAGResponseOutput, {
    name: 'ragQuickStats',
    description: 'Lấy thống kê nhanh hệ thống'
  })
  async ragQuickStats(): Promise<RAGResponseOutput> {
    const response = await this.ragService.getQuickStats();
    
    return {
      answer: response.answer,
      sources: response.sources.map(s => ({
        type: s.type,
        entity: s.entity,
        relevance: s.relevance,
      })),
      contextUsed: response.contextUsed as string[],
      confidence: response.confidence,
      suggestedQueries: response.suggestedQueries,
    };
  }

  /**
   * Lấy lịch sử hội thoại
   */
  @Query(() => [ConversationMessageOutput], {
    name: 'ragConversationHistory',
    description: 'Lấy lịch sử hội thoại của user'
  })
  async ragConversationHistory(
    @Args('limit', { type: () => Number, nullable: true, defaultValue: 20 }) limit: number,
    @Context() context: any,
  ): Promise<ConversationMessageOutput[]> {
    const userId = context.req?.user?.id;
    if (!userId) {
      return [];
    }

    return this.ragService.getConversationHistory(userId, limit);
  }

  /**
   * Lấy metrics
   */
  @Query(() => RAGMetricsOutput, {
    name: 'ragMetrics',
    description: 'Lấy metrics của RAG chatbot'
  })
  async ragMetrics(): Promise<RAGMetricsOutput> {
    const metrics = this.ragService.getMetrics();
    
    return {
      totalQueries: metrics.totalQueries,
      avgResponseTime: metrics.avgResponseTime,
      successRate: metrics.successRate,
      topIntents: metrics.topIntents,
      topContextTypes: metrics.topContextTypes,
    };
  }

  /**
   * Kiểm tra trạng thái service
   */
  @Query(() => RAGStatusOutput, {
    name: 'ragStatus',
    description: 'Kiểm tra trạng thái RAG service'
  })
  async ragStatus(): Promise<RAGStatusOutput> {
    const isReady = this.ragService.isReady();
    
    return {
      isReady,
      message: isReady 
        ? 'RAG Chatbot đã sẵn sàng' 
        : 'RAG Chatbot chưa được cấu hình. Vui lòng kiểm tra GEMINI_API_KEY.',
      model: isReady ? 'gemini-2.0-flash' : undefined,
    };
  }

  /**
   * Xóa lịch sử hội thoại
   */
  @Mutation(() => ClearHistoryOutput, {
    name: 'ragClearHistory',
    description: 'Xóa lịch sử hội thoại của user'
  })
  async ragClearHistory(
    @Context() context: any,
  ): Promise<ClearHistoryOutput> {
    const userId = context.req?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: 'Không thể xác định user',
      };
    }

    try {
      await this.ragService.clearConversationHistory(userId);
      return {
        success: true,
        message: 'Đã xóa lịch sử hội thoại',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể xóa lịch sử hội thoại',
      };
    }
  }

  /**
   * Xóa cache context (Admin only)
   */
  @Mutation(() => ClearCacheOutput, {
    name: 'ragClearCache',
    description: 'Xóa cache context (Admin)'
  })
  async ragClearCache(): Promise<ClearCacheOutput> {
    try {
      this.ragService.clearContextCache();
      return {
        success: true,
        message: 'Đã xóa cache context',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể xóa cache',
      };
    }
  }
}
