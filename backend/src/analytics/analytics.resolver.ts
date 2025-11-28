import { Resolver, Query, ObjectType, Field, Int } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';

@ObjectType({ description: 'Thống kê lượt truy cập website' })
export class VisitorStatsType {
  @Field(() => Int, { description: 'Số người đang truy cập (realtime)' })
  realtime: number;

  @Field(() => Int, { description: 'Lượt truy cập hôm nay' })
  today: number;

  @Field(() => Int, { description: 'Lượt truy cập tháng này' })
  thisMonth: number;

  @Field(() => Int, { description: 'Tổng lượt truy cập' })
  total: number;
}

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => VisitorStatsType, { 
    name: 'visitorStats',
    description: 'Lấy thống kê lượt truy cập từ Google Analytics' 
  })
  async getVisitorStats(): Promise<VisitorStatsType> {
    const stats = await this.analyticsService.getVisitorStats();
    return {
      realtime: stats.realtime,
      today: stats.today,
      thisMonth: stats.thisMonth,
      total: stats.total,
    };
  }

  @Query(() => Int, { 
    name: 'realtimeUsers',
    description: 'Số người đang truy cập website' 
  })
  async getRealtimeUsers(): Promise<number> {
    return this.analyticsService.getRealtimeUsers();
  }

  @Query(() => Boolean, { 
    name: 'isAnalyticsConfigured',
    description: 'Kiểm tra Analytics đã được cấu hình chưa' 
  })
  isAnalyticsConfigured(): boolean {
    return this.analyticsService.isAnalyticsConfigured();
  }
}
