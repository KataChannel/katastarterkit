import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  private redis: Redis;

  constructor(private readonly configService: ConfigService) {
    super();
    
    // Create Redis connection for health checks
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Test Redis connection with ping
      const result = await this.redis.ping();
      
      if (result === 'PONG') {
        return this.getStatus(key, true, {
          redis: 'up',
          message: 'Redis connection is healthy',
          ping: result,
        });
      } else {
        throw new Error(`Unexpected ping response: ${result}`);
      }
    } catch (error) {
      const result = this.getStatus(key, false, {
        redis: 'down',
        message: error.message,
      });
      
      throw new HealthCheckError('Redis health check failed', result);
    }
  }

  async onModuleDestroy() {
    await this.redis.disconnect();
  }
}
