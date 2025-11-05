import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatQuickReplyService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        category: string | null;
        isActive: boolean;
        message: string;
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }[]>;
    create(data: any): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        category: string | null;
        isActive: boolean;
        message: string;
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }>;
    incrementUsage(id: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        category: string | null;
        isActive: boolean;
        message: string;
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }>;
}
