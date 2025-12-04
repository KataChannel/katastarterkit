/**
 * StatsBar Component
 * Thanh thống kê compact hiển thị số liệu tổng hợp
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, Loader2 } from 'lucide-react';
import { formatTotalDuration } from '../utils';
import type { CallCenterRecordsStats } from '../types';

interface StatsBarProps {
  stats: CallCenterRecordsStats | null;
  loading?: boolean;
}

export function StatsBar({ stats, loading }: StatsBarProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Đang tải thống kê...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summary = stats || {
    total: 0,
    inbound: 0,
    outbound: 0,
    missed: 0,
    totalDuration: 0,
  };

  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tổng:</span>
            <span className="font-semibold">{summary.total.toLocaleString('vi-VN')}</span>
          </div>

          <div className="flex items-center gap-2">
            <PhoneIncoming className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Gọi đến:</span>
            <span className="font-semibold text-blue-600">{summary.inbound.toLocaleString('vi-VN')}</span>
          </div>

          <div className="flex items-center gap-2">
            <PhoneOutgoing className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Gọi đi:</span>
            <span className="font-semibold text-green-600">{summary.outbound.toLocaleString('vi-VN')}</span>
          </div>

          <div className="flex items-center gap-2">
            <PhoneMissed className="h-4 w-4 text-red-500" />
            <span className="text-sm text-muted-foreground">Nhỡ:</span>
            <span className="font-semibold text-red-600">{summary.missed.toLocaleString('vi-VN')}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-muted-foreground">Tổng thời gian:</span>
            <span className="font-semibold text-purple-600">
              {formatTotalDuration(summary.totalDuration)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
