import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTaskAssignedNotification(taskId: string, assignedUserId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isRead: boolean;
        message: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        type: string;
        taskId: string | null;
        mentionedBy: string | null;
    }>;
    createTaskCompletedNotification(taskId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isRead: boolean;
        message: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        type: string;
        taskId: string | null;
        mentionedBy: string | null;
    }[]>;
    createTaskCommentNotification(taskId: string, commentAuthorId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isRead: boolean;
        message: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        type: string;
        taskId: string | null;
        mentionedBy: string | null;
    }[]>;
    findByUserId(userId: string, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isRead: boolean;
        message: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        type: string;
        taskId: string | null;
        mentionedBy: string | null;
    }[]>;
    markAsRead(notificationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
