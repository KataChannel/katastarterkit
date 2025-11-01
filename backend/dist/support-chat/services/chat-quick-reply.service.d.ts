import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatQuickReplyService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        category: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        isActive: boolean;
        message: string;
        title: string;
        tags: string[];
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }[]>;
    create(data: any): Promise<{
        category: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        isActive: boolean;
        message: string;
        title: string;
        tags: string[];
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }>;
    incrementUsage(id: string): Promise<{
        category: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        isActive: boolean;
        message: string;
        title: string;
        tags: string[];
        usageCount: number;
        shortcut: string;
        createdById: string | null;
    }>;
}
