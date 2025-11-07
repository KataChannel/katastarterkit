import React, { useState, useEffect } from 'react';
import { 
  useGetUserRolePermissions, 
  useAssignUserRoles, 
  useAssignUserPermissions,
  useSearchRoles,
  useSearchPermissions
} from '../../../hooks/useRbac';
import { 
  AssignUserRoleInput, 
  AssignUserPermissionInput,
  Role,
  Permission
} from '../../../types/rbac.types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Key, CheckCircle2, Calendar, User } from 'lucide-react';

interface UserRolePermissionModalProps {
  isOpen: boolean;
  user: any;
  onClose: () => void;
}

const UserRolePermissionModal: React.FC<UserRolePermissionModalProps> = ({
  isOpen,
  user,
  onClose,
}) => {
  const [roleAssignments, setRoleAssignments] = useState<Array<{
    roleId: string;
    effect: 'allow' | 'deny' | null;
  }>>([]);
  const [permissionAssignments, setPermissionAssignments] = useState<Array<{
    permissionId: string;
    effect: 'allow' | 'deny' | null;
  }>>([]);

  const { toast } = useToast();
  const { data: userRolePermissions, loading: userLoading, refetch: refetchUser } = useGetUserRolePermissions(user?.id);
  const { data: rolesData } = useSearchRoles({ page: 0, size: 100, isActive: true });
  // Note: Backend has a max limit of 100 items per request
  const { data: permissionsData } = useSearchPermissions({ page: 0, size: 100, isActive: true });
  
  const [assignUserRoles, { loading: assigningRoles }] = useAssignUserRoles();
  const [assignUserPermissions, { loading: assigningPermissions }] = useAssignUserPermissions();

  const roles = (rolesData as any)?.searchRoles?.roles || [];
  const permissions = (permissionsData as any)?.searchPermissions?.permissions || [];

  useEffect(() => {
    if (userRolePermissions && roles.length > 0) {
      const currentRoles = (userRolePermissions as any)?.getUserRolePermissions?.roleAssignments || [];
      const newRoleAssignments = roles.map((role: Role) => {
        const existing = currentRoles.find((ra: any) => ra.role.id === role.id);
        return {
          roleId: role.id,
          effect: existing ? existing.effect : null,
        };
      });
      setRoleAssignments(newRoleAssignments);
    }
  }, [userRolePermissions, roles]);

  useEffect(() => {
    if (userRolePermissions && permissions.length > 0) {
      const currentPermissions = (userRolePermissions as any)?.getUserRolePermissions?.directPermissions || [];
      const newPermissionAssignments = permissions.map((permission: Permission) => {
        const existing = currentPermissions.find((dp: any) => dp.permission.id === permission.id);
        return {
          permissionId: permission.id,
          effect: existing ? existing.effect : null,
        };
      });
      setPermissionAssignments(newPermissionAssignments);
    }
  }, [userRolePermissions, permissions]);

  const handleRoleChange = (roleId: string, effect: 'allow' | 'deny' | null) => {
    setRoleAssignments(prev => 
      prev.map(ra => 
        ra.roleId === roleId 
          ? { ...ra, effect }
          : ra
      )
    );
  };

  const handlePermissionChange = (permissionId: string, effect: 'allow' | 'deny' | null) => {
    setPermissionAssignments(prev => 
      prev.map(pa => 
        pa.permissionId === permissionId 
          ? { ...pa, effect }
          : pa
      )
    );
  };

  const handleSaveRoles = async () => {
    const activeAssignments = roleAssignments
      .filter(ra => ra.effect !== null)
      .map(ra => ({
        roleId: ra.roleId,
        effect: ra.effect!,
      }));

    const input: AssignUserRoleInput = {
      userId: user.id,
      assignments: activeAssignments,
    };

    try {
      await (assignUserRoles as any)({ variables: { input } });
      toast({
        title: 'Roles updated',
        description: `Role assignments for ${user.displayName || user.username} have been updated successfully.`,
        type: 'success',
      });
      refetchUser();
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: (error as any)?.message || 'Failed to update role assignments',
        type: 'error',
      });
    }
  };

  const handleSavePermissions = async () => {
    const activeAssignments = permissionAssignments
      .filter(pa => pa.effect !== null)
      .map(pa => ({
        permissionId: pa.permissionId,
        effect: pa.effect!,
      }));

    const input: AssignUserPermissionInput = {
      userId: user.id,
      assignments: activeAssignments,
    };

    try {
      await (assignUserPermissions as any)({ variables: { input } });
      toast({
        title: 'Permissions updated',
        description: `Permission assignments for ${user.displayName || user.username} have been updated successfully.`,
        type: 'success',
      });
      refetchUser();
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: (error as any)?.message || 'Failed to update permission assignments',
        type: 'error',
      });
    }
  };

  const summary = (userRolePermissions as any)?.getUserRolePermissions?.summary;
  const effectivePermissions = (userRolePermissions as any)?.getUserRolePermissions?.effectivePermissions || [];

  const roleActiveCount = roleAssignments.filter(ra => ra.effect !== null).length;
  const permissionActiveCount = permissionAssignments.filter(pa => pa.effect !== null).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar} alt={user?.displayName || user?.username} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{user?.displayName || user?.username}</DialogTitle>
              <DialogDescription>{user?.email}</DialogDescription>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Roles
                </CardDescription>
                <CardTitle className="text-2xl text-primary">
                  {summary?.totalRoleAssignments || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Direct Permissions
                </CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {summary?.totalDirectPermissions || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Total Permissions
                </CardDescription>
                <CardTitle className="text-2xl text-purple-600">
                  {summary?.totalEffectivePermissions || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Last Updated
                </CardDescription>
                <CardTitle className="text-sm">
                  {summary?.lastUpdated ? new Date(summary.lastUpdated).toLocaleDateString() : 'Never'}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </DialogHeader>

        <Tabs defaultValue="roles" className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roles">
              Role Assignments
              {roleActiveCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {roleActiveCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="permissions">
              Permission Assignments
              {permissionActiveCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {permissionActiveCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="effective">
              Effective Permissions
              <Badge variant="secondary" className="ml-2">
                {effectivePermissions.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-4">
            <ScrollArea className="h-[400px] border rounded-lg">
              <div className="divide-y">
                {roles.map((role: Role) => {
                  const assignment = roleAssignments.find(ra => ra.roleId === role.id);
                  return (
                    <div key={role.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="font-medium">{role.displayName}</span>
                            {role.isSystemRole && (
                              <Badge variant="secondary" className="text-xs">System</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{role.name}</div>
                          {role.description && (
                            <div className="text-sm text-muted-foreground">{role.description}</div>
                          )}
                        </div>

                        <RadioGroup
                          value={assignment?.effect || 'none'}
                          onValueChange={(value) => handleRoleChange(
                            role.id,
                            value === 'none' ? null : value as 'allow' | 'deny'
                          )}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id={`role-${role.id}-none`} />
                            <Label htmlFor={`role-${role.id}-none`} className="font-normal cursor-pointer">
                              None
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="allow" id={`role-${role.id}-allow`} />
                            <Label 
                              htmlFor={`role-${role.id}-allow`} 
                              className="font-normal cursor-pointer text-green-600"
                            >
                              Assign
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="deny" id={`role-${role.id}-deny`} />
                            <Label 
                              htmlFor={`role-${role.id}-deny`} 
                              className="font-normal cursor-pointer text-destructive"
                            >
                              Deny
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="flex justify-end pt-4 pb-6">
              <Button onClick={handleSaveRoles} disabled={assigningRoles}>
                {assigningRoles ? 'Saving...' : 'Save Role Assignments'}
              </Button>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-4">
            <ScrollArea className="h-[400px] border rounded-lg">
              <div className="divide-y">
                {permissions.map((permission: Permission) => {
                  const assignment = permissionAssignments.find(pa => pa.permissionId === permission.id);
                  return (
                    <div key={permission.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{permission.displayName}</span>
                          </div>
                          {permission.description && (
                            <div className="text-sm text-muted-foreground">{permission.description}</div>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <code className="px-2 py-0.5 rounded bg-muted text-xs">
                              {permission.resource}:{permission.action}
                              {permission.scope && `:${permission.scope}`}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {permission.category}
                            </Badge>
                          </div>
                        </div>

                        <RadioGroup
                          value={assignment?.effect || 'none'}
                          onValueChange={(value) => handlePermissionChange(
                            permission.id,
                            value === 'none' ? null : value as 'allow' | 'deny'
                          )}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id={`perm-${permission.id}-none`} />
                            <Label htmlFor={`perm-${permission.id}-none`} className="font-normal cursor-pointer">
                              None
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="allow" id={`perm-${permission.id}-allow`} />
                            <Label 
                              htmlFor={`perm-${permission.id}-allow`} 
                              className="font-normal cursor-pointer text-green-600"
                            >
                              Allow
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="deny" id={`perm-${permission.id}-deny`} />
                            <Label 
                              htmlFor={`perm-${permission.id}-deny`} 
                              className="font-normal cursor-pointer text-destructive"
                            >
                              Deny
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="flex justify-end pt-4 pb-6">
              <Button onClick={handleSavePermissions} disabled={assigningPermissions}>
                {assigningPermissions ? 'Saving...' : 'Save Permission Assignments'}
              </Button>
            </div>
          </TabsContent>

          {/* Effective Permissions Tab */}
          <TabsContent value="effective" className="space-y-4">
            <ScrollArea className="h-[450px] border rounded-lg">
              <div className="divide-y">
                {effectivePermissions.map((ep: any) => (
                  <div key={ep.permission.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="font-medium">{ep.permission.displayName}</div>
                        <div className="text-sm text-muted-foreground">
                          {ep.permission.resource}:{ep.permission.action}
                          {ep.permission.scope && `:${ep.permission.scope}`}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={ep.effect === 'allow' ? 'default' : 'destructive'}>
                            {ep.effect}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {ep.source}
                          </Badge>
                          {ep.fromRole && (
                            <span className="text-xs text-muted-foreground">
                              via role: {ep.fromRole.displayName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {effectivePermissions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No effective permissions found for this user.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserRolePermissionModal;
