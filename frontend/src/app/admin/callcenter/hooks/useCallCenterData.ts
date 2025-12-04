/**
 * useCallCenterData - Hook quản lý data của Call Center
 * Bao gồm: config, records, sync logs
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
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

// Query để lấy sync log theo ID
const GET_SYNC_LOG_BY_ID = gql`
  query GetSyncLogById($id: String!) {
    findFirstCallCenterSyncLog(where: { id: { equals: $id } }) {
      id
      status
      recordsFetched
      recordsCreated
      recordsUpdated
      recordsSkipped
      offset
      errorMessage
      fromDate
      toDate
    }
  }
`;

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
  stoppingSyncId: string | null;
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
  const [stoppingSyncId, setStoppingSyncId] = useState<string | null>(null);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [showSyncProgress, setShowSyncProgress] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // Sync Log Polling - Poll để cập nhật tiến độ khi đang sync
  // ============================================================================
  
  const { refetch: refetchSyncLog } = useQuery(GET_SYNC_LOG_BY_ID, {
    variables: { id: currentSyncLogId || '' },
    skip: !currentSyncLogId,
    fetchPolicy: 'network-only',
  });

  // Polling effect để cập nhật syncStats real-time
  useEffect(() => {
    if (currentSyncLogId && syncStats?.status === 'running') {
      // Bắt đầu polling
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const result = await refetchSyncLog({ id: currentSyncLogId });
          const log = result.data?.findFirstCallCenterSyncLog;
          
          if (log) {
            setSyncStats(prev => ({
              ...prev,
              recordsFetched: log.recordsFetched || 0,
              recordsCreated: log.recordsCreated || 0,
              recordsUpdated: log.recordsUpdated || 0,
              recordsSkipped: log.recordsSkipped || 0,
              status: log.status as 'running' | 'success' | 'error' | 'stopped',
              message: log.status === 'running' 
                ? `Đã xử lý ${log.recordsFetched || 0} bản ghi...` 
                : undefined,
              error: log.errorMessage || undefined,
            }));

            // Nếu hoàn thành, dừng polling
            if (log.status !== 'running') {
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
              
              if (log.status === 'success') {
                toast.success('Đồng bộ hoàn tất!', {
                  description: `Đã tải ${log.recordsFetched} bản ghi, tạo mới ${log.recordsCreated}, cập nhật ${log.recordsUpdated}`,
                });
              } else if (log.status === 'error') {
                toast.error('Đồng bộ thất bại', {
                  description: log.errorMessage,
                });
              } else if (log.status === 'stopped') {
                toast.info('Đã dừng đồng bộ');
              }
            }
          }
        } catch (error) {
          console.error('Error polling sync log:', error);
        }
      }, 1000); // Poll mỗi 1 giây
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [currentSyncLogId, syncStats?.status, refetchSyncLog]);

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
    setStoppingSyncId(syncLogId);
    try {
      const result = await stopSyncMutation({
        variables: { syncLogId },
      });

      if (result.data?.stopSyncProcess?.success) {
        toast.success('Đã dừng đồng bộ', {
          description: result.data.stopSyncProcess.message,
        });
        // Reset sync state nếu đang stop sync hiện tại
        if (syncLogId === currentSyncLogId) {
          setShowSyncProgress(false);
          setCurrentSyncLogId(null);
          setSyncStats(null);
        }
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
    } finally {
      setStoppingSyncId(null);
    }
  }, [stopSyncMutation, refetchLogs, refetchRecords, refetchConfig, currentSyncLogId]);

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
    stoppingSyncId,
    currentSyncLogId,
    syncStats,
    showSyncProgress,
    startSync,
    stopSync,
    setShowSyncProgress,
    resetSyncState,
  };
}
