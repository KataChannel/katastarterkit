import { SecurityAuditService } from '../services/security-audit.service';
export interface ComplianceReportRequest {
    framework: 'GDPR' | 'SOC2' | 'ISO27001';
    startDate: string;
    endDate: string;
}
export declare class ComplianceController {
    private readonly auditService;
    constructor(auditService: SecurityAuditService);
    generateGDPRReport(req: any, body: ComplianceReportRequest): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    generateSOC2Report(req: any, body: ComplianceReportRequest): Promise<{
        success: boolean;
        data: {
            framework: string;
            reportId: string;
            trustServicesCriteria: {
                security: boolean;
                availability: boolean;
                processingIntegrity: boolean;
                confidentiality: boolean;
            };
            complianceScore: number;
            status: string;
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
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    getComplianceDashboard(req: any, timeframe?: string): Promise<{
        success: boolean;
        data: {
            gdprCompliance: {
                score: number;
                status: string;
                lastAssessment: Date;
            };
            soc2Compliance: {
                score: number;
                status: string;
                lastAssessment: Date;
            };
            securityPosture: {
                riskLevel: string;
                improvementAreas: string[];
            };
            timeframe: "day" | "month" | "week";
            summary: {
                totalEvents: any;
                criticalEvents: any;
                highEvents: any;
                riskScore: number;
            };
            eventsByType: any;
            eventsByUser: any;
            recentEvents: any;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    getComplianceAuditLogs(req: any, action?: string, resourceType?: string, limit?: string, offset?: string): Promise<{
        success: boolean;
        data: {
            logs: any;
            total: any;
            limit: number;
            offset: number;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    getSecurityEvents(req: any, eventType?: string, severity?: string, limit?: string, offset?: string): Promise<{
        success: boolean;
        data: {
            events: any;
            total: any;
            limit: number;
            offset: number;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    getUserAnomalies(req: any, timeframe?: string): Promise<{
        success: boolean;
        data: {
            userId: string;
            timeframe: "day" | "hour";
            anomaliesDetected: number;
            anomalies: any[];
            riskLevel: "medium" | "low" | "high" | "critical";
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    private identifyImprovementAreas;
}
