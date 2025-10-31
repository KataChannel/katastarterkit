import { PrismaService } from '../../prisma/prisma.service';
import { SupportMessageType, SupportSender } from '@prisma/client';
import { AIResponseService } from './ai-response.service';
export declare class SupportMessageService {
    private prisma;
    private aiResponseService;
    private readonly logger;
    constructor(prisma: PrismaService, aiResponseService: AIResponseService);
    createMessage(data: {
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
    }, options?: {
        autoAIResponse?: boolean;
    }): Promise<{
        sender: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
        attachments: {
            id: string;
            createdAt: Date;
            conversationId: string | null;
            messageId: string | null;
            fileName: string;
            fileSize: number;
            fileType: string;
            fileUrl: string;
            thumbnailUrl: string | null;
            uploadedById: string | null;
        }[];
    } & {
        id: string;
        messageType: import("@prisma/client").$Enums.SupportMessageType;
        content: string;
        senderType: import("@prisma/client").$Enums.SupportSender;
        senderName: string | null;
        isAIGenerated: boolean;
        aiConfidence: number | null;
        aiSuggestions: import("@prisma/client/runtime/library").JsonValue | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
        readAt: Date | null;
        isEdited: boolean;
        editedAt: Date | null;
        sentAt: Date;
        createdAt: Date;
        updatedAt: Date;
        conversationId: string;
        senderId: string | null;
    }>;
    generateAIResponse(conversationId: string): Promise<void>;
    findByConversation(conversationId: string, params?: {
        skip?: number;
        take?: number;
    }): Promise<({
        sender: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
        attachments: {
            id: string;
            createdAt: Date;
            conversationId: string | null;
            messageId: string | null;
            fileName: string;
            fileSize: number;
            fileType: string;
            fileUrl: string;
            thumbnailUrl: string | null;
            uploadedById: string | null;
        }[];
    } & {
        id: string;
        messageType: import("@prisma/client").$Enums.SupportMessageType;
        content: string;
        senderType: import("@prisma/client").$Enums.SupportSender;
        senderName: string | null;
        isAIGenerated: boolean;
        aiConfidence: number | null;
        aiSuggestions: import("@prisma/client/runtime/library").JsonValue | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
        readAt: Date | null;
        isEdited: boolean;
        editedAt: Date | null;
        sentAt: Date;
        createdAt: Date;
        updatedAt: Date;
        conversationId: string;
        senderId: string | null;
    })[]>;
    markAsRead(messageId: string): Promise<{
        id: string;
        messageType: import("@prisma/client").$Enums.SupportMessageType;
        content: string;
        senderType: import("@prisma/client").$Enums.SupportSender;
        senderName: string | null;
        isAIGenerated: boolean;
        aiConfidence: number | null;
        aiSuggestions: import("@prisma/client/runtime/library").JsonValue | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
        readAt: Date | null;
        isEdited: boolean;
        editedAt: Date | null;
        sentAt: Date;
        createdAt: Date;
        updatedAt: Date;
        conversationId: string;
        senderId: string | null;
    }>;
    markConversationMessagesAsRead(conversationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    updateMessage(messageId: string, content: string): Promise<{
        id: string;
        messageType: import("@prisma/client").$Enums.SupportMessageType;
        content: string;
        senderType: import("@prisma/client").$Enums.SupportSender;
        senderName: string | null;
        isAIGenerated: boolean;
        aiConfidence: number | null;
        aiSuggestions: import("@prisma/client/runtime/library").JsonValue | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
        readAt: Date | null;
        isEdited: boolean;
        editedAt: Date | null;
        sentAt: Date;
        createdAt: Date;
        updatedAt: Date;
        conversationId: string;
        senderId: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        messageType: import("@prisma/client").$Enums.SupportMessageType;
        content: string;
        senderType: import("@prisma/client").$Enums.SupportSender;
        senderName: string | null;
        isAIGenerated: boolean;
        aiConfidence: number | null;
        aiSuggestions: import("@prisma/client/runtime/library").JsonValue | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
        readAt: Date | null;
        isEdited: boolean;
        editedAt: Date | null;
        sentAt: Date;
        createdAt: Date;
        updatedAt: Date;
        conversationId: string;
        senderId: string | null;
    }>;
    getUnreadCount(conversationId: string, userId: string): Promise<number>;
}
