import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';

// Modules
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLResolversModule } from './graphql/graphql.module';
import { GrokModule } from './grok/grok.module';
import { MinioModule } from './minio/minio.module';
import { LoggerModule } from './logger/logger.module';
import { HealthModule } from './health/health.module';
import { AiTrainingModule } from './ai-training/ai-training.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { DataLoaderModule } from './common/data-loaders/data-loader.module';

// Configuration
import { validationSchema } from './config/validation';
import { EnvConfigService } from './config/env-config.service';

// Resolvers
import { AppResolver } from './app.resolver';

// Interceptors
import { GraphQLLoggingInterceptor } from './interceptors/graphql-logging.interceptor';
import { InputSanitizationInterceptor } from './common/interceptors/input-sanitization.interceptor';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      envFilePath: ['.env.local', '../.env'],
    }),

    // GraphQL
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: configService.get('NODE_ENV') !== 'production',
        introspection: configService.get('NODE_ENV') !== 'production',
        context: ({ req, res }) => ({ req, res }),
        bodyParserConfig: {
          limit: '50mb',
        },
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

    // Health Checks
    TerminusModule,

    // Application Modules
    PrismaModule,
    CacheModule,
    AuthModule,
    DataLoaderModule,
    GraphQLResolversModule,
    GrokModule,
    MinioModule,
    LoggerModule,
    HealthModule,
    AiTrainingModule,
    ChatbotModule,
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
  ],
})
export class AppModule {}
