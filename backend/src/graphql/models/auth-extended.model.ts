import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole, AuthProvider, TokenType } from '@prisma/client';

registerEnumType(UserRole, {
  name: 'UserRole',
});

registerEnumType(AuthProvider, {
  name: 'AuthProvider',
});

registerEnumType(TokenType, {
  name: 'TokenType',
});

@ObjectType()
export class AuthMethod {
  @Field(() => ID)
  id: string;

  @Field(() => AuthProvider)
  provider: AuthProvider;

  @Field({ nullable: true })
  providerId?: string;

  @Field()
  isVerified: boolean;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class VerificationToken {
  @Field(() => ID)
  id: string;

  @Field()
  token: string;

  @Field(() => TokenType)
  type: TokenType;

  @Field()
  expiresAt: Date;

  @Field()
  isUsed: boolean;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class UserSession {
  @Field(() => ID)
  id: string;

  @Field()
  sessionId: string;

  @Field({ nullable: true })
  ipAddress?: string;

  @Field({ nullable: true })
  userAgent?: string;

  @Field()
  isActive: boolean;

  @Field()
  expiresAt: Date;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class AuditLog {
  @Field(() => ID)
  id: string;

  @Field()
  action: string;

  @Field({ nullable: true })
  details?: string;

  @Field({ nullable: true })
  ipAddress?: string;

  @Field({ nullable: true })
  userAgent?: string;

  @Field()
  createdAt: Date;
}
