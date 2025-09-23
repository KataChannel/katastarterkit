import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Import all Phase 2 services
import { AdvancedCacheService } from './services/advanced-cache.service';
import { PerformanceMetricsService } from './services/performance-metrics.service';
import { RealTimeMonitoringService } from './services/real-time-monitoring.service';
import { SubscriptionOptimizationService } from './services/subscription-optimization.service';
import { MobileOptimizationService } from './services/mobile-optimization.service';
import { AnalyticsDashboardService } from './services/analytics-dashboard.service';

// Import controllers
import { MonitoringController } from './controllers/monitoring.controller';
import { AnalyticsController } from './controllers/analytics.controller';

// Import existing services that Phase 2 depends on
import { PrismaService } from '../prisma/prisma.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    // Core infrastructure services
    PrismaService,
    
    // Phase 2 Advanced Services
    AdvancedCacheService,
    PerformanceMetricsService,
    RealTimeMonitoringService,
    SubscriptionOptimizationService,
    MobileOptimizationService,
    AnalyticsDashboardService,
  ],
  controllers: [
    MonitoringController,
    AnalyticsController,
  ],
  exports: [
    // Export all services for use in other modules
    AdvancedCacheService,
    PerformanceMetricsService,
    RealTimeMonitoringService,
    SubscriptionOptimizationService,
    MobileOptimizationService,
    AnalyticsDashboardService,
    PrismaService,
  ],
})
export class CommonServicesModule {}