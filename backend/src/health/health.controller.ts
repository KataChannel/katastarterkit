import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  HttpHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';
import { RedisHealthIndicator } from './redis.health';
import { MinioHealthIndicator } from './minio.health';
import { LoggerService } from '../logger/logger.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private redisHealth: RedisHealthIndicator,
    private minioHealth: MinioHealthIndicator,
    private logger: LoggerService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const startTime = Date.now();
    
    return this.health.check([
      // Database health
      () => this.prismaHealth.isHealthy('database'),
      
      // Redis health  
      () => this.redisHealth.isHealthy('redis'),
      
      // MinIO health
      () => this.minioHealth.isHealthy('minio'),
      
      // Memory health (< 150MB)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      
      // Memory RSS health (< 300MB) 
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      
      // Disk health (90% threshold)
      () => this.disk.checkStorage('storage', {
        path: '/',
        thresholdPercent: 0.9,
      }),
    ]).then((result) => {
      const duration = Date.now() - startTime;
      this.logger.logPerformance('health-check', duration, {
        status: result.status,
        checks: Object.keys(result.details || {}),
      });
      return result;
    }).catch((error) => {
      const duration = Date.now() - startTime;
      this.logger.error('Health check failed', error.stack, 'HealthController', {
        duration,
        error: error.message,
      });
      throw error;
    });
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      // Essential services for readiness
      () => this.prismaHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }

  @Get('live')
  @HealthCheck() 
  liveness() {
    return this.health.check([
      // Basic liveness check
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
    ]);
  }

  @Get('detailed')
  @HealthCheck()
  detailed() {
    return this.health.check([
      // Comprehensive health check
      () => this.prismaHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
      () => this.minioHealth.isHealthy('minio'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      () => this.disk.checkStorage('storage', {
        path: '/',
        thresholdPercent: 0.9,
      }),
      
      // External service health (if frontend is accessible)
      () => this.http.pingCheck('frontend', 'http://localhost:3000'),
    ]);
  }
}
