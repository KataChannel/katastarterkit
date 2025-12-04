import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  CreateCallCenterConfigInput,
  UpdateCallCenterConfigInput,
  SyncCallCenterInput,
  CallCenterRecordFiltersInput,
} from '../graphql/inputs/callcenter.input';
import { PaginationInput } from '../graphql/models/pagination.model';
import { GoogleDriveService } from './google-drive.service';

interface ExternalCDRResponse {
  status: string;
  result_in_page: number;
  start_offset: string;
  next_offset: number;
  data: ExternalCDRRecord[];
}

interface ExternalCDRRecord {
  uuid: string;
  direction: string;
  caller_id_number?: string;
  outbound_caller_id_number?: string;
  destination_number?: string;
  start_epoch?: string;
  end_epoch?: string;
  answer_epoch?: string;
  duration?: string;
  billsec?: string;
  sip_hangup_disposition?: string;
  record_path?: string | null;
  call_status: string;
}

@Injectable()
export class CallCenterService {
  private readonly logger = new Logger(CallCenterService.name);

  // Map để track các sync đang chạy: syncLogId -> AbortController
  private runningSyncs: Map<string, { aborted: boolean; signal: AbortController }> = new Map();

  // Google Drive folder ID for call recordings
  private readonly CALL_RECORDINGS_FOLDER_ID = '1sqxPHnJmHCwyVD9vghPe-i8nbKonmjHT';

  // PBX Recording base URL
  private readonly PBX_RECORDING_BASE_URL = 'https://pbx01.onepos.vn:8080/recordings';

  constructor(
    private readonly prisma: PrismaService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  // ============================================================================
  // STOP SYNC FUNCTIONALITY
  // ============================================================================

  /**
   * Lấy danh sách các sync đang chạy
   */
  getRunningSyncs(): string[] {
    return Array.from(this.runningSyncs.keys());
  }

  /**
   * Kiểm tra xem sync có đang chạy không
   */
  isSyncRunning(syncLogId: string): boolean {
    return this.runningSyncs.has(syncLogId);
  }

  /**
   * Dừng tiến trình sync đang chạy
   */
  async stopSyncProcess(syncLogId: string): Promise<{
    success: boolean;
    message: string;
    syncLogId: string;
    recordsProcessed?: number;
  }> {
    this.logger.log(`Attempting to stop sync process: ${syncLogId}`);

    // Kiểm tra sync có đang chạy không
    const runningSync = this.runningSyncs.get(syncLogId);
    if (!runningSync) {
      // Kiểm tra trong database xem có phải là sync running không
      const syncLog = await this.prisma.callCenterSyncLog.findUnique({
        where: { id: syncLogId },
      });

      if (!syncLog) {
        return {
          success: false,
          message: 'Không tìm thấy tiến trình đồng bộ',
          syncLogId,
        };
      }

      if (syncLog.status !== 'running') {
        return {
          success: false,
          message: `Tiến trình đã kết thúc với trạng thái: ${syncLog.status}`,
          syncLogId,
          recordsProcessed: syncLog.recordsFetched,
        };
      }

      // Sync không còn trong memory nhưng vẫn running trong DB - force stop
      await this.prisma.callCenterSyncLog.update({
        where: { id: syncLogId },
        data: {
          status: 'stopped',
          errorMessage: 'Đã dừng bởi người dùng (force stop)',
          completedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Đã dừng tiến trình đồng bộ (force stop)',
        syncLogId,
        recordsProcessed: syncLog.recordsFetched,
      };
    }

    // Đánh dấu sync bị abort
    runningSync.aborted = true;
    runningSync.signal.abort();

    // Cập nhật trạng thái trong database
    const updatedLog = await this.prisma.callCenterSyncLog.update({
      where: { id: syncLogId },
      data: {
        status: 'stopped',
        errorMessage: 'Đã dừng bởi người dùng',
        completedAt: new Date(),
      },
    });

    // Xóa khỏi map sau khi đã stop
    this.runningSyncs.delete(syncLogId);

    this.logger.log(`Successfully stopped sync process: ${syncLogId}`);

    return {
      success: true,
      message: 'Đã dừng tiến trình đồng bộ thành công',
      syncLogId,
      recordsProcessed: updatedLog.recordsFetched,
    };
  }

  // ============================================================================
  // GOOGLE DRIVE RECORDING UPLOAD
  // ============================================================================

  /**
   * Upload call recording từ PBX server lên Google Drive
   * @param recordPath - đường dẫn recording từ API PBX
   * @param recordId - ID của record để tạo tên file
   * @returns Google Drive URL hoặc null nếu lỗi
   */
  private async uploadRecordingToGoogleDrive(
    recordPath: string,
    recordId: string,
  ): Promise<{ url: string; fileId: string } | null> {
    if (!recordPath) {
      return null;
    }

    // Kiểm tra Google Drive đã được cấu hình chưa
    if (!this.googleDriveService.isConfigured()) {
      this.logger.warn('Google Drive chưa được cấu hình - bỏ qua upload recording');
      return null;
    }

    try {
      const recordingUrl = `${this.PBX_RECORDING_BASE_URL}${recordPath}`;
      this.logger.log(`📞 Đang tải recording từ: ${recordingUrl}`);

      // Tải file từ PBX server
      const response = await fetch(recordingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        this.logger.warn(`Không thể tải recording: ${response.status} ${response.statusText}`);
        return null;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get('content-type') || 'audio/wav';
      
      // Tạo tên file từ recordPath
      const pathParts = recordPath.split('/');
      const originalFileName = pathParts[pathParts.length - 1] || `recording_${recordId}.wav`;
      
      // Upload lên Google Drive với folder ID chỉ định
      const result = await this.googleDriveService.uploadFileToFolder(
        buffer,
        originalFileName,
        contentType,
        this.CALL_RECORDINGS_FOLDER_ID,
      );

      this.logger.log(`✅ Đã upload recording lên Google Drive: ${result.webViewLink}`);

      return {
        url: result.webViewLink,
        fileId: result.id,
      };
    } catch (error) {
      this.logger.error(`❌ Lỗi upload recording lên Google Drive: ${error.message}`);
      return null;
    }
  }

  // ============================================================================
  // CONFIG MANAGEMENT
  // ============================================================================

  async getConfig() {
    // Get the most recently updated active config first
    let config = await this.prisma.callCenterConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    // If no active config, get any config ordered by most recent
    if (!config) {
      config = await this.prisma.callCenterConfig.findFirst({
        orderBy: { updatedAt: 'desc' },
      });
    }

    // If still no config, create a new one with isActive: true
    if (!config) {
      this.logger.log('No config found, creating default config');
      config = await this.prisma.callCenterConfig.create({
        data: {
          apiUrl: 'https://pbx01.onepos.vn:8080/api/v2/cdrs',
          domain: 'tazaspa102019',
          syncMode: 'MANUAL',
          isActive: true, // Changed to true by default
          defaultDaysBack: 30,
          batchSize: 200,
        },
      });
    }

    return config;
  }

  async createConfig(input: CreateCallCenterConfigInput) {
    this.logger.log('Creating call center config');

    return this.prisma.callCenterConfig.create({
      data: input,
    });
  }

  async updateConfig(id: string, input: UpdateCallCenterConfigInput) {
    this.logger.log(`Updating call center config: ${id}`);
    this.logger.log(`Update input received: ${JSON.stringify(input)}`);

    // Filter out undefined values to ensure boolean false is preserved
    const updateData = Object.fromEntries(
      Object.entries(input).filter(([_, value]) => value !== undefined)
    );

    this.logger.log(`Update data after filtering: ${JSON.stringify(updateData)}`);

    const updated = await this.prisma.callCenterConfig.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(`Updated config result: ${JSON.stringify(updated)}`);
    return updated;
  }

  async deleteConfig(id: string) {
    this.logger.log(`Deleting call center config: ${id}`);

    return this.prisma.callCenterConfig.delete({
      where: { id },
    });
  }

  // ============================================================================
  // SYNC FUNCTIONALITY
  // ============================================================================

  async syncCallCenterData(input?: SyncCallCenterInput) {
    const startTime = Date.now();
    const config = input?.configId
      ? await this.prisma.callCenterConfig.findUnique({
          where: { id: input.configId },
        })
      : await this.getConfig();

    if (!config) {
      throw new HttpException('Config not found', HttpStatus.NOT_FOUND);
    }

    if (!config.isActive) {
      throw new HttpException(
        'Cấu hình Call Center chưa được kích hoạt. Vui lòng bật "Kích hoạt" trong phần Cài đặt.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Calculate date range - parse ISO strings to Date objects
    // fromDate/toDate are now ISO strings from GraphQL input
    const toDate = input?.toDate 
      ? new Date(input.toDate)
      : new Date();
    const fromDate = input?.fromDate
      ? new Date(input.fromDate)
      : new Date(Date.now() - config.defaultDaysBack * 24 * 60 * 60 * 1000);

    // Log the actual dates being used
    this.logger.log(`Sync input received - fromDate: ${input?.fromDate}, toDate: ${input?.toDate}`);
    this.logger.log(`Parsed dates - fromDate: ${fromDate.toISOString()}, toDate: ${toDate.toISOString()}`);

    // Validate parsed dates
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new HttpException('Invalid date format. Please use ISO format (e.g., 2025-01-01T00:00:00.000Z)', HttpStatus.BAD_REQUEST);
    }

    // Create sync log
    const syncLog = await this.prisma.callCenterSyncLog.create({
      data: {
        configId: config.id,
        syncType: input?.fullSync ? 'MANUAL' : config.syncMode,
        status: 'running',
        fromDate,
        toDate,
        offset: 0,
      },
    });

    // Tạo AbortController để hỗ trợ stop
    const abortController = new AbortController();
    this.runningSyncs.set(syncLog.id, { 
      aborted: false, 
      signal: abortController 
    });

    try {
      this.logger.log(
        `Starting sync from ${fromDate.toISOString()} to ${toDate.toISOString()}`,
      );

      let totalFetched = 0;
      let totalCreated = 0;
      let totalUpdated = 0;
      let totalSkipped = 0;
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        // Kiểm tra xem có bị abort không
        const runningSync = this.runningSyncs.get(syncLog.id);
        if (runningSync?.aborted) {
          this.logger.log(`Sync ${syncLog.id} was stopped by user`);
          
          // Cleanup và throw để trigger catch block
          this.runningSyncs.delete(syncLog.id);
          
          return {
            success: true,
            message: 'Đồng bộ đã bị dừng bởi người dùng',
            syncLogId: syncLog.id,
            recordsFetched: totalFetched,
            recordsCreated: totalCreated,
            recordsUpdated: totalUpdated,
          };
        }

        // Build API URL
        const apiUrl = this.buildApiUrl(config, fromDate, toDate, offset);
        this.logger.log(`Fetching from: ${apiUrl}`);
        this.logger.log(`Date range in UTC: ${fromDate.toISOString()} to ${toDate.toISOString()}`);
        this.logger.log(`Formatted for API: from=${this.formatDate(fromDate)} to=${this.formatDate(toDate)}`);

        // Fetch data from external API với abort signal
        const response = await fetch(apiUrl, {
          signal: abortController.signal,
        });
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }

        const result: ExternalCDRResponse = await response.json();

        if (result.status !== 'success') {
          throw new Error(`API returned error status: ${result.status}`);
        }

        const records = result.data || [];
        totalFetched += records.length;

        this.logger.log(
          `Fetched ${records.length} records (offset: ${offset})`,
        );

        // Process each record
        for (const record of records) {
          // Kiểm tra abort trước mỗi record để response nhanh hơn
          const currentSync = this.runningSyncs.get(syncLog.id);
          if (currentSync?.aborted) {
            this.logger.log(`Sync ${syncLog.id} was stopped during record processing`);
            this.runningSyncs.delete(syncLog.id);
            
            return {
              success: true,
              message: 'Đồng bộ đã bị dừng bởi người dùng',
              syncLogId: syncLog.id,
              recordsFetched: totalFetched,
              recordsCreated: totalCreated,
              recordsUpdated: totalUpdated,
            };
          }

          try {
            // Validate required fields
            if (!record.uuid) {
              this.logger.warn('Skipping record without UUID');
              totalSkipped++;
              continue;
            }

            // Skip records with missing critical fields
            if (!record.direction || !record.call_status) {
              this.logger.warn(
                `Skipping record ${record.uuid}: missing direction or call_status`,
              );
              totalSkipped++;
              continue;
            }

            const existing = await this.prisma.callCenterRecord.findUnique({
              where: { externalUuid: record.uuid },
            });

            // Chuẩn bị dữ liệu cơ bản
            const data: any = {
              externalUuid: record.uuid,
              direction: record.direction?.toUpperCase() as any,
              callerIdNumber: record.caller_id_number,
              outboundCallerIdNumber: record.outbound_caller_id_number,
              destinationNumber: record.destination_number,
              startEpoch: record.start_epoch,
              endEpoch: record.end_epoch,
              answerEpoch: record.answer_epoch,
              duration: record.duration,
              billsec: record.billsec,
              sipHangupDisposition: record.sip_hangup_disposition,
              callStatus: record.call_status?.toUpperCase() as any,
              recordPath: record.record_path,
              domain: config.domain,
              rawData: record as any,
            };

            // Upload recording lên Google Drive nếu có file ghi âm và chưa được upload
            if (record.record_path) {
              // Chỉ upload nếu là record mới hoặc record cũ chưa có googleDriveUrl
              const shouldUpload = !existing || !existing.googleDriveUrl;
              
              if (shouldUpload) {
                const driveResult = await this.uploadRecordingToGoogleDrive(
                  record.record_path,
                  record.uuid,
                );
                
                if (driveResult) {
                  data.googleDriveUrl = driveResult.url;
                  data.googleDriveFileId = driveResult.fileId;
                }
              } else {
                // Giữ nguyên Google Drive URL cũ nếu đã có
                data.googleDriveUrl = existing.googleDriveUrl;
                data.googleDriveFileId = existing.googleDriveFileId;
              }
            }

            if (existing) {
              await this.prisma.callCenterRecord.update({
                where: { id: existing.id },
                data,
              });
              totalUpdated++;
            } else {
              await this.prisma.callCenterRecord.create({
                data,
              });
              totalCreated++;
            }
          } catch (error) {
            this.logger.error(
              `Error processing record ${record.uuid}: ${error.message}`,
            );
            totalSkipped++;
          }
        }

        // Check if there are more records
        if (records.length < config.batchSize) {
          hasMore = false;
        } else {
          offset = result.next_offset;
        }

        // Update sync log progress
        await this.prisma.callCenterSyncLog.update({
          where: { id: syncLog.id },
          data: {
            offset,
            recordsFetched: totalFetched,
            recordsCreated: totalCreated,
            recordsUpdated: totalUpdated,
            recordsSkipped: totalSkipped,
          },
        });
      }

      // Xóa khỏi running syncs khi hoàn thành
      this.runningSyncs.delete(syncLog.id);

      // Mark sync as completed
      const duration = Date.now() - startTime;
      await this.prisma.callCenterSyncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'success',
          completedAt: new Date(),
          duration,
        },
      });

      // Update config
      await this.prisma.callCenterConfig.update({
        where: { id: config.id },
        data: {
          lastSyncAt: new Date(),
          lastSyncStatus: 'success',
          lastSyncError: null,
          totalRecordsSynced: config.totalRecordsSynced + totalCreated,
        },
      });

      this.logger.log(
        `Sync completed: ${totalCreated} created, ${totalUpdated} updated, ${totalSkipped} skipped`,
      );

      return {
        success: true,
        message: 'Sync completed successfully',
        syncLogId: syncLog.id,
        recordsFetched: totalFetched,
        recordsCreated: totalCreated,
        recordsUpdated: totalUpdated,
      };
    } catch (error) {
      // Xóa khỏi running syncs khi có lỗi
      this.runningSyncs.delete(syncLog.id);

      // Kiểm tra nếu là AbortError (bị stop)
      if (error.name === 'AbortError') {
        this.logger.log(`Sync ${syncLog.id} aborted via AbortController`);
        return {
          success: true,
          message: 'Đồng bộ đã bị dừng bởi người dùng',
          syncLogId: syncLog.id,
          recordsFetched: 0,
          recordsCreated: 0,
          recordsUpdated: 0,
        };
      }

      this.logger.error(`Sync failed: ${error.message}`);

      // Mark sync as failed
      await this.prisma.callCenterSyncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'error',
          errorMessage: error.message,
          errorDetails: { stack: error.stack },
          completedAt: new Date(),
          duration: Date.now() - startTime,
        },
      });

      // Update config
      await this.prisma.callCenterConfig.update({
        where: { id: config.id },
        data: {
          lastSyncStatus: 'error',
          lastSyncError: error.message,
        },
      });

      throw new HttpException(
        `Sync failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private buildApiUrl(
    config: any,
    fromDate: Date,
    toDate: Date,
    offset: number,
  ): string {
    const params = new URLSearchParams({
      domain: config.domain,
      limit: config.batchSize.toString(),
      from: this.formatDate(fromDate),
      to: this.formatDate(toDate),
      offset: offset.toString(),
    });

    return `${config.apiUrl}?${params.toString()}`;
  }

  private formatDate(date: Date): string {
    // Format: 2025-09-01 00:00:00
    // IMPORTANT: Use UTC methods to avoid timezone conversion issues
    // Frontend sends UTC dates, API expects UTC dates
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // ============================================================================
  // CRON JOB
  // ============================================================================

  @Cron(CronExpression.EVERY_HOUR)
  async handleScheduledSync() {
    this.logger.log('Running scheduled sync check');

    const config = await this.getConfig();

    if (!config || !config.isActive || config.syncMode !== 'SCHEDULED') {
      this.logger.log('Scheduled sync is not enabled');
      return;
    }

    try {
      await this.syncCallCenterData();
    } catch (error) {
      this.logger.error(`Scheduled sync failed: ${error.message}`);
    }
  }

  // ============================================================================
  // QUERY RECORDS
  // ============================================================================

  async getRecords(
    pagination: PaginationInput,
    filters?: CallCenterRecordFiltersInput,
  ) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters) {
      if (filters.direction) {
        where.direction = filters.direction;
      }
      if (filters.callStatus) {
        where.callStatus = filters.callStatus;
      }
      if (filters.callerIdNumber) {
        where.callerIdNumber = { contains: filters.callerIdNumber };
      }
      if (filters.destinationNumber) {
        where.destinationNumber = { contains: filters.destinationNumber };
      }
      if (filters.domain) {
        where.domain = filters.domain;
      }
      if (filters.startDateFrom || filters.startDateTo) {
        // Convert dates to epoch timestamps for filtering by startEpoch
        if (filters.startDateFrom) {
          const fromEpoch = Math.floor(new Date(filters.startDateFrom).getTime() / 1000).toString();
          where.startEpoch = { ...where.startEpoch, gte: fromEpoch };
        }
        if (filters.startDateTo) {
          const toEpoch = Math.floor(new Date(filters.startDateTo).getTime() / 1000).toString();
          where.startEpoch = { ...where.startEpoch, lte: toEpoch };
        }
      }
      if (filters.search) {
        where.OR = [
          { callerIdNumber: { contains: filters.search } },
          { destinationNumber: { contains: filters.search } },
          { outboundCallerIdNumber: { contains: filters.search } },
        ];
      }
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.callCenterRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startEpoch: 'desc' },
      }),
      this.prisma.callCenterRecord.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getRecordById(id: string) {
    return this.prisma.callCenterRecord.findUnique({
      where: { id },
    });
  }

  async getSyncLogs(pagination: PaginationInput) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.prisma.callCenterSyncLog.findMany({
        skip,
        take: limit,
        orderBy: { startedAt: 'desc' },
      }),
      this.prisma.callCenterSyncLog.count(),
    ]);

    return {
      items,
      total: totalItems,
    };
  }

  // ============================================================================
  // STATS QUERY - Get aggregated statistics for filtered records
  // ============================================================================

  async getRecordsStats(filters?: CallCenterRecordFiltersInput) {
    const where: any = {};

    if (filters) {
      if (filters.direction) {
        where.direction = filters.direction;
      }
      if (filters.callStatus) {
        where.callStatus = filters.callStatus;
      }
      if (filters.callerIdNumber) {
        where.callerIdNumber = { contains: filters.callerIdNumber };
      }
      if (filters.destinationNumber) {
        where.destinationNumber = { contains: filters.destinationNumber };
      }
      if (filters.domain) {
        where.domain = filters.domain;
      }
      if (filters.startDateFrom || filters.startDateTo) {
        // Convert dates to epoch timestamps for filtering by startEpoch
        if (filters.startDateFrom) {
          const fromEpoch = Math.floor(new Date(filters.startDateFrom).getTime() / 1000).toString();
          where.startEpoch = { ...where.startEpoch, gte: fromEpoch };
        }
        if (filters.startDateTo) {
          const toEpoch = Math.floor(new Date(filters.startDateTo).getTime() / 1000).toString();
          where.startEpoch = { ...where.startEpoch, lte: toEpoch };
        }
      }
      if (filters.search) {
        where.OR = [
          { callerIdNumber: { contains: filters.search } },
          { destinationNumber: { contains: filters.search } },
          { outboundCallerIdNumber: { contains: filters.search } },
        ];
      }
    }

    // Get counts by direction and status
    const [
      total,
      inbound,
      outbound,
      local,
      answered,
      missed,
      allRecords,
    ] = await Promise.all([
      this.prisma.callCenterRecord.count({ where }),
      this.prisma.callCenterRecord.count({ where: { ...where, direction: 'INBOUND' } }),
      this.prisma.callCenterRecord.count({ where: { ...where, direction: 'OUTBOUND' } }),
      this.prisma.callCenterRecord.count({ where: { ...where, direction: 'LOCAL' } }),
      this.prisma.callCenterRecord.count({ where: { ...where, callStatus: 'ANSWER' } }),
      this.prisma.callCenterRecord.count({ 
        where: { 
          ...where, 
          callStatus: { not: 'ANSWER' } 
        } 
      }),
      // Get all records to calculate total duration (limited for performance)
      this.prisma.callCenterRecord.findMany({
        where,
        select: { billsec: true },
        take: 100000, // Limit to prevent memory issues
      }),
    ]);

    // Calculate total duration from billsec
    const totalDuration = allRecords.reduce((sum, record) => {
      return sum + (parseInt(record.billsec || '0', 10) || 0);
    }, 0);

    return {
      total,
      inbound,
      outbound,
      local,
      answered,
      missed,
      totalDuration,
      avgDuration: total > 0 ? Math.round(totalDuration / total) : 0,
    };
  }

  // ============================================================================
  // STATS BY CALLER - Get aggregated statistics grouped by callerIdNumber
  // ============================================================================

  async getStatsByCaller(
    filters?: CallCenterRecordFiltersInput,
    limit: number = 50,
  ): Promise<{
    items: Array<{
      callerIdNumber: string;
      totalCalls: number;
      inboundCalls: number;
      outboundCalls: number;
      answeredCalls: number;
      missedCalls: number;
      totalDuration: number;
      avgDuration: number;
    }>;
    total: number;
  }> {
    const where: any = {};

    if (filters) {
      if (filters.direction) {
        where.direction = filters.direction;
      }
      if (filters.callStatus) {
        where.callStatus = filters.callStatus;
      }
      if (filters.callerIdNumber) {
        where.callerIdNumber = { contains: filters.callerIdNumber };
      }
      if (filters.destinationNumber) {
        where.destinationNumber = { contains: filters.destinationNumber };
      }
      if (filters.domain) {
        where.domain = filters.domain;
      }
      if (filters.startDateFrom || filters.startDateTo) {
        if (filters.startDateFrom) {
          const fromEpoch = Math.floor(new Date(filters.startDateFrom).getTime() / 1000).toString();
          where.startEpoch = { ...where.startEpoch, gte: fromEpoch };
        }
        if (filters.startDateTo) {
          const toEpoch = Math.floor(new Date(filters.startDateTo).getTime() / 1000).toString();
          where.startEpoch = { ...where.startEpoch, lte: toEpoch };
        }
      }
      if (filters.search) {
        where.OR = [
          { callerIdNumber: { contains: filters.search } },
          { destinationNumber: { contains: filters.search } },
          { outboundCallerIdNumber: { contains: filters.search } },
        ];
      }
    }

    // Use raw SQL for grouping by callerIdNumber since Prisma doesn't support groupBy with aggregation well
    // First get all matching records
    const records = await this.prisma.callCenterRecord.findMany({
      where,
      select: {
        callerIdNumber: true,
        direction: true,
        callStatus: true,
        billsec: true,
      },
    });

    // Group and aggregate in memory
    const callerStatsMap = new Map<string, {
      callerIdNumber: string;
      totalCalls: number;
      inboundCalls: number;
      outboundCalls: number;
      answeredCalls: number;
      missedCalls: number;
      totalDuration: number;
    }>();

    for (const record of records) {
      const caller = record.callerIdNumber || 'Unknown';
      
      if (!callerStatsMap.has(caller)) {
        callerStatsMap.set(caller, {
          callerIdNumber: caller,
          totalCalls: 0,
          inboundCalls: 0,
          outboundCalls: 0,
          answeredCalls: 0,
          missedCalls: 0,
          totalDuration: 0,
        });
      }

      const stats = callerStatsMap.get(caller)!;
      stats.totalCalls++;
      
      if (record.direction === 'INBOUND') {
        stats.inboundCalls++;
      } else if (record.direction === 'OUTBOUND') {
        stats.outboundCalls++;
      }
      
      if (record.callStatus === 'ANSWER') {
        stats.answeredCalls++;
      } else {
        stats.missedCalls++;
      }
      
      stats.totalDuration += parseInt(record.billsec || '0', 10) || 0;
    }

    // Convert to array and sort by totalCalls desc
    const items = Array.from(callerStatsMap.values())
      .map(stat => ({
        ...stat,
        avgDuration: stat.totalCalls > 0 ? Math.round(stat.totalDuration / stat.totalCalls) : 0,
      }))
      .sort((a, b) => b.totalCalls - a.totalCalls)
      .slice(0, limit);

    return {
      items,
      total: callerStatsMap.size,
    };
  }
}
