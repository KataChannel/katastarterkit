import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShieldCheck, Key } from 'lucide-react';
import RoleManagement from './RoleManagement';
import PermissionManagement from './PermissionManagement';
import UserRoleAssignment from './UserRoleAssignment';

interface RbacManagementProps {
  className?: string;
}

const RbacManagement: React.FC<RbacManagementProps> = ({ className = '' }) => {
  const tabs = [
    {
      value: 'roles',
      label: 'Roles',
      icon: Users,
      component: RoleManagement,
      description: 'Manage system roles and their hierarchies',
    },
    {
      value: 'permissions',
      label: 'Permissions',
      icon: Key,
      component: PermissionManagement,
      description: 'Define and manage system permissions',
    },
    {
      value: 'assignments',
      label: 'User Assignments',
      icon: ShieldCheck,
      component: UserRoleAssignment,
      description: 'Assign roles and permissions to users',
    },
  ];

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Role & Permission Management</CardTitle>
          <CardDescription>
            Manage system access control, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roles" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">{tab.description}</p>
                </div>
                <tab.component />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RbacManagement;