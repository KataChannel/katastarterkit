import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, UsersIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useSearchRoles, useDeleteRole } from '../../../hooks/useRbac';
import { Role, RoleSearchInput } from '../../../types/rbac.types';
import AssignRolePermissionsModal from './AssignRolePermissionsModal';
import CreateRoleModal from './CreateRoleModal';
import EditRoleModal from './EditRoleModal';


interface RoleManagementProps {
  className?: string;
}

const RoleManagement: React.FC<RoleManagementProps> = ({ className = '' }) => {
  const [searchInput, setSearchInput] = useState<RoleSearchInput>({
    page: 0,
    size: 20,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [assigningRole, setAssigningRole] = useState<Role | null>(null);

  const { data, loading, error, refetch } = useSearchRoles(searchInput);
  const [deleteRole] = useDeleteRole();

  const handleSearch = (search: string) => {
    setSearchInput(prev => ({ ...prev, search, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setSearchInput(prev => ({ ...prev, page }));
  };

  const handleDelete = async (role: Role) => {
    if (role.isSystemRole) {
      alert('Cannot delete system role');
      return;
    }

    if (window.confirm(`Are you sure you want to delete role "${role.displayName}"?`)) {
      try {
        await deleteRole({ variables: { id: role.id } });
        refetch();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingRole(null);
    refetch();
  };

  const handleAssignSuccess = () => {
    setAssigningRole(null);
    refetch();
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
        <div className="text-red-800">
          Error loading roles: {error.message}
        </div>
      </div>
    );
  }

  const roles = data?.searchRoles?.roles || [];
  const total = data?.searchRoles?.total || 0;
  const totalPages = data?.searchRoles?.totalPages || 0;

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Role Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage system roles and their permissions
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Role
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search roles..."
              value={searchInput.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={searchInput.isActive?.toString() || ''}
              onChange={(e) => setSearchInput(prev => ({ 
                ...prev, 
                isActive: e.target.value === '' ? undefined : e.target.value === 'true',
                page: 0 
              }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <select
              value={searchInput.isSystemRole?.toString() || ''}
              onChange={(e) => setSearchInput(prev => ({ 
                ...prev, 
                isSystemRole: e.target.value === '' ? undefined : e.target.value === 'true',
                page: 0 
              }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="true">System</option>
              <option value="false">Custom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role: Role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {role.displayName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {role.name}
                        {role.isSystemRole && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            System
                          </span>
                        )}
                      </div>
                      {role.description && (
                        <div className="text-xs text-gray-400 mt-1">
                          {role.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {role.permissions?.length || 0} permissions
                  </div>
                  {role.children && role.children.length > 0 && (
                    <div className="text-xs text-gray-500">
                      {role.children.length} child roles
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    role.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {role.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {role.priority}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(role.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setAssigningRole(role)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Manage Permissions"
                    >
                      <ShieldCheckIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingRole(role)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit Role"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    {!role.isSystemRole && (
                      <button
                        onClick={() => handleDelete(role)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Role"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(searchInput.page || 0) * (searchInput.size || 20) + 1} to{' '}
              {Math.min(((searchInput.page || 0) + 1) * (searchInput.size || 20), total)} of {total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange((searchInput.page || 0) - 1)}
                disabled={(searchInput.page || 0) <= 0}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
                {(searchInput.page || 0) + 1} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange((searchInput.page || 0) + 1)}
                disabled={(searchInput.page || 0) >= totalPages - 1}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateRoleModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {editingRole && (
        <EditRoleModal
          isOpen={!!editingRole}
          role={editingRole}
          onClose={() => setEditingRole(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {assigningRole && (
        <AssignRolePermissionsModal
          isOpen={!!assigningRole}
          role={assigningRole}
          onClose={() => setAssigningRole(null)}
          onSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
};

export default RoleManagement;