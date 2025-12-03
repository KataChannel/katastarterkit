/**
 * Call Center - Types & Interfaces
 * Định nghĩa các types dùng chung cho module Call Center
 */

// ============================================================================
// Config Types
// ============================================================================

export interface CallCenterConfig {
  id: string;
  apiUrl: string;
  domain: string;
  syncMode: string;
  cronExpression: string;
  isActive: boolean;
  defaultDaysBack: number;
  batchSize: number;
  lastSyncAt?: string;
  lastSyncStatus?: string;
  lastSyncError?: string;
  totalRecordsSynced?: number;
}

// ============================================================================
// Record Types
// ============================================================================

export interface CallCenterRecord {
  id: string;
  externalUuid: string;
  direction: string;
  callerIdNumber: string;
  outboundCallerIdNumber: string;
  destinationNumber: string;
  startEpoch: string;
  endEpoch: string;
  answerEpoch: string;
  duration: string;
  billsec: string;
  sipHangupDisposition: string;
  callStatus: string;
  recordPath: string | null;
  domain: string;
  syncedAt: string;
}

// ============================================================================
// Sync Types
// ============================================================================

export interface CallCenterSyncLog {
  id: string;
  syncType: string;
  status: 'running' | 'success' | 'error' | 'stopped';
  fromDate?: string;
  toDate?: string;
  recordsFetched: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  offset?: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

export interface SyncStats {
  recordsFetched: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  status: 'running' | 'success' | 'error' | 'stopped';
  // Additional fields for detailed progress tracking
  currentPage?: number;
  totalPages?: number;
  fetched?: number;
  created?: number;
  updated?: number;
  skipped?: number;
  message?: string;
  error?: string;
  lastSync?: string;
}

// ============================================================================
// Filter Types
// ============================================================================

export interface RecordFilters {
  startEpoch?: {
    gte?: string;
    lt?: string;
  };
  direction?: string;
  callStatus?: string;
  OR?: Array<{
    callerIdNumber?: { contains: string };
    destinationNumber?: { contains: string };
  }>;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ============================================================================
// Comparison Types
// ============================================================================

export interface ComparisonPeriod {
  id: string;
  label: string;
  fromDate: string;
  toDate: string;
  filters: RecordFilters;
}

export interface ComparisonSummary {
  total: number;
  inbound: number;
  outbound: number;
  missed: number;
  totalCalls: number;
  totalDuration: number;
  totalBillsec: number;
  answeredCalls: number;
  missedCalls: number;
  avgDuration: number;
  answerRate: number;
}

export interface ComparisonResult extends ComparisonPeriod {
  summary: ComparisonSummary;
  recordsCount: number;
}

// ============================================================================
// Summary Types
// ============================================================================

export interface CallerSummary {
  callerNumber: string;
  totalCalls: number;
  totalDuration: number;
  totalBillsec: number;
  answeredCalls: number;
  missedCalls: number;
}

// ============================================================================
// Date Range Types
// ============================================================================

export interface DateRange {
  fromDate: string;
  toDate: string;
}

// ============================================================================
// Quick Filter Types
// ============================================================================

export type QuickFilterType = 'today' | '7days' | '30days' | 'thisMonth' | 'lastMonth' | '';

export type ComparisonPeriodType = 'previousPeriod' | 'previousMonth' | 'previousWeek';

// ============================================================================
// Call Center Filters (for Summary Tab)
// ============================================================================

export interface CallCenterFilters {
  quickFilter: string;
  summaryFrom?: Date;
  summaryTo?: Date;
  extension?: string;
  direction?: string;
  callStatus?: string;
}

// ============================================================================
// Dialog Props Types
// ============================================================================

export interface SyncProgressDialogProps {
  open: boolean;
  onClose: () => void;
  syncLogId: string | null;
  initialStats?: SyncStats;
  onStop?: (syncLogId: string) => Promise<void>;
  stopping?: boolean;
}

export interface ConfigDialogProps {
  open: boolean;
  onClose: () => void;
  config: CallCenterConfig | null;
  onSave: (newConfig: Partial<CallCenterConfig>) => Promise<void>;
  loading: boolean;
}

export interface DateRangeDialogProps {
  open: boolean;
  onClose: () => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  onSync: () => Promise<void>;
  loading: boolean;
}

// ============================================================================
// Audio Player Props
// ============================================================================

export interface AudioPlayerProps {
  recordPath: string | null;
  domain: string;
}

// ============================================================================
// Tab Props Types
// ============================================================================

export interface RecordsTabProps {
  records: CallCenterRecord[];
  loading: boolean;
  pagination: Pagination;
  paginationInfo: PaginationInfo | null;
  filters: RecordFilters;
  onFilterChange: (filters: RecordFilters) => void;
  onPaginationChange: (pagination: Pagination) => void;
}

export interface SummaryTabProps {
  records: CallCenterRecord[];
  loading: boolean;
  filters: RecordFilters;
  onFilterChange: (filters: RecordFilters) => void;
}

export interface ProgressTabProps {
  config: CallCenterConfig | null;
  syncLogs: CallCenterSyncLog[];
  logsLoading: boolean;
  syncing: boolean;
  stopping: boolean;
  showSyncProgress: boolean;
  currentSyncLogId: string | null;
  syncStats: SyncStats | null;
  onSync: (fromDate: string, toDate: string) => Promise<void>;
  onStopSync: (syncLogId: string) => Promise<void>;
  onRefreshLogs: () => void;
  onCloseProgress: () => void;
}

export interface LogsTabProps {
  logs: CallCenterSyncLog[];
  loading: boolean;
  onRefresh: () => void;
}
