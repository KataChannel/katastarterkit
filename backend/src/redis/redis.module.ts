import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { RedisHealthService } from './redis-health.service';

const logger = new Logger('RedisModule');

const redisProvider = {
  provide: Redis,
  useFactory: async (configService: ConfigService) => {
    // Detect Docker environment
    const isDockerEnv = process.env.DOCKER_NETWORK_NAME !== undefined;
    
    // Use Docker Redis host/port if in Docker, otherwise use local configuration
    const host = isDockerEnv
      ? configService.get('DOCKER_REDIS_HOST', 'redis')
      : configService.get('REDIS_HOST', 'localhost');
    
    const port = isDockerEnv
      ? configService.get('DOCKER_REDIS_PORT', 6379)
      : configService.get('REDIS_PORT', 6379);
    
    const password = configService.get('REDIS_PASSWORD');
    const db = configService.get('REDIS_DB', 0);
    
    logger.log(`[Redis] Connecting to Redis: host=${host}, port=${port}, dockerEnv=${isDockerEnv}`);
    
    const redis = new Redis({
      host,
      port,
      password,
      db,
      // Connection retry configuration
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        logger.warn(`[Redis] Retry attempt ${times}, delay ${delay}ms`);
        return delay;
      },
      reconnectOnError: (err: Error) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          logger.warn(`[Redis] ${targetError} error, will reconnect`);
          return true;
        }
        return false;
      },
      // Connection settings
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      enableOfflineQueue: true,
      // Timeout settings
      connectTimeout: 10000,
      commandTimeout: 5000,
      lazyConnect: false,
    });

    // Set up error handlers
    redis.on('error', (err) => {
      logger.error(`[Redis] Error: ${err.message}`, err.stack);
    });

    redis.on('connect', () => {
      logger.log('[Redis] Connected successfully');
    });

    redis.on('reconnecting', () => {
      logger.warn('[Redis] Reconnecting...');
    });

    redis.on('ready', () => {
      logger.log('[Redis] Ready');
    });

    // Wait for Redis to be ready before returning
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Redis connection timeout'));
      }, 30000); // 30 second timeout

      redis.on('ready', () => {
        clearTimeout(timeout);
        resolve(null);
      });

      redis.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    return redis;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [redisProvider, RedisHealthService],
  exports: [redisProvider, RedisHealthService],
})
export class RedisModule {}