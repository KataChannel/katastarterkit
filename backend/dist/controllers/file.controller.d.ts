import { FileService } from '../services/file.service';
import { UpdateFileInput } from '../graphql/inputs/file.input';
export declare class FileController {
    private fileService;
    constructor(fileService: FileService);
    uploadFile(file: Express.Multer.File, folderId: string, metadataStr: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            path: string;
            title: string | null;
            viewCount: number;
            url: string;
            alt: string | null;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            fileType: import("@prisma/client").$Enums.FileType;
            bucket: string;
            etag: string | null;
            folderId: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            width: number | null;
            height: number | null;
            thumbnailUrl: string | null;
            downloadCount: number;
        };
        message: string;
    }>;
    uploadFiles(files: Express.Multer.File[], folderId: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            path: string;
            title: string | null;
            viewCount: number;
            url: string;
            alt: string | null;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            fileType: import("@prisma/client").$Enums.FileType;
            bucket: string;
            etag: string | null;
            folderId: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            width: number | null;
            height: number | null;
            thumbnailUrl: string | null;
            downloadCount: number;
        }[];
        message: string;
    }>;
    getFile(id: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            path: string;
            title: string | null;
            viewCount: number;
            url: string;
            alt: string | null;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            fileType: import("@prisma/client").$Enums.FileType;
            bucket: string;
            etag: string | null;
            folderId: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            width: number | null;
            height: number | null;
            thumbnailUrl: string | null;
            downloadCount: number;
        };
    }>;
    getFiles(page: number, limit: number, folderId: string, fileType: string, search: string, req: any): Promise<{
        success: boolean;
        data: {
            items: ({
                folder: {
                    id: string;
                    userId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    path: string;
                    icon: string | null;
                    parentId: string | null;
                    color: string | null;
                    isSystem: boolean;
                };
                shares: {
                    id: string;
                    createdAt: Date;
                    password: string | null;
                    fileId: string;
                    sharedBy: string;
                    sharedWith: string | null;
                    token: string;
                    expiresAt: Date | null;
                    canDownload: boolean;
                    canView: boolean;
                    accessCount: number;
                    lastAccess: Date | null;
                }[];
            } & {
                id: string;
                userId: string;
                tags: string[];
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                path: string;
                title: string | null;
                viewCount: number;
                url: string;
                alt: string | null;
                filename: string;
                originalName: string;
                mimeType: string;
                size: number;
                fileType: import("@prisma/client").$Enums.FileType;
                bucket: string;
                etag: string | null;
                folderId: string | null;
                visibility: import("@prisma/client").$Enums.FileVisibility;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                width: number | null;
                height: number | null;
                thumbnailUrl: string | null;
                downloadCount: number;
            })[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    updateFile(id: string, input: Partial<UpdateFileInput>, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            path: string;
            title: string | null;
            viewCount: number;
            url: string;
            alt: string | null;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            fileType: import("@prisma/client").$Enums.FileType;
            bucket: string;
            etag: string | null;
            folderId: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            width: number | null;
            height: number | null;
            thumbnailUrl: string | null;
            downloadCount: number;
        };
        message: string;
    }>;
    deleteFile(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getStorageStats(req: any): Promise<{
        success: boolean;
        data: {
            totalFiles: number;
            totalSize: number;
            totalFolders: number;
            filesByType: {
                type: "VIDEO" | "IMAGE" | "AUDIO" | "DOCUMENT" | "ARCHIVE" | "OTHER";
                count: number;
                totalSize: number;
            }[];
            filesByVisibility: {
                visibility: "PUBLIC" | "PRIVATE" | "SHARED";
                count: number;
            }[];
        };
    }>;
}
