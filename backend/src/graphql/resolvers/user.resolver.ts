import { Resolver, Query, Mutation, Args, Context, Subscription, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CurrentUser } from '../../auth/current-user.decorator';
import { User, UserSearchResult, UserStats, BulkUserActionResult } from '../models/user.model';
import { AuthResponse } from '../models/auth.model';
import { OtpResponse } from '../models/otp.model';
import { RegisterUserInput, LoginUserInput, UpdateUserInput, SocialLoginInput, PhoneLoginInput, RequestPhoneVerificationInput, UserSearchInput, BulkUserActionInput, AdminUpdateUserInput, AdminCreateUserInput } from '../inputs/user.input';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { OtpService } from '../../services/otp.service';
import { PubSubService } from '../../services/pubsub.service';
import { $Enums } from '@prisma/client';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly pubSubService: PubSubService,
  ) {}

  // Queries
  @Query(() => User, { name: 'getUserById' })
  @UseGuards(JwtAuthGuard)
  async getUserById(@Args('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Query(() => User, { name: 'getMe' })
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: User): Promise<User> {
    // User is already attached by JwtAuthGuard and extracted by CurrentUser decorator
    // Just return the full user object from database to ensure all fields are populated
    return this.userService.findById(user.id);
  }

  @Query(() => [User], { name: 'getUsers' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles($Enums.UserRoleType.ADMIN)
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Mutations
  @Mutation(() => AuthResponse, { name: 'registerUser' })
  async registerUser(@Args('input') input: RegisterUserInput): Promise<AuthResponse> {
    const user = await this.userService.create(input);
    const tokens = await this.authService.generateTokens(user);
    
    // Publish user registration event
    this.pubSubService.publishUserRegistered(user);
    
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

  @Mutation(() => AuthResponse, { name: 'loginWithGoogle' })
  async loginWithGoogle(@Args('input') input: SocialLoginInput): Promise<AuthResponse> {
    console.log('Input to loginWithGoogle:', input);
    
    const result = await this.authService.loginWithGoogle(input);
    console.log('Result from authService:', result);
    
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  @Mutation(() => AuthResponse, { name: 'loginWithFacebook' })
  async loginWithFacebook(@Args('input') input: SocialLoginInput): Promise<AuthResponse> {
    const result = await this.authService.loginWithFacebook(
      input.token,
      input.providerId
    );
    
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  @Mutation(() => AuthResponse, { name: 'loginWithPhone' })
  async loginWithPhone(@Args('input') input: PhoneLoginInput): Promise<AuthResponse> {
    // Verify OTP first
    const isValidOtp = await this.otpService.verifyOtp(input.phone, input.otp);
    
    if (!isValidOtp) {
      throw new Error('Invalid or expired OTP');
    }

    const result = await this.authService.loginWithPhone(input.phone);
    
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  @Mutation(() => OtpResponse, { name: 'requestPhoneVerification' })
  async requestPhoneVerification(@Args('input') input: RequestPhoneVerificationInput): Promise<OtpResponse> {
    return await this.otpService.requestPhoneVerification(input.phone);
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
    if (currentUser.id !== id && currentUser.roleType !== $Enums.UserRoleType.ADMIN) {
      throw new Error('Unauthorized');
    }
    
    return this.userService.update(id, input);
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles($Enums.UserRoleType.ADMIN)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    await this.userService.delete(id);
    return true;
  }

  // Admin-specific queries and mutations
  @Query(() => UserSearchResult, { name: 'searchUsers' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles($Enums.UserRoleType.ADMIN)
  async searchUsers(@Args('input') input: UserSearchInput): Promise<UserSearchResult> {
    return this.userService.searchUsers(input);
  }

  @Query(() => UserStats, { name: 'getUserStats' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles($Enums.UserRoleType.ADMIN)
  async getUserStats(): Promise<UserStats> {
    return this.userService.getUserStats();
  }

  @Mutation(() => BulkUserActionResult, { name: 'bulkUserAction' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles($Enums.UserRoleType.ADMIN)
  async bulkUserAction(@Args('input') input: BulkUserActionInput): Promise<BulkUserActionResult> {
    return this.userService.bulkUserAction(input);
  }

  @Mutation(() => User, { name: 'adminUpdateUser' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles($Enums.UserRoleType.ADMIN)
  async adminUpdateUser(
    @Args('id') id: string,
    @Args('input') input: AdminUpdateUserInput,
  ): Promise<User> {
    return this.userService.adminUpdateUser(id, input);
  }

  @Mutation(() => User, { name: 'adminCreateUser' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles($Enums.UserRoleType.ADMIN)
  async adminCreateUser(@Args('input') input: AdminCreateUserInput): Promise<User> {
    return this.userService.adminCreateUser(input);
  }

  // Field resolvers
  @ResolveField('role', () => $Enums.UserRoleType)
  async role(@Parent() user: User): Promise<$Enums.UserRoleType> {
    return user.roleType;
  }

  // Subscriptions
  @Subscription(() => User, { name: 'userRegistered' })
  userRegistered() {
    return this.pubSubService.getUserRegisteredIterator();
  }
}
