/**
 * useComparison - Hook quản lý tính năng so sánh khoảng thời gian
 */

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useFindMany } from '@/hooks/useDynamicGraphQL';
import { 
  generateComparisonPeriods as generatePeriods, 
  buildComparisonFilters,
  daysBetween,
  generatePeriodId,
  calculateComparisonSummary,
} from '../utils';
import { MAX_COMPARISON_PERIODS } from '../constants';
import type { 
  ComparisonPeriod, 
  ComparisonResult, 
  CallCenterRecord,
} from '../types';

interface UseComparisonReturn {
  // State
  enableComparison: boolean;
  comparisonPeriods: ComparisonPeriod[];
  comparisonExtension: string;
  comparisonLoading: boolean;
  comparisonResults: ComparisonResult[];

  // Actions
  setEnableComparison: (enabled: boolean) => void;
  setComparisonExtension: (extension: string) => void;
  addComparisonPeriod: () => void;
  removeComparisonPeriod: (id: string) => void;
  updateComparisonPeriod: (id: string, field: keyof ComparisonPeriod, value: string) => void;
  applyComparisonFilters: () => void;
  clearComparison: () => void;
  initializeComparison: (baseDateFrom?: string, baseDateTo?: string, extension?: string) => void;
}

export function useComparison(): UseComparisonReturn {
  const [enableComparison, setEnableComparison] = useState(false);
  const [comparisonPeriods, setComparisonPeriods] = useState<ComparisonPeriod[]>([]);
  const [comparisonExtension, setComparisonExtension] = useState('');
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<Map<string, CallCenterRecord[]>>(new Map());

  // Query hook for fetching comparison data
  const { refetch: fetchComparisonData } = useFindMany<CallCenterRecord>('callCenterRecord', {
    take: 0, // Không fetch tự động
  });

  // ============================================================================
  // Initialize Comparison
  // ============================================================================

  const initializeComparison = useCallback((
    baseDateFrom?: string, 
    baseDateTo?: string, 
    extension?: string
  ) => {
    const periods = generatePeriods(2, baseDateFrom, baseDateTo);
    setComparisonPeriods(periods);
    if (extension) {
      setComparisonExtension(extension);
    }
  }, []);

  // ============================================================================
  // Period Management
  // ============================================================================

  const addComparisonPeriod = useCallback(() => {
    if (comparisonPeriods.length >= MAX_COMPARISON_PERIODS) {
      toast.warning(`Tối đa ${MAX_COMPARISON_PERIODS} khoảng thời gian so sánh`);
      return;
    }

    if (comparisonPeriods.length === 0) {
      setComparisonPeriods(generatePeriods(2));
      return;
    }

    // Calculate period length from first period
    const firstPeriod = comparisonPeriods[0];
    const periodDays = daysBetween(firstPeriod.fromDate, firstPeriod.toDate);

    // Get the earliest (last) period
    const lastPeriod = comparisonPeriods[comparisonPeriods.length - 1];

    // Calculate new period going back
    const newToDate = new Date(lastPeriod.fromDate);
    newToDate.setDate(newToDate.getDate() - 1);
    const newFromDate = new Date(newToDate);
    newFromDate.setDate(newFromDate.getDate() - periodDays + 1);

    const newPeriod: ComparisonPeriod = {
      id: generatePeriodId(),
      label: `Khoảng ${comparisonPeriods.length + 1}`,
      fromDate: newFromDate.toISOString().split('T')[0],
      toDate: newToDate.toISOString().split('T')[0],
      filters: {},
    };

    setComparisonPeriods([...comparisonPeriods, newPeriod]);
  }, [comparisonPeriods]);

  const removeComparisonPeriod = useCallback((id: string) => {
    const newPeriods = comparisonPeriods.filter(p => p.id !== id);
    // Re-label remaining periods
    const relabeledPeriods = newPeriods.map((p, index) => ({
      ...p,
      label: index === 0 ? 'Hiện tại' : `Khoảng ${index + 1}`,
    }));
    setComparisonPeriods(relabeledPeriods);
  }, [comparisonPeriods]);

  const updateComparisonPeriod = useCallback((
    id: string, 
    field: keyof ComparisonPeriod, 
    value: string
  ) => {
    setComparisonPeriods(periods =>
      periods.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  }, []);

  // ============================================================================
  // Apply & Clear
  // ============================================================================

  const applyComparisonFilters = useCallback(() => {
    if (comparisonPeriods.length < 1) {
      toast.error('Cần ít nhất 1 khoảng thời gian');
      return;
    }

    const invalidPeriods = comparisonPeriods.filter(p => !p.fromDate || !p.toDate);
    if (invalidPeriods.length > 0) {
      toast.error('Vui lòng điền đầy đủ ngày cho tất cả các khoảng thời gian');
      return;
    }

    // Update filters for each period
    const updatedPeriods = comparisonPeriods.map(p => ({
      ...p,
      filters: buildComparisonFilters(p, comparisonExtension),
    }));
    setComparisonPeriods(updatedPeriods);

    const message = comparisonExtension
      ? `Đang so sánh ${comparisonPeriods.length} khoảng thời gian cho ${comparisonExtension}`
      : `Đang so sánh ${comparisonPeriods.length} khoảng thời gian (tất cả)`;
    toast.success(message);
  }, [comparisonPeriods, comparisonExtension]);

  const clearComparison = useCallback(() => {
    setComparisonPeriods([]);
    setComparisonExtension('');
    setEnableComparison(false);
    setComparisonData(new Map());
  }, []);

  // ============================================================================
  // Fetch Comparison Data
  // ============================================================================

  const fetchAllComparisonData = useCallback(async () => {
    if (comparisonPeriods.length === 0) return;

    const hasValidFilters = comparisonPeriods.some(p => Object.keys(p.filters).length > 0);
    if (!hasValidFilters) return;

    setComparisonLoading(true);
    const newData = new Map<string, CallCenterRecord[]>();

    try {
      for (const period of comparisonPeriods) {
        if (period.fromDate && period.toDate && Object.keys(period.filters).length > 0) {
          const result = await fetchComparisonData({
            where: period.filters,
            take: 5000,
            orderBy: { startEpoch: 'desc' },
          });

          if (result.data && Array.isArray(result.data.findManyCallCenterRecord)) {
            newData.set(period.id, result.data.findManyCallCenterRecord);
          }
        }
      }
      setComparisonData(newData);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      toast.error('Lỗi khi tải dữ liệu so sánh');
    } finally {
      setComparisonLoading(false);
    }
  }, [comparisonPeriods, fetchComparisonData]);

  // Trigger fetch when filters are applied
  useEffect(() => {
    if (enableComparison && comparisonPeriods.some(p => Object.keys(p.filters).length > 0)) {
      fetchAllComparisonData();
    }
  }, [enableComparison, comparisonPeriods.map(p => JSON.stringify(p.filters)).join(',')]);

  // ============================================================================
  // Compute Results
  // ============================================================================

  const comparisonResults: ComparisonResult[] = enableComparison && comparisonPeriods.length >= 1
    ? comparisonPeriods.map(period => {
        const records = comparisonData.get(period.id) || [];
        const summary = calculateComparisonSummary(records);
        return {
          ...period,
          summary,
          recordsCount: records.length,
        };
      })
    : [];

  return {
    // State
    enableComparison,
    comparisonPeriods,
    comparisonExtension,
    comparisonLoading,
    comparisonResults,

    // Actions
    setEnableComparison,
    setComparisonExtension,
    addComparisonPeriod,
    removeComparisonPeriod,
    updateComparisonPeriod,
    applyComparisonFilters,
    clearComparison,
    initializeComparison,
  };
}
