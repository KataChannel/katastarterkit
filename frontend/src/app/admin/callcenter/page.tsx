'use client';

import { useState, useEffect, useRef } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client'; // Keep for custom SYNC mutation
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Download, 
  Settings, 
  Play,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Filter,
  RefreshCw,
  Volume2,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BarChart3,
  User,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  GitCompare
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { AdvancedTable } from '@/components/ui/advanced-table/AdvancedTable';
import type { ColumnDef } from '@/components/ui/advanced-table/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

// ✅ MIGRATED: Import Dynamic GraphQL hooks
import { 
  useFindMany,
  useCreateOne,
  useUpdateOne,
} from '@/hooks/useDynamicGraphQL';
import { FIND_UNIQUE } from '@/graphql/dynamic/operations'; // For manual polling

// Keep custom SYNC mutation (not CRUD)
const SYNC_CALLCENTER_DATA = gql`
  mutation SyncCallCenterData($input: SyncCallCenterInput) {
    syncCallCenterData(input: $input) {
      success
      message
      syncLogId
      recordsFetched
      recordsCreated
      recordsUpdated
      error
    }
  }
`;

// Types
interface CallCenterConfig {
  id: string;
  apiUrl: string;
  domain: string;
  syncMode: string;
  cronExpression: string;
  isActive: boolean;
  defaultDaysBack: number;
  batchSize: number;
  lastSyncAt?: string;
  lastSyncStatus?: string;
  lastSyncError?: string;
  totalRecordsSynced?: number;
}

interface CallCenterRecord {
  id: string;
  externalUuid: string;
  direction: string;
  callerIdNumber: string;
  outboundCallerIdNumber: string;
  destinationNumber: string;
  startEpoch: string;
  endEpoch: string;
  answerEpoch: string;
  duration: string;
  billsec: string;
  sipHangupDisposition: string;
  callStatus: string;
  recordPath: string | null;
  domain: string;
  syncedAt: string;
}

interface CallCenterSyncLog {
  id: string;
  syncType: string;
  status: string;
  fromDate?: string;
  toDate?: string;
  recordsFetched: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  offset?: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

// Audio Player Component với time display
function AudioPlayer({ recordPath, domain }: { recordPath: string | null, domain: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
    };
  }, []);

  if (!recordPath) {
    return <span className="text-muted-foreground text-sm">Không có recording</span>;
  }

  const recordingUrl = `https://pbx01.onepos.vn:8080/recordings${recordPath}`;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={togglePlay}
          className="h-8 w-8 p-0"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <audio
          ref={audioRef}
          src={recordingUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <a
          href={recordingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          Tải về
        </a>
      </div>
      {duration > 0 && (
        <div className="text-xs text-muted-foreground font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      )}
    </div>
  );
}

// Sync Progress Dialog với REAL-TIME polling
function SyncProgressDialog({ 
  open, 
  onClose, 
  syncLogId,
  initialStats
}: { 
  open: boolean; 
  onClose: () => void;
  syncLogId: string | null;
  initialStats?: any;
}) {
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState(initialStats || {
    recordsFetched: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsSkipped: 0,
    status: 'running',
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ MIGRATED: Use Dynamic GraphQL with Apollo polling (for real-time updates)
  const { data: syncLogData, startPolling, stopPolling } = useQuery(FIND_UNIQUE, {
    variables: {
      modelName: 'callCenterSyncLog',
      input: { 
        id: syncLogId || '' 
      },
    },
    skip: !syncLogId || !open,
    fetchPolicy: 'network-only', // Always fetch from network for real-time
  });

  const syncLog = syncLogData?.findById as CallCenterSyncLog | undefined;

  // Start/Stop polling based on dialog state
  useEffect(() => {
    if (open && syncLogId) {
      // Start polling every 2 seconds for real-time updates
      startPolling(2000);
      setLogs([`[${new Date().toLocaleTimeString('vi-VN')}] Bắt đầu đồng bộ dữ liệu...`]);
    } else {
      stopPolling();
      setLogs([]);
      setStats({
        recordsFetched: 0,
        recordsCreated: 0,
        recordsUpdated: 0,
        recordsSkipped: 0,
        status: 'running',
      });
    }

    // Cleanup: stop polling when component unmounts or dialog closes
    return () => {
      stopPolling();
    };
  }, [open, syncLogId, startPolling, stopPolling]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Update stats từ poll data
  useEffect(() => {
    if (syncLog) {
      const newStats = {
        recordsFetched: syncLog.recordsFetched || 0,
        recordsCreated: syncLog.recordsCreated || 0,
        recordsUpdated: syncLog.recordsUpdated || 0,
        recordsSkipped: syncLog.recordsSkipped || 0,
        status: syncLog.status || 'running',
      };

      // Add logs khi có update đáng kể (mỗi 10, 50, 100 records hoặc khi hoàn thành)
      const prevFetched = stats.recordsFetched;
      const fetchDiff = syncLog.recordsFetched - prevFetched;
      if (fetchDiff > 0 && (fetchDiff >= 10 || syncLog.recordsFetched % 50 === 0)) {
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] 📥 Đã tải ${syncLog.recordsFetched} records từ PBX API...`
        ]);
      }

      const createdDiff = syncLog.recordsCreated - stats.recordsCreated;
      if (createdDiff > 0 && (createdDiff >= 10 || syncLog.recordsCreated % 50 === 0)) {
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] ✅ Đã tạo mới ${syncLog.recordsCreated} records...`
        ]);
      }

      const updatedDiff = syncLog.recordsUpdated - stats.recordsUpdated;
      if (updatedDiff > 0 && (updatedDiff >= 5 || syncLog.recordsUpdated % 25 === 0)) {
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] 🔄 Đã cập nhật ${syncLog.recordsUpdated} records...`
        ]);
      }

      if (syncLog.status === 'success' && stats.status !== 'success') {
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] ✨ Đồng bộ hoàn thành thành công!`,
          `[${new Date().toLocaleTimeString('vi-VN')}] 📊 Tổng kết: ${syncLog.recordsCreated} tạo mới, ${syncLog.recordsUpdated} cập nhật, ${syncLog.recordsSkipped} bỏ qua`
        ]);
        stopPolling();
      }

      if (syncLog.status === 'error' && stats.status !== 'error') {
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] ❌ Đồng bộ thất bại: ${syncLog.errorMessage || 'Unknown error'}`
        ]);
        stopPolling();
      }

      setStats(newStats);
    }
  }, [syncLog, stats, stopPolling]);

  const progress = stats.recordsFetched > 0 
    ? ((stats.recordsCreated + stats.recordsUpdated) / stats.recordsFetched) * 100 
    : 0;

  const isCompleted = stats.status === 'success' || stats.status === 'error';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {!isCompleted && <Loader2 className="h-4 w-4 animate-spin" />}
            {stats.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {stats.status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
            Tiến trình đồng bộ
          </DialogTitle>
          <DialogDescription>
            {stats.status === 'running' && 'Đang đồng bộ dữ liệu từ PBX API...'}
            {stats.status === 'success' && 'Đồng bộ hoàn thành thành công!'}
            {stats.status === 'error' && 'Đồng bộ thất bại!'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Sync Info */}
          {syncLog && (
            <div className="px-4 py-2 bg-muted/50 rounded-md text-xs text-muted-foreground">
              <div className="flex justify-between items-center">
                <span>Sync Log ID: {syncLogId?.slice(0, 8)}...</span>
                <span>
                  {syncLog.startedAt && format(new Date(syncLog.startedAt), 'HH:mm:ss', { locale: vi })}
                  {syncLog.duration && ` • ${(syncLog.duration / 1000).toFixed(1)}s`}
                </span>
              </div>
            </div>
          )}
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tiến trình</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Stats Grid - REAL-TIME UPDATE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 relative">
              <div className="text-2xl font-bold text-blue-700">
                {stats.recordsFetched}
                {!isCompleted && stats.recordsFetched > 0 && (
                  <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                )}
              </div>
              <div className="text-xs text-blue-600">Đã tải từ API</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">
                {stats.recordsCreated}
                {!isCompleted && stats.recordsCreated > 0 && (
                  <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                )}
              </div>
              <div className="text-xs text-green-600">Tạo mới</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">
                {stats.recordsUpdated}
                {!isCompleted && stats.recordsUpdated > 0 && (
                  <span className="ml-2 inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                )}
              </div>
              <div className="text-xs text-yellow-600">Cập nhật</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-700">{stats.recordsSkipped}</div>
              <div className="text-xs text-gray-600">Bỏ qua</div>
            </div>
          </div>

          {/* Logs Terminal - REAL-TIME */}
          <div className="space-y-2">
            <Label>Logs (Real-time)</Label>
            <ScrollArea 
              ref={scrollRef}
              className="h-[200px] w-full rounded-md border bg-slate-950 p-4"
            >
              {logs.map((log, i) => (
                <div key={i} className="text-xs text-green-400 font-mono mb-1">
                  {log}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-xs text-gray-500 font-mono">
                  Đang chờ logs...
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={onClose}
            variant={isCompleted ? 'default' : 'outline'}
          >
            {isCompleted ? 'Đóng' : 'Chạy nền'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CallCenterPage() {
  const [activeTab, setActiveTab] = useState('records');
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showDateRangeDialog, setShowDateRangeDialog] = useState(false);
  const [showSyncProgress, setShowSyncProgress] = useState(false);
  const [currentSyncLogId, setCurrentSyncLogId] = useState<string | null>(null);
  const [syncStats, setSyncStats] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });
  const [dateRange, setDateRange] = useState({
    fromDate: '',
    toDate: '',
  });
  const [showSummary, setShowSummary] = useState(false);
  
  // Filter state cho Call Records
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterExtension, setFilterExtension] = useState('');
  const [filterDirection, setFilterDirection] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [quickFilter, setQuickFilter] = useState(''); // 'today', '7days', '30days', ''

  // Filter state riêng cho Summary Tab
  const [summaryDateFrom, setSummaryDateFrom] = useState('');
  const [summaryDateTo, setSummaryDateTo] = useState('');
  const [summaryExtension, setSummaryExtension] = useState('');
  const [summaryQuickFilter, setSummaryQuickFilter] = useState('');
  const [summaryFilters, setSummaryFilters] = useState<any>({});

  // ✅ Comparison state - So sánh giữa các khoảng thời gian
  interface ComparisonPeriod {
    id: string;
    label: string;
    fromDate: string;
    toDate: string;
    filters: any;
  }
  const [enableComparison, setEnableComparison] = useState(false);
  const [comparisonPeriods, setComparisonPeriods] = useState<ComparisonPeriod[]>([]);
  const [comparisonExtension, setComparisonExtension] = useState('');

  // Helper to generate unique ID
  const generatePeriodId = () => `period_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Calculate days between two dates
  const daysBetween = (from: string, to: string): number => {
    if (!from || !to) return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Generate comparison periods based on current filter range
  const generateComparisonPeriods = (periodsCount: number = 2): ComparisonPeriod[] => {
    const periods: ComparisonPeriod[] = [];
    
    // Use summary filter dates or default to last 7 days
    let baseToDate = summaryDateTo || new Date().toISOString().split('T')[0];
    let baseFromDate = summaryDateFrom;
    
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

  // Add a new comparison period (goes back from the earliest period)
  const addComparisonPeriod = () => {
    if (comparisonPeriods.length >= 10) {
      toast.warning('Tối đa 10 khoảng thời gian so sánh');
      return;
    }
    
    if (comparisonPeriods.length === 0) {
      // If no periods, generate 2 default
      setComparisonPeriods(generateComparisonPeriods(2));
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
  };

  // Remove a comparison period
  const removeComparisonPeriod = (id: string) => {
    const newPeriods = comparisonPeriods.filter(p => p.id !== id);
    // Re-label remaining periods
    const relabeledPeriods = newPeriods.map((p, index) => ({
      ...p,
      label: index === 0 ? 'Hiện tại' : `Khoảng ${index + 1}`,
    }));
    setComparisonPeriods(relabeledPeriods);
  };

  // Update a comparison period
  const updateComparisonPeriod = (id: string, field: keyof ComparisonPeriod, value: string) => {
    setComparisonPeriods(comparisonPeriods.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  // Build filters for comparison period
  const buildComparisonFilters = (period: ComparisonPeriod, extension: string): any => {
    const filters: any = {};
    
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

  // Apply comparison filters
  const applyComparisonFilters = () => {
    if (!comparisonExtension) {
      toast.error('Vui lòng nhập Extension/SĐT để so sánh');
      return;
    }
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
    toast.success(`Đang so sánh ${comparisonPeriods.length} khoảng thời gian`);
  };

  // Clear comparison
  const clearComparison = () => {
    setComparisonPeriods([]);
    setComparisonExtension('');
    setEnableComparison(false);
  };

  // Helper function to apply summary filters
  const applySummaryFilters = (dateFrom?: string, dateTo?: string, ext?: string) => {
    const newFilters: any = {};
    
    const fromDate = dateFrom ?? summaryDateFrom;
    const toDate = dateTo ?? summaryDateTo;
    const extension = ext ?? summaryExtension;
    
    // Date range filter (convert to epoch STRING)
    if (fromDate) {
      const fromEpoch = Math.floor(new Date(fromDate).getTime() / 1000);
      newFilters.startEpoch = { ...newFilters.startEpoch, gte: fromEpoch.toString() };
    }
    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setDate(toDateObj.getDate() + 1);
      const toEpoch = Math.floor(toDateObj.getTime() / 1000);
      newFilters.startEpoch = { ...newFilters.startEpoch, lt: toEpoch.toString() };
    }
    
    // Extension filter
    if (extension) {
      newFilters.OR = [
        { callerIdNumber: { contains: extension } },
        { destinationNumber: { contains: extension } },
      ];
    }
    
    setSummaryFilters(newFilters);
  };

  // Summary quick filter handlers
  const handleSummaryQuickFilter = (type: string) => {
    const today = new Date();
    let fromDate = '';
    let toDate = today.toISOString().split('T')[0];
    
    if (type === 'today') {
      fromDate = toDate;
    } else if (type === '7days') {
      const from = new Date();
      from.setDate(from.getDate() - 7);
      fromDate = from.toISOString().split('T')[0];
    } else if (type === '30days') {
      const from = new Date();
      from.setDate(from.getDate() - 30);
      fromDate = from.toISOString().split('T')[0];
    } else if (type === 'thisMonth') {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      fromDate = from.toISOString().split('T')[0];
    } else if (type === 'lastMonth') {
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth(), 0);
      fromDate = from.toISOString().split('T')[0];
      toDate = to.toISOString().split('T')[0];
    }
    
    setSummaryQuickFilter(type);
    setSummaryDateFrom(fromDate);
    setSummaryDateTo(toDate);
    applySummaryFilters(fromDate, toDate);
  };

  const clearSummaryFilters = () => {
    setSummaryDateFrom('');
    setSummaryDateTo('');
    setSummaryExtension('');
    setSummaryQuickFilter('');
    setSummaryFilters({});
  };

  // Helper function to apply filters
  const applyFilters = (dateFrom?: string, dateTo?: string, ext?: string, dir?: string, status?: string) => {
    const newFilters: any = {};
    
    const fromDate = dateFrom ?? filterDateFrom;
    const toDate = dateTo ?? filterDateTo;
    const extension = ext ?? filterExtension;
    const direction = dir ?? filterDirection;
    const callStatus = status ?? filterStatus;
    
    // Date range filter (convert to epoch STRING)
    if (fromDate) {
      const fromEpoch = Math.floor(new Date(fromDate).getTime() / 1000);
      newFilters.startEpoch = { ...newFilters.startEpoch, gte: fromEpoch.toString() };
    }
    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setDate(toDateObj.getDate() + 1);
      const toEpoch = Math.floor(toDateObj.getTime() / 1000);
      newFilters.startEpoch = { ...newFilters.startEpoch, lt: toEpoch.toString() };
    }
    
    // Extension filter
    if (extension) {
      newFilters.OR = [
        { callerIdNumber: { contains: extension } },
        { destinationNumber: { contains: extension } },
      ];
    }
    
    // Direction filter
    if (direction && direction !== 'all') {
      newFilters.direction = direction;
    }
    
    // Status filter
    if (callStatus && callStatus !== 'all') {
      newFilters.callStatus = callStatus;
    }
    
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  // Quick filter handlers
  const handleQuickFilter = (type: string) => {
    const today = new Date();
    let fromDate = '';
    let toDate = today.toISOString().split('T')[0];
    
    if (type === 'today') {
      fromDate = toDate;
    } else if (type === '7days') {
      const from = new Date();
      from.setDate(from.getDate() - 7);
      fromDate = from.toISOString().split('T')[0];
    } else if (type === '30days') {
      const from = new Date();
      from.setDate(from.getDate() - 30);
      fromDate = from.toISOString().split('T')[0];
    }
    
    setQuickFilter(type);
    setFilterDateFrom(fromDate);
    setFilterDateTo(toDate);
    applyFilters(fromDate, toDate);
  };

  const clearAllFilters = () => {
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterExtension('');
    setFilterDirection('');
    setFilterStatus('');
    setQuickFilter('');
    setFilters({});
    setPagination({ ...pagination, page: 1 });
  };

  // ✅ MIGRATED: Query config với Dynamic GraphQL
  // Note: Lấy config đầu tiên (chỉ có 1 config)
  const { data: configs = [], loading: configLoading, refetch: refetchConfig } = useFindMany<CallCenterConfig>('callCenterConfig', {
    take: 1,
  });
  const config = configs[0] || null;

  // ✅ MIGRATED: Query records với pagination
  const { 
    data: recordsResponse, 
    loading: recordsLoading, 
    refetch: refetchRecords 
  } = useFindMany<any>('callCenterRecord', {
    where: filters,
    skip: (pagination.page - 1) * pagination.limit,
    take: pagination.limit,
    orderBy: { startEpoch: 'desc' },
  });

  // Transform data structure to match old format
  const records = recordsResponse ? {
    items: Array.isArray(recordsResponse) ? recordsResponse : [],
    pagination: {
      currentPage: pagination.page,
      totalPages: Math.ceil((Array.isArray(recordsResponse) ? recordsResponse.length : 0) / pagination.limit),
      totalItems: Array.isArray(recordsResponse) ? recordsResponse.length : 0,
      hasNextPage: Array.isArray(recordsResponse) && recordsResponse.length === pagination.limit,
      hasPreviousPage: pagination.page > 1,
    }
  } : null;

  // ✅ Query riêng cho Summary tab - lấy nhiều records hơn để thống kê chính xác
  const { 
    data: summaryRecordsResponse = [], 
    loading: summaryLoading, 
    refetch: refetchSummary 
  } = useFindMany<CallCenterRecord>('callCenterRecord', {
    where: summaryFilters,
    take: 5000, // Lấy nhiều hơn để tính tổng chính xác
    orderBy: { startEpoch: 'desc' },
  });

  // ✅ Query cho Comparison Periods - Sử dụng useEffect để fetch thủ công
  const [comparisonData, setComparisonData] = useState<Map<string, CallCenterRecord[]>>(new Map());
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const { refetch: fetchComparisonData } = useFindMany<CallCenterRecord>('callCenterRecord', {
    take: 0, // Không fetch tự động
  });

  // Fetch data for all comparison periods
  const fetchAllComparisonData = async () => {
    if (comparisonPeriods.length === 0 || !comparisonExtension) return;
    
    setComparisonLoading(true);
    const newData = new Map<string, CallCenterRecord[]>();
    
    try {
      for (const period of comparisonPeriods) {
        if (period.fromDate && period.toDate) {
          const filters = buildComparisonFilters(period, comparisonExtension);
          const result = await fetchComparisonData({
            where: filters,
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
  };

  // Trigger fetch when comparison filters are applied
  useEffect(() => {
    if (enableComparison && comparisonPeriods.some(p => Object.keys(p.filters).length > 0)) {
      fetchAllComparisonData();
    }
  }, [comparisonPeriods.map(p => JSON.stringify(p.filters)).join(','), enableComparison]);

  // Calculate summary for comparison period data
  const calculateComparisonSummary = (records: CallCenterRecord[]) => {
    if (!records || records.length === 0) {
      return {
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

    records.forEach((record: CallCenterRecord) => {
      const duration = parseInt(record.duration || '0');
      const billsec = parseInt(record.billsec || '0');
      const isAnswered = record.callStatus === 'ANSWER';

      totalCalls += 1;
      totalDuration += duration;
      totalBillsec += billsec;
      if (isAnswered) {
        answeredCalls += 1;
      } else {
        missedCalls += 1;
      }
    });

    return {
      totalCalls,
      totalDuration,
      totalBillsec,
      answeredCalls,
      missedCalls,
      avgDuration: totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0,
      answerRate: totalCalls > 0 ? Math.round((answeredCalls / totalCalls) * 100) : 0,
    };
  };

  // Format duration in hh:mm:ss
  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  // Calculate percentage change
  const calculateChange = (current: number, previous: number): { value: number; type: 'up' | 'down' | 'same' } => {
    if (previous === 0) {
      return current > 0 ? { value: 100, type: 'up' } : { value: 0, type: 'same' };
    }
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(change)),
      type: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
    };
  };

  // Get comparison results
  const getComparisonResults = () => {
    if (!enableComparison || comparisonPeriods.length < 2) return [];
    
    return comparisonPeriods.map(period => {
      const records = comparisonData.get(period.id) || [];
      const summary = calculateComparisonSummary(records);
      return {
        ...period,
        summary,
        recordsCount: records.length,
      };
    });
  };

  const comparisonResults = getComparisonResults();

  // ✅ MIGRATED: Query sync logs
  const { 
    data: syncLogsData = [], 
    loading: logsLoading, 
    refetch: refetchLogs 
  } = useFindMany<CallCenterSyncLog>('callCenterSyncLog', {
    take: 10,
    orderBy: { startedAt: 'desc' },
  });
  const logs = syncLogsData;

  // ✅ Keep custom SYNC mutation (not a standard CRUD operation)
  const [syncData, { loading: syncing }] = useMutation(SYNC_CALLCENTER_DATA);

  // ✅ MIGRATED: Config mutations
  const [updateConfigMutation, { loading: updating }] = useUpdateOne('callCenterConfig');
  const [createConfigMutation, { loading: creating }] = useCreateOne('callCenterConfig');

  const handleManualSync = async () => {
    // Check if config is active before syncing
    if (!config?.isActive) {
      toast.error('Cấu hình chưa được kích hoạt', {
        description: 'Vui lòng bật "Kích hoạt" trong phần Cài đặt trước khi đồng bộ.',
        action: {
          label: 'Mở Cài đặt',
          onClick: () => setShowConfigDialog(true),
        },
      });
      return;
    }

    try {
      const result = await syncData({
        variables: {
          input: {},
        },
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
      } else {
        toast.error('Sync thất bại', {
          description: result.data.syncCallCenterData.error,
        });
      }
    } catch (error: any) {
      toast.error('Sync error', {
        description: error.message,
      });
    }
  };

  const handleSyncWithDateRange = async () => {
    if (!dateRange.fromDate || !dateRange.toDate) {
      toast.error('Vui lòng chọn khoảng ngày');
      return;
    }

    // Check if config is active before syncing
    if (!config?.isActive) {
      setShowDateRangeDialog(false);
      toast.error('Cấu hình chưa được kích hoạt', {
        description: 'Vui lòng bật "Kích hoạt" trong phần Cài đặt trước khi đồng bộ.',
        action: {
          label: 'Mở Cài đặt',
          onClick: () => setShowConfigDialog(true),
        },
      });
      return;
    }

    try {
      setShowDateRangeDialog(false);
      
      const result = await syncData({
        variables: {
          input: {
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
          },
        },
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
      } else {
        toast.error('Sync thất bại', {
          description: result.data.syncCallCenterData.error,
        });
      }
    } catch (error: any) {
      toast.error('Sync error', {
        description: error.message,
      });
    }
  };

  const handleUpdateConfig = async (newConfig: any) => {
    try {
      if (config?.id) {
        // ✅ MIGRATED: Update với Dynamic GraphQL
        await updateConfigMutation({
          where: { id: config.id },
          data: newConfig,
        });
        toast.success('Cập nhật config thành công');
      } else {
        // ✅ MIGRATED: Create với Dynamic GraphQL
        await createConfigMutation({
          data: {
            apiUrl: 'https://pbx01.onepos.vn:8080/api/v2/cdrs',
            domain: 'tazaspa102019',
            ...newConfig,
          },
        });
        toast.success('Tạo config thành công');
      }
      await refetchConfig();
      setShowConfigDialog(false);
    } catch (error: any) {
      console.error('Config operation error:', error);
      toast.error('Config operation failed', {
        description: error.message,
      });
    }
  };

  const formatEpoch = (epoch: string) => {
    if (!epoch || epoch === '0') return 'N/A';
    const date = new Date(parseInt(epoch) * 1000);
    return format(date, 'dd/MM/yyyy HH:mm:ss', { locale: vi });
  };

  const formatDuration = (seconds: string) => {
    if (!seconds) return '0s';
    const sec = parseInt(seconds);
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'INBOUND':
        return <PhoneIncoming className="h-4 w-4 text-blue-600" />;
      case 'OUTBOUND':
        return <PhoneOutgoing className="h-4 w-4 text-green-600" />;
      case 'LOCAL':
        return <Phone className="h-4 w-4 text-purple-600" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      ANSWER: { variant: 'default' as const, label: 'Answered' },
      CANCELED: { variant: 'secondary' as const, label: 'Canceled' },
      BUSY: { variant: 'destructive' as const, label: 'Busy' },
      NO_ANSWER: { variant: 'outline' as const, label: 'No Answer' },
      FAILED: { variant: 'destructive' as const, label: 'Failed' },
      UNKNOWN: { variant: 'outline' as const, label: 'Unknown' },
    };
    
    const configVariant = variants[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={configVariant.variant}>{configVariant.label}</Badge>;
  };

  // Calculate call duration summary by caller - dùng dữ liệu từ summaryRecordsResponse
  const calculateSummary = () => {
    const dataToProcess = Array.isArray(summaryRecordsResponse) ? summaryRecordsResponse : [];
    if (dataToProcess.length === 0) return [];

    const summaryMap = new Map<string, {
      callerNumber: string;
      totalCalls: number;
      totalDuration: number;
      totalBillsec: number;
      answeredCalls: number;
      missedCalls: number;
    }>();

    dataToProcess.forEach((record: CallCenterRecord) => {
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

    return Array.from(summaryMap.values())
      .sort((a, b) => b.totalDuration - a.totalDuration);
  };

  const callSummary = calculateSummary();
  const summaryTotalRecords = Array.isArray(summaryRecordsResponse) ? summaryRecordsResponse.length : 0;

  // Define columns for AdvancedTable
  const callRecordColumns: ColumnDef<any>[] = [
    {
      field: 'direction',
      headerName: 'Direction',
      width: 120,
      sortable: true,
      cellRenderer: (params) => (
        <div className="flex items-center gap-2">
          {getDirectionIcon(params.value)}
          <span className="text-xs">{params.value}</span>
        </div>
      ),
    },
    {
      field: 'callerIdNumber',
      headerName: 'Caller',
      width: 130,
      sortable: true,
      cellRenderer: (params) => <div className="font-mono text-sm">{params.value}</div>,
    },
    {
      field: 'destinationNumber',
      headerName: 'Destination',
      width: 130,
      sortable: true,
      cellRenderer: (params) => <div className="font-mono text-sm">{params.value}</div>,
    },
    {
      field: 'startEpoch',
      headerName: 'Start Time',
      width: 180,
      sortable: true,
      cellRenderer: (params) => <div className="text-sm">{formatEpoch(params.value)}</div>,
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 120,
      sortable: true,
      cellRenderer: (params) => (
        <div className="flex flex-col gap-1 text-sm">
          <span>Total: {formatDuration(params.value)}</span>
          <span className="text-xs text-muted-foreground">
            Talk: {formatDuration(params.data.billsec)}
          </span>
        </div>
      ),
    },
    {
      field: 'callStatus',
      headerName: 'Status',
      width: 120,
      sortable: true,
      cellRenderer: (params) => getStatusBadge(params.value),
    },
    {
      field: 'recordPath',
      headerName: 'Recording',
      width: 180,
      cellRenderer: (params) => (
        <AudioPlayer recordPath={params.value} domain={params.data.domain} />
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Compact Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Phone className="h-6 w-6" />
            Call Center
          </h1>
          <p className="text-sm text-muted-foreground">Quản lý dữ liệu cuộc gọi từ PBX</p>
        </div>
        
        {/* Action Buttons - Compact */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowConfigDialog(true)}>
            <Settings className="h-4 w-4 mr-1" />
            Cấu hình
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDateRangeDialog(true)} 
                    disabled={!config?.isActive}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Sync theo ngày
                  </Button>
                </span>
              </TooltipTrigger>
              {!config?.isActive && (
                <TooltipContent>
                  <p>Vui lòng kích hoạt cấu hình trong phần Cài đặt</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button 
                    size="sm"
                    onClick={handleManualSync} 
                    disabled={syncing || !config?.isActive}
                  >
                    {syncing ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-1" />
                    )}
                    Sync Ngay
                  </Button>
                </span>
              </TooltipTrigger>
              {!config?.isActive && !syncing && (
                <TooltipContent>
                  <p>Vui lòng kích hoạt cấu hình trong phần Cài đặt</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Warning if config not active */}
      {config && !config.isActive && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="py-3">
            <CardTitle className="text-orange-800 flex items-center gap-2 text-base">
              <XCircle className="h-4 w-4" />
              Chưa kích hoạt
            </CardTitle>
            <CardDescription className="text-orange-700 text-sm">
              Vui lòng bật trong phần Cấu hình để sử dụng tính năng đồng bộ.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Compact Stats Bar */}
      {config && config.isActive && (
        <div className="flex flex-wrap items-center gap-4 p-3 bg-muted/50 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{config.totalRecordsSynced || 0}</span>
            <span className="text-muted-foreground">records</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="font-normal">{config.syncMode}</Badge>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Last:</span>
            <span className="font-medium">
              {config.lastSyncAt 
                ? formatDistanceToNow(new Date(config.lastSyncAt), { addSuffix: true, locale: vi })
                : 'Chưa sync'
              }
            </span>
            {config.lastSyncStatus && (
              <Badge 
                variant={config.lastSyncStatus === 'success' ? 'default' : 'destructive'} 
                className="text-xs"
              >
                {config.lastSyncStatus}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="records">Call Records</TabsTrigger>
          <TabsTrigger value="summary">Tổng hợp</TabsTrigger>
          <TabsTrigger value="progress" className="relative">
            Tiến trình
            {showSyncProgress && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>

        {/* Call Records Tab */}
        <TabsContent value="records" className="space-y-3 mt-3">
          {/* Quick Filters + Filter Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Lọc nhanh:</span>
            <Button 
              variant={quickFilter === 'today' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleQuickFilter('today')}
            >
              Hôm nay
            </Button>
            <Button 
              variant={quickFilter === '7days' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleQuickFilter('7days')}
            >
              7 ngày
            </Button>
            <Button 
              variant={quickFilter === '30days' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleQuickFilter('30days')}
            >
              30 ngày
            </Button>
            <div className="h-4 w-px bg-border mx-1" />
            <Button 
              variant={showFilters ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Lọc nâng cao
              {(filterExtension || filterDirection || filterStatus) && (
                <Badge variant="secondary" className="ml-1 h-5 px-1 bg-blue-100 text-blue-700">!</Badge>
              )}
            </Button>
            {Object.keys(filters).length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <XCircle className="h-4 w-4 mr-1" />
                Xóa lọc
              </Button>
            )}
          </div>

          {/* Advanced Filters - Collapsible Inline */}
          {showFilters && (
            <Card className="border-blue-100 bg-blue-50/30">
              <CardContent className="py-3">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs">Từ ngày</Label>
                    <Input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Đến ngày</Label>
                    <Input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Extension/SĐT</Label>
                    <Input
                      placeholder="VD: 101..."
                      value={filterExtension}
                      onChange={(e) => setFilterExtension(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Hướng gọi</Label>
                    <Select value={filterDirection} onValueChange={setFilterDirection}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="inbound">Gọi vào</SelectItem>
                        <SelectItem value="outbound">Gọi ra</SelectItem>
                        <SelectItem value="local">Nội bộ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Trạng thái</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="ANSWER">Đã trả lời</SelectItem>
                        <SelectItem value="NO_ANSWER">Không trả lời</SelectItem>
                        <SelectItem value="BUSY">Máy bận</SelectItem>
                        <SelectItem value="FAILED">Thất bại</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    size="sm" 
                    className="h-8"
                    onClick={() => {
                      setQuickFilter('');
                      applyFilters();
                    }}
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    Áp dụng
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Records Table */}
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Danh sách cuộc gọi</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {records?.pagination.totalItems || 0} cuộc gọi
                  {Object.keys(filters).length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">đã lọc</Badge>
                  )}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recordsLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <AdvancedTable
                  columns={callRecordColumns}
                  data={records?.items || []}
                  config={{
                    enableSorting: true,
                    enableFiltering: true,
                    enableColumnPinning: false,
                    enableColumnResizing: true,
                    enableColumnHiding: true,
                    enableRowSelection: false,
                    enableInlineEditing: false,
                    enableRowDeletion: false,
                    showToolbar: true,
                    showPagination: false,
                  }}
                  height={500}
                />
              )}
            </CardContent>
          </Card>

          {/* Compact Pagination */}
          {records?.pagination && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Trang {records.pagination.currentPage} / {records.pagination.totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={!records.pagination.hasPreviousPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={!records.pagination.hasNextPage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Summary Tab - Với filter riêng */}
        <TabsContent value="summary" className="space-y-3 mt-3">
          {/* Filter Section cho Summary */}
          <Card className="border-purple-200 bg-purple-50/30">
            <CardContent className="py-3">
              <div className="space-y-3">
                {/* Quick Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-purple-700">Lọc theo:</span>
                  <Button 
                    variant={summaryQuickFilter === 'today' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleSummaryQuickFilter('today')}
                    className={summaryQuickFilter === 'today' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    Hôm nay
                  </Button>
                  <Button 
                    variant={summaryQuickFilter === '7days' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleSummaryQuickFilter('7days')}
                    className={summaryQuickFilter === '7days' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    7 ngày
                  </Button>
                  <Button 
                    variant={summaryQuickFilter === '30days' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleSummaryQuickFilter('30days')}
                    className={summaryQuickFilter === '30days' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    30 ngày
                  </Button>
                  <Button 
                    variant={summaryQuickFilter === 'thisMonth' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleSummaryQuickFilter('thisMonth')}
                    className={summaryQuickFilter === 'thisMonth' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    Tháng này
                  </Button>
                  <Button 
                    variant={summaryQuickFilter === 'lastMonth' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleSummaryQuickFilter('lastMonth')}
                    className={summaryQuickFilter === 'lastMonth' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    Tháng trước
                  </Button>
                  {Object.keys(summaryFilters).length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearSummaryFilters}>
                      <XCircle className="h-4 w-4 mr-1" />
                      Xóa lọc
                    </Button>
                  )}
                </div>

                {/* Custom Date Range + Extension */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs text-purple-700">Từ ngày</Label>
                    <Input
                      type="date"
                      value={summaryDateFrom}
                      onChange={(e) => setSummaryDateFrom(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-purple-700">Đến ngày</Label>
                    <Input
                      type="date"
                      value={summaryDateTo}
                      onChange={(e) => setSummaryDateTo(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-purple-700">Extension/SĐT</Label>
                    <Input
                      placeholder="VD: 101, 0912..."
                      value={summaryExtension}
                      onChange={(e) => setSummaryExtension(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <Button 
                    size="sm" 
                    className="h-8 bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                      setSummaryQuickFilter('');
                      applySummaryFilters();
                    }}
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    Áp dụng
                  </Button>
                </div>

                {/* Filter Info */}
                {Object.keys(summaryFilters).length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-100 px-3 py-1.5 rounded">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Đang lọc: 
                      {summaryDateFrom && ` từ ${summaryDateFrom}`}
                      {summaryDateTo && ` đến ${summaryDateTo}`}
                      {summaryExtension && ` | Extension: ${summaryExtension}`}
                    </span>
                    <span className="ml-auto font-medium">{summaryTotalRecords} cuộc gọi</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ✅ Comparison Section - So sánh khoảng thời gian */}
          <Card className="border-orange-200 bg-orange-50/30">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-base text-orange-800">So sánh các khoảng thời gian</CardTitle>
                  {enableComparison && comparisonPeriods.length > 0 && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      {comparisonPeriods.length} khoảng • {daysBetween(comparisonPeriods[0]?.fromDate, comparisonPeriods[0]?.toDate)} ngày/khoảng
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="enable-comparison" className="text-sm text-orange-700">Bật so sánh</Label>
                  <Switch 
                    id="enable-comparison"
                    checked={enableComparison}
                    onCheckedChange={(checked) => {
                      setEnableComparison(checked);
                      if (!checked) {
                        clearComparison();
                      } else {
                        // Generate periods based on current summary filter or default 7 days
                        const periods = generateComparisonPeriods(2);
                        setComparisonPeriods(periods);
                        // Auto-fill extension from summary filter
                        if (summaryExtension) {
                          setComparisonExtension(summaryExtension);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            
            {enableComparison && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Extension Input + Quick Actions */}
                  <div className="flex flex-wrap items-end gap-3 p-3 bg-orange-100/50 rounded-lg">
                    <div className="flex-1 min-w-[200px] space-y-1">
                      <Label className="text-xs text-orange-700 font-medium">Extension/SĐT cần so sánh *</Label>
                      <Input
                        placeholder="VD: 101, 0912..."
                        value={comparisonExtension}
                        onChange={(e) => setComparisonExtension(e.target.value)}
                        className="h-9 bg-white border-orange-200 focus:border-orange-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={addComparisonPeriod}
                        disabled={comparisonPeriods.length >= 10}
                        className="h-9 border-orange-300 hover:bg-orange-100"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm khoảng trước
                      </Button>
                      {comparisonPeriods.length > 2 && (
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => setComparisonPeriods(generateComparisonPeriods(2))}
                          className="h-9 text-orange-600 hover:bg-orange-100"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Comparison Periods */}
                  <div className="space-y-2">
                    {comparisonPeriods.map((period, index) => (
                      <div 
                        key={period.id} 
                        className={`grid grid-cols-[auto_1fr_auto_auto] gap-2 items-center p-2 border rounded-lg transition-colors ${
                          index === 0 
                            ? 'bg-orange-100/50 border-orange-300' 
                            : 'bg-white border-orange-200 hover:bg-orange-50/50'
                        }`}
                      >
                        <div className="w-24">
                          <Input
                            placeholder="Nhãn"
                            value={period.label}
                            onChange={(e) => updateComparisonPeriod(period.id, 'label', e.target.value)}
                            className={`h-8 text-xs font-medium border-none text-center ${
                              index === 0 ? 'bg-orange-200/50 text-orange-800' : 'bg-orange-50 text-orange-700'
                            }`}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="date"
                            value={period.fromDate}
                            onChange={(e) => updateComparisonPeriod(period.id, 'fromDate', e.target.value)}
                            className="h-8 text-sm"
                          />
                          <span className="text-muted-foreground">→</span>
                          <Input
                            type="date"
                            value={period.toDate}
                            onChange={(e) => updateComparisonPeriod(period.id, 'toDate', e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground min-w-[60px] text-center">
                          {period.fromDate && period.toDate && (
                            <Badge variant="secondary" className="text-xs">
                              {daysBetween(period.fromDate, period.toDate)} ngày
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeComparisonPeriod(period.id)}
                          disabled={comparisonPeriods.length <= 1}
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Apply Button */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      So sánh <span className="font-medium text-orange-600">{comparisonExtension || '...'}</span> qua {comparisonPeriods.length} khoảng thời gian liên tiếp
                    </p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={clearComparison}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={applyComparisonFilters}
                        disabled={comparisonLoading || comparisonPeriods.length < 1}
                      >
                        {comparisonLoading ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <GitCompare className="h-4 w-4 mr-1" />
                        )}
                        So sánh
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* ✅ Comparison Results */}
          {enableComparison && comparisonResults.length >= 1 && comparisonResults.some(r => r.recordsCount > 0) && (
            <Card className="border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    Kết quả so sánh: <span className="text-orange-600">{comparisonExtension}</span>
                  </CardTitle>
                  <Badge variant="secondary">
                    {comparisonResults.length} khoảng thời gian
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {comparisonLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Comparison Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-orange-100/50">
                            <th className="text-left p-2 font-semibold">Khoảng thời gian</th>
                            <th className="text-center p-2 font-semibold">Tổng cuộc gọi</th>
                            <th className="text-center p-2 font-semibold">Đã trả lời</th>
                            <th className="text-center p-2 font-semibold">Tỷ lệ trả lời</th>
                            <th className="text-center p-2 font-semibold">Tổng thời lượng</th>
                            <th className="text-center p-2 font-semibold">TB/cuộc gọi</th>
                            <th className="text-center p-2 font-semibold">Thay đổi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonResults.map((result, index) => {
                            const prevResult = index > 0 ? comparisonResults[index - 1] : null;
                            const callsChange = prevResult ? calculateChange(result.summary.totalCalls, prevResult.summary.totalCalls) : null;
                            const durationChange = prevResult ? calculateChange(result.summary.totalDuration, prevResult.summary.totalDuration) : null;
                            
                            return (
                              <tr key={result.id} className="border-b border-orange-100 hover:bg-orange-50/50">
                                <td className="p-2">
                                  <div className="font-medium text-orange-700">{result.label}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {result.fromDate} → {result.toDate}
                                  </div>
                                </td>
                                <td className="text-center p-2">
                                  <span className="font-semibold">{result.summary.totalCalls}</span>
                                </td>
                                <td className="text-center p-2">
                                  <Badge variant="default" className="bg-green-600">
                                    {result.summary.answeredCalls}
                                  </Badge>
                                </td>
                                <td className="text-center p-2">
                                  <span className={`font-semibold ${result.summary.answerRate >= 70 ? 'text-green-600' : result.summary.answerRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {result.summary.answerRate}%
                                  </span>
                                </td>
                                <td className="text-center p-2 font-semibold">
                                  {formatTotalDuration(result.summary.totalDuration)}
                                </td>
                                <td className="text-center p-2">
                                  {formatTotalDuration(result.summary.avgDuration)}
                                </td>
                                <td className="text-center p-2">
                                  {callsChange && (
                                    <div className="flex items-center justify-center gap-1">
                                      {callsChange.type === 'up' && (
                                        <span className="text-green-600 flex items-center text-xs">
                                          <TrendingUp className="h-3 w-3 mr-0.5" />
                                          +{callsChange.value}%
                                        </span>
                                      )}
                                      {callsChange.type === 'down' && (
                                        <span className="text-red-600 flex items-center text-xs">
                                          <TrendingDown className="h-3 w-3 mr-0.5" />
                                          -{callsChange.value}%
                                        </span>
                                      )}
                                      {callsChange.type === 'same' && (
                                        <span className="text-muted-foreground flex items-center text-xs">
                                          <Minus className="h-3 w-3 mr-0.5" />
                                          0%
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {!callsChange && (
                                    <span className="text-muted-foreground text-xs">Cơ sở</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Total Calls Card */}
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {comparisonResults.reduce((sum, r) => sum + r.summary.totalCalls, 0)}
                          </div>
                          <div className="text-xs text-blue-600/70">Tổng cuộc gọi</div>
                        </CardContent>
                      </Card>

                      {/* Answered Rate Card */}
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-3 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(
                              (comparisonResults.reduce((sum, r) => sum + r.summary.answeredCalls, 0) /
                              Math.max(comparisonResults.reduce((sum, r) => sum + r.summary.totalCalls, 0), 1)) * 100
                            )}%
                          </div>
                          <div className="text-xs text-green-600/70">Tỷ lệ trả lời TB</div>
                        </CardContent>
                      </Card>

                      {/* Total Duration Card */}
                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="p-3 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {formatTotalDuration(comparisonResults.reduce((sum, r) => sum + r.summary.totalDuration, 0))}
                          </div>
                          <div className="text-xs text-purple-600/70">Tổng thời lượng</div>
                        </CardContent>
                      </Card>

                      {/* Trend Card */}
                      <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="p-3 text-center">
                          {comparisonResults.length >= 2 && (() => {
                            const firstPeriod = comparisonResults[0];
                            const lastPeriod = comparisonResults[comparisonResults.length - 1];
                            const trend = calculateChange(lastPeriod.summary.totalCalls, firstPeriod.summary.totalCalls);
                            return (
                              <>
                                <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                                  trend.type === 'up' ? 'text-green-600' : trend.type === 'down' ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                  {trend.type === 'up' && <TrendingUp className="h-5 w-5" />}
                                  {trend.type === 'down' && <TrendingDown className="h-5 w-5" />}
                                  {trend.type === 'same' && <Minus className="h-5 w-5" />}
                                  {trend.type === 'up' ? '+' : trend.type === 'down' ? '-' : ''}{trend.value}%
                                </div>
                                <div className="text-xs text-orange-600/70">Xu hướng</div>
                              </>
                            );
                          })()}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Summary Data Card */}
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Tổng hợp thời lượng cuộc gọi</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{callSummary.length} số điện thoại</Badge>
                  <Badge variant="outline">{summaryTotalRecords} cuộc gọi</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : callSummary.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <p>Không có dữ liệu để hiển thị</p>
                  <p className="text-sm mt-1">Hãy chọn khoảng ngày để xem thống kê</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Summary Header */}
                  <div className="grid grid-cols-6 gap-2 p-3 bg-muted/50 rounded-md font-semibold text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Số điện thoại
                    </div>
                    <div className="text-center">Tổng cuộc gọi</div>
                    <div className="text-center">Đã trả lời</div>
                    <div className="text-center">Nhỡ máy</div>
                    <div className="text-center">Tổng thời lượng</div>
                    <div className="text-center">Thời gian nói</div>
                  </div>

                  {/* Summary Items */}
                  <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-2">
                      {callSummary.map((summary, index) => (
                        <div
                          key={summary.callerNumber}
                          className="grid grid-cols-6 gap-2 p-2 border rounded-md hover:bg-accent/50 transition-colors text-sm"
                        >
                          <div className="font-mono font-semibold flex items-center">
                            <span className="text-muted-foreground mr-2 text-xs">#{index + 1}</span>
                            {summary.callerNumber}
                          </div>
                          <div className="text-center">
                            <Badge variant="outline">{summary.totalCalls}</Badge>
                          </div>
                          <div className="text-center">
                            <Badge variant="default" className="bg-green-600">{summary.answeredCalls}</Badge>
                          </div>
                          <div className="text-center">
                            <Badge variant="secondary">{summary.missedCalls}</Badge>
                          </div>
                          <div className="text-center font-semibold">
                            {formatDuration(summary.totalDuration.toString())}
                          </div>
                          <div className="text-center font-semibold text-green-600">
                            {formatDuration(summary.totalBillsec.toString())}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Summary Footer - Total */}
                  <div className="grid grid-cols-6 gap-2 p-3 bg-primary/10 rounded-md font-bold border-2 border-primary/20 text-sm">
                    <div>TỔNG CỘNG</div>
                    <div className="text-center">{callSummary.reduce((sum, s) => sum + s.totalCalls, 0)}</div>
                    <div className="text-center text-green-600">{callSummary.reduce((sum, s) => sum + s.answeredCalls, 0)}</div>
                    <div className="text-center">{callSummary.reduce((sum, s) => sum + s.missedCalls, 0)}</div>
                    <div className="text-center text-primary">
                      {formatDuration(callSummary.reduce((sum, s) => sum + s.totalDuration, 0).toString())}
                    </div>
                    <div className="text-center text-green-600">
                      {formatDuration(callSummary.reduce((sum, s) => sum + s.totalBillsec, 0).toString())}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab - Chi tiết tiến trình đồng bộ */}
        <TabsContent value="progress" className="space-y-3 mt-3">
          {/* Live Sync Progress */}
          {showSyncProgress && currentSyncLogId && syncStats ? (
            <Card className="border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden relative">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-200/20 via-emerald-200/20 to-green-200/20 animate-pulse" />
              
              <CardHeader className="py-4 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Animated sync icon */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25" />
                      <div className="relative p-2 bg-green-100 rounded-full">
                        <RefreshCw className="h-5 w-5 text-green-600 animate-spin" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                        Đang đồng bộ dữ liệu
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      </CardTitle>
                      <p className="text-xs text-green-600/80 mt-0.5">Đang tải dữ liệu từ PBX API</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 text-white border-0 animate-pulse">
                      🔴 LIVE
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-5 relative">
                {/* Main Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-800">Tiến độ xử lý</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-700">
                        {syncStats.recordsFetched > 0 
                          ? Math.round(((syncStats.recordsCreated + syncStats.recordsUpdated + syncStats.recordsSkipped) / syncStats.recordsFetched) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Custom animated progress bar */}
                  <div className="relative h-4 bg-green-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${syncStats.recordsFetched > 0 
                          ? ((syncStats.recordsCreated + syncStats.recordsUpdated + syncStats.recordsSkipped) / syncStats.recordsFetched) * 100
                          : 0}%` 
                      }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                    {/* Progress stripes animation */}
                    <div className="absolute inset-0 bg-stripes opacity-20" />
                  </div>
                  
                  {/* Records processed text */}
                  <div className="text-center text-xs text-green-700">
                    Đã xử lý <span className="font-bold">{(syncStats.recordsCreated || 0) + (syncStats.recordsUpdated || 0) + (syncStats.recordsSkipped || 0)}</span> / <span className="font-bold">{syncStats.recordsFetched || 0}</span> records
                  </div>
                </div>

                {/* Live Stats Cards với animation */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Fetched */}
                  <div className="p-4 bg-white/80 backdrop-blur rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Download className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex gap-0.5">
                        <div className="w-1 h-3 bg-blue-300 rounded animate-pulse" />
                        <div className="w-1 h-4 bg-blue-400 rounded animate-pulse" style={{ animationDelay: '100ms' }} />
                        <div className="w-1 h-2 bg-blue-300 rounded animate-pulse" style={{ animationDelay: '200ms' }} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 tabular-nums">
                      {syncStats.recordsFetched || 0}
                    </div>
                    <div className="text-xs text-blue-600/70 font-medium">Đã tải về</div>
                  </div>

                  {/* Created */}
                  <div className="p-4 bg-white/80 backdrop-blur rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      {(syncStats.recordsCreated || 0) > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full animate-pulse">
                          +{syncStats.recordsCreated}
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-green-600 tabular-nums">
                      {syncStats.recordsCreated || 0}
                    </div>
                    <div className="text-xs text-green-600/70 font-medium">Tạo mới</div>
                  </div>

                  {/* Updated */}
                  <div className="p-4 bg-white/80 backdrop-blur rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 bg-orange-100 rounded-lg">
                        <RefreshCw className="h-4 w-4 text-orange-600" />
                      </div>
                      {(syncStats.recordsUpdated || 0) > 0 && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full animate-pulse">
                          ↻{syncStats.recordsUpdated}
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-orange-600 tabular-nums">
                      {syncStats.recordsUpdated || 0}
                    </div>
                    <div className="text-xs text-orange-600/70 font-medium">Cập nhật</div>
                  </div>

                  {/* Skipped */}
                  <div className="p-4 bg-white/80 backdrop-blur rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 bg-gray-100 rounded-lg">
                        <XCircle className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-500 tabular-nums">
                      {syncStats.recordsSkipped || 0}
                    </div>
                    <div className="text-xs text-gray-500/70 font-medium">Bỏ qua</div>
                  </div>
                </div>

                {/* Speed indicator */}
                <div className="flex items-center justify-center gap-4 py-2 px-4 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                    <span>Đang xử lý...</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-2 border-t border-green-200">
                  <p className="text-xs text-green-600/70">
                    Sync ID: <code className="bg-green-100 px-1 rounded">{currentSyncLogId?.slice(0, 8)}...</code>
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-100"
                    onClick={() => {
                      setShowSyncProgress(false);
                      refetchRecords();
                      refetchLogs();
                      refetchConfig();
                    }}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Chạy nền
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-muted rounded-full">
                    <Play className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Không có đồng bộ nào đang chạy</p>
                    <p className="text-sm text-muted-foreground">Nhấn "Sync Ngay" hoặc "Sync theo ngày" để bắt đầu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Sync Details */}
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Chi tiết đồng bộ gần đây</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => refetchLogs()}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : !logs || logs.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  Chưa có lịch sử đồng bộ
                </div>
              ) : (
                <div className="space-y-4">
                  {logs?.slice(0, 5).map((log: CallCenterSyncLog, index: number) => (
                    <div key={log.id} className={`${index === 0 ? 'border-2 border-primary/30 bg-primary/5' : 'border'} rounded-lg p-4`}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            log.status === 'success' ? 'bg-green-100' : 
                            log.status === 'error' ? 'bg-red-100' : 
                            'bg-yellow-100'
                          }`}>
                            {log.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {log.status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
                            {log.status === 'running' && <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />}
                          </div>
                          <div>
                            <div className="font-semibold text-sm flex items-center gap-2">
                              {log.syncType}
                              {index === 0 && <Badge variant="secondary" className="text-xs">Mới nhất</Badge>}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(log.startedAt), 'EEEE, dd/MM/yyyy HH:mm:ss', { locale: vi })}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant={log.status === 'success' ? 'default' : log.status === 'error' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {log.status === 'success' ? 'Thành công' : log.status === 'error' ? 'Thất bại' : 'Đang chạy'}
                        </Badge>
                      </div>

                      {/* Date Range if available */}
                      {(log.fromDate || log.toDate) && (
                        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                          <Calendar className="h-3 w-3" />
                          <span>Khoảng thời gian:</span>
                          <span className="font-medium text-foreground">
                            {log.fromDate && format(new Date(log.fromDate), 'dd/MM/yyyy', { locale: vi })}
                            {log.fromDate && log.toDate && ' → '}
                            {log.toDate && format(new Date(log.toDate), 'dd/MM/yyyy', { locale: vi })}
                          </span>
                        </div>
                      )}

                      {/* Stats Grid */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">{log.recordsFetched}</div>
                          <div className="text-xs text-blue-600/70">Đã tải</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">{log.recordsCreated}</div>
                          <div className="text-xs text-green-600/70">Tạo mới</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="text-lg font-bold text-orange-600">{log.recordsUpdated}</div>
                          <div className="text-xs text-orange-600/70">Cập nhật</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-gray-600">{log.recordsSkipped}</div>
                          <div className="text-xs text-gray-600/70">Bỏ qua</div>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                        <div className="flex items-center gap-4">
                          {log.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {(log.duration / 1000).toFixed(2)}s
                            </span>
                          )}
                          {log.completedAt && (
                            <span>
                              Hoàn thành: {format(new Date(log.completedAt), 'HH:mm:ss', { locale: vi })}
                            </span>
                          )}
                        </div>
                        {log.offset !== undefined && log.offset !== null && (
                          <span>Offset: {log.offset}</span>
                        )}
                      </div>

                      {/* Error Message */}
                      {log.errorMessage && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                          <strong>Lỗi:</strong> {log.errorMessage}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Logs Tab */}
        <TabsContent value="logs" className="space-y-3 mt-3">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Lịch sử đồng bộ</CardTitle>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {logs?.map((log: CallCenterSyncLog) => (
                    <Card key={log.id}>
                      <CardContent className="py-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold text-sm">{log.syncType}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(log.startedAt), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
                            </div>
                          </div>
                          <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                            {log.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div>
                            <div className="text-muted-foreground">Fetched</div>
                            <div className="font-semibold">{log.recordsFetched}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Created</div>
                            <div className="font-semibold text-green-600">{log.recordsCreated}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Updated</div>
                            <div className="font-semibold text-blue-600">{log.recordsUpdated}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Skipped</div>
                            <div className="font-semibold text-gray-600">{log.recordsSkipped}</div>
                          </div>
                        </div>
                        {log.duration && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            Duration: {(log.duration / 1000).toFixed(2)}s
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <DateRangeDialog
        open={showDateRangeDialog}
        onClose={() => setShowDateRangeDialog(false)}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSync={handleSyncWithDateRange}
        loading={syncing}
      />

      <ConfigDialog
        open={showConfigDialog}
        onClose={() => setShowConfigDialog(false)}
        config={config}
        onSave={handleUpdateConfig}
        loading={updating || creating}
      />

      <SyncProgressDialog
        open={showSyncProgress}
        onClose={() => {
          setShowSyncProgress(false);
          refetchRecords();
          refetchLogs();
          refetchConfig();
        }}
        syncLogId={currentSyncLogId}
        initialStats={syncStats}
      />
    </div>
  );
}

// Date Range Dialog Component
function DateRangeDialog({ open, onClose, dateRange, setDateRange, onSync, loading }: any) {
  const quickSelects = [
    { label: '1 ngày qua', days: 1 },
    { label: '7 ngày qua', days: 7 },
    { label: '15 ngày qua', days: 15 },
    { label: '30 ngày qua', days: 30 },
    { label: '90 ngày qua', days: 90 },
  ];

  const handleQuickSelect = (days: number) => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    setDateRange({
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chọn khoảng thời gian đồng bộ</DialogTitle>
          <DialogDescription>
            Chọn khoảng ngày để lấy dữ liệu cuộc gọi từ PBX
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Quick Select</Label>
            <div className="flex flex-wrap gap-2">
              {quickSelects.map((item) => (
                <Button
                  key={item.days}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(item.days)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <Input
                type="date"
                value={dateRange.fromDate}
                onChange={(e) => setDateRange({ ...dateRange, fromDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <Input
                type="date"
                value={dateRange.toDate}
                onChange={(e) => setDateRange({ ...dateRange, toDate: e.target.value })}
              />
            </div>
          </div>

          {dateRange.fromDate && dateRange.toDate && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                Sẽ đồng bộ dữ liệu từ {format(new Date(dateRange.fromDate), 'dd/MM/yyyy', { locale: vi })} đến{' '}
                {format(new Date(dateRange.toDate), 'dd/MM/yyyy', { locale: vi })}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            onClick={onSync} 
            disabled={loading || !dateRange.fromDate || !dateRange.toDate}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <RefreshCw className="mr-2 h-4 w-4" />
            Đồng bộ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Config Dialog Component
function ConfigDialog({ open, onClose, config, onSave, loading }: any) {
  const [formData, setFormData] = useState({
    syncMode: config?.syncMode || 'MANUAL',
    cronExpression: config?.cronExpression || '',
    isActive: config?.isActive ?? true,
    defaultDaysBack: config?.defaultDaysBack || 30,
    batchSize: config?.batchSize || 200,
  });

  useEffect(() => {
    if (open && config) {
      setFormData({
        syncMode: config.syncMode || 'MANUAL',
        cronExpression: config.cronExpression || '',
        isActive: config.isActive ?? true,
        defaultDaysBack: config.defaultDaysBack || 30,
        batchSize: config.batchSize || 200,
      });
    }
  }, [open, config]);

  const handleSave = () => {
    onSave(formData);
  };

  const isNewConfig = !config?.id;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isNewConfig ? 'Tạo cấu hình Call Center' : 'Cập nhật cấu hình Call Center'}
          </DialogTitle>
          <DialogDescription>
            {isNewConfig 
              ? 'Thiết lập cấu hình đồng bộ dữ liệu từ PBX lần đầu'
              : 'Cài đặt đồng bộ dữ liệu từ PBX'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
            <div>
              <Label htmlFor="isActive" className="font-semibold">Kích hoạt</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Bật để cho phép đồng bộ dữ liệu Call Center
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => {
                if (!checked && config?.isActive) {
                  // Confirm before deactivating
                  if (window.confirm('Bạn có chắc muốn tắt kích hoạt? Điều này sẽ ngăn tất cả các thao tác đồng bộ.')) {
                    setFormData({ ...formData, isActive: checked });
                  }
                } else {
                  setFormData({ ...formData, isActive: checked });
                }
              }}
            />
          </div>

          {!formData.isActive && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Cấu hình chưa được kích hoạt
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Bạn sẽ không thể đồng bộ dữ liệu cho đến khi bật "Kích hoạt". 
                    Tất cả các nút đồng bộ sẽ bị vô hiệu hóa.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Chế độ đồng bộ</Label>
            <Select 
              value={formData.syncMode} 
              onValueChange={(val) => setFormData({ ...formData, syncMode: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MANUAL">Manual</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled (Cron)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.syncMode === 'SCHEDULED' && (
            <div className="space-y-2">
              <Label>Cron Expression</Label>
              <Input
                placeholder="0 */5 * * * * (Every 5 minutes)"
                value={formData.cronExpression}
                onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Example: "0 */5 * * * *" = Every 5 minutes
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Số ngày lấy dữ liệu</Label>
            <Input
              type="number"
              value={formData.defaultDaysBack}
              onChange={(e) => setFormData({ ...formData, defaultDaysBack: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Batch Size (records/request)</Label>
            <Input
              type="number"
              value={formData.batchSize}
              onChange={(e) => setFormData({ ...formData, batchSize: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isNewConfig ? 'Tạo' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
