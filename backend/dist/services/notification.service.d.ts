import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTaskAssignedNotification(taskId: string, assignedUserId: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        title: string;
        taskId: string | null;
        isRead: boolean;
        mentionedBy: string | null;
    }>;
    createTaskCompletedNotification(taskId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        title: string;
        taskId: string | null;
        isRead: boolean;
        mentionedBy: string | null;
    }[]>;
    createTaskCommentNotification(taskId: string, commentAuthorId: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        title: string;
        taskId: string | null;
        isRead: boolean;
        mentionedBy: string | null;
    }[]>;
    findByUserId(userId: string, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        title: string;
        taskId: string | null;
        isRead: boolean;
        mentionedBy: string | null;
    }[]>;
    markAsRead(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
