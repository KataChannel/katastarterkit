import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { $Enums } from '@prisma/client';

// Register the UserRoleType enum
registerEnumType($Enums.UserRoleType, {
  name: 'UserRole',
  description: 'User role types',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  username: string;

  // Password is not exposed in GraphQL
  password?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => $Enums.UserRoleType)
  roleType: $Enums.UserRoleType;

  @Field()
  isActive: boolean;

  @Field()
  isVerified: boolean;

  @Field()
  isTwoFactorEnabled: boolean;

  @Field()
  failedLoginAttempts: number;

  @Field({ nullable: true })
  lockedUntil?: Date;

  @Field({ nullable: true })
  lastLoginAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations - handled by field resolvers to avoid circular dependencies
  posts?: any[];
  comments?: any[];
}

@ObjectType()
export class UserSearchResult {
  @Field(() => [User])
  users: User[];

  @Field()
  total: number;

  @Field()
  page: number;

  @Field()
  size: number;

  @Field()
  totalPages: number;
}

@ObjectType()
export class UserStats {
  @Field()
  totalUsers: number;

  @Field()
  activeUsers: number;

  @Field()
  verifiedUsers: number;

  @Field()
  newUsersThisMonth: number;

  @Field()
  adminUsers: number;

  @Field()
  regularUsers: number;

  @Field()
  guestUsers: number;
}

@ObjectType()
export class BulkUserActionResult {
  @Field()
  success: boolean;

  @Field()
  affectedCount: number;

  @Field(() => [String])
  errors: string[];

  @Field()
  message: string;
}

/**
 * Result model cho admin reset password
 * - Trả về password mới đã được tạo
 * - Trả về user đã được cập nhật
 */
@ObjectType()
export class AdminResetPasswordResult {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field()
  newPassword: string;

  @Field()
  user: User;
}
