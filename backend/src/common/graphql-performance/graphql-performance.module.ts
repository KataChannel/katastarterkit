import { Module, Global } from '@nestjs/common';
import { GraphQLCacheService } from '../services/graphql-cache.service';
import { CacheInvalidationService } from '../services/cache-invalidation.service';
import { GraphQLCachePlugin } from '../plugins/graphql-cache.plugin';

@Global()
@Module({
  providers: [
    GraphQLCacheService,
    CacheInvalidationService,
    GraphQLCachePlugin,
  ],
  exports: [
    GraphQLCacheService,
    CacheInvalidationService,
    GraphQLCachePlugin,
  ],
})
export class GraphQLPerformanceModule {}