/**
 * StatsBar Component
 * Thanh thống kê compact hiển thị số liệu tổng hợp
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock } from 'lucide-react';
import { formatTotalDuration, calculateSummary } from '../utils';
import type { CallCenterRecord } from '../types';

interface StatsBarProps {
  records: CallCenterRecord[];
}

export function StatsBar({ records }: StatsBarProps) {
  const summary = calculateSummary(records);

  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tổng:</span>
            <span className="font-semibold">{summary.total}</span>
          </div>

          <div className="flex items-center gap-2">
            <PhoneIncoming className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Gọi đến:</span>
            <span className="font-semibold text-blue-600">{summary.inbound}</span>
          </div>

          <div className="flex items-center gap-2">
            <PhoneOutgoing className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Gọi đi:</span>
            <span className="font-semibold text-green-600">{summary.outbound}</span>
          </div>

          <div className="flex items-center gap-2">
            <PhoneMissed className="h-4 w-4 text-red-500" />
            <span className="text-sm text-muted-foreground">Nhỡ:</span>
            <span className="font-semibold text-red-600">{summary.missed}</span>
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
