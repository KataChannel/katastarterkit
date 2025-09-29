import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCreateRole, useSearchPermissions } from '../../../hooks/useRbac';
import { CreateRoleInput } from '../../../types/rbac.types';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateRoleInput>({
    name: '',
    displayName: '',
    description: '',
    priority: 0,
    permissionIds: [],
  });

  const [createRole, { loading }] = useCreateRole();
  const { data: permissionsData } = useSearchPermissions({
    page: 0,
    size: 100,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createRole({
        variables: {
          input: formData,
        },
      });
      onSuccess();
    } catch (error) {
      console.error('Create role failed:', error);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds?.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...(prev.permissionIds || []), permissionId],
    }));
  };

  if (!isOpen) return null;

  const permissions = permissionsData?.searchPermissions?.permissions || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Role</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g., user_manager"
                  />
                </div>

                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g., User Manager"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Describe the role's purpose and responsibilities"
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <input
                    type="number"
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Higher numbers have higher priority
                  </p>
                </div>

                {permissions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permissions
                    </label>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {permissions.map((permission: any) => (
                        <div key={permission.id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`permission-${permission.id}`}
                            checked={formData.permissionIds?.includes(permission.id) || false}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`permission-${permission.id}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {permission.displayName}
                            <span className="text-xs text-gray-500 ml-1">
                              ({permission.resource}:{permission.action})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Role'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleModal;