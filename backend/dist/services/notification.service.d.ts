import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTaskAssignedNotification(taskId: string, assignedUserId: string): Promise<any>;
    createTaskCompletedNotification(taskId: string, userId: string): Promise<any[]>;
    createTaskCommentNotification(taskId: string, commentAuthorId: string): Promise<any[]>;
    findByUserId(userId: string, limit?: number): Promise<any>;
    markAsRead(notificationId: string, userId: string): Promise<any>;
    markAllAsRead(userId: string): Promise<any>;
}
