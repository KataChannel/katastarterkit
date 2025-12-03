/**
 * DateRangeDialog Component
 * Dialog chọn khoảng ngày để đồng bộ
 */

'use client';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, RefreshCw } from 'lucide-react';
import { DATE_RANGE_QUICK_SELECTS } from '../constants';
import type { DateRangeDialogProps } from '../types';

export function DateRangeDialog({
  open,
  onClose,
  dateRange,
  setDateRange,
  onSync,
  loading,
}: DateRangeDialogProps) {
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chọn khoảng thời gian đồng bộ</DialogTitle>
          <DialogDescription>Chọn khoảng ngày để lấy dữ liệu cuộc gọi từ PBX</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Quick Select */}
          <div className="space-y-2">
            <Label>Chọn nhanh</Label>
            <div className="flex flex-wrap gap-2">
              {DATE_RANGE_QUICK_SELECTS.map((item) => (
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

          {/* Date Inputs */}
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

          {/* Preview */}
          {dateRange.fromDate && dateRange.toDate && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                Sẽ đồng bộ dữ liệu từ{' '}
                {format(new Date(dateRange.fromDate), 'dd/MM/yyyy', { locale: vi })} đến{' '}
                {format(new Date(dateRange.toDate), 'dd/MM/yyyy', { locale: vi })}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()}>
            Hủy
          </Button>
          <Button onClick={() => onSync()} disabled={loading || !dateRange.fromDate || !dateRange.toDate}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <RefreshCw className="mr-2 h-4 w-4" />
            Đồng bộ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
