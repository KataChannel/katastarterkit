import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

// Removed resolvers (all deleted during cleanup):
// - UserResolver, PermissionResolver, RoleResolver, UserRbacResolver (rbac.resolver.ts deleted)
// - MenuPublicResolver, WebsiteSettingResolver (deleted)
// - GrokResolver, TaskResolver, InvoiceResolver, OramaSearchResolver, ExtModelsResolver, CustomTemplateResolver
// - PostResolver, PageResolver, CommentResolver, AuditResolver, AffiliateResolver, FileResolver, FolderResolver, OrderResolver, ProductResolver

import { UniversalQueryResolver } from './resolvers/universal-query.resolver';

// 🚀 NEW: Universal Dynamic GraphQL Resolver
import { UniversalDynamicResolver } from './resolvers/universal-dynamic.resolver';
import { DynamicGraphQLEngine } from './core/dynamic-graphql.engine';

// 🚀 NEW: Data Import/Export and Image Upload Resolvers
import { DataImportExportResolver, ImageUploadResolver } from './resolvers/data-import-export.resolver';

import { UserService } from '../services/user.service';
import { PubSubService } from '../services/pubsub.service';
import { BackendConfigService } from '../services/backend-config.service';
import { RbacService } from '../services/rbac.service';
import { DynamicQueryGeneratorService } from './services/dynamic-query-generator.service';

// Removed services (deleted during cleanup):
// - TaskService, TaskShareService, TaskCommentService, TaskMediaService
// - InvoiceService, InvoiceImportService
// - CategoryImportExportService, ProductImportExportService, ProductService
// - AffiliateUserService, AffiliateCampaignService, AffiliateTrackingService, AffiliatePaymentService, AffiliateConversionService
// - CustomTemplateService, OrderService, OtpService, PageService, PostService, NotificationService, HrService
// - BlogService, CallCenterService, CartService, CategoryService, CommentService, EnhancedAuditService, FileService

// 🚀 NEW: Data Import/Export and Image Upload Services
import { DataImportService } from '../services/data-import.service';
import { ImageUploadService } from '../services/image-upload.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MinioModule,
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  ],
  controllers: [
    // All controllers removed during cleanup
  ],
  providers: [
    // 🚀 Universal Dynamic GraphQL System
    DynamicGraphQLEngine,
    UniversalDynamicResolver,
    
    // 🚀 Data Import/Export and Image Upload
    DataImportExportResolver,
    ImageUploadResolver,
    
    // Universal Dynamic Query resolver
    UniversalQueryResolver,
    
    // Core Services
    UserService,
    PubSubService,
    BackendConfigService,
    RbacService,
    
    // 🚀 Data Import/Export and Image Upload Services
    DataImportService,
    ImageUploadService,
    
    // Dynamic Query service
    DynamicQueryGeneratorService,
  ],
  exports: [
    UserService,
    PubSubService,
    BackendConfigService,
    RbacService,
    DataImportService,
    ImageUploadService,
    DynamicQueryGeneratorService,
  ],
})
export class GraphQLResolversModule {}

