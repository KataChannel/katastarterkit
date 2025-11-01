import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatBotRuleService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        name: string;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        isActive: boolean;
        priority: number;
        platform: import("@prisma/client").$Enums.IntegrationPlatform[];
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
        successRate: number | null;
        responseType: string;
        pattern: string | null;
        keywords: string[];
        responseContent: string;
        responseData: import("@prisma/client/runtime/library").JsonValue | null;
        useAI: boolean;
        aiPrompt: string | null;
        triggerCount: number;
    }[]>;
    matchRule(message: string, platform: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        isActive: boolean;
        priority: number;
        platform: import("@prisma/client").$Enums.IntegrationPlatform[];
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
        successRate: number | null;
        responseType: string;
        pattern: string | null;
        keywords: string[];
        responseContent: string;
        responseData: import("@prisma/client/runtime/library").JsonValue | null;
        useAI: boolean;
        aiPrompt: string | null;
        triggerCount: number;
    }>;
}
