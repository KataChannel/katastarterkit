import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

@InputType()
export class RegisterUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  username: string;

  @Field()
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
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
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

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
