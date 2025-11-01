import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatBotRuleService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        description: string | null;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
        priority: number;
        responseType: string;
        pattern: string | null;
        platform: import("@prisma/client").$Enums.IntegrationPlatform[];
        successRate: number | null;
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
        isActive: boolean;
        name: string;
        updatedAt: Date;
        description: string | null;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
        priority: number;
        responseType: string;
        pattern: string | null;
        platform: import("@prisma/client").$Enums.IntegrationPlatform[];
        successRate: number | null;
        keywords: string[];
        responseContent: string;
        responseData: import("@prisma/client/runtime/library").JsonValue | null;
        useAI: boolean;
        aiPrompt: string | null;
        triggerCount: number;
    }>;
}
