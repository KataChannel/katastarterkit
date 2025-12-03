/**
 * HeaderSection Component
 * Header của trang Call Center với actions
 */

'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RefreshCw, Settings, Download, Calendar, MoreVertical, Loader2 } from 'lucide-react';

interface HeaderSectionProps {
  onRefresh: () => void;
  onOpenConfig: () => void;
  onOpenDateRange: () => void;
  onExport?: () => void;
  refreshing?: boolean;
}

export function HeaderSection({
  onRefresh,
  onOpenConfig,
  onOpenDateRange,
  onExport,
  refreshing,
}: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Quản lý Call Center</h1>
        <p className="text-muted-foreground text-sm">
          Đồng bộ và quản lý dữ liệu cuộc gọi từ tổng đài
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Refresh Button */}
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing}>
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>

        {/* Sync Date Range */}
        <Button variant="outline" size="sm" onClick={onOpenDateRange}>
          <Calendar className="h-4 w-4 mr-1" />
          Đồng bộ theo ngày
        </Button>

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpenConfig}>
              <Settings className="h-4 w-4 mr-2" />
              Cấu hình API
            </DropdownMenuItem>
            {onExport && (
              <DropdownMenuItem onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Xuất dữ liệu
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
