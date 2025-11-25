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

  const roles = rolesData?.searchRoles?.roles || [];
  const permissions = permissionsData?.searchPermissions?.permissions || [];

  useEffect(() => {
    console.log('=== useEffect roleAssignments DEBUG ===');
    console.log('userRolePermissions:', userRolePermissions);
    console.log('roles length:', roles.length);
    
    if (userRolePermissions && roles.length > 0) {
      const currentRoles = userRolePermissions.getUserRolePermissions?.roleAssignments || [];
      console.log('currentRoles from server:', currentRoles);
      console.log('currentRoles count:', currentRoles.length);
      
      const newRoleAssignments = roles.map((role: Role) => {
        const existing = currentRoles.find((ra: any) => ra.role.id === role.id);
        console.log(`Role ${role.name}: existing =`, existing ? `${existing.effect}` : 'not found');
        return {
          roleId: role.id,
          effect: existing ? existing.effect : null,
        };
      });
      
      console.log('newRoleAssignments:', newRoleAssignments);
      setRoleAssignments(newRoleAssignments);
    }
  }, [userRolePermissions, roles]);

  useEffect(() => {
    if (userRolePermissions && permissions.length > 0) {
      const currentPermissions = userRolePermissions.getUserRolePermissions?.directPermissions || [];
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
    console.log('=== handleSaveRoles DEBUG ===');
    console.log('All roleAssignments:', roleAssignments);
    
    const activeAssignments = roleAssignments
      .filter(ra => ra.effect !== null)
      .map(ra => ({
        roleId: ra.roleId,
        effect: ra.effect!,
      }));

    console.log('Active assignments (after filter):', activeAssignments);
    console.log('Active assignments count:', activeAssignments.length);

    const input: AssignUserRoleInput = {
      userId: user.id,
      assignments: activeAssignments,
    };

    console.log('Final input to mutation:', JSON.stringify(input, null, 2));

    try {
      const result = await assignUserRoles({ variables: { input } });
      console.log('Mutation result:', result);
      
      toast({
        title: 'Roles updated',
        description: `Role assignments for ${user.displayName || user.username} have been updated successfully.`,
        type: 'success',
      });
      
      console.log('Calling refetchUser...');
      await refetchUser();
      console.log('refetchUser complete');
    } catch (error: any) {
      console.error('Error in handleSaveRoles:', error);
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update role assignments',
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
      await assignUserPermissions({ variables: { input } });
      toast({
        title: 'Permissions updated',
        description: `Permission assignments for ${user.displayName || user.username} have been updated successfully.`,
        type: 'success',
      });
      refetchUser();
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update permission assignments',
        type: 'error',
      });
    }
  };

  const summary = userRolePermissions?.getUserRolePermissions?.summary;
  const effectivePermissions = userRolePermissions?.getUserRolePermissions?.effectivePermissions || [];

  const roleActiveCount = roleAssignments.filter(ra => ra.effect !== null).length;
  const permissionActiveCount = permissionAssignments.filter(pa => pa.effect !== null).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0 gap-0">
        {/* Header - Fixed */}
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
              <AvatarImage src={user?.avatar} alt={user?.displayName || user?.username} />
              <AvatarFallback>
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-xl truncate">{user?.displayName || user?.username}</DialogTitle>
              <DialogDescription className="truncate">{user?.email}</DialogDescription>
            </div>
          </div>

          {/* Summary Stats - Mobile First Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4">
            <Card className="border-2">
              <CardHeader className="p-3 sm:p-4 pb-2">
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Roles</span>
                  <span className="sm:hidden">R</span>
                </CardDescription>
                <CardTitle className="text-xl sm:text-2xl text-primary">
                  {summary?.totalRoleAssignments || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader className="p-3 sm:p-4 pb-2">
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Key className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Direct</span>
                  <span className="sm:hidden">D</span>
                </CardDescription>
                <CardTitle className="text-xl sm:text-2xl text-green-600">
                  {summary?.totalDirectPermissions || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader className="p-3 sm:p-4 pb-2">
                <CardDescription className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Total</span>
                  <span className="sm:hidden">T</span>
                </CardDescription>
                <CardTitle className="text-xl sm:text-2xl text-purple-600">
                  {summary?.totalEffectivePermissions || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-2 col-span-2 sm:col-span-1">
              <CardHeader className="p-3 sm:p-4 pb-2">
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  Cập nhật
                </CardDescription>
                <CardTitle className="text-xs sm:text-sm">
                  {summary?.lastUpdated ? new Date(summary.lastUpdated).toLocaleDateString('vi-VN') : 'Chưa có'}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <Tabs defaultValue="roles" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 mx-4 sm:mx-6 mt-4 shrink-0">
            <TabsTrigger value="roles" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Roles</span>
              <span className="sm:hidden">R</span>
              {roleActiveCount > 0 && (
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                  {roleActiveCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="permissions" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Permissions</span>
              <span className="sm:hidden">P</span>
              {permissionActiveCount > 0 && (
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                  {permissionActiveCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="effective" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Effective</span>
              <span className="sm:hidden">E</span>
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                {effectivePermissions.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles" className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 space-y-4">
            <ScrollArea className="flex-1 border rounded-lg">
              <div className="divide-y">
                {roles.map((role: Role) => {
                  const assignment = roleAssignments.find(ra => ra.roleId === role.id);
                  return (
                    <div key={role.id} className="p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Shield className="h-4 w-4 text-primary shrink-0" />
                            <span className="font-medium text-sm sm:text-base">{role.displayName}</span>
                            {role.isSystemRole && (
                              <Badge variant="secondary" className="text-xs">System</Badge>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{role.name}</div>
                          {role.description && (
                            <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{role.description}</div>
                          )}
                        </div>

                        <RadioGroup
                          value={assignment?.effect || 'none'}
                          onValueChange={(value) => handleRoleChange(
                            role.id,
                            value === 'none' ? null : value as 'allow' | 'deny'
                          )}
                          className="flex gap-3 sm:gap-4 shrink-0"
                        >
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <RadioGroupItem value="none" id={`role-${role.id}-none`} />
                            <Label htmlFor={`role-${role.id}-none`} className="font-normal cursor-pointer text-xs sm:text-sm">
                              None
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <RadioGroupItem value="allow" id={`role-${role.id}-allow`} />
                            <Label 
                              htmlFor={`role-${role.id}-allow`} 
                              className="font-normal cursor-pointer text-green-600 text-xs sm:text-sm"
                            >
                              Assign
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <RadioGroupItem value="deny" id={`role-${role.id}-deny`} />
                            <Label 
                              htmlFor={`role-${role.id}-deny`} 
                              className="font-normal cursor-pointer text-destructive text-xs sm:text-sm"
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

            {/* Footer - Fixed */}
            <div className="flex justify-end pt-2 pb-4 sm:pb-6 border-t shrink-0">
              <Button onClick={handleSaveRoles} disabled={assigningRoles} className="w-full sm:w-auto">
                {assigningRoles ? 'Đang lưu...' : 'Lưu phân quyền Role'}
              </Button>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 space-y-4">
            <ScrollArea className="flex-1 border rounded-lg">
              <div className="divide-y">
                {permissions.map((permission: Permission) => {
                  const assignment = permissionAssignments.find(pa => pa.permissionId === permission.id);
                  return (
                    <div key={permission.id} className="p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-green-600 shrink-0" />
                            <span className="font-medium text-sm sm:text-base">{permission.displayName}</span>
                          </div>
                          {permission.description && (
                            <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{permission.description}</div>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="px-2 py-0.5 rounded bg-muted text-xs font-mono break-all">
                              {permission.resource}:{permission.action}
                              {permission.scope && `:${permission.scope}`}
                            </code>
                            <Badge variant="outline" className="text-xs shrink-0">
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
                          className="flex gap-3 sm:gap-4 shrink-0"
                        >
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <RadioGroupItem value="none" id={`perm-${permission.id}-none`} />
                            <Label htmlFor={`perm-${permission.id}-none`} className="font-normal cursor-pointer text-xs sm:text-sm">
                              None
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <RadioGroupItem value="allow" id={`perm-${permission.id}-allow`} />
                            <Label 
                              htmlFor={`perm-${permission.id}-allow`} 
                              className="font-normal cursor-pointer text-green-600 text-xs sm:text-sm"
                            >
                              Allow
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <RadioGroupItem value="deny" id={`perm-${permission.id}-deny`} />
                            <Label 
                              htmlFor={`perm-${permission.id}-deny`} 
                              className="font-normal cursor-pointer text-destructive text-xs sm:text-sm"
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

            {/* Footer - Fixed */}
            <div className="flex justify-end pt-2 pb-4 sm:pb-6 border-t shrink-0">
              <Button onClick={handleSavePermissions} disabled={assigningPermissions} className="w-full sm:w-auto">
                {assigningPermissions ? 'Đang lưu...' : 'Lưu phân quyền Permission'}
              </Button>
            </div>
          </TabsContent>

          {/* Effective Permissions Tab */}
          <TabsContent value="effective" className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 pb-4 sm:pb-6">
            <ScrollArea className="flex-1 border rounded-lg mt-4">
              <div className="divide-y">
                {effectivePermissions.length > 0 ? (
                  effectivePermissions.map((permission: Permission) => (
                    <div key={permission.id} className="p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                            <span className="font-medium text-sm sm:text-base">{permission.displayName}</span>
                            {permission.isActive === false && (
                              <Badge variant="secondary" className="text-xs">Inactive</Badge>
                            )}
                          </div>
                          {permission.description && (
                            <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{permission.description}</div>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="px-2 py-0.5 rounded bg-muted text-xs font-mono break-all">
                              {permission.resource}:{permission.action}
                              {permission.scope && `:${permission.scope}`}
                            </code>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {permission.category}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant="default" className="shrink-0 h-fit">
                          Hiệu lực
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 px-4">
                    <Key className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                    <h3 className="text-sm font-medium mb-1">Chưa có quyền hiệu lực</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                      User này chưa có quyền hiệu lực nào từ roles hoặc phân quyền trực tiếp.
                    </p>
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
