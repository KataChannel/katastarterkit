import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeminiService } from '../../ai/gemini.service';
import { NotificationService } from '../../services/notification.service';
import { PushNotificationService } from '../../services/push-notification.service';
import {
  CreateSourceDocumentInput,
  UpdateSourceDocumentInput,
  SourceDocumentFilterInput,
  LinkDocumentToCourseInput,
  UpdateCourseDocumentLinkInput,
} from './dto/source-document.dto';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import * as path from 'path';

@Injectable()
export class SourceDocumentService {
  private readonly logger = new Logger(SourceDocumentService.name);

  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
    private notificationService: NotificationService,
    private pushNotificationService: PushNotificationService,
  ) {}

  // Helper method to convert BigInt to Number for GraphQL
  private transformDocument(doc: any) {
    if (!doc) return doc;
    return {
      ...doc,
      fileSize: doc.fileSize ? Number(doc.fileSize) : null,
    };
  }

  // ============== CRUD Operations ==============

  async create(userId: string, input: CreateSourceDocumentInput) {
    // Log input for debugging
    console.log('📄 Creating source document:', {
      title: input.title,
      type: input.type,
      status: input.status,
      userId,
    });

    // Prepare data object explicitly to avoid spread issues
    const data: any = {
      title: input.title,
      type: input.type,
      status: input.status,
      userId,
      fileSize: input.fileSize ? BigInt(input.fileSize) : null,
    };

    // Add optional fields only if they exist
    if (input.description) data.description = input.description;
    if (input.url) data.url = input.url;
    if (input.content) data.content = input.content;
    if (input.fileName) data.fileName = input.fileName;
    if (input.mimeType) data.mimeType = input.mimeType;
    if (input.duration) data.duration = input.duration;
    if (input.thumbnailUrl) data.thumbnailUrl = input.thumbnailUrl;
    if (input.categoryId) data.categoryId = input.categoryId;
    if (input.tags?.length) data.tags = input.tags;

    // Set publishedAt if status is PUBLISHED
    if (input.status === 'PUBLISHED') {
      data.publishedAt = new Date();
    }

    // BigInt replacer for logging
    const bigIntReplacer = (key: string, value: any) => 
      typeof value === 'bigint' ? value.toString() : value;

    console.log('💾 Prisma create data:', JSON.stringify(data, bigIntReplacer, 2));

    const document = await this.prisma.sourceDocument.create({
      data,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
    return this.transformDocument(document);
  }

  async findAll(filter?: SourceDocumentFilterInput, page = 1, limit = 20) {
    const where: Prisma.SourceDocumentWhereInput = {};

    if (filter) {
      if (filter.types?.length) {
        where.type = { in: filter.types };
      }
      if (filter.statuses?.length) {
        where.status = { in: filter.statuses };
      }
      if (filter.categoryId) {
        where.categoryId = filter.categoryId;
      }
      if (filter.userId) {
        where.userId = filter.userId;
      }
      if (filter.search) {
        where.OR = [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
          { content: { contains: filter.search, mode: 'insensitive' } },
        ];
      }
      if (filter.tags?.length) {
        where.tags = { hasSome: filter.tags };
      }
      if (filter.isAiAnalyzed !== undefined) {
        where.isAiAnalyzed = filter.isAiAnalyzed;
      }
      if (filter.approvalRequested !== undefined) {
        where.approvalRequested = filter.approvalRequested;
        // If filtering for pending approvals, exclude already approved/rejected
        if (filter.approvalRequested === true) {
          where.approvedAt = null;
          where.rejectionReason = null;
        }
      }
    }

    console.log('🔍 [SourceDocumentService] Filter conditions:', {
      filter,
      where: JSON.stringify(where, null, 2),
      page,
      limit,
      skip: (page - 1) * limit,
      take: limit,
    });

    const [items, total] = await Promise.all([
      this.prisma.sourceDocument.findMany({
        where,
        include: {
          category: true,
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.sourceDocument.count({ where }),
    ]);

    console.log('📊 [SourceDocumentService] Query results:', {
      itemsCount: items.length,
      total,
      types: items.map(i => i.type),
      userIds: [...new Set(items.map(i => i.userId))],
    });

    return {
      items: items.map((item) => this.transformDocument(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const document = await this.prisma.sourceDocument.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
              },
            },
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException(`Source document with ID ${id} not found`);
    }

    // Increment view count
    await this.prisma.sourceDocument.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return this.transformDocument(document);
  }

  async update(id: string, input: UpdateSourceDocumentInput) {
    const existing = await this.findOne(id); // Check exists

    // Prepare update data
    const data: any = {
      ...input,
      fileSize: input.fileSize ? BigInt(input.fileSize) : undefined,
    };

    // Set publishedAt if status changes to PUBLISHED and it wasn't published before
    if (input.status === 'PUBLISHED' && !existing.publishedAt) {
      data.publishedAt = new Date();
    }

    const updated = await this.prisma.sourceDocument.update({
      where: { id },
      data,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
    return this.transformDocument(updated);
  }

  async delete(id: string) {
    await this.findOne(id); // Check exists

    return this.prisma.sourceDocument.delete({
      where: { id },
    });
  }

  // ============== Course Linking ==============

  async linkToCourse(userId: string, input: LinkDocumentToCourseInput) {
    // Check if link already exists
    const existing = await this.prisma.courseSourceDocument.findUnique({
      where: {
        courseId_documentId: {
          courseId: input.courseId,
          documentId: input.documentId,
        },
      },
    });

    if (existing) {
      throw new Error('Document already linked to this course');
    }

    // Create link
    const link = await this.prisma.courseSourceDocument.create({
      data: {
        ...input,
        addedBy: userId,
      },
      include: {
        document: {
          include: {
            category: true,
          },
        },
      },
    });

    // Increment usage count
    await this.prisma.sourceDocument.update({
      where: { id: input.documentId },
      data: { usageCount: { increment: 1 } },
    });

    return link;
  }

  async unlinkFromCourse(courseId: string, documentId: string) {
    const link = await this.prisma.courseSourceDocument.findUnique({
      where: {
        courseId_documentId: {
          courseId,
          documentId,
        },
      },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    await this.prisma.courseSourceDocument.delete({
      where: { id: link.id },
    });

    // Decrement usage count
    await this.prisma.sourceDocument.update({
      where: { id: documentId },
      data: { usageCount: { decrement: 1 } },
    });

    return { success: true };
  }

  async updateCourseLink(
    id: string,
    input: UpdateCourseDocumentLinkInput,
  ) {
    return this.prisma.courseSourceDocument.update({
      where: { id },
      data: input,
      include: {
        document: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async getCourseDocuments(courseId: string) {
    return this.prisma.courseSourceDocument.findMany({
      where: { courseId },
      include: {
        document: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  // ============== Stats & Analytics ==============

  async incrementDownloadCount(id: string) {
    const updated = await this.prisma.sourceDocument.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });
    return this.transformDocument(updated);
  }

  async getStats(userId?: string) {
    const where = userId ? { userId } : {};

    const [total, byType, byStatus, recentlyAdded] = await Promise.all([
      this.prisma.sourceDocument.count({ where }),
      this.prisma.sourceDocument.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
      this.prisma.sourceDocument.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      this.prisma.sourceDocument.findMany({
        where,
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      total,
      byType,
      byStatus,
      recentlyAdded,
    };
  }

  // ============== AI Analysis ==============

  async analyzeDocument(id: string): Promise<any> {
    const document = await this.findOne(id);

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Get content based on type
    let contentToAnalyze = '';
    
    if (document.type === 'TEXT' && document.content) {
      contentToAnalyze = document.content;
    } else if (document.description) {
      // Fallback to description if no text content
      contentToAnalyze = `${document.title}\n\n${document.description}`;
    } else {
      throw new Error('No content available for analysis');
    }

    // Analyze with Gemini
    const analysis = await this.geminiService.analyzeDocument(
      contentToAnalyze,
      document.type,
    );

    // Update document with analysis results
    const updated = await this.prisma.sourceDocument.update({
      where: { id },
      data: {
        aiSummary: analysis.summary,
        aiKeywords: analysis.keywords,
        aiTopics: analysis.topics,
        isAiAnalyzed: true,
        aiAnalyzedAt: new Date(),
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.transformDocument(updated);
  }

  async bulkAnalyze(userId?: string): Promise<{ analyzed: number; failed: number }> {
    const where: Prisma.SourceDocumentWhereInput = {
      isAiAnalyzed: false,
      type: 'TEXT', // Only analyze text documents for now
      ...(userId && { userId }),
    };

    const documents = await this.prisma.sourceDocument.findMany({
      where,
      take: 10, // Limit to 10 at a time to avoid rate limits
    });

    let analyzed = 0;
    let failed = 0;

    for (const doc of documents) {
      try {
        await this.analyzeDocument(doc.id);
        analyzed++;
      } catch (error) {
        console.error(`Failed to analyze document ${doc.id}:`, error);
        failed++;
      }
    }

    return { analyzed, failed };
  }

  // ============== Approval Workflow ==============

  /**
   * Count pending approval requests (both SourceDocuments and Courses)
   */
  async countPendingApprovals(): Promise<number> {
    // Count pending source documents
    const documentsCount = await this.prisma.sourceDocument.count({
      where: {
        approvalRequested: true,
        approvedAt: null,
        rejectionReason: null,
      },
    });

    // Count pending courses
    const coursesCount = await this.prisma.course.count({
      where: {
        approvalRequested: true,
        approvedAt: null,
        rejectionReason: null,
      },
    });

    return documentsCount + coursesCount;
  }

  /**
   * Request approval for a source document (Instructor -> Admin)
   */
  async requestApproval(documentId: string, userId: string) {
    const document = await this.findOne(documentId);

    if (document.userId !== userId) {
      throw new Error('You do not have permission to request approval for this document');
    }

    if (document.status !== 'DRAFT') {
      throw new Error('Only draft documents can be submitted for approval');
    }

    if (document.approvalRequested) {
      throw new Error('Approval already requested for this document');
    }

    // Update document
    const updated = await this.prisma.sourceDocument.update({
      where: { id: documentId },
      data: {
        approvalRequested: true,
        approvalRequestedAt: new Date(),
        approvalRequestedBy: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Get instructor info
    const instructor = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, firstName: true, lastName: true },
    });

    const instructorName = instructor?.firstName && instructor?.lastName
      ? `${instructor.firstName} ${instructor.lastName}`
      : instructor?.username || 'Giảng viên';

    // Send notification to all admins
    const admins = await this.prisma.user.findMany({
      where: {
        userRoles: {
          some: {
            role: {
              name: 'ADMIN',
            },
          },
        },
      },
      select: { id: true },
    });

    // Send notification and push to each admin
    for (const admin of admins) {
      try {
        await this.notificationService.create({
          userId: admin.id,
          title: 'Yêu cầu phê duyệt tài liệu',
          message: `${instructorName} đã gửi yêu cầu phê duyệt tài liệu "${updated.title}"`,
          type: 'SYSTEM',
          data: {
            documentId: updated.id,
            documentTitle: updated.title,
            instructorId: userId,
            instructorName,
            type: 'document_approval_request',
          },
        });

        // Send push notification
        await this.pushNotificationService.sendToUser(admin.id, {
          title: 'Yêu cầu phê duyệt tài liệu',
          message: `${instructorName} đã gửi yêu cầu phê duyệt tài liệu "${updated.title}"`,
          url: `/lms/admin/approvals?tab=documents`,
          data: {
            documentId: updated.id,
            type: 'document_approval_request',
          },
        });
      } catch (error) {
        console.error(`Failed to notify admin ${admin.id}:`, error);
      }
    }

    return this.transformDocument(updated);
  }

  /**
   * Approve a source document (Admin only)
   */
  async approveDocument(documentId: string, adminUserId: string) {
    const document = await this.findOne(documentId);

    if (!document.approvalRequested) {
      throw new Error('No approval request found for this document');
    }

    if (document.status === 'PUBLISHED') {
      throw new Error('Document is already published');
    }

    // Update document to PUBLISHED and reset approval request
    const updated = await this.prisma.sourceDocument.update({
      where: { id: documentId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        approvedBy: adminUserId,
        approvedAt: new Date(),
        approvalRequested: false, // Reset approval request flag
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.transformDocument(updated);
  }

  /**
   * Download file from URL
   * Supports: docs, xlsx, txt, md, pdf, images, videos, etc.
   * Includes special handling for Google Drive, Sheets, Docs
   */
  async downloadFromUrl(url: string): Promise<{
    buffer: Buffer;
    fileName: string;
    mimeType: string;
    size: number;
  }> {
    try {
      // Decode HTML entities (&#x2F; -> /, &amp; -> &, etc.)
      let cleanUrl = url
        .replace(/&#x2F;/g, '/')
        .replace(/&#x3A;/g, ':')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      this.logger.log(`📥 Downloading file from URL: ${cleanUrl}`);

      // Convert Google URLs to direct download links
      cleanUrl = this.convertGoogleUrlToDirectDownload(cleanUrl);

      // Validate URL
      const urlObj = new URL(cleanUrl);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new BadRequestException('Chỉ hỗ trợ HTTP/HTTPS URL');
      }

      // Download with axios (supports headers and better error handling)
      const response = await axios.get(cleanUrl, {
        responseType: 'arraybuffer',
        maxContentLength: 100 * 1024 * 1024, // 100MB max
        timeout: 60000, // 60s timeout
        maxRedirects: 5, // Follow redirects
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ShopRauSachBot/1.0)',
        },
      });

      const buffer = Buffer.from(response.data);
      const size = buffer.length;

      // Get mime type from response header or file extension
      let mimeType = response.headers['content-type']?.split(';')[0] || 'application/octet-stream';

      // Get filename from Content-Disposition or URL
      let fileName = 'downloaded-file';
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        // Try to extract filename from Content-Disposition
        const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
        if (filenameMatch && filenameMatch[1]) {
          fileName = decodeURIComponent(filenameMatch[1]);
        }
      } else {
        // Extract filename from URL
        const urlPath = urlObj.pathname;
        const urlFileName = path.basename(urlPath);
        if (urlFileName && urlFileName.length > 0 && urlFileName !== '/' && !urlFileName.includes('export')) {
          fileName = decodeURIComponent(urlFileName);
        }
      }

      // Generate filename based on source if still generic
      if (fileName === 'downloaded-file' || fileName === 'export') {
        if (cleanUrl.includes('docs.google.com/spreadsheets')) {
          fileName = 'google-sheet';
        } else if (cleanUrl.includes('docs.google.com/document')) {
          fileName = 'google-doc';
        } else if (cleanUrl.includes('docs.google.com/presentation')) {
          fileName = 'google-slides';
        } else if (cleanUrl.includes('drive.google.com')) {
          fileName = 'google-drive-file';
        } else {
          fileName = `file-${Date.now()}`;
        }
      }

      // Add extension based on mime type if missing
      if (!path.extname(fileName)) {
        const ext = this.getExtensionFromMimeType(mimeType);
        if (ext) {
          fileName += ext;
        }
      }

      this.logger.log(`✅ Downloaded: ${fileName} (${(size / 1024).toFixed(2)} KB, ${mimeType})`);

      return {
        buffer,
        fileName,
        mimeType,
        size,
      };
    } catch (error: any) {
      this.logger.error(`❌ Download failed: ${error.message}`, error.stack);
      
      if (error.response) {
        throw new BadRequestException(
          `Không thể tải file: HTTP ${error.response.status} ${error.response.statusText}`
        );
      } else if (error.code === 'ENOTFOUND') {
        throw new BadRequestException('Không thể kết nối đến URL');
      } else if (error.code === 'ETIMEDOUT') {
        throw new BadRequestException('Timeout khi tải file');
      } else {
        throw new BadRequestException(`Lỗi tải file: ${error.message}`);
      }
    }
  }

  /**
   * Convert Google Drive/Sheets/Docs URLs to direct download links
   */
  private convertGoogleUrlToDirectDownload(url: string): string {
    try {
      // Google Drive file: https://drive.google.com/file/d/FILE_ID/view
      // -> https://drive.google.com/uc?export=download&id=FILE_ID
      if (url.includes('drive.google.com/file/d/')) {
        const match = url.match(/\/file\/d\/([^\/\?]+)/);
        if (match && match[1]) {
          const fileId = match[1];
          this.logger.log(`🔄 Converting Google Drive URL (File ID: ${fileId})`);
          return `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
      }

      // Google Drive open: https://drive.google.com/open?id=FILE_ID
      // -> https://drive.google.com/uc?export=download&id=FILE_ID
      if (url.includes('drive.google.com/open?id=')) {
        const match = url.match(/[?&]id=([^&]+)/);
        if (match && match[1]) {
          const fileId = match[1];
          this.logger.log(`🔄 Converting Google Drive URL (File ID: ${fileId})`);
          return `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
      }

      // Google Sheets: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
      // -> https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=xlsx
      if (url.includes('docs.google.com/spreadsheets/d/')) {
        const match = url.match(/\/spreadsheets\/d\/([^\/\?]+)/);
        if (match && match[1]) {
          const sheetId = match[1];
          // Extract gid if present
          const gidMatch = url.match(/[?#&]gid=(\d+)/);
          const gid = gidMatch ? gidMatch[1] : '0';
          this.logger.log(`🔄 Converting Google Sheets URL (Sheet ID: ${sheetId}, GID: ${gid})`);
          return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx&gid=${gid}`;
        }
      }

      // Google Docs: https://docs.google.com/document/d/DOC_ID/edit
      // -> https://docs.google.com/document/d/DOC_ID/export?format=docx
      if (url.includes('docs.google.com/document/d/')) {
        const match = url.match(/\/document\/d\/([^\/\?]+)/);
        if (match && match[1]) {
          const docId = match[1];
          this.logger.log(`🔄 Converting Google Docs URL (Doc ID: ${docId})`);
          return `https://docs.google.com/document/d/${docId}/export?format=docx`;
        }
      }

      // Google Slides: https://docs.google.com/presentation/d/SLIDE_ID/edit
      // -> https://docs.google.com/presentation/d/SLIDE_ID/export?format=pptx
      if (url.includes('docs.google.com/presentation/d/')) {
        const match = url.match(/\/presentation\/d\/([^\/\?]+)/);
        if (match && match[1]) {
          const slideId = match[1];
          this.logger.log(`🔄 Converting Google Slides URL (Slide ID: ${slideId})`);
          return `https://docs.google.com/presentation/d/${slideId}/export?format=pptx`;
        }
      }

      // Dropbox: https://www.dropbox.com/s/ABC/file.pdf?dl=0
      // -> https://www.dropbox.com/s/ABC/file.pdf?dl=1
      if (url.includes('dropbox.com') && url.includes('?dl=0')) {
        this.logger.log(`🔄 Converting Dropbox URL to direct download`);
        return url.replace('?dl=0', '?dl=1');
      }

      // OneDrive: Add download=1 parameter
      if (url.includes('1drv.ms') || url.includes('onedrive.live.com')) {
        this.logger.log(`🔄 Converting OneDrive URL to direct download`);
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}download=1`;
      }

      return url;
    } catch (error) {
      this.logger.warn(`⚠️ Failed to convert URL, using original: ${error.message}`);
      return url;
    }
  }

  /**
   * Get file extension from MIME type
   */
  private getExtensionFromMimeType(mimeType: string): string | null {
    const mimeMap: Record<string, string> = {
      // Documents
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/vnd.ms-excel': '.xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.ms-powerpoint': '.ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
      'text/plain': '.txt',
      'text/markdown': '.md',
      'text/html': '.html',
      'text/csv': '.csv',
      // Google export formats
      'application/vnd.google-apps.spreadsheet': '.xlsx',
      'application/vnd.google-apps.document': '.docx',
      'application/vnd.google-apps.presentation': '.pptx',
      // Binary/octet-stream (common for downloads)
      'application/octet-stream': '.bin',
      // Images
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
      // Archives
      'application/zip': '.zip',
      'application/x-rar-compressed': '.rar',
      'application/x-7z-compressed': '.7z',
      // Videos
      'video/mp4': '.mp4',
      'video/mpeg': '.mpeg',
      'video/quicktime': '.mov',
      'video/webm': '.webm',
      // Audio
      'audio/mpeg': '.mp3',
      'audio/wav': '.wav',
      'audio/ogg': '.ogg',
      // Code
      'application/json': '.json',
      'application/javascript': '.js',
      'text/css': '.css',
    };

    return mimeMap[mimeType] || null;
  }

  /**
   * Reject a source document approval request (Admin only)
   */
  async rejectDocument(documentId: string, adminUserId: string, reason: string) {
    const document = await this.findOne(documentId);

    if (!document.approvalRequested) {
      throw new Error('No approval request found for this document');
    }

    // Reset approval request
    const updated = await this.prisma.sourceDocument.update({
      where: { id: documentId },
      data: {
        approvalRequested: false,
        approvalRequestedAt: null,
        rejectionReason: reason,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.transformDocument(updated);
  }
}
