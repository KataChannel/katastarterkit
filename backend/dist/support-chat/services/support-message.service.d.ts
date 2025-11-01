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
    }): Promise<any>;
    generateAIResponse(conversationId: string): Promise<void>;
    findByConversation(conversationId: string, params?: {
        skip?: number;
        take?: number;
    }): Promise<any>;
    markAsRead(messageId: string): Promise<any>;
    markConversationMessagesAsRead(conversationId: string, userId: string): Promise<any>;
    updateMessage(messageId: string, content: string): Promise<any>;
    delete(id: string): Promise<any>;
    getUnreadCount(conversationId: string, userId: string): Promise<any>;
}
