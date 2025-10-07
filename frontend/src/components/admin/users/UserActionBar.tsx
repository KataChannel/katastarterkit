/**
 * UserActionBar Component
 * 
 * Action buttons for user management
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter } from 'lucide-react';

interface UserActionBarProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onExport: () => void;
  onCreateUser: () => void;
}

export function UserActionBar({
  showFilters,
  onToggleFilters,
  onExport,
  onCreateUser,
}: UserActionBarProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">User Management</h2>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onToggleFilters}
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
        <Button
          variant="outline"
          onClick={onExport}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button onClick={onCreateUser}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>
    </div>
  );
}
