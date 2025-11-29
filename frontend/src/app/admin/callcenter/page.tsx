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
  User
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
      model: 'callCenterSyncLog',
      where: { id: syncLogId || '' },
    },
    skip: !syncLogId || !open,
    fetchPolicy: 'network-only', // Always fetch from network for real-time
  });

  const syncLog = syncLogData?.findUnique as CallCenterSyncLog | undefined;

  useEffect(() => {
    if (open && syncLogId) {
      // Start với initial message
      setLogs([`[${new Date().toLocaleTimeString('vi-VN')}] Bắt đầu đồng bộ dữ liệu...`]);
    } else {
      setLogs([]);
      setStats({
        recordsFetched: 0,
        recordsCreated: 0,
        recordsUpdated: 0,
        recordsSkipped: 0,
        status: 'running',
      });
    }
  }, [open, syncLogId]);

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

      // Add logs khi có update
      const prevFetched = stats.recordsFetched;
      if (syncLog.recordsFetched > prevFetched) {
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] Đã tải ${syncLog.recordsFetched} records từ PBX API...`
        ]);
      }

      if (syncLog.recordsCreated > stats.recordsCreated) {
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] ✅ Tạo mới ${syncLog.recordsCreated} records...`
        ]);
      }

      if (syncLog.recordsUpdated > stats.recordsUpdated) {
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] 🔄 Cập nhật ${syncLog.recordsUpdated} records...`
        ]);
      }

      if (syncLog.status === 'success' && stats.status !== 'success') {
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] ✨ Đồng bộ hoàn thành thành công!`
        ]);
      }

      if (syncLog.status === 'failed' && stats.status !== 'failed') {
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] ❌ Đồng bộ thất bại: ${syncLog.errorMessage || 'Unknown error'}`
        ]);
      }

      setStats(newStats);
    }
  }, [syncLog]);

  const progress = stats.recordsFetched > 0 
    ? ((stats.recordsCreated + stats.recordsUpdated) / stats.recordsFetched) * 100 
    : 0;

  const isCompleted = stats.status === 'success' || stats.status === 'failed';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {!isCompleted && <Loader2 className="h-4 w-4 animate-spin" />}
            {stats.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {stats.status === 'failed' && <XCircle className="h-4 w-4 text-red-600" />}
            Tiến trình đồng bộ
          </DialogTitle>
          <DialogDescription>
            {stats.status === 'running' && 'Đang đồng bộ dữ liệu từ PBX API...'}
            {stats.status === 'success' && 'Đồng bộ hoàn thành thành công!'}
            {stats.status === 'failed' && 'Đồng bộ thất bại!'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{stats.recordsFetched}</div>
              <div className="text-xs text-blue-600">Đã tải từ API</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{stats.recordsCreated}</div>
              <div className="text-xs text-green-600">Tạo mới</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">{stats.recordsUpdated}</div>
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

  // Calculate call duration summary by caller
  const calculateSummary = () => {
    if (!records?.items || records.items.length === 0) return [];

    const summaryMap = new Map<string, {
      callerNumber: string;
      totalCalls: number;
      totalDuration: number;
      totalBillsec: number;
      answeredCalls: number;
      missedCalls: number;
    }>();

    records.items.forEach((record: CallCenterRecord) => {
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Call Center</h1>
          <p className="text-muted-foreground">Quản lý dữ liệu cuộc gọi từ PBX</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowConfigDialog(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Cấu hình
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDateRangeDialog(true)} 
                    disabled={!config?.isActive}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Chọn ngày sync
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
                    onClick={handleManualSync} 
                    disabled={syncing || !config?.isActive}
                  >
                    {syncing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
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
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Chưa kích hoạt
            </CardTitle>
            <CardDescription className="text-orange-700">
              Call Center chưa được kích hoạt. Vui lòng bật trong phần cấu hình để sử dụng tính năng đồng bộ.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Stats Cards */}
      {config && config.isActive && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Records</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{config.totalRecordsSynced || 0}</div>
              <p className="text-xs text-muted-foreground">Đã đồng bộ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sync Mode</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{config.syncMode}</div>
              <p className="text-xs text-muted-foreground">
                {config.isActive ? 'Active' : 'Inactive'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {config.lastSyncAt 
                  ? formatDistanceToNow(new Date(config.lastSyncAt), { addSuffix: true, locale: vi })
                  : 'Chưa sync'
                }
              </div>
              <p className="text-xs text-muted-foreground">{config.lastSyncStatus}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Batch Size</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{config.batchSize}</div>
              <p className="text-xs text-muted-foreground">records/request</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="records">Call Records</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>

        {/* Call Records Tab - ADVANCED TABLE */}
        <TabsContent value="records" className="space-y-4">
          {/* Call Duration Summary - Collapsible */}
          <Collapsible open={showSummary} onOpenChange={setShowSummary}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <CardTitle>Tổng hợp thời lượng cuộc gọi</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {callSummary.length} số điện thoại
                      </Badge>
                      <ChevronDown 
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          showSummary ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                  <CardDescription>
                    Thống kê theo số điện thoại gọi đi (mặc định ẩn)
                  </CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  {recordsLoading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : callSummary.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                      Không có dữ liệu để hiển thị
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
                        <div className="text-center">Nhớ máy</div>
                        <div className="text-center">Tổng thời lượng</div>
                        <div className="text-center">Thời gian nói</div>
                      </div>

                      {/* Summary Items */}
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-2">
                          {callSummary.map((summary, index) => (
                            <div
                              key={summary.callerNumber}
                              className="grid grid-cols-6 gap-2 p-3 border rounded-md hover:bg-accent/50 transition-colors"
                            >
                              <div className="font-mono font-semibold text-sm flex items-center">
                                <span className="text-muted-foreground mr-2">#{index + 1}</span>
                                {summary.callerNumber}
                              </div>
                              <div className="text-center">
                                <Badge variant="outline">{summary.totalCalls}</Badge>
                              </div>
                              <div className="text-center">
                                <Badge variant="default" className="bg-green-600">
                                  {summary.answeredCalls}
                                </Badge>
                              </div>
                              <div className="text-center">
                                <Badge variant="secondary">
                                  {summary.missedCalls}
                                </Badge>
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
                      <div className="grid grid-cols-6 gap-2 p-3 bg-primary/10 rounded-md font-bold border-2 border-primary/20">
                        <div>TỔNG CỘNG</div>
                        <div className="text-center">
                          {callSummary.reduce((sum, s) => sum + s.totalCalls, 0)}
                        </div>
                        <div className="text-center text-green-600">
                          {callSummary.reduce((sum, s) => sum + s.answeredCalls, 0)}
                        </div>
                        <div className="text-center">
                          {callSummary.reduce((sum, s) => sum + s.missedCalls, 0)}
                        </div>
                        <div className="text-center text-primary">
                          {formatDuration(
                            callSummary.reduce((sum, s) => sum + s.totalDuration, 0).toString()
                          )}
                        </div>
                        <div className="text-center text-green-600">
                          {formatDuration(
                            callSummary.reduce((sum, s) => sum + s.totalBillsec, 0).toString()
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách cuộc gọi</CardTitle>
              <CardDescription>
                Hiển thị {records?.pagination.totalItems || 0} cuộc gọi
              </CardDescription>
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
                  height={600}
                />
              )}
            </CardContent>
          </Card>

          {/* Custom Pagination (outside AdvancedTable) */}
          {records?.pagination && (
            <div className="flex items-center justify-between px-4">
              <div className="text-sm text-muted-foreground">
                Trang {records.pagination.currentPage} / {records.pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={!records.pagination.hasPreviousPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={!records.pagination.hasNextPage}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Sync Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử đồng bộ</CardTitle>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {logs?.map((log: CallCenterSyncLog) => (
                    <Card key={log.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="font-semibold">{log.syncType}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(log.startedAt), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
                            </div>
                          </div>
                          <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                            {log.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
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
                          <div className="mt-2 text-xs text-muted-foreground">
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
