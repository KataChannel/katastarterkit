import { SecurityMonitoringService } from '../services/security-monitoring.service';
import { SecurityAuditService } from '../services/security-audit.service';
export interface SecurityDashboardSummary {
    securityScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    lastAssessment: Date;
    complianceStatus: {
        gdpr: number;
        soc2: number;
        iso27001: number;
    };
    recentActivity: {
        auditLogsToday: number;
        securityEventsToday: number;
        criticalAlertsOpen: number;
    };
}
export declare class SecurityDashboardController {
    private readonly monitoringService;
    private readonly auditService;
    private readonly logger;
    constructor(monitoringService: SecurityMonitoringService, auditService: SecurityAuditService);
    getSecuritySummary(): Promise<SecurityDashboardSummary>;
    runSecurityAssessment(): Promise<{
        success: boolean;
        assessment: any;
        message: string;
    }>;
    generateComplianceReport(days?: string): Promise<{
        success: boolean;
        report: any;
        period: {
            startDate: Date;
            endDate: Date;
            days: number;
        };
    }>;
    getSecurityAlerts(severity?: 'low' | 'medium' | 'high' | 'critical', limit?: string): Promise<{
        success: boolean;
        alerts: any;
        totalCount: any;
        unresolved: any;
    }>;
    getSecurityRecommendations(): Promise<{
        success: boolean;
        recommendations: any;
        summary: {
            total: any;
            critical: any;
            high: any;
            medium: any;
            low: any;
        };
        topRecommendations: any[];
    }>;
    runDailyAssessment(): Promise<{
        success: boolean;
        message: string;
        assessment: {
            id: any;
            score: any;
            riskLevel: any;
            timestamp: any;
        };
    }>;
    runWeeklyComplianceCheck(): Promise<{
        success: boolean;
        message: string;
        report: {
            complianceScore: any;
            status: any;
            timestamp: Date;
        };
    }>;
    getSystemHealth(): Promise<{
        success: boolean;
        health: {
            status: string;
            uptime: number;
            uptimeFormatted: string;
            timestamp: Date;
            services: {
                securityMonitoring: string;
                auditLogging: string;
                compliance: string;
            };
        };
    }>;
    private formatUptime;
}
