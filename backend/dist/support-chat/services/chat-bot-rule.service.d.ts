import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatBotRuleService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        priority: number;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
        pattern: string | null;
        platform: import("@prisma/client").$Enums.IntegrationPlatform[];
        successRate: number | null;
        keywords: string[];
        responseType: string;
        responseContent: string;
        responseData: import("@prisma/client/runtime/library").JsonValue | null;
        useAI: boolean;
        aiPrompt: string | null;
        triggerCount: number;
    }[]>;
    matchRule(message: string, platform: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        priority: number;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
        pattern: string | null;
        platform: import("@prisma/client").$Enums.IntegrationPlatform[];
        successRate: number | null;
        keywords: string[];
        responseType: string;
        responseContent: string;
        responseData: import("@prisma/client/runtime/library").JsonValue | null;
        useAI: boolean;
        aiPrompt: string | null;
        triggerCount: number;
    }>;
}
