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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTotalDuration, calculateChange, getQuickFilterDateRange, buildGraphQLFilters } from '../utils';
import { QUICK_FILTER_OPTIONS, GET_CALLCENTER_RECORDS_STATS } from '../constants';
import type { 
  CallCenterRecordsStats, 
  CallCenterFilters, 
  QuickFilterType,
  RecordFilters,
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
  }, [calculateComparisonDates]);
  
  // Clear all comparison periods
  const clearAllPeriods = useCallback(() => {
    setComparisonPeriods([]);
    setPeriodStats(new Map());
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
      return {
        ...period,
        stats: statsData?.stats ?? null,
        loading: statsData?.loading ?? true,
      };
    });
  }, [comparisonPeriods, periodStats]);

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
    </div>
  );
}
