import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAssignRolePermissions, useSearchPermissions } from '../../../hooks/useRbac';
import { Role, Permission, AssignRolePermissionInput } from '../../../types/rbac.types';

interface AssignRolePermissionsModalProps {
  isOpen: boolean;
  role: Role;
  onClose: () => void;
  onSuccess: () => void;
}

interface PermissionAssignment {
  permissionId: string;
  effect: 'allow' | 'deny' | null;
}

const AssignRolePermissionsModal: React.FC<AssignRolePermissionsModalProps> = ({
  isOpen,
  role,
  onClose,
  onSuccess,
}) => {
  const [assignments, setAssignments] = useState<PermissionAssignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [assignRolePermissions, { loading }] = useAssignRolePermissions();
  const { data: permissionsData } = useSearchPermissions({
    page: 0,
    size: 1000,
    isActive: true,
  });

  useEffect(() => {
    if (role && permissionsData?.searchPermissions?.permissions) {
      const permissions = permissionsData.searchPermissions.permissions;
      const rolePermissions = role.permissions || [];
      
      const newAssignments: PermissionAssignment[] = permissions.map((permission: Permission) => {
        const existing = rolePermissions.find(rp => rp.permission.id === permission.id);
        return {
          permissionId: permission.id,
          effect: existing ? existing.effect : null,
        };
      });
      
      setAssignments(newAssignments);
    }
  }, [role, permissionsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const activeAssignments = assignments
      .filter(a => a.effect !== null)
      .map(a => ({
        permissionId: a.permissionId,
        effect: a.effect!,
      }));

    const input: AssignRolePermissionInput = {
      roleId: role.id,
      assignments: activeAssignments,
    };

    try {
      await assignRolePermissions({
        variables: { input },
      });
      onSuccess();
    } catch (error) {
      console.error('Assign role permissions failed:', error);
    }
  };

  const handlePermissionChange = (permissionId: string, effect: 'allow' | 'deny' | null) => {
    setAssignments(prev => 
      prev.map(a => 
        a.permissionId === permissionId 
          ? { ...a, effect }
          : a
      )
    );
  };

  if (!isOpen) return null;

  const permissions = permissionsData?.searchPermissions?.permissions || [];
  const filteredPermissions = permissions.filter((permission: Permission) =>
    permission.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Manage Permissions for: {role.displayName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Assign or revoke permissions for this role
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Permissions Table */}
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Permission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resource:Action
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Effect
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPermissions.map((permission: Permission) => {
                      const assignment = assignments.find(a => a.permissionId === permission.id);
                      return (
                        <tr key={permission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {permission.displayName}
                              </div>
                              {permission.description && (
                                <div className="text-sm text-gray-500">
                                  {permission.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {permission.resource}:{permission.action}
                              {permission.scope && (
                                <span className="text-gray-500">:{permission.scope}</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Category: {permission.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name={`permission-${permission.id}`}
                                  checked={assignment?.effect === null}
                                  onChange={() => handlePermissionChange(permission.id, null)}
                                  className="form-radio h-4 w-4 text-gray-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">None</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name={`permission-${permission.id}`}
                                  checked={assignment?.effect === 'allow'}
                                  onChange={() => handlePermissionChange(permission.id, 'allow')}
                                  className="form-radio h-4 w-4 text-green-600"
                                />
                                <span className="ml-2 text-sm text-green-700">Allow</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name={`permission-${permission.id}`}
                                  checked={assignment?.effect === 'deny'}
                                  onChange={() => handlePermissionChange(permission.id, 'deny')}
                                  className="form-radio h-4 w-4 text-red-600"
                                />
                                <span className="ml-2 text-sm text-red-700">Deny</span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredPermissions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No permissions found matching your search.
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Permissions'}
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

export default AssignRolePermissionsModal;