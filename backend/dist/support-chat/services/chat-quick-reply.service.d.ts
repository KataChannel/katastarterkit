import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatQuickReplyService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        isActive: boolean;
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        message: string;
        title: string;
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }[]>;
    create(data: any): Promise<{
        isActive: boolean;
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        message: string;
        title: string;
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }>;
    incrementUsage(id: string): Promise<{
        isActive: boolean;
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        message: string;
        title: string;
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }>;
}
