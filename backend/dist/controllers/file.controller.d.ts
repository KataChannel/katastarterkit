import { FileService } from '../services/file.service';
import { UpdateFileInput } from '../graphql/inputs/file.input';
export declare class FileController {
    private fileService;
    constructor(fileService: FileService);
    uploadFile(file: Express.Multer.File, folderId: string, metadataStr: string, req: any): Promise<{
        success: boolean;
        data: {
            description: string | null;
            id: string;
            updatedAt: Date;
            path: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            userId: string;
            title: string | null;
            url: string;
            filename: string;
            size: number;
            mimeType: string;
            tags: string[];
            folderId: string | null;
            originalName: string;
            fileType: import("@prisma/client").$Enums.FileType;
            bucket: string;
            etag: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            alt: string | null;
            width: number | null;
            height: number | null;
            thumbnailUrl: string | null;
            downloadCount: number;
            viewCount: number;
        };
        message: string;
    }>;
    uploadFiles(files: Express.Multer.File[], folderId: string, req: any): Promise<{
        success: boolean;
        data: {
            description: string | null;
            id: string;
            updatedAt: Date;
            path: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            userId: string;
            title: string | null;
            url: string;
            filename: string;
            size: number;
            mimeType: string;
            tags: string[];
            folderId: string | null;
            originalName: string;
            fileType: import("@prisma/client").$Enums.FileType;
            bucket: string;
            etag: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            alt: string | null;
            width: number | null;
            height: number | null;
            thumbnailUrl: string | null;
            downloadCount: number;
            viewCount: number;
        }[];
        message: string;
    }>;
    getFile(id: string, req: any): Promise<{
        success: boolean;
        data: {
            description: string | null;
            id: string;
            updatedAt: Date;
            path: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            userId: string;
            title: string | null;
            url: string;
            filename: string;
            size: number;
            mimeType: string;
            tags: string[];
            folderId: string | null;
            originalName: string;
            fileType: import("@prisma/client").$Enums.FileType;
            bucket: string;
            etag: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            alt: string | null;
            width: number | null;
            height: number | null;
            thumbnailUrl: string | null;
            downloadCount: number;
            viewCount: number;
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
                    token: string;
                    fileId: string;
                    expiresAt: Date | null;
                    sharedBy: string;
                    sharedWith: string | null;
                    canDownload: boolean;
                    canView: boolean;
                    accessCount: number;
                    lastAccess: Date | null;
                }[];
                folder: {
                    name: string;
                    description: string | null;
                    id: string;
                    updatedAt: Date;
                    path: string;
                    createdAt: Date;
                    userId: string;
                    parentId: string | null;
                    color: string | null;
                    icon: string | null;
                    isSystem: boolean;
                };
            } & {
                description: string | null;
                id: string;
                updatedAt: Date;
                path: string;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                createdAt: Date;
                userId: string;
                title: string | null;
                url: string;
                filename: string;
                size: number;
                mimeType: string;
                tags: string[];
                folderId: string | null;
                originalName: string;
                fileType: import("@prisma/client").$Enums.FileType;
                bucket: string;
                etag: string | null;
                visibility: import("@prisma/client").$Enums.FileVisibility;
                alt: string | null;
                width: number | null;
                height: number | null;
                thumbnailUrl: string | null;
                downloadCount: number;
                viewCount: number;
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
            description: string | null;
            id: string;
            updatedAt: Date;
            path: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            userId: string;
            title: string | null;
            url: string;
            filename: string;
            size: number;
            mimeType: string;
            tags: string[];
            folderId: string | null;
            originalName: string;
            fileType: import("@prisma/client").$Enums.FileType;
            bucket: string;
            etag: string | null;
            visibility: import("@prisma/client").$Enums.FileVisibility;
            alt: string | null;
            width: number | null;
            height: number | null;
            thumbnailUrl: string | null;
            downloadCount: number;
            viewCount: number;
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
