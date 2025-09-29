'use client';

import React, { useState } from 'react';
import { useAdminCreateUser } from '@/lib/hooks/useUserManagement';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, UserPlus, Loader2 } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [adminCreateUser, { loading, error }] = useAdminCreateUser();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    roleType: 'USER',
    isActive: true,
    isVerified: false,
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Basic validation
    if (!formData.username.trim()) {
      setSubmitError('Username is required');
      return;
    }
    
    if (!formData.password.trim()) {
      setSubmitError('Password is required');
      return;
    }
    
    if (formData.password.length < 6) {
      setSubmitError('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await adminCreateUser({
        variables: {
          input: {
            username: formData.username,
            email: formData.email || undefined,
            password: formData.password,
            firstName: formData.firstName || undefined,
            lastName: formData.lastName || undefined,
            phone: formData.phone || undefined,
            roleType: formData.roleType as 'ADMIN' | 'USER' | 'GUEST',
            isActive: formData.isActive,
            isVerified: formData.isVerified,
          }
        }
      });

      if (result.data?.adminCreateUser) {
        // Success
        toast({
          title: 'Success',
          description: `User "${result.data.adminCreateUser.username}" created successfully.`,
          type: 'success',
        });

        onSuccess();
        onClose();
        
        // Reset form
        setFormData({
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          password: '',
          roleType: 'USER',
          isActive: true,
          isVerified: false,
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create user';
      setSubmitError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Create New User
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  placeholder="Enter password"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="roleType">Role</Label>
              <Select value={formData.roleType} onValueChange={(value) => handleInputChange('roleType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="GUEST">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVerified"
                  checked={formData.isVerified}
                  onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isVerified">Verified</Label>
              </div>
            </div>

            {(submitError || error) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                Error creating user: {submitError || error?.message}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create User
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