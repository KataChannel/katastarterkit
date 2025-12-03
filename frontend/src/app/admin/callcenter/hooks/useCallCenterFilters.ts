/**
 * useCallCenterFilters - Hook quản lý filters cho Call Center
 */

import { useState, useCallback } from 'react';
import { buildRecordFilters, getQuickFilterDateRange, getTodayDate } from '../utils';
import type { RecordFilters, QuickFilterType, Pagination } from '../types';

interface FilterState {
  dateFrom: string;
  dateTo: string;
  extension: string;
  direction: string;
  status: string;
}

interface UseCallCenterFiltersReturn {
  // Records Filter State
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  filters: RecordFilters;
  quickFilter: QuickFilterType;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  applyFilters: () => void;
  handleQuickFilter: (type: QuickFilterType) => void;
  clearAllFilters: () => void;

  // Summary Filter State
  summaryFilterState: FilterState;
  setSummaryFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  summaryFilters: RecordFilters;
  summaryQuickFilter: QuickFilterType;
  applySummaryFilters: (dateFrom?: string, dateTo?: string, ext?: string) => void;
  handleSummaryQuickFilter: (type: QuickFilterType) => void;
  clearSummaryFilters: () => void;
}

const initialFilterState: FilterState = {
  dateFrom: '',
  dateTo: '',
  extension: '',
  direction: '',
  status: '',
};

export function useCallCenterFilters(
  onFiltersChange: (filters: RecordFilters) => void,
  onSummaryFiltersChange: (filters: RecordFilters) => void,
  onPaginationReset: () => void
): UseCallCenterFiltersReturn {
  // Records filter state
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [filters, setFilters] = useState<RecordFilters>({});
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>('');
  const [showFilters, setShowFilters] = useState(false);

  // Summary filter state
  const [summaryFilterState, setSummaryFilterState] = useState<FilterState>(initialFilterState);
  const [summaryFilters, setSummaryFilters] = useState<RecordFilters>({});
  const [summaryQuickFilter, setSummaryQuickFilter] = useState<QuickFilterType>('');

  // ============================================================================
  // Records Filters
  // ============================================================================

  const applyFilters = useCallback(() => {
    const newFilters = buildRecordFilters(
      filterState.dateFrom,
      filterState.dateTo,
      filterState.extension,
      filterState.direction,
      filterState.status
    );
    setFilters(newFilters);
    onFiltersChange(newFilters);
    onPaginationReset();
  }, [filterState, onFiltersChange, onPaginationReset]);

  const handleQuickFilter = useCallback((type: QuickFilterType) => {
    const { fromDate, toDate } = getQuickFilterDateRange(type);
    
    setQuickFilter(type);
    setFilterState(prev => ({
      ...prev,
      dateFrom: fromDate,
      dateTo: toDate,
    }));

    const newFilters = buildRecordFilters(fromDate, toDate, filterState.extension, filterState.direction, filterState.status);
    setFilters(newFilters);
    onFiltersChange(newFilters);
    onPaginationReset();
  }, [filterState.extension, filterState.direction, filterState.status, onFiltersChange, onPaginationReset]);

  const clearAllFilters = useCallback(() => {
    setFilterState(initialFilterState);
    setQuickFilter('');
    setFilters({});
    onFiltersChange({});
    onPaginationReset();
  }, [onFiltersChange, onPaginationReset]);

  // ============================================================================
  // Summary Filters
  // ============================================================================

  const applySummaryFilters = useCallback((dateFrom?: string, dateTo?: string, ext?: string) => {
    const fromDate = dateFrom ?? summaryFilterState.dateFrom;
    const toDate = dateTo ?? summaryFilterState.dateTo;
    const extension = ext ?? summaryFilterState.extension;

    const newFilters = buildRecordFilters(fromDate, toDate, extension);
    setSummaryFilters(newFilters);
    onSummaryFiltersChange(newFilters);
  }, [summaryFilterState, onSummaryFiltersChange]);

  const handleSummaryQuickFilter = useCallback((type: QuickFilterType) => {
    const { fromDate, toDate } = getQuickFilterDateRange(type);
    
    setSummaryQuickFilter(type);
    setSummaryFilterState(prev => ({
      ...prev,
      dateFrom: fromDate,
      dateTo: toDate,
    }));

    const newFilters = buildRecordFilters(fromDate, toDate, summaryFilterState.extension);
    setSummaryFilters(newFilters);
    onSummaryFiltersChange(newFilters);
  }, [summaryFilterState.extension, onSummaryFiltersChange]);

  const clearSummaryFilters = useCallback(() => {
    setSummaryFilterState(initialFilterState);
    setSummaryQuickFilter('');
    setSummaryFilters({});
    onSummaryFiltersChange({});
  }, [onSummaryFiltersChange]);

  return {
    // Records Filter State
    filterState,
    setFilterState,
    filters,
    quickFilter,
    showFilters,
    setShowFilters,
    applyFilters,
    handleQuickFilter,
    clearAllFilters,

    // Summary Filter State
    summaryFilterState,
    setSummaryFilterState,
    summaryFilters,
    summaryQuickFilter,
    applySummaryFilters,
    handleSummaryQuickFilter,
    clearSummaryFilters,
  };
}
