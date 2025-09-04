import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsPhoneNumber, IsString, IsBoolean } from 'class-validator';
import { AuthProvider } from '@prisma/client';

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

  @Field(() => String)
  provider: AuthProvider;

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
