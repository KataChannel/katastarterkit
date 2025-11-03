import { FileService } from '../services/file.service';
import { UpdateFileInput } from '../graphql/inputs/file.input';
export declare class FileController {
    private fileService;
    constructor(fileService: FileService);
    uploadFile(file: Express.Multer.File, folderId: string, metadataStr: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            size: number;
            title: string | null;
            tags: string[];
            viewCount: number;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            filename: string;
            url: string;
            mimeType: string;
            width: number | null;
            path: string;
            height: number | null;
            bucket: string;
            alt: string | null;
            folderId: string | null;
            fileType: import("@prisma/client").$Enums.FileType;
            originalName: string;
            etag: string | null;
            thumbnailUrl: string | null;
            downloadCount: number;
        };
        message: string;
    }>;
    uploadFiles(files: Express.Multer.File[], folderId: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            size: number;
            title: string | null;
            tags: string[];
            viewCount: number;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            filename: string;
            url: string;
            mimeType: string;
            width: number | null;
            path: string;
            height: number | null;
            bucket: string;
            alt: string | null;
            folderId: string | null;
            fileType: import("@prisma/client").$Enums.FileType;
            originalName: string;
            etag: string | null;
            thumbnailUrl: string | null;
            downloadCount: number;
        }[];
        message: string;
    }>;
    getFile(id: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            size: number;
            title: string | null;
            tags: string[];
            viewCount: number;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            filename: string;
            url: string;
            mimeType: string;
            width: number | null;
            path: string;
            height: number | null;
            bucket: string;
            alt: string | null;
            folderId: string | null;
            fileType: import("@prisma/client").$Enums.FileType;
            originalName: string;
            etag: string | null;
            thumbnailUrl: string | null;
            downloadCount: number;
        };
    }>;
    getFiles(page: number, limit: number, folderId: string, fileType: string, search: string, req: any): Promise<{
        success: boolean;
        data: {
            items: ({
                shares: {
                    id: string;
                    password: string | null;
                    createdAt: Date;
                    expiresAt: Date | null;
                    token: string;
                    sharedBy: string;
                    sharedWith: string | null;
                    fileId: string;
                    canDownload: boolean;
                    canView: boolean;
                    accessCount: number;
                    lastAccess: Date | null;
                }[];
                folder: {
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    parentId: string | null;
                    userId: string;
                    icon: string | null;
                    color: string | null;
                    path: string;
                    isSystem: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                userId: string;
                size: number;
                title: string | null;
                tags: string[];
                viewCount: number;
                visibility: import("@prisma/client").$Enums.FileVisibility;
                filename: string;
                url: string;
                mimeType: string;
                width: number | null;
                path: string;
                height: number | null;
                bucket: string;
                alt: string | null;
                folderId: string | null;
                fileType: import("@prisma/client").$Enums.FileType;
                originalName: string;
                etag: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            size: number;
            title: string | null;
            tags: string[];
            viewCount: number;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            filename: string;
            url: string;
            mimeType: string;
            width: number | null;
            path: string;
            height: number | null;
            bucket: string;
            alt: string | null;
            folderId: string | null;
            fileType: import("@prisma/client").$Enums.FileType;
            originalName: string;
            etag: string | null;
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
                type: "IMAGE" | "VIDEO" | "DOCUMENT" | "OTHER" | "AUDIO" | "ARCHIVE";
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
