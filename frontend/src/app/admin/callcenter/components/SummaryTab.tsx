/**
 * SummaryTab Component
 * Tab hiển thị thống kê tổng hợp cuộc gọi
 */

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTotalDuration, calculateSummary, calculateComparisonSummary, calculateChange, getQuickFilterDateRange } from '../utils';
import { QUICK_FILTER_OPTIONS } from '../constants';
import type { CallCenterRecord, ComparisonPeriodType, CallCenterFilters, QuickFilterType } from '../types';

interface SummaryTabProps {
  records: CallCenterRecord[];
  loading: boolean;
  filters: CallCenterFilters;
  onFiltersChange: (filters: CallCenterFilters) => void;
  // Comparison feature
  comparisonEnabled: boolean;
  comparisonPeriod: ComparisonPeriodType;
  comparisonRecords: CallCenterRecord[];
  comparisonLoading: boolean;
  onToggleComparison: () => void;
  onComparisonPeriodChange: (period: ComparisonPeriodType) => void;
}

export function SummaryTab({
  records,
  loading,
  filters,
  onFiltersChange,
  comparisonEnabled,
  comparisonPeriod,
  comparisonRecords,
  comparisonLoading,
  onToggleComparison,
  onComparisonPeriodChange,
}: SummaryTabProps) {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  // Calculate summaries
  const currentSummary = calculateSummary(records);
  const comparisonSummaryData = comparisonEnabled ? calculateComparisonSummary(comparisonRecords) : null;

  // Render change indicator
  const renderChange = (current: number, previous: number | null, formatType: 'number' | 'duration' = 'number') => {
    if (!comparisonEnabled || previous === null) return null;
    
    const change = calculateChange(current, previous);
    const isPositive = change.value > 0 && change.type === 'up';
    const isNegative = change.type === 'down';
    const isZero = change.type === 'same';
    
    return (
      <div className={cn(
        'flex items-center gap-1 text-xs mt-1',
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
        <span className="text-muted-foreground">
          (vs {formatType === 'duration' ? formatTotalDuration(previous) : previous})
        </span>
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

  return (
    <div className="space-y-3 mt-3">
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
                onClick={onToggleComparison}
              >
                <GitCompare className="h-4 w-4 mr-1" />
                So sánh
              </Button>
              
              {comparisonEnabled && (
                <Select
                  value={comparisonPeriod}
                  onValueChange={(value) => onComparisonPeriodChange(value as ComparisonPeriodType)}
                >
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="previousPeriod">Kỳ trước</SelectItem>
                    <SelectItem value="previousMonth">Tháng trước</SelectItem>
                    <SelectItem value="previousWeek">Tuần trước</SelectItem>
                  </SelectContent>
                </Select>
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
              <p className="text-2xl font-bold">{currentSummary.total}</p>
              {comparisonLoading ? (
                <Loader2 className="h-3 w-3 animate-spin mt-1" />
              ) : (
                renderChange(currentSummary.total, comparisonSummaryData?.totalCalls ?? null)
              )}
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
              <p className="text-2xl font-bold text-blue-600">{currentSummary.inbound}</p>
              {comparisonLoading ? (
                <Loader2 className="h-3 w-3 animate-spin mt-1" />
              ) : (
                renderChange(currentSummary.inbound, comparisonSummaryData?.answeredCalls ?? null)
              )}
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
              <p className="text-2xl font-bold text-green-600">{currentSummary.outbound}</p>
              {comparisonLoading ? (
                <Loader2 className="h-3 w-3 animate-spin mt-1" />
              ) : (
                renderChange(currentSummary.outbound, null)
              )}
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
              <p className="text-2xl font-bold text-red-600">{currentSummary.missed}</p>
              {comparisonLoading ? (
                <Loader2 className="h-3 w-3 animate-spin mt-1" />
              ) : (
                renderChange(currentSummary.missed, comparisonSummaryData?.missedCalls ?? null)
              )}
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
              {comparisonLoading ? (
                <Loader2 className="h-3 w-3 animate-spin mt-1" />
              ) : (
                renderChange(currentSummary.totalDuration, comparisonSummaryData?.totalDuration ?? null, 'duration')
              )}
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
              {comparisonLoading ? (
                <Loader2 className="h-3 w-3 animate-spin mt-1" />
              ) : (
                renderChange(currentSummary.avgDuration, comparisonSummaryData?.avgDuration ?? null, 'duration')
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comparison Period Info */}
      {comparisonEnabled && comparisonSummaryData && !comparisonLoading && (
        <Card className="bg-muted/50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitCompare className="h-4 w-4" />
              <span>
                So sánh với: <strong>{comparisonSummaryData.totalCalls}</strong> cuộc gọi
                {comparisonPeriod === 'previousPeriod' && ' (kỳ trước)'}
                {comparisonPeriod === 'previousMonth' && ' (tháng trước)'}
                {comparisonPeriod === 'previousWeek' && ' (tuần trước)'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
