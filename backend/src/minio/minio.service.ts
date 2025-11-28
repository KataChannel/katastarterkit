import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

/**
 * Bảng chuyển đổi tiếng Việt có dấu sang không dấu
 */
const VIETNAMESE_DIACRITICS_MAP: { [key: string]: string } = {
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd',
  'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
  'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
  'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
  'Đ': 'D',
  'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
  'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
  'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
  'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
  'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
  'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
  'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
  'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
  'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
};

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private isReady: boolean = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    await this.initializeWithRetry();
  }

  private async initializeWithRetry(retries: number = 10): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Use Docker-specific endpoints if available
        const isDockerEnv = process.env.DOCKER_NETWORK_NAME !== undefined;
        
        // IMPORTANT: Use internal endpoint for direct MinIO connection
        const endpoint = isDockerEnv 
          ? this.configService.get('DOCKER_MINIO_ENDPOINT', 'minio')
          : this.configService.get('MINIO_INTERNAL_ENDPOINT') || this.configService.get('MINIO_ENDPOINT', '116.118.49.243');
        
        // Always use configured port from .env
        const portConfig = isDockerEnv
          ? this.configService.get('DOCKER_MINIO_PORT', '9000')
          : this.configService.get('MINIO_INTERNAL_PORT') || this.configService.get('MINIO_PORT', '12007');
        const port = typeof portConfig === 'string' ? parseInt(portConfig, 10) : portConfig;
        
        // Use internal SSL setting (usually false for internal connections)
        const useSSL = this.configService.get('MINIO_INTERNAL_SSL', 'false') === 'true';
        const accessKey = this.configService.get('MINIO_ACCESS_KEY', 'minioadmin');
        const secretKey = this.configService.get('MINIO_SECRET_KEY', 'minioadmin');

        this.logger.log(`[Minio] Connection attempt ${attempt}/${retries}: endpoint=${endpoint}, port=${port}, SSL=${useSSL}, dockerEnv=${isDockerEnv}`);

        this.minioClient = new Minio.Client({
          endPoint: endpoint,
          port: port,
          useSSL: useSSL,
          accessKey: accessKey,
          secretKey: secretKey,
          region: 'us-east-1',
        });

        // Test connection by listing buckets
        await this.testConnection();
        
        this.isReady = true;
        this.logger.log(`✅ Minio connected successfully`);
        
        // Initialize buckets after successful connection
        await this.initializeBuckets();
        return;
      } catch (error) {
        this.logger.warn(`[Minio] Attempt ${attempt}/${retries} failed: ${error?.message || error}`);
        
        if (attempt === retries) {
          this.logger.error(`❌ Failed to connect to Minio after ${retries} attempts: ${error?.message || error}`);
          this.isReady = false;
          return;
        }
        
        // Wait before retry (exponential backoff: 500ms, 1s, 2s, 4s...)
        const delay = Math.min(500 * Math.pow(2, attempt - 1), 8000);
        this.logger.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  private async testConnection(): Promise<void> {
    await Promise.race([
      this.minioClient.listBuckets(),
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('Minio connection timeout (5s)')), 5000)
      ),
    ]);
  }

  private async ensureReady(): Promise<void> {
    if (!this.isReady) {
      this.logger.warn('⚠️  Minio not ready, attempting re-initialization...');
      await this.initializeWithRetry(3);
    }
  }

  private async initializeBuckets(): Promise<void> {
    const buckets = ['avatars', 'posts', 'uploads', 'source-documents'];
    
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
    // ALWAYS use public endpoint for URLs returned to the frontend
    // Priority: MINIO_PUBLIC_ENDPOINT > MINIO_ENDPOINT > fallback to localhost
    const publicEndpoint = this.configService.get('MINIO_PUBLIC_ENDPOINT') || 
                          this.configService.get('MINIO_ENDPOINT', 'localhost');
    
    // Get public port, with proper fallback chain
    const publicPortStr = this.configService.get('MINIO_PUBLIC_PORT') || 
                          this.configService.get('MINIO_PORT', '9000');
    const publicPort = typeof publicPortStr === 'string' ? publicPortStr : String(publicPortStr);
    
    // Determine SSL based on explicit configuration
    const publicSSL = this.configService.get('MINIO_PUBLIC_SSL') === 'true' || 
                      this.configService.get('MINIO_USE_SSL', 'false') === 'true';
    
    // In production or when FORCE_HTTPS is set, always use HTTPS for public URLs
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const forceHttps = this.configService.get('MINIO_FORCE_HTTPS', 'false') === 'true';
    const protocol = (publicSSL || isProduction || forceHttps) ? 'https' : 'http';
    
    // Don't include port in URL if using default ports (80 for HTTP, 443 for HTTPS)
    const isDefaultPort = (protocol === 'https' && publicPort === '443') || 
                          (protocol === 'http' && publicPort === '80');
    const urlBase = isDefaultPort 
      ? `${protocol}://${publicEndpoint}` 
      : `${protocol}://${publicEndpoint}:${publicPort}`;
    
    this.logger.debug(`[getPublicUrl] Generated URL: ${urlBase}/${bucket}/${fileName} (protocol=${protocol}, endpoint=${publicEndpoint}, port=${publicPort}, isDefault=${isDefaultPort})`);
    
    return `${urlBase}/${bucket}/${fileName}`;
  }

  async uploadAvatar(userId: string, buffer: Buffer, contentType: string, originalFileName?: string): Promise<string> {
    const ext = this.getFileExtension(contentType);
    const baseName = originalFileName 
      ? this.createSlugFileName(originalFileName.replace(/\.[^/.]+$/, ''))
      : userId;
    const fileName = `${baseName}-${Date.now()}.${ext}`;
    return this.uploadFile('avatars', fileName, buffer, contentType);
  }

  async uploadPostImage(postId: string, buffer: Buffer, contentType: string, originalFileName?: string): Promise<string> {
    const ext = this.getFileExtension(contentType);
    const baseName = originalFileName 
      ? this.createSlugFileName(originalFileName.replace(/\.[^/.]+$/, ''))
      : postId;
    const fileName = `${baseName}-${Date.now()}.${ext}`;
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

  // Source Documents Upload Methods
  async uploadSourceDocument(
    documentId: string,
    buffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    // Chuyển tên file sang slug tiếng Việt không dấu
    const slugFileName = this.createSlugFileName(fileName);
    // Không cần timestamp trong tên file, chỉ dùng slug
    return this.uploadFile('source-documents', slugFileName, buffer, contentType);
  }

  async uploadDocumentThumbnail(
    documentId: string,
    buffer: Buffer,
    contentType: string,
    originalFileName?: string,
  ): Promise<string> {
    const ext = this.getFileExtension(contentType);
    const baseName = originalFileName 
      ? this.createSlugFileName(originalFileName.replace(/\.[^/.]+$/, ''))
      : `thumbnail-${documentId}`;
    const fileName = `${baseName}-thumb.${ext}`;
    return this.uploadFile('source-documents', fileName, buffer, contentType);
  }

  async deleteSourceDocument(fileName: string): Promise<void> {
    return this.deleteFile('source-documents', fileName);
  }

  async getSourceDocumentUrl(fileName: string): Promise<string> {
    return this.getPresignedUrl('source-documents', fileName);
  }

  private sanitizeFileName(fileName: string): string {
    // Remove special characters, keep only alphanumeric, dash, underscore, and dot
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  /**
   * Chuyển đổi tiếng Việt có dấu sang không dấu
   * Ví dụ: "Hình ảnh số 1" -> "hinh-anh-so-1"
   */
  private removeVietnameseDiacritics(str: string): string {
    return str
      .split('')
      .map(char => VIETNAMESE_DIACRITICS_MAP[char] || char)
      .join('');
  }

  /**
   * Tạo slug từ tên file tiếng Việt
   * Ví dụ: "Hình ảnh số 1.png" -> "hinh-anh-so-1.png"
   * Ví dụ: "Tài liệu số 1.docx" -> "tai-lieu-so-1.docx"
   */
  private createSlugFileName(fileName: string): string {
    // Tách phần tên file và phần mở rộng
    const lastDotIndex = fileName.lastIndexOf('.');
    const hasExtension = lastDotIndex > 0;
    
    const name = hasExtension ? fileName.substring(0, lastDotIndex) : fileName;
    const extension = hasExtension ? fileName.substring(lastDotIndex) : '';
    
    // Chuyển đổi phần tên file
    const slugName = this.removeVietnameseDiacritics(name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Thay khoảng trắng bằng dấu gạch ngang
      .replace(/[^\w\-]/g, '')        // Xóa ký tự đặc biệt (giữ chữ, số, gạch ngang)
      .replace(/\-\-+/g, '-')         // Thay nhiều gạch ngang liên tiếp bằng 1 gạch
      .replace(/^-+/, '')             // Xóa gạch ngang ở đầu
      .replace(/-+$/, '');            // Xóa gạch ngang ở cuối
    
    // Trả về slug + extension (giữ nguyên extension gốc, lowercase)
    return slugName + extension.toLowerCase();
  }

  /**
   * Upload file với tên slug tiếng Việt không dấu
   * @param bucket - Tên bucket
   * @param originalFileName - Tên file gốc (có thể có tiếng Việt có dấu)
   * @param buffer - Nội dung file
   * @param contentType - MIME type
   * @param prefix - Prefix thư mục (optional)
   * @returns URL public của file
   */
  async uploadFileWithSlug(
    bucket: string,
    originalFileName: string,
    buffer: Buffer,
    contentType: string,
    prefix?: string,
  ): Promise<string> {
    const slugFileName = this.createSlugFileName(originalFileName);
    const finalFileName = prefix 
      ? `${prefix}/${slugFileName}` 
      : slugFileName;
    
    this.logger.log(`📁 Upload file: "${originalFileName}" -> "${finalFileName}"`);
    
    return this.uploadFile(bucket, finalFileName, buffer, contentType);
  }

  async generateThumbnailFromVideo(videoBuffer: Buffer): Promise<Buffer> {
    // TODO: Implement video thumbnail generation using ffmpeg
    // For now, return placeholder
    throw new Error('Video thumbnail generation not implemented yet');
  }

  async generateThumbnailFromPDF(pdfBuffer: Buffer): Promise<Buffer> {
    // TODO: Implement PDF thumbnail generation
    // For now, return placeholder
    throw new Error('PDF thumbnail generation not implemented yet');
  }
}

