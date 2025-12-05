import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import sharp from 'sharp';

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

export interface UploadResult {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  bucket: string;
  path: string;
  etag: string;
}

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly endpoint: string;
  private readonly port: number;
  private readonly useSSL: boolean;
  private readonly publicUrl: string;

  constructor(private configService: ConfigService) {
    // Determine if running in Docker
    const isDocker = process.env.DOCKER_NETWORK_NAME !== undefined;
    
    // IMPORTANT: Separate internal connection from public URL
    // Internal connection: Direct to MinIO server (may use IP:port)
    // Public URL: For file access (may use domain with proxy)
    
    // Internal connection settings
    const internalEndpoint = isDocker 
      ? this.configService.get<string>('DOCKER_MINIO_ENDPOINT', 'minio')
      : this.configService.get<string>('MINIO_INTERNAL_ENDPOINT') || this.configService.get<string>('MINIO_ENDPOINT', '116.118.49.243');
    
    const internalPort = isDocker
      ? this.configService.get<string>('DOCKER_MINIO_PORT', '9000')
      : this.configService.get<string>('MINIO_INTERNAL_PORT') || this.configService.get<string>('MINIO_PORT', '12007');
    
    const internalSSL = this.configService.get<string>('MINIO_INTERNAL_SSL', 'false') === 'true';
    
    this.endpoint = internalEndpoint;
    this.port = typeof internalPort === 'string' ? parseInt(internalPort, 10) : internalPort;
    this.useSSL = internalSSL;
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME', 'uploads');

    // Public URL for file access (used in browser, may be proxied through Nginx/Caddy)
    // This is separate from internal connection
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const forceHttps = this.configService.get<string>('MINIO_FORCE_HTTPS', 'false') === 'true';
    
    // Public endpoint and port (for external access via proxy/domain)
    const publicEndpoint = this.configService.get<string>('MINIO_PUBLIC_ENDPOINT', this.endpoint);
    const publicPort = this.configService.get<string>('MINIO_PUBLIC_PORT', String(this.port));
    const publicSSL = this.configService.get<string>('MINIO_PUBLIC_SSL') === 'true' || 
                      this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
    
    // Determine protocol for public URL
    const protocol = (publicSSL || isProduction || forceHttps) ? 'https' : 'http';
    
    // Don't include port in URL if using default ports (80 for HTTP, 443 for HTTPS)
    const isDefaultPort = (protocol === 'https' && publicPort === '443') || (protocol === 'http' && publicPort === '80');
    this.publicUrl = isDefaultPort 
      ? `${protocol}://${publicEndpoint}` 
      : `${protocol}://${publicEndpoint}:${publicPort}`;
    
    this.logger.log(`MinIO Internal Connection: ${this.endpoint}:${this.port} (SSL: ${this.useSSL})`);
    this.logger.log(`MinIO Public URL: ${this.publicUrl}`);

    this.minioClient = new Minio.Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: this.useSSL,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  /**
   * Chuyển đổi tiếng Việt có dấu sang không dấu
   */
  private vietnameseToSlug(str: string): string {
    let result = str;
    
    // Chuyển từng ký tự có dấu sang không dấu
    for (const [diacritic, replacement] of Object.entries(VIETNAMESE_DIACRITICS_MAP)) {
      result = result.replace(new RegExp(diacritic, 'g'), replacement);
    }
    
    return result;
  }

  /**
   * Chuyển tên file sang dạng slug
   * Ví dụ: "Hình ảnh số 1.png" -> "hinh-anh-so-1.png"
   */
  private slugifyFileName(originalName: string): string {
    // Tách phần tên và extension
    const lastDotIndex = originalName.lastIndexOf('.');
    let name = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName;
    let ext = lastDotIndex !== -1 ? originalName.substring(lastDotIndex + 1) : '';

    // Chuyển tên sang không dấu
    name = this.vietnameseToSlug(name);
    
    // Chuyển thành lowercase
    name = name.toLowerCase();
    
    // Thay thế các ký tự đặc biệt bằng dấu gạch ngang
    name = name
      .replace(/[^a-z0-9]+/g, '-')  // Thay thế ký tự không phải chữ/số bằng -
      .replace(/^-+|-+$/g, '')       // Xóa dấu - ở đầu và cuối
      .replace(/-+/g, '-');          // Gộp nhiều dấu - liên tiếp thành 1
    
    // Giới hạn độ dài tên file
    if (name.length > 100) {
      name = name.substring(0, 100);
    }
    
    // Thêm timestamp để đảm bảo unique
    const timestamp = Date.now();
    
    return ext ? `${name}-${timestamp}.${ext.toLowerCase()}` : `${name}-${timestamp}`;
  }

  /**
   * Ensure the default bucket exists
   */
  private async ensureBucketExists(): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket '${this.bucketName}' created successfully`);

        // Set bucket policy to public read
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(
          this.bucketName,
          JSON.stringify(policy),
        );
        this.logger.log(`Bucket '${this.bucketName}' policy set to public read`);
      } else {
        this.logger.log(`Bucket '${this.bucketName}' already exists`);
      }
    } catch (error) {
      this.logger.error(`Error ensuring bucket exists: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Upload a file from buffer với optimize cho ảnh
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'general',
  ): Promise<UploadResult> {
    try {
      let processedBuffer = file.buffer;
      let processedSize = file.size;
      let processedMimeType = file.mimetype;
      let ext = file.originalname.split('.').pop();
      const originalSize = file.size;

      // Optimize images to WebP
      if (file.mimetype.startsWith('image/') && !file.mimetype.includes('svg')) {
        try {
          this.logger.log(`Optimizing image: ${file.originalname} (${file.size} bytes)`);
          
          // Convert to WebP with high quality settings
          processedBuffer = await sharp(file.buffer)
            .webp({
              quality: 90, // High quality (90%)
              effort: 6,   // Maximum compression effort (0-6, higher = better compression but slower)
              lossless: false, // Use lossy compression for smaller size
              nearLossless: false,
              smartSubsample: true, // Better quality for specific images
            })
            .toBuffer();
          
          processedSize = processedBuffer.length;
          processedMimeType = 'image/webp';
          ext = 'webp';

          const savedBytes = originalSize - processedSize;
          const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);
          this.logger.log(
            `Image optimized: ${file.originalname} | ` +
            `Original: ${this.formatBytes(originalSize)} → ` +
            `WebP: ${this.formatBytes(processedSize)} | ` +
            `Saved: ${this.formatBytes(savedBytes)} (${savedPercent}%)`,
          );
        } catch (error) {
          this.logger.warn(`Failed to optimize image, using original: ${error.message}`);
          // Fallback to original if optimization fails
          processedBuffer = file.buffer;
          processedSize = file.size;
          processedMimeType = file.mimetype;
        }
      }

      // Generate unique filename với slug từ tên gốc
      const slugName = this.slugifyFileName(file.originalname);
      // Cập nhật extension nếu đã convert sang webp
      const finalFilename = ext === 'webp' && !file.originalname.toLowerCase().endsWith('.webp')
        ? slugName.replace(/\.[^.]+$/, '.webp')
        : slugName;
      const objectPath = `${folder}/${finalFilename}`;

      // Upload to MinIO
      const metaData = {
        'Content-Type': processedMimeType,
        'X-Original-Name': file.originalname,
        'X-Original-Size': originalSize.toString(),
        'X-Optimized': file.mimetype.startsWith('image/') ? 'true' : 'false',
      };

      const result = await this.minioClient.putObject(
        this.bucketName,
        objectPath,
        processedBuffer,
        processedSize,
        metaData,
      );

      const url = `${this.publicUrl}/${this.bucketName}/${objectPath}`;

      this.logger.log(`File uploaded: ${objectPath} (${processedSize} bytes)`);

      return {
        filename: finalFilename,
        url,
        size: processedSize,
        mimeType: processedMimeType,
        bucket: this.bucketName,
        path: objectPath,
        etag: result.etag,
      };
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Format bytes to human readable
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Upload from stream
   */
  async uploadStream(
    stream: Readable,
    filename: string,
    mimeType: string,
    size: number,
    folder: string = 'general',
  ): Promise<UploadResult> {
    try {
      // Generate slug filename từ tên gốc
      const slugFilename = this.slugifyFileName(filename);
      const objectPath = `${folder}/${slugFilename}`;

      const metaData = {
        'Content-Type': mimeType,
        'X-Original-Name': filename,
      };

      const result = await this.minioClient.putObject(
        this.bucketName,
        objectPath,
        stream,
        size,
        metaData,
      );

      const url = `${this.publicUrl}/${this.bucketName}/${objectPath}`;

      this.logger.log(`Stream uploaded: ${objectPath} (${size} bytes)`);

      return {
        filename: slugFilename,
        url,
        size,
        mimeType,
        bucket: this.bucketName,
        path: objectPath,
        etag: result.etag,
      };
    } catch (error) {
      this.logger.error(`Error uploading stream: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(objectPath: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, objectPath);
      this.logger.log(`File deleted: ${objectPath}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Rename/Move file trong MinIO
   * MinIO không hỗ trợ rename trực tiếp, phải copy file sang tên mới rồi xóa file cũ
   * @param oldPath - Path cũ của file (ví dụ: general/old-name.webp)
   * @param newFileName - Tên file mới (chỉ tên, không bao gồm folder)
   * @returns URL public của file mới
   */
  async renameFile(oldPath: string, newFileName: string): Promise<{ url: string; path: string; filename: string }> {
    try {
      // Tách folder từ oldPath
      const pathParts = oldPath.split('/');
      const oldFileName = pathParts.pop();
      const folder = pathParts.join('/') || 'general';
      
      // Lấy extension từ file hiện tại
      const oldExt = oldFileName?.split('.').pop() || 'webp';
      
      // Chuyển tên file mới sang slug
      const slugNewFileName = this.vietnameseToSlug(newFileName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
      
      // Tạo tên file mới với extension
      const finalNewFileName = newFileName.includes('.') 
        ? slugNewFileName 
        : `${slugNewFileName}.${oldExt}`;
      
      const newPath = `${folder}/${finalNewFileName}`;
      
      this.logger.log(`🔄 Renaming file: "${oldPath}" -> "${newPath}"`);
      
      // Copy file sang tên mới
      const copySource = `/${this.bucketName}/${oldPath}`;
      await this.minioClient.copyObject(
        this.bucketName,
        newPath,
        copySource,
        new Minio.CopyConditions(),
      );
      
      this.logger.log(`✅ Copied file to: ${newPath}`);
      
      // Xóa file cũ
      await this.minioClient.removeObject(this.bucketName, oldPath);
      this.logger.log(`✅ Deleted old file: ${oldPath}`);
      
      // Trả về URL mới
      const url = `${this.publicUrl}/${this.bucketName}/${newPath}`;
      
      return {
        url,
        path: newPath,
        filename: finalNewFileName,
      };
    } catch (error) {
      this.logger.error(`❌ Error renaming file from "${oldPath}" to "${newFileName}":`, error);
      throw error;
    }
  }

  /**
   * Get file as buffer
   */
  async getFile(objectPath: string): Promise<Buffer> {
    try {
      const stream = await this.minioClient.getObject(this.bucketName, objectPath);
      const chunks: Buffer[] = [];
      
      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`Error getting file: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get presigned URL for temporary access
   */
  async getPresignedUrl(objectPath: string, expirySeconds: number = 3600): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        objectPath,
        expirySeconds,
      );
    } catch (error) {
      this.logger.error(`Error generating presigned URL: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * List files in a folder
   */
  async listFiles(folder: string = ''): Promise<Minio.BucketItem[]> {
    try {
      const objectsStream = this.minioClient.listObjectsV2(
        this.bucketName,
        folder,
        true,
      );

      const objects: Minio.BucketItem[] = [];
      
      return new Promise((resolve, reject) => {
        objectsStream.on('data', (obj) => objects.push(obj));
        objectsStream.on('end', () => resolve(objects));
        objectsStream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`Error listing files: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get file stats
   */
  async getFileStat(objectPath: string): Promise<Minio.BucketItemStat> {
    try {
      return await this.minioClient.statObject(this.bucketName, objectPath);
    } catch (error) {
      this.logger.error(`Error getting file stat: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Copy file
   */
  async copyFile(sourcePath: string, destPath: string): Promise<void> {
    try {
      await this.minioClient.copyObject(
        this.bucketName,
        destPath,
        `/${this.bucketName}/${sourcePath}`,
        null,
      );
      this.logger.log(`File copied: ${sourcePath} -> ${destPath}`);
    } catch (error) {
      this.logger.error(`Error copying file: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Create a new bucket
   */
  async createBucket(bucketName: string): Promise<void> {
    try {
      await this.minioClient.makeBucket(bucketName, 'us-east-1');
      this.logger.log(`Bucket '${bucketName}' created`);
    } catch (error) {
      this.logger.error(`Error creating bucket: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get MinIO client instance
   */
  getClient(): Minio.Client {
    return this.minioClient;
  }

  /**
   * Get default bucket name
   */
  getBucketName(): string {
    return this.bucketName;
  }

  /**
   * Get public URL
   */
  getPublicUrl(): string {
    return this.publicUrl;
  }
}
