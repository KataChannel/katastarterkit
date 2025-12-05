/**
 * RAG Chatbot Controller - REST API
 */

import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RagChatbotService } from './services/rag-chatbot.service';
import { ContextType } from './interfaces';

interface ChatRequest {
  message: string;
  conversationId?: string;
  contextTypes?: string[];
}

interface SearchRequest {
  keyword: string;
}

@Controller('api/rag')
export class RagChatbotController {
  constructor(private readonly ragService: RagChatbotService) {}

  /**
   * POST /api/rag/chat - Gửi tin nhắn đến chatbot
   */
  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Body() body: ChatRequest, @Req() req: any) {
    const userId = req.user?.id || 'anonymous';
    
    const response = await this.ragService.processQuery({
      message: body.message,
      userId,
      conversationId: body.conversationId,
      contextTypes: body.contextTypes as ContextType[],
    });

    return {
      success: true,
      data: response,
    };
  }

  /**
   * GET /api/rag/search - Tìm kiếm sản phẩm
   */
  @Get('search')
  async search(@Query('keyword') keyword: string) {
    if (!keyword) {
      return {
        success: false,
        message: 'Vui lòng nhập từ khóa tìm kiếm',
      };
    }

    const response = await this.ragService.searchProducts(keyword);
    
    return {
      success: true,
      data: response,
    };
  }

  /**
   * GET /api/rag/stats - Lấy thống kê nhanh
   */
  @Get('stats')
  async stats() {
    const response = await this.ragService.getQuickStats();
    
    return {
      success: true,
      data: response,
    };
  }

  /**
   * GET /api/rag/history - Lấy lịch sử hội thoại
   */
  @Get('history')
  async history(
    @Query('limit') limit: string = '20',
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return {
        success: false,
        message: 'Không thể xác định user',
        data: [],
      };
    }

    const history = await this.ragService.getConversationHistory(
      userId,
      parseInt(limit, 10),
    );

    return {
      success: true,
      data: history,
    };
  }

  /**
   * DELETE /api/rag/history - Xóa lịch sử hội thoại
   */
  @Delete('history')
  async clearHistory(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      return {
        success: false,
        message: 'Không thể xác định user',
      };
    }

    await this.ragService.clearConversationHistory(userId);

    return {
      success: true,
      message: 'Đã xóa lịch sử hội thoại',
    };
  }

  /**
   * GET /api/rag/metrics - Lấy metrics
   */
  @Get('metrics')
  async metrics() {
    const metrics = this.ragService.getMetrics();
    
    return {
      success: true,
      data: metrics,
    };
  }

  /**
   * GET /api/rag/status - Kiểm tra trạng thái
   */
  @Get('status')
  async status() {
    const isReady = this.ragService.isReady();
    
    return {
      success: true,
      data: {
        isReady,
        message: isReady 
          ? 'RAG Chatbot đã sẵn sàng' 
          : 'RAG Chatbot chưa được cấu hình',
        model: isReady ? 'gemini-2.0-flash' : null,
      },
    };
  }

  /**
   * DELETE /api/rag/cache - Xóa cache (Admin)
   */
  @Delete('cache')
  async clearCache() {
    this.ragService.clearContextCache();
    
    return {
      success: true,
      message: 'Đã xóa cache context',
    };
  }
}
