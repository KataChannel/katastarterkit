'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef, RowData, CellEditorParams } from './types';
import { TableUtils } from './utils';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableCellProps<T extends RowData> {
  column: ColumnDef<T>;
  data: T;
  value: any;
  rowIndex: number;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (newValue: any) => void;
  onCancel: () => void;
  isSelected?: boolean;
  className?: string;
}

export function TableCell<T extends RowData>({
  column,
  data,
  value,
  rowIndex,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  isSelected,
  className
}: TableCellProps<T>) {
  const [editValue, setEditValue] = useState(value);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    const error = TableUtils.validateCellValue(editValue, column);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    onSave(editValue);
  };

  const handleCancel = () => {
    setEditValue(value);
    setValidationError(null);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const renderValue = () => {
    if (column.cellRenderer) {
      return column.cellRenderer({
        value,
        data,
        field: column.field,
        rowIndex,
        colDef: column
      });
    }

    if (column.valueGetter) {
      const displayValue = column.valueGetter(data);
      return renderDefaultValue(displayValue);
    }

    return renderDefaultValue(value);
  };

  const renderDefaultValue = (val: any) => {
    if (val === null || val === undefined) {
      return <span className="text-gray-400">—</span>;
    }

    switch (column.type) {
      case 'boolean':
        return (
          <div className="flex justify-center">
            <Checkbox checked={Boolean(val)} disabled />
          </div>
        );
      case 'date':
        if (val instanceof Date) {
          return val.toLocaleDateString();
        }
        if (typeof val === 'string') {
          const date = new Date(val);
          return isNaN(date.getTime()) ? val : date.toLocaleDateString();
        }
        return String(val);
      case 'number':
        return typeof val === 'number' ? val.toLocaleString() : val;
      default:
        return String(val);
    }
  };

  const renderEditor = () => {
    if (column.cellEditor) {
      const editorParams: CellEditorParams<T> = {
        value: editValue,
        data,
        field: column.field,
        rowIndex,
        colDef: column,
        onValueChange: setEditValue,
        onCancel: handleCancel,
        onSave: handleSave
      };
      return column.cellEditor(editorParams);
    }

    return renderDefaultEditor();
  };

  const renderDefaultEditor = () => {
    switch (column.type) {
      case 'boolean':
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={Boolean(editValue)}
              onCheckedChange={(checked) => setEditValue(checked)}
              autoFocus
            />
          </div>
        );

      case 'select':
        if (column.filterOptions) {
          return (
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {column.filterOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        break;

      case 'number':
        return (
          <Input
            ref={inputRef}
            type="number"
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8"
          />
        );

      case 'date':
        return (
          <Input
            ref={inputRef}
            type="date"
            value={editValue instanceof Date ? editValue.toISOString().split('T')[0] : editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8"
          />
        );

      default:
        return (
          <Input
            ref={inputRef}
            type="text"
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8"
          />
        );
    }

    return (
      <Input
        ref={inputRef}
        type="text"
        value={editValue || ''}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-8"
      />
    );
  };

  const cellClass = typeof column.cellClass === 'function' 
    ? column.cellClass(data) 
    : column.cellClass;

  if (isEditing) {
    return (
      <div className={cn(
        'px-3 py-2 border-r border-gray-200 bg-white relative',
        isSelected && 'bg-blue-50',
        cellClass,
        className
      )}>
        <div className="flex items-center gap-1">
          <div className="flex-1">
            {renderEditor()}
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-green-600 hover:bg-green-100"
              onClick={handleSave}
            >
              <Check className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-red-600 hover:bg-red-100"
              onClick={handleCancel}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        {validationError && (
          <div className="absolute top-full left-0 z-10 mt-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
            {validationError}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'px-3 py-2 border-r border-gray-200 bg-white cursor-default',
        column.editable && 'hover:bg-gray-50 cursor-pointer',
        isSelected && 'bg-blue-50',
        cellClass,
        className
      )}
      onClick={column.editable ? onStartEdit : undefined}
      onDoubleClick={column.editable ? onStartEdit : undefined}
    >
      {renderValue()}
    </div>
  );
}