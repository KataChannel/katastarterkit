"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationService = class NotificationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTaskAssignedNotification(taskId, assignedUserId) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: { user: true },
        });
        if (!task)
            return;
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
    async createTaskCompletedNotification(taskId, userId) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                shares: {
                    where: { isActive: true },
                    include: { sharedWithUser: true },
                },
            },
        });
        if (!task)
            return;
        const notifications = task.shares.map(share => this.prisma.notification.create({
            data: {
                type: 'task_completed',
                title: 'Task Completed',
                message: `Task "${task.title}" has been completed`,
                data: { taskId },
                user: { connect: { id: share.sharedWith } },
            },
        }));
        return Promise.all(notifications);
    }
    async createTaskCommentNotification(taskId, commentAuthorId) {
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
        if (!task)
            return;
        const notifyUsers = new Set();
        if (task.userId !== commentAuthorId) {
            notifyUsers.add(task.userId);
        }
        task.shares.forEach(share => {
            if (share.sharedWith && share.sharedWith !== commentAuthorId) {
                notifyUsers.add(share.sharedWith);
            }
        });
        const notifications = Array.from(notifyUsers).map(userId => this.prisma.notification.create({
            data: {
                type: 'task_comment',
                title: 'New Comment',
                message: `New comment on task "${task.title}"`,
                data: { taskId },
                user: { connect: { id: userId } },
            },
        }));
        return Promise.all(notifications);
    }
    async findByUserId(userId, limit = 20) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async markAsRead(notificationId, userId) {
        return this.prisma.notification.updateMany({
            where: { id: notificationId, userId },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map