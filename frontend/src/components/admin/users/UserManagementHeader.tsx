/**
 * UserManagementHeader Component
 * 
 * Displays page title, description, and tab navigation
 * Updated with shadcn Tabs component for better UX
 */

'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, Settings } from 'lucide-react';

interface UserManagementHeaderProps {
  activeTab: 'users' | 'rbac';
  onTabChange: (tab: 'users' | 'rbac') => void;
}

export function UserManagementHeader({ activeTab, onTabChange }: UserManagementHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Manage users, roles, and permissions across the system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'users' | 'rbac')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="rbac" className="gap-2">
            <Shield className="w-4 h-4" />
            RBAC & Permissions
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
