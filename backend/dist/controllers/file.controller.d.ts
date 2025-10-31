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
            userId: string;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            fileType: import("@prisma/client").$Enums.FileType;
            thumbnailUrl: string | null;
            description: string | null;
            viewCount: number;
            title: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            url: string;
            alt: string | null;
            path: string;
            bucket: string;
            filename: string;
            size: number;
            folderId: string | null;
            originalName: string;
            mimeType: string;
            etag: string | null;
            width: number | null;
            height: number | null;
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
            userId: string;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            fileType: import("@prisma/client").$Enums.FileType;
            thumbnailUrl: string | null;
            description: string | null;
            viewCount: number;
            title: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            url: string;
            alt: string | null;
            path: string;
            bucket: string;
            filename: string;
            size: number;
            folderId: string | null;
            originalName: string;
            mimeType: string;
            etag: string | null;
            width: number | null;
            height: number | null;
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
            userId: string;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            fileType: import("@prisma/client").$Enums.FileType;
            thumbnailUrl: string | null;
            description: string | null;
            viewCount: number;
            title: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            url: string;
            alt: string | null;
            path: string;
            bucket: string;
            filename: string;
            size: number;
            folderId: string | null;
            originalName: string;
            mimeType: string;
            etag: string | null;
            width: number | null;
            height: number | null;
            downloadCount: number;
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
                    fileId: string;
                    token: string;
                    sharedBy: string;
                    sharedWith: string | null;
                    canDownload: boolean;
                    canView: boolean;
                    accessCount: number;
                    lastAccess: Date | null;
                }[];
                folder: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    name: string;
                    description: string | null;
                    parentId: string | null;
                    icon: string | null;
                    color: string | null;
                    path: string;
                    isSystem: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                tags: string[];
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                fileType: import("@prisma/client").$Enums.FileType;
                thumbnailUrl: string | null;
                description: string | null;
                viewCount: number;
                title: string | null;
                visibility: import("@prisma/client").$Enums.FileVisibility;
                url: string;
                alt: string | null;
                path: string;
                bucket: string;
                filename: string;
                size: number;
                folderId: string | null;
                originalName: string;
                mimeType: string;
                etag: string | null;
                width: number | null;
                height: number | null;
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
            userId: string;
            tags: string[];
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            fileType: import("@prisma/client").$Enums.FileType;
            thumbnailUrl: string | null;
            description: string | null;
            viewCount: number;
            title: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            url: string;
            alt: string | null;
            path: string;
            bucket: string;
            filename: string;
            size: number;
            folderId: string | null;
            originalName: string;
            mimeType: string;
            etag: string | null;
            width: number | null;
            height: number | null;
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
                type: "IMAGE" | "AUDIO" | "VIDEO" | "OTHER" | "DOCUMENT" | "ARCHIVE";
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
