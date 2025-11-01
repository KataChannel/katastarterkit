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
        assessment: import("../services/security-monitoring.service").SecurityAssessment;
        message: string;
    }>;
    generateComplianceReport(days?: string): Promise<{
        success: boolean;
        report: {
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
        recommendations: import("../services/security-monitoring.service").SecurityRecommendation[];
        summary: {
            total: number;
            critical: number;
            high: number;
            medium: number;
            low: number;
        };
        topRecommendations: import("../services/security-monitoring.service").SecurityRecommendation[];
    }>;
    runDailyAssessment(): Promise<{
        success: boolean;
        message: string;
        assessment: {
            id: string;
            score: number;
            riskLevel: "medium" | "low" | "high" | "critical";
            timestamp: Date;
        };
    }>;
    runWeeklyComplianceCheck(): Promise<{
        success: boolean;
        message: string;
        report: {
            complianceScore: number;
            status: string;
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
