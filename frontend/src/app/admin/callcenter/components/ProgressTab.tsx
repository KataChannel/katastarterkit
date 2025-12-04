/**
 * ProgressTab Component
 * Tab hiển thị tiến độ đồng bộ đang chạy
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Loader2,
  RefreshCw,
  StopCircle,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Plus,
  ArrowUpDown,
  Activity,
  Zap,
} from 'lucide-react';
import type { SyncStats } from '../types';

interface ProgressTabProps {
  syncStats: SyncStats;
  isSyncing: boolean;
  onStopSync: () => void;
  onSync: () => void;
  onRefresh: () => void;
}

export function ProgressTab({
  syncStats,
  isSyncing,
  onStopSync,
  onSync,
  onRefresh,
}: ProgressTabProps) {
  const [pulseEffect, setPulseEffect] = useState(false);

  // Pulse effect when values change
  useEffect(() => {
    if (isSyncing) {
      setPulseEffect(true);
      const timer = setTimeout(() => setPulseEffect(false), 500);
      return () => clearTimeout(timer);
    }
  }, [syncStats.recordsFetched, syncStats.recordsCreated, isSyncing]);

  // Tính tổng records đã xử lý
  const totalProcessed = (syncStats.recordsCreated ?? 0) + (syncStats.recordsUpdated ?? 0) + (syncStats.recordsSkipped ?? 0);
  const totalFetched = syncStats.recordsFetched ?? 0;
  
  // Nếu có page info thì dùng, không thì dùng records
  const hasPageInfo = syncStats.totalPages && syncStats.totalPages > 0;
  const progressPercent = hasPageInfo 
    ? Math.round(((syncStats.currentPage || 0) / syncStats.totalPages!) * 100)
    : (totalFetched > 0 ? Math.min(Math.round((totalProcessed / totalFetched) * 100), 99) : 0);

  return (
    <div className="space-y-3 mt-3">
      <Card className={cn(
        "transition-all duration-300",
        isSyncing && "ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10"
      )}>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              {isSyncing ? (
                <>
                  <div className="relative">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    <div className="absolute inset-0 animate-ping">
                      <Activity className="h-5 w-5 text-blue-500/30" />
                    </div>
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">
                    Đang đồng bộ dữ liệu
                  </span>
                  <Badge variant="secondary" className="animate-pulse bg-blue-100 text-blue-700">
                    <Zap className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Trạng thái đồng bộ
                </>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {isSyncing ? (
                <Button variant="destructive" size="sm" onClick={onStopSync} className="gap-1">
                  <StopCircle className="h-4 w-4" />
                  Dừng
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={onSync} className="gap-1">
                  <Play className="h-4 w-4" />
                  Đồng bộ
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isSyncing ? (
            <div className="space-y-4">
              {/* Progress Bar with Animation */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Tiến độ
                  </span>
                  <span className="font-medium tabular-nums">
                    {totalFetched > 0 ? (
                      <>Đã tải <span className="text-blue-600">{totalFetched}</span> bản ghi ({progressPercent}%)</>
                    ) : (
                      <>Đang kết nối...</>
                    )}
                  </span>
                </div>
                <div className="relative">
                  <Progress value={progressPercent} className="h-3" />
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite] transform -skew-x-12" />
                  </div>
                </div>
              </div>

              {/* Stats Grid with Animation */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className={cn(
                  "transition-all duration-300 hover:shadow-md",
                  pulseEffect && "scale-[1.02]"
                )}>
                  <CardContent className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Download className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Đã tải</p>
                        <p className={cn(
                          "text-xl font-bold text-blue-600 transition-all",
                          pulseEffect && "scale-110"
                        )}>
                          {syncStats.fetched ?? syncStats.recordsFetched ?? 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn(
                  "transition-all duration-300 hover:shadow-md",
                  pulseEffect && "scale-[1.02]"
                )}>
                  <CardContent className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Plus className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Mới tạo</p>
                        <p className={cn(
                          "text-xl font-bold text-green-600 transition-all",
                          pulseEffect && "scale-110"
                        )}>
                          {syncStats.created ?? syncStats.recordsCreated ?? 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn(
                  "transition-all duration-300 hover:shadow-md",
                  pulseEffect && "scale-[1.02]"
                )}>
                  <CardContent className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-yellow-100">
                        <ArrowUpDown className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cập nhật</p>
                        <p className={cn(
                          "text-xl font-bold text-yellow-600 transition-all",
                          pulseEffect && "scale-110"
                        )}>
                          {syncStats.updated ?? syncStats.recordsUpdated ?? 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <XCircle className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bỏ qua</p>
                        <p className="text-xl font-bold text-gray-500">
                          {syncStats.skipped ?? syncStats.recordsSkipped ?? 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Current Status with Animation */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">
                      {syncStats.message || 'Đang xử lý dữ liệu...'}
                    </p>
                    <p className="text-sm text-blue-600">
                      Vui lòng đợi trong giây lát, không đóng trang này
                    </p>
                  </div>
                </div>
              </div>

              {/* Error */}
              {syncStats.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-900">Đã xảy ra lỗi</p>
                      <p className="text-sm text-red-700">{syncStats.error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Sẵn sàng đồng bộ</h3>
              <p className="text-muted-foreground mb-4">
                Nhấn nút &quot;Đồng bộ&quot; để bắt đầu tải dữ liệu cuộc gọi từ tổng đài
              </p>
              
              {/* Last Sync Info */}
              {syncStats.lastSync && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Đồng bộ gần nhất: {syncStats.lastSync}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-muted/50">
        <CardContent className="py-3">
          <h4 className="font-medium text-sm mb-2">💡 Mẹo</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Đồng bộ định kỳ để luôn có dữ liệu mới nhất từ tổng đài</li>
            <li>• Có thể dừng đồng bộ giữa chừng và tiếp tục sau</li>
            <li>• Dữ liệu trùng lặp sẽ được tự động cập nhật</li>
            <li>• Kiểm tra tab &quot;Lịch sử đồng bộ&quot; để xem chi tiết từng lần đồng bộ</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
