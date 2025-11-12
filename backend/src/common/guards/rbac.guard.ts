/**
 * RBAC Guard
 * Guard để kiểm tra permissions của user
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PERMISSIONS_KEY,
  ROLES_KEY,
  IS_PUBLIC_KEY,
  PermissionRequirement,
} from '../decorators/rbac.decorator';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user is ADMIN (bypass all checks)
    if (user.roleType === 'ADMIN') {
      return true;
    }

    // Get required permissions from decorator
    const requiredPermissions =
      this.reflector.getAllAndOverride<PermissionRequirement[]>(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      );

    // Get required roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions or roles required, allow access
    if (!requiredPermissions && !requiredRoles) {
      return true;
    }

    // Check roles if specified
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = await this.checkUserHasRole(user.id, requiredRoles);
      if (hasRole) {
        return true;
      }
    }

    // Check permissions if specified
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = await this.checkUserHasPermissions(
        user.id,
        requiredPermissions,
      );
      if (hasPermission) {
        return true;
      }
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }

  /**
   * Check if user has any of the required roles
   */
  private async checkUserHasRole(
    userId: string,
    requiredRoles: string[],
  ): Promise<boolean> {
    const userRoles = await this.prisma.userRoleAssignment.findMany({
      where: {
        userId,
        effect: 'allow',
        role: {
          name: { in: requiredRoles },
          isActive: true,
        },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      include: {
        role: true,
      },
    });

    return userRoles.length > 0;
  }

  /**
   * Check if user has all required permissions
   */
  private async checkUserHasPermissions(
    userId: string,
    requiredPermissions: PermissionRequirement[],
  ): Promise<boolean> {
    for (const perm of requiredPermissions) {
      const hasPermission = await this.checkSinglePermission(userId, perm);
      if (!hasPermission) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check single permission
   */
  private async checkSinglePermission(
    userId: string,
    permission: PermissionRequirement,
  ): Promise<boolean> {
    // Check direct user permissions
    const directPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        effect: 'allow',
        permission: {
          resource: permission.resource,
          action: permission.action,
          scope: permission.scope || null,
          isActive: true,
        },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    if (directPermission) {
      return true;
    }

    // Check permissions through roles
    const rolePermissions = await this.prisma.userRoleAssignment.findMany({
      where: {
        userId,
        effect: 'allow',
        role: {
          isActive: true,
        },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      include: {
        role: {
          include: {
            permissions: {
              where: {
                effect: 'allow',
                permission: {
                  resource: permission.resource,
                  action: permission.action,
                  scope: permission.scope || null,
                  isActive: true,
                },
                OR: [
                  { expiresAt: null },
                  { expiresAt: { gt: new Date() } },
                ],
              },
            },
          },
        },
      },
    });

    return rolePermissions.some((ra) => ra.role.permissions.length > 0);
  }
}
