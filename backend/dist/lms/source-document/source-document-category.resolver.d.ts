import { SourceDocumentCategoryService } from './source-document-category.service';
import { CreateSourceDocumentCategoryInput, UpdateSourceDocumentCategoryInput } from './dto/source-document.dto';
export declare class SourceDocumentCategoryResolver {
    private readonly categoryService;
    constructor(categoryService: SourceDocumentCategoryService);
    createSourceDocumentCategory(input: CreateSourceDocumentCategoryInput): Promise<{
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
    sourceDocumentCategories(): Promise<({
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
    sourceDocumentCategory(id: string): Promise<{
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
    updateSourceDocumentCategory(id: string, input: UpdateSourceDocumentCategoryInput): Promise<{
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
    deleteSourceDocumentCategory(id: string): Promise<{
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
    sourceDocumentCategoryTree(): Promise<({
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
