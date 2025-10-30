import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SupportMessageType, SupportSender } from '@prisma/client';

@Injectable()
export class SupportMessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(data: {
    conversationId: string;
    content: string;
    messageType?: SupportMessageType;
    senderType: SupportSender;
    senderId?: string;
    senderName?: string;
    isAIGenerated?: boolean;
    aiConfidence?: number;
    aiSuggestions?: any;
    metadata?: any;
  }) {
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

    // Update conversation's last message info
    await this.prisma.supportConversation.update({
      where: { id: data.conversationId },
      data: {
        lastMessageAt: new Date(),
        lastMessagePreview: data.content.substring(0, 100),
      },
    });

    return message;
  }

  async findByConversation(conversationId: string, params?: {
    skip?: number;
    take?: number;
  }) {
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

  async markAsRead(messageId: string) {
    return this.prisma.supportMessage.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markConversationMessagesAsRead(conversationId: string, userId: string) {
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

  async updateMessage(messageId: string, content: string) {
    return this.prisma.supportMessage.update({
      where: { id: messageId },
      data: {
        content,
        isEdited: true,
        editedAt: new Date(),
      },
    });
  }

  async delete(id: string) {
    return this.prisma.supportMessage.delete({
      where: { id },
    });
  }

  async getUnreadCount(conversationId: string, userId: string) {
    return this.prisma.supportMessage.count({
      where: {
        conversationId,
        isRead: false,
        senderId: { not: userId },
      },
    });
  }
}
