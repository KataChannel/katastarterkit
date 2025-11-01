import { SupportAnalyticsService } from '../services/support-analytics.service';
export declare class SupportAnalyticsResolver {
    private analyticsService;
    constructor(analyticsService: SupportAnalyticsService);
    getSupportAnalytics(): Promise<{
        totalConversations: any;
        activeConversations: any;
        waitingConversations: any;
        closedConversations: any;
        averageResponseTime: number;
        averageResolutionTime: number;
        customerSatisfactionScore: number;
        totalMessages: any;
        aiGeneratedMessages: any;
        platformBreakdown: any;
        agentPerformance: any[];
    }>;
}
