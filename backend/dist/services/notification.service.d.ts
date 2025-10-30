import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTaskAssignedNotification(taskId: string, assignedUserId: string): Promise<{
        id: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        taskId: string | null;
        message: string;
        isRead: boolean;
        mentionedBy: string | null;
    }>;
    createTaskCompletedNotification(taskId: string, userId: string): Promise<{
        id: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        taskId: string | null;
        message: string;
        isRead: boolean;
        mentionedBy: string | null;
    }[]>;
    createTaskCommentNotification(taskId: string, commentAuthorId: string): Promise<{
        id: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        taskId: string | null;
        message: string;
        isRead: boolean;
        mentionedBy: string | null;
    }[]>;
    findByUserId(userId: string, limit?: number): Promise<{
        id: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        taskId: string | null;
        message: string;
        isRead: boolean;
        mentionedBy: string | null;
    }[]>;
    markAsRead(notificationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
