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
            messageId: string | null;
            fileName: string;
            fileSize: number;
            conversationId: string | null;
            fileType: string;
            thumbnailUrl: string | null;
            fileUrl: string;
            uploadedById: string | null;
        }[];
    } & {
        id: string;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        content: string;
        isEdited: boolean;
        editedAt: Date | null;
        createdAt: Date;
        senderId: string | null;
        isRead: boolean;
        conversationId: string;
        readAt: Date | null;
        sentAt: Date;
        messageType: import("@prisma/client").$Enums.SupportMessageType;
        senderType: import("@prisma/client").$Enums.SupportSender;
        senderName: string | null;
        isAIGenerated: boolean;
        aiConfidence: number | null;
        aiSuggestions: import("@prisma/client/runtime/library").JsonValue | null;
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
            messageId: string | null;
            fileName: string;
            fileSize: number;
            conversationId: string | null;
            fileType: string;
            thumbnailUrl: string | null;
            fileUrl: string;
            uploadedById: string | null;
        }[];
    } & {
        id: string;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        content: string;
        isEdited: boolean;
        editedAt: Date | null;
        createdAt: Date;
        senderId: string | null;
        isRead: boolean;
        conversationId: string;
        readAt: Date | null;
        sentAt: Date;
        messageType: import("@prisma/client").$Enums.SupportMessageType;
        senderType: import("@prisma/client").$Enums.SupportSender;
        senderName: string | null;
        isAIGenerated: boolean;
        aiConfidence: number | null;
        aiSuggestions: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    markAsRead(messageId: string): Promise<{
        id: string;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        content: string;
        isEdited: boolean;
        editedAt: Date | null;
        createdAt: Date;
        senderId: string | null;
        isRead: boolean;
        conversationId: string;
        readAt: Date | null;
        sentAt: Date;
        messageType: import("@prisma/client").$Enums.SupportMessageType;
        senderType: import("@prisma/client").$Enums.SupportSender;
        senderName: string | null;
        isAIGenerated: boolean;
        aiConfidence: number | null;
        aiSuggestions: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    markConversationMessagesAsRead(conversationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    updateMessage(messageId: string, content: string): Promise<{
        id: string;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        content: string;
        isEdited: boolean;
        editedAt: Date | null;
        createdAt: Date;
        senderId: string | null;
        isRead: boolean;
        conversationId: string;
        readAt: Date | null;
        sentAt: Date;
        messageType: import("@prisma/client").$Enums.SupportMessageType;
        senderType: import("@prisma/client").$Enums.SupportSender;
        senderName: string | null;
        isAIGenerated: boolean;
        aiConfidence: number | null;
        aiSuggestions: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        content: string;
        isEdited: boolean;
        editedAt: Date | null;
        createdAt: Date;
        senderId: string | null;
        isRead: boolean;
        conversationId: string;
        readAt: Date | null;
        sentAt: Date;
        messageType: import("@prisma/client").$Enums.SupportMessageType;
        senderType: import("@prisma/client").$Enums.SupportSender;
        senderName: string | null;
        isAIGenerated: boolean;
        aiConfidence: number | null;
        aiSuggestions: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getUnreadCount(conversationId: string, userId: string): Promise<number>;
}
