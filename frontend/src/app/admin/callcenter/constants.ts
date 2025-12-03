/**
 * Call Center - Constants & GraphQL Operations
 * Định nghĩa các constants, GraphQL queries và mutations
 */

import { gql } from '@apollo/client';

// ============================================================================
// GraphQL Operations
// ============================================================================

/**
 * Mutation để đồng bộ dữ liệu Call Center từ PBX API
 */
export const SYNC_CALLCENTER_DATA = gql`
  mutation SyncCallCenterData($input: SyncCallCenterInput) {
    syncCallCenterData(input: $input) {
      success
      message
      syncLogId
      recordsFetched
      recordsCreated
      recordsUpdated
      error
    }
  }
`;

/**
 * Mutation để dừng tiến trình đồng bộ đang chạy
 */
export const STOP_SYNC_PROCESS = gql`
  mutation StopSyncProcess($syncLogId: String!) {
    stopSyncProcess(syncLogId: $syncLogId) {
      success
      message
      syncLogId
      recordsProcessed
    }
  }
`;

// ============================================================================
// Quick Select Options
// ============================================================================

/**
 * Options cho chọn nhanh khoảng ngày đồng bộ
 */
export const SYNC_DATE_QUICK_SELECTS = [
  { label: 'Hôm nay', days: 0 },
  { label: 'Hôm qua', days: 1 },
  { label: '7 ngày', days: 7 },
  { label: '15 ngày', days: 15 },
  { label: '30 ngày', days: 30 },
] as const;

/**
 * Options cho chọn nhanh filter ngày
 */
export const DATE_RANGE_QUICK_SELECTS = [
  { label: '1 ngày qua', days: 1 },
  { label: '7 ngày qua', days: 7 },
  { label: '15 ngày qua', days: 15 },
  { label: '30 ngày qua', days: 30 },
  { label: '90 ngày qua', days: 90 },
] as const;

/**
 * Options cho filter nhanh Summary tab
 */
export const SUMMARY_QUICK_FILTERS = [
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày', value: '7days' },
  { label: '30 ngày', value: '30days' },
  { label: 'Tháng này', value: 'thisMonth' },
  { label: 'Tháng trước', value: 'lastMonth' },
] as const;

/**
 * Options cho quick filter (alias for Summary tab)
 */
export const QUICK_FILTER_OPTIONS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày', value: '7days' },
  { label: '30 ngày', value: '30days' },
  { label: 'Tháng này', value: 'thisMonth' },
  { label: 'Tháng trước', value: 'lastMonth' },
] as const;

// ============================================================================
// Call Status Options
// ============================================================================

/**
 * Call direction options
 */
export const CALL_DIRECTION_OPTIONS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Gọi vào', value: 'inbound' },
  { label: 'Gọi ra', value: 'outbound' },
  { label: 'Nội bộ', value: 'local' },
] as const;

/**
 * Call status options
 */
export const CALL_STATUS_OPTIONS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đã trả lời', value: 'ANSWER' },
  { label: 'Không trả lời', value: 'NO_ANSWER' },
  { label: 'Máy bận', value: 'BUSY' },
  { label: 'Thất bại', value: 'FAILED' },
] as const;

/**
 * Status badge variants mapping
 */
export const CALL_STATUS_VARIANTS: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  ANSWER: { variant: 'default', label: 'Đã trả lời' },
  CANCELED: { variant: 'secondary', label: 'Đã hủy' },
  BUSY: { variant: 'destructive', label: 'Máy bận' },
  NO_ANSWER: { variant: 'outline', label: 'Không trả lời' },
  FAILED: { variant: 'destructive', label: 'Thất bại' },
  UNKNOWN: { variant: 'outline', label: 'Không xác định' },
};

/**
 * Sync status variants mapping
 */
export const SYNC_STATUS_VARIANTS: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string; className?: string }> = {
  success: { variant: 'default', label: 'Thành công' },
  error: { variant: 'destructive', label: 'Thất bại' },
  stopped: { variant: 'outline', label: 'Đã dừng', className: 'border-orange-300 text-orange-600' },
  running: { variant: 'secondary', label: 'Đang chạy' },
};

// ============================================================================
// Config Options
// ============================================================================

/**
 * Sync mode options
 */
export const SYNC_MODE_OPTIONS = [
  { label: 'Thủ công', value: 'MANUAL' },
  { label: 'Tự động (Cron)', value: 'SCHEDULED' },
] as const;

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default pagination
 */
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
};

/**
 * Default config values
 */
export const DEFAULT_CONFIG = {
  apiUrl: 'https://pbx01.onepos.vn:8080/api/v2/cdrs',
  domain: 'tazaspa102019',
  syncMode: 'MANUAL',
  cronExpression: '',
  isActive: true,
  defaultDaysBack: 30,
  batchSize: 200,
};

/**
 * PBX Recording URL base
 */
export const PBX_RECORDING_BASE_URL = 'https://pbx01.onepos.vn:8080/recordings';

// ============================================================================
// Limits
// ============================================================================

/**
 * Maximum comparison periods
 */
export const MAX_COMPARISON_PERIODS = 10;

/**
 * Maximum records for summary calculation
 */
export const MAX_SUMMARY_RECORDS = 5000;

/**
 * Polling interval for sync progress (ms)
 */
export const SYNC_POLLING_INTERVAL = 2000;
