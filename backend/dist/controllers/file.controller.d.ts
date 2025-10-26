import { FileService } from '../services/file.service';
import { UpdateFileInput } from '../graphql/inputs/file.input';
export declare class FileController {
    private fileService;
    constructor(fileService: FileService);
    uploadFile(file: Express.Multer.File, folderId: string, metadataStr: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            description: string | null;
            title: string | null;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            url: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            path: string;
            size: number;
            filename: string;
            mimeType: string;
            width: number | null;
            etag: string | null;
            bucket: string;
            alt: string | null;
            folderId: string | null;
            visibility: import(".prisma/client").$Enums.FileVisibility;
            fileType: import(".prisma/client").$Enums.FileType;
            originalName: string;
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
            id: string;
            description: string | null;
            title: string | null;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            url: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            path: string;
            size: number;
            filename: string;
            mimeType: string;
            width: number | null;
            etag: string | null;
            bucket: string;
            alt: string | null;
            folderId: string | null;
            visibility: import(".prisma/client").$Enums.FileVisibility;
            fileType: import(".prisma/client").$Enums.FileType;
            originalName: string;
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
            id: string;
            description: string | null;
            title: string | null;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            url: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            path: string;
            size: number;
            filename: string;
            mimeType: string;
            width: number | null;
            etag: string | null;
            bucket: string;
            alt: string | null;
            folderId: string | null;
            visibility: import(".prisma/client").$Enums.FileVisibility;
            fileType: import(".prisma/client").$Enums.FileType;
            originalName: string;
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
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    userId: string;
                    parentId: string | null;
                    path: string;
                    icon: string | null;
                    color: string | null;
                    isSystem: boolean;
                };
            } & {
                id: string;
                description: string | null;
                title: string | null;
                tags: string[];
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                url: string;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                path: string;
                size: number;
                filename: string;
                mimeType: string;
                width: number | null;
                etag: string | null;
                bucket: string;
                alt: string | null;
                folderId: string | null;
                visibility: import(".prisma/client").$Enums.FileVisibility;
                fileType: import(".prisma/client").$Enums.FileType;
                originalName: string;
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
            id: string;
            description: string | null;
            title: string | null;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            url: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            path: string;
            size: number;
            filename: string;
            mimeType: string;
            width: number | null;
            etag: string | null;
            bucket: string;
            alt: string | null;
            folderId: string | null;
            visibility: import(".prisma/client").$Enums.FileVisibility;
            fileType: import(".prisma/client").$Enums.FileType;
            originalName: string;
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
