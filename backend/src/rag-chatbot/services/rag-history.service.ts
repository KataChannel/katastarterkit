/**
 * RAG History Service - Persistent storage for chat history
 * Lưu trữ lịch sử hội thoại vào database thay vì in-memory
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RAGIntentType } from '@prisma/client';
import { ConversationMessage, RAGResponse, QueryIntent } from '../interfaces';

interface SaveMessageParams {
  userId?: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  message: string;
  answer?: string;
  intent?: QueryIntent;
  contextTypes?: string[];
  contextUsed?: any;
  sources?: any[];
  confidence?: number;
  tokensUsed?: number;
  responseTime?: number;
  suggestedQueries?: string[];
}

@Injectable()
export class RagHistoryService {
  private readonly logger = new Logger(RagHistoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Map QueryIntent to RAGIntentType enum
   */
  private mapIntentToEnum(intent?: QueryIntent): RAGIntentType {
    if (!intent) return RAGIntentType.GENERAL;

    const primaryIntent = intent.intent;
    const intentMap: Record<string, RAGIntentType> = {
      'query_product': RAGIntentType.QUERY_SANPHAM,
      'query_order': RAGIntentType.QUERY_DONHANG,
      'query_customer': RAGIntentType.QUERY_KHACHHANG,
      'query_inventory': RAGIntentType.QUERY_TONKHO,
      'query_supplier': RAGIntentType.QUERY_NHACUNGCAP,
      'query_statistics': RAGIntentType.QUERY_THONGKE,
      'query_price': RAGIntentType.QUERY_BANGGIA,
      'query_general': RAGIntentType.GENERAL,
    };

    return intentMap[primaryIntent] || RAGIntentType.UNKNOWN;
  }

  /**
   * Lưu tin nhắn vào database
   */
  async saveMessage(params: SaveMessageParams): Promise<void> {
    try {
      await this.prisma.rAGChatHistory.create({
        data: {
          conversationId: params.conversationId,
          userId: params.userId || null,
          role: params.role,
          message: params.message,
          answer: params.answer || null,
          intent: this.mapIntentToEnum(params.intent),
          contextTypes: params.contextTypes || [],
          contextUsed: params.contextUsed ? JSON.parse(JSON.stringify(params.contextUsed)) : null,
          sources: params.sources ? JSON.parse(JSON.stringify(params.sources)) : null,
          confidence: params.confidence || null,
          tokensUsed: params.tokensUsed || null,
          responseTime: params.responseTime || null,
          suggestedQueries: params.suggestedQueries || [],
        },
      });

      this.logger.debug(`Message saved for user ${params.userId || 'anonymous'}, conversation ${params.conversationId}`);
    } catch (error) {
      this.logger.error(`Failed to save message: ${error.message}`, error.stack);
      // Không throw error để không ảnh hưởng đến flow chính
    }
  }

  /**
   * Lưu cả cặp user message và assistant response
   */
  async saveConversationTurn(
    userId: string | undefined,
    conversationId: string,
    userMessage: string,
    response: RAGResponse,
    responseTime: number,
  ): Promise<void> {
    try {
      // Save user message
      await this.saveMessage({
        userId,
        conversationId,
        role: 'user',
        message: userMessage,
      });

      // Save assistant response
      await this.saveMessage({
        userId,
        conversationId,
        role: 'assistant',
        message: userMessage,
        answer: response.answer,
        contextTypes: response.contextUsed as string[],
        sources: response.sources,
        confidence: response.confidence,
        tokensUsed: response.tokensUsed,
        responseTime,
        suggestedQueries: response.suggestedQueries,
      });
    } catch (error) {
      this.logger.error(`Failed to save conversation turn: ${error.message}`);
    }
  }

  /**
   * Lấy lịch sử hội thoại của user
   */
  async getConversationHistory(
    userId: string,
    limit: number = 20,
    conversationId?: string,
  ): Promise<ConversationMessage[]> {
    try {
      const whereClause: any = {
        userId,
        role: { in: ['user', 'assistant'] },
      };

      if (conversationId) {
        whereClause.conversationId = conversationId;
      }

      const messages = await this.prisma.rAGChatHistory.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          role: true,
          message: true,
          answer: true,
          createdAt: true,
          conversationId: true,
        },
      });

      // Transform and reverse to get chronological order
      return messages.reverse().map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.role === 'assistant' ? (msg.answer || msg.message) : msg.message,
        timestamp: msg.createdAt,
      }));
    } catch (error) {
      this.logger.error(`Failed to get conversation history: ${error.message}`);
      return [];
    }
  }

  /**
   * Lấy recent messages cho context (để gửi cho AI)
   */
  async getRecentMessages(
    userId: string,
    conversationId: string,
    limit: number = 10,
  ): Promise<ConversationMessage[]> {
    try {
      const messages = await this.prisma.rAGChatHistory.findMany({
        where: {
          userId,
          conversationId,
          role: { in: ['user', 'assistant'] },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          role: true,
          message: true,
          answer: true,
          createdAt: true,
        },
      });

      return messages.reverse().map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.role === 'assistant' ? (msg.answer || msg.message) : msg.message,
        timestamp: msg.createdAt,
      }));
    } catch (error) {
      this.logger.error(`Failed to get recent messages: ${error.message}`);
      return [];
    }
  }

  /**
   * Xóa lịch sử hội thoại của user
   */
  async clearConversationHistory(userId: string, conversationId?: string): Promise<void> {
    try {
      const whereClause: any = { userId };
      if (conversationId) {
        whereClause.conversationId = conversationId;
      }

      await this.prisma.rAGChatHistory.deleteMany({
        where: whereClause,
      });

      this.logger.log(`Cleared conversation history for user ${userId}${conversationId ? `, conversation ${conversationId}` : ''}`);
    } catch (error) {
      this.logger.error(`Failed to clear conversation history: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lấy tất cả conversations của user
   */
  async getUserConversations(userId: string): Promise<{ conversationId: string; lastMessage: Date; messageCount: number }[]> {
    try {
      const conversations = await this.prisma.rAGChatHistory.groupBy({
        by: ['conversationId'],
        where: { userId },
        _count: { id: true },
        _max: { createdAt: true },
        orderBy: { _max: { createdAt: 'desc' } },
      });

      return conversations.map((conv) => ({
        conversationId: conv.conversationId,
        lastMessage: conv._max.createdAt!,
        messageCount: conv._count.id,
      }));
    } catch (error) {
      this.logger.error(`Failed to get user conversations: ${error.message}`);
      return [];
    }
  }

  /**
   * Lấy thống kê sử dụng
   */
  async getUsageStats(userId?: string): Promise<{
    totalMessages: number;
    totalConversations: number;
    intentBreakdown: Record<string, number>;
    avgResponseTime: number | null;
    avgConfidence: number | null;
  }> {
    try {
      const whereClause = userId ? { userId } : {};

      const [totalMessages, conversations, intentStats, metrics] = await Promise.all([
        this.prisma.rAGChatHistory.count({ where: whereClause }),
        this.prisma.rAGChatHistory.groupBy({
          by: ['conversationId'],
          where: whereClause,
        }),
        this.prisma.rAGChatHistory.groupBy({
          by: ['intent'],
          where: { ...whereClause, role: 'assistant' },
          _count: { id: true },
        }),
        this.prisma.rAGChatHistory.aggregate({
          where: { ...whereClause, role: 'assistant' },
          _avg: { responseTime: true, confidence: true },
        }),
      ]);

      const intentBreakdown: Record<string, number> = {};
      intentStats.forEach((stat) => {
        intentBreakdown[stat.intent] = stat._count.id;
      });

      return {
        totalMessages,
        totalConversations: conversations.length,
        intentBreakdown,
        avgResponseTime: metrics._avg.responseTime,
        avgConfidence: metrics._avg.confidence,
      };
    } catch (error) {
      this.logger.error(`Failed to get usage stats: ${error.message}`);
      return {
        totalMessages: 0,
        totalConversations: 0,
        intentBreakdown: {},
        avgResponseTime: null,
        avgConfidence: null,
      };
    }
  }

  /**
   * Admin: Xóa tất cả lịch sử (cleanup)
   */
  async adminClearAllHistory(olderThanDays?: number): Promise<number> {
    try {
      const whereClause: any = {};
      
      if (olderThanDays) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
        whereClause.createdAt = { lt: cutoffDate };
      }

      const result = await this.prisma.rAGChatHistory.deleteMany({
        where: whereClause,
      });

      this.logger.log(`Admin cleared ${result.count} history records${olderThanDays ? ` older than ${olderThanDays} days` : ''}`);
      return result.count;
    } catch (error) {
      this.logger.error(`Failed to admin clear history: ${error.message}`);
      throw error;
    }
  }
}
