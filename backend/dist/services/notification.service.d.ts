import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTaskAssignedNotification(taskId: string, assignedUserId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        type: string;
        message: string;
        isRead: boolean;
    }>;
    createTaskCompletedNotification(taskId: string, userId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        type: string;
        message: string;
        isRead: boolean;
    }[]>;
    createTaskCommentNotification(taskId: string, commentAuthorId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        type: string;
        message: string;
        isRead: boolean;
    }[]>;
    findByUserId(userId: string, limit?: number): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        type: string;
        message: string;
        isRead: boolean;
    }[]>;
    markAsRead(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
