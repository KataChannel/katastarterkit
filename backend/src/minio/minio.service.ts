import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Minio.Client;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(this.configService.get('MINIO_PORT', '9000')),
      useSSL: this.configService.get('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get('MINIO_SECRET_KEY', 'minioadmin'),
    });

    this.initializeBuckets();
  }

  private async initializeBuckets(): Promise<void> {
    const buckets = ['avatars', 'posts', 'uploads'];
    
    for (const bucket of buckets) {
      try {
        const bucketExists = await this.minioClient.bucketExists(bucket);
        if (!bucketExists) {
          await this.minioClient.makeBucket(bucket);
          this.logger.log(`Created bucket: ${bucket}`);
          
          // Set bucket policy to allow public read access
          const policy = {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: { AWS: ['*'] },
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${bucket}/*`],
              },
            ],
          };
          
          await this.minioClient.setBucketPolicy(bucket, JSON.stringify(policy));
          this.logger.log(`Set public read policy for bucket: ${bucket}`);
        }
      } catch (error) {
        this.logger.error(`Error initializing bucket ${bucket}:`, error);
      }
    }
  }

  async uploadFile(
    bucket: string,
    fileName: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    try {
      const uploadInfo = await this.minioClient.putObject(
        bucket,
        fileName,
        buffer,
        buffer.length,
        {
          'Content-Type': contentType,
        },
      );

      this.logger.log(`File uploaded successfully: ${fileName}`);
      
      // Return the public URL
      return this.getPublicUrl(bucket, fileName);
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(bucket: string, fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucket, fileName);
      this.logger.log(`File deleted successfully: ${fileName}`);
    } catch (error) {
      this.logger.error('Error deleting file:', error);
      throw error;
    }
  }

  async getPresignedUrl(
    bucket: string,
    fileName: string,
    expires: number = 24 * 60 * 60, // 24 hours
  ): Promise<string> {
    try {
      return await this.minioClient.presignedUrl('GET', bucket, fileName, expires);
    } catch (error) {
      this.logger.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  getPublicUrl(bucket: string, fileName: string): string {
    const endpoint = this.configService.get('MINIO_ENDPOINT', 'localhost');
    const port = this.configService.get('MINIO_PORT', '9000');
    const useSSL = this.configService.get('MINIO_USE_SSL', 'false') === 'true';
    const protocol = useSSL ? 'https' : 'http';
    
    return `${protocol}://${endpoint}:${port}/${bucket}/${fileName}`;
  }

  async uploadAvatar(userId: string, buffer: Buffer, contentType: string): Promise<string> {
    const fileName = `${userId}-${Date.now()}.${this.getFileExtension(contentType)}`;
    return this.uploadFile('avatars', fileName, buffer, contentType);
  }

  async uploadPostImage(postId: string, buffer: Buffer, contentType: string): Promise<string> {
    const fileName = `${postId}-${Date.now()}.${this.getFileExtension(contentType)}`;
    return this.uploadFile('posts', fileName, buffer, contentType);
  }

  private getFileExtension(contentType: string): string {
    const mimeTypes: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
    };

    return mimeTypes[contentType] || 'jpg';
  }
}
