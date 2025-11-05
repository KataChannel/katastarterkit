import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus, TaskPriority } from '@prisma/client';
interface DateRange {
    startDate?: Date;
    endDate?: Date;
}
export declare class ProjectAnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getProjectAnalytics(projectId: string, dateRange?: DateRange): Promise<{
        taskStats: any;
        memberStats: any;
        activityStats: any;
        completionRate: any;
        averageCompletionTime: any;
        upcomingDeadlines: any;
        generatedAt: Date;
    }>;
    getTaskStatistics(projectId: string, dateRange?: DateRange): Promise<{
        total: any;
        byStatus: {
            [TaskStatus.PENDING]: number;
            [TaskStatus.IN_PROGRESS]: number;
            [TaskStatus.COMPLETED]: number;
            [TaskStatus.CANCELLED]: number;
        };
        byPriority: {
            [TaskPriority.LOW]: number;
            [TaskPriority.MEDIUM]: number;
            [TaskPriority.HIGH]: number;
            [TaskPriority.URGENT]: number;
        };
        overdue: number;
    }>;
    getMemberStatistics(projectId: string, dateRange?: DateRange): Promise<any>;
    getActivityStatistics(projectId: string, dateRange?: DateRange): Promise<{
        total: any;
        byType: Record<string, number>;
        dailyChart: {
            date: string;
            count: number;
        }[];
    }>;
    getCompletionRate(projectId: string, dateRange?: DateRange): Promise<{
        total: any;
        completed: any;
        rate: number;
    }>;
    getAverageCompletionTime(projectId: string): Promise<{
        averageDays: number;
        averageHours: number;
        totalCompleted: any;
    }>;
    getUpcomingDeadlines(projectId: string): Promise<any>;
    getOverdueTasks(projectId: string): Promise<any>;
    getTaskVelocity(projectId: string, days?: number): Promise<{
        totalCompleted: any;
        averagePerDay: number;
        chart: {
            date: string;
            count: number;
        }[];
    }>;
    getTagStatistics(projectId: string): Promise<{
        tag: string;
        count: number;
    }[]>;
    getProjectHealthScore(projectId: string): Promise<{
        score: number;
        status: string;
        factors: {
            overdueTasks: any;
            completionRate: any;
            pendingRatio: number;
        };
    }>;
}
export {};
