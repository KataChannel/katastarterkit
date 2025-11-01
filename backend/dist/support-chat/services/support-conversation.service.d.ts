import { PrismaService } from '../../prisma/prisma.service';
import { SupportConversationStatus, IntegrationPlatform, TicketPriority } from '@prisma/client';
export declare class SupportConversationService {
    private prisma;
    constructor(prisma: PrismaService);
    createConversation(data: {
        customerId?: string;
        customerName?: string;
        customerEmail?: string;
        customerPhone?: string;
        customerIp?: string;
        platform?: IntegrationPlatform;
        platformUserId?: string;
        platformUserName?: string;
        subject?: string;
    }): Promise<any>;
    findAll(params?: {
        skip?: number;
        take?: number;
        where?: any;
        orderBy?: any;
    }): Promise<any>;
    findOne(id: string): Promise<any>;
    assignToAgent(conversationId: string, agentId: string): Promise<any>;
    updateStatus(conversationId: string, status: SupportConversationStatus): Promise<any>;
    updatePriority(conversationId: string, priority: TicketPriority): Promise<any>;
    addRating(conversationId: string, rating: number, feedback?: string): Promise<any>;
    getActiveConversations(agentId?: string): Promise<any>;
    getConversationByCode(conversationCode: string): Promise<any>;
    delete(id: string): Promise<any>;
}
