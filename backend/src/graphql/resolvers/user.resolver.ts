import { Resolver, Query, Mutation, Args, Context, Subscription } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PubSub } from 'graphql-subscriptions';
import { User } from '../models/user.model';
import { AuthResponse } from '../models/auth.model';
import { RegisterUserInput, LoginUserInput, UpdateUserInput } from '../inputs/user.input';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { UserRole } from '@prisma/client';

const pubSub = new PubSub();

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // Queries
  @Query(() => User, { name: 'getUserById' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60) // 60 seconds
  async getUserById(@Args('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Query(() => User, { name: 'getMe' })
  @UseGuards(JwtAuthGuard)
  async getMe(@Context() context: any): Promise<User> {
    const userId = context.req.user.id;
    return this.userService.findById(userId);
  }

  @Query(() => [User], { name: 'getUsers' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Mutations
  @Mutation(() => AuthResponse, { name: 'registerUser' })
  async registerUser(@Args('input') input: RegisterUserInput): Promise<AuthResponse> {
    const user = await this.userService.create(input);
    const tokens = await this.authService.generateTokens(user);
    
    // Publish user registration event
    pubSub.publish('userRegistered', { userRegistered: user });
    
    return {
      ...tokens,
      user,
    };
  }

  @Mutation(() => AuthResponse, { name: 'loginUser' })
  async loginUser(@Args('input') input: LoginUserInput): Promise<AuthResponse> {
    const user = await this.authService.validateUser(input.emailOrUsername, input.password);
    const tokens = await this.authService.generateTokens(user);
    
    return {
      ...tokens,
      user,
    };
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
    @Context() context: any,
  ): Promise<User> {
    const currentUser = context.req.user;
    
    // Users can only update their own profile unless they're admin
    if (currentUser.id !== id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized');
    }
    
    return this.userService.update(id, input);
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    await this.userService.delete(id);
    return true;
  }

  // Subscriptions
  @Subscription(() => User, { name: 'userRegistered' })
  userRegistered() {
    return (pubSub as any).asyncIterator('userStatusChanged');
  }
}
