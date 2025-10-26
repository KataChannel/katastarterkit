'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Save, Loader2, AlertCircle, Edit } from 'lucide-react';
import { useAdminUpdateUser } from '@/lib/hooks/useUserManagement';
import { toast } from '@/hooks/use-toast';

interface EditUserModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  roleType: 'ADMIN' | 'USER' | 'GUEST';
  isActive: boolean;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
}

interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
}

export function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
  const [adminUpdateUser, { loading }] = useAdminUpdateUser();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    roleType: 'USER',
    isActive: true,
    isVerified: false,
    isTwoFactorEnabled: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync form data with user prop
  useEffect(() => {
    if (user && isOpen) {
      const newFormData: FormData = {
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        roleType: user.roleType || 'USER',
        isActive: user.isActive ?? true,
        isVerified: user.isVerified ?? false,
        isTwoFactorEnabled: user.isTwoFactorEnabled ?? false,
      };
      setFormData(newFormData);
      setErrors({});
      setSubmitError(null);
      setHasChanges(false);
    }
  }, [user, isOpen]);

  // Validation function
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
    }

    // Email validation (optional but must be valid if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && !/^[\d\s+()-]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const result = await adminUpdateUser({
        variables: {
          id: user.id,
          input: {
            username: formData.username.trim(),
            email: formData.email.trim() || undefined,
            firstName: formData.firstName.trim() || undefined,
            lastName: formData.lastName.trim() || undefined,
            phone: formData.phone.trim() || undefined,
            roleType: formData.roleType,
            isActive: formData.isActive,
            isVerified: formData.isVerified,
            isTwoFactorEnabled: formData.isTwoFactorEnabled,
          },
        },
      });

      if (result.data?.adminUpdateUser) {
        toast({
          title: 'User updated successfully',
          description: `Changes to "${result.data.adminUpdateUser.username}" have been saved.`,
          type: 'success',
        });

        onSuccess();
        onClose();
      }
    } catch (err: any) {
      const errorMessage = err.graphQLErrors?.[0]?.message || err.message || 'Failed to update user';
      setSubmitError(errorMessage);
      
      toast({
        title: 'Failed to update user',
        description: errorMessage,
        type: 'error',
      });
    }
  }, [user, formData, validateForm, adminUpdateUser, onSuccess, onClose]);

  const handleInputChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleClose = useCallback(() => {
    if (!loading) {
      if (hasChanges) {
        const confirmed = confirm('You have unsaved changes. Are you sure you want to close?');
        if (!confirmed) return;
      }
      onClose();
    }
  }, [loading, hasChanges, onClose]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              <CardTitle>Edit User</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={loading}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Update information for {user.username}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error Alert */}
            {submitError && (
              <Alert className="border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Account Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="required">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Enter username"
                    disabled={loading}
                    className={errors.username ? 'border-red-500' : ''}
                    autoFocus
                  />
                  {errors.username && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="user@example.com"
                    disabled={loading}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    disabled={loading}
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  disabled={loading}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Role & Permissions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Role & Permissions
              </h3>
              
              {/* Role Type */}
              <div className="space-y-2">
                <Label htmlFor="roleType">Role Type</Label>
                <Select
                  value={formData.roleType}
                  onValueChange={(value) => handleInputChange('roleType', value)}
                  disabled={loading}
                >
                  <SelectTrigger id="roleType">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="GUEST">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive" className="cursor-pointer">Active Status</Label>
                    <p className="text-xs text-muted-foreground">
                      User can log in and access the system
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="isVerified" className="cursor-pointer">Verified Status</Label>
                    <p className="text-xs text-muted-foreground">
                      User's email/account has been verified
                    </p>
                  </div>
                  <Switch
                    id="isVerified"
                    checked={formData.isVerified}
                    onCheckedChange={(checked) => handleInputChange('isVerified', checked)}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="isTwoFactorEnabled" className="cursor-pointer">Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">
                      Require 2FA for enhanced security
                    </p>
                  </div>
                  <Switch
                    id="isTwoFactorEnabled"
                    checked={formData.isTwoFactorEnabled}
                    onCheckedChange={(checked) => handleInputChange('isTwoFactorEnabled', checked)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !hasChanges}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
