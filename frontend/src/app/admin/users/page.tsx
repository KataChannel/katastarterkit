'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchUsers, useUserStats, useBulkUserAction } from '@/lib/hooks/useUserManagement';
import { UserTable } from '../../../components/admin/users/UserTable';
import { UserFilters } from '../../../components/admin/users/UserFilters';
import { UserStats } from '../../../components/admin/users/UserStats';
import { BulkActions } from '../../../components/admin/users/BulkActions';
import { CreateUserModal } from '../../../components/admin/users/CreateUserModal';
import { EditUserModal } from '../../../components/admin/users/EditUserModal';
import RbacManagement from '../../../components/admin/rbac/RbacManagement';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Search, Filter, Download, RefreshCw, Users, Shield } from 'lucide-react';
import { toast } from '../../../hooks/use-toast';

interface UserSearchFilters {
  search: string;
  roleType: string;
  isActive: string;
  isVerified: string;
  page: number;
  size: number;
  sortBy: string;
  sortOrder: string;
}

export default function AdminUsersPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('AdminUsersPage: Not authenticated, redirecting to login');
      router.push('/login');
    } else if (!loading && isAuthenticated && user?.roleType !== 'ADMIN') {
      console.log('AdminUsersPage: User is not admin, redirecting to dashboard', { 
        roleType: user?.roleType 
      });
      router.push('/admin');
    }
  }, [loading, isAuthenticated, user, router]);

  // State management
  const [filters, setFilters] = useState<UserSearchFilters>({
    search: '',
    roleType: '',
    isActive: '',
    isVerified: '',
    page: 0,
    size: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'rbac'>('users');

  // Build search input for GraphQL
  const searchInput = useMemo(() => {
    const input: any = {
      page: filters.page,
      size: filters.size,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    if (filters.search.trim()) {
      input.search = filters.search.trim();
    }

    if (filters.roleType && filters.roleType !== 'all') {
      input.roleType = filters.roleType.toUpperCase();
    }

    if (filters.isActive && filters.isActive !== 'all') {
      input.isActive = filters.isActive === 'true';
    }

    if (filters.isVerified && filters.isVerified !== 'all') {
      input.isVerified = filters.isVerified === 'true';
    }

    return input;
  }, [filters]);

  // GraphQL hooks - only call when authenticated and user is admin
  const isAdmin = isAuthenticated && user?.roleType === 'ADMIN';
  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useSearchUsers(searchInput, { skip: !isAdmin });
  const { data: statsData, loading: statsLoading } = useUserStats({ skip: !isAdmin });
  console.log('AdminUsersPage: usersData', usersData);
  console.log('AdminUsersPage: statsData', statsData);
  
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

  // Handle pagination
  const handlePageChange = (page: number) => {
    handleFilterChange('page', page);
  };

  // Handle sorting
  const handleSort = (sortBy: string, sortOrder: string) => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
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
    // Implementation for exporting users data
    toast({
      title: 'Export started',
      description: 'User data export is being prepared...',
      type: 'info',
    });
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied for non-admin users
  if (isAuthenticated && user?.roleType !== 'ADMIN') {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Access Denied</h3>
              <p className="text-gray-600 mb-4">
                You need ADMIN role to access this page. Your current role: {user?.roleType || 'Unknown'}
              </p>
              <Button onClick={() => router.push('/dashboard')} variant="outline">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect if not authenticated (will be handled by useEffect)
  if (!isAuthenticated) {
    return null;
  }

  if (usersError) {
    console.error('AdminUsersPage - Users query error:', usersError);
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Users</h3>
              <p className="text-gray-600 mb-4">{usersError.message}</p>
              <Button onClick={() => refetchUsers()} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            <Users className="w-4 h-4 mr-2" />
            Users
          </Button>
          <Button
            variant={activeTab === 'rbac' ? 'default' : 'outline'}
            onClick={() => setActiveTab('rbac')}
          >
            <Shield className="w-4 h-4 mr-2" />
            RBAC
          </Button>
        </div>
      </div>

      {activeTab === 'users' && (
        <>
          {/* User Statistics */}
          <UserStats data={statsData?.getUserStats} loading={statsLoading} />

          {/* User Management Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">User Management</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name, email, or username..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filters.size.toString()} onValueChange={(value) => handleFilterChange('size', parseInt(value))}>
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

          {showFilters && (
            <UserFilters 
              filters={filters} 
              onFilterChange={handleFilterChange}
            />
          )}
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
              {usersData?.searchUsers && (
                <Badge variant="secondary" className="ml-2">
                  {usersData.searchUsers.total} total
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
            data={usersData?.searchUsers}
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
        </>
      )}

      {activeTab === 'rbac' && (
        <RbacManagement />
      )}
    </div>
  );
}