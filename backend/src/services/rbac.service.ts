import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Permission, UserRoleAssignment, UserPermission } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateRoleInput,
  UpdateRoleInput,
  RoleSearchInput,
  CreatePermissionInput,
  UpdatePermissionInput,
  PermissionSearchInput,
  AssignRolePermissionInput,
  AssignUserRoleInput,
  AssignUserPermissionInput,
} from '../graphql/inputs/rbac.input';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  // Permission Management
  async getPermissionById(id: string): Promise<Permission> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException(`Permission not found with id: ${id}`);
    }
    return permission;
  }

  async createPermission(input: CreatePermissionInput): Promise<Permission> {
    // Check if permission already exists
    const existing = await this.prisma.permission.findUnique({
      where: {
        resource_action_scope: {
          resource: input.resource,
          action: input.action,
          scope: input.scope || null,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Permission "${input.resource}:${input.action}${input.scope ? ':' + input.scope : ''}" already exists`
      );
    }

    return this.prisma.permission.create({
      data: {
        name: input.name,
        displayName: input.displayName,
        description: input.description,
        resource: input.resource,
        action: input.action,
        scope: input.scope,
        category: input.category || 'general',
        conditions: input.conditions,
        metadata: input.metadata,
      },
    });
  }

  async updatePermission(id: string, input: UpdatePermissionInput): Promise<Permission> {
    const permission = await this.prisma.permission.findUnique({ where: { id } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (permission.isSystemPerm && input.isActive === false) {
      throw new ForbiddenException('Cannot deactivate system permission');
    }

    return this.prisma.permission.update({
      where: { id },
      data: input,
    });
  }

  async deletePermission(id: string): Promise<boolean> {
    const permission = await this.prisma.permission.findUnique({ where: { id } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (permission.isSystemPerm) {
      throw new ForbiddenException('Cannot delete system permission');
    }

    await this.prisma.permission.delete({ where: { id } });
    return true;
  }

  async searchPermissions(input: PermissionSearchInput): Promise<any> {
    const where: any = {};

    if (input.search) {
      where.OR = [
        { name: { contains: input.search, mode: 'insensitive' } },
        { displayName: { contains: input.search, mode: 'insensitive' } },
        { description: { contains: input.search, mode: 'insensitive' } },
      ];
    }

    if (input.resource) where.resource = input.resource;
    if (input.action) where.action = input.action;
    if (input.category) where.category = input.category;
    if (input.isActive !== undefined) where.isActive = input.isActive;

    const [permissions, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        skip: (input.page || 0) * (input.size || 20),
        take: input.size || 20,
        orderBy: {
          [input.sortBy || 'name']: input.sortOrder || 'asc',
        },
      }),
      this.prisma.permission.count({ where }),
    ]);

    return {
      permissions,
      total,
      page: input.page || 0,
      size: input.size || 20,
      totalPages: Math.ceil(total / (input.size || 20)),
    };
  }

  // Role Management
  async getRoleById(id: string): Promise<any> {
    const roleData = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        children: true,
      },
    });
    if (!roleData) {
      throw new NotFoundException(`Role not found with id: ${id}`);
    }
    
    // Transform the data to match GraphQL schema expectations
    return {
      ...roleData,
      permissions: roleData.permissions.map(rp => rp.permission).filter(p => p !== null)
    };
  }

  async createRole(input: CreateRoleInput): Promise<any> {
    // Check if role name already exists
    const existing = await this.prisma.role.findUnique({
      where: { name: input.name },
    });

    if (existing) {
      throw new ConflictException(`Role "${input.name}" already exists`);
    }

    // Validate parent role if specified
    if (input.parentId) {
      const parent = await this.prisma.role.findUnique({
        where: { id: input.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Parent role not found');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // Create role
      const role = await tx.role.create({
        data: {
          name: input.name,
          displayName: input.displayName,
          description: input.description,
          parentId: input.parentId,
          priority: input.priority || 0,
          metadata: input.metadata,
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
          children: true,
        },
      });

      // Assign permissions if provided
      if (input.permissionIds && input.permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: input.permissionIds.map((permId) => ({
            roleId: role.id,
            permissionId: permId,
            effect: 'allow',
          })),
        });
      }

      // Fetch updated role with permissions
      const updatedRole = await tx.role.findUnique({
        where: { id: role.id },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
          children: true,
        },
      });

      // Transform the data to match GraphQL schema expectations
      return {
        ...updatedRole,
        permissions: updatedRole.permissions.map(rp => rp.permission).filter(p => p !== null)
      };
    });
  }

  async updateRole(id: string, input: UpdateRoleInput): Promise<any> {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystemRole && input.isActive === false) {
      throw new ForbiddenException('Cannot deactivate system role');
    }

    // Validate parent role if specified
    if (input.parentId) {
      const parent = await this.prisma.role.findUnique({
        where: { id: input.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Parent role not found');
      }
    }

    const roleData = await this.prisma.role.update({
      where: { id },
      data: input,
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        children: true,
      },
    });
    
    // Transform the data to match GraphQL schema expectations
    return {
      ...roleData,
      permissions: roleData.permissions.map(rp => rp.permission).filter(p => p !== null)
    };
  }

  async deleteRole(id: string): Promise<boolean> {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystemRole) {
      throw new ForbiddenException('Cannot delete system role');
    }

    await this.prisma.role.delete({ where: { id } });
    return true;
  }

  async searchRoles(input: RoleSearchInput): Promise<any> {
    const where: any = {};

    if (input.search) {
      where.OR = [
        { name: { contains: input.search, mode: 'insensitive' } },
        { displayName: { contains: input.search, mode: 'insensitive' } },
        { description: { contains: input.search, mode: 'insensitive' } },
      ];
    }

    if (input.isActive !== undefined) where.isActive = input.isActive;
    if (input.parentId) where.parentId = input.parentId;

    const [rolesData, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip: (input.page || 0) * (input.size || 20),
        take: input.size || 20,
        orderBy: {
          [input.sortBy || 'name']: input.sortOrder || 'asc',
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
          parent: true,
          children: true,
        },
      }),
      this.prisma.role.count({ where }),
    ]);

    // Transform the data to match GraphQL schema expectations
    const roles = rolesData.map(role => ({
      ...role,
      permissions: role.permissions.map(rp => rp.permission).filter(p => p !== null)
    }));

    return {
      roles,
      total,
      page: input.page || 0,
      size: input.size || 20,
      totalPages: Math.ceil(total / (input.size || 20)),
    };
  }

  // Role-Permission Assignment
  async assignRolePermissions(input: AssignRolePermissionInput): Promise<boolean> {
    await this.prisma.$transaction(async (tx) => {
      // Remove existing permissions for this role
      await tx.rolePermission.deleteMany({
        where: { roleId: input.roleId },
      });

      // Assign new permissions
      if (input.permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: input.permissionIds.map((permId) => ({
            roleId: input.roleId,
            permissionId: permId,
            effect: input.effect || 'allow',
            conditions: input.conditions,
            expiresAt: input.expiresAt,
          })),
        });
      }
    });

    return true;
  }

  // User Role Assignment
  async assignUserRoles(input: AssignUserRoleInput): Promise<boolean> {
    await this.prisma.$transaction(async (tx) => {
      // Remove existing role assignments for this user
      await tx.userRoleAssignment.deleteMany({
        where: { userId: input.userId },
      });

      // Assign new roles
      if (input.roleIds.length > 0) {
        await tx.userRoleAssignment.createMany({
          data: input.roleIds.map((roleId) => ({
            userId: input.userId,
            roleId: roleId,
            effect: input.effect || 'allow',
            scope: input.scope,
            conditions: input.conditions,
            expiresAt: input.expiresAt,
          })),
        });
      }
    });

    return true;
  }

  // User Permission Assignment
  async assignUserPermissions(input: AssignUserPermissionInput): Promise<boolean> {
    await this.prisma.$transaction(async (tx) => {
      // Remove existing direct permissions for this user
      await tx.userPermission.deleteMany({
        where: { userId: input.userId },
      });

      // Assign new permissions
      if (input.permissionIds.length > 0) {
        await tx.userPermission.createMany({
          data: input.permissionIds.map((permId) => ({
            userId: input.userId,
            permissionId: permId,
            effect: input.effect || 'allow',
            scope: input.scope,
            conditions: input.conditions,
            expiresAt: input.expiresAt,
            reason: input.reason,
          })),
        });
      }
    });

    return true;
  }

  // Get User's Effective Permissions
  async getUserEffectivePermissions(userId: string): Promise<any> {
    const [roleAssignmentsData, directPermissions] = await Promise.all([
      this.prisma.userRoleAssignment.findMany({
        where: { userId, effect: 'allow' },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.userPermission.findMany({
        where: { userId, effect: 'allow' },
        include: {
          permission: true,
        },
      }),
    ]);

    // Transform role assignments to match GraphQL schema expectations
    const roleAssignments = roleAssignmentsData.map(assignment => ({
      ...assignment,
      role: {
        ...assignment.role,
        permissions: assignment.role.permissions.map(rp => rp.permission).filter(p => p !== null)
      }
    }));

    // Collect all permissions from roles
    const rolePermissions = roleAssignments.flatMap((assignment) =>
      assignment.role.permissions
    );

    // Combine with direct permissions
    const allPermissions = [
      ...rolePermissions,
      ...directPermissions.map((up) => up.permission).filter(p => p !== null),
    ];

    // Remove duplicates
    const uniquePermissions = allPermissions.filter(
      (permission, index, self) =>
        index === self.findIndex((p) => p.id === permission.id)
    );

    return {
      userId,
      roleAssignments,
      directPermissions,
      effectivePermissions: uniquePermissions,
      summary: {
        totalDirectPermissions: directPermissions.length,
        totalRoleAssignments: roleAssignments.length,
        totalEffectivePermissions: uniquePermissions.length,
        lastUpdated: new Date(),
      },
    };
  }

  // Initialize System Roles and Permissions
  async initializeSystemRolePermissions(): Promise<void> {
    // Create system permissions
    const systemPermissions = [
      {
        name: 'users.create',
        displayName: 'Create Users',
        resource: 'user',
        action: 'create',
        category: 'user_management',
      },
      {
        name: 'users.read',
        displayName: 'Read Users',
        resource: 'user',
        action: 'read',
        category: 'user_management',
      },
      {
        name: 'users.update',
        displayName: 'Update Users',
        resource: 'user',
        action: 'update',
        category: 'user_management',
      },
      {
        name: 'users.delete',
        displayName: 'Delete Users',
        resource: 'user',
        action: 'delete',
        category: 'user_management',
      },
      {
        name: 'roles.manage',
        displayName: 'Manage Roles',
        resource: 'role',
        action: 'manage',
        category: 'role_management',
      },
      {
        name: 'permissions.manage',
        displayName: 'Manage Permissions',
        resource: 'permission',
        action: 'manage',
        category: 'permission_management',
      },
    ];

    for (const perm of systemPermissions) {
      await this.prisma.permission.upsert({
        where: {
          resource_action_scope: {
            resource: perm.resource,
            action: perm.action,
            scope: null,
          },
        },
        update: {},
        create: {
          ...perm,
          isSystemPerm: true,
        },
      });
    }

    // Create system roles
    const superAdminRole = await this.prisma.role.upsert({
      where: { name: 'super_admin' },
      update: {},
      create: {
        name: 'super_admin',
        displayName: 'Super Administrator',
        description: 'Full system access',
        isSystemRole: true,
        priority: 1000,
      },
    });

    const adminRole = await this.prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        displayName: 'Administrator',
        description: 'Administrative access',
        isSystemRole: true,
        priority: 500,
      },
    });

    // Assign all permissions to super admin role
    const allPermissions = await this.prisma.permission.findMany();
    for (const permission of allPermissions) {
      await this.prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: superAdminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
          effect: 'allow',
        },
      });
    }
  }
}