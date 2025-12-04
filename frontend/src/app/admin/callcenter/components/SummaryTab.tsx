/**
 * SummaryTab Component
 * Tab hiển thị thống kê tổng hợp cuộc gọi với nhiều khoảng so sánh động
 */

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  CalendarIcon,
  GitCompare,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  Plus,
  X,
  Trash2,
  Users,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTotalDuration, calculateChange, getQuickFilterDateRange, buildGraphQLFilters } from '../utils';
import { QUICK_FILTER_OPTIONS, GET_CALLCENTER_RECORDS_STATS, GET_CALLCENTER_STATS_BY_CALLER } from '../constants';
import type { 
  CallCenterRecordsStats, 
  CallCenterFilters, 
  QuickFilterType,
  RecordFilters,
  CallCenterCallerStats,
} from '../types';

interface ComparisonPeriodData {
  id: string;
  index: number;
  fromDate: string;
  toDate: string;
  label: string;
}

interface SummaryTabProps {
  stats: CallCenterRecordsStats | null;
  loading: boolean;
  filters: CallCenterFilters;
  onFiltersChange: (filters: CallCenterFilters) => void;
}

// Component to fetch stats for a single comparison period
function ComparisonPeriodStats({
  period,
  extension,
  onStatsLoaded,
}: {
  period: ComparisonPeriodData;
  extension?: string;
  onStatsLoaded: (id: string, stats: CallCenterRecordsStats | null, loading: boolean) => void;
}) {
  // Build filters for this period
  const filters: RecordFilters = useMemo(() => {
    const fromDate = new Date(period.fromDate);
    const toDate = new Date(period.toDate);
    
    const fromEpoch = Math.floor(new Date(fromDate).setHours(0, 0, 0, 0) / 1000).toString();
    const toEndOfDay = new Date(toDate);
    toEndOfDay.setHours(23, 59, 59, 999);
    const toEpoch = Math.floor(toEndOfDay.getTime() / 1000 + 1).toString();
    
    const f: RecordFilters = {
      startEpoch: { gte: fromEpoch, lt: toEpoch },
    };
    
    if (extension) {
      f.OR = [
        { callerIdNumber: { contains: extension } },
        { destinationNumber: { contains: extension } },
      ];
    }
    
    return f;
  }, [period.fromDate, period.toDate, extension]);
  
  const gqlFilters = buildGraphQLFilters(filters);
  
  const { data, loading } = useQuery(GET_CALLCENTER_RECORDS_STATS, {
    variables: {
      filters: Object.keys(gqlFilters).length > 0 ? gqlFilters : null,
    },
    fetchPolicy: 'cache-and-network',
  });
  
  // Report stats back to parent
  useEffect(() => {
    onStatsLoaded(period.id, data?.getCallCenterRecordsStats ?? null, loading);
  }, [period.id, data, loading, onStatsLoaded]);
  
  return null;
}

// Component to fetch caller stats for a comparison period
function ComparisonPeriodCallerStats({
  period,
  extension,
  onCallerStatsLoaded,
}: {
  period: ComparisonPeriodData;
  extension?: string;
  onCallerStatsLoaded: (id: string, stats: CallCenterCallerStats[] | null, loading: boolean) => void;
}) {
  const filters: RecordFilters = useMemo(() => {
    const fromDate = new Date(period.fromDate);
    const toDate = new Date(period.toDate);
    
    const fromEpoch = Math.floor(new Date(fromDate).setHours(0, 0, 0, 0) / 1000).toString();
    const toEndOfDay = new Date(toDate);
    toEndOfDay.setHours(23, 59, 59, 999);
    const toEpoch = Math.floor(toEndOfDay.getTime() / 1000 + 1).toString();
    
    const f: RecordFilters = {
      startEpoch: { gte: fromEpoch, lt: toEpoch },
    };
    
    if (extension) {
      f.OR = [
        { callerIdNumber: { contains: extension } },
        { destinationNumber: { contains: extension } },
      ];
    }
    
    return f;
  }, [period.fromDate, period.toDate, extension]);
  
  const gqlFilters = buildGraphQLFilters(filters);
  
  const { data, loading } = useQuery(GET_CALLCENTER_STATS_BY_CALLER, {
    variables: {
      filters: Object.keys(gqlFilters).length > 0 ? gqlFilters : null,
      limit: 50,
    },
    fetchPolicy: 'cache-and-network',
  });
  
  useEffect(() => {
    onCallerStatsLoaded(period.id, data?.getCallCenterStatsByCaller?.items ?? null, loading);
  }, [period.id, data, loading, onCallerStatsLoaded]);
  
  return null;
}

export function SummaryTab({
  stats,
  loading,
  filters,
  onFiltersChange,
}: SummaryTabProps) {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  
  // Comparison state
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [comparisonPeriods, setComparisonPeriods] = useState<ComparisonPeriodData[]>([]);
  const [periodStats, setPeriodStats] = useState<Map<string, { stats: CallCenterRecordsStats | null; loading: boolean }>>(new Map());
  
  // Caller stats state
  const [periodCallerStats, setPeriodCallerStats] = useState<Map<string, { stats: CallCenterCallerStats[] | null; loading: boolean }>>(new Map());
  const [showCallerDetails, setShowCallerDetails] = useState(false);
  
  // Caller details search, filter, sort state
  const [callerSearch, setCallerSearch] = useState('');
  const [callerSortField, setCallerSortField] = useState<'callerIdNumber' | 'totalCalls' | 'inboundCalls' | 'outboundCalls' | 'missedCalls' | 'totalDuration'>('totalCalls');
  const [callerSortOrder, setCallerSortOrder] = useState<'asc' | 'desc'>('desc');
  const [callerFilter, setCallerFilter] = useState<'all' | 'hasInbound' | 'hasOutbound' | 'hasMissed'>('all');
  
  // Current period caller stats
  const currentCallerFilters = useMemo(() => {
    if (!filters.summaryFrom || !filters.summaryTo) return null;
    
    const fromEpoch = Math.floor(new Date(filters.summaryFrom).setHours(0, 0, 0, 0) / 1000).toString();
    const toEndOfDay = new Date(filters.summaryTo);
    toEndOfDay.setHours(23, 59, 59, 999);
    const toEpoch = Math.floor(toEndOfDay.getTime() / 1000 + 1).toString();
    
    const f: RecordFilters = {
      startEpoch: { gte: fromEpoch, lt: toEpoch },
    };
    
    if (filters.extension) {
      f.OR = [
        { callerIdNumber: { contains: filters.extension } },
        { destinationNumber: { contains: filters.extension } },
      ];
    }
    
    return buildGraphQLFilters(f);
  }, [filters.summaryFrom, filters.summaryTo, filters.extension]);
  
  const { data: currentCallerData, loading: currentCallerLoading } = useQuery(GET_CALLCENTER_STATS_BY_CALLER, {
    variables: {
      filters: currentCallerFilters && Object.keys(currentCallerFilters).length > 0 ? currentCallerFilters : null,
      limit: 50,
    },
    fetchPolicy: 'cache-and-network',
    skip: !showCallerDetails || !filters.summaryFrom || !filters.summaryTo,
  });
  
  const currentCallerStats: CallCenterCallerStats[] = currentCallerData?.getCallCenterStatsByCaller?.items ?? [];

  // Use stats from GraphQL query
  const currentSummary = stats || {
    total: 0,
    inbound: 0,
    outbound: 0,
    local: 0,
    answered: 0,
    missed: 0,
    totalDuration: 0,
    avgDuration: 0,
  };
  
  // Generate unique ID
  const generateId = () => `period_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Calculate comparison dates based on index
  const calculateComparisonDates = useCallback((index: number): { from: string; to: string } | null => {
    if (!filters.summaryFrom || !filters.summaryTo) return null;
    
    const currentFrom = new Date(filters.summaryFrom);
    const currentTo = new Date(filters.summaryTo);
    
    // Duration in days (inclusive)
    const durationMs = currentTo.getTime() - currentFrom.getTime();
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1;
    
    // Go back by duration * (index + 1) days
    const daysBack = durationDays * (index + 1);
    
    const compFrom = new Date(currentFrom);
    compFrom.setDate(compFrom.getDate() - daysBack);
    
    const compTo = new Date(currentTo);
    compTo.setDate(compTo.getDate() - daysBack);
    
    return {
      from: compFrom.toISOString().split('T')[0],
      to: compTo.toISOString().split('T')[0],
    };
  }, [filters.summaryFrom, filters.summaryTo]);
  
  // Add a new comparison period
  const addComparisonPeriod = useCallback(() => {
    if (!filters.summaryFrom || !filters.summaryTo) return;
    
    const newIndex = comparisonPeriods.length;
    const dates = calculateComparisonDates(newIndex);
    
    if (dates) {
      const newPeriod: ComparisonPeriodData = {
        id: generateId(),
        index: newIndex,
        fromDate: dates.from,
        toDate: dates.to,
        label: `Khoảng ${newIndex + 1}`,
      };
      setComparisonPeriods(prev => [...prev, newPeriod]);
    }
  }, [comparisonPeriods.length, calculateComparisonDates, filters.summaryFrom, filters.summaryTo]);
  
  // Remove a comparison period
  const removeComparisonPeriod = useCallback((idToRemove: string) => {
    setComparisonPeriods(prev => {
      const filtered = prev.filter(p => p.id !== idToRemove);
      // Re-calculate dates for remaining periods
      return filtered.map((p, idx) => {
        const dates = calculateComparisonDates(idx);
        return {
          ...p,
          index: idx,
          fromDate: dates?.from || p.fromDate,
          toDate: dates?.to || p.toDate,
          label: `Khoảng ${idx + 1}`,
        };
      });
    });
    setPeriodStats(prev => {
      const newMap = new Map(prev);
      newMap.delete(idToRemove);
      return newMap;
    });
    setPeriodCallerStats(prev => {
      const newMap = new Map(prev);
      newMap.delete(idToRemove);
      return newMap;
    });
  }, [calculateComparisonDates]);
  
  // Clear all comparison periods
  const clearAllPeriods = useCallback(() => {
    setComparisonPeriods([]);
    setPeriodStats(new Map());
    setPeriodCallerStats(new Map());
    setComparisonEnabled(false);
  }, []);
  
  // Handle stats loaded from child components
  const handleStatsLoaded = useCallback((id: string, stats: CallCenterRecordsStats | null, loading: boolean) => {
    setPeriodStats(prev => {
      const newMap = new Map(prev);
      newMap.set(id, { stats, loading });
      return newMap;
    });
  }, []);
  
  // Handle caller stats loaded from child components
  const handleCallerStatsLoaded = useCallback((id: string, stats: CallCenterCallerStats[] | null, loading: boolean) => {
    setPeriodCallerStats(prev => {
      const newMap = new Map(prev);
      newMap.set(id, { stats, loading });
      return newMap;
    });
  }, []);
  
  // Recalculate comparison periods when summary dates change
  useEffect(() => {
    if (comparisonPeriods.length > 0 && filters.summaryFrom && filters.summaryTo) {
      setComparisonPeriods(prev => 
        prev.map((p, idx) => {
          const dates = calculateComparisonDates(idx);
          return {
            ...p,
            fromDate: dates?.from || p.fromDate,
            toDate: dates?.to || p.toDate,
          };
        })
      );
    }
  }, [filters.summaryFrom, filters.summaryTo, calculateComparisonDates]);
  
  // Toggle comparison
  const handleToggleComparison = useCallback(() => {
    if (!comparisonEnabled) {
      if (!filters.summaryFrom || !filters.summaryTo) {
        return;
      }
      setComparisonEnabled(true);
      // Automatically add first comparison period
      if (comparisonPeriods.length === 0) {
        const dates = calculateComparisonDates(0);
        if (dates) {
          const newPeriod: ComparisonPeriodData = {
            id: generateId(),
            index: 0,
            fromDate: dates.from,
            toDate: dates.to,
            label: 'Khoảng 1',
          };
          setComparisonPeriods([newPeriod]);
        }
      }
    } else {
      clearAllPeriods();
    }
  }, [comparisonEnabled, filters.summaryFrom, filters.summaryTo, comparisonPeriods.length, calculateComparisonDates, clearAllPeriods]);

  // Render change indicator
  const renderChange = (current: number, previous: number | null, formatType: 'number' | 'duration' = 'number') => {
    if (previous === null) return <span className="text-muted-foreground">-</span>;
    
    const change = calculateChange(current, previous);
    const isPositive = change.value > 0 && change.type === 'up';
    const isNegative = change.type === 'down';
    const isZero = change.type === 'same';
    
    return (
      <div className={cn(
        'flex items-center gap-1 text-xs',
        isPositive && 'text-green-600',
        isNegative && 'text-red-600',
        isZero && 'text-muted-foreground'
      )}>
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : isNegative ? (
          <TrendingDown className="h-3 w-3" />
        ) : (
          <Minus className="h-3 w-3" />
        )}
        <span>{change.percentage}%</span>
      </div>
    );
  };

  // Handle quick filter
  const handleQuickFilter = (filter: string) => {
    if (filter === 'all') {
      onFiltersChange({
        ...filters,
        quickFilter: filter,
        summaryFrom: undefined,
        summaryTo: undefined,
      });
      return;
    }

    const range = getQuickFilterDateRange(filter as QuickFilterType);
    if (range) {
      onFiltersChange({
        ...filters,
        quickFilter: filter,
        summaryFrom: new Date(range.fromDate),
        summaryTo: new Date(range.toDate),
      });
    }
  };

  // Get all comparison data for table
  const comparisonTableData = useMemo(() => {
    return comparisonPeriods.map(period => {
      const statsData = periodStats.get(period.id);
      const callerStatsData = periodCallerStats.get(period.id);
      return {
        ...period,
        stats: statsData?.stats ?? null,
        loading: statsData?.loading ?? true,
        callerStats: callerStatsData?.stats ?? null,
        callerLoading: callerStatsData?.loading ?? true,
      };
    });
  }, [comparisonPeriods, periodStats, periodCallerStats]);
  
  // Get unique callers across all periods with search, filter, sort
  const allCallerNumbers = useMemo(() => {
    // Build caller data map with stats from current period
    const callerDataMap = new Map<string, CallCenterCallerStats>();
    
    currentCallerStats.forEach(c => {
      callerDataMap.set(c.callerIdNumber, c);
    });
    
    // Add callers from comparison periods that might not be in current
    comparisonTableData.forEach(period => {
      period.callerStats?.forEach(c => {
        if (!callerDataMap.has(c.callerIdNumber)) {
          // Add with zeroed current stats
          callerDataMap.set(c.callerIdNumber, {
            callerIdNumber: c.callerIdNumber,
            totalCalls: 0,
            inboundCalls: 0,
            outboundCalls: 0,
            answeredCalls: 0,
            missedCalls: 0,
            totalDuration: 0,
            avgDuration: 0,
          });
        }
      });
    });
    
    let callers = Array.from(callerDataMap.entries());
    
    // Apply search filter
    if (callerSearch.trim()) {
      const searchLower = callerSearch.toLowerCase().trim();
      callers = callers.filter(([number]) => number.toLowerCase().includes(searchLower));
    }
    
    // Apply category filter
    if (callerFilter !== 'all') {
      callers = callers.filter(([_, stats]) => {
        switch (callerFilter) {
          case 'hasInbound':
            return stats.inboundCalls > 0;
          case 'hasOutbound':
            return stats.outboundCalls > 0;
          case 'hasMissed':
            return stats.missedCalls > 0;
          default:
            return true;
        }
      });
    }
    
    // Apply sort
    callers.sort(([aNumber, aStats], [bNumber, bStats]) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (callerSortField) {
        case 'callerIdNumber':
          aValue = aNumber;
          bValue = bNumber;
          break;
        case 'totalCalls':
          aValue = aStats.totalCalls;
          bValue = bStats.totalCalls;
          break;
        case 'inboundCalls':
          aValue = aStats.inboundCalls;
          bValue = bStats.inboundCalls;
          break;
        case 'outboundCalls':
          aValue = aStats.outboundCalls;
          bValue = bStats.outboundCalls;
          break;
        case 'missedCalls':
          aValue = aStats.missedCalls;
          bValue = bStats.missedCalls;
          break;
        case 'totalDuration':
          aValue = aStats.totalDuration;
          bValue = bStats.totalDuration;
          break;
        default:
          aValue = aStats.totalCalls;
          bValue = bStats.totalCalls;
      }
      
      if (typeof aValue === 'string') {
        const cmp = aValue.localeCompare(bValue as string);
        return callerSortOrder === 'asc' ? cmp : -cmp;
      } else {
        const diff = (aValue as number) - (bValue as number);
        return callerSortOrder === 'asc' ? diff : -diff;
      }
    });
    
    return callers.map(([number]) => number);
  }, [currentCallerStats, comparisonTableData, callerSearch, callerFilter, callerSortField, callerSortOrder]);
  
  // Toggle sort
  const toggleSort = (field: typeof callerSortField) => {
    if (callerSortField === field) {
      setCallerSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setCallerSortField(field);
      setCallerSortOrder('desc');
    }
  };
  
  // Get sort icon
  const getSortIcon = (field: typeof callerSortField) => {
    if (callerSortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1" />;
    return callerSortOrder === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  return (
    <div className="space-y-3 mt-3">
      {/* Render comparison period queries */}
      {comparisonPeriods.map(period => (
        <ComparisonPeriodStats
          key={period.id}
          period={period}
          extension={filters.extension}
          onStatsLoaded={handleStatsLoaded}
        />
      ))}
      
      {/* Render comparison period caller stats queries */}
      {showCallerDetails && comparisonPeriods.map(period => (
        <ComparisonPeriodCallerStats
          key={`caller_${period.id}`}
          period={period}
          extension={filters.extension}
          onCallerStatsLoaded={handleCallerStatsLoaded}
        />
      ))}
      
      {/* Filter Bar */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {QUICK_FILTER_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.quickFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleQuickFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Custom Date Range */}
            <div className="flex items-center gap-2">
              <Popover open={fromOpen} onOpenChange={setFromOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {filters.summaryFrom
                      ? format(filters.summaryFrom, 'dd/MM/yyyy', { locale: vi })
                      : 'Từ ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.summaryFrom}
                    onSelect={(date) => {
                      onFiltersChange({
                        ...filters,
                        summaryFrom: date,
                        quickFilter: 'custom',
                      });
                      setFromOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>

              <span className="text-muted-foreground">→</span>

              <Popover open={toOpen} onOpenChange={setToOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {filters.summaryTo
                      ? format(filters.summaryTo, 'dd/MM/yyyy', { locale: vi })
                      : 'Đến ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.summaryTo}
                    onSelect={(date) => {
                      onFiltersChange({
                        ...filters,
                        summaryTo: date,
                        quickFilter: 'custom',
                      });
                      setToOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Comparison Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant={comparisonEnabled ? 'default' : 'outline'}
                size="sm"
                onClick={handleToggleComparison}
                disabled={!filters.summaryFrom || !filters.summaryTo}
              >
                <GitCompare className="h-4 w-4 mr-1" />
                So sánh
              </Button>
              
              {comparisonEnabled && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addComparisonPeriod}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm khoảng
                  </Button>
                  
                  {comparisonPeriods.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllPeriods}
                      className="h-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa tất cả
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total Calls */}
          <Card>
            <CardHeader className="py-2 pb-0">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
                <PhoneCall className="h-3 w-3" />
                Tổng cuộc gọi
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-2xl font-bold">{currentSummary.total.toLocaleString('vi-VN')}</p>
            </CardContent>
          </Card>

          {/* Inbound Calls */}
          <Card>
            <CardHeader className="py-2 pb-0">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
                <PhoneIncoming className="h-3 w-3 text-blue-500" />
                Cuộc gọi đến
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-2xl font-bold text-blue-600">{currentSummary.inbound.toLocaleString('vi-VN')}</p>
            </CardContent>
          </Card>

          {/* Outbound Calls */}
          <Card>
            <CardHeader className="py-2 pb-0">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
                <PhoneOutgoing className="h-3 w-3 text-green-500" />
                Cuộc gọi đi
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-2xl font-bold text-green-600">{currentSummary.outbound.toLocaleString('vi-VN')}</p>
            </CardContent>
          </Card>

          {/* Missed Calls */}
          <Card>
            <CardHeader className="py-2 pb-0">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
                <PhoneMissed className="h-3 w-3 text-red-500" />
                Cuộc nhỡ
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-2xl font-bold text-red-600">{currentSummary.missed.toLocaleString('vi-VN')}</p>
            </CardContent>
          </Card>

          {/* Total Duration */}
          <Card>
            <CardHeader className="py-2 pb-0">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 text-purple-500" />
                Tổng thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-2xl font-bold text-purple-600">
                {formatTotalDuration(currentSummary.totalDuration)}
              </p>
            </CardContent>
          </Card>

          {/* Average Duration */}
          <Card>
            <CardHeader className="py-2 pb-0">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 text-orange-500" />
                TB cuộc gọi
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-2xl font-bold text-orange-600">
                {formatTotalDuration(currentSummary.avgDuration)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comparison Table */}
      {comparisonEnabled && comparisonTableData.length > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              So sánh các khoảng thời gian
              <Badge variant="secondary" className="ml-auto">
                {comparisonTableData.length} khoảng
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Khoảng thời gian</TableHead>
                    <TableHead className="text-center">Tổng</TableHead>
                    <TableHead className="text-center">Gọi đến</TableHead>
                    <TableHead className="text-center">Gọi đi</TableHead>
                    <TableHead className="text-center">Nhỡ</TableHead>
                    <TableHead className="text-center">Tổng TG</TableHead>
                    <TableHead className="text-center">TB</TableHead>
                    <TableHead className="text-center">So với HT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Current Period Row */}
                  <TableRow className="bg-primary/5 font-medium">
                    <TableCell>
                      <Badge variant="default" className="text-xs">HT</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">Hiện tại</span>
                        <span className="text-xs text-muted-foreground">
                          {filters.summaryFrom && filters.summaryTo 
                            ? `${format(filters.summaryFrom, 'dd/MM/yyyy', { locale: vi })} - ${format(filters.summaryTo, 'dd/MM/yyyy', { locale: vi })}`
                            : 'Chưa chọn'
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold">{currentSummary.total.toLocaleString('vi-VN')}</TableCell>
                    <TableCell className="text-center text-blue-600">{currentSummary.inbound.toLocaleString('vi-VN')}</TableCell>
                    <TableCell className="text-center text-green-600">{currentSummary.outbound.toLocaleString('vi-VN')}</TableCell>
                    <TableCell className="text-center text-red-600">{currentSummary.missed.toLocaleString('vi-VN')}</TableCell>
                    <TableCell className="text-center text-purple-600">{formatTotalDuration(currentSummary.totalDuration)}</TableCell>
                    <TableCell className="text-center text-orange-600">{formatTotalDuration(currentSummary.avgDuration)}</TableCell>
                    <TableCell className="text-center">-</TableCell>
                  </TableRow>
                  
                  {/* Comparison Period Rows */}
                  {comparisonTableData.map((period) => (
                    <TableRow key={period.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => removeComparisonPeriod(period.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{period.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(period.fromDate), 'dd/MM/yyyy', { locale: vi })} - {format(new Date(period.toDate), 'dd/MM/yyyy', { locale: vi })}
                          </span>
                        </div>
                      </TableCell>
                      {period.loading ? (
                        <TableCell colSpan={7} className="text-center">
                          <Loader2 className="h-4 w-4 animate-spin inline-block" />
                        </TableCell>
                      ) : period.stats ? (
                        <>
                          <TableCell className="text-center">{period.stats.total.toLocaleString('vi-VN')}</TableCell>
                          <TableCell className="text-center">{period.stats.inbound.toLocaleString('vi-VN')}</TableCell>
                          <TableCell className="text-center">{period.stats.outbound.toLocaleString('vi-VN')}</TableCell>
                          <TableCell className="text-center">{period.stats.missed.toLocaleString('vi-VN')}</TableCell>
                          <TableCell className="text-center">{formatTotalDuration(period.stats.totalDuration)}</TableCell>
                          <TableCell className="text-center">{formatTotalDuration(period.stats.avgDuration)}</TableCell>
                          <TableCell className="text-center">
                            {renderChange(currentSummary.total, period.stats.total)}
                          </TableCell>
                        </>
                      ) : (
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          Không có dữ liệu
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help text when comparison not enabled */}
      {!comparisonEnabled && filters.summaryFrom && filters.summaryTo && (
        <Card className="bg-muted/30">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitCompare className="h-4 w-4" />
              <span>
                Bấm <strong>"So sánh"</strong> để thêm các khoảng thời gian so sánh. 
                Mỗi khoảng sẽ tự động lùi về trước theo độ dài của khoảng hiện tại.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Caller Details Toggle & Table */}
      {comparisonEnabled && comparisonTableData.length > 0 && filters.summaryFrom && filters.summaryTo && (
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Chi tiết theo số điện thoại
              </CardTitle>
              <Button
                variant={showCallerDetails ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowCallerDetails(!showCallerDetails)}
              >
                {showCallerDetails ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Ẩn chi tiết
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Hiện chi tiết
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          
          {showCallerDetails && (
            <CardContent className="p-0">
              {/* Search, Filter, Sort Controls */}
              <div className="p-3 border-b bg-muted/30">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm số điện thoại..."
                      value={callerSearch}
                      onChange={(e) => setCallerSearch(e.target.value)}
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                  
                  {/* Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={callerFilter} onValueChange={(val) => setCallerFilter(val as typeof callerFilter)}>
                      <SelectTrigger className="h-8 w-[140px] text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="hasInbound">Có gọi đến</SelectItem>
                        <SelectItem value="hasOutbound">Có gọi đi</SelectItem>
                        <SelectItem value="hasMissed">Có cuộc nhỡ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sắp xếp:</span>
                    <Select value={callerSortField} onValueChange={(val) => setCallerSortField(val as typeof callerSortField)}>
                      <SelectTrigger className="h-8 w-[140px] text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="totalCalls">Tổng cuộc gọi</SelectItem>
                        <SelectItem value="callerIdNumber">Số điện thoại</SelectItem>
                        <SelectItem value="inboundCalls">Cuộc gọi đến</SelectItem>
                        <SelectItem value="outboundCalls">Cuộc gọi đi</SelectItem>
                        <SelectItem value="missedCalls">Cuộc nhỡ</SelectItem>
                        <SelectItem value="totalDuration">Tổng thời gian</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => setCallerSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    >
                      {callerSortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Results count */}
                  <div className="ml-auto">
                    <Badge variant="secondary">
                      {allCallerNumbers.length} số
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="sticky left-0 bg-background z-10 cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleSort('callerIdNumber')}
                      >
                        <div className="flex items-center">
                          Số điện thoại
                          {getSortIcon('callerIdNumber')}
                        </div>
                      </TableHead>
                      {/* Current Period Header */}
                      <TableHead className="text-center bg-primary/5" colSpan={5}>
                        <div className="flex flex-col items-center">
                          <Badge variant="default" className="text-xs mb-1">Hiện tại</Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(filters.summaryFrom, 'dd/MM', { locale: vi })} - {format(filters.summaryTo, 'dd/MM', { locale: vi })}
                          </span>
                        </div>
                      </TableHead>
                      {/* Comparison Period Headers */}
                      {comparisonTableData.map((period) => (
                        <TableHead key={period.id} className="text-center" colSpan={5}>
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-medium">{period.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(period.fromDate), 'dd/MM', { locale: vi })} - {format(new Date(period.toDate), 'dd/MM', { locale: vi })}
                            </span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10"></TableHead>
                      {/* Current Period Sub-Headers - Clickable for sort */}
                      <TableHead 
                        className="text-center text-xs bg-primary/5 cursor-pointer hover:bg-primary/10"
                        onClick={() => toggleSort('totalCalls')}
                      >
                        <div className="flex items-center justify-center">
                          Tổng
                          {getSortIcon('totalCalls')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-center text-xs bg-primary/5 cursor-pointer hover:bg-primary/10"
                        onClick={() => toggleSort('inboundCalls')}
                      >
                        <div className="flex items-center justify-center">
                          Đến
                          {getSortIcon('inboundCalls')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-center text-xs bg-primary/5 cursor-pointer hover:bg-primary/10"
                        onClick={() => toggleSort('outboundCalls')}
                      >
                        <div className="flex items-center justify-center">
                          Đi
                          {getSortIcon('outboundCalls')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-center text-xs bg-primary/5 cursor-pointer hover:bg-primary/10"
                        onClick={() => toggleSort('missedCalls')}
                      >
                        <div className="flex items-center justify-center">
                          Nhỡ
                          {getSortIcon('missedCalls')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-center text-xs bg-primary/5 cursor-pointer hover:bg-primary/10"
                        onClick={() => toggleSort('totalDuration')}
                      >
                        <div className="flex items-center justify-center">
                          TG
                          {getSortIcon('totalDuration')}
                        </div>
                      </TableHead>
                      {/* Comparison Period Sub-Headers */}
                      {comparisonTableData.map((period) => (
                        <>
                          <TableHead key={`${period.id}-total`} className="text-center text-xs">Tổng</TableHead>
                          <TableHead key={`${period.id}-in`} className="text-center text-xs">Đến</TableHead>
                          <TableHead key={`${period.id}-out`} className="text-center text-xs">Đi</TableHead>
                          <TableHead key={`${period.id}-missed`} className="text-center text-xs">Nhỡ</TableHead>
                          <TableHead key={`${period.id}-duration`} className="text-center text-xs">TG</TableHead>
                        </>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCallerLoading ? (
                      <TableRow>
                        <TableCell colSpan={6 + comparisonTableData.length * 5} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin inline-block" />
                          <span className="ml-2 text-muted-foreground">Đang tải...</span>
                        </TableCell>
                      </TableRow>
                    ) : allCallerNumbers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6 + comparisonTableData.length * 5} className="text-center py-8 text-muted-foreground">
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    ) : (
                      allCallerNumbers.map((callerNumber) => {
                        const currentStats = currentCallerStats.find(c => c.callerIdNumber === callerNumber);
                        
                        return (
                          <TableRow key={callerNumber}>
                            <TableCell className="sticky left-0 bg-background z-10 font-mono text-sm">
                              {callerNumber}
                            </TableCell>
                            {/* Current Period Stats */}
                            <TableCell className="text-center bg-primary/5">
                              {currentStats?.totalCalls?.toLocaleString('vi-VN') ?? '-'}
                            </TableCell>
                            <TableCell className="text-center text-blue-600 bg-primary/5">
                              {currentStats?.inboundCalls?.toLocaleString('vi-VN') ?? '-'}
                            </TableCell>
                            <TableCell className="text-center text-green-600 bg-primary/5">
                              {currentStats?.outboundCalls?.toLocaleString('vi-VN') ?? '-'}
                            </TableCell>
                            <TableCell className="text-center text-red-600 bg-primary/5">
                              {currentStats?.missedCalls?.toLocaleString('vi-VN') ?? '-'}
                            </TableCell>
                            <TableCell className="text-center text-purple-600 bg-primary/5">
                              {currentStats?.totalDuration != null ? formatTotalDuration(currentStats.totalDuration) : '-'}
                            </TableCell>
                            {/* Comparison Period Stats */
                            {comparisonTableData.map((period) => {
                              const periodCallerStat = period.callerStats?.find(c => c.callerIdNumber === callerNumber);
                              
                              if (period.callerLoading) {
                                return (
                                  <>
                                    <TableCell key={`${period.id}-${callerNumber}-total`} colSpan={5} className="text-center">
                                      <Loader2 className="h-3 w-3 animate-spin inline-block" />
                                    </TableCell>
                                  </>
                                );
                              }
                              
                              return (
                                <>
                                  <TableCell key={`${period.id}-${callerNumber}-total`} className="text-center">
                                    <div className="flex flex-col items-center">
                                      <span>{periodCallerStat?.totalCalls?.toLocaleString('vi-VN') ?? '-'}</span>
                                      {currentStats && periodCallerStat && (
                                        <span className="text-xs">
                                          {renderChange(currentStats.totalCalls, periodCallerStat.totalCalls)}
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell key={`${period.id}-${callerNumber}-in`} className="text-center">
                                    {periodCallerStat?.inboundCalls?.toLocaleString('vi-VN') ?? '-'}
                                  </TableCell>
                                  <TableCell key={`${period.id}-${callerNumber}-out`} className="text-center">
                                    {periodCallerStat?.outboundCalls?.toLocaleString('vi-VN') ?? '-'}
                                  </TableCell>
                                  <TableCell key={`${period.id}-${callerNumber}-missed`} className="text-center">
                                    {periodCallerStat?.missedCalls?.toLocaleString('vi-VN') ?? '-'}
                                  </TableCell>
                                  <TableCell key={`${period.id}-${callerNumber}-duration`} className="text-center text-purple-600">
                                    {periodCallerStat?.totalDuration != null ? formatTotalDuration(periodCallerStat.totalDuration) : '-'}
                                  </TableCell>
                                </>
                              );
                            })}
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Total callers info */}
              <div className="p-3 border-t bg-muted/30 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Hiển thị: <strong>{allCallerNumbers.length}</strong> số điện thoại
                  {callerSearch && ` (đang tìm: "${callerSearch}")`}
                  {callerFilter !== 'all' && ` (lọc: ${
                    callerFilter === 'hasInbound' ? 'có gọi đến' : 
                    callerFilter === 'hasOutbound' ? 'có gọi đi' : 
                    'có cuộc nhỡ'
                  })`}
                </span>
                {(callerSearch || callerFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      setCallerSearch('');
                      setCallerFilter('all');
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
