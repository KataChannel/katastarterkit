import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { UsersIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline';
import RoleManagement from './RoleManagement';
import PermissionManagement from './PermissionManagement';
import UserRoleAssignment from './UserRoleAssignment';


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface RbacManagementProps {
  className?: string;
}

const RbacManagement: React.FC<RbacManagementProps> = ({ className = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabs = [
    {
      name: 'Roles',
      icon: UsersIcon,
      component: RoleManagement,
      description: 'Manage system roles and their hierarchies',
    },
    {
      name: 'Permissions',
      icon: KeyIcon,
      component: PermissionManagement,
      description: 'Define and manage system permissions',
    },
    {
      name: 'User Assignments',
      icon: ShieldCheckIcon,
      component: UserRoleAssignment,
      description: 'Assign roles and permissions to users',
    },
  ];

  return (
    <div className={`w-full ${className}`}>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Role & Permission Management
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage system access control, roles, and permissions
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tab.List className="flex space-x-8 px-6 border-b border-gray-200">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'flex items-center py-4 px-1 border-b-2 font-medium text-sm focus:outline-none',
                    selected
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )
                }
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.name}
              </Tab>
            ))}
          </Tab.List>

          {/* Tab Panels */}
          <Tab.Panels>
            {tabs.map((tab, index) => (
              <Tab.Panel key={tab.name} className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">{tab.description}</p>
                </div>
                <tab.component />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
};

export default RbacManagement;