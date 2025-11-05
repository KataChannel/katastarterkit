import { PrismaService } from '../prisma/prisma.service';
import { MinioService } from './minio.service';
import { File, FileFolder } from '@prisma/client';
import { CreateFolderInput, UpdateFolderInput, UpdateFileInput, GetFilesInput, CreateFileShareInput, MoveFilesInput, BulkDeleteFilesInput, BulkUpdateFilesInput } from '../graphql/inputs/file.input';
export declare class FileService {
    private prisma;
    private minioService;
    private readonly logger;
    constructor(prisma: PrismaService, minioService: MinioService);
    private getFileType;
    uploadFile(file: Express.Multer.File, userId: string, folderId?: string, metadata?: any): Promise<File>;
    getFile(id: string, userId: string): Promise<File>;
    getFiles(input: GetFilesInput, userId: string): Promise<{
        items: any;
        total: any;
        page: GetFilesInput;
        limit: GetFilesInput;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>;
    updateFile(input: UpdateFileInput, userId: string): Promise<File>;
    deleteFile(id: string, userId: string): Promise<boolean>;
    createFolder(input: CreateFolderInput, userId: string): Promise<FileFolder>;
    getFolder(id: string, userId: string): Promise<FileFolder>;
    getFolders(userId: string): Promise<FileFolder[]>;
    updateFolder(input: UpdateFolderInput, userId: string): Promise<FileFolder>;
    deleteFolder(id: string, userId: string): Promise<boolean>;
    private getFolderPath;
    moveFiles(input: MoveFilesInput, userId: string): Promise<File[]>;
    bulkDeleteFiles(input: BulkDeleteFilesInput, userId: string): Promise<number>;
    bulkUpdateFiles(input: BulkUpdateFilesInput, userId: string): Promise<File[]>;
    getStorageStats(userId: string): Promise<{
        totalFiles: any;
        totalSize: any;
        totalFolders: any;
        filesByType: {
            type: unknown;
            count: any;
            totalSize: any;
        }[];
        filesByVisibility: {
            visibility: unknown;
            count: any;
        }[];
    }>;
    createFileShare(input: CreateFileShareInput, userId: string): Promise<any>;
}
