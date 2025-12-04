'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Search, 
  Filter, 
  Download, 
  Plus,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_LABELS, PRIORITY_LABELS, STATUS_OPTIONS, PRIORITY_OPTIONS } from './types';

interface ListViewToolbarProps {
  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;
  
  // Filters
  statusFilter: string | null;
  onStatusFilterChange: (status: string | null) => void;
  priorityFilter: string | null;
  onPriorityFilterChange: (priority: string | null) => void;
  
  // Actions
  onCreateClick: () => void;
  onExportCSV: () => void;
}

export function ListViewToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onCreateClick,
  onExportCSV,
}: ListViewToolbarProps) {
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [priorityOpen, setPriorityOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Add + Search - Full width on mobile */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={onCreateClick} className="w-full sm:w-auto shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Task
        </Button>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>
      
      {/* Row 2: Filters + Export - Scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
        {/* Status Filter Combobox */}
        <Popover open={statusOpen} onOpenChange={setStatusOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="shrink-0 min-w-fit"
            >
              <Filter className="w-4 h-4 mr-2" />
              Trạng thái
              {statusFilter && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {STATUS_LABELS[statusFilter]}
                </Badge>
              )}
              <ChevronsUpDown className="ml-2 h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0" align="start">
            <Command>
              <CommandInput placeholder="Tìm kiếm..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      onStatusFilterChange(null);
                      setStatusOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        statusFilter === null ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    Tất cả
                  </CommandItem>
                  {STATUS_OPTIONS.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        onStatusFilterChange(option.value);
                        setStatusOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          statusFilter === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Priority Filter Combobox */}
        <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="shrink-0 min-w-fit"
            >
              <Filter className="w-4 h-4 mr-2" />
              Ưu tiên
              {priorityFilter && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {PRIORITY_LABELS[priorityFilter]}
                </Badge>
              )}
              <ChevronsUpDown className="ml-2 h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0" align="start">
            <Command>
              <CommandInput placeholder="Tìm kiếm..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      onPriorityFilterChange(null);
                      setPriorityOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        priorityFilter === null ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    Tất cả
                  </CommandItem>
                  {PRIORITY_OPTIONS.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        onPriorityFilterChange(option.value);
                        setPriorityOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          priorityFilter === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Export CSV */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExportCSV}
          className="shrink-0"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
