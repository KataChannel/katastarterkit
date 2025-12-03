/**
 * ConfigDialog Component
 * Dialog cấu hình Call Center
 */

'use client';

import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, XCircle } from 'lucide-react';
import { SYNC_MODE_OPTIONS } from '../constants';
import type { ConfigDialogProps } from '../types';

export function ConfigDialog({ open, onClose, config, onSave, loading }: ConfigDialogProps) {
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isNewConfig ? 'Tạo cấu hình Call Center' : 'Cập nhật cấu hình Call Center'}
          </DialogTitle>
          <DialogDescription>
            {isNewConfig
              ? 'Thiết lập cấu hình đồng bộ dữ liệu từ PBX lần đầu'
              : 'Cài đặt đồng bộ dữ liệu từ PBX'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Active Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
            <div>
              <Label htmlFor="isActive" className="font-semibold">
                Kích hoạt
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Bật để cho phép đồng bộ dữ liệu Call Center
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => {
                if (!checked && config?.isActive) {
                  if (
                    window.confirm(
                      'Bạn có chắc muốn tắt kích hoạt? Điều này sẽ ngăn tất cả các thao tác đồng bộ.'
                    )
                  ) {
                    setFormData({ ...formData, isActive: checked });
                  }
                } else {
                  setFormData({ ...formData, isActive: checked });
                }
              }}
            />
          </div>

          {/* Warning when inactive */}
          {!formData.isActive && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Cấu hình chưa được kích hoạt</p>
                  <p className="text-xs text-red-700 mt-1">
                    Bạn sẽ không thể đồng bộ dữ liệu cho đến khi bật "Kích hoạt". Tất cả các nút đồng
                    bộ sẽ bị vô hiệu hóa.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sync Mode */}
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
                {SYNC_MODE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cron Expression */}
          {formData.syncMode === 'SCHEDULED' && (
            <div className="space-y-2">
              <Label>Cron Expression</Label>
              <Input
                placeholder="0 */5 * * * * (Every 5 minutes)"
                value={formData.cronExpression}
                onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Ví dụ: "0 */5 * * * *" = Mỗi 5 phút
              </p>
            </div>
          )}

          {/* Default Days Back */}
          <div className="space-y-2">
            <Label>Số ngày lấy dữ liệu</Label>
            <Input
              type="number"
              value={formData.defaultDaysBack}
              onChange={(e) =>
                setFormData({ ...formData, defaultDaysBack: parseInt(e.target.value) })
              }
            />
          </div>

          {/* Batch Size */}
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
