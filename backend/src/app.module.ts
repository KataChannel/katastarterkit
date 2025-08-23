import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { join } from 'path';

// Modules
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLResolversModule } from './graphql/graphql.module';
import { GrokModule } from './grok/grok.module';
import { MinioModule } from './minio/minio.module';

// Configuration
import { validationSchema } from './config/validation';
import { EnvConfigService } from './config/env-config.service';

// Resolvers
import { AppResolver } from './app.resolver';

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
        subscriptions: {
          'graphql-ws': {
            path: '/graphql',
          },
          'subscriptions-transport-ws': {
            path: '/graphql',
          },
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
    GraphQLResolversModule,
    GrokModule,
    MinioModule,
  ],
  providers: [EnvConfigService, AppResolver],
})
export class AppModule {}
