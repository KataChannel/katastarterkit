/**
 * RAG Chatbot Service - Rausach Domain
 * Service chính điều phối RAG workflow
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RagContextService } from './rag-context.service';
import { RagIntentService } from './rag-intent.service';
import { RagGeminiService } from './rag-gemini.service';
import {
  RAGQuery,
  RAGResponse,
  Conversation,
  ConversationMessage,
  RAGMetrics,
} from '../interfaces';

@Injectable()
export class RagChatbotService {
  private readonly logger = new Logger(RagChatbotService.name);
  private metricsData: {
    totalQueries: number;
    totalResponseTime: number;
    successCount: number;
    intentCounts: Map<string, number>;
    contextTypeCounts: Map<string, number>;
  } = {
    totalQueries: 0,
    totalResponseTime: 0,
    successCount: 0,
    intentCounts: new Map(),
    contextTypeCounts: new Map(),
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly contextService: RagContextService,
    private readonly intentService: RagIntentService,
    private readonly geminiService: RagGeminiService,
  ) {}

  /**
   * Xử lý câu hỏi RAG
   */
  async processQuery(query: RAGQuery): Promise<RAGResponse> {
    const startTime = Date.now();
    this.logger.log(`Processing RAG query: ${query.message.substring(0, 100)}...`);

    try {
      // 1. Phân tích intent từ câu hỏi
      const intent = this.intentService.analyzeQuery(query.message);
      this.logger.debug(`Detected intent: ${intent.intent} (confidence: ${intent.confidence})`);

      // 2. Lấy context types cần thiết
      const contextTypes = query.contextTypes || intent.contextTypes;

      // 3. Fetch context data từ database
      const context = await this.contextService.getContext(contextTypes);

      // 4. Bổ sung statistics nếu cần
      if (intent.intent === 'query_statistics' || contextTypes.includes('all')) {
        const stats = await this.contextService.getStatistics();
        (context as any).statistics = stats;
      }

      // 5. Generate response từ Gemini
      const response = await this.geminiService.generateRAGResponse(
        query.message,
        intent,
        context,
      );

      // 6. Lưu conversation nếu có userId
      if (query.userId) {
        await this.saveConversationMessage(
          query.userId,
          query.conversationId || null,
          query.message,
          response.answer,
          intent,
        );
      }

      // 7. Update metrics
      const responseTime = Date.now() - startTime;
      this.updateMetrics(intent.intent, contextTypes, responseTime, true);

      this.logger.log(`RAG query processed in ${responseTime}ms`);
      return response;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateMetrics('unknown', [], responseTime, false);
      
      this.logger.error('Error processing RAG query', error);
      
      return {
        answer: 'Xin lỗi, đã có lỗi xảy ra khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.',
        sources: [],
        contextUsed: [],
        confidence: 0,
        suggestedQueries: [
          'Thống kê tổng quan',
          'Danh sách sản phẩm',
          'Đơn hàng gần đây',
        ],
      };
    }
  }

  /**
   * Tìm kiếm sản phẩm bằng từ khóa
   */
  async searchProducts(keyword: string): Promise<RAGResponse> {
    try {
      const products = await this.contextService.searchSanpham(keyword);
      
      if (products.length === 0) {
        return {
          answer: `Không tìm thấy sản phẩm nào với từ khóa "${keyword}".`,
          sources: [],
          contextUsed: ['sanpham'],
          confidence: 0.9,
          suggestedQueries: [
            'Danh sách tất cả sản phẩm',
            'Sản phẩm đang hoạt động',
          ],
        };
      }

      const productList = products
        .map((p) => `• **${p.title}** (${p.masp}) - Giá: ${p.giaban.toLocaleString('vi-VN')}đ`)
        .join('\n');

      return {
        answer: `Tìm thấy **${products.length}** sản phẩm với từ khóa "${keyword}":\n\n${productList}`,
        sources: [{
          type: 'sanpham',
          entity: `${products.length} sản phẩm`,
          relevance: 0.95,
          data: products,
        }],
        contextUsed: ['sanpham'],
        confidence: 0.95,
      };
    } catch (error) {
      this.logger.error('Error searching products', error);
      throw error;
    }
  }

  /**
   * Lấy thống kê nhanh
   */
  async getQuickStats(): Promise<RAGResponse> {
    try {
      const stats = await this.contextService.getStatistics();
      
      const statusLabels: Record<string, string> = {
        'dadat': 'Đã đặt',
        'dagiao': 'Đã giao', 
        'danhan': 'Đã nhận',
        'huy': 'Hủy',
        'hoanthanh': 'Hoàn thành',
      };

      const statusSummary = stats.donhangStatus
        .map((s) => `• ${statusLabels[s.status] || s.status}: ${s.count} đơn`)
        .join('\n');

      const answer = `## 📊 Thống kê tổng quan

### Tổng quan
• **Sản phẩm**: ${stats.totalSanpham.toLocaleString('vi-VN')} sản phẩm
• **Đơn hàng**: ${stats.totalDonhang.toLocaleString('vi-VN')} đơn
• **Khách hàng**: ${stats.totalKhachhang.toLocaleString('vi-VN')} khách
• **Nhà cung cấp**: ${stats.totalNhacungcap.toLocaleString('vi-VN')} NCC

### Doanh thu hoàn thành
💰 **${stats.doanhThu.toLocaleString('vi-VN')}đ**

### Trạng thái đơn hàng
${statusSummary}`;

      return {
        answer,
        sources: [{
          type: 'all',
          entity: 'Thống kê hệ thống',
          relevance: 1,
          data: stats,
        }],
        contextUsed: ['all'],
        confidence: 0.98,
        suggestedQueries: [
          'Chi tiết doanh thu theo tháng',
          'Sản phẩm bán chạy nhất',
          'Khách hàng tiềm năng',
        ],
      };
    } catch (error) {
      this.logger.error('Error getting quick stats', error);
      throw error;
    }
  }

  /**
   * Lấy lịch sử hội thoại của user
   */
  async getConversationHistory(userId: string, limit: number = 20): Promise<ConversationMessage[]> {
    try {
      const history = await this.prisma.chatAIHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return history.map((h) => ({
        id: h.id,
        role: h.sender === 'user' ? 'user' : 'assistant',
        content: h.message,
        timestamp: h.createdAt,
      })) as ConversationMessage[];
    } catch (error) {
      this.logger.error('Error fetching conversation history', error);
      return [];
    }
  }

  /**
   * Xóa lịch sử hội thoại của user
   */
  async clearConversationHistory(userId: string): Promise<void> {
    try {
      await this.prisma.chatAIHistory.deleteMany({
        where: { userId },
      });
      this.logger.log(`Cleared conversation history for user: ${userId}`);
    } catch (error) {
      this.logger.error('Error clearing conversation history', error);
      throw error;
    }
  }

  /**
   * Lấy metrics
   */
  getMetrics(): RAGMetrics {
    const avgResponseTime = this.metricsData.totalQueries > 0
      ? this.metricsData.totalResponseTime / this.metricsData.totalQueries
      : 0;

    const successRate = this.metricsData.totalQueries > 0
      ? (this.metricsData.successCount / this.metricsData.totalQueries) * 100
      : 0;

    const topIntents = Array.from(this.metricsData.intentCounts.entries())
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topContextTypes = Array.from(this.metricsData.contextTypeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalQueries: this.metricsData.totalQueries,
      avgResponseTime,
      successRate,
      topIntents,
      topContextTypes,
    };
  }

  /**
   * Xóa cache context
   */
  clearContextCache(): void {
    this.contextService.clearCache();
  }

  /**
   * Kiểm tra service có sẵn sàng không
   */
  isReady(): boolean {
    return this.geminiService.isReady();
  }

  /**
   * Lưu message vào lịch sử
   */
  private async saveConversationMessage(
    userId: string,
    conversationId: string | null,
    userMessage: string,
    assistantMessage: string,
    intent: any,
  ): Promise<void> {
    try {
      // Lưu tin nhắn user
      await this.prisma.chatAIHistory.create({
        data: {
          userId,
          message: userMessage,
          sender: 'user',
        },
      });

      // Lưu tin nhắn assistant
      await this.prisma.chatAIHistory.create({
        data: {
          userId,
          message: assistantMessage,
          sender: 'assistant',
        },
      });
    } catch (error) {
      this.logger.warn('Failed to save conversation message', error);
    }
  }

  /**
   * Update metrics
   */
  private updateMetrics(
    intent: string,
    contextTypes: string[],
    responseTime: number,
    success: boolean,
  ): void {
    this.metricsData.totalQueries++;
    this.metricsData.totalResponseTime += responseTime;
    
    if (success) {
      this.metricsData.successCount++;
    }

    // Update intent counts
    const currentIntentCount = this.metricsData.intentCounts.get(intent) || 0;
    this.metricsData.intentCounts.set(intent, currentIntentCount + 1);

    // Update context type counts
    for (const type of contextTypes) {
      const currentCount = this.metricsData.contextTypeCounts.get(type) || 0;
      this.metricsData.contextTypeCounts.set(type, currentCount + 1);
    }
  }
}
