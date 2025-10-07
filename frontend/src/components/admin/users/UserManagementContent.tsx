/**
 * UserManagementContent Component
 * 
 * Main content component for user management
 * Handles all user-related logic and state
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useSearchUsers, useUserStats, useBulkUserAction } from '@/lib/hooks/useUserManagement';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Import sub-components
import { UserActionBar } from './UserActionBar';
import { UserSearchBar } from './UserSearchBar';
import { UserStats } from './UserStats';
import { UserFilters } from './UserFilters';
import { UserTable } from './UserTable';
import { BulkActions } from './BulkActions';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { ErrorState } from './ErrorState';

interface UserSearchFilters {
  search: string;
  roleType?: 'ADMIN' | 'USER' | 'GUEST';
  isActive?: boolean;
  isVerified?: boolean;
  page: number;
  size: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function UserManagementContent() {
  // State management
  const [filters, setFilters] = useState<UserSearchFilters>({
    search: '',
    roleType: undefined,
    isActive: undefined,
    isVerified: undefined,
    page: 0,
    size: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Build search input - Now compatible with Dynamic Query System
  const searchInput = useMemo(() => {
    const input: any = {
      page: filters.page,
      size: filters.size,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    if (filters.search?.trim()) {
      input.search = filters.search.trim();
    }

    if (filters.roleType) {
      input.roleType = filters.roleType;
    }

    if (filters.isActive !== undefined) {
      input.isActive = filters.isActive;
    }

    if (filters.isVerified !== undefined) {
      input.isVerified = filters.isVerified;
    }

    return input;
  }, [filters]);

  // GraphQL hooks - Using new Dynamic Query System
  const { 
    users,
    total,
    page,
    size,
    totalPages,
    loading: usersLoading, 
    error: usersError, 
    refetch: refetchUsers 
  } = useSearchUsers(searchInput);

  const { data: statsData, loading: statsLoading } = useUserStats();
  const [bulkUserAction, { loading: bulkActionLoading }] = useBulkUserAction();

  // Handle filter changes
  const handleFilterChange = (key: keyof UserSearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 0 : value, // Reset page when other filters change
    }));
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    handleFilterChange('search', searchTerm);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    handleFilterChange('size', newSize);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    handleFilterChange('page', newPage);
  };

  // Handle sorting
  const handleSort = (sortBy: string, sortOrder: string) => {
    setFilters(prev => ({ 
      ...prev, 
      sortBy, 
      sortOrder: sortOrder as 'asc' | 'desc' 
    }));
  };

  // Handle user selection
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (userIds: string[]) => {
    setSelectedUsers(prev => 
      prev.length === userIds.length ? [] : userIds
    );
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string, newRole?: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No users selected',
        description: 'Please select users to perform bulk actions.',
        type: 'error',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await bulkUserAction({
        variables: {
          input: {
            userIds: selectedUsers,
            action,
            newRole: newRole?.toUpperCase(),
          },
        },
      });

      if (result.data?.bulkUserAction?.success) {
        toast({
          title: 'Bulk action completed',
          description: result.data.bulkUserAction.message,
          type: 'success',
        });
        setSelectedUsers([]);
        refetchUsers();
      } else {
        toast({
          title: 'Bulk action failed',
          description: result.data?.bulkUserAction?.message || 'Unknown error occurred',
          type: 'error',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to perform bulk action',
        type: 'error',
        variant: 'destructive',
      });
    }
  };

  // Handle export
  const handleExport = async () => {
    toast({
      title: 'Export started',
      description: 'User data export is being prepared...',
      type: 'info',
    });
    // TODO: Implement actual export functionality
  };

  // Handle errors
  if (usersError) {
    return (
      <ErrorState
        title="Error Loading Users"
        message={usersError.message || 'Failed to load users data'}
        onRetry={() => refetchUsers()}
        retryLabel="Retry Loading Users"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <UserStats data={statsData?.getUserStats} loading={statsLoading} />

      {/* Action Bar */}
      <UserActionBar
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onExport={handleExport}
        onCreateUser={() => setIsCreateModalOpen(true)}
      />

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <UserSearchBar
              searchTerm={filters.search}
              pageSize={filters.size}
              onSearchChange={handleSearch}
              onPageSizeChange={handlePageSizeChange}
            />

            {showFilters && (
              <UserFilters 
                filters={{
                  roleType: filters.roleType || '',
                  isActive: filters.isActive === undefined ? '' : String(filters.isActive),
                  isVerified: filters.isVerified === undefined ? '' : String(filters.isVerified),
                  sortBy: filters.sortBy,
                  sortOrder: filters.sortOrder,
                }} 
                onFilterChange={(key: string, value: any) => {
                  if (key === 'roleType') {
                    handleFilterChange(key, value || undefined);
                  } else if (key === 'isActive' || key === 'isVerified') {
                    handleFilterChange(key, value === '' ? undefined : value === 'true');
                  } else {
                    handleFilterChange(key as keyof UserSearchFilters, value);
                  }
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <BulkActions
          selectedCount={selectedUsers.length}
          onBulkAction={handleBulkAction}
          loading={bulkActionLoading}
        />
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Users
              {total > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {total} total
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetchUsers()}
              disabled={usersLoading}
            >
              {usersLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <UserTable
            data={{
              users,
              total,
              page,
              size,
              totalPages,
            }}
            loading={usersLoading}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onSort={handleSort}
            onPageChange={handlePageChange}
            onEditUser={setEditingUser}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refetchUsers();
        }}
      />

      <EditUserModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={() => {
          setEditingUser(null);
          refetchUsers();
        }}
      />
    </div>
  );
}
