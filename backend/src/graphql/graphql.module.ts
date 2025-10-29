import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { UserResolver } from './resolvers/user.resolver';
import { PostResolver } from './resolvers/post.resolver';
import { CommentResolver } from './resolvers/comment.resolver';
import { GrokResolver } from './resolvers/grok.resolver';
import { TaskResolver } from './resolvers/task.resolver';
import { PageResolver } from './resolvers/page.resolver';
import { InvoiceResolver } from './resolvers/invoice.resolver';
import { PermissionResolver, RoleResolver, UserRbacResolver } from './resolvers/rbac.resolver';
import { OramaSearchResolver } from './resolvers/orama-search.resolver';
import { UniversalQueryResolver } from './resolvers/universal-query.resolver';
import { ExtModelsResolver } from './resolvers/ext-models.resolver';
import { CustomTemplateResolver } from './resolvers/custom-template.resolver';

// 🚀 NEW: Universal Dynamic GraphQL Resolver
import { UniversalDynamicResolver } from './resolvers/universal-dynamic.resolver';
import { DynamicGraphQLEngine } from './core/dynamic-graphql.engine';

import { InvoiceController } from '../controllers/invoice.controller';
import { InvoiceImportController } from '../controllers/invoice-import.controller';
import { CategoryImportExportController } from '../controllers/category-import-export.controller';
import { ProductImportExportController } from '../controllers/product-import-export.controller';
import { AffiliateController } from '../controllers/affiliate.controller';
import { TrackingController } from '../controllers/tracking.controller';

import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { TaskService } from '../services/task.service';
import { TaskShareService } from '../services/task-share.service';
import { TaskCommentService } from '../services/task-comment.service';
import { TaskMediaService } from '../services/task-media.service';
import { NotificationService } from '../services/notification.service';
import { OtpService } from '../services/otp.service';
import { PubSubService } from '../services/pubsub.service';
import { PageService } from '../services/page.service';
import { InvoiceService } from '../services/invoice.service';
import { InvoiceImportService } from '../services/invoice-import.service';
import { CategoryImportExportService } from '../services/category-import-export.service';
import { ProductImportExportService } from '../services/product-import-export.service';
import { BackendConfigService } from '../services/backend-config.service';
import { RbacService } from '../services/rbac.service';
import { AffiliateUserService, AffiliateCampaignService } from '../services/affiliate.service';
import { AffiliateTrackingService } from '../services/affiliate-tracking.service';
import { AffiliatePaymentService } from '../services/affiliate-payment.service';
import { AffiliateConversionService } from '../services/affiliate-conversion.service';
import { CustomTemplateService } from '../services/custom-template.service';
import { DynamicQueryGeneratorService } from './services/dynamic-query-generator.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { GrokModule } from '../grok/grok.module';
import { MinioModule } from '../minio/minio.module';
import { SearchModule } from '../search/search.module';
import { AffiliateUserResolver, AffiliateCampaignResolver, AffiliateTrackingResolver, AffiliatePaymentResolver, AffiliateConversionResolver } from './resolvers/affiliate.resolver';
// JSON scalar handled by graphql-type-json directly

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    GrokModule,
    MinioModule,
    SearchModule,
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  ],
  controllers: [
    InvoiceController,
    InvoiceImportController,
    CategoryImportExportController,
    ProductImportExportController,
    AffiliateController,
    TrackingController,
  ],
  providers: [
    // Scalars handled by graphql-type-json directly
    
    // 🚀 NEW: Universal Dynamic GraphQL System
    DynamicGraphQLEngine,
    UniversalDynamicResolver,
    
    // Resolvers
    UserResolver,
    PostResolver,
    CommentResolver,
    GrokResolver,
    TaskResolver,
    PageResolver,
    InvoiceResolver,
    // RBAC resolvers
    PermissionResolver,
    RoleResolver,
    UserRbacResolver,
    
    // Affiliate resolvers
    AffiliateUserResolver,
    AffiliateCampaignResolver,
    AffiliateTrackingResolver,
    AffiliatePaymentResolver,
    AffiliateConversionResolver,
    
    // Search resolver
    OramaSearchResolver,
    
    // Universal Dynamic Query resolver
    UniversalQueryResolver,
    
    // External models resolver
    ExtModelsResolver,
    
    // Custom templates resolver
    CustomTemplateResolver,
    
    // Services
    UserService,
    PostService,
    CommentService,
    TaskService,
    TaskShareService,
    TaskCommentService,
    TaskMediaService,
    NotificationService,
    OtpService,
    PubSubService,
    PageService,
    InvoiceService,
    InvoiceImportService,
    CategoryImportExportService,
    ProductImportExportService,
    BackendConfigService,
    RbacService,
    
    // Custom template service
    CustomTemplateService,
    
    // Affiliate services
    AffiliateUserService,
    AffiliateCampaignService,
    AffiliateTrackingService,
    AffiliatePaymentService,
    AffiliateConversionService,
    
    // Dynamic Query service
    DynamicQueryGeneratorService,
  ],
  exports: [
    UserService,
    PostService,
    CommentService,
    TaskService,
    TaskShareService,
    TaskCommentService,
    TaskMediaService,
    NotificationService,
    PubSubService,
    PageService,
    InvoiceService,
    InvoiceImportService,
    CategoryImportExportService,
    ProductImportExportService,
    BackendConfigService,
    RbacService,
    
    // Custom template service
    CustomTemplateService,
    
    // Affiliate services
    AffiliateUserService,
    AffiliateCampaignService,
    AffiliateTrackingService,
    AffiliatePaymentService,
    AffiliateConversionService,
  ],
})
export class GraphQLResolversModule {}

