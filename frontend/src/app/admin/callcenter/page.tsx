/**
 * Call Center Page - Quản lý cuộc gọi tổng đài
 * 
 * Đã được refactor theo Clean Architecture:
 * - types.ts: Định nghĩa types & interfaces
 * - constants.ts: Constants & GraphQL operations
 * - utils.ts: Helper functions
 * - hooks/: Custom hooks cho data fetching & filters
 * - components/: UI components được tách nhỏ
 */

'use client';

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Types
import type { 
  CallCenterFilters, 
  RecordFilters, 
  Pagination, 
  DateRange,
  SyncStats,
} from './types';

// Hooks
import { useCallCenterData } from './hooks/useCallCenterData';
import { useCallCenterFilters } from './hooks/useCallCenterFilters';

// Components
import {
  HeaderSection,
  StatsBar,
  RecordsTab,
  SummaryTab,
  ProgressTab,
  SyncLogsTab,
  ConfigDialog,
  DateRangeDialog,
  SyncProgressDialog,
} from './components';

// Constants
import { DEFAULT_PAGINATION } from './constants';

export default function CallCenterPage() {
  // =========================================================================
  // Tab State
  // =========================================================================
  const [activeTab, setActiveTab] = useState('records');

  // =========================================================================
  // Dialog States
  // =========================================================================
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showDateRangeDialog, setShowDateRangeDialog] = useState(false);

  // =========================================================================
  // Data Hook
  // =========================================================================
  const {
    // Config
    config,
    configMutationLoading,
    refetchConfig,
    updateConfig,
    createConfig,

    // Records
    records,
    recordsLoading,
    refetchRecords,
    pagination,
    setPagination,
    paginationInfo,
    filters: recordFilters,
    setFilters: setRecordFilters,

    // Records Stats
    recordsStats,
    statsLoading,

    // Summary Stats
    summaryStats,
    summaryStatsLoading,
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
  } = useCallCenterData();

  // =========================================================================
  // Filters Hook
  // =========================================================================
  const handlePaginationReset = useCallback(() => {
    setPagination({ ...DEFAULT_PAGINATION });
  }, [setPagination]);

  const {
    filterState,
    setFilterState,
    quickFilter,
    showFilters,
    setShowFilters,
    applyFilters,
    handleQuickFilter,
    clearAllFilters,
    summaryFilterState,
    setSummaryFilterState,
    summaryQuickFilter,
    applySummaryFilters,
    handleSummaryQuickFilter,
    clearSummaryFilters,
  } = useCallCenterFilters(setRecordFilters, setSummaryFilters, handlePaginationReset);

  // =========================================================================
  // Sync Date Range
  // =========================================================================
  const today = new Date().toISOString().split('T')[0];
  const [dateRange, setDateRange] = useState<DateRange>({
    fromDate: today,
    toDate: today,
  });

  // =========================================================================
  // Handlers
  // =========================================================================

  // Refresh all data
  const handleRefresh = () => {
    refetchConfig();
    refetchRecords();
    refetchLogs();
    toast.success('Đã làm mới dữ liệu');
  };

  // Handle sync
  const handleSync = async () => {
    setShowDateRangeDialog(false);
    // Chuyển sang tab tiến độ đồng bộ ngay lập tức
    setActiveTab('progress');
    await startSync(dateRange.fromDate, dateRange.toDate);
  };

  // Handle stop sync
  const handleStopSync = async (syncLogId: string) => {
    await stopSync(syncLogId);
  };

  // Handle config save
  const handleSaveConfig = async (newConfig: Partial<typeof config>) => {
    try {
      if (config?.id && newConfig) {
        await updateConfig(newConfig as Partial<NonNullable<typeof config>>);
      } else if (newConfig) {
        await createConfig(newConfig as Partial<NonNullable<typeof config>>);
      }
      setShowConfigDialog(false);
    } catch (error) {
      console.error('Save config error:', error);
    }
  };

  // Handle records filter change
  const handleRecordFiltersChange = (newFilters: RecordFilters) => {
    setRecordFilters(newFilters);
    handlePaginationReset();
  };

  // Handle pagination change
  const handlePaginationChange = (newPagination: Pagination) => {
    setPagination(newPagination);
  };

  // Handle summary filters change  
  const handleSummaryFiltersChange = (newFilters: CallCenterFilters) => {
    // Update summaryFilterState directly 
    setSummaryFilterState({
      dateFrom: newFilters.summaryFrom?.toISOString().split('T')[0] || '',
      dateTo: newFilters.summaryTo?.toISOString().split('T')[0] || '',
      extension: newFilters.extension || '',
      direction: newFilters.direction || '',
      status: newFilters.callStatus || '',
    });
    
    // Also apply filters for GraphQL query
    applySummaryFilters(
      newFilters.summaryFrom?.toISOString().split('T')[0],
      newFilters.summaryTo?.toISOString().split('T')[0],
      newFilters.extension
    );
  };

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <div className="container mx-auto py-4 space-y-4">
      {/* Header */}
      <HeaderSection
        onRefresh={handleRefresh}
        onOpenConfig={() => setShowConfigDialog(true)}
        onOpenDateRange={() => setShowDateRangeDialog(true)}
        refreshing={recordsLoading || logsLoading}
      />

      {/* Stats Bar (compact) */}
      <StatsBar stats={recordsStats} loading={statsLoading} />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="records">Danh sách cuộc gọi</TabsTrigger>
          <TabsTrigger value="summary">Thống kê</TabsTrigger>
          <TabsTrigger value="progress">Tiến độ đồng bộ</TabsTrigger>
          <TabsTrigger value="logs">Lịch sử đồng bộ</TabsTrigger>
        </TabsList>

        {/* Records Tab */}
        <TabsContent value="records">
          <RecordsTab
            records={records}
            loading={recordsLoading}
            pagination={pagination}
            paginationInfo={paginationInfo}
            filterState={filterState}
            setFilterState={setFilterState}
            quickFilter={quickFilter}
            showFilters={showFilters}
            hasActiveFilters={!!filterState.dateFrom || !!filterState.dateTo || !!filterState.extension || !!filterState.direction || !!filterState.status}
            onShowFiltersChange={setShowFilters}
            onQuickFilter={handleQuickFilter}
            onApplyFilters={applyFilters}
            onClearFilters={clearAllFilters}
            onPaginationChange={handlePaginationChange}
          />
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary">
          <SummaryTab
            stats={summaryStats}
            loading={summaryStatsLoading}
            filters={{
              quickFilter: summaryQuickFilter,
              summaryFrom: summaryFilterState.dateFrom ? new Date(summaryFilterState.dateFrom) : undefined,
              summaryTo: summaryFilterState.dateTo ? new Date(summaryFilterState.dateTo) : undefined,
              extension: summaryFilterState.extension,
            }}
            onFiltersChange={handleSummaryFiltersChange}
          />
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress">
          <ProgressTab
            syncStats={syncStats || {
              recordsFetched: 0,
              recordsCreated: 0,
              recordsUpdated: 0,
              recordsSkipped: 0,
              status: 'success' as const,
            }}
            isSyncing={syncing}
            onStopSync={() => currentSyncLogId && handleStopSync(currentSyncLogId)}
            onSync={() => setShowDateRangeDialog(true)}
            onRefresh={refetchLogs}
          />
        </TabsContent>

        {/* Sync Logs Tab */}
        <TabsContent value="logs">
          <SyncLogsTab
            logs={syncLogs}
            loading={logsLoading}
            onRefresh={refetchLogs}
            onStopSync={handleStopSync}
            stoppingSyncId={stopping ? currentSyncLogId : null}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ConfigDialog
        open={showConfigDialog}
        onClose={() => setShowConfigDialog(false)}
        config={config}
        onSave={handleSaveConfig}
        loading={configMutationLoading}
      />

      <DateRangeDialog
        open={showDateRangeDialog}
        onClose={() => setShowDateRangeDialog(false)}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSync={handleSync}
        loading={syncing}
      />

      <SyncProgressDialog
        open={showSyncProgress}
        onClose={() => setShowSyncProgress(false)}
        syncLogId={currentSyncLogId}
        initialStats={syncStats ?? undefined}
        onStop={handleStopSync}
        stopping={stopping}
      />
    </div>
  );
}
