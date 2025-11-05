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
        data: any;
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
        data: any;
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
        data: any;
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
        data: any;
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
        data: any;
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
        data: any;
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
