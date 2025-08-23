import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

// Register the UserRole enum
registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role types',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  username: string;

  // Password is not exposed in GraphQL
  password?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations - handled by field resolvers to avoid circular dependencies
  posts?: any[];
  comments?: any[];
}
