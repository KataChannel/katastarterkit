import { PrismaService } from '../../prisma/prisma.service';
export declare class SupportAnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAnalytics(): Promise<{
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
    getDailyStats(date: Date): Promise<any>;
    getAgentStats(agentId: string, startDate: Date, endDate: Date): Promise<any>;
}
