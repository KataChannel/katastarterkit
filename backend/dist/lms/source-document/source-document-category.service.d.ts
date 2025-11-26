import { PrismaService } from '../../prisma/prisma.service';
import { CreateSourceDocumentCategoryInput, UpdateSourceDocumentCategoryInput } from './dto/source-document.dto';
export declare class SourceDocumentCategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(input: CreateSourceDocumentCategoryInput): Promise<{
        parent: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            color: string | null;
            icon: string | null;
        };
        children: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            color: string | null;
            icon: string | null;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        color: string | null;
        icon: string | null;
    }>;
    findAll(): Promise<({
        _count: {
            sourceDocuments: number;
        };
        parent: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            color: string | null;
            icon: string | null;
        };
        children: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            color: string | null;
            icon: string | null;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        color: string | null;
        icon: string | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            sourceDocuments: number;
        };
        sourceDocuments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            content: string | null;
            thumbnailUrl: string | null;
            status: import("@prisma/client").$Enums.SourceDocumentStatus;
            viewCount: number;
            publishedAt: Date | null;
            tags: string[];
            type: import("@prisma/client").$Enums.SourceDocumentType;
            categoryId: string | null;
            duration: number | null;
            approvalRequested: boolean;
            approvalRequestedAt: Date | null;
            approvedBy: string | null;
            approvedAt: Date | null;
            rejectionReason: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            url: string | null;
            fileName: string | null;
            fileSize: bigint | null;
            mimeType: string | null;
            approvalRequestedBy: string | null;
            aiSummary: string | null;
            aiKeywords: string[];
            aiTopics: string[];
            aiAnalyzedAt: Date | null;
            isAiAnalyzed: boolean;
            downloadCount: number;
            usageCount: number;
        }[];
        parent: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            color: string | null;
            icon: string | null;
        };
        children: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            color: string | null;
            icon: string | null;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        color: string | null;
        icon: string | null;
    }>;
    update(id: string, input: UpdateSourceDocumentCategoryInput): Promise<{
        parent: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            color: string | null;
            icon: string | null;
        };
        children: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            color: string | null;
            icon: string | null;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        color: string | null;
        icon: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        color: string | null;
        icon: string | null;
    }>;
    getTree(): Promise<({
        _count: {
            sourceDocuments: number;
        };
        children: ({
            _count: {
                sourceDocuments: number;
            };
            children: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                parentId: string | null;
                color: string | null;
                icon: string | null;
            }[];
        } & {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            color: string | null;
            icon: string | null;
        })[];
    } & {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        color: string | null;
        icon: string | null;
    })[]>;
}
