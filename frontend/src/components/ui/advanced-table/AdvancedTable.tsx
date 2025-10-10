'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
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
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

    // Apply global search
    if (globalSearch) {
      result = TableUtils.globalSearch(result, globalSearch, columns);
    }

    // Apply filters
    if (filters.length > 0) {
      result = TableUtils.applyFiltering(result, filters);
    }

    // Apply sorting
    if (sortConfigs.length > 0) {
      result = TableUtils.applySorting(result, sortConfigs);
    }

    return result;
  }, [data, globalSearch, filters, sortConfigs, columns]);

  // Column management
  const visibleColumns = useMemo(() => TableUtils.getVisibleColumns(columns), [columns]);
  const pinnedLeftColumns = useMemo(() => TableUtils.getPinnedColumns(columns, 'left'), [columns]);
  const pinnedRightColumns = useMemo(() => TableUtils.getPinnedColumns(columns, 'right'), [columns]);
  const centerColumns = useMemo(() => TableUtils.getCenterColumns(columns), [columns]);

  // Event handlers
  const handleSort = useCallback((field: keyof T, direction: SortConfig['direction']) => {
    let newSortConfigs: SortConfig[];
    
    if (direction === null) {
      newSortConfigs = sortConfigs.filter(config => config.field !== field);
    } else {
      const existingIndex = sortConfigs.findIndex(config => config.field === field);
      if (existingIndex >= 0) {
        newSortConfigs = [...sortConfigs];
        newSortConfigs[existingIndex] = { ...newSortConfigs[existingIndex], direction };
      } else {
        newSortConfigs = [...sortConfigs, { field: String(field), direction, priority: sortConfigs.length }];
      }
    }
    
    setSortConfigs(newSortConfigs);
    onSort?.(newSortConfigs);
  }, [sortConfigs, onSort]);

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
    // Simple auto-sizing logic - in a real implementation, you'd measure content
    const newWidth = Math.max(100, Math.min(300, String(field).length * 10 + 80));
    handleColumnResize(field, newWidth);
  }, [handleColumnResize]);

  const handleAutoSizeAllColumns = useCallback(() => {
    visibleColumns.forEach(col => {
      handleAutoSizeColumn(col.field);
    });
  }, [visibleColumns, handleAutoSizeColumn]);

  const handleRowSelect = useCallback((rowId: string | number, selected: boolean) => {
    const newSelection = new Set(selectedRows);
    if (selected) {
      newSelection.add(rowId);
    } else {
      newSelection.delete(rowId);
    }
    setSelectedRows(newSelection);
    
    const selectedRowData = processedData.filter(row => newSelection.has(row.id));
    onRowSelect?.(selectedRowData);
  }, [selectedRows, processedData, onRowSelect]);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      const allIds = new Set(processedData.map(row => row.id));
      setSelectedRows(allIds);
      onRowSelect?.(processedData);
    } else {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    }
  }, [processedData, onRowSelect]);

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

  const getSortConfig = (field: keyof T) => {
    return sortConfigs.find(config => config.field === field);
  };

  const renderColumnGroup = (cols: ColumnDef<T>[], isPinned: boolean = false) => {
    return cols.map(column => {
      const sortConfig = getSortConfig(column.field);
      const width = columnWidths[String(column.field)] || column.width || 150;
      
      return (
        <div key={String(column.field)} className="flex flex-col">
          <div style={{ height: headerHeight }}>
            <ColumnHeader
              column={column}
              sortDirection={sortConfig?.direction}
              sortPriority={sortConfig?.priority}
              onSort={(direction) => handleSort(column.field, direction)}
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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden bg-white', className)}>
      {/* Toolbar - Responsive */}
      {showToolbar && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2 flex-wrap">
            {enableRowSelection && selectedRows.size > 0 && (
              <>
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {selectedRows.size} selected
                </Badge>
                {enableRowDeletion && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-xs sm:text-sm"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Del</span>
                  </Button>
                )}
              </>
            )}
            {onRowCreate && (
              <Button size="sm" onClick={() => onRowCreate({} as Partial<T>)} className="text-xs sm:text-sm">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Add Row</span>
                <span className="sm:hidden">Add</span>
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handleExport} className="text-xs sm:text-sm flex-1 sm:flex-none">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">CSV</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleAutoSizeAllColumns} className="text-xs sm:text-sm hidden md:flex">
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Auto Size All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnSettings(true)}
              className="text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Columns
            </Button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      {enableFiltering && (
        <FilterBar
          columns={columns}
          filters={filters}
          onFiltersChange={(newFilters) => {
            setFilters(newFilters);
            onFilter?.(newFilters);
          }}
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
        />
      )}

      {/* Table - Responsive with horizontal scroll */}
      <div 
        className="overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ height: height - (showToolbar ? 60 : 0) - (enableFiltering ? 80 : 0) }}
      >
        <div className="flex min-w-full">{/* Ensure min-width for mobile scroll */}
          {/* Selection Column */}
          {enableRowSelection && (
            <div className="flex flex-col flex-shrink-0">
              <div 
                className="flex items-center justify-center px-3 border-r border-gray-200 bg-gray-50"
                style={{ height: headerHeight }}
              >
                <Checkbox
                  checked={selectedRows.size === processedData.length && processedData.length > 0}
                  indeterminate={selectedRows.size > 0 && selectedRows.size < processedData.length}
                  onCheckedChange={handleSelectAll}
                />
              </div>
              {processedData.map((row) => (
                <div 
                  key={row.id} 
                  className="flex items-center justify-center px-3 border-r border-b border-gray-200 bg-white"
                  style={{ height: rowHeight }}
                >
                  <Checkbox
                    checked={selectedRows.has(row.id)}
                    onCheckedChange={(checked) => handleRowSelect(row.id, checked as boolean)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pinned Left Columns */}
          {pinnedLeftColumns.length > 0 && (
            <div className="flex flex-shrink-0 border-r-2 border-blue-200">
              {renderColumnGroup(pinnedLeftColumns, true)}
            </div>
          )}

          {/* Center Columns */}
          <div className="flex flex-1 min-w-0">
            {renderColumnGroup(centerColumns)}
          </div>

          {/* Pinned Right Columns */}
          {pinnedRightColumns.length > 0 && (
            <div className="flex flex-shrink-0 border-l-2 border-blue-200">
              {renderColumnGroup(pinnedRightColumns, true)}
            </div>
          )}
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