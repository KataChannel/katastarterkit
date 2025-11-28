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
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { MinioService } from '../../minio/minio.service';
import { SourceDocumentService } from './source-document.service';

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
  constructor(
    private minioService: MinioService,
    private sourceDocumentService: SourceDocumentService,
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
      
      // Upload to MinIO
      const url = await this.minioService.uploadSourceDocument(
        tempId,
        file.buffer,
        originalFileName,
        file.mimetype,
      );

      return {
        success: true,
        url,
        fileName: originalFileName,
        fileSize: file.size,
        mimeType: file.mimetype,
        tempId,
      };
    } catch (error) {
      console.error('Upload error:', error);
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
      
      // Upload to MinIO with document ID
      const url = await this.minioService.uploadSourceDocument(
        documentId,
        file.buffer,
        originalFileName,
        file.mimetype,
      );

      // Update document with file info
      await this.sourceDocumentService.update(documentId, {
        url,
        fileName: originalFileName,
        fileSize: file.size,
        mimeType: file.mimetype,
      });

      return {
        success: true,
        url,
        fileName: originalFileName,
        fileSize: file.size,
        mimeType: file.mimetype,
        documentId,
      };
    } catch (error) {
      console.error('Upload error:', error);
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
