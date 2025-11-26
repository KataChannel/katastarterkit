import { NotificationService } from '../../services/notification.service';
import { MarkNotificationAsReadInput, DeleteNotificationInput } from '../../graphql/schemas/notification.schema';
export declare class NotificationResolver {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(isRead?: boolean, type?: string, skip?: number, take?: number, context?: any): Promise<{
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
    getUnreadNotificationsCount(context?: any): Promise<number>;
    markNotificationAsRead(input: MarkNotificationAsReadInput, context?: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllNotificationsAsRead(context?: any): Promise<boolean>;
    deleteNotification(input: DeleteNotificationInput, context?: any): Promise<boolean>;
    deleteAllReadNotifications(context?: any): Promise<boolean>;
}
