"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const prisma_module_1 = require("./prisma/prisma.module");
const cache_module_1 = require("./cache/cache.module");
const redis_module_1 = require("./redis/redis.module");
const auth_module_1 = require("./auth/auth.module");
const graphql_module_1 = require("./graphql/graphql.module");
const minio_module_1 = require("./minio/minio.module");
const logger_module_1 = require("./logger/logger.module");
const data_loader_module_1 = require("./common/data-loaders/data-loader.module");
const graphql_performance_module_1 = require("./common/graphql-performance/graphql-performance.module");
const common_services_module_1 = require("./common/common-services.module");
const unified_dynamic_module_1 = require("./graphql/unified-dynamic.module");
const test_controller_1 = require("./test.controller");
const validation_1 = require("./config/validation");
const env_config_service_1 = require("./config/env-config.service");
const app_resolver_1 = require("./app.resolver");
const graphql_logging_interceptor_1 = require("./interceptors/graphql-logging.interceptor");
const input_sanitization_interceptor_1 = require("./common/interceptors/input-sanitization.interceptor");
const graphql_performance_interceptor_1 = require("./common/interceptors/graphql-performance.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: validation_1.validationSchema,
                envFilePath: ['.env.local', '../.env'],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            graphql_1.GraphQLModule.forRootAsync({
                driver: apollo_1.ApolloDriver,
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                    sortSchema: true,
                    playground: configService.get('NODE_ENV') !== 'production',
                    introspection: configService.get('NODE_ENV') !== 'production',
                    context: ({ req, res }) => ({ req, res }),
                    bodyParserConfig: false,
                    subscriptions: {
                        'graphql-ws': {
                            path: '/graphql',
                        },
                        'subscriptions-transport-ws': {
                            path: '/graphql',
                        },
                    },
                    validationRules: [
                        require('graphql-depth-limit')(10),
                    ],
                    formatError: (error) => {
                        if (error.message.includes('depth') || error.message.includes('complexity')) {
                            console.warn('GraphQL security validation failed:', error.message);
                        }
                        return error;
                    },
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            cache_module_1.CacheModule,
            redis_module_1.RedisModule,
            data_loader_module_1.DataLoaderModule,
            graphql_performance_module_1.GraphQLPerformanceModule,
            graphql_module_1.GraphQLResolversModule,
            minio_module_1.MinioModule,
            logger_module_1.LoggerModule,
            common_services_module_1.CommonServicesModule,
            unified_dynamic_module_1.UnifiedDynamicModule,
        ],
        controllers: [
            test_controller_1.TestController,
        ],
        providers: [
            env_config_service_1.EnvConfigService,
            app_resolver_1.AppResolver,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: graphql_logging_interceptor_1.GraphQLLoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: input_sanitization_interceptor_1.InputSanitizationInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: graphql_performance_interceptor_1.GraphQLPerformanceInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map