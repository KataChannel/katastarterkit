import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createTaskAssignedNotification(taskId: string, assignedUserId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { user: true },
    });

    if (!task) return;

    return this.prisma.notification.create({
      data: {
        type: 'task_assigned',
        title: 'New Task Shared',
        message: `${task.user.username} shared a task "${task.title}" with you`,
        data: { taskId },
        user: { connect: { id: assignedUserId } },
      },
    });
  }

  async createTaskCompletedNotification(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        shares: {
          where: { isActive: true },
          include: { sharedWithUser: true },
        },
      },
    });

    if (!task) return;

    // Notify all collaborators about task completion
    const notifications = task.shares.map(share => 
      this.prisma.notification.create({
        data: {
          type: 'task_completed',
          title: 'Task Completed',
          message: `Task "${task.title}" has been completed`,
          data: { taskId },
          user: { connect: { id: share.sharedWith! } },
        },
      })
    );

    return Promise.all(notifications);
  }

  async createTaskCommentNotification(taskId: string, commentAuthorId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        user: true,
        shares: {
          where: { isActive: true },
          include: { sharedWithUser: true },
        },
      },
    });

    if (!task) return;

    const notifyUsers = new Set<string>();
    
    // Notify task owner
    if (task.userId !== commentAuthorId) {
      notifyUsers.add(task.userId);
    }
    
    // Notify collaborators
    task.shares.forEach(share => {
      if (share.sharedWith && share.sharedWith !== commentAuthorId) {
        notifyUsers.add(share.sharedWith);
      }
    });

    const notifications = Array.from(notifyUsers).map(userId => 
      this.prisma.notification.create({
        data: {
          type: 'task_comment',
          title: 'New Comment',
          message: `New comment on task "${task.title}"`,
          data: { taskId },
          user: { connect: { id: userId } },
        },
      })
    );

    return Promise.all(notifications);
  }

  async findByUserId(userId: string, limit = 20) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
