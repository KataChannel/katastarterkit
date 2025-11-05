import { PrismaService } from '../../prisma/prisma.service';
export interface SecurityEventDto {
    userId: string;
    eventType: string;
    resourceType?: string;
    resourceId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    metadata?: any;
}
export interface AuditLogDto {
    userId: string;
    action: string;
    resourceType?: string;
    resourceId?: string;
    oldValue?: any;
    newValue?: any;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    metadata?: any;
}
export interface PerformanceAuditLogDto extends AuditLogDto {
    method?: string;
    endpoint?: string;
    success?: boolean;
    errorMessage?: string;
    statusCode?: number;
    responseTime?: number;
    requestSize?: number;
    responseSize?: number;
    memoryUsage?: number;
    cpuUsage?: number;
    dbQueryTime?: number;
    dbQueryCount?: number;
    performanceData?: any;
    correlationId?: string;
}
export declare class SecurityAuditService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private normalizeUserId;
    logSecurityEvent(eventDto: SecurityEventDto): Promise<void>;
    logAudit(auditDto: AuditLogDto): Promise<void>;
    logAuditWithPerformance(auditDto: PerformanceAuditLogDto): Promise<void>;
    getSecurityEvents(userId?: string, eventType?: string, resourceType?: string, severity?: string, limit?: number, offset?: number): Promise<{
        events: any;
        total: any;
        limit: number;
        offset: number;
    }>;
    getAuditLogs(userId?: string, action?: string, resourceType?: string, limit?: number, offset?: number): Promise<{
        logs: ({
            user: {
                id: string;
                email: string;
                username: string;
            };
        } & {
            id: string;
            createdAt: Date;
            ipAddress: string | null;
            userAgent: string | null;
            action: string;
            details: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string | null;
            resource: string;
            resourceId: string | null;
        })[];
        total: number;
        limit: number;
        offset: number;
    }>;
    getSecurityDashboard(timeframe?: 'day' | 'week' | 'month'): Promise<{
        timeframe: "day" | "week" | "month";
        summary: {
            totalEvents: any;
            criticalEvents: any;
            highEvents: any;
            riskScore: number;
        };
        eventsByType: any;
        eventsByUser: any;
        recentEvents: any;
    }>;
    private calculateRiskScore;
    detectAnomalies(userId: string, timeframe?: 'hour' | 'day'): Promise<{
        userId: string;
        timeframe: "day" | "hour";
        anomaliesDetected: number;
        anomalies: any[];
        riskLevel: "low" | "medium" | "high" | "critical";
    }>;
    private calculateAnomalyRiskLevel;
    generateComplianceReport(startDate: Date, endDate: Date): Promise<{
        complianceScore: number;
        status: string;
        reportId: string;
        generatedAt: Date;
        reportPeriod: {
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalAuditLogs: any;
            securityEventsBySeverity: any;
            accessControlChanges: any;
        };
        userActivities: any;
        accessChanges: any;
    }>;
    private calculateOverallComplianceScore;
    private generateBaseComplianceReport;
}
