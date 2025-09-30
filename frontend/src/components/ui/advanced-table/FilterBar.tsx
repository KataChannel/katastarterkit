'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { FilterCondition, ColumnDef, FilterType } from './types';
import { X, Filter, Plus } from 'lucide-react';

interface FilterBarProps<T> {
  columns: ColumnDef<T>[];
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
  globalSearch: string;
  onGlobalSearchChange: (search: string) => void;
}

const OPERATORS = {
  text: [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
    { value: 'between', label: 'Between' },
  ],
  date: [
    { value: 'equals', label: 'Equals' },
    { value: 'greaterThan', label: 'After' },
    { value: 'lessThan', label: 'Before' },
    { value: 'between', label: 'Between' },
  ],
  select: [
    { value: 'equals', label: 'Equals' },
    { value: 'in', label: 'In' },
  ],
  boolean: [
    { value: 'equals', label: 'Equals' },
  ],
};

export function FilterBar<T>({ 
  columns, 
  filters, 
  onFiltersChange, 
  globalSearch, 
  onGlobalSearchChange 
}: FilterBarProps<T>) {
  const [isAddingFilter, setIsAddingFilter] = useState(false);
  const [newFilter, setNewFilter] = useState<Partial<FilterCondition>>({});

  const filterableColumns = columns.filter(col => col.filterable !== false);

  const addFilter = () => {
    if (newFilter.field && newFilter.operator && newFilter.value !== undefined) {
      const filter: FilterCondition = {
        field: newFilter.field,
        operator: newFilter.operator,
        value: newFilter.value,
        value2: newFilter.value2,
      };
      onFiltersChange([...filters, filter]);
      setNewFilter({});
      setIsAddingFilter(false);
    }
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    onFiltersChange(newFilters);
  };

  const updateFilter = (index: number, updates: Partial<FilterCondition>) => {
    const newFilters = filters.map((filter, i) => 
      i === index ? { ...filter, ...updates } : filter
    );
    onFiltersChange(newFilters);
  };

  const getColumnType = (field: string): FilterType => {
    const column = columns.find(col => col.field === field);
    return (column?.type as FilterType) || 'text';
  };

  const getOperators = (type: FilterType) => {
    return OPERATORS[type] || OPERATORS.text;
  };

  const renderFilterValue = (filter: FilterCondition, index: number) => {
    const column = columns.find(col => col.field === filter.field);
    const type = getColumnType(filter.field);

    if (type === 'select' && column?.filterOptions) {
      return (
        <Select
          value={filter.value}
          onValueChange={(value) => updateFilter(index, { value })}
        >
          <SelectTrigger className="w-32">
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

    if (type === 'boolean') {
      return (
        <Select
          value={String(filter.value)}
          onValueChange={(value) => updateFilter(index, { value: value === 'true' })}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    return (
      <div className="flex gap-2">
        <Input
          type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
          value={filter.value || ''}
          onChange={(e) => updateFilter(index, { value: e.target.value })}
          className="w-32"
          placeholder="Value"
        />
        {filter.operator === 'between' && (
          <Input
            type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
            value={filter.value2 || ''}
            onChange={(e) => updateFilter(index, { value2: e.target.value })}
            className="w-32"
            placeholder="To"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4 border-b bg-gray-50">
      {/* Global Search */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Global search..."
          value={globalSearch}
          onChange={(e) => onGlobalSearchChange(e.target.value)}
          className="max-w-md"
        />
        
        <Popover open={isAddingFilter} onOpenChange={setIsAddingFilter}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="space-y-4">
              <h4 className="font-medium">Add Filter</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={newFilter.field}
                  onValueChange={(value) => setNewFilter({ ...newFilter, field: value, operator: undefined, value: undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Column" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterableColumns.map(col => (
                      <SelectItem key={String(col.field)} value={String(col.field)}>
                        {col.headerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {newFilter.field && (
                  <Select
                    value={newFilter.operator}
                    onValueChange={(value) => setNewFilter({ ...newFilter, operator: value as any, value: undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {getOperators(getColumnType(newFilter.field)).map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {newFilter.field && newFilter.operator && (
                <div>
                  {renderFilterValue({ ...newFilter } as FilterCondition, -1)}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingFilter(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={addFilter}
                  disabled={!newFilter.field || !newFilter.operator || newFilter.value === undefined}
                >
                  Add
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 flex items-center">
            <Filter className="w-4 h-4 mr-1" />
            Filters:
          </span>
          {filters.map((filter, index) => {
            const column = columns.find(col => col.field === filter.field);
            return (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span className="font-medium">{column?.headerName}</span>
                <span className="text-xs opacity-75">
                  {OPERATORS[getColumnType(filter.field)]?.find(op => op.value === filter.operator)?.label}
                </span>
                <span>{String(filter.value)}</span>
                {filter.value2 && <span>- {String(filter.value2)}</span>}
                <button
                  onClick={() => removeFilter(index)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
          {filters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange([])}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
}