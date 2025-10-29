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
            size: number;
            userId: string;
            updatedAt: Date;
            tags: string[];
            title: string | null;
            description: string | null;
            filename: string;
            url: string;
            mimeType: string;
            width: number | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            viewCount: number;
            path: string;
            alt: string | null;
            folderId: string | null;
            visibility: import(".prisma/client").$Enums.FileVisibility;
            fileType: import(".prisma/client").$Enums.FileType;
            originalName: string;
            bucket: string;
            etag: string | null;
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
            createdAt: Date;
            size: number;
            userId: string;
            updatedAt: Date;
            tags: string[];
            title: string | null;
            description: string | null;
            filename: string;
            url: string;
            mimeType: string;
            width: number | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            viewCount: number;
            path: string;
            alt: string | null;
            folderId: string | null;
            visibility: import(".prisma/client").$Enums.FileVisibility;
            fileType: import(".prisma/client").$Enums.FileType;
            originalName: string;
            bucket: string;
            etag: string | null;
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
            createdAt: Date;
            size: number;
            userId: string;
            updatedAt: Date;
            tags: string[];
            title: string | null;
            description: string | null;
            filename: string;
            url: string;
            mimeType: string;
            width: number | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            viewCount: number;
            path: string;
            alt: string | null;
            folderId: string | null;
            visibility: import(".prisma/client").$Enums.FileVisibility;
            fileType: import(".prisma/client").$Enums.FileType;
            originalName: string;
            bucket: string;
            etag: string | null;
            height: number | null;
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
                    createdAt: Date;
                    token: string;
                    expiresAt: Date | null;
                    password: string | null;
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
                    createdAt: Date;
                    userId: string;
                    name: string;
                    updatedAt: Date;
                    parentId: string | null;
                    description: string | null;
                    color: string | null;
                    icon: string | null;
                    path: string;
                    isSystem: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                size: number;
                userId: string;
                updatedAt: Date;
                tags: string[];
                title: string | null;
                description: string | null;
                filename: string;
                url: string;
                mimeType: string;
                width: number | null;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                viewCount: number;
                path: string;
                alt: string | null;
                folderId: string | null;
                visibility: import(".prisma/client").$Enums.FileVisibility;
                fileType: import(".prisma/client").$Enums.FileType;
                originalName: string;
                bucket: string;
                etag: string | null;
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
            createdAt: Date;
            size: number;
            userId: string;
            updatedAt: Date;
            tags: string[];
            title: string | null;
            description: string | null;
            filename: string;
            url: string;
            mimeType: string;
            width: number | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            viewCount: number;
            path: string;
            alt: string | null;
            folderId: string | null;
            visibility: import(".prisma/client").$Enums.FileVisibility;
            fileType: import(".prisma/client").$Enums.FileType;
            originalName: string;
            bucket: string;
            etag: string | null;
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
