import { ConfigService } from '@nestjs/config';
export declare class MinioService {
    private readonly configService;
    private readonly logger;
    private readonly minioClient;
    constructor(configService: ConfigService);
    private initializeBuckets;
    uploadFile(bucket: string, fileName: string, buffer: Buffer, contentType: string): Promise<string>;
    deleteFile(bucket: string, fileName: string): Promise<void>;
    getPresignedUrl(bucket: string, fileName: string, expires?: number): Promise<string>;
    getPublicUrl(bucket: string, fileName: string): string;
    uploadAvatar(userId: string, buffer: Buffer, contentType: string): Promise<string>;
    uploadPostImage(postId: string, buffer: Buffer, contentType: string): Promise<string>;
    private getFileExtension;
}
