/**
 * RAG Auth Guard - Kiểm tra authentication cho RAG endpoints
 * Kết hợp với JwtAuthGuard và RolesGuard
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRoleType } from '@prisma/client';
import { UserService } from '../../services/user.service';
import { RagConfigService } from '../services/rag-config.service';

export const RAG_PUBLIC_KEY = 'ragPublic';
export const RAG_ADMIN_KEY = 'ragAdmin';

/**
 * Decorator để đánh dấu endpoint public (không cần auth)
 */
export const RagPublic = () => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (propertyKey) {
      Reflect.defineMetadata(RAG_PUBLIC_KEY, true, target, propertyKey);
    } else {
      Reflect.defineMetadata(RAG_PUBLIC_KEY, true, target);
    }
    return descriptor;
  };
};

/**
 * Decorator để yêu cầu Admin role
 */
export const RagAdminOnly = () => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (propertyKey) {
      Reflect.defineMetadata(RAG_ADMIN_KEY, true, target, propertyKey);
    } else {
      Reflect.defineMetadata(RAG_ADMIN_KEY, true, target);
    }
    return descriptor;
  };
};

@Injectable()
export class RagAuthGuard implements CanActivate {
  private readonly logger = new Logger(RagAuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly ragConfigService: RagConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if endpoint is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(RAG_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Check if endpoint requires admin
    const isAdminOnly = this.reflector.getAllAndOverride<boolean>(RAG_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Get request from context (GraphQL or REST)
    let request: any;
    try {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    } catch {
      request = context.switchToHttp().getRequest();
    }

    // Extract token
    const token = this.extractTokenFromHeader(request);

    // If public endpoint and no token, allow anonymous access
    if (isPublic && !token) {
      request.user = null;
      this.logger.debug('Public RAG endpoint - anonymous access allowed');
      return true;
    }

    // Check global auth requirement from config
    const requireAuth = this.ragConfigService.isAuthRequired();

    // If public endpoint OR auth not required globally, and no token, allow
    if ((isPublic || !requireAuth) && !token) {
      request.user = null;
      return true;
    }

    // If admin endpoint, token is required
    if (isAdminOnly && !token) {
      throw new UnauthorizedException('Authentication required for admin endpoints');
    }

    // If we have a token, validate it
    if (token) {
      try {
        const secret = this.configService.get<string>('JWT_SECRET') || 'fallback-secret-key';
        const payload = this.jwtService.verify(token, { secret });
        const user = await this.userService.findById(payload.sub);

        if (!user) {
          throw new UnauthorizedException('User not found');
        }

        if (!user.isActive) {
          throw new UnauthorizedException('User account is inactive');
        }

        request.user = {
          ...user,
          sub: user.id,
        };

        // Check admin requirement
        if (isAdminOnly && user.roleType !== UserRoleType.ADMIN) {
          this.logger.warn(`Non-admin user ${user.id} attempted to access admin endpoint`);
          throw new ForbiddenException('Admin access required');
        }

        this.logger.debug(`RAG auth passed for user: ${user.id} (${user.email})`);
        return true;
      } catch (error) {
        if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
          throw error;
        }

        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        }

        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid token');
        }

        this.logger.error(`RAG auth error: ${error.message}`);
        throw new UnauthorizedException('Authentication failed');
      }
    }

    // If auth required but no token
    if (requireAuth || isAdminOnly) {
      throw new UnauthorizedException('Authentication required');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request?.headers?.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
