import { PrismaService } from '../prisma/prisma.service';
export declare class CalendarService {
    private prisma;
    constructor(prisma: PrismaService);
    getCalendarTasks(userId: string, startDate: Date, endDate: Date, projectId?: string): Promise<{
        tasks: ({
            _count: {
                comments: number;
                subtasks: number;
            };
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            title: string;
            status: import("@prisma/client").$Enums.TaskStatus;
            category: import("@prisma/client").$Enums.TaskCategory;
            tags: string[];
            parentId: string | null;
            priority: import("@prisma/client").$Enums.TaskPriority;
            userId: string;
            completedAt: Date | null;
            dueDate: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        })[];
        tasksByDate: Record<string, {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            title: string;
            status: import("@prisma/client").$Enums.TaskStatus;
            category: import("@prisma/client").$Enums.TaskCategory;
            tags: string[];
            parentId: string | null;
            priority: import("@prisma/client").$Enums.TaskPriority;
            userId: string;
            completedAt: Date | null;
            dueDate: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        }[]>;
        summary: {
            total: number;
            completed: number;
            overdue: number;
        };
    }>;
    getMonthView(userId: string, year: number, month: number, projectId?: string): Promise<{
        tasks: ({
            _count: {
                comments: number;
                subtasks: number;
            };
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            title: string;
            status: import("@prisma/client").$Enums.TaskStatus;
            category: import("@prisma/client").$Enums.TaskCategory;
            tags: string[];
            parentId: string | null;
            priority: import("@prisma/client").$Enums.TaskPriority;
            userId: string;
            completedAt: Date | null;
            dueDate: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        })[];
        tasksByDate: Record<string, {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            title: string;
            status: import("@prisma/client").$Enums.TaskStatus;
            category: import("@prisma/client").$Enums.TaskCategory;
            tags: string[];
            parentId: string | null;
            priority: import("@prisma/client").$Enums.TaskPriority;
            userId: string;
            completedAt: Date | null;
            dueDate: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        }[]>;
        summary: {
            total: number;
            completed: number;
            overdue: number;
        };
    }>;
    getWeekView(userId: string, startDate: Date, projectId?: string): Promise<{
        tasks: ({
            _count: {
                comments: number;
                subtasks: number;
            };
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            title: string;
            status: import("@prisma/client").$Enums.TaskStatus;
            category: import("@prisma/client").$Enums.TaskCategory;
            tags: string[];
            parentId: string | null;
            priority: import("@prisma/client").$Enums.TaskPriority;
            userId: string;
            completedAt: Date | null;
            dueDate: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        })[];
        tasksByDate: Record<string, {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            title: string;
            status: import("@prisma/client").$Enums.TaskStatus;
            category: import("@prisma/client").$Enums.TaskCategory;
            tags: string[];
            parentId: string | null;
            priority: import("@prisma/client").$Enums.TaskPriority;
            userId: string;
            completedAt: Date | null;
            dueDate: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        }[]>;
        summary: {
            total: number;
            completed: number;
            overdue: number;
        };
    }>;
    generateICalExport(userId: string, projectId?: string): Promise<string>;
    getUpcomingTasks(userId: string, hours?: number): Promise<({
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        category: import("@prisma/client").$Enums.TaskCategory;
        tags: string[];
        parentId: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        userId: string;
        completedAt: Date | null;
        dueDate: Date | null;
        projectId: string | null;
        assignedTo: string[];
        mentions: string[];
    })[]>;
    getCalendarStatistics(userId: string, startDate: Date, endDate: Date, projectId?: string): Promise<{
        total: number;
        completed: number;
        inProgress: number;
        pending: number;
        overdue: number;
        completionRate: number;
    }>;
    private escapeICalText;
    private formatICalDate;
    private mapPriorityToICal;
}
