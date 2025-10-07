/**
 * UserManagementHeader Component
 * 
 * Displays page title, description, and tab navigation
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Shield } from 'lucide-react';

interface UserManagementHeaderProps {
  activeTab: 'users' | 'rbac';
  onTabChange: (tab: 'users' | 'rbac') => void;
}

export function UserManagementHeader({ activeTab, onTabChange }: UserManagementHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={activeTab === 'users' ? 'default' : 'outline'}
          onClick={() => onTabChange('users')}
        >
          <Users className="w-4 h-4 mr-2" />
          Users
        </Button>
        <Button
          variant={activeTab === 'rbac' ? 'default' : 'outline'}
          onClick={() => onTabChange('rbac')}
        >
          <Shield className="w-4 h-4 mr-2" />
          RBAC
        </Button>
      </div>
    </div>
  );
}
