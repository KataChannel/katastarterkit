import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';
import { join } from 'path';

// Core Modules (Kept after cleanup)
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './cache/cache.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLResolversModule } from './graphql/graphql.module';
import { MinioModule } from './minio/minio.module';
import { LoggerModule } from './logger/logger.module';
import { DataLoaderModule } from './common/data-loaders/data-loader.module';
import { GraphQLPerformanceModule } from './common/graphql-performance/graphql-performance.module';
import { CommonServicesModule } from './common/common-services.module';
import { UnifiedDynamicModule } from './graphql/unified-dynamic.module';
import { TestController } from './test.controller';

// Removed modules (deleted during cleanup):
// - GrokModule, AiTrainingModule, ChatbotModule, AiModule
// - RealTimeModule, SearchModule, MonitoringModule
// - KetoAnModule, FileModule, HRModule, ProductModule, ReviewModule
// - SeedModule, CallCenterModule, LmsModule, EcommerceModule, SupportChatModule
// - SecurityModule, MenuModule, BlogModule (schema incompatibility)

// Configuration
import { validationSchema } from './config/validation';
import { EnvConfigService } from './config/env-config.service';

// Resolvers
import { AppResolver } from './app.resolver';

// Interceptors
import { GraphQLLoggingInterceptor } from './interceptors/graphql-logging.interceptor';
import { InputSanitizationInterceptor } from './common/interceptors/input-sanitization.interceptor';
import { GraphQLPerformanceInterceptor } from './common/interceptors/graphql-performance.interceptor';

@Module({
  imports: [
    // Configuration - MUST BE FIRST
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      envFilePath: ['.env.local', '../.env'],
    }),

    // Core Modules - BEFORE GraphQL
    PrismaModule,
    AuthModule,
    
    // GraphQL - AFTER Core Modules
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: configService.get('NODE_ENV') !== 'production',
        introspection: configService.get('NODE_ENV') !== 'production',
        context: ({ req, res }) => ({ req, res }),
        // Disable Apollo's body parser - let Express handle it (configured in main.ts)
        bodyParserConfig: false,
        subscriptions: {
          'graphql-ws': {
            path: '/graphql',
          },
          'subscriptions-transport-ws': {
            path: '/graphql',
          },
        },
        // Security enhancements for GIAI ĐOẠN 1
        validationRules: [
          require('graphql-depth-limit')(10),
        ],
        formatError: (error) => {
          // Log security-related errors
          if (error.message.includes('depth') || error.message.includes('complexity')) {
            console.warn('GraphQL security validation failed:', error.message);
          }
          return error;
        },
      }),
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Scheduling (global) - TODO: Fix Reflector dependency issue
    // ScheduleModule.forRoot(),

    // Application Modules (Core features only - after cleanup)
    CacheModule,
    RedisModule,
    DataLoaderModule,
    GraphQLPerformanceModule,
    GraphQLResolversModule,
    MinioModule,
    LoggerModule,
    CommonServicesModule,
    UnifiedDynamicModule,
  ],
  controllers: [
    TestController,
  ],
  providers: [
    EnvConfigService,
    AppResolver,
    {
      provide: APP_INTERCEPTOR,
      useClass: GraphQLLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: InputSanitizationInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GraphQLPerformanceInterceptor,
    },
  ],
})
export class AppModule {}
