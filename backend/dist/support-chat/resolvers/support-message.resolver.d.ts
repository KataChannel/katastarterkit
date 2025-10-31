import { SupportMessageService } from '../services/support-message.service';
import { CreateSupportMessageInput } from '../dto/support-message.input';
export declare class SupportMessageResolver {
    private messageService;
    constructor(messageService: SupportMessageService);
    supportMessages(conversationId: string): Promise<({
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
    sendSupportMessage(input: CreateSupportMessageInput): Promise<{
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
    markMessagesAsRead(conversationId: string, userId: string): Promise<number>;
}
