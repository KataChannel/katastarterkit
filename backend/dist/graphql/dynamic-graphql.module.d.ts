import { DynamicCRUDService } from '../services/dynamic-crud.service';
import { DynamicResolverService, UniversalDynamicResolver } from './resolvers/dynamic.resolver';
import { PrismaService } from '../prisma/prisma.service';
export declare class DynamicGraphQLModule {
    constructor();
    static forModels(models: Array<{
        name: string;
        modelClass: any;
        options?: {
            enableAuth?: boolean;
            enableBulkOps?: boolean;
            enablePagination?: boolean;
            customResolvers?: any[];
        };
    }>): {
        module: typeof DynamicGraphQLModule;
        providers: (typeof DynamicResolverService | typeof UniversalDynamicResolver | typeof PrismaService | typeof DynamicCRUDService | {
            provide: string;
            useFactory: (prismaService: PrismaService) => import("@nestjs/common").Type<any>;
            inject: (typeof PrismaService)[];
        })[];
        exports: (typeof DynamicResolverService | typeof UniversalDynamicResolver | typeof DynamicCRUDService)[];
    };
}
