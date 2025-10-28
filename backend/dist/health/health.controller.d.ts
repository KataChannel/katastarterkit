import { HealthCheckService, HttpHealthIndicator, DiskHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';
import { RedisHealthIndicator } from './redis.health';
import { MinioHealthIndicator } from './minio.health';
import { LoggerService } from '../logger/logger.service';
export declare class HealthController {
    private health;
    private http;
    private disk;
    private memory;
    private prismaHealth;
    private redisHealth;
    private minioHealth;
    private logger;
    constructor(health: HealthCheckService, http: HttpHealthIndicator, disk: DiskHealthIndicator, memory: MemoryHealthIndicator, prismaHealth: PrismaHealthIndicator, redisHealth: RedisHealthIndicator, minioHealth: MinioHealthIndicator, logger: LoggerService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    readiness(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    liveness(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    detailed(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
