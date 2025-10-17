import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Users, ShieldCheck } from 'lucide-react';
import { useSearchRoles, useDeleteRole } from '../../../hooks/useRbac';
import { Role, RoleSearchInput } from '../../../types/rbac.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  const handleSearch = (search: string) => {
    setSearchInput(prev => ({ ...prev, search, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setSearchInput(prev => ({ ...prev, page }));
  };

  const handleDelete = async (role: Role) => {
    if (role.isSystemRole) {
      toast({
        title: 'Cannot delete system role',
        description: 'System roles cannot be deleted for security reasons.',
        type: 'error',
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete role "${role.displayName}"?`)) {
      try {
        await deleteRole({ variables: { id: role.id } });
        toast({
          title: 'Role deleted',
          description: `Role "${role.displayName}" has been deleted successfully.`,
          type: 'success',
        });
        refetch();
      } catch (error: any) {
        toast({
          title: 'Delete failed',
          description: error.message || 'Failed to delete role',
          type: 'error',
        });
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
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className={`border-red-200 bg-red-50 text-red-800 ${className}`}>
        <AlertDescription>
          Error loading roles: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  const roles = data?.searchRoles?.roles || [];
  const total = data?.searchRoles?.total || 0;
  const totalPages = data?.searchRoles?.totalPages || 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Role Management</CardTitle>
            <CardDescription>
              Manage system roles and their permissions
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Role
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search roles..."
              value={searchInput.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={searchInput.isActive?.toString() || ''}
              onValueChange={(value) => setSearchInput(prev => ({ 
                ...prev, 
                isActive: value === '' ? undefined : value === 'true',
                page: 0 
              }))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={searchInput.isSystemRole?.toString() || ''}
              onValueChange={(value) => setSearchInput(prev => ({ 
                ...prev, 
                isSystemRole: value === '' ? undefined : value === 'true',
                page: 0 
              }))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="true">System</SelectItem>
                <SelectItem value="false">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role: Role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-muted">
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{role.displayName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            {role.name}
                            {role.isSystemRole && (
                              <Badge variant="secondary" className="text-xs">System</Badge>
                            )}
                          </div>
                          {role.description && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {role.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{role.permissions?.length || 0} permissions</div>
                      {role.children && role.children.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {role.children.length} child roles
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.isActive ? 'default' : 'destructive'}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{role.priority}</TableCell>
                    <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setAssigningRole(role)}
                          title="Manage Permissions"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingRole(role)}
                          title="Edit Role"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {!role.isSystemRole && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(role)}
                            title="Delete Role"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {(searchInput.page || 0) * (searchInput.size || 20) + 1} to{' '}
              {Math.min(((searchInput.page || 0) + 1) * (searchInput.size || 20), total)} of {total} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange((searchInput.page || 0) - 1)}
                disabled={(searchInput.page || 0) <= 0}
              >
                Previous
              </Button>
              <div className="text-sm font-medium px-3 py-1 bg-muted rounded-md">
                {(searchInput.page || 0) + 1} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange((searchInput.page || 0) + 1)}
                disabled={(searchInput.page || 0) >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}

      </CardContent>

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
    </Card>
  );
};

export default RoleManagement;