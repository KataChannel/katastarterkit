"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLResolversModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const universal_query_resolver_1 = require("./resolvers/universal-query.resolver");
const universal_dynamic_resolver_1 = require("./resolvers/universal-dynamic.resolver");
const dynamic_graphql_engine_1 = require("./core/dynamic-graphql.engine");
const data_import_export_resolver_1 = require("./resolvers/data-import-export.resolver");
const user_service_1 = require("../services/user.service");
const pubsub_service_1 = require("../services/pubsub.service");
const backend_config_service_1 = require("../services/backend-config.service");
const rbac_service_1 = require("../services/rbac.service");
const dynamic_query_generator_service_1 = require("./services/dynamic-query-generator.service");
const data_import_service_1 = require("../services/data-import.service");
const image_upload_service_1 = require("../services/image-upload.service");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_module_1 = require("../auth/auth.module");
const minio_module_1 = require("../minio/minio.module");
let GraphQLResolversModule = class GraphQLResolversModule {
};
exports.GraphQLResolversModule = GraphQLResolversModule;
exports.GraphQLResolversModule = GraphQLResolversModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            minio_module_1.MinioModule,
            platform_express_1.MulterModule.register({
                limits: {
                    fileSize: 10 * 1024 * 1024,
                },
            }),
        ],
        controllers: [],
        providers: [
            dynamic_graphql_engine_1.DynamicGraphQLEngine,
            universal_dynamic_resolver_1.UniversalDynamicResolver,
            data_import_export_resolver_1.DataImportExportResolver,
            data_import_export_resolver_1.ImageUploadResolver,
            universal_query_resolver_1.UniversalQueryResolver,
            user_service_1.UserService,
            pubsub_service_1.PubSubService,
            backend_config_service_1.BackendConfigService,
            rbac_service_1.RbacService,
            data_import_service_1.DataImportService,
            image_upload_service_1.ImageUploadService,
            dynamic_query_generator_service_1.DynamicQueryGeneratorService,
        ],
        exports: [
            user_service_1.UserService,
            pubsub_service_1.PubSubService,
            backend_config_service_1.BackendConfigService,
            rbac_service_1.RbacService,
            data_import_service_1.DataImportService,
            image_upload_service_1.ImageUploadService,
            dynamic_query_generator_service_1.DynamicQueryGeneratorService,
        ],
    })
], GraphQLResolversModule);
//# sourceMappingURL=graphql.module.js.map