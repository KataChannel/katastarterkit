'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ColumnDef, SortDirection, ColumnPinPosition, FilterCondition, RowData } from './types';
import { ColumnFilterPopover } from './ColumnFilterPopover';
import { ChevronUp, ChevronDown, MoreHorizontal, Pin, PinOff, Eye, EyeOff, Maximize2, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColumnHeaderProps<T extends RowData> {
  column: ColumnDef<T>;
  data: T[];
  sortDirection?: SortDirection;
  sortPriority?: number;
  activeFilters: FilterCondition[];
  onSort?: (direction: SortDirection) => void;
  onPin?: (position: ColumnPinPosition) => void;
  onHide?: () => void;
  onAutoSize?: () => void;
  onResize?: (width: number) => void;
  onAddFilter?: (filter: FilterCondition) => void;
  onRemoveFilter?: (field: string) => void;
  onClearColumnFilters?: (field: string) => void;
  width: number;
  isResizing?: boolean;
}

export function ColumnHeader<T extends RowData>({
  column,
  data,
  sortDirection,
  sortPriority,
  activeFilters,
  onSort,
  onPin,
  onHide,
  onAutoSize,
  onResize,
  onAddFilter,
  onRemoveFilter,
  onClearColumnFilters,
  width,
  isResizing
}: ColumnHeaderProps<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleSortClick = () => {
    if (!column.sortable) return;
    
    let newDirection: SortDirection;
    if (sortDirection === 'asc') {
      newDirection = 'desc';
    } else if (sortDirection === 'desc') {
      newDirection = null;
    } else {
      newDirection = 'asc';
    }
    
    onSort?.(newDirection);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!column.resizable) return;
    
    setIsDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const diff = e.clientX - startXRef.current;
      const newWidth = Math.max(50, startWidthRef.current + diff);
      onResize?.(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onResize]);

  const getSortIcon = () => {
    if (!column.sortable) return null;
    
    if (sortDirection === 'asc') {
      return <ChevronUp className="w-4 h-4" />;
    } else if (sortDirection === 'desc') {
      return <ChevronDown className="w-4 h-4" />;
    }
    
    return (
      <div className="flex flex-col opacity-50">
        <ChevronUp className="w-3 h-3 -mb-1" />
        <ChevronDown className="w-3 h-3" />
      </div>
    );
  };

  const getPinIcon = () => {
    if (column.pinned === 'left') return <Pin className="w-4 h-4 rotate-45" />;
    if (column.pinned === 'right') return <Pin className="w-4 h-4 -rotate-45" />;
    return <PinOff className="w-4 h-4" />;
  };

  // Get filter count for this column
  const columnFilterCount = activeFilters.filter(f => f.field === String(column.field)).length;

  return (
    <div
      className={cn(
        'group relative flex items-center h-full px-3 border-r border-gray-200 bg-gray-50 select-none',
        column.headerClass,
        column.pinned === 'left' && 'border-r-2 border-blue-200 bg-blue-50',
        column.pinned === 'right' && 'border-l-2 border-blue-200 bg-blue-50'
      )}
      style={{ width }}
    >
      <div className="flex items-center justify-between w-full min-w-0">
        <div 
          className={cn(
            "flex items-center gap-2 min-w-0 flex-1",
            column.sortable && 'cursor-pointer hover:text-blue-600'
          )}
          onClick={handleSortClick}
        >
          <span className="font-medium text-sm truncate">{column.headerName}</span>
          {sortPriority !== undefined && sortPriority > 0 && (
            <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
              {sortPriority + 1}
            </span>
          )}
          {getSortIcon()}
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          {/* Google Sheets-style Filter Icon */}
          {column.filterable !== false && (
            <ColumnFilterPopover
              column={column}
              data={data}
              activeFilters={activeFilters}
              onAddFilter={onAddFilter!}
              onRemoveFilter={onRemoveFilter!}
              onClearColumnFilters={onClearColumnFilters!}
              sortDirection={sortDirection}
              onSort={onSort}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0",
                  columnFilterCount > 0 
                    ? "opacity-100 text-blue-600 hover:text-blue-700" 
                    : "opacity-0 group-hover:opacity-100 hover:text-blue-600"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <Filter className="w-4 h-4" />
                {columnFilterCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-blue-600 text-white"
                  >
                    {columnFilterCount}
                  </Badge>
                )}
              </Button>
            </ColumnFilterPopover>
          )}
          
          {/* More Options Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {column.sortable && (
                <>
                  <DropdownMenuItem onClick={() => onSort?.('asc')}>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Sort Ascending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSort?.('desc')}>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Sort Descending
                  </DropdownMenuItem>
                  {sortDirection && (
                    <DropdownMenuItem onClick={() => onSort?.(null)}>
                      Clear Sort
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem onClick={() => onPin?.(column.pinned === 'left' ? null : 'left')}>
                <Pin className="w-4 h-4 mr-2 rotate-45" />
                {column.pinned === 'left' ? 'Unpin' : 'Pin Left'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPin?.(column.pinned === 'right' ? null : 'right')}>
                <Pin className="w-4 h-4 mr-2 -rotate-45" />
                {column.pinned === 'right' ? 'Unpin' : 'Pin Right'}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {column.resizable && (
                <>
                  <DropdownMenuItem onClick={onAutoSize}>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Auto Size Column
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem onClick={onHide}>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Resize handle */}
      {column.resizable && (
        <div
          ref={resizeRef}
          className={cn(
            'absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 z-10',
            isDragging && 'bg-blue-500'
          )}
          onMouseDown={handleMouseDown}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}