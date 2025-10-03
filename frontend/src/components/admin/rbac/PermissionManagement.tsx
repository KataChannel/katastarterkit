import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Key } from 'lucide-react';
import { useSearchPermissions, useDeletePermission } from '../../../hooks/useRbac';
import { Permission, PermissionSearchInput } from '../../../types/rbac.types';
import CreatePermissionModal from './CreatePermissionModal';
import EditPermissionModal from './EditPermissionModal';


interface PermissionManagementProps {
  className?: string;
}

const PermissionManagement: React.FC<PermissionManagementProps> = ({ className = '' }) => {
  const [searchInput, setSearchInput] = useState<PermissionSearchInput>({
    page: 0,
    size: 20,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  const { data, loading, error, refetch } = useSearchPermissions(searchInput);
  const [deletePermission] = useDeletePermission();

  const handleSearch = (search: string) => {
    setSearchInput(prev => ({ ...prev, search, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setSearchInput(prev => ({ ...prev, page }));
  };

  const handleDelete = async (permission: Permission) => {
    if (permission.isSystemPerm) {
      alert('Cannot delete system permission');
      return;
    }

    if (window.confirm(`Are you sure you want to delete permission "${permission.displayName}"?`)) {
      try {
        await deletePermission({ variables: { id: permission.id } });
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
    setEditingPermission(null);
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
          Error loading permissions: {error.message}
        </div>
      </div>
    );
  }

  const permissions = data?.searchPermissions?.permissions || [];
  const total = data?.searchPermissions?.total || 0;
  const totalPages = data?.searchPermissions?.totalPages || 0;

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Permission Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              Define and manage system permissions
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            New Permission
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search permissions..."
              value={searchInput.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Resource"
              value={searchInput.resource || ''}
              onChange={(e) => setSearchInput(prev => ({ ...prev, resource: e.target.value || undefined, page: 0 }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <input
              type="text"
              placeholder="Action"
              value={searchInput.action || ''}
              onChange={(e) => setSearchInput(prev => ({ ...prev, action: e.target.value || undefined, page: 0 }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resource:Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
            {permissions.map((permission: Permission) => (
              <tr key={permission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Key className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {permission.displayName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {permission.name}
                        {permission.isSystemPerm && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            System
                          </span>
                        )}
                      </div>
                      {permission.description && (
                        <div className="text-xs text-gray-400 mt-1">
                          {permission.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {permission.resource}:{permission.action}
                    {permission.scope && (
                      <span className="text-gray-500">:{permission.scope}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {permission.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    permission.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {permission.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(permission.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingPermission(permission)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit Permission"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {!permission.isSystemPerm && (
                      <button
                        onClick={() => handleDelete(permission)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Permission"
                      >
                        <Trash2 className="h-4 w-4" />
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
        <CreatePermissionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {editingPermission && (
        <EditPermissionModal
          isOpen={!!editingPermission}
          permission={editingPermission}
          onClose={() => setEditingPermission(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default PermissionManagement;