import { PrismaService } from '../prisma/prisma.service';
import { RealTimeNotificationService } from '../realtime/real-time-notification.service';
import { PushNotificationService } from './push-notification.service';
export interface CreateNotificationInput {
    userId: string;
    title: string;
    message: string;
    type: 'ORDER' | 'SYSTEM' | 'PROMOTION' | 'TASK' | 'MENTION';
    data?: any;
    taskId?: string;
    mentionedBy?: string;
}
export interface NotificationFilters {
    userId: string;
    isRead?: boolean;
    type?: string;
    skip?: number;
    take?: number;
}
export declare class NotificationService {
    private readonly prisma;
    private readonly realTimeService;
    private readonly pushNotificationService;
    private readonly logger;
    constructor(prisma: PrismaService, realTimeService: RealTimeNotificationService, pushNotificationService: PushNotificationService);
    createTaskAssignedNotification(taskId: string, assignedUserId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        isRead: boolean;
        userId: string;
        taskId: string | null;
        mentionedBy: string | null;
    }>;
    createTaskCompletedNotification(taskId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        isRead: boolean;
        userId: string;
        taskId: string | null;
        mentionedBy: string | null;
    }[]>;
    createTaskCommentNotification(taskId: string, commentAuthorId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        isRead: boolean;
        userId: string;
        taskId: string | null;
        mentionedBy: string | null;
    }[]>;
    findByUserId(userId: string, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        isRead: boolean;
        userId: string;
        taskId: string | null;
        mentionedBy: string | null;
    }[]>;
    markAsRead(notificationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    create(input: CreateNotificationInput): Promise<{
        user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        isRead: boolean;
        userId: string;
        taskId: string | null;
        mentionedBy: string | null;
    }>;
    createOrderNotification(userId: string | undefined, guestEmail: string | undefined, orderNumber: string, orderTotal: number, orderData: any): Promise<void>;
    getNotifications(filters: NotificationFilters): Promise<{
        notifications: ({
            mentioner: {
                id: string;
                username: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            type: string;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            message: string;
            isRead: boolean;
            userId: string;
            taskId: string | null;
            mentionedBy: string | null;
        })[];
        total: number;
        unreadCount: number;
        hasMore: boolean;
    }>;
    getUnreadCount(userId: string): Promise<number>;
    delete(notificationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        type: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        isRead: boolean;
        userId: string;
        taskId: string | null;
        mentionedBy: string | null;
    }>;
    deleteAllRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    private getIconForNotificationType;
    private getUrlForNotificationType;
}
