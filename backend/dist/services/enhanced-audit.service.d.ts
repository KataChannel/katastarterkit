import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
export interface AuditContext {
    userId?: string;
    sessionId?: string;
    request?: Request;
    correlationId?: string;
    batchId?: string;
    parentResource?: {
        type: string;
        id: string;
    };
}
export interface AuditOperation {
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
}
export declare class EnhancedAuditService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    logOperation(operation: AuditOperation, context?: AuditContext, performance?: {
        responseTime?: number;
        dbQueryTime?: number;
        dbQueryCount?: number;
        memoryUsage?: number;
        cpuUsage?: number;
    }): Promise<void>;
    logFailure(operation: AuditOperation, context: AuditContext, error: Error, statusCode?: number): Promise<void>;
    logBatchOperation(operations: AuditOperation[], context: AuditContext): Promise<void>;
    createAuditDecorator(operation: Omit<AuditOperation, 'oldValues' | 'newValues'>, options?: {
        captureArgs?: boolean;
        captureResult?: boolean;
        sensitiveFields?: string[];
    }): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;
    getAuditLogs(filters: {
        userId?: string;
        resourceType?: string;
        resourceId?: string;
        action?: string;
        operationType?: string;
        severity?: string;
        tags?: string[];
        dateFrom?: Date;
        dateTo?: Date;
        correlationId?: string;
        batchId?: string;
        sensitiveData?: boolean;
        requiresReview?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        logs: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getAuditStats(filters: {
        userId?: string;
        dateFrom?: Date;
        dateTo?: Date;
    }): Promise<{
        totalLogs: any;
        successRate: any;
        operationsByType: any;
        severityBreakdown: any;
        topResources: any;
        averageResponseTime: any;
    }>;
    private generateCorrelationId;
    private generateBatchId;
    private sanitizeHeaders;
    private sanitizeData;
}
