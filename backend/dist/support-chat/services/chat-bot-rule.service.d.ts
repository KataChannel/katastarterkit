import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatBotRuleService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        platform: import("@prisma/client").$Enums.IntegrationPlatform[];
        isActive: boolean;
        name: string;
        description: string | null;
        successRate: number | null;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        platform: import("@prisma/client").$Enums.IntegrationPlatform[];
        isActive: boolean;
        name: string;
        description: string | null;
        successRate: number | null;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
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
