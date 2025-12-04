'use client';

import React from 'react';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ListViewStatsProps {
  pending: number;
  inProgress: number;
  completed: number;
}

export function ListViewStats({ pending, inProgress, completed }: ListViewStatsProps) {
  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
        <Clock className="w-3.5 h-3.5" />
        <span className="font-medium">{pending}</span>
        <span className="hidden sm:inline">Chờ xử lý</span>
      </div>
      
      <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full">
        <AlertCircle className="w-3.5 h-3.5" />
        <span className="font-medium">{inProgress}</span>
        <span className="hidden sm:inline">Đang thực hiện</span>
      </div>
      
      <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-2.5 py-1 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="font-medium">{completed}</span>
        <span className="hidden sm:inline">Hoàn thành</span>
      </div>
    </div>
  );
}
