import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTaskAssignedNotification(taskId: string, assignedUserId: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        type: string;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        message: string;
        userId: string;
        title: string;
        mentionedBy: string | null;
        isRead: boolean;
        taskId: string | null;
    }>;
    createTaskCompletedNotification(taskId: string, userId: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        type: string;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        message: string;
        userId: string;
        title: string;
        mentionedBy: string | null;
        isRead: boolean;
        taskId: string | null;
    }[]>;
    createTaskCommentNotification(taskId: string, commentAuthorId: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        type: string;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        message: string;
        userId: string;
        title: string;
        mentionedBy: string | null;
        isRead: boolean;
        taskId: string | null;
    }[]>;
    findByUserId(userId: string, limit?: number): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        type: string;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        message: string;
        userId: string;
        title: string;
        mentionedBy: string | null;
        isRead: boolean;
        taskId: string | null;
    }[]>;
    markAsRead(notificationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
