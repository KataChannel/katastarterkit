import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { AuditOptimizationService } from './audit-optimization.service';

/**
 * Smart Audit Service - Thay thế EnhancedAuditService
 * Tích hợp các chiến lược tối ưu hóa
 */
@Injectable()
export class SmartAuditService {
  private readonly logger = new Logger(SmartAuditService.name);

  constructor(
    private prisma: PrismaService,
    private optimization: AuditOptimizationService
  ) {}

  /**
   * Log audit với tối ưu hóa tự động
   */
  async logOperation(
    operation: {
      action: string;
      resourceType: string;
      resourceId?: string;
      entityName?: string;
      operationType?: 'CRUD' | 'AUTH' | 'PERMISSION' | 'SECURITY' | 'SYSTEM';
      severity?: 'debug' | 'info' | 'warn' | 'error' | 'critical';
      tags?: string[];
      oldValues?: any;
      newValues?: any;
      details?: any;
      sensitiveData?: boolean;
      requiresReview?: boolean;
    },
    context: {
      userId?: string;
      sessionId?: string;
      request?: Request;
      correlationId?: string;
    } = {},
    performance?: {
      responseTime?: number;
      dbQueryTime?: number;
      dbQueryCount?: number;
      statusCode?: number;
    }
  ): Promise<void> {
    try {
      // OPTIMIZATION 1: Skip health check endpoints
      if (this.optimization.shouldSkipLogging(context.request)) {
        return;
      }

      // OPTIMIZATION 2: Sampling for high-frequency actions
      const shouldLog = this.optimization.shouldSampleLog(
        operation.action,
        this.getSampleRate(operation.severity)
      );
      
      if (!shouldLog) {
        return; // Skip this log
      }

      // OPTIMIZATION 3: Conditional performance data
      const includePerformanceData = this.optimization.shouldLogPerformanceData(
        operation.severity || 'info'
      );

      // OPTIMIZATION 4: Compress large JSON data
      const oldValues = operation.oldValues 
        ? this.compressData(operation.oldValues)
        : null;
      
      const newValues = operation.newValues
        ? this.compressData(operation.newValues)
        : null;

      // OPTIMIZATION 5: Minimal session info
      const sessionInfo = this.getMinimalSessionInfo(context.request);

      // Create audit log with optimizations
      const auditData: Prisma.AuditLogCreateInput = {
        action: operation.action,
        resourceType: operation.resourceType,
        resourceId: operation.resourceId,
        entityName: operation.entityName,
        
        operationType: operation.operationType || 'CRUD',
        severity: operation.severity || 'info',
        tags: [...(operation.tags || []), 'optimized'],
        
        // Compress data
        oldValues: oldValues,
        newValues: newValues,
        details: operation.details ? this.compressData(operation.details) : null,
        
        user: context.userId ? { connect: { id: context.userId } } : undefined,
        sessionId: context.sessionId,
        correlationId: context.correlationId,
        
        sensitiveData: operation.sensitiveData || false,
        requiresReview: operation.requiresReview || false,
        
        // Request details - minimal
        ipAddress: context.request?.ip,
        userAgent: this.truncateUserAgent(context.request?.get('user-agent')),
        method: context.request?.method,
        endpoint: this.normalizeEndpoint(context.request?.url),
        
        // Performance metrics - conditional
        responseTime: performance?.responseTime,
        statusCode: performance?.statusCode,
        
        // Only store detailed performance for important logs
        ...(includePerformanceData && {
          dbQueryTime: performance?.dbQueryTime,
          dbQueryCount: performance?.dbQueryCount,
          performanceData: performance
        }),
        
        // Minimal session info
        sessionInfo: sessionInfo,
        
        success: true
      };

      await this.prisma.auditLog.create({ data: auditData });
      
    } catch (error) {
      this.logger.error('Failed to create audit log entry', error);
    }
  }

  /**
   * Log failure với thông tin tối thiểu
   */
  async logFailure(
    operation: any,
    context: any,
    error: Error,
    statusCode?: number
  ): Promise<void> {
    // Always log failures, but with compressed data
    await this.logOperation(
      {
        ...operation,
        severity: 'error',
        details: {
          error: {
            message: error.message,
            name: error.name,
            // Stack trace chỉ cho critical errors
            ...(operation.severity === 'critical' && { stack: error.stack })
          }
        }
      },
      context,
      { statusCode }
    );
  }

  /**
   * Batch logging with aggregation
   */
  async logBatch(operations: any[], context: any): Promise<void> {
    // Thay vì log từng operation, log một summary
    await this.logOperation(
      {
        action: 'BATCH_OPERATION',
        resourceType: 'batch',
        operationType: 'SYSTEM',
        severity: 'info',
        details: {
          count: operations.length,
          operations: operations.map(op => ({
            action: op.action,
            resourceType: op.resourceType,
            resourceId: op.resourceId
          }))
        },
        tags: ['batch', 'aggregated']
      },
      context
    );
  }

  /**
   * Helper: Get sample rate based on severity
   */
  private getSampleRate(severity?: string): number {
    switch (severity) {
      case 'debug':
        return 0.01; // 1% sampling
      case 'info':
        return 0.1;  // 10% sampling
      case 'warn':
        return 0.5;  // 50% sampling
      case 'error':
      case 'critical':
        return 1.0;  // Always log
      default:
        return 0.1;
    }
  }

  /**
   * Helper: Compress data by removing unnecessary fields
   */
  private compressData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Remove null/undefined
    const cleaned = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    return cleaned;
  }

  /**
   * Helper: Get minimal session info
   */
  private getMinimalSessionInfo(request?: Request): any {
    if (!request) return null;

    return {
      // Only essential info
      referer: request.get('referer'),
      origin: request.get('origin'),
      // Skip full headers
    };
  }

  /**
   * Helper: Truncate user agent
   */
  private truncateUserAgent(userAgent?: string): string | undefined {
    if (!userAgent) return undefined;
    
    // Extract only browser/version
    const match = userAgent.match(/(?:Chrome|Firefox|Safari|Edge)\/[\d.]+/);
    return match ? match[0] : userAgent.substring(0, 50);
  }

  /**
   * Helper: Normalize endpoint (remove IDs, query params)
   */
  private normalizeEndpoint(url?: string): string | undefined {
    if (!url) return undefined;

    // Remove query parameters
    let normalized = url.split('?')[0];

    // Replace UUIDs with :id
    normalized = normalized.replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      ':id'
    );

    // Replace numeric IDs
    normalized = normalized.replace(/\/\d+/g, '/:id');

    return normalized;
  }

  /**
   * Query logs with optimized pagination
   */
  async getAuditLogs(filters: any) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 50, 100);
    const skip = (page - 1) * limit;

    // Use lean query - only essential fields
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: this.buildWhereClause(filters),
        select: {
          id: true,
          action: true,
          resourceType: true,
          resourceId: true,
          severity: true,
          timestamp: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          },
          // Exclude large fields
          // oldValues: false,
          // newValues: false,
          // performanceData: false,
          // sessionInfo: false,
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.auditLog.count({
        where: this.buildWhereClause(filters)
      })
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  private buildWhereClause(filters: any): Prisma.AuditLogWhereInput {
    return {
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.resourceType && { resourceType: filters.resourceType }),
      ...(filters.action && { action: { contains: filters.action } }),
      ...(filters.severity && { severity: filters.severity }),
      ...(filters.dateFrom || filters.dateTo) && {
        timestamp: {
          ...(filters.dateFrom && { gte: filters.dateFrom }),
          ...(filters.dateTo && { lte: filters.dateTo })
        }
      }
    };
  }
}
