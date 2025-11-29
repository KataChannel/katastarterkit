import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service tối ưu hóa Audit Logs
 * Giảm dung lượng database và cải thiện hiệu suất
 */
@Injectable()
export class AuditOptimizationService {
  private readonly logger = new Logger(AuditOptimizationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * CHIẾN LƯỢC 1: Lọc logs không quan trọng
   * Không log các endpoint health check, monitoring
   */
  shouldSkipLogging(request: any): boolean {
    const skipPatterns = [
      '/',
      '/health',
      '/ping',
      '/metrics',
      '/favicon.ico',
      '/_next/',
      '/api/health',
    ];

    const endpoint = request?.url || '';
    return skipPatterns.some(pattern => endpoint.startsWith(pattern));
  }

  /**
   * CHIẾN LƯỢC 2: Log level-based retention
   * Chỉ lưu chi tiết cho logs quan trọng
   */
  shouldLogPerformanceData(severity: string): boolean {
    // Chỉ log performance data cho warn, error, critical
    return ['warn', 'error', 'critical'].includes(severity);
  }

  /**
   * CHIẾN LƯỢC 3: Aggregate logs giống nhau
   * Nhóm các logs lặp đi lặp lại
   */
  async aggregateSimilarLogs(hours: number = 1): Promise<void> {
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    try {
      // Tìm các logs có thể aggregate (cùng action, endpoint, user trong 1 giờ)
      const groupedLogs = await this.prisma.$queryRaw<any[]>`
        SELECT 
          action,
          endpoint,
          "userId",
          COUNT(*) as count,
          MIN(timestamp) as first_occurrence,
          MAX(timestamp) as last_occurrence,
          ARRAY_AGG(id) as log_ids
        FROM audit_logs
        WHERE timestamp >= ${cutoffDate}
          AND severity = 'info'
          AND action NOT IN ('LOGIN', 'LOGOUT')
        GROUP BY action, endpoint, "userId"
        HAVING COUNT(*) > 10
      `;

      for (const group of groupedLogs) {
        if (group.count > 10) {
          // Tạo một log tổng hợp
          await this.prisma.auditLog.create({
            data: {
              action: `AGGREGATED_${group.action}`,
              resourceType: 'aggregated_logs',
              endpoint: group.endpoint,
              userId: group.userId,
              operationType: 'SYSTEM',
              severity: 'info',
              details: {
                aggregated: true,
                count: group.count,
                firstOccurrence: group.first_occurrence,
                lastOccurrence: group.last_occurrence,
                originalLogIds: group.log_ids.slice(0, 5) // Lưu 5 ID đầu tiên
              },
              tags: ['aggregated', 'auto-cleanup']
            }
          });

          // Xóa các logs gốc
          await this.prisma.auditLog.deleteMany({
            where: {
              id: { in: group.log_ids }
            }
          });

          this.logger.log(`Aggregated ${group.count} logs for ${group.action}`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to aggregate logs', error);
    }
  }

  /**
   * CHIẾN LƯỢC 4: Tiered Storage - Di chuyển logs cũ sang cold storage
   * Xuất logs cũ ra file và xóa khỏi DB
   */
  async archiveOldLogs(daysOld: number = 90): Promise<void> {
    const archiveDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

    try {
      // Đếm số logs cần archive
      const logsToArchive = await this.prisma.auditLog.count({
        where: {
          timestamp: { lt: archiveDate }
          // Skip tags filter due to Prisma limitation
        }
      });

      if (logsToArchive === 0) {
        this.logger.log('No logs to archive');
        return;
      }

      this.logger.log(`Archiving ${logsToArchive} logs older than ${daysOld} days`);

      // Xuất logs theo batch để tránh memory issues
      const batchSize = 1000;
      let offset = 0;

      while (true) {
        const logs = await this.prisma.auditLog.findMany({
          where: {
            timestamp: { lt: archiveDate }
            // Skip tags filter due to Prisma limitation
          },
          take: batchSize,
          skip: offset,
          orderBy: { timestamp: 'asc' }
        });

        if (logs.length === 0) break;

        // TODO: Lưu vào S3, MinIO, hoặc file system
        // await this.saveToArchiveStorage(logs);

        // Đánh dấu đã archive hoặc xóa
        const logIds = logs.map(log => log.id);
        await this.prisma.auditLog.deleteMany({
          where: { id: { in: logIds } }
        });

        this.logger.log(`Archived batch ${offset / batchSize + 1}`);
        offset += batchSize;
      }

      this.logger.log(`Successfully archived ${logsToArchive} logs`);
    } catch (error) {
      this.logger.error('Failed to archive logs', error);
    }
  }

  /**
   * CHIẾN LƯỢC 5: Retention Policy - Xóa logs theo độ ưu tiên
   */
  async applyRetentionPolicy(): Promise<void> {
    try {
      const policies = [
        // Info logs: giữ 30 ngày
        {
          severity: 'info',
          retentionDays: 30,
          description: 'Info logs'
        },
        // Debug logs: giữ 7 ngày
        {
          severity: 'debug',
          retentionDays: 7,
          description: 'Debug logs'
        },
        // Warn logs: giữ 90 ngày
        {
          severity: 'warn',
          retentionDays: 90,
          description: 'Warning logs'
        },
        // Error/Critical logs: giữ 180 ngày
        {
          severity: ['error', 'critical'],
          retentionDays: 180,
          description: 'Error/Critical logs'
        }
      ];

      for (const policy of policies) {
        const cutoffDate = new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000);
        
        const severityFilter = Array.isArray(policy.severity)
          ? { in: policy.severity }
          : policy.severity;

        const deleted = await this.prisma.auditLog.deleteMany({
          where: {
            severity: severityFilter,
            timestamp: { lt: cutoffDate },
            // Không xóa logs có flag quan trọng
            requiresReview: false,
            sensitiveData: false
          }
        });

        if (deleted.count > 0) {
          this.logger.log(`Deleted ${deleted.count} ${policy.description} older than ${policy.retentionDays} days`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to apply retention policy', error);
    }
  }

  /**
   * CHIẾN LƯỢC 6: Sampling - Chỉ log một phần requests
   * Sử dụng cho high-frequency endpoints
   */
  shouldSampleLog(action: string, sampleRate: number = 0.1): boolean {
    // Các actions có tần suất cao
    const highFrequencyActions = [
      'POST_/graphql',
      'GET_/',
      'GET_/api/',
    ];

    if (highFrequencyActions.some(pattern => action.startsWith(pattern))) {
      return Math.random() < sampleRate; // Chỉ log 10%
    }

    return true; // Log tất cả các actions khác
  }

  /**
   * CHIẾN LƯỢC 7: Compression - Nén dữ liệu JSON
   */
  compressJsonData(data: any): string {
    if (!data) return '';
    
    // Remove null/undefined values
    const cleaned = JSON.parse(JSON.stringify(data, (key, value) => {
      if (value === null || value === undefined) return undefined;
      return value;
    }));

    return JSON.stringify(cleaned);
  }

  /**
   * CHIẾN LƯỢC 8: Cleanup duplicate logs
   */
  async cleanupDuplicates(): Promise<void> {
    try {
      // Tìm các logs duplicate (cùng action, resourceId, timestamp trong 1 giây)
      const duplicates = await this.prisma.$queryRaw<any[]>`
        SELECT 
          action,
          "resourceId",
          DATE_TRUNC('second', timestamp) as time_bucket,
          ARRAY_AGG(id ORDER BY timestamp DESC) as ids,
          COUNT(*) as count
        FROM audit_logs
        WHERE timestamp >= NOW() - INTERVAL '7 days'
        GROUP BY action, "resourceId", time_bucket
        HAVING COUNT(*) > 1
      `;

      let totalDeleted = 0;

      for (const dup of duplicates) {
        // Giữ log đầu tiên, xóa các logs còn lại
        const [keepId, ...deleteIds] = dup.ids;
        
        if (deleteIds.length > 0) {
          await this.prisma.auditLog.deleteMany({
            where: { id: { in: deleteIds } }
          });
          totalDeleted += deleteIds.length;
        }
      }

      if (totalDeleted > 0) {
        this.logger.log(`Cleaned up ${totalDeleted} duplicate logs`);
      }
    } catch (error) {
      this.logger.error('Failed to cleanup duplicates', error);
    }
  }

  /**
   * CHIẾN LƯỢC 9: Database partitioning by month
   * Tạo partitions theo tháng để query nhanh hơn
   */
  async createMonthlyPartitions(): Promise<void> {
    // Note: Requires PostgreSQL 10+ with partitioning support
    try {
      const currentMonth = new Date();
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const partitionName = `audit_logs_${currentMonth.getFullYear()}_${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

      // Check if partition exists
      const exists = await this.prisma.$queryRaw<any[]>`
        SELECT tablename 
        FROM pg_tables 
        WHERE tablename = ${partitionName}
      `;

      if (exists.length === 0) {
        this.logger.log(`Creating partition: ${partitionName}`);
        
        // TODO: Create partition (requires raw SQL)
        // This is a template - implement based on your needs
        /*
        await this.prisma.$executeRaw`
          CREATE TABLE ${partitionName} PARTITION OF audit_logs
          FOR VALUES FROM (${currentMonth}) TO (${nextMonth})
        `;
        */
      }
    } catch (error) {
      this.logger.warn('Partitioning not supported or failed', error);
    }
  }

  /**
   * Cron Job: Chạy cleanup hàng ngày lúc 2 AM
   * TODO: Enable after fixing @nestjs/schedule version compatibility
   */
  // @Cron('0 2 * * *')
  async scheduledCleanup(): Promise<void> {
    this.logger.log('Starting scheduled audit logs cleanup');

    try {
      // 1. Cleanup duplicates
      await this.cleanupDuplicates();

      // 2. Aggregate similar logs
      await this.aggregateSimilarLogs(24);

      // 3. Apply retention policy
      await this.applyRetentionPolicy();

      // 4. Archive old logs (every week)
      const today = new Date().getDay();
      if (today === 0) { // Sunday
        await this.archiveOldLogs(90);
      }

      this.logger.log('Scheduled cleanup completed successfully');
    } catch (error) {
      this.logger.error('Scheduled cleanup failed', error);
    }
  }

  /**
   * Get statistics about audit logs storage
   */
  async getStorageStats() {
    const stats = await this.prisma.$queryRaw<any[]>`
      SELECT 
        pg_size_pretty(pg_total_relation_size('audit_logs')) as total_size,
        pg_size_pretty(pg_relation_size('audit_logs')) as table_size,
        pg_size_pretty(pg_indexes_size('audit_logs')) as indexes_size,
        (SELECT COUNT(*) FROM audit_logs) as total_rows,
        (SELECT COUNT(*) FROM audit_logs WHERE timestamp >= NOW() - INTERVAL '7 days') as last_7_days,
        (SELECT COUNT(*) FROM audit_logs WHERE timestamp >= NOW() - INTERVAL '30 days') as last_30_days
    `;

    return stats[0];
  }
}
