import { PrismaService } from '../prisma/prisma.service';
export declare class CalendarService {
    private prisma;
    constructor(prisma: PrismaService);
    getCalendarTasks(userId: string, startDate: Date, endDate: Date, projectId?: string): Promise<{
        tasks: any;
        tasksByDate: Record<string, Task[]>;
        summary: {
            total: any;
            completed: any;
            overdue: any;
        };
    }>;
    getMonthView(userId: string, year: number, month: number, projectId?: string): Promise<{
        tasks: any;
        tasksByDate: Record<string, Task[]>;
        summary: {
            total: any;
            completed: any;
            overdue: any;
        };
    }>;
    getWeekView(userId: string, startDate: Date, projectId?: string): Promise<{
        tasks: any;
        tasksByDate: Record<string, Task[]>;
        summary: {
            total: any;
            completed: any;
            overdue: any;
        };
    }>;
    generateICalExport(userId: string, projectId?: string): Promise<string>;
    getUpcomingTasks(userId: string, hours?: number): Promise<any>;
    getCalendarStatistics(userId: string, startDate: Date, endDate: Date, projectId?: string): Promise<{
        total: any;
        completed: any;
        inProgress: any;
        pending: any;
        overdue: any;
        completionRate: number;
    }>;
    private escapeICalText;
    private formatICalDate;
    private mapPriorityToICal;
}
