import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useUpdateRole, useSearchPermissions } from '../../../hooks/useRbac';
import { Role, UpdateRoleInput } from '../../../types/rbac.types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface EditRoleModalProps {
  isOpen: boolean;
  role: Role;
  onClose: () => void;
  onSuccess: () => void;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  role,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<UpdateRoleInput>({
    name: '',
    displayName: '',
    description: '',
    priority: 0,
    isActive: true,
  });

  const [updateRole, { loading }] = useUpdateRole();
  const { data: permissionsData } = useSearchPermissions({
    page: 0,
    size: 100,
    isActive: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        displayName: role.displayName,
        description: role.description || '',
        priority: role.priority,
        isActive: role.isActive,
      });
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await (updateRole as any)({
        variables: {
          id: role.id,
          input: formData,
        },
      });
      toast({
        title: 'Role updated',
        description: `Role "${formData.displayName}" has been updated successfully.`,
        type: 'success',
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: (error as any)?.message || 'Failed to update role',
        type: 'error',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Role: {role.displayName}</DialogTitle>
          <DialogDescription>
            Update role information and settings
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role.isSystemRole && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>System Role:</strong> Some properties cannot be modified to ensure system stability.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">
                Role Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., user_manager"
                disabled={role.isSystemRole}
              />
              {role.isSystemRole && (
                <p className="text-xs text-muted-foreground mt-1">
                  System role names cannot be changed
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="displayName">
                Display Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="displayName"
                required
                value={formData.displayName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="e.g., User Manager"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role's purpose and responsibilities"
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher numbers have higher priority
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
                disabled={role.isSystemRole}
              />
              <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                Active
              </Label>
            </div>
            {role.isSystemRole && (
              <p className="text-xs text-muted-foreground">
                System roles cannot be deactivated
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleModal;