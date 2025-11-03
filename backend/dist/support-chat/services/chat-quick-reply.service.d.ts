import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatQuickReplyService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        message: string;
        category: string | null;
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }[]>;
    create(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        message: string;
        category: string | null;
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }>;
    incrementUsage(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        message: string;
        category: string | null;
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }>;
}
