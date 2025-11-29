import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Param,
  UseGuards,
  Req,
  Body,
  Logger,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { MinioService } from '../../minio/minio.service';
import { SourceDocumentService } from './source-document.service';
import { VideoProcessingService } from './video-processing.service';

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

/**
 * Decode tên file từ Latin-1 sang UTF-8
 * Multer đôi khi encode tên file tiếng Việt sai
 */
function decodeFileName(filename: string): string {
  try {
    // Nếu tên file đã bị encode sai từ UTF-8 sang Latin-1
    // Thử decode lại
    const decoded = Buffer.from(filename, 'latin1').toString('utf8');
    
    // Kiểm tra xem decoded có hợp lệ không (không chứa ký tự thay thế)
    if (!decoded.includes('\ufffd') && decoded !== filename) {
      return decoded;
    }
    
    return filename;
  } catch {
    return filename;
  }
}

/**
 * REST Controller cho upload tài liệu nguồn lên MinIO
 * Endpoint: POST /api/lms/source-documents/upload
 */
@Controller('api/lms/source-documents')
@UseGuards(JwtAuthGuard)
export class SourceDocumentUploadController {
  private readonly logger = new Logger(SourceDocumentUploadController.name);

  constructor(
    private minioService: MinioService,
    private sourceDocumentService: SourceDocumentService,
    private videoProcessingService: VideoProcessingService,
  ) {}

  /**
   * Upload file cho tài liệu nguồn mới (chưa có document ID)
   * POST /api/lms/source-documents/upload
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: UploadedFile,
    @Req() request: any,
  ) {
    if (!file) {
      throw new BadRequestException('Không có file được gửi lên');
    }

    // Validate file type
    this.validateFile(file);

    try {
      // Decode tên file tiếng Việt
      const originalFileName = decodeFileName(file.originalname);
      
      // Generate temporary document ID for file path
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      let finalBuffer = file.buffer;
      let finalSize = file.size;
      let duration: number | undefined;
      let videoMetadata: any = {};

      // Process video if it's a video file
      if (this.isVideoFile(file.mimetype)) {
        this.logger.log(`Processing video: ${originalFileName}`);
        
        const processResult = await this.videoProcessingService.processVideo(
          file.buffer,
          originalFileName,
        );

        if (processResult.success && processResult.processedBuffer) {
          finalBuffer = processResult.processedBuffer;
          finalSize = processResult.processedBuffer.length;
          duration = processResult.duration;
          videoMetadata = {
            width: processResult.width,
            height: processResult.height,
            processed: true,
          };
          this.logger.log(`✅ Video processed: ${originalFileName}, duration: ${duration}s`);
        } else {
          this.logger.warn(`⚠️ Video processing skipped or failed: ${processResult.error || 'FFmpeg not available'}`);
          videoMetadata = {
            processed: false,
            needsProcessing: processResult.needsProcessing,
            error: processResult.error,
          };
        }
      }
      
      // Upload to MinIO (processed or original)
      const url = await this.minioService.uploadSourceDocument(
        tempId,
        finalBuffer,
        originalFileName,
        file.mimetype,
      );

      return {
        success: true,
        url,
        fileName: originalFileName,
        fileSize: finalSize,
        mimeType: file.mimetype,
        tempId,
        duration,
        metadata: videoMetadata,
      };
    } catch (error) {
      this.logger.error(`Upload error: ${error.message}`, error.stack);
      throw new BadRequestException(`Upload thất bại: ${error.message}`);
    }
  }

  /**
   * Upload file cho tài liệu nguồn đã có (có document ID)
   * POST /api/lms/source-documents/:documentId/upload
   */
  @Post(':documentId/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    }),
  )
  async uploadFileForDocument(
    @Param('documentId') documentId: string,
    @UploadedFile() file: UploadedFile,
    @Req() request: any,
  ) {
    if (!file) {
      throw new BadRequestException('Không có file được gửi lên');
    }

    // Validate file type
    this.validateFile(file);

    try {
      // Decode tên file tiếng Việt
      const originalFileName = decodeFileName(file.originalname);
      
      let finalBuffer = file.buffer;
      let finalSize = file.size;
      let duration: number | undefined;
      let videoMetadata: any = {};

      // Process video if it's a video file
      if (this.isVideoFile(file.mimetype)) {
        this.logger.log(`Processing video for document ${documentId}: ${originalFileName}`);
        
        const processResult = await this.videoProcessingService.processVideo(
          file.buffer,
          originalFileName,
        );

        if (processResult.success && processResult.processedBuffer) {
          finalBuffer = processResult.processedBuffer;
          finalSize = processResult.processedBuffer.length;
          duration = processResult.duration;
          videoMetadata = {
            width: processResult.width,
            height: processResult.height,
            processed: true,
          };
          this.logger.log(`✅ Video processed for document ${documentId}: duration ${duration}s`);
        } else {
          this.logger.warn(`⚠️ Video processing failed: ${processResult.error || 'FFmpeg not available'}`);
          videoMetadata = {
            processed: false,
            needsProcessing: processResult.needsProcessing,
            error: processResult.error,
          };
        }
      }
      
      // Upload to MinIO with document ID (processed or original)
      const url = await this.minioService.uploadSourceDocument(
        documentId,
        finalBuffer,
        originalFileName,
        file.mimetype,
      );

      // Update document with file info
      const updateData: any = {
        url,
        fileName: originalFileName,
        fileSize: finalSize,
        mimeType: file.mimetype,
      };

      // Add duration if it's a video
      if (duration !== undefined) {
        updateData.duration = Math.round(duration);
      }

      // Add metadata
      if (Object.keys(videoMetadata).length > 0) {
        updateData.metadata = videoMetadata;
      }

      await this.sourceDocumentService.update(documentId, updateData);

      return {
        success: true,
        url,
        fileName: originalFileName,
        fileSize: finalSize,
        mimeType: file.mimetype,
        documentId,
        duration,
        metadata: videoMetadata,
      };
    } catch (error) {
      this.logger.error(`Upload error: ${error.message}`, error.stack);
      throw new BadRequestException(`Upload thất bại: ${error.message}`);
    }
  }

  /**
   * Upload nhiều file cùng lúc
   * POST /api/lms/source-documents/upload-multiple
   */
  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB per file
      },
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() files: UploadedFile[],
    @Req() request: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Không có file được gửi lên');
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        this.validateFile(file);
        
        // Decode tên file tiếng Việt
        const originalFileName = decodeFileName(file.originalname);
        
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const url = await this.minioService.uploadSourceDocument(
          tempId,
          file.buffer,
          originalFileName,
          file.mimetype,
        );

        results.push({
          success: true,
          url,
          fileName: originalFileName,
          fileSize: file.size,
          mimeType: file.mimetype,
          tempId,
        });
      } catch (error) {
        errors.push({
          fileName: decodeFileName(file.originalname),
          error: error.message,
        });
      }
    }

    return {
      success: errors.length === 0,
      uploaded: results,
      errors,
      totalUploaded: results.length,
      totalFailed: errors.length,
    };
  }

  /**
   * Upload thumbnail cho tài liệu
   * POST /api/lms/source-documents/:documentId/thumbnail
   */
  @Post(':documentId/thumbnail')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB for thumbnails
      },
    }),
  )
  async uploadThumbnail(
    @Param('documentId') documentId: string,
    @UploadedFile() file: UploadedFile,
    @Req() request: any,
  ) {
    if (!file) {
      throw new BadRequestException('Không có file được gửi lên');
    }

    // Validate image type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException('Thumbnail phải là file ảnh (JPG, PNG, GIF, WEBP)');
    }

    try {
      const url = await this.minioService.uploadDocumentThumbnail(
        documentId,
        file.buffer,
        file.mimetype,
      );

      // Update document with thumbnail
      await this.sourceDocumentService.update(documentId, {
        thumbnailUrl: url,
      });

      return {
        success: true,
        url,
        documentId,
      };
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      throw new BadRequestException(`Upload thumbnail thất bại: ${error.message}`);
    }
  }

  /**
   * Download file from URL and upload to MinIO
   * POST /api/lms/source-documents/upload-from-url
   * Body: { url: string, documentId?: string }
   */
  @Post('upload-from-url')
  async uploadFromUrl(
    @Body() body: { url: string; documentId?: string },
    @Req() request: any,
  ) {
    const { url, documentId } = body;

    if (!url) {
      throw new BadRequestException('URL is required');
    }

    try {
      // Download file from URL
      const { buffer, fileName, mimeType, size } = 
        await this.sourceDocumentService.downloadFromUrl(url);

      this.logger.log(`📥 Downloaded: ${fileName} (${mimeType}, ${size} bytes)`);

      // Validate file type
      const tempFile: UploadedFile = {
        buffer,
        originalname: fileName,
        mimetype: mimeType,
        size,
      };
      this.validateFile(tempFile);

      // Process video if applicable
      let finalBuffer = buffer;
      let finalSize = size;
      let duration: number | undefined;
      let videoMetadata: any = {};

      if (this.isVideoFile(mimeType)) {
        this.logger.log(`Processing video: ${fileName}`);
        
        const processResult = await this.videoProcessingService.processVideo(
          buffer,
          fileName,
        );

        if (processResult.success && processResult.processedBuffer) {
          finalBuffer = processResult.processedBuffer;
          finalSize = processResult.processedBuffer.length;
          duration = processResult.duration;
          videoMetadata = {
            width: processResult.width,
            height: processResult.height,
            processed: true,
          };
          this.logger.log(`✅ Video processed: duration ${duration}s`);
        }
      }

      // Upload to MinIO
      const docId = documentId || `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const uploadedUrl = await this.minioService.uploadSourceDocument(
        docId,
        finalBuffer,
        fileName,
        mimeType,
      );

      // Update document if documentId provided
      if (documentId) {
        const updateData: any = {
          url: uploadedUrl,
          fileName,
          fileSize: finalSize,
          mimeType,
        };

        if (duration !== undefined) {
          updateData.duration = Math.round(duration);
        }

        if (Object.keys(videoMetadata).length > 0) {
          updateData.metadata = videoMetadata;
        }

        await this.sourceDocumentService.update(documentId, updateData);
      }

      return {
        success: true,
        url: uploadedUrl,
        fileName,
        fileSize: finalSize,
        mimeType,
        documentId: docId,
        duration,
        metadata: videoMetadata,
      };
    } catch (error) {
      this.logger.error(`Upload from URL error: ${error.message}`, error.stack);
      throw new BadRequestException(`Upload từ URL thất bại: ${error.message}`);
    }
  }

  /**
   * Check if file is a video
   */
  private isVideoFile(mimeType: string): boolean {
    return mimeType.startsWith('video/');
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: UploadedFile) {
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new BadRequestException('Kích thước file vượt quá 100MB');
    }

    const allowedTypes = [
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'text/markdown',
      'text/html',
      // Archives
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      // Videos
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/x-msvideo',
      'video/webm',
      // Audio
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/mp3',
      // Code
      'application/json',
      'application/javascript',
      'text/css',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Loại file ${file.mimetype} không được hỗ trợ`,
      );
    }
  }
}
