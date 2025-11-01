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
    markMessagesAsRead(conversationId: string, userId: string): Promise<number>;
}
