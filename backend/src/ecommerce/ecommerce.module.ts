import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RedisService } from '../redis/redis.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { NotificationService } from '../services/notification.service';
import { CartResolver } from '../graphql/resolvers/cart.resolver';
import { OrderResolver } from '../graphql/resolvers/order.resolver';
import { NotificationResolver } from '../graphql/resolvers/notification.resolver';
import { RealTimeNotificationService } from '../realtime/real-time-notification.service';
import { AdvancedCacheService } from '../common/services/advanced-cache.service';
import { PerformanceMetricsService } from '../common/services/performance-metrics.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    RedisService,
    AdvancedCacheService,
    PerformanceMetricsService,
    RealTimeNotificationService,
    NotificationService,
    CartService,
    OrderService,
    CartResolver,
    OrderResolver,
    NotificationResolver,
  ],
  exports: [CartService, OrderService, NotificationService],
})
export class EcommerceModule {}
