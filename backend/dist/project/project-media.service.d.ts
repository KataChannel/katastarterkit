import { PrismaService } from '../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';
import { MediaType } from '@prisma/client';
interface UploadedFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}
export declare class ProjectMediaService {
    private prisma;
    private minioService;
    constructor(prisma: PrismaService, minioService: MinioService);
    uploadFile(file: UploadedFile, userId: string, options: {
        projectId?: string;
        taskId?: string;
        messageId?: string;
        caption?: string;
    }): Promise<any>;
    uploadMultipleFiles(files: UploadedFile[], userId: string, options: {
        projectId?: string;
        taskId?: string;
        messageId?: string;
    }): Promise<any[]>;
    getProjectFiles(projectId: string, filters?: {
        type?: MediaType;
    }): Promise<any[]>;
    getTaskFiles(taskId: string, filters?: {
        type?: MediaType;
    }): Promise<({
        uploader: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        size: number;
        type: import("@prisma/client").$Enums.MediaType;
        filename: string;
        url: string;
        mimeType: string;
        caption: string | null;
        taskId: string;
        uploadedBy: string;
    })[]>;
    deleteFile(fileId: string, userId: string, type: 'task' | 'project' | 'chat'): Promise<boolean>;
    private validateFile;
    private getMediaType;
    private getBucketName;
    private getObjectNameFromUrl;
    getProjectFileStats(projectId: string): Promise<{
        totalFiles: number;
        totalSize: number;
        byType: {
            images: number;
            documents: number;
            videos: number;
            audio: number;
        };
    }>;
    getTaskFileStats(taskId: string): Promise<{
        totalFiles: number;
        totalSize: number;
        byType: {
            images: number;
            documents: number;
            videos: number;
        };
    }>;
}
export {};
