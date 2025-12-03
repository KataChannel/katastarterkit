/**
 * ProgressTab Component
 * Tab hiển thị tiến độ đồng bộ đang chạy
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  const getProgressPercentage = () => {
    if (!syncStats.totalPages || syncStats.totalPages === 0) return 0;
    return Math.round(((syncStats.currentPage || 0) / syncStats.totalPages) * 100);
  };

  return (
    <div className="space-y-3 mt-3">
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang đồng bộ dữ liệu
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Trạng thái đồng bộ
                </>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {isSyncing ? (
                <Button variant="destructive" size="sm" onClick={onStopSync}>
                  <StopCircle className="h-4 w-4 mr-1" />
                  Dừng
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={onSync}>
                  <Play className="h-4 w-4 mr-1" />
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
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tiến độ</span>
                  <span>
                    {syncStats.currentPage || 0}/{syncStats.totalPages || 0} trang ({getProgressPercentage()}%)
                  </span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card>
                  <CardContent className="py-3">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Đã tải</p>
                        <p className="text-lg font-bold">{syncStats.fetched ?? syncStats.recordsFetched}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="py-3">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Mới tạo</p>
                        <p className="text-lg font-bold text-green-600">{syncStats.created ?? syncStats.recordsCreated}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="py-3">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Cập nhật</p>
                        <p className="text-lg font-bold text-yellow-600">{syncStats.updated ?? syncStats.recordsUpdated}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="py-3">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Bỏ qua</p>
                        <p className="text-lg font-bold text-gray-500">{syncStats.skipped ?? syncStats.recordsSkipped}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Current Status */}
              {syncStats.message && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>{syncStats.message}</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {syncStats.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2 text-sm text-red-700">
                    <XCircle className="h-4 w-4 mt-0.5" />
                    <span>{syncStats.error}</span>
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
