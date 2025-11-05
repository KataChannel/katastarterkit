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
        resource_action: {
          resource: input.resource,
          action: input.action,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Permission "${input.resource}:${input.action}" already exists`
      );
    }

    return this.prisma.permission.create({
      data: {
        description: input.description,
        resource: input.resource,
        action: input.action,
        createdById: 'system', // TODO: Get from context
      },
    });
  }

  async updatePermission(id: string, input: UpdatePermissionInput): Promise<Permission> {
    const permission = await this.prisma.permission.findUnique({ where: { id } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    // Note: System permission protection removed (isSystemPerm field doesn't exist)
    
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

    // Note: System permission protection removed (isSystemPerm field doesn't exist)

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
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    if (!roleData) {
      throw new NotFoundException(`Role not found with id: ${id}`);
    }
    
    // Transform the data to match GraphQL schema expectations
    return {
      ...roleData,
      permissions: roleData.rolePermissions?.map(rp => rp.permission).filter(p => p !== null) || []
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

    return this.prisma.$transaction(async (tx) => {
      // Create role
      const role = await tx.role.create({
        data: {
          name: input.name,
          description: input.description,
          createdById: 'system', // TODO: Get from context
        },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      // Assign permissions if provided
      if (input.permissionIds && input.permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: input.permissionIds.map((permId) => ({
            roleId: role.id,
            permissionId: permId,
          })),
        });
      }

      // Fetch updated role with permissions
      const updatedRole = await tx.role.findUnique({
        where: { id: role.id },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      // Transform the data to match GraphQL schema expectations
      return {
        ...updatedRole,
        permissions: updatedRole?.rolePermissions?.map(rp => rp.permission).filter(p => p !== null) || []
      };
    });
  }

  async updateRole(id: string, input: UpdateRoleInput): Promise<any> {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystem && input.isActive === false) {
      throw new ForbiddenException('Cannot deactivate system role');
    }

    const roleData = await this.prisma.role.update({
      where: { id },
      data: input,
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    
    // Transform the data to match GraphQL schema expectations
    return {
      ...roleData,
      permissions: roleData.rolePermissions?.map(rp => rp.permission).filter(p => p !== null) || []
    };
  }

  async deleteRole(id: string): Promise<boolean> {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystem) {
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
        { description: { contains: input.search, mode: 'insensitive' } },
      ];
    }

    if (input.isActive !== undefined) where.isActive = input.isActive;

    const [rolesData, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip: (input.page || 0) * (input.size || 20),
        take: input.size || 20,
        orderBy: {
          [input.sortBy || 'name']: input.sortOrder || 'asc',
        },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      }),
      this.prisma.role.count({ where }),
    ]);

    // Transform the data to match GraphQL schema expectations
    const roles = rolesData.map(role => ({
      ...role,
      permissions: role.rolePermissions?.map(rp => rp.permission).filter(p => p !== null) || []
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

      // Assign new permissions - with safety check
      if (input.permissionIds && input.permissionIds.length > 0) {
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
    // Fetch ALL role assignments and direct permissions
    const [allRoleAssignments, allDirectPermissions] = await Promise.all([
      this.prisma.userRoleAssignment.findMany({
        where: { userId },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.userPermission.findMany({
        where: { userId },
        include: {
          permission: true,
        },
      }),
    ]);

    // Transform role assignments to match GraphQL schema expectations
    const roleAssignments = allRoleAssignments.map(assignment => ({
      ...assignment,
      role: {
        ...assignment.role,
        permissions: assignment.role.rolePermissions?.map(rp => rp.permission).filter(p => p !== null) || []
      }
    }));

    // Collect permissions from roles
    const rolePermissions = allRoleAssignments
      .flatMap((assignment) => assignment.role.rolePermissions || [])
      .map(rp => rp.permission)
      .filter(p => p !== null);

    // Collect direct permissions
    const directPermissionsOnly = allDirectPermissions
      .map(up => up.permission)
      .filter(p => p !== null);

    // Combine all permissions
    const allPermissions = [
      ...rolePermissions,
      ...directPermissionsOnly,
    ];

    // Remove duplicates
    const uniquePermissions = allPermissions.filter(
      (permission, index, self) =>
        permission && index === self.findIndex((p) => p && p.id === permission.id)
    );

    return {
      userId,
      roleAssignments,
      directPermissions: allDirectPermissions,
      effectivePermissions: uniquePermissions,
      summary: {
        totalDirectPermissions: allDirectPermissions.length,
        totalRoleAssignments: allRoleAssignments.length,
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
        resource: 'user',
        action: 'create',
        description: 'Create Users',
      },
      {
        resource: 'user',
        action: 'read',
        description: 'Read Users',
      },
      {
        resource: 'user',
        action: 'update',
        description: 'Update Users',
      },
      {
        resource: 'user',
        action: 'delete',
        description: 'Delete Users',
      },
      {
        resource: 'role',
        action: 'manage',
        description: 'Manage Roles',
      },
      {
        resource: 'permission',
        action: 'manage',
        description: 'Manage Permissions',
      },
    ];

    for (const perm of systemPermissions) {
      await this.prisma.permission.upsert({
        where: {
          resource_action: {
            resource: perm.resource,
            action: perm.action,
          },
        },
        update: {},
        create: {
          ...perm,
          createdById: 'system',
        },
      });
    }

    // Create system roles
    const superAdminRole = await this.prisma.role.upsert({
      where: { name: 'super_admin' },
      update: {},
      create: {
        name: 'super_admin',
        description: 'Full system access',
        isSystem: true,
        createdById: 'system',
      },
    });

    const adminRole = await this.prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        description: 'Administrative access',
        isSystem: true,
        createdById: 'system',
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
        },
      });
    }
  }
}