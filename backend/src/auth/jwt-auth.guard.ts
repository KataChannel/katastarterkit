import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request;
    
    // Check if this is a GraphQL context or REST context
    try {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    } catch {
      // If GraphQL context creation fails, it's a REST endpoint
      request = context.switchToHttp().getRequest();
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.sub);
      
      if (!user || !user.isActive) {
        return false;
      }

      // Attach user to request with both user object and sub for compatibility
      request.user = {
        ...user,
        sub: user.id, // Ensure sub is available for the controller
      };
      return true;
    } catch (error) {
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
