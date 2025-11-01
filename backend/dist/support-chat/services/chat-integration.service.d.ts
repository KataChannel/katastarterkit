import { PrismaService } from '../../prisma/prisma.service';
import { IntegrationPlatform } from '@prisma/client';
export declare class ChatIntegrationService {
    private prisma;
    constructor(prisma: PrismaService);
    getIntegration(platform: IntegrationPlatform): Promise<any>;
    getAllIntegrations(): Promise<any>;
    createOrUpdate(data: {
        platform: IntegrationPlatform;
        isEnabled: boolean;
        appId?: string;
        appSecret?: string;
        accessToken?: string;
        refreshToken?: string;
        webhookSecret?: string;
        config?: any;
    }): Promise<any>;
    verifyWebhook(platform: IntegrationPlatform): Promise<any>;
    updateSyncStatus(platform: IntegrationPlatform, status: string, error?: string): Promise<any>;
    sendZaloMessage(userId: string, message: string): Promise<any>;
    sendFacebookMessage(recipientId: string, message: string): Promise<any>;
}
