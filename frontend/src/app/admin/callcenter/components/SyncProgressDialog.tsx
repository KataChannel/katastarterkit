/**
 * SyncProgressDialog Component
 * Dialog hiển thị tiến trình đồng bộ real-time
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Square,
  StopCircle,
} from 'lucide-react';
import { FIND_UNIQUE } from '@/graphql/dynamic/operations';
import { SYNC_POLLING_INTERVAL } from '../constants';
import type { SyncProgressDialogProps, CallCenterSyncLog, SyncStats } from '../types';

export function SyncProgressDialog({
  open,
  onClose,
  syncLogId,
  initialStats,
  onStop,
  stopping,
}: SyncProgressDialogProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState<SyncStats>(
    initialStats || {
      recordsFetched: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
      status: 'running',
    }
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // Query sync log với polling
  const { data: syncLogData, startPolling, stopPolling } = useQuery(FIND_UNIQUE, {
    variables: {
      modelName: 'callCenterSyncLog',
      input: {
        id: syncLogId || '',
      },
    },
    skip: !syncLogId || !open,
    fetchPolicy: 'network-only',
  });

  const syncLog = syncLogData?.findById as CallCenterSyncLog | undefined;

  // Start/Stop polling
  useEffect(() => {
    if (open && syncLogId) {
      startPolling(SYNC_POLLING_INTERVAL);
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
      const newStats: SyncStats = {
        recordsFetched: syncLog.recordsFetched || 0,
        recordsCreated: syncLog.recordsCreated || 0,
        recordsUpdated: syncLog.recordsUpdated || 0,
        recordsSkipped: syncLog.recordsSkipped || 0,
        status: syncLog.status || 'running',
      };

      // Add logs khi có update
      const prevFetched = stats.recordsFetched;
      const fetchDiff = syncLog.recordsFetched - prevFetched;
      if (fetchDiff > 0 && (fetchDiff >= 10 || syncLog.recordsFetched % 50 === 0)) {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] 📥 Đã tải ${syncLog.recordsFetched} records từ PBX API...`,
        ]);
      }

      const createdDiff = syncLog.recordsCreated - stats.recordsCreated;
      if (createdDiff > 0 && (createdDiff >= 10 || syncLog.recordsCreated % 50 === 0)) {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] ✅ Đã tạo mới ${syncLog.recordsCreated} records...`,
        ]);
      }

      const updatedDiff = syncLog.recordsUpdated - stats.recordsUpdated;
      if (updatedDiff > 0 && (updatedDiff >= 5 || syncLog.recordsUpdated % 25 === 0)) {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] 🔄 Đã cập nhật ${syncLog.recordsUpdated} records...`,
        ]);
      }

      if (syncLog.status === 'success' && stats.status !== 'success') {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] ✨ Đồng bộ hoàn thành thành công!`,
          `[${new Date().toLocaleTimeString('vi-VN')}] 📊 Tổng kết: ${syncLog.recordsCreated} tạo mới, ${syncLog.recordsUpdated} cập nhật, ${syncLog.recordsSkipped} bỏ qua`,
        ]);
        stopPolling();
      }

      if (syncLog.status === 'error' && stats.status !== 'error') {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] ❌ Đồng bộ thất bại: ${syncLog.errorMessage || 'Unknown error'}`,
        ]);
        stopPolling();
      }

      if (syncLog.status === 'stopped' && stats.status !== 'stopped') {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString('vi-VN')}] 🛑 Đồng bộ đã bị dừng bởi người dùng`,
          `[${new Date().toLocaleTimeString('vi-VN')}] 📊 Đã xử lý: ${syncLog.recordsCreated} tạo mới, ${syncLog.recordsUpdated} cập nhật, ${syncLog.recordsSkipped} bỏ qua`,
        ]);
        stopPolling();
      }

      setStats(newStats);
    }
  }, [syncLog, stats, stopPolling]);

  const progress =
    stats.recordsFetched > 0
      ? ((stats.recordsCreated + stats.recordsUpdated) / stats.recordsFetched) * 100
      : 0;

  const isCompleted = stats.status === 'success' || stats.status === 'error' || stats.status === 'stopped';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {!isCompleted && <Loader2 className="h-4 w-4 animate-spin" />}
            {stats.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {stats.status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
            {stats.status === 'stopped' && <StopCircle className="h-4 w-4 text-orange-600" />}
            Tiến trình đồng bộ
          </DialogTitle>
          <DialogDescription>
            {stats.status === 'running' && 'Đang đồng bộ dữ liệu từ PBX API...'}
            {stats.status === 'success' && 'Đồng bộ hoàn thành thành công!'}
            {stats.status === 'error' && 'Đồng bộ thất bại!'}
            {stats.status === 'stopped' && 'Đồng bộ đã bị dừng!'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
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

          {/* Stats Grid */}
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

          {/* Logs Terminal */}
          <div className="space-y-2">
            <Label>Logs (Real-time)</Label>
            <ScrollArea ref={scrollRef} className="h-[200px] w-full rounded-md border bg-slate-950 p-4">
              {logs.map((log, i) => (
                <div key={i} className="text-xs text-green-400 font-mono mb-1">
                  {log}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-xs text-gray-500 font-mono">Đang chờ logs...</div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-between">
          {/* Stop button */}
          {!isCompleted && onStop && syncLogId && (
            <Button variant="destructive" onClick={() => onStop(syncLogId)} disabled={stopping}>
              {stopping ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Square className="h-4 w-4 mr-2 fill-current" />
              )}
              Dừng đồng bộ
            </Button>
          )}
          <Button
            onClick={onClose}
            variant={isCompleted ? 'default' : 'outline'}
            className={!isCompleted && onStop ? '' : 'ml-auto'}
          >
            {isCompleted ? 'Đóng' : 'Chạy nền'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
