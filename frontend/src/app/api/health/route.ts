/**
 * Health Check Endpoint
 * 
 * Used by Docker healthcheck and monitoring systems
 * to verify application status
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    database: 'ok' | 'error';
    redis: 'ok' | 'error';
  };
  memory?: {
    used: number;
    total: number;
    percentage: number;
  };
  error?: string;
}

/**
 * GET /api/health
 * 
 * Performs health checks on critical services:
 * - Database (Prisma)
 * - Redis Cache
 * - Memory usage
 * 
 * Returns 200 if all services are healthy, 503 otherwise
 */
export async function GET() {
  const startTime = Date.now();
  
  const result: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'ok',
      redis: 'ok',
    },
  };

  try {
    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      result.services.database = 'ok';
    } catch (error) {
      console.error('Database health check failed:', error);
      result.services.database = 'error';
      result.status = 'unhealthy';
    }

    // Check Redis connection
    try {
      const testKey = `health:check:${Date.now()}`;
      await redis.set(testKey, 'ok');
      const value = <any>await redis.get(testKey);
      
      if (value === 'ok') {
        result.services.redis = 'ok';
        // Clean up test key
        await redis.del(testKey);
      } else {
        result.services.redis = 'error';
        result.status = 'unhealthy';
      }
    } catch (error) {
      console.error('Redis health check failed:', error);
      result.services.redis = 'error';
      result.status = 'unhealthy';
    }

    // Memory usage (Node.js)
    const memUsage = process.memoryUsage();
    result.memory = {
      used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
    };

    // Overall status
    const responseTime = Date.now() - startTime;
    
    // Log health check (every 5 minutes only to reduce noise)
    if (Math.random() < 0.01) { // ~1% of requests
      console.log(`[Health Check] Status: ${result.status}, Response time: ${responseTime}ms, Memory: ${result.memory.used}MB/${result.memory.total}MB`);
    }

    // Return response
    if (result.status === 'healthy') {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 503 });
    }

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          database: 'error',
          redis: 'error',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      } as HealthCheckResult,
      { status: 503 }
    );
  }
}
