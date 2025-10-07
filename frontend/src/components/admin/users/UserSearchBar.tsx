/**
 * UserSearchBar Component
 * 
 * Search input with page size selector
 */

'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface UserSearchBarProps {
  searchTerm: string;
  pageSize: number;
  onSearchChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
}

export function UserSearchBar({
  searchTerm,
  pageSize,
  onSearchChange,
  onPageSizeChange,
}: UserSearchBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search users by name, email, or username..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select 
        value={pageSize.toString()} 
        onValueChange={(value) => onPageSizeChange(parseInt(value))}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="20">20 per page</SelectItem>
          <SelectItem value="50">50 per page</SelectItem>
          <SelectItem value="100">100 per page</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
