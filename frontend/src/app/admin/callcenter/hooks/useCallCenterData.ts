/**
 * useCallCenterData - Hook quản lý data của Call Center
 * Bao gồm: config, records, sync logs
 */

import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { 
  useFindMany,
  useCreateOne,
  useUpdateOne,
} from '@/hooks/useDynamicGraphQL';
import { SYNC_CALLCENTER_DATA, STOP_SYNC_PROCESS, DEFAULT_PAGINATION, MAX_SUMMARY_RECORDS } from '../constants';
import { toUTCDateTime } from '../utils';
import type { 
  CallCenterConfig, 
  CallCenterRecord, 
  CallCenterSyncLog,
  SyncStats,
  RecordFilters,
  Pagination,
} from '../types';

interface UseCallCenterDataReturn {
  // Config
  config: CallCenterConfig | null;
  configLoading: boolean;
  refetchConfig: () => void;
  updateConfig: (newConfig: Partial<CallCenterConfig>) => Promise<void>;
  createConfig: (newConfig: Partial<CallCenterConfig>) => Promise<void>;
  configMutationLoading: boolean;

  // Records
  records: CallCenterRecord[];
  recordsLoading: boolean;
  refetchRecords: () => void;
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
  filters: RecordFilters;
  setFilters: (filters: RecordFilters) => void;

  // Summary Records
  summaryRecords: CallCenterRecord[];
  summaryLoading: boolean;
  summaryFilters: RecordFilters;
  setSummaryFilters: (filters: RecordFilters) => void;

  // Sync Logs
  syncLogs: CallCenterSyncLog[];
  logsLoading: boolean;
  refetchLogs: () => void;

  // Sync Operations
  syncing: boolean;
  stopping: boolean;
  currentSyncLogId: string | null;
  syncStats: SyncStats | null;
  showSyncProgress: boolean;
  startSync: (fromDate?: string, toDate?: string) => Promise<void>;
  stopSync: (syncLogId: string) => Promise<void>;
  setShowSyncProgress: (show: boolean) => void;
  resetSyncState: () => void;
}

export function useCallCenterData(): UseCallCenterDataReturn {
  // Pagination state
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<RecordFilters>({});
  const [summaryFilters, setSummaryFilters] = useState<RecordFilters>({});

  // Sync state
  const [currentSyncLogId, setCurrentSyncLogId] = useState<string | null>(null);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [showSyncProgress, setShowSyncProgress] = useState(false);

  // ============================================================================
  // Config Queries & Mutations
  // ============================================================================

  const { 
    data: configs = [], 
    loading: configLoading, 
    refetch: refetchConfig 
  } = useFindMany<CallCenterConfig>('callCenterConfig', {
    take: 1,
  });
  const config = configs[0] || null;

  const [updateConfigMutation, { loading: updating }] = useUpdateOne('callCenterConfig');
  const [createConfigMutation, { loading: creating }] = useCreateOne('callCenterConfig');

  const updateConfig = useCallback(async (newConfig: Partial<CallCenterConfig>) => {
    if (!config?.id) return;
    await updateConfigMutation({
      where: { id: config.id },
      data: newConfig,
    });
    toast.success('Cập nhật cấu hình thành công');
    await refetchConfig();
  }, [config?.id, updateConfigMutation, refetchConfig]);

  const createConfig = useCallback(async (newConfig: Partial<CallCenterConfig>) => {
    await createConfigMutation({
      data: {
        apiUrl: 'https://pbx01.onepos.vn:8080/api/v2/cdrs',
        domain: 'tazaspa102019',
        ...newConfig,
      },
    });
    toast.success('Tạo cấu hình thành công');
    await refetchConfig();
  }, [createConfigMutation, refetchConfig]);

  // ============================================================================
  // Records Query
  // ============================================================================

  const { 
    data: recordsResponse = [], 
    loading: recordsLoading, 
    refetch: refetchRecords 
  } = useFindMany<CallCenterRecord>('callCenterRecord', {
    where: filters,
    skip: (pagination.page - 1) * pagination.limit,
    take: pagination.limit,
    orderBy: { startEpoch: 'desc' },
  });

  const records = Array.isArray(recordsResponse) ? recordsResponse : [];

  // ============================================================================
  // Summary Records Query
  // ============================================================================

  const { 
    data: summaryRecordsResponse = [], 
    loading: summaryLoading, 
  } = useFindMany<CallCenterRecord>('callCenterRecord', {
    where: summaryFilters,
    take: MAX_SUMMARY_RECORDS,
    orderBy: { startEpoch: 'desc' },
  });

  const summaryRecords = Array.isArray(summaryRecordsResponse) ? summaryRecordsResponse : [];

  // ============================================================================
  // Sync Logs Query
  // ============================================================================

  const { 
    data: syncLogsData = [], 
    loading: logsLoading, 
    refetch: refetchLogs 
  } = useFindMany<CallCenterSyncLog>('callCenterSyncLog', {
    take: 10,
    orderBy: { startedAt: 'desc' },
  });

  const syncLogs = Array.isArray(syncLogsData) ? syncLogsData : [];

  // ============================================================================
  // Sync Mutations
  // ============================================================================

  const [syncDataMutation, { loading: syncing }] = useMutation(SYNC_CALLCENTER_DATA);
  const [stopSyncMutation, { loading: stopping }] = useMutation(STOP_SYNC_PROCESS);

  const startSync = useCallback(async (fromDate?: string, toDate?: string) => {
    if (!config?.isActive) {
      toast.error('Cấu hình chưa được kích hoạt', {
        description: 'Vui lòng bật "Kích hoạt" trong phần Cài đặt trước khi đồng bộ.',
      });
      return;
    }

    try {
      const input: { fromDate?: string; toDate?: string; configId?: string } = {};
      
      if (fromDate && toDate) {
        input.fromDate = toUTCDateTime(fromDate, false).toISOString();
        input.toDate = toUTCDateTime(toDate, true).toISOString();
      }

      const result = await syncDataMutation({
        variables: { input },
      });

      if (result.data.syncCallCenterData.success) {
        setCurrentSyncLogId(result.data.syncCallCenterData.syncLogId);
        setSyncStats({
          recordsFetched: 0,
          recordsCreated: 0,
          recordsUpdated: 0,
          recordsSkipped: 0,
          status: 'running',
        });
        setShowSyncProgress(true);
        toast.success('Bắt đầu đồng bộ');
      } else {
        toast.error('Đồng bộ thất bại', {
          description: result.data.syncCallCenterData.error,
        });
      }
    } catch (error: any) {
      toast.error('Lỗi đồng bộ', {
        description: error.message,
      });
    }
  }, [config?.isActive, syncDataMutation]);

  const stopSync = useCallback(async (syncLogId: string) => {
    try {
      const result = await stopSyncMutation({
        variables: { syncLogId },
      });

      if (result.data?.stopSyncProcess?.success) {
        toast.success('Đã dừng đồng bộ', {
          description: result.data.stopSyncProcess.message,
        });
        // Reset sync state
        setShowSyncProgress(false);
        setCurrentSyncLogId(null);
        setSyncStats(null);
        // Refresh data
        refetchLogs();
        refetchRecords();
        refetchConfig();
      } else {
        toast.error('Không thể dừng đồng bộ', {
          description: result.data?.stopSyncProcess?.message || 'Lỗi không xác định',
        });
      }
    } catch (error: any) {
      toast.error('Lỗi khi dừng đồng bộ', {
        description: error.message,
      });
    }
  }, [stopSyncMutation, refetchLogs, refetchRecords, refetchConfig]);

  const resetSyncState = useCallback(() => {
    setShowSyncProgress(false);
    setCurrentSyncLogId(null);
    setSyncStats(null);
    refetchRecords();
    refetchLogs();
    refetchConfig();
  }, [refetchRecords, refetchLogs, refetchConfig]);

  return {
    // Config
    config,
    configLoading,
    refetchConfig,
    updateConfig,
    createConfig,
    configMutationLoading: updating || creating,

    // Records
    records,
    recordsLoading,
    refetchRecords,
    pagination,
    setPagination,
    filters,
    setFilters,

    // Summary Records
    summaryRecords,
    summaryLoading,
    summaryFilters,
    setSummaryFilters,

    // Sync Logs
    syncLogs,
    logsLoading,
    refetchLogs,

    // Sync Operations
    syncing,
    stopping,
    currentSyncLogId,
    syncStats,
    showSyncProgress,
    startSync,
    stopSync,
    setShowSyncProgress,
    resetSyncState,
  };
}
