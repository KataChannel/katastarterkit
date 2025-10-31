import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatBotRuleService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        name: string;
        isActive: boolean;
        priority: number;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        successRate: number | null;
        pattern: string | null;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
        platform: import("@prisma/client").$Enums.IntegrationPlatform[];
        keywords: string[];
        responseType: string;
        responseContent: string;
        responseData: import("@prisma/client/runtime/library").JsonValue | null;
        useAI: boolean;
        aiPrompt: string | null;
        triggerCount: number;
    }[]>;
    matchRule(message: string, platform: string): Promise<{
        name: string;
        isActive: boolean;
        priority: number;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        successRate: number | null;
        pattern: string | null;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
        platform: import("@prisma/client").$Enums.IntegrationPlatform[];
        keywords: string[];
        responseType: string;
        responseContent: string;
        responseData: import("@prisma/client/runtime/library").JsonValue | null;
        useAI: boolean;
        aiPrompt: string | null;
        triggerCount: number;
    }>;
}
