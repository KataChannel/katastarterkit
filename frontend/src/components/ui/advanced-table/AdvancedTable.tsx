'use client';

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AdvancedTableProps, RowData, ColumnDef, SortConfig, FilterCondition, ColumnPinPosition } from './types';
import { TableUtils } from './utils';
import { FilterBar } from './FilterBar';
import { ColumnHeader } from './ColumnHeader';
import { TableCell } from './TableCell';
import { 
  Download, 
  Plus, 
  Trash2, 
  Settings, 
  RotateCcw,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Maximize
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Google Sheets inspired styles
const GOOGLE_SHEETS_STYLES = {
  headerBg: 'bg-gray-50',
  headerBorder: 'border-b-2 border-gray-300',
  cellBorder: 'border-r border-b border-gray-200',
  cellHover: 'hover:bg-blue-50/30',
  selectedCell: 'bg-blue-50 border-blue-400',
  frozenColumn: 'shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]',
  gridLine: 'border-gray-200',
  compactPadding: 'px-2 py-1.5',
  fontSize: 'text-sm',
};

export function AdvancedTable<T extends RowData>({
  columns: initialColumns,
  data,
  config = {},
  loading = false,
  onRowSelect,
  onRowEdit,
  onRowCreate,
  onRowDelete,
  onSort,
  onFilter,
  onGlobalSearchChange,
  disableClientSideSearch = false,
  className,
  height = 600
}: AdvancedTableProps<T>) {
  // State management
  const [columns, setColumns] = useState<ColumnDef<T>[]>(initialColumns);
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [editingCell, setEditingCell] = useState<{ rowId: string | number; field: keyof T } | null>(null);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Configuration defaults
  const {
    enableSorting = true,
    enableFiltering = true,
    enableColumnPinning = true,
    enableColumnResizing = true,
    enableColumnHiding = true,
    enableRowSelection = true,
    enableInlineEditing = true,
    enableDialogEditing = false,
    enableRowDeletion = true,
    rowHeight = 40,
    headerHeight = 40,
    showToolbar = true,
    showPagination = false,
    pageSize = 50,
    virtualScrolling = false
  } = config;

  // Initialize column widths
  useEffect(() => {
    const initialWidths: Record<string, number> = {};
    columns.forEach(col => {
      const key = String(col.field);
      initialWidths[key] = col.width || 150;
    });
    setColumnWidths(initialWidths);
  }, [columns]);

  // Process data based on filters and sorting
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply global search (chỉ khi không dùng server-side search)
    if (globalSearch && !disableClientSideSearch) {
      result = TableUtils.globalSearch(result, globalSearch, columns);
    }

    // Apply filters (chỉ khi không có onFilter callback - server-side)
    if (filters.length > 0 && !onFilter) {
      result = TableUtils.applyFiltering(result, filters);
    }

    // Apply sorting (chỉ khi không có onSort callback - server-side)
    if (sortConfigs.length > 0 && !onSort) {
      result = TableUtils.applySorting(result, sortConfigs);
    }

    return result;
  }, [data, globalSearch, filters, sortConfigs, columns, disableClientSideSearch, onFilter, onSort]);

  // Notify parent of global search changes (for server-side search)
  useEffect(() => {
    if (onGlobalSearchChange) {
      const timeoutId = setTimeout(() => {
        onGlobalSearchChange(globalSearch);
      }, 300); // Debounce 300ms để tránh gọi quá nhiều

      return () => clearTimeout(timeoutId);
    }
  }, [globalSearch, onGlobalSearchChange]);

  // Notify parent of selection changes (outside render cycle)
  useEffect(() => {
    if (onRowSelect) {
      // Defer to next tick to avoid setState during render warning
      const timeoutId = setTimeout(() => {
        const selectedRowData = processedData.filter(row => selectedRows.has(row.id));
        onRowSelect(selectedRowData);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedRows, processedData, onRowSelect]);

  // Notify parent of sort changes (outside render cycle)
  useEffect(() => {
    if (onSort && sortConfigs.length >= 0) {
      const timeoutId = setTimeout(() => {
        onSort(sortConfigs);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [sortConfigs, onSort]);

  // Notify parent of filter changes (outside render cycle)
  useEffect(() => {
    if (onFilter) {
      const timeoutId = setTimeout(() => {
        onFilter(filters);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [filters, onFilter]);

  // Column management
  const visibleColumns = useMemo(() => TableUtils.getVisibleColumns(columns), [columns]);
  const pinnedLeftColumns = useMemo(() => TableUtils.getPinnedColumns(columns, 'left'), [columns]);
  const pinnedRightColumns = useMemo(() => TableUtils.getPinnedColumns(columns, 'right'), [columns]);
  const centerColumns = useMemo(() => TableUtils.getCenterColumns(columns), [columns]);

  // Event handlers
  const handleSort = useCallback((field: keyof T, direction: SortConfig['direction']) => {
    setSortConfigs(prev => {
      let newSortConfigs: SortConfig[];
      
      if (direction === null) {
        newSortConfigs = prev.filter(config => config.field !== field);
      } else {
        const existingIndex = prev.findIndex(config => config.field === field);
        if (existingIndex >= 0) {
          newSortConfigs = [...prev];
          newSortConfigs[existingIndex] = { ...newSortConfigs[existingIndex], direction };
        } else {
          newSortConfigs = [...prev, { field: String(field), direction, priority: prev.length }];
        }
      }
      
      return newSortConfigs;
    });
  }, []);

  const handleColumnPin = useCallback((field: keyof T, position: ColumnPinPosition) => {
    setColumns(prev => prev.map(col => 
      col.field === field ? { ...col, pinned: position } : col
    ));
  }, []);

  const handleColumnHide = useCallback((field: keyof T) => {
    setColumns(prev => prev.map(col => 
      col.field === field ? { ...col, hide: true } : col
    ));
  }, []);

  const handleColumnResize = useCallback((field: keyof T, width: number) => {
    setColumnWidths(prev => ({ ...prev, [String(field)]: width }));
  }, []);

  const handleAutoSizeColumn = useCallback((field: keyof T) => {
    // Calculate width based on actual content in data
    const column = columns.find(col => col.field === field);
    if (!column) return;
    
    // Start with header width
    const headerText = column.headerName || String(field);
    let maxWidth = headerText.length * 9 + 60; // header text + padding + sort/filter icons
    
    // Check all data values
    processedData.forEach(row => {
      const value = row[field];
      let textLength = 0;
      
      if (value === null || value === undefined) {
        textLength = 1;
      } else if (typeof value === 'object') {
        // Handle objects like category: { name: 'xxx' }
        const displayValue = (value as any)?.name || (value as any)?.title || JSON.stringify(value);
        textLength = String(displayValue).length;
      } else if (typeof value === 'number') {
        // Format numbers
        textLength = new Intl.NumberFormat('vi-VN').format(value).length;
      } else {
        textLength = String(value).length;
      }
      
      const cellWidth = textLength * 8 + 24; // 8px per char + padding
      maxWidth = Math.max(maxWidth, cellWidth);
    });
    
    // Apply min/max constraints
    const finalWidth = Math.max(80, Math.min(500, maxWidth));
    handleColumnResize(field, finalWidth);
  }, [handleColumnResize, columns, processedData]);

  const handleAutoSizeAllColumns = useCallback(() => {
    visibleColumns.forEach(col => {
      handleAutoSizeColumn(col.field);
    });
  }, [visibleColumns, handleAutoSizeColumn]);

  const handleRowSelect = useCallback((rowId: string | number, selected: boolean) => {
    setSelectedRows(prev => {
      const newSelection = new Set(prev);
      if (selected) {
        newSelection.add(rowId);
      } else {
        newSelection.delete(rowId);
      }
      return newSelection;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      const allIds = new Set(processedData.map(row => row.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  }, [processedData]);

  const handleCellEdit = useCallback(async (rowId: string | number, field: keyof T, newValue: any) => {
    const row = processedData.find(r => r.id === rowId);
    if (!row) return false;

    const success = await onRowEdit?.(row, field, newValue);
    if (success) {
      setEditingCell(null);
    }
    return success || false;
  }, [processedData, onRowEdit]);

  const handleDeleteSelected = useCallback(async () => {
    const rowsToDelete = processedData.filter(row => selectedRows.has(row.id));
    const success = await onRowDelete?.(rowsToDelete);
    if (success) {
      setSelectedRows(new Set());
      setShowDeleteDialog(false);
    }
  }, [processedData, selectedRows, onRowDelete]);

  const handleExport = useCallback(() => {
    TableUtils.exportToCsv(processedData, visibleColumns, 'export.csv');
  }, [processedData, visibleColumns]);

  const handleFiltersChange = useCallback((newFilters: FilterCondition[]) => {
    setFilters(newFilters);
  }, []);

  const handleAddFilter = useCallback((filter: FilterCondition) => {
    setFilters(prev => [...prev, filter]);
  }, []);

  const handleRemoveFilter = useCallback((field: string) => {
    setFilters(prev => prev.filter(f => f.field !== field));
  }, []);

  const handleClearColumnFilters = useCallback((field: string) => {
    setFilters(prev => prev.filter(f => f.field !== field));
  }, []);

  const getSortConfig = useCallback((field: keyof T) => {
    return sortConfigs.find(config => config.field === field);
  }, [sortConfigs]);

  const renderColumnGroup = useCallback((cols: ColumnDef<T>[], isPinned: boolean = false) => {
    return cols.map(column => {
      const sortConfig = getSortConfig(column.field);
      const width = columnWidths[String(column.field)] || column.width || 150;
      
      return (
        <div key={String(column.field)} className="flex flex-col">
          <div style={{ height: headerHeight }}>
            <ColumnHeader
              column={column}
              data={processedData}
              activeFilters={filters}
              sortDirection={sortConfig?.direction}
              sortPriority={sortConfig?.priority}
              onSort={(direction) => handleSort(column.field, direction)}
              onAddFilter={handleAddFilter}
              onRemoveFilter={handleRemoveFilter}
              onClearColumnFilters={handleClearColumnFilters}
              onPin={(position) => handleColumnPin(column.field, position)}
              onHide={() => handleColumnHide(column.field)}
              onAutoSize={() => handleAutoSizeColumn(column.field)}
              onResize={(newWidth) => handleColumnResize(column.field, newWidth)}
              width={width}
            />
          </div>
          
          {processedData.map((row, rowIndex) => {
            const value = column.valueGetter ? column.valueGetter(row) : row[column.field];
            const isEditing = editingCell?.rowId === row.id && editingCell?.field === column.field;
            const isSelected = selectedRows.has(row.id);
            
            return (
              <div key={`${row.id}-${String(column.field)}`} style={{ height: rowHeight }}>
                <TableCell
                  column={column}
                  data={row}
                  value={value}
                  rowIndex={rowIndex}
                  isEditing={isEditing}
                  isSelected={isSelected}
                  onStartEdit={() => setEditingCell({ rowId: row.id, field: column.field })}
                  onSave={(newValue) => handleCellEdit(row.id, column.field, newValue)}
                  onCancel={() => setEditingCell(null)}
                />
              </div>
            );
          })}
        </div>
      );
    });
  }, [processedData, sortConfigs, columnWidths, headerHeight, rowHeight, editingCell, selectedRows, filters,
      getSortConfig, handleSort, handleColumnPin, handleColumnHide, handleAutoSizeColumn, 
      handleColumnResize, handleCellEdit, handleAddFilter, handleRemoveFilter, handleClearColumnFilters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      'border rounded-lg overflow-hidden bg-white',
      isFullscreen && 'fixed inset-0 z-50 rounded-none',
      className
    )}>
      {/* Combined Toolbar + Filter Bar - Single Row */}
      {(showToolbar || enableFiltering) && (
        <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
          {/* Left: Search + Filter + Selection Actions */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Global Search */}
            {enableFiltering && (
              <Input
                placeholder="Tìm kiếm..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="h-8 w-40 sm:w-52 text-sm"
              />
            )}
            
            {/* Add Filter */}
            {enableFiltering && (
              <FilterBar
                columns={columns}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                globalSearch={globalSearch}
                onGlobalSearchChange={setGlobalSearch}
                compact={true}
              />
            )}
            
            {/* Selection Actions */}
            {enableRowSelection && selectedRows.size > 0 && (
              <>
                <div className="h-4 w-px bg-gray-300 mx-1 hidden sm:block" />
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  {selectedRows.size} selected
                </Badge>
                {enableRowDeletion && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                    className="h-8 px-2 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </>
            )}
            {onRowCreate && (
              <Button size="sm" onClick={() => onRowCreate({} as Partial<T>)} className="h-8 px-2 text-xs">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          
          {/* Right: Tools */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={handleExport} className="h-8 px-2 text-xs">
              <Download className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleAutoSizeAllColumns} className="h-8 px-2 text-xs">
              <Maximize2 className="w-3.5 h-3.5 mr-1" />
              <span className="hidden md:inline">Auto Size</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnSettings(true)}
              className="h-8 px-2 text-xs"
            >
              <Settings className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Columns</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 px-2 text-xs"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Google Sheets Style Table - Full Width with Fixed Header + Frozen Columns */}
      <div 
        className="relative overflow-auto flex-1"
        style={{ 
          height: isFullscreen 
            ? `calc(100vh - 48px)` 
            : height - 48
        }}
      >
        {/* Sticky Header Container - Full Width */}
        <div className="w-full min-w-full sticky top-0 z-20 flex bg-white">
          {/* Selection Column Header - Frozen */}
          {enableRowSelection && (
            <div 
              className={cn(
                "sticky left-0 z-30 flex items-center justify-center flex-shrink-0",
                GOOGLE_SHEETS_STYLES.headerBg,
                GOOGLE_SHEETS_STYLES.headerBorder,
                GOOGLE_SHEETS_STYLES.cellBorder,
                GOOGLE_SHEETS_STYLES.compactPadding,
                "w-12"
              )}
              style={{ height: headerHeight }}
            >
              <Checkbox
                checked={selectedRows.size === processedData.length && processedData.length > 0}
                indeterminate={selectedRows.size > 0 && selectedRows.size < processedData.length}
                onCheckedChange={handleSelectAll}
              />
            </div>
          )}

          {/* Column Headers - Dynamic Width Distribution */}
          {visibleColumns.map((column, index) => {
            const sortConfig = getSortConfig(column.field);
            const baseWidth = columnWidths[String(column.field)] || column.width || 150;
            const isPinnedLeft = column.pinned === 'left';
            const isPinnedRight = column.pinned === 'right';
            const isLastColumn = index === visibleColumns.length - 1;
            
            return (
              <div
                key={String(column.field)}
                className={cn(
                  GOOGLE_SHEETS_STYLES.headerBg,
                  GOOGLE_SHEETS_STYLES.headerBorder,
                  GOOGLE_SHEETS_STYLES.cellBorder,
                  "relative flex-shrink-0",
                  isPinnedLeft && "sticky z-30 bg-white",
                  isPinnedRight && "sticky right-0 z-30 bg-white shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]",
                  isPinnedLeft && !isPinnedRight && GOOGLE_SHEETS_STYLES.frozenColumn,
                  isLastColumn && !isPinnedRight && "flex-grow" // Last column grows to fill remaining space (unless pinned right)
                )}
                style={{ 
                  width: (isLastColumn && !isPinnedRight) ? 'auto' : baseWidth,
                  minWidth: baseWidth,
                  height: headerHeight,
                  left: isPinnedLeft ? (enableRowSelection ? 48 : 0) : 'auto',
                  right: isPinnedRight ? 0 : 'auto'
                }}
              >
                <ColumnHeader
                  column={column}
                  data={processedData}
                  activeFilters={filters}
                  sortDirection={sortConfig?.direction}
                  sortPriority={sortConfig?.priority}
                  onSort={(direction) => handleSort(column.field, direction)}
                  onAddFilter={handleAddFilter}
                  onRemoveFilter={handleRemoveFilter}
                  onClearColumnFilters={handleClearColumnFilters}
                  onPin={(position) => handleColumnPin(column.field, position)}
                  onHide={() => handleColumnHide(column.field)}
                  onAutoSize={() => handleAutoSizeColumn(column.field)}
                  onResize={(newWidth) => handleColumnResize(column.field, newWidth)}
                  width={baseWidth}
                />
              </div>
            );
          })}
        </div>

        {/* Table Body - Full Width Rows */}
        <div className="relative w-full">
          {processedData.map((row, rowIndex) => (
            <div key={row.id} className="w-full min-w-full flex hover:bg-gray-50/50">
              {/* Selection Cell - Frozen */}
              {enableRowSelection && (
                <div
                  className={cn(
                    "sticky left-0 z-10 flex items-center justify-center bg-white flex-shrink-0",
                    GOOGLE_SHEETS_STYLES.cellBorder,
                    GOOGLE_SHEETS_STYLES.compactPadding,
                    GOOGLE_SHEETS_STYLES.cellHover,
                    "w-12",
                    selectedRows.has(row.id) && GOOGLE_SHEETS_STYLES.selectedCell
                  )}
                  style={{ height: rowHeight }}
                >
                  <Checkbox
                    checked={selectedRows.has(row.id)}
                    onCheckedChange={(checked) => handleRowSelect(row.id, checked as boolean)}
                  />
                </div>
              )}

              {/* Data Cells - Dynamic Width Distribution */}
              {visibleColumns.map((column, colIndex) => {
                const value = column.valueGetter ? column.valueGetter(row) : row[column.field];
                const isEditing = editingCell?.rowId === row.id && editingCell?.field === column.field;
                const isSelected = selectedRows.has(row.id);
                const baseWidth = columnWidths[String(column.field)] || column.width || 150;
                const isPinnedLeft = column.pinned === 'left';
                const isPinnedRight = column.pinned === 'right';
                const isLastColumn = colIndex === visibleColumns.length - 1;

                return (
                  <div
                    key={String(column.field)}
                    className={cn(
                      GOOGLE_SHEETS_STYLES.cellBorder,
                      GOOGLE_SHEETS_STYLES.compactPadding,
                      GOOGLE_SHEETS_STYLES.fontSize,
                      GOOGLE_SHEETS_STYLES.cellHover,
                      "bg-white flex-shrink-0",
                      isPinnedLeft && "sticky z-10",
                      isPinnedRight && "sticky right-0 z-10 bg-white shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]",
                      isPinnedLeft && !isPinnedRight && GOOGLE_SHEETS_STYLES.frozenColumn,
                      isSelected && GOOGLE_SHEETS_STYLES.selectedCell,
                      isLastColumn && !isPinnedRight && "flex-grow" // Last column grows to fill space (unless pinned right)
                    )}
                    style={{ 
                      width: (isLastColumn && !isPinnedRight) ? 'auto' : baseWidth,
                      minWidth: baseWidth,
                      height: rowHeight,
                      left: isPinnedLeft ? (enableRowSelection ? 48 : 0) : 'auto',
                      right: isPinnedRight ? 0 : 'auto'
                    }}
                  >
                    <TableCell
                      column={column}
                      data={row}
                      value={value}
                      rowIndex={rowIndex}
                      isEditing={isEditing}
                      isSelected={isSelected}
                      onStartEdit={() => setEditingCell({ rowId: row.id, field: column.field })}
                      onSave={(newValue) => handleCellEdit(row.id, column.field, newValue)}
                      onCancel={() => setEditingCell(null)}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {selectedRows.size} row(s)? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelected}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Column Settings Dialog - Responsive */}
      <Dialog open={showColumnSettings} onOpenChange={setShowColumnSettings}>
        <DialogContent className="max-w-md w-[95vw] sm:w-full max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Column Settings</DialogTitle>
          </DialogHeader>
          
          {/* Select All / Deselect All - Responsive */}
          <div className="flex items-center gap-2 pb-2 border-b flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setColumns(prev => prev.map(col => ({ ...col, hide: false })));
              }}
              className="text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Show All</span>
              <span className="sm:hidden">All</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setColumns(prev => prev.map(col => ({ ...col, hide: true })));
              }}
              className="text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Hide All</span>
              <span className="sm:hidden">None</span>
            </Button>
          </div>
          
          <div className="space-y-2 overflow-auto flex-1 pr-2">
            {columns.map(column => (
              <div key={String(column.field)} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Checkbox
                    checked={!column.hide}
                    onCheckedChange={(checked) => {
                      setColumns(prev => prev.map(col => 
                        col.field === column.field ? { ...col, hide: !checked } : col
                      ));
                    }}
                  />
                  <span className="text-xs sm:text-sm truncate">{column.headerName}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  {column.pinned === 'left' && <Badge variant="outline" className="text-[10px] sm:text-xs">Left</Badge>}
                  {column.pinned === 'right' && <Badge variant="outline" className="text-[10px] sm:text-xs">Right</Badge>}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="flex-shrink-0 flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setColumns(initialColumns);
                setShowColumnSettings(false);
              }}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Reset
            </Button>
            <Button onClick={() => setShowColumnSettings(false)} className="w-full sm:w-auto text-xs sm:text-sm">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}