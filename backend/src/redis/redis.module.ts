import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

const redisProvider = {
  provide: Redis,
  useFactory: (configService: ConfigService) => {
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
    
    console.log(`[Redis] Connecting to Redis: host=${host}, port=${port}, dockerEnv=${isDockerEnv}`);
    
    return new Redis({
      host,
      port,
      password,
      db,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}