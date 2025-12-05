/**
 * RAG Chatbot Controller - REST API
 * Với Authentication/Authorization và Rate Limiting
 */

import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RagChatbotService } from './services/rag-chatbot.service';
import { RagHistoryService } from './services/rag-history.service';
import { RagConfigService, RAGSettings } from './services/rag-config.service';
import { RagAuthGuard, RagPublic, RagAdminOnly, RagRateLimitGuard } from './guards';
import { ContextType } from './interfaces';

interface ChatRequest {
  message: string;
  conversationId?: string;
  contextTypes?: string[];
}

interface SearchRequest {
  keyword: string;
}

interface UpdateConfigRequest {
  key: string;
  value: any;
  description?: string;
}

@Controller('api/rag')
@UseGuards(RagAuthGuard, RagRateLimitGuard)
export class RagChatbotController {
  constructor(
    private readonly ragService: RagChatbotService,
    private readonly ragHistoryService: RagHistoryService,
    private readonly ragConfigService: RagConfigService,
  ) {}

  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================

  /**
   * POST /api/rag/chat - Gửi tin nhắn đến chatbot
   */
  @RagPublic()
  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Body() body: ChatRequest, @Req() req: any) {
    const userId = req.user?.id || undefined;
    
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
  @RagPublic()
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
  @RagPublic()
  @Get('stats')
  async stats() {
    const response = await this.ragService.getQuickStats();
    
    return {
      success: true,
      data: response,
    };
  }

  /**
   * GET /api/rag/status - Kiểm tra trạng thái
   */
  @RagPublic()
  @Get('status')
  async status() {
    const isReady = this.ragService.isReady();
    const settings = this.ragConfigService.getSettings();
    
    return {
      success: true,
      data: {
        isReady,
        message: isReady 
          ? 'RAG Chatbot đã sẵn sàng' 
          : 'RAG Chatbot chưa được cấu hình',
        model: isReady ? settings.modelName : null,
      },
    };
  }

  // ==========================================
  // AUTHENTICATED ENDPOINTS
  // ==========================================

  /**
   * GET /api/rag/history - Lấy lịch sử hội thoại
   */
  @Get('history')
  async history(
    @Req() req: any,
    @Query('limit') limit: string = '20',
    @Query('conversationId') conversationId?: string,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return {
        success: false,
        message: 'Vui lòng đăng nhập để xem lịch sử',
        data: [],
      };
    }

    const history = await this.ragHistoryService.getConversationHistory(
      userId,
      parseInt(limit, 10),
      conversationId,
    );

    return {
      success: true,
      data: history,
    };
  }

  /**
   * GET /api/rag/conversations - Lấy danh sách conversations
   */
  @Get('conversations')
  async conversations(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      return {
        success: false,
        message: 'Vui lòng đăng nhập',
        data: [],
      };
    }

    const conversations = await this.ragHistoryService.getUserConversations(userId);

    return {
      success: true,
      data: conversations,
    };
  }

  /**
   * DELETE /api/rag/history - Xóa lịch sử hội thoại
   */
  @Delete('history')
  async clearHistory(
    @Query('conversationId') conversationId?: string,
    @Req() req?: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return {
        success: false,
        message: 'Vui lòng đăng nhập để xóa lịch sử',
      };
    }

    await this.ragHistoryService.clearConversationHistory(userId, conversationId);

    return {
      success: true,
      message: conversationId 
        ? `Đã xóa hội thoại ${conversationId}` 
        : 'Đã xóa toàn bộ lịch sử hội thoại',
    };
  }

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================

  /**
   * GET /api/rag/metrics - Lấy metrics (Admin)
   */
  @RagAdminOnly()
  @Get('metrics')
  async metrics() {
    const metrics = this.ragService.getMetrics();
    
    return {
      success: true,
      data: metrics,
    };
  }

  /**
   * GET /api/rag/admin/usage-stats - Lấy thống kê sử dụng (Admin)
   */
  @RagAdminOnly()
  @Get('admin/usage-stats')
  async usageStats(@Query('userId') userId?: string) {
    const stats = await this.ragHistoryService.getUsageStats(userId);
    
    return {
      success: true,
      data: stats,
    };
  }

  /**
   * GET /api/rag/admin/configs - Lấy tất cả configs (Admin)
   */
  @RagAdminOnly()
  @Get('admin/configs')
  async getConfigs() {
    const configs = await this.ragConfigService.getAllConfigs();
    const currentSettings = this.ragConfigService.getSettings();
    
    return {
      success: true,
      data: {
        configs,
        currentSettings,
      },
    };
  }

  /**
   * PATCH /api/rag/admin/configs - Cập nhật config (Admin)
   */
  @RagAdminOnly()
  @Patch('admin/configs')
  async updateConfig(@Body() body: UpdateConfigRequest) {
    try {
      await this.ragConfigService.updateSetting(
        body.key as keyof RAGSettings,
        body.value,
        body.description,
      );

      return {
        success: true,
        message: `Đã cập nhật cấu hình: ${body.key}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Lỗi cập nhật cấu hình: ${error.message}`,
      };
    }
  }

  /**
   * POST /api/rag/admin/configs/reset - Reset configs về mặc định (Admin)
   */
  @RagAdminOnly()
  @Post('admin/configs/reset')
  async resetConfigs() {
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
   * POST /api/rag/admin/configs/seed - Seed default configs (Admin)
   */
  @RagAdminOnly()
  @Post('admin/configs/seed')
  async seedConfigs() {
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

  /**
   * DELETE /api/rag/admin/cache - Xóa cache (Admin)
   */
  @RagAdminOnly()
  @Delete('admin/cache')
  async clearCache() {
    this.ragService.clearContextCache();
    
    return {
      success: true,
      message: 'Đã xóa cache context',
    };
  }

  /**
   * DELETE /api/rag/admin/history - Xóa tất cả lịch sử (Admin)
   */
  @RagAdminOnly()
  @Delete('admin/history')
  async adminClearHistory(@Query('olderThanDays') olderThanDays?: string) {
    try {
      const days = olderThanDays ? parseInt(olderThanDays, 10) : undefined;
      const deletedCount = await this.ragHistoryService.adminClearAllHistory(days);
      
      return {
        success: true,
        message: days 
          ? `Đã xóa ${deletedCount} tin nhắn cũ hơn ${days} ngày`
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
}
