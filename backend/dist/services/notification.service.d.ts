import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTaskAssignedNotification(taskId: string, assignedUserId: string): Promise<{
        type: string;
        message: string;
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        taskId: string | null;
        isRead: boolean;
        mentionedBy: string | null;
    }>;
    createTaskCompletedNotification(taskId: string, userId: string): Promise<{
        type: string;
        message: string;
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        taskId: string | null;
        isRead: boolean;
        mentionedBy: string | null;
    }[]>;
    createTaskCommentNotification(taskId: string, commentAuthorId: string): Promise<{
        type: string;
        message: string;
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        taskId: string | null;
        isRead: boolean;
        mentionedBy: string | null;
    }[]>;
    findByUserId(userId: string, limit?: number): Promise<{
        type: string;
        message: string;
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        taskId: string | null;
        isRead: boolean;
        mentionedBy: string | null;
    }[]>;
    markAsRead(notificationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
