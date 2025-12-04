/**
 * SyncLogsTab Component
 * Tab hiển thị lịch sử đồng bộ
 */

'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Calendar, Clock, Download, Plus, ArrowUpDown, XCircle, StopCircle } from 'lucide-react';
import { SYNC_STATUS_VARIANTS } from '../constants';
import type { CallCenterSyncLog } from '../types';

interface SyncLogsTabProps {
  logs: CallCenterSyncLog[];
  loading: boolean;
  onRefresh: () => void;
  onStopSync?: (syncLogId: string) => void;
  stoppingSyncId?: string | null;
}

export function SyncLogsTab({ logs, loading, onRefresh, onStopSync, stoppingSyncId }: SyncLogsTabProps) {
  const getStatusBadge = (status: string) => {
    const config = SYNC_STATUS_VARIANTS[status] || {
      variant: 'outline' as const,
      label: status,
    };
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-3 mt-3">
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Lịch sử đồng bộ</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onRefresh()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">Chưa có lịch sử đồng bộ</div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <Card key={log.id} className={log.status === 'running' ? 'ring-2 ring-blue-500/30' : ''}>
                  <CardContent className="py-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(log.status)}
                        <Badge variant="outline">{log.syncType}</Badge>
                        {log.status === 'running' && (
                          <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Nút dừng cho sync đang chạy */}
                        {log.status === 'running' && onStopSync && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => onStopSync(log.id)}
                            disabled={stoppingSyncId === log.id}
                            className="h-7 px-2 text-xs"
                          >
                            {stoppingSyncId === log.id ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <StopCircle className="h-3 w-3 mr-1" />
                            )}
                            Dừng
                          </Button>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {log.startedAt &&
                            formatDistanceToNow(new Date(log.startedAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                        </span>
                      </div>
                    </div>

                    {/* Date Range */}
                    {(log.fromDate || log.toDate) && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {log.fromDate &&
                            format(new Date(log.fromDate), 'dd/MM/yyyy', { locale: vi })}
                          {' → '}
                          {log.toDate &&
                            format(new Date(log.toDate), 'dd/MM/yyyy', { locale: vi })}
                        </span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-blue-500" />
                        <span>{log.recordsFetched} tải</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Plus className="h-3 w-3 text-green-500" />
                        <span>{log.recordsCreated} mới</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUpDown className="h-3 w-3 text-yellow-500" />
                        <span>{log.recordsUpdated} cập nhật</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-gray-400" />
                        <span>{log.recordsSkipped} bỏ qua</span>
                      </div>
                    </div>

                    {/* Duration */}
                    {log.duration && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{(log.duration / 1000).toFixed(1)}s</span>
                      </div>
                    )}

                    {/* Error Message */}
                    {log.errorMessage && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                        ❌ {log.errorMessage}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
