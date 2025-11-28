import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

export interface VisitorStats {
  realtime: number;      // Người đang online
  today: number;         // Lượt truy cập hôm nay
  thisMonth: number;     // Lượt truy cập tháng này
  total: number;         // Tổng lượt truy cập
}

@Injectable()
export class AnalyticsService implements OnModuleInit {
  private readonly logger = new Logger(AnalyticsService.name);
  private client: BetaAnalyticsDataClient | null = null;
  private propertyId: string | null = null;
  private isConfigured = false;

  // Cache keys
  private readonly CACHE_KEY_REALTIME = 'analytics:realtime';
  private readonly CACHE_KEY_TODAY = 'analytics:today';
  private readonly CACHE_KEY_MONTH = 'analytics:month';
  private readonly CACHE_KEY_TOTAL = 'analytics:total';

  // Cache TTL (seconds)
  private readonly CACHE_TTL_REALTIME = 30;      // 30 giây cho realtime
  private readonly CACHE_TTL_TODAY = 300;        // 5 phút cho hôm nay
  private readonly CACHE_TTL_MONTH = 3600;       // 1 giờ cho tháng
  private readonly CACHE_TTL_TOTAL = 86400;      // 24 giờ cho tổng

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onModuleInit() {
    await this.initializeClient();
  }

  private async initializeClient() {
    try {
      const credentialsPath = this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS');
      const credentialsJson = this.configService.get<string>('GOOGLE_CREDENTIALS_JSON');
      this.propertyId = this.configService.get<string>('GA4_PROPERTY_ID');

      if (!this.propertyId) {
        this.logger.warn('GA4_PROPERTY_ID không được cấu hình, Analytics sẽ trả về dữ liệu mẫu');
        return;
      }

      if (credentialsJson) {
        // Parse credentials từ JSON string (cho production/docker)
        const credentials = JSON.parse(credentialsJson);
        this.client = new BetaAnalyticsDataClient({
          credentials,
        });
        this.isConfigured = true;
        this.logger.log('Google Analytics đã được khởi tạo từ GOOGLE_CREDENTIALS_JSON');
      } else if (credentialsPath) {
        // Sử dụng file credentials (cho development)
        this.client = new BetaAnalyticsDataClient({
          keyFilename: credentialsPath,
        });
        this.isConfigured = true;
        this.logger.log('Google Analytics đã được khởi tạo từ file credentials');
      } else {
        this.logger.warn('Không có credentials cho Google Analytics, sử dụng dữ liệu mẫu');
      }
    } catch (error) {
      this.logger.error('Lỗi khởi tạo Google Analytics client:', error);
    }
  }

  /**
   * Lấy số người đang online (realtime)
   */
  async getRealtimeUsers(): Promise<number> {
    const cached = await this.cacheManager.get<number>(this.CACHE_KEY_REALTIME);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    if (!this.isConfigured || !this.client) {
      return this.getMockData('realtime');
    }

    try {
      const [response] = await this.client.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        metrics: [{ name: 'activeUsers' }],
      });

      const count = parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
      await this.cacheManager.set(this.CACHE_KEY_REALTIME, count, this.CACHE_TTL_REALTIME * 1000);
      return count;
    } catch (error) {
      this.logger.error('Lỗi lấy realtime users:', error);
      return this.getMockData('realtime');
    }
  }

  /**
   * Lấy lượt truy cập hôm nay
   */
  async getTodayVisits(): Promise<number> {
    const cached = await this.cacheManager.get<number>(this.CACHE_KEY_TODAY);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    if (!this.isConfigured || !this.client) {
      return this.getMockData('today');
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: today, endDate: today }],
        metrics: [{ name: 'sessions' }],
      });

      const count = parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
      await this.cacheManager.set(this.CACHE_KEY_TODAY, count, this.CACHE_TTL_TODAY * 1000);
      return count;
    } catch (error) {
      this.logger.error('Lỗi lấy today visits:', error);
      return this.getMockData('today');
    }
  }

  /**
   * Lấy lượt truy cập tháng này
   */
  async getThisMonthVisits(): Promise<number> {
    const cached = await this.cacheManager.get<number>(this.CACHE_KEY_MONTH);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    if (!this.isConfigured || !this.client) {
      return this.getMockData('month');
    }

    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString().split('T')[0];
      const today = now.toISOString().split('T')[0];

      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: firstDayOfMonth, endDate: today }],
        metrics: [{ name: 'sessions' }],
      });

      const count = parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
      await this.cacheManager.set(this.CACHE_KEY_MONTH, count, this.CACHE_TTL_MONTH * 1000);
      return count;
    } catch (error) {
      this.logger.error('Lỗi lấy this month visits:', error);
      return this.getMockData('month');
    }
  }

  /**
   * Lấy tổng lượt truy cập (từ đầu năm)
   */
  async getTotalVisits(): Promise<number> {
    const cached = await this.cacheManager.get<number>(this.CACHE_KEY_TOTAL);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    if (!this.isConfigured || !this.client) {
      return this.getMockData('total');
    }

    try {
      // Lấy từ đầu năm đến nay (hoặc có thể lấy all time nếu cần)
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      const today = now.toISOString().split('T')[0];

      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: startOfYear, endDate: today }],
        metrics: [{ name: 'sessions' }],
      });

      const count = parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
      await this.cacheManager.set(this.CACHE_KEY_TOTAL, count, this.CACHE_TTL_TOTAL * 1000);
      return count;
    } catch (error) {
      this.logger.error('Lỗi lấy total visits:', error);
      return this.getMockData('total');
    }
  }

  /**
   * Lấy tất cả thống kê visitor
   */
  async getVisitorStats(): Promise<VisitorStats> {
    const [realtime, today, thisMonth, total] = await Promise.all([
      this.getRealtimeUsers(),
      this.getTodayVisits(),
      this.getThisMonthVisits(),
      this.getTotalVisits(),
    ]);

    return {
      realtime,
      today,
      thisMonth,
      total,
    };
  }

  /**
   * Dữ liệu mẫu khi không có credentials
   */
  private getMockData(type: 'realtime' | 'today' | 'month' | 'total'): number {
    const mockData = {
      realtime: Math.floor(Math.random() * 50) + 5,    // 5-55 người
      today: Math.floor(Math.random() * 500) + 100,     // 100-600 lượt
      month: Math.floor(Math.random() * 10000) + 2000,  // 2000-12000 lượt
      total: Math.floor(Math.random() * 100000) + 50000, // 50000-150000 lượt
    };
    return mockData[type];
  }

  /**
   * Kiểm tra trạng thái cấu hình
   */
  isAnalyticsConfigured(): boolean {
    return this.isConfigured;
  }
}
