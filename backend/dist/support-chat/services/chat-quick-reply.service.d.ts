import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatQuickReplyService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        isActive: boolean;
        message: string;
        category: string | null;
        title: string;
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }[]>;
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        isActive: boolean;
        message: string;
        category: string | null;
        title: string;
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }>;
    incrementUsage(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        isActive: boolean;
        message: string;
        category: string | null;
        title: string;
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }>;
}
