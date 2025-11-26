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
            title: string | null;
            thumbnailUrl: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            viewCount: number;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            path: string;
            userId: string;
            url: string;
            mimeType: string;
            downloadCount: number;
            bucket: string;
            filename: string;
            size: number;
            width: number | null;
            height: number | null;
            alt: string | null;
            folderId: string | null;
            fileType: import("@prisma/client").$Enums.FileType;
            originalName: string;
            etag: string | null;
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
            title: string | null;
            thumbnailUrl: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            viewCount: number;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            path: string;
            userId: string;
            url: string;
            mimeType: string;
            downloadCount: number;
            bucket: string;
            filename: string;
            size: number;
            width: number | null;
            height: number | null;
            alt: string | null;
            folderId: string | null;
            fileType: import("@prisma/client").$Enums.FileType;
            originalName: string;
            etag: string | null;
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
            title: string | null;
            thumbnailUrl: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            viewCount: number;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            path: string;
            userId: string;
            url: string;
            mimeType: string;
            downloadCount: number;
            bucket: string;
            filename: string;
            size: number;
            width: number | null;
            height: number | null;
            alt: string | null;
            folderId: string | null;
            fileType: import("@prisma/client").$Enums.FileType;
            originalName: string;
            etag: string | null;
        };
    }>;
    getFiles(page: number, limit: number, folderId: string, fileType: string, search: string, req: any): Promise<{
        success: boolean;
        data: {
            items: ({
                shares: {
                    id: string;
                    createdAt: Date;
                    password: string | null;
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
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    parentId: string | null;
                    color: string | null;
                    icon: string | null;
                    path: string;
                    userId: string;
                    isSystem: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                title: string | null;
                thumbnailUrl: string | null;
                visibility: import("@prisma/client").$Enums.FileVisibility;
                viewCount: number;
                tags: string[];
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                path: string;
                userId: string;
                url: string;
                mimeType: string;
                downloadCount: number;
                bucket: string;
                filename: string;
                size: number;
                width: number | null;
                height: number | null;
                alt: string | null;
                folderId: string | null;
                fileType: import("@prisma/client").$Enums.FileType;
                originalName: string;
                etag: string | null;
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
            title: string | null;
            thumbnailUrl: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            viewCount: number;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            path: string;
            userId: string;
            url: string;
            mimeType: string;
            downloadCount: number;
            bucket: string;
            filename: string;
            size: number;
            width: number | null;
            height: number | null;
            alt: string | null;
            folderId: string | null;
            fileType: import("@prisma/client").$Enums.FileType;
            originalName: string;
            etag: string | null;
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
                type: "VIDEO" | "AUDIO" | "IMAGE" | "DOCUMENT" | "OTHER" | "ARCHIVE";
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
