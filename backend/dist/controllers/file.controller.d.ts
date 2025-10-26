import { FileService } from '../services/file.service';
import { UpdateFileInput } from '../graphql/inputs/file.input';
export declare class FileController {
    private fileService;
    constructor(fileService: FileService);
    uploadFile(file: Express.Multer.File, folderId: string, metadataStr: string, req: any): Promise<{
        success: boolean;
        data: {
            path: string;
            size: number;
            createdAt: Date;
            userId: string;
            id: string;
            updatedAt: Date;
            title: string | null;
            tags: string[];
            description: string | null;
            url: string;
            filename: string;
            mimeType: string;
            bucket: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            etag: string | null;
            folderId: string | null;
            originalName: string;
            fileType: import(".prisma/client").$Enums.FileType;
            visibility: import(".prisma/client").$Enums.FileVisibility;
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
            path: string;
            size: number;
            createdAt: Date;
            userId: string;
            id: string;
            updatedAt: Date;
            title: string | null;
            tags: string[];
            description: string | null;
            url: string;
            filename: string;
            mimeType: string;
            bucket: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            etag: string | null;
            folderId: string | null;
            originalName: string;
            fileType: import(".prisma/client").$Enums.FileType;
            visibility: import(".prisma/client").$Enums.FileVisibility;
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
            path: string;
            size: number;
            createdAt: Date;
            userId: string;
            id: string;
            updatedAt: Date;
            title: string | null;
            tags: string[];
            description: string | null;
            url: string;
            filename: string;
            mimeType: string;
            bucket: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            etag: string | null;
            folderId: string | null;
            originalName: string;
            fileType: import(".prisma/client").$Enums.FileType;
            visibility: import(".prisma/client").$Enums.FileVisibility;
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
                    password: string | null;
                    token: string;
                    createdAt: Date;
                    id: string;
                    expiresAt: Date | null;
                    sharedBy: string;
                    sharedWith: string | null;
                    canDownload: boolean;
                    canView: boolean;
                    accessCount: number;
                    lastAccess: Date | null;
                    fileId: string;
                }[];
                folder: {
                    path: string;
                    createdAt: Date;
                    userId: string;
                    name: string;
                    id: string;
                    updatedAt: Date;
                    parentId: string | null;
                    description: string | null;
                    icon: string | null;
                    color: string | null;
                    isSystem: boolean;
                };
            } & {
                path: string;
                size: number;
                createdAt: Date;
                userId: string;
                id: string;
                updatedAt: Date;
                title: string | null;
                tags: string[];
                description: string | null;
                url: string;
                filename: string;
                mimeType: string;
                bucket: string;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                etag: string | null;
                folderId: string | null;
                originalName: string;
                fileType: import(".prisma/client").$Enums.FileType;
                visibility: import(".prisma/client").$Enums.FileVisibility;
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
            path: string;
            size: number;
            createdAt: Date;
            userId: string;
            id: string;
            updatedAt: Date;
            title: string | null;
            tags: string[];
            description: string | null;
            url: string;
            filename: string;
            mimeType: string;
            bucket: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            etag: string | null;
            folderId: string | null;
            originalName: string;
            fileType: import(".prisma/client").$Enums.FileType;
            visibility: import(".prisma/client").$Enums.FileVisibility;
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
