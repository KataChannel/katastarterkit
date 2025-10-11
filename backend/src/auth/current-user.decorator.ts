import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Custom decorator to get current user from request context
 * Works with both GraphQL and REST endpoints
 * 
 * Usage:
 *   @Query(() => User)
 *   @UseGuards(JwtAuthGuard)
 *   async getMe(@CurrentUser() user: User): Promise<User> {
 *     return user;
 *   }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let request;
    
    // Try GraphQL context first
    try {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    } catch {
      // Fall back to HTTP context
      request = context.switchToHttp().getRequest();
    }
    
    return request.user;
  },
);
