/**
 * Call Center - Utility Functions
 * Các helper functions dùng chung cho module Call Center
 */

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { 
  CallCenterRecord, 
  CallerSummary, 
  ComparisonPeriod,
  ComparisonSummary,
  RecordFilters,
  QuickFilterType,
} from './types';

// ============================================================================
// Date/Time Formatting
// ============================================================================

/**
 * Format Unix epoch timestamp to readable date string
 */
export const formatEpoch = (epoch: string): string => {
  if (!epoch || epoch === '0') return 'N/A';
  const date = new Date(parseInt(epoch) * 1000);
  return format(date, 'dd/MM/yyyy HH:mm:ss', { locale: vi });
};

/**
 * Format duration in seconds to readable string
 */
export const formatDuration = (seconds: string): string => {
  if (!seconds) return '0s';
  const sec = parseInt(seconds);
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

/**
 * Format total duration with hours
 */
export const formatTotalDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

// ============================================================================
// GraphQL Filter Conversion
// ============================================================================

/**
 * Build GraphQL filters from RecordFilters
 * Converts local filter format to CallCenterRecordFiltersInput format
 */
export const buildGraphQLFilters = (filters: RecordFilters): Record<string, any> => {
  const gqlFilters: Record<string, any> = {};

  // Date range filter
  if (filters.startEpoch) {
    if (filters.startEpoch.gte) {
      // Convert epoch to Date
      gqlFilters.startDateFrom = new Date(parseInt(filters.startEpoch.gte) * 1000).toISOString();
    }
    if (filters.startEpoch.lt) {
      gqlFilters.startDateTo = new Date(parseInt(filters.startEpoch.lt) * 1000).toISOString();
    }
  }

  // Direction filter
  if (filters.direction && filters.direction !== 'all') {
    gqlFilters.direction = filters.direction.toUpperCase();
  }

  // Call status filter
  if (filters.callStatus && filters.callStatus !== 'all') {
    gqlFilters.callStatus = filters.callStatus;
  }

  // Search (extension) - combine OR conditions into search
  if (filters.OR && filters.OR.length > 0) {
    // Extract the search term from the first OR condition
    const firstCondition = filters.OR[0];
    if (firstCondition.callerIdNumber?.contains) {
      gqlFilters.search = firstCondition.callerIdNumber.contains;
    } else if (firstCondition.destinationNumber?.contains) {
      gqlFilters.search = firstCondition.destinationNumber.contains;
    }
  }

  return gqlFilters;
};

/**
 * Format time for audio player display
 */
export const formatAudioTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// ============================================================================
// Date Range Calculations
// ============================================================================

/**
 * Calculate days between two dates
 */
export const daysBetween = (from: string, to: string): number => {
  if (!from || !to) return 0;
  const fromDate = new Date(from);
  const toDate = new Date(to);
  return Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Get date range for quick filter type
 */
export const getQuickFilterDateRange = (type: QuickFilterType): { fromDate: string; toDate: string } => {
  const today = new Date();
  let fromDate = '';
  let toDate = today.toISOString().split('T')[0];

  switch (type) {
    case 'today':
      fromDate = toDate;
      break;
    case '7days':
      const from7 = new Date();
      from7.setDate(from7.getDate() - 7);
      fromDate = from7.toISOString().split('T')[0];
      break;
    case '30days':
      const from30 = new Date();
      from30.setDate(from30.getDate() - 30);
      fromDate = from30.toISOString().split('T')[0];
      break;
    case 'thisMonth':
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      fromDate = thisMonth.toISOString().split('T')[0];
      break;
    case 'lastMonth':
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      fromDate = lastMonthStart.toISOString().split('T')[0];
      toDate = lastMonthEnd.toISOString().split('T')[0];
      break;
    default:
      break;
  }

  return { fromDate, toDate };
};

/**
 * Convert date string to UTC DateTime for API
 */
export const toUTCDateTime = (dateStr: string, isEndOfDay: boolean = false): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (isEndOfDay) {
    return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  }
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
};

// ============================================================================
// Filter Building
// ============================================================================

/**
 * Build filters for records query
 */
export const buildRecordFilters = (
  dateFrom?: string,
  dateTo?: string,
  extension?: string,
  direction?: string,
  callStatus?: string
): RecordFilters => {
  const filters: RecordFilters = {};

  // Date range filter (convert to epoch STRING)
  if (dateFrom) {
    const fromEpoch = Math.floor(new Date(dateFrom).getTime() / 1000);
    filters.startEpoch = { ...filters.startEpoch, gte: fromEpoch.toString() };
  }
  if (dateTo) {
    const toDateObj = new Date(dateTo);
    toDateObj.setDate(toDateObj.getDate() + 1);
    const toEpoch = Math.floor(toDateObj.getTime() / 1000);
    filters.startEpoch = { ...filters.startEpoch, lt: toEpoch.toString() };
  }

  // Extension filter
  if (extension) {
    filters.OR = [
      { callerIdNumber: { contains: extension } },
      { destinationNumber: { contains: extension } },
    ];
  }

  // Direction filter
  if (direction && direction !== 'all') {
    filters.direction = direction;
  }

  // Status filter
  if (callStatus && callStatus !== 'all') {
    filters.callStatus = callStatus;
  }

  return filters;
};

/**
 * Build filters for comparison period
 */
export const buildComparisonFilters = (
  period: ComparisonPeriod,
  extension: string
): RecordFilters => {
  const filters: RecordFilters = {};

  if (period.fromDate) {
    const fromEpoch = Math.floor(new Date(period.fromDate).getTime() / 1000);
    filters.startEpoch = { ...filters.startEpoch, gte: fromEpoch.toString() };
  }
  if (period.toDate) {
    const toDateObj = new Date(period.toDate);
    toDateObj.setDate(toDateObj.getDate() + 1);
    const toEpoch = Math.floor(toDateObj.getTime() / 1000);
    filters.startEpoch = { ...filters.startEpoch, lt: toEpoch.toString() };
  }

  if (extension) {
    filters.OR = [
      { callerIdNumber: { contains: extension } },
      { destinationNumber: { contains: extension } },
    ];
  }

  return filters;
};

// ============================================================================
// Summary Calculations
// ============================================================================

/**
 * Calculate basic summary stats for records
 */
export const calculateSummary = (records: CallCenterRecord[]): {
  total: number;
  inbound: number;
  outbound: number;
  missed: number;
  totalDuration: number;
  avgDuration: number;
} => {
  if (!records || records.length === 0) {
    return {
      total: 0,
      inbound: 0,
      outbound: 0,
      missed: 0,
      totalDuration: 0,
      avgDuration: 0,
    };
  }

  let inbound = 0;
  let outbound = 0;
  let missed = 0;
  let totalDuration = 0;

  records.forEach((record) => {
    const duration = parseInt(record.billsec || '0');
    totalDuration += duration;

    // Direction
    if (record.direction === 'inbound') {
      inbound++;
    } else {
      outbound++;
    }

    // Missed calls
    if (record.callStatus !== 'ANSWER' || duration === 0) {
      missed++;
    }
  });

  return {
    total: records.length,
    inbound,
    outbound,
    missed,
    totalDuration,
    avgDuration: records.length > 0 ? Math.round(totalDuration / records.length) : 0,
  };
};

/**
 * Calculate call duration summary by caller
 */
export const calculateCallerSummary = (records: CallCenterRecord[]): CallerSummary[] => {
  if (!records || records.length === 0) return [];

  const summaryMap = new Map<string, CallerSummary>();

  records.forEach((record) => {
    const caller = record.callerIdNumber || 'Unknown';
    const duration = parseInt(record.duration || '0');
    const billsec = parseInt(record.billsec || '0');
    const isAnswered = record.callStatus === 'ANSWER';

    if (!summaryMap.has(caller)) {
      summaryMap.set(caller, {
        callerNumber: caller,
        totalCalls: 0,
        totalDuration: 0,
        totalBillsec: 0,
        answeredCalls: 0,
        missedCalls: 0,
      });
    }

    const summary = summaryMap.get(caller)!;
    summary.totalCalls += 1;
    summary.totalDuration += duration;
    summary.totalBillsec += billsec;
    if (isAnswered) {
      summary.answeredCalls += 1;
    } else {
      summary.missedCalls += 1;
    }
  });

  return Array.from(summaryMap.values()).sort((a, b) => b.totalDuration - a.totalDuration);
};

/**
 * Calculate comparison summary for records
 */
export const calculateComparisonSummary = (records: CallCenterRecord[]): ComparisonSummary => {
  if (!records || records.length === 0) {
    return {
      total: 0,
      inbound: 0,
      outbound: 0,
      missed: 0,
      totalCalls: 0,
      totalDuration: 0,
      totalBillsec: 0,
      answeredCalls: 0,
      missedCalls: 0,
      avgDuration: 0,
      answerRate: 0,
    };
  }

  let totalCalls = 0;
  let totalDuration = 0;
  let totalBillsec = 0;
  let answeredCalls = 0;
  let missedCalls = 0;
  let inbound = 0;
  let outbound = 0;

  records.forEach((record) => {
    const duration = parseInt(record.duration || '0');
    const billsec = parseInt(record.billsec || '0');
    const isAnswered = record.callStatus === 'ANSWER';

    totalCalls += 1;
    totalDuration += duration;
    totalBillsec += billsec;
    
    // Direction
    if (record.direction === 'inbound') {
      inbound++;
    } else {
      outbound++;
    }
    
    if (isAnswered) {
      answeredCalls += 1;
    } else {
      missedCalls += 1;
    }
  });

  return {
    total: totalCalls,
    inbound,
    outbound,
    missed: missedCalls,
    totalCalls,
    totalDuration,
    totalBillsec,
    answeredCalls,
    missedCalls,
    avgDuration: totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0,
    answerRate: totalCalls > 0 ? Math.round((answeredCalls / totalCalls) * 100) : 0,
  };
};

/**
 * Calculate percentage change between two values
 */
export const calculateChange = (
  current: number,
  previous: number
): { value: number; percentage: number; type: 'up' | 'down' | 'same' } => {
  if (previous === 0) {
    return current > 0 ? { value: 100, percentage: 100, type: 'up' } : { value: 0, percentage: 0, type: 'same' };
  }
  const change = ((current - previous) / previous) * 100;
  const percentage = Math.abs(Math.round(change));
  return {
    value: percentage,
    percentage,
    type: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
  };
};

// ============================================================================
// Comparison Period Generation
// ============================================================================

/**
 * Generate unique period ID
 */
export const generatePeriodId = (): string => {
  return `period_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate comparison periods based on base date range
 */
export const generateComparisonPeriods = (
  periodsCount: number,
  baseDateFrom?: string,
  baseDateTo?: string
): ComparisonPeriod[] => {
  const periods: ComparisonPeriod[] = [];

  // Use provided dates or default to last 7 days
  let baseToDate = baseDateTo || new Date().toISOString().split('T')[0];
  let baseFromDate = baseDateFrom;

  if (!baseFromDate) {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    baseFromDate = from.toISOString().split('T')[0];
  }

  const periodDays = daysBetween(baseFromDate, baseToDate);

  for (let i = 0; i < periodsCount; i++) {
    let toDate: Date;
    let fromDate: Date;

    if (i === 0) {
      // First period: current filter range
      fromDate = new Date(baseFromDate);
      toDate = new Date(baseToDate);
    } else {
      // Previous periods: go back by periodDays each time
      const prevPeriod = periods[i - 1];
      toDate = new Date(prevPeriod.fromDate);
      toDate.setDate(toDate.getDate() - 1);
      fromDate = new Date(toDate);
      fromDate.setDate(fromDate.getDate() - periodDays + 1);
    }

    periods.push({
      id: generatePeriodId(),
      label: i === 0 ? 'Hiện tại' : `Khoảng ${i + 1}`,
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0],
      filters: {},
    });
  }

  return periods;
};

// ============================================================================
// Recording URL
// ============================================================================

/**
 * Build recording URL from path
 */
export const buildRecordingUrl = (recordPath: string): string => {
  return `https://pbx01.onepos.vn:8080/recordings${recordPath}`;
};
