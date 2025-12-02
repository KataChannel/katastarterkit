import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import axios from 'axios';

export interface GoogleDriveUploadResult {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  webViewLink: string;
  webContentLink: string;
  thumbnailLink?: string;
}

/**
 * Service để upload file lên Google Drive của công ty
 * Folder chung: https://drive.google.com/drive/folders/1JR8q5xZ8vCWJgDEXMdEjwYinte4IXPE4
 */
@Injectable()
export class GoogleDriveService {
  private readonly logger = new Logger(GoogleDriveService.name);
  private drive: drive_v3.Drive | null = null;

  // Folder ID của công ty từ URL: 1JR8q5xZ8vCWJgDEXMdEjwYinte4IXPE4
  private readonly COMPANY_FOLDER_ID = '1JR8q5xZ8vCWJgDEXMdEjwYinte4IXPE4';
  
  // Sub-folder IDs theo loại file (sẽ được tạo tự động nếu chưa có)
  private folderCache: Map<string, string> = new Map();

  constructor() {
    this.initializeDrive();
  }

  /**
   * Khởi tạo Google Drive API với Service Account
   */
  private async initializeDrive(): Promise<void> {
    try {
      const credentialsJson = process.env.GOOGLE_DRIVE_CREDENTIALS_JSON;
      
      if (!credentialsJson) {
        this.logger.warn('⚠️ GOOGLE_DRIVE_CREDENTIALS_JSON not set - Google Drive upload disabled');
        return;
      }

      const credentials = JSON.parse(credentialsJson);
      
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive'],
      });

      this.drive = google.drive({ version: 'v3', auth });
      this.logger.log('✅ Google Drive API initialized successfully');
    } catch (error) {
      this.logger.error(`❌ Failed to initialize Google Drive: ${error.message}`);
    }
  }

  /**
   * Kiểm tra Google Drive đã được cấu hình chưa
   */
  isConfigured(): boolean {
    return this.drive !== null;
  }

  /**
   * Tạo sub-folder trong folder công ty nếu chưa có
   */
  private async getOrCreateSubFolder(folderName: string): Promise<string> {
    if (!this.drive) {
      throw new BadRequestException('Google Drive chưa được cấu hình');
    }

    // Check cache first
    if (this.folderCache.has(folderName)) {
      return this.folderCache.get(folderName)!;
    }

    try {
      // Search for existing folder
      const response = await this.drive.files.list({
        q: `name='${folderName}' and '${this.COMPANY_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      if (response.data.files && response.data.files.length > 0) {
        const folderId = response.data.files[0].id!;
        this.folderCache.set(folderName, folderId);
        return folderId;
      }

      // Create new folder
      const createResponse = await this.drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [this.COMPANY_FOLDER_ID],
        },
        fields: 'id',
        supportsAllDrives: true,
      });

      const newFolderId = createResponse.data.id!;
      this.folderCache.set(folderName, newFolderId);
      this.logger.log(`📁 Created sub-folder: ${folderName} (${newFolderId})`);
      
      return newFolderId;
    } catch (error) {
      this.logger.error(`Failed to get/create folder ${folderName}: ${error.message}`);
      // Fallback to main company folder
      return this.COMPANY_FOLDER_ID;
    }
  }

  /**
   * Xác định sub-folder dựa trên mime type
   */
  private getFolderNameByMimeType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'Images';
    if (mimeType.startsWith('video/')) return 'Videos';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.includes('pdf')) return 'PDFs';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'Documents';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'Spreadsheets';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentations';
    return 'Others';
  }

  /**
   * Upload file buffer lên Google Drive
   */
  async uploadFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<GoogleDriveUploadResult> {
    if (!this.drive) {
      throw new BadRequestException('Google Drive chưa được cấu hình. Vui lòng liên hệ admin.');
    }

    try {
      // Get appropriate sub-folder
      const folderName = this.getFolderNameByMimeType(mimeType);
      const folderId = await this.getOrCreateSubFolder(folderName);

      // Create readable stream from buffer
      const stream = Readable.from(buffer);

      // Upload file
      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
          mimeType,
          parents: [folderId],
        },
        media: {
          mimeType,
          body: stream,
        },
        fields: 'id, name, mimeType, size, webViewLink, webContentLink, thumbnailLink',
        supportsAllDrives: true,
      });

      const file = response.data;

      // Make file publicly accessible
      await this.drive.permissions.create({
        fileId: file.id!,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
        supportsAllDrives: true,
      });

      this.logger.log(`✅ Uploaded to Google Drive: ${fileName} -> ${folderName}`);

      return {
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        size: parseInt(file.size || '0'),
        webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
        webContentLink: file.webContentLink || `https://drive.google.com/uc?export=download&id=${file.id}`,
        thumbnailLink: file.thumbnailLink || undefined,
      };
    } catch (error) {
      this.logger.error(`❌ Upload to Google Drive failed: ${error.message}`, error.stack);
      throw new BadRequestException(`Upload lên Google Drive thất bại: ${error.message}`);
    }
  }

  /**
   * Download file từ URL và upload lên Google Drive
   */
  async uploadFromUrl(url: string): Promise<GoogleDriveUploadResult> {
    if (!this.drive) {
      throw new BadRequestException('Google Drive chưa được cấu hình. Vui lòng liên hệ admin.');
    }

    try {
      this.logger.log(`📥 Downloading from URL: ${url}`);

      // Convert Google Drive/Sheets/Docs URLs to direct download links
      const downloadUrl = this.convertToDirectDownloadUrl(url);

      // Download file
      const response = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
        maxContentLength: 100 * 1024 * 1024, // 100MB max
        timeout: 60000, // 60 seconds timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const buffer = Buffer.from(response.data);
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      
      // Extract filename from URL or Content-Disposition
      let fileName = this.extractFileNameFromUrl(url);
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch) {
          fileName = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Decode URL-encoded filename
      fileName = decodeURIComponent(fileName);

      this.logger.log(`📁 Downloaded: ${fileName} (${buffer.length} bytes, ${contentType})`);

      // Upload to Google Drive
      return await this.uploadFile(buffer, fileName, contentType);
    } catch (error) {
      this.logger.error(`❌ Upload from URL failed: ${error.message}`, error.stack);
      throw new BadRequestException(`Tải file từ URL thất bại: ${error.message}`);
    }
  }

  /**
   * Convert các URL đặc biệt (Google Drive, Sheets, Docs) sang direct download link
   */
  private convertToDirectDownloadUrl(url: string): string {
    // Google Drive file: https://drive.google.com/file/d/FILE_ID/view
    const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
    if (driveFileMatch) {
      const fileId = driveFileMatch[1];
      this.logger.log(`🔄 Converting Google Drive URL (File ID: ${fileId})`);
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    // Google Drive open: https://drive.google.com/open?id=FILE_ID
    const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
    if (driveOpenMatch) {
      const fileId = driveOpenMatch[1];
      this.logger.log(`🔄 Converting Google Drive URL (File ID: ${fileId})`);
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    // Google Sheets: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
    const sheetsMatch = url.match(/docs\.google\.com\/spreadsheets\/d\/([^\/]+)/);
    if (sheetsMatch) {
      const sheetId = sheetsMatch[1];
      this.logger.log(`🔄 Converting Google Sheets URL (Sheet ID: ${sheetId})`);
      return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
    }

    // Google Docs: https://docs.google.com/document/d/DOC_ID/edit
    const docsMatch = url.match(/docs\.google\.com\/document\/d\/([^\/]+)/);
    if (docsMatch) {
      const docId = docsMatch[1];
      this.logger.log(`🔄 Converting Google Docs URL (Doc ID: ${docId})`);
      return `https://docs.google.com/document/d/${docId}/export?format=docx`;
    }

    // Google Slides: https://docs.google.com/presentation/d/SLIDE_ID/edit
    const slidesMatch = url.match(/docs\.google\.com\/presentation\/d\/([^\/]+)/);
    if (slidesMatch) {
      const slideId = slidesMatch[1];
      this.logger.log(`🔄 Converting Google Slides URL (Slide ID: ${slideId})`);
      return `https://docs.google.com/presentation/d/${slideId}/export?format=pptx`;
    }

    // Dropbox: Convert to direct download
    if (url.includes('dropbox.com')) {
      return url.replace('dl=0', 'dl=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    }

    return url;
  }

  /**
   * Extract filename từ URL
   */
  private extractFileNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const segments = pathname.split('/').filter(Boolean);
      
      if (segments.length > 0) {
        const lastSegment = segments[segments.length - 1];
        // Check if it looks like a filename
        if (lastSegment.includes('.')) {
          return lastSegment;
        }
      }

      // Try to get from query params
      const filenameParam = urlObj.searchParams.get('filename') || urlObj.searchParams.get('name');
      if (filenameParam) {
        return filenameParam;
      }

      // Generate a default name with timestamp
      return `file_${Date.now()}`;
    } catch {
      return `file_${Date.now()}`;
    }
  }

  /**
   * Lấy thông tin file trên Google Drive
   */
  async getFileInfo(fileId: string): Promise<GoogleDriveUploadResult | null> {
    if (!this.drive) {
      return null;
    }

    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size, webViewLink, webContentLink, thumbnailLink',
      });

      const file = response.data;
      return {
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        size: parseInt(file.size || '0'),
        webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
        webContentLink: file.webContentLink || `https://drive.google.com/uc?export=download&id=${file.id}`,
        thumbnailLink: file.thumbnailLink || undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to get file info: ${error.message}`);
      return null;
    }
  }

  /**
   * Xóa file trên Google Drive
   */
  async deleteFile(fileId: string): Promise<boolean> {
    if (!this.drive) {
      return false;
    }

    try {
      await this.drive.files.delete({ fileId });
      this.logger.log(`🗑️ Deleted file from Google Drive: ${fileId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      return false;
    }
  }

  /**
   * Kiểm tra trạng thái kết nối Google Drive
   */
  async checkConnection(): Promise<{ connected: boolean; message: string }> {
    if (!this.drive) {
      return {
        connected: false,
        message: 'Google Drive chưa được cấu hình. Cần thiết lập GOOGLE_DRIVE_CREDENTIALS_JSON.',
      };
    }

    try {
      // Try to access the company folder
      await this.drive.files.get({
        fileId: this.COMPANY_FOLDER_ID,
        fields: 'id, name',
      });

      return {
        connected: true,
        message: 'Kết nối Google Drive thành công',
      };
    } catch (error) {
      return {
        connected: false,
        message: `Không thể kết nối Google Drive: ${error.message}`,
      };
    }
  }
}
