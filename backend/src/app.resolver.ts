import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String, { name: 'hello', description: 'Hello world query' })
  hello(): string {
    return 'Hello from tazagroupcore GraphQL API!';
  }

  @Query(() => String, { name: 'version', description: 'Get API version' })
  version(): string {
    return '1.1.0';
  }
}
