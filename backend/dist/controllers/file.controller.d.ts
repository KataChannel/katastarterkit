import { FileService } from '../services/file.service';
import { UpdateFileInput } from '../graphql/inputs/file.input';
export declare class FileController {
    private fileService;
    constructor(fileService: FileService);
    uploadFile(file: Express.Multer.File, folderId: string, metadataStr: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string | null;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            tags: string[];
            url: string;
            filename: string;
            size: number;
            mimeType: string;
            path: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            width: number | null;
            viewCount: number;
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
            title: string | null;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            tags: string[];
            url: string;
            filename: string;
            size: number;
            mimeType: string;
            path: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            width: number | null;
            viewCount: number;
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
            title: string | null;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            tags: string[];
            url: string;
            filename: string;
            size: number;
            mimeType: string;
            path: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            width: number | null;
            viewCount: number;
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
                    password: string | null;
                    expiresAt: Date | null;
                    sharedBy: string;
                    sharedWith: string | null;
                    token: string;
                    fileId: string;
                    canDownload: boolean;
                    canView: boolean;
                    accessCount: number;
                    lastAccess: Date | null;
                }[];
                folder: {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    parentId: string | null;
                    name: string;
                    path: string;
                    color: string | null;
                    icon: string | null;
                    isSystem: boolean;
                };
            } & {
                id: string;
                title: string | null;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                tags: string[];
                url: string;
                filename: string;
                size: number;
                mimeType: string;
                path: string;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                width: number | null;
                viewCount: number;
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
            title: string | null;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            tags: string[];
            url: string;
            filename: string;
            size: number;
            mimeType: string;
            path: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            width: number | null;
            viewCount: number;
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
                type: "OTHER" | "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO" | "ARCHIVE";
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
