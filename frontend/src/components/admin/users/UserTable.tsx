'use client';

import React from 'react';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Clock,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TablePagination } from './TablePagination';
import { UserTableSkeleton } from './UserTableSkeleton';

interface User {
  id: string;
  email?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  roleType: string;
  isActive: boolean;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  failedLoginAttempts: number;
  lockedUntil?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserSearchResult {
  users: User[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

interface UserTableProps {
  data?: UserSearchResult;
  loading?: boolean;
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: (userIds: string[]) => void;
  onSort: (sortBy: string, sortOrder: string) => void;
  onPageChange: (page: number) => void;
  onEditUser: (user: User) => void;
  onViewUser?: (user: User) => void;
  onActivateUser?: (user: User) => void;
  onDeactivateUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
  sortBy: string;
  sortOrder: string;
}

export function UserTable({
  data,
  loading,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onSort,
  onPageChange,
  onEditUser,
  onViewUser,
  onActivateUser,
  onDeactivateUser,
  onDeleteUser,
  sortBy,
  sortOrder,
}: UserTableProps) {
  const users = data?.users || [];
  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length;

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(field, newOrder);
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const getDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  const getInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.username.slice(0, 2).toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'guest':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (user: User) => {
    if (!user.isActive) {
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Inactive</Badge>;
    }
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Locked</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
  };

  if (loading) {
    return <UserTableSkeleton rows={5} />;
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">No users found</div>
        <div className="text-sm text-gray-400">Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onCheckedChange={() => onSelectAll(users.map(u => u.id))}
              />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('username')}>
              <div className="flex items-center gap-1">
                User
                {getSortIcon('username')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
              <div className="flex items-center gap-1">
                Contact
                {getSortIcon('email')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('roleType')}>
              <div className="flex items-center gap-1">
                Role
                {getSortIcon('roleType')}
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
              <div className="flex items-center gap-1">
                Joined
                {getSortIcon('createdAt')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('lastLoginAt')}>
              <div className="flex items-center gap-1">
                Last Login
                {getSortIcon('lastLoginAt')}
              </div>
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => onSelectUser(user.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={getDisplayName(user)} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">
                      {getDisplayName(user)}
                    </div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {user.email && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Phone className="w-3 h-3" />
                      {user.phone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getRoleBadgeColor(user.roleType)}>
                  {user.roleType}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusBadge(user)}
                  {user.isVerified && (
                    <div title="Verified">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                  {user.isTwoFactorEnabled && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" title="2FA Enabled" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-3 h-3" />
                  {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </div>
              </TableCell>
              <TableCell>
                {user.lastLoginAt ? (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true })}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Never</span>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditUser(user)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewUser && onViewUser(user)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => user.isActive 
                        ? onDeactivateUser && onDeactivateUser(user)
                        : onActivateUser && onActivateUser(user)
                      }
                    >
                      {user.isActive ? (
                        <>
                          <UserX className="w-4 h-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => onDeleteUser && onDeleteUser(user)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <TablePagination
          currentPage={data.page}
          totalPages={data.totalPages}
          pageSize={data.size}
          totalItems={data.total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}