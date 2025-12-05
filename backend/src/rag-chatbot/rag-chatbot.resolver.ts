/**
 * RAG Chatbot Resolver - GraphQL API
 * Với Authentication/Authorization và Rate Limiting
 */

import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserRoleType } from '@prisma/client';
import { RagChatbotService } from './services/rag-chatbot.service';
import { RagHistoryService } from './services/rag-history.service';
import { RagConfigService } from './services/rag-config.service';
import { RagAuthGuard, RagPublic, RagAdminOnly, RagRateLimitGuard } from './guards';
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
  // New DTOs
  RAGConfigOutput,
  RAGConfigInput,
  RAGUsageStatsOutput,
  RAGConversationsOutput,
  AdminClearHistoryInput,
  AdminClearHistoryOutput,
} from './dto';
import { ContextType } from './interfaces';

@Resolver()
@UseGuards(RagAuthGuard, RagRateLimitGuard)
export class RagChatbotResolver {
  constructor(
    private readonly ragService: RagChatbotService,
    private readonly ragHistoryService: RagHistoryService,
    private readonly ragConfigService: RagConfigService,
  ) {}

  // ==========================================
  // PUBLIC ENDPOINTS (No auth required)
  // ==========================================

  /**
   * Query RAG chatbot - Public access for chat widget
   */
  @RagPublic()
  @Query(() => RAGResponseOutput, { 
    name: 'ragChat',
    description: 'Gửi câu hỏi đến RAG Chatbot và nhận câu trả lời' 
  })
  async ragChat(
    @Args('input') input: RAGQueryInput,
    @Context() context: any,
  ): Promise<RAGResponseOutput> {
    const userId = context.req?.user?.id || undefined;
    
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
   * Tìm kiếm sản phẩm - Public
   */
  @RagPublic()
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
   * Lấy thống kê nhanh - Public
   */
  @RagPublic()
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
   * Kiểm tra trạng thái service - Public
   */
  @RagPublic()
  @Query(() => RAGStatusOutput, {
    name: 'ragStatus',
    description: 'Kiểm tra trạng thái RAG service'
  })
  async ragStatus(): Promise<RAGStatusOutput> {
    const isReady = this.ragService.isReady();
    const settings = this.ragConfigService.getSettings();
    
    return {
      isReady,
      message: isReady 
        ? 'RAG Chatbot đã sẵn sàng' 
        : 'RAG Chatbot chưa được cấu hình. Vui lòng kiểm tra GEMINI_API_KEY.',
      model: isReady ? settings.modelName : undefined,
    };
  }

  // ==========================================
  // AUTHENTICATED ENDPOINTS (Login required)
  // ==========================================

  /**
   * Lấy lịch sử hội thoại - Requires Auth
   */
  @Query(() => [ConversationMessageOutput], {
    name: 'ragConversationHistory',
    description: 'Lấy lịch sử hội thoại của user (yêu cầu đăng nhập)'
  })
  async ragConversationHistory(
    @Args('limit', { type: () => Number, nullable: true, defaultValue: 20 }) limit: number,
    @Args('conversationId', { type: () => String, nullable: true }) conversationId: string,
    @Context() context: any,
  ): Promise<ConversationMessageOutput[]> {
    const userId = context.req?.user?.id;
    if (!userId) {
      return [];
    }

    return this.ragHistoryService.getConversationHistory(userId, limit, conversationId);
  }

  /**
   * Lấy danh sách conversations - Requires Auth
   */
  @Query(() => [RAGConversationsOutput], {
    name: 'ragUserConversations',
    description: 'Lấy danh sách hội thoại của user'
  })
  async ragUserConversations(
    @Context() context: any,
  ): Promise<RAGConversationsOutput[]> {
    const userId = context.req?.user?.id;
    if (!userId) {
      return [];
    }

    const conversations = await this.ragHistoryService.getUserConversations(userId);
    return conversations.map(c => ({
      conversationId: c.conversationId,
      lastMessage: c.lastMessage,
      messageCount: c.messageCount,
    }));
  }

  /**
   * Xóa lịch sử hội thoại - Requires Auth
   */
  @Mutation(() => ClearHistoryOutput, {
    name: 'ragClearHistory',
    description: 'Xóa lịch sử hội thoại của user'
  })
  async ragClearHistory(
    @Args('conversationId', { type: () => String, nullable: true }) conversationId: string,
    @Context() context: any,
  ): Promise<ClearHistoryOutput> {
    const userId = context.req?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: 'Không thể xác định user. Vui lòng đăng nhập.',
      };
    }

    try {
      await this.ragHistoryService.clearConversationHistory(userId, conversationId);
      return {
        success: true,
        message: conversationId 
          ? `Đã xóa hội thoại ${conversationId}` 
          : 'Đã xóa toàn bộ lịch sử hội thoại',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể xóa lịch sử hội thoại',
      };
    }
  }

  // ==========================================
  // ADMIN ENDPOINTS (Admin role required)
  // ==========================================

  /**
   * Lấy metrics - Admin only
   */
  @RagAdminOnly()
  @Query(() => RAGMetricsOutput, {
    name: 'ragMetrics',
    description: 'Lấy metrics của RAG chatbot (Admin)'
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
   * Lấy usage stats - Admin only
   */
  @RagAdminOnly()
  @Query(() => RAGUsageStatsOutput, {
    name: 'ragUsageStats',
    description: 'Lấy thống kê sử dụng RAG (Admin)'
  })
  async ragUsageStats(
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<RAGUsageStatsOutput> {
    const stats = await this.ragHistoryService.getUsageStats(userId);
    
    return {
      totalMessages: stats.totalMessages,
      totalConversations: stats.totalConversations,
      intentBreakdown: JSON.stringify(stats.intentBreakdown),
      avgResponseTime: stats.avgResponseTime,
      avgConfidence: stats.avgConfidence,
    };
  }

  /**
   * Lấy cấu hình RAG - Admin only
   */
  @RagAdminOnly()
  @Query(() => [RAGConfigOutput], {
    name: 'ragConfigs',
    description: 'Lấy tất cả cấu hình RAG (Admin)'
  })
  async ragConfigs(): Promise<RAGConfigOutput[]> {
    const configs = await this.ragConfigService.getAllConfigs();
    
    return configs.map(c => ({
      key: c.key,
      value: typeof c.value === 'object' ? JSON.stringify(c.value) : String(c.value),
      valueType: c.valueType,
      description: c.description,
      category: c.category,
      isSystem: c.isSystem,
      updatedAt: c.updatedAt,
    }));
  }

  /**
   * Cập nhật cấu hình RAG - Admin only
   */
  @RagAdminOnly()
  @Mutation(() => ClearCacheOutput, {
    name: 'ragUpdateConfig',
    description: 'Cập nhật cấu hình RAG (Admin)'
  })
  async ragUpdateConfig(
    @Args('input') input: RAGConfigInput,
  ): Promise<ClearCacheOutput> {
    try {
      let parsedValue: any = input.value;
      
      // Parse value based on type
      if (input.valueType === 'number') {
        parsedValue = parseFloat(input.value);
      } else if (input.valueType === 'boolean') {
        parsedValue = input.value === 'true';
      } else if (input.valueType === 'json') {
        parsedValue = JSON.parse(input.value);
      }

      await this.ragConfigService.updateSetting(
        input.key as any,
        parsedValue,
        input.description,
      );

      return {
        success: true,
        message: `Đã cập nhật cấu hình: ${input.key}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Lỗi cập nhật cấu hình: ${error.message}`,
      };
    }
  }

  /**
   * Xóa cache context - Admin only
   */
  @RagAdminOnly()
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

  /**
   * Xóa tất cả lịch sử chat - Admin only
   */
  @RagAdminOnly()
  @Mutation(() => AdminClearHistoryOutput, {
    name: 'ragAdminClearHistory',
    description: 'Xóa lịch sử chat (Admin)'
  })
  async ragAdminClearHistory(
    @Args('input', { nullable: true }) input?: AdminClearHistoryInput,
  ): Promise<AdminClearHistoryOutput> {
    try {
      const deletedCount = await this.ragHistoryService.adminClearAllHistory(
        input?.olderThanDays,
      );
      
      return {
        success: true,
        message: input?.olderThanDays 
          ? `Đã xóa ${deletedCount} tin nhắn cũ hơn ${input.olderThanDays} ngày`
          : `Đã xóa ${deletedCount} tin nhắn`,
        deletedCount,
      };
    } catch (error) {
      return {
        success: false,
        message: `Lỗi xóa lịch sử: ${error.message}`,
        deletedCount: 0,
      };
    }
  }

  /**
   * Reset cấu hình về mặc định - Admin only
   */
  @RagAdminOnly()
  @Mutation(() => ClearCacheOutput, {
    name: 'ragResetConfig',
    description: 'Reset cấu hình về mặc định (Admin)'
  })
  async ragResetConfig(): Promise<ClearCacheOutput> {
    try {
      await this.ragConfigService.resetToDefaults();
      return {
        success: true,
        message: 'Đã reset cấu hình về mặc định',
      };
    } catch (error) {
      return {
        success: false,
        message: `Lỗi reset cấu hình: ${error.message}`,
      };
    }
  }

  /**
   * Seed default configs - Admin only
   */
  @RagAdminOnly()
  @Mutation(() => ClearCacheOutput, {
    name: 'ragSeedConfigs',
    description: 'Seed cấu hình mặc định vào database (Admin)'
  })
  async ragSeedConfigs(): Promise<ClearCacheOutput> {
    try {
      await this.ragConfigService.seedDefaultConfigs();
      return {
        success: true,
        message: 'Đã seed cấu hình mặc định',
      };
    } catch (error) {
      return {
        success: false,
        message: `Lỗi seed cấu hình: ${error.message}`,
      };
    }
  }
}
