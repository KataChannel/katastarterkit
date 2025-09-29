import React, { useState } from 'react';
import { MagnifyingGlassIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useSearchUsers } from '../../../lib/hooks/useUserManagement';
import { useGetUserRolePermissions, useAssignUserRoles, useAssignUserPermissions } from '../../../hooks/useRbac';
import UserRolePermissionModal from './UserRolePermissionModal';

interface UserRoleAssignmentProps {
  className?: string;
}

const UserRoleAssignment: React.FC<UserRoleAssignmentProps> = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data: usersData, loading: usersLoading } = useSearchUsers({
    search: searchTerm,
    page: 0,
    size: 50,
  });

  const users = usersData?.searchUsers?.users || [];

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
  };

  if (usersLoading) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Select User</h3>
            <p className="mt-1 text-sm text-gray-500">
              Choose a user to manage their roles and permissions
            </p>
          </div>

          {/* Search */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* User List */}
          <div className="max-h-96 overflow-y-auto">
            {users.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                {searchTerm ? 'No users found matching your search.' : 'No users available.'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {users.map((user: any) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedUser?.id === user.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar}
                            alt={user.displayName || user.username}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.displayName || user.username}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'ADMIN' 
                                ? 'bg-purple-100 text-purple-800'
                                : user.role === 'USER'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                        {user.isActive === false && (
                          <p className="text-xs text-red-500 mt-1">Inactive</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Role & Permission Details */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedUser ? 'Role & Permission Details' : 'User Details'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedUser 
                    ? `Manage roles and permissions for ${selectedUser.displayName || selectedUser.username}`
                    : 'Select a user to view their role and permission details'
                  }
                </p>
              </div>
              {selectedUser && (
                <button
                  onClick={() => setSelectedUser(selectedUser)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ShieldCheckIcon className="-ml-0.5 mr-2 h-4 w-4" />
                  Manage Access
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-4">
            {selectedUser ? (
              <UserRolePermissionPreview user={selectedUser} />
            ) : (
              <div className="text-center py-12">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No user selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a user from the list to view their role and permission details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Role Permission Modal */}
      {selectedUser && (
        <UserRolePermissionModal
          isOpen={!!selectedUser}
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

// User Role Permission Preview Component
const UserRolePermissionPreview: React.FC<{ user: any }> = ({ user }) => {
  const { data: rolePermissionsData, loading } = useGetUserRolePermissions(user.id);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const summary = rolePermissionsData?.getUserRolePermissions?.summary;
  const roleAssignments = rolePermissionsData?.getUserRolePermissions?.roleAssignments || [];
  const directPermissions = rolePermissionsData?.getUserRolePermissions?.directPermissions || [];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-semibold text-blue-600">
            {summary?.totalRoleAssignments || 0}
          </div>
          <div className="text-sm text-gray-500">Roles</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-green-600">
            {summary?.totalDirectPermissions || 0}
          </div>
          <div className="text-sm text-gray-500">Direct Permissions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-purple-600">
            {summary?.totalEffectivePermissions || 0}
          </div>
          <div className="text-sm text-gray-500">Total Permissions</div>
        </div>
      </div>

      {/* Current Roles */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Current Roles</h4>
        {roleAssignments.length === 0 ? (
          <p className="text-sm text-gray-500">No roles assigned</p>
        ) : (
          <div className="space-y-2">
            {roleAssignments.slice(0, 3).map((assignment: any) => (
              <div key={assignment.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm text-gray-900">{assignment.role.displayName}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  assignment.effect === 'allow' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {assignment.effect}
                </span>
              </div>
            ))}
            {roleAssignments.length > 3 && (
              <p className="text-xs text-gray-500">
                and {roleAssignments.length - 3} more...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Direct Permissions */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Direct Permissions</h4>
        {directPermissions.length === 0 ? (
          <p className="text-sm text-gray-500">No direct permissions assigned</p>
        ) : (
          <div className="space-y-2">
            {directPermissions.slice(0, 3).map((permission: any) => (
              <div key={permission.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <ShieldCheckIcon className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm text-gray-900">{permission.permission.displayName}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  permission.effect === 'allow' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {permission.effect}
                </span>
              </div>
            ))}
            {directPermissions.length > 3 && (
              <p className="text-xs text-gray-500">
                and {directPermissions.length - 3} more...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRoleAssignment;