/**
 * useMultiComparison - Hook quản lý nhiều khoảng so sánh động
 * Mỗi khoảng so sánh sẽ lùi lại theo thứ tự so với khoảng hiện tại
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CALLCENTER_RECORDS_STATS } from '../constants';
import { buildGraphQLFilters } from '../utils';
import type { 
  RecordFilters, 
  CallCenterRecordsStats,
  ComparisonPeriodWithStats,
} from '../types';

interface UseMultiComparisonProps {
  /** Current period date from */
  currentDateFrom: string | null;
  /** Current period date to */
  currentDateTo: string | null;
  /** Extension filter to apply to all comparison periods */
  extension?: string;
  /** Whether comparison is enabled */
  enabled: boolean;
}

interface UseMultiComparisonReturn {
  /** Array of comparison periods with their stats */
  comparisonPeriods: ComparisonPeriodWithStats[];
  /** Add a new comparison period */
  addComparisonPeriod: () => void;
  /** Remove a comparison period by id */
  removeComparisonPeriod: (id: string) => void;
  /** Clear all comparison periods */
  clearAllPeriods: () => void;
  /** Whether any comparison is loading */
  isLoading: boolean;
  /** Total number of comparison periods */
  totalPeriods: number;
}

// Generate unique ID for comparison period
const generatePeriodId = () => `period_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Calculate comparison period dates based on index
function calculateComparisonDates(
  currentFrom: string,
  currentTo: string,
  periodIndex: number // 0-based, period 0 = 1 period before
): { from: Date; to: Date } {
  const fromDate = new Date(currentFrom);
  const toDate = new Date(currentTo);
  
  // Calculate the duration of current period in days (inclusive)
  const durationMs = toDate.getTime() - fromDate.getTime();
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1;
  
  // Each comparison period goes back by (durationDays * (periodIndex + 1)) days
  const daysBack = durationDays * (periodIndex + 1);
  
  const compFrom = new Date(fromDate);
  compFrom.setDate(compFrom.getDate() - daysBack);
  
  const compTo = new Date(toDate);
  compTo.setDate(compTo.getDate() - daysBack);
  
  return { from: compFrom, to: compTo };
}

// Build filters for a comparison period
function buildComparisonFilters(
  fromDate: Date,
  toDate: Date,
  extension?: string
): RecordFilters {
  // fromEpoch: start of day (00:00:00)
  const fromEpoch = Math.floor(new Date(fromDate).setHours(0, 0, 0, 0) / 1000).toString();
  
  // toEpoch: end of day (23:59:59) + 1 second for lt comparison
  const toEndOfDay = new Date(toDate);
  toEndOfDay.setHours(23, 59, 59, 999);
  const toEpoch = Math.floor(toEndOfDay.getTime() / 1000 + 1).toString();
  
  const filters: RecordFilters = {
    startEpoch: { gte: fromEpoch, lt: toEpoch },
  };
  
  if (extension) {
    filters.OR = [
      { callerIdNumber: { contains: extension } },
      { destinationNumber: { contains: extension } },
    ];
  }
  
  return filters;
}

// Individual comparison period hook
function useComparisonPeriodStats(
  periodId: string,
  filters: RecordFilters,
  enabled: boolean
) {
  const gqlFilters = buildGraphQLFilters(filters);
  
  const { data, loading } = useQuery(GET_CALLCENTER_RECORDS_STATS, {
    variables: {
      filters: Object.keys(gqlFilters).length > 0 ? gqlFilters : null,
    },
    skip: !enabled || Object.keys(gqlFilters).length === 0,
    fetchPolicy: 'cache-and-network',
  });
  
  return {
    stats: data?.getCallCenterRecordsStats as CallCenterRecordsStats | null,
    loading,
  };
}

// Main hook component for a single period
function ComparisonPeriodQuery({
  period,
  onStatsUpdate,
}: {
  period: { id: string; filters: RecordFilters; enabled: boolean };
  onStatsUpdate: (id: string, stats: CallCenterRecordsStats | null, loading: boolean) => void;
}) {
  const { stats, loading } = useComparisonPeriodStats(
    period.id,
    period.filters,
    period.enabled
  );
  
  // Update parent with stats
  useMemo(() => {
    onStatsUpdate(period.id, stats, loading);
  }, [period.id, stats, loading, onStatsUpdate]);
  
  return null;
}

export function useMultiComparison({
  currentDateFrom,
  currentDateTo,
  extension,
  enabled,
}: UseMultiComparisonProps): UseMultiComparisonReturn {
  // Store period indices (0, 1, 2, ...)
  const [periodIndices, setPeriodIndices] = useState<{ id: string; index: number }[]>([]);
  
  // Store stats for each period
  const [periodStats, setPeriodStats] = useState<Map<string, { stats: CallCenterRecordsStats | null; loading: boolean }>>(new Map());
  
  // Calculate comparison periods with their date ranges
  const comparisonPeriods = useMemo((): ComparisonPeriodWithStats[] => {
    if (!currentDateFrom || !currentDateTo || !enabled) {
      return [];
    }
    
    return periodIndices.map(({ id, index }) => {
      const { from, to } = calculateComparisonDates(currentDateFrom, currentDateTo, index);
      const filters = buildComparisonFilters(from, to, extension);
      const statsData = periodStats.get(id);
      
      return {
        id,
        label: `Khoảng ${index + 1}`,
        fromDate: from.toISOString().split('T')[0],
        toDate: to.toISOString().split('T')[0],
        filters,
        stats: statsData?.stats ?? null,
        loading: statsData?.loading ?? true,
      };
    });
  }, [currentDateFrom, currentDateTo, extension, enabled, periodIndices, periodStats]);
  
  // Add a new comparison period
  const addComparisonPeriod = useCallback(() => {
    const newIndex = periodIndices.length;
    const newId = generatePeriodId();
    setPeriodIndices(prev => [...prev, { id: newId, index: newIndex }]);
  }, [periodIndices.length]);
  
  // Remove a comparison period
  const removeComparisonPeriod = useCallback((idToRemove: string) => {
    setPeriodIndices(prev => {
      const filtered = prev.filter(p => p.id !== idToRemove);
      // Re-index remaining periods
      return filtered.map((p, idx) => ({ ...p, index: idx }));
    });
    setPeriodStats(prev => {
      const newMap = new Map(prev);
      newMap.delete(idToRemove);
      return newMap;
    });
  }, []);
  
  // Clear all periods
  const clearAllPeriods = useCallback(() => {
    setPeriodIndices([]);
    setPeriodStats(new Map());
  }, []);
  
  // Update stats for a period
  const updatePeriodStats = useCallback((id: string, stats: CallCenterRecordsStats | null, loading: boolean) => {
    setPeriodStats(prev => {
      const newMap = new Map(prev);
      newMap.set(id, { stats, loading });
      return newMap;
    });
  }, []);
  
  // Check if any period is loading
  const isLoading = useMemo(() => {
    return comparisonPeriods.some(p => p.loading);
  }, [comparisonPeriods]);
  
  return {
    comparisonPeriods,
    addComparisonPeriod,
    removeComparisonPeriod,
    clearAllPeriods,
    isLoading,
    totalPeriods: periodIndices.length,
  };
}

// Export the query component for use in the main component
export { ComparisonPeriodQuery, buildComparisonFilters, calculateComparisonDates };
