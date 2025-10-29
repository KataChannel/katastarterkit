import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisService } from '../redis/redis.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { CartResolver } from '../graphql/resolvers/cart.resolver';
import { OrderResolver } from '../graphql/resolvers/order.resolver';

@Module({
  imports: [PrismaModule],
  providers: [
    RedisService,
    CartService,
    OrderService,
    CartResolver,
    OrderResolver,
  ],
  exports: [CartService, OrderService],
})
export class EcommerceModule {}
