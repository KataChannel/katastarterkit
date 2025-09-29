import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsPhoneNumber, IsString, IsBoolean, IsEnum, IsArray, ArrayMinSize, IsUUID, IsInt, Min, Max } from 'class-validator';
import { $Enums } from '@prisma/client';

// Import to ensure AuthProvider enum is registered
import '../models/auth-extended.model';

const AuthProvider = $Enums.AuthProvider;

// Register enum for GraphQL
registerEnumType($Enums.UserRoleType, {
  name: 'UserRoleType',
});

@InputType()
export class RegisterUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field()
  @IsNotEmpty()
  username: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  avatar?: string;
}

@InputType()
export class LoginUserInput {
  @Field()
  @IsNotEmpty()
  emailOrUsername: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

@InputType()
export class PhoneLoginInput {
  @Field()
  @IsPhoneNumber()
  phone: string;

  @Field()
  @IsString()
  otp: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

@InputType()
export class SocialLoginInput {
  @Field()
  @IsString()
  token: string;

  @Field(() => AuthProvider)
  @IsEnum(AuthProvider)
  provider: $Enums.AuthProvider;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  providerId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsString()
  token: string;

  @Field()
  @MinLength(6)
  newPassword: string;
}

@InputType()
export class VerifyEmailInput {
  @Field()
  @IsString()
  token: string;
}

@InputType()
export class VerifyPhoneInput {
  @Field()
  @IsPhoneNumber()
  phone: string;

  @Field()
  @IsString()
  otp: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(3)
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  avatar?: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsString()
  currentPassword: string;

  @Field()
  @MinLength(6)
  newPassword: string;
}

@InputType()
export class RequestPhoneVerificationInput {
  @Field()
  @IsPhoneNumber()
  phone: string;
}

@InputType()
export class UserSearchInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => $Enums.UserRoleType, { nullable: true })
  @IsOptional()
  @IsEnum($Enums.UserRoleType)
  roleType?: $Enums.UserRoleType;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  createdAfter?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  createdBefore?: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number;

  @Field({ nullable: true, defaultValue: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @Field({ nullable: true, defaultValue: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: string;
}

@InputType()
export class BulkUserActionInput {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  userIds: string[];

  @Field()
  @IsString()
  action: string; // 'activate', 'deactivate', 'delete', 'verify', 'changeRole'

  @Field(() => $Enums.UserRoleType, { nullable: true })
  @IsOptional()
  @IsEnum($Enums.UserRoleType)
  newRole?: $Enums.UserRoleType;
}

@InputType()
export class AdminUpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field(() => $Enums.UserRoleType, { nullable: true })
  @IsOptional()
  @IsEnum($Enums.UserRoleType)
  roleType?: $Enums.UserRoleType;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isTwoFactorEnabled?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string;
}

@InputType()
export class AdminCreateUserInput {
  @Field()
  @IsNotEmpty()
  username: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @Field(() => $Enums.UserRoleType, { nullable: true, defaultValue: $Enums.UserRoleType.USER })
  @IsOptional()
  @IsEnum($Enums.UserRoleType)
  roleType?: $Enums.UserRoleType;

  @Field({ nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string;
}
