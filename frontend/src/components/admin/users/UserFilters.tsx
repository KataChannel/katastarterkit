'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

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

interface UserFiltersProps {
  filters: {
    roleType: string;
    isActive: string;
    isVerified: string;
    sortBy: string;
    sortOrder: string;
  };
  onFilterChange: (key: keyof UserSearchFilters, value: any) => void;
}

export function UserFilters({ filters, onFilterChange }: UserFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange('roleType', '');
    onFilterChange('isActive', '');
    onFilterChange('isVerified', '');
    onFilterChange('sortBy', 'createdAt');
    onFilterChange('sortOrder', 'desc');
  };

  const hasActiveFilters = filters.roleType || filters.isActive || filters.isVerified;

  return (
    <div className="border-t pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Role Type Filter */}
        <div className="space-y-1">
          <Label htmlFor="roleType" className="text-xs font-medium text-gray-600">
            Role Type
          </Label>
          <Select value={filters.roleType} onValueChange={(value) => onFilterChange('roleType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Status Filter */}
        <div className="space-y-1">
          <Label htmlFor="isActive" className="text-xs font-medium text-gray-600">
            Status
          </Label>
          <Select value={filters.isActive} onValueChange={(value) => onFilterChange('isActive', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verification Status Filter */}
        <div className="space-y-1">
          <Label htmlFor="isVerified" className="text-xs font-medium text-gray-600">
            Verification
          </Label>
          <Select value={filters.isVerified} onValueChange={(value) => onFilterChange('isVerified', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All verification</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Options */}
        <div className="space-y-1">
          <Label htmlFor="sortBy" className="text-xs font-medium text-gray-600">
            Sort By
          </Label>
          <div className="flex gap-2">
            <Select value={filters.sortBy} onValueChange={(value) => onFilterChange('sortBy', value)}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="updatedAt">Updated Date</SelectItem>
                <SelectItem value="username">Username</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="lastLoginAt">Last Login</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.sortOrder} onValueChange={(value) => onFilterChange('sortOrder', value)}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">↓</SelectItem>
                <SelectItem value="asc">↑</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}