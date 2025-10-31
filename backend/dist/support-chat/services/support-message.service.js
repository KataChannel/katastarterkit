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
exports.SupportMessageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SupportMessageService = class SupportMessageService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMessage(data) {
        const message = await this.prisma.supportMessage.create({
            data: {
                ...data,
                sentAt: new Date(),
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                attachments: true,
            },
        });
        await this.prisma.supportConversation.update({
            where: { id: data.conversationId },
            data: {
                lastMessageAt: new Date(),
                lastMessagePreview: data.content.substring(0, 100),
            },
        });
        return message;
    }
    async findByConversation(conversationId, params) {
        return this.prisma.supportMessage.findMany({
            where: { conversationId },
            skip: params?.skip,
            take: params?.take || 50,
            orderBy: { sentAt: 'asc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                attachments: true,
            },
        });
    }
    async markAsRead(messageId) {
        return this.prisma.supportMessage.update({
            where: { id: messageId },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async markConversationMessagesAsRead(conversationId, userId) {
        return this.prisma.supportMessage.updateMany({
            where: {
                conversationId,
                isRead: false,
                senderId: { not: userId },
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async updateMessage(messageId, content) {
        return this.prisma.supportMessage.update({
            where: { id: messageId },
            data: {
                content,
                isEdited: true,
                editedAt: new Date(),
            },
        });
    }
    async delete(id) {
        return this.prisma.supportMessage.delete({
            where: { id },
        });
    }
    async getUnreadCount(conversationId, userId) {
        return this.prisma.supportMessage.count({
            where: {
                conversationId,
                isRead: false,
                senderId: { not: userId },
            },
        });
    }
};
exports.SupportMessageService = SupportMessageService;
exports.SupportMessageService = SupportMessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupportMessageService);
//# sourceMappingURL=support-message.service.js.map