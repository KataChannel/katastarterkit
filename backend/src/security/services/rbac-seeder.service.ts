import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RbacService } from './rbac.service';

@Injectable()
export class RbacSeederService implements OnModuleInit {
  private readonly logger = new Logger(RbacSeederService.name);

  constructor(private rbacService: RbacService) {}

  async onModuleInit() {
    await this.seedDefaultRolesAndPermissions();
  }

  async seedDefaultRolesAndPermissions() {
    try {
      this.logger.log('Starting RBAC seeding...');

      // Create default permissions
      await this.createDefaultPermissions();

      // Create default roles
      await this.createDefaultRoles();

      this.logger.log('RBAC seeding completed successfully');
    } catch (error) {
      this.logger.error(`RBAC seeding failed: ${error.message}`);
    }
  }

  private async createDefaultPermissions() {
    const permissions = [
      // User Management
      { name: 'users:create', displayName: 'Create Users', resource: 'user', action: 'create', category: 'user_management' },
      { name: 'users:read', displayName: 'Read Users', resource: 'user', action: 'read', category: 'user_management' },
      { name: 'users:update', displayName: 'Update Users', resource: 'user', action: 'update', category: 'user_management' },
      { name: 'users:delete', displayName: 'Delete Users', resource: 'user', action: 'delete', category: 'user_management' },
      
      // Role Management
      { name: 'roles:create', displayName: 'Create Roles', resource: 'role', action: 'create', category: 'role_management' },
      { name: 'roles:read', displayName: 'Read Roles', resource: 'role', action: 'read', category: 'role_management' },
      { name: 'roles:update', displayName: 'Update Roles', resource: 'role', action: 'update', category: 'role_management' },
      { name: 'roles:delete', displayName: 'Delete Roles', resource: 'role', action: 'delete', category: 'role_management' },
      
      // Permission Management
      { name: 'permissions:create', displayName: 'Create Permissions', resource: 'permission', action: 'create', category: 'permission_management' },
      { name: 'permissions:read', displayName: 'Read Permissions', resource: 'permission', action: 'read', category: 'permission_management' },
      { name: 'permissions:update', displayName: 'Update Permissions', resource: 'permission', action: 'update', category: 'permission_management' },
      { name: 'permissions:delete', displayName: 'Delete Permissions', resource: 'permission', action: 'delete', category: 'permission_management' },
      
      // Task Management
      { name: 'tasks:create', displayName: 'Create Tasks', resource: 'task', action: 'create', category: 'task_management' },
      { name: 'tasks:read', displayName: 'Read Tasks', resource: 'task', action: 'read', category: 'task_management' },
      { name: 'tasks:update', displayName: 'Update Tasks', resource: 'task', action: 'update', category: 'task_management' },
      { name: 'tasks:delete', displayName: 'Delete Tasks', resource: 'task', action: 'delete', category: 'task_management' },
      { name: 'tasks:assign', displayName: 'Assign Tasks', resource: 'task', action: 'assign', category: 'task_management' },
      
      // Project Management
      { name: 'projects:create', displayName: 'Create Projects', resource: 'project', action: 'create', category: 'project_management' },
      { name: 'projects:read', displayName: 'Read Projects', resource: 'project', action: 'read', category: 'project_management' },
      { name: 'projects:update', displayName: 'Update Projects', resource: 'project', action: 'update', category: 'project_management' },
      { name: 'projects:delete', displayName: 'Delete Projects', resource: 'project', action: 'delete', category: 'project_management' },
      { name: 'projects:manage', displayName: 'Manage Projects', resource: 'project', action: 'manage', category: 'project_management' },
      
      // Security Management
      { name: 'security:audit', displayName: 'View Security Audit', resource: 'security', action: 'audit', category: 'security_management' },
      { name: 'security:monitor', displayName: 'Monitor Security', resource: 'security', action: 'monitor', category: 'security_management' },
      { name: 'security:manage', displayName: 'Manage Security', resource: 'security', action: 'manage', category: 'security_management' },
      
      // System Administration
      { name: 'system:admin', displayName: 'System Administration', resource: 'system', action: 'admin', scope: 'global', category: 'system_admin' },
      { name: 'system:config', displayName: 'System Configuration', resource: 'system', action: 'config', scope: 'global', category: 'system_admin' },
      { name: 'system:backup', displayName: 'System Backup', resource: 'system', action: 'backup', scope: 'global', category: 'system_admin' },
      
      // Content Management
      { name: 'content:create', displayName: 'Create Content', resource: 'content', action: 'create', category: 'content_management' },
      { name: 'content:read', displayName: 'Read Content', resource: 'content', action: 'read', category: 'content_management' },
      { name: 'content:update', displayName: 'Update Content', resource: 'content', action: 'update', category: 'content_management' },
      { name: 'content:delete', displayName: 'Delete Content', resource: 'content', action: 'delete', category: 'content_management' },
      { name: 'content:publish', displayName: 'Publish Content', resource: 'content', action: 'publish', category: 'content_management' },
      
      // Analytics
      { name: 'analytics:read', displayName: 'Read Analytics', resource: 'analytics', action: 'read', category: 'analytics' },
      { name: 'analytics:export', displayName: 'Export Analytics', resource: 'analytics', action: 'export', category: 'analytics' },
    ];

    for (const permission of permissions) {
      try {
        await this.rbacService.createPermission({
          ...permission,
          description: `Permission to ${permission.action} ${permission.resource}`,
        });
        this.logger.debug(`Created permission: ${permission.name}`);
      } catch (error) {
        if (error.code === 'P2002') {
          this.logger.debug(`Permission already exists: ${permission.name}`);
        } else {
          this.logger.error(`Failed to create permission ${permission.name}: ${error.message}`);
        }
      }
    }
  }

  private async createDefaultRoles() {
    const roles = [
      {
        name: 'super_admin',
        displayName: 'Super Administrator',
        description: 'Full system access with all permissions',
        priority: 1000,
        permissions: [
          'system:admin', 'system:config', 'system:backup',
          'users:create', 'users:read', 'users:update', 'users:delete',
          'roles:create', 'roles:read', 'roles:update', 'roles:delete',
          'permissions:create', 'permissions:read', 'permissions:update', 'permissions:delete',
          'security:audit', 'security:monitor', 'security:manage',
          'tasks:create', 'tasks:read', 'tasks:update', 'tasks:delete', 'tasks:assign',
          'projects:create', 'projects:read', 'projects:update', 'projects:delete', 'projects:manage',
          'content:create', 'content:read', 'content:update', 'content:delete', 'content:publish',
          'analytics:read', 'analytics:export'
        ]
      },
      {
        name: 'admin',
        displayName: 'Administrator',
        description: 'Administrative access for user and content management',
        priority: 900,
        permissions: [
          'users:create', 'users:read', 'users:update', 'users:delete',
          'roles:read', 'roles:update',
          'permissions:read',
          'security:audit', 'security:monitor',
          'tasks:create', 'tasks:read', 'tasks:update', 'tasks:delete', 'tasks:assign',
          'projects:create', 'projects:read', 'projects:update', 'projects:delete', 'projects:manage',
          'content:create', 'content:read', 'content:update', 'content:delete', 'content:publish',
          'analytics:read', 'analytics:export'
        ]
      },
      {
        name: 'manager',
        displayName: 'Manager',
        description: 'Project and team management capabilities',
        priority: 800,
        permissions: [
          'users:read', 'users:update',
          'tasks:create', 'tasks:read', 'tasks:update', 'tasks:assign',
          'projects:create', 'projects:read', 'projects:update', 'projects:manage',
          'content:create', 'content:read', 'content:update', 'content:publish',
          'analytics:read'
        ]
      },
      {
        name: 'team_lead',
        displayName: 'Team Lead',
        description: 'Team leadership with task and content management',
        priority: 700,
        permissions: [
          'users:read',
          'tasks:create', 'tasks:read', 'tasks:update', 'tasks:assign',
          'projects:read', 'projects:update',
          'content:create', 'content:read', 'content:update',
          'analytics:read'
        ]
      },
      {
        name: 'user',
        displayName: 'Regular User',
        description: 'Standard user with basic access',
        priority: 600,
        permissions: [
          'tasks:create', 'tasks:read', 'tasks:update',
          'projects:read',
          'content:create', 'content:read', 'content:update'
        ]
      },
      {
        name: 'viewer',
        displayName: 'Viewer',
        description: 'Read-only access to content and tasks',
        priority: 500,
        permissions: [
          'tasks:read',
          'projects:read',
          'content:read'
        ]
      },
      {
        name: 'guest',
        displayName: 'Guest',
        description: 'Limited read-only access',
        priority: 100,
        permissions: [
          'content:read'
        ]
      }
    ];

    for (const roleData of roles) {
      try {
        // Create role first
        const role = await this.rbacService.createRole({
          name: roleData.name,
          displayName: roleData.displayName,
          description: roleData.description,
        }, 'system');

        // Update priority
        await this.rbacService.updateRole(role.id, {
          ...roleData,
          priority: roleData.priority,
        });

        // Get permission IDs
        const allPermissions = await this.rbacService.getAllPermissions();
        const permissionIds = allPermissions
          .filter(p => roleData.permissions.includes(p.name))
          .map(p => p.id);

        // Assign permissions to role
        if (permissionIds.length > 0) {
          await this.rbacService.assignPermissionsToRole(role.id, permissionIds, 'system');
        }

        this.logger.debug(`Created role: ${roleData.name} with ${permissionIds.length} permissions`);
      } catch (error) {
        if (error.code === 'P2002') {
          this.logger.debug(`Role already exists: ${roleData.name}`);
        } else {
          this.logger.error(`Failed to create role ${roleData.name}: ${error.message}`);
        }
      }
    }
  }
}