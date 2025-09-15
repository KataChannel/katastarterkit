import { Module, Global } from '@nestjs/common';
import { DynamicCRUDService } from '../services/dynamic-crud.service';
import { DynamicResolverService, UniversalDynamicResolver } from './resolvers/dynamic.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { setupCommonInputTypes } from './inputs/dynamic.inputs';

@Global()
@Module({
  providers: [
    PrismaService,
    DynamicCRUDService,
    DynamicResolverService,
    UniversalDynamicResolver
  ],
  exports: [
    DynamicCRUDService,
    DynamicResolverService,
    UniversalDynamicResolver
  ]
})
export class DynamicGraphQLModule {
  constructor() {
    // Setup common input types when module is initialized
    setupCommonInputTypes();
  }

  // Static method to register resolvers for specific models
  static forModels(models: Array<{
    name: string;
    modelClass: any;
    options?: {
      enableAuth?: boolean;
      enableBulkOps?: boolean;
      enablePagination?: boolean;
      customResolvers?: any[];
    };
  }>) {
    return {
      module: DynamicGraphQLModule,
      providers: [
        PrismaService,
        DynamicCRUDService,
        DynamicResolverService,
        UniversalDynamicResolver,
        // Register dynamic resolvers for each model
        ...models.map(({ name, modelClass, options }) => {
          const resolverService = new DynamicResolverService(new DynamicCRUDService(new PrismaService()));
          return resolverService.registerResolver(name, modelClass, options);
        })
      ],
      exports: [
        DynamicCRUDService,
        DynamicResolverService,
        UniversalDynamicResolver
      ]
    };
  }
}
