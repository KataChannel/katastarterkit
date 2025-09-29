'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck, 
  UserX, 
  Trash2, 
  Shield, 
  Users,
  Loader2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";

interface BulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: string, newRole?: string) => Promise<void>;
  loading?: boolean;
}

export function BulkActions({ selectedCount, onBulkAction, loading }: BulkActionsProps) {
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const actions = [
    {
      value: 'activate',
      label: 'Activate Users',
      description: 'Enable selected user accounts',
      icon: UserCheck,
      variant: 'default' as const,
      color: 'text-green-600',
    },
    {
      value: 'deactivate',
      label: 'Deactivate Users',
      description: 'Disable selected user accounts',
      icon: UserX,
      variant: 'secondary' as const,
      color: 'text-orange-600',
    },
    {
      value: 'verify',
      label: 'Verify Users',
      description: 'Mark selected users as verified',
      icon: Shield,
      variant: 'default' as const,
      color: 'text-blue-600',
    },
    {
      value: 'changeRole',
      label: 'Change Role',
      description: 'Update role for selected users',
      icon: Users,
      variant: 'default' as const,
      color: 'text-purple-600',
      requiresRole: true,
    },
    {
      value: 'delete',
      label: 'Delete Users',
      description: 'Permanently remove selected users',
      icon: Trash2,
      variant: 'destructive' as const,
      color: 'text-red-600',
      dangerous: true,
    },
  ];

  const handleActionClick = (action: string) => {
    setSelectedAction(action);
    const actionConfig = actions.find(a => a.value === action);
    
    if (actionConfig?.dangerous) {
      setShowConfirmDialog(true);
    } else if (actionConfig?.requiresRole) {
      // Show role selection for changeRole action
      return;
    } else {
      executeAction(action);
    }
  };

  const executeAction = async (action: string, role?: string) => {
    try {
      await onBulkAction(action, role);
      setSelectedAction('');
      setSelectedRole('');
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const getActionDescription = () => {
    const action = actions.find(a => a.value === selectedAction);
    if (!action) return '';
    
    if (selectedAction === 'changeRole' && selectedRole) {
      return `Change role to ${selectedRole.toUpperCase()} for ${selectedCount} selected users`;
    }
    
    return `${action.description} (${selectedCount} users)`;
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedCount} selected
            </Badge>
            <span className="text-sm text-gray-600">Bulk Actions:</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Role Selection for Change Role Action */}
            {selectedAction === 'changeRole' && (
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Action Buttons */}
            {actions.map((action) => {
              const Icon = action.icon;
              const isSelected = selectedAction === action.value;
              const isDisabled = loading || (action.value === 'changeRole' && isSelected && !selectedRole);

              if (action.value === 'changeRole' && isSelected && selectedRole) {
                return (
                  <Button
                    key={action.value}
                    size="sm"
                    onClick={() => executeAction(action.value, selectedRole)}
                    disabled={isDisabled}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Icon className="w-4 h-4 mr-1" />
                    )}
                    Apply Role
                  </Button>
                );
              }

              return (
                <Button
                  key={action.value}
                  variant={action.variant}
                  size="sm"
                  onClick={() => handleActionClick(action.value)}
                  disabled={isDisabled}
                >
                  {loading && selectedAction === action.value ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <Icon className="w-4 h-4 mr-1" />
                  )}
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
              <AlertDialogDescription>
                {getActionDescription()}
                {selectedAction === 'delete' && (
                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                    <strong className="text-red-800">Warning:</strong> This action cannot be undone.
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => executeAction(selectedAction)}
                className={selectedAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}